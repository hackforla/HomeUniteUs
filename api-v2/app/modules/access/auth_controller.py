import logging
import jwt
import boto3

from fastapi import Depends, APIRouter, HTTPException, Response, Security, Request
from fastapi.responses import RedirectResponse
from botocore.exceptions import ClientError

from app.modules.access.schemas import (
    UserCreate, UserSignInRequest, UserSignInResponse, ForgotPasswordRequest,
    ForgotPasswordResponse, ConfirmForgotPasswordResponse,
    ConfirmForgotPasswordRequest, RefreshTokenResponse)

from app.modules.access.crud import create_user, delete_user, get_user
from app.modules.deps import (SettingsDep, DbSessionDep, CognitoIdpDep,
                              SecretHashFuncDep, requires_auth, allow_roles,
                              role_to_cognito_group_map)

router = APIRouter()


# Helper function to set session cookies
def set_session_cookie(response: Response, auth_response: dict):
    refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]
    id_token = auth_response["AuthenticationResult"]["IdToken"]

    response.set_cookie("refresh_token", refresh_token)
    response.set_cookie("id_token", id_token)

@router.get('/signup/confirm')   
def confirm_sign_up(code: str, username: str, client_id: str, email: str, settings: SettingsDep, cognito_client: CognitoIdpDep, calc_secret_hash: SecretHashFuncDep):
    secret_hash = calc_secret_hash(email)

    try:
        cognito_client.confirm_sign_up(
            ClientId=client_id,
            SecretHash=secret_hash,
            Username=email,
            ConfirmationCode=code
        )

        return RedirectResponse(f"{settings.ROOT_URL}/email-verification-success")
    except Exception as e:
        return RedirectResponse(f"{settings.ROOT_URL}/email-verification-error")

@router.post("/signup")
def signup(body: UserCreate,
           settings: SettingsDep,
           db: DbSessionDep,
           cognito_client: CognitoIdpDep,
           calc_secret_hash: SecretHashFuncDep):
    
    """Sign up route.

    This route is used to Sign up a new user.
    """
    # Create user in database
    try:
        user = create_user(db, body)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to create user")
 
    if user is None:
        raise HTTPException(status_code=400, detail="User already exists")

    # Add user to cognito
    try:
        response = cognito_client.sign_up(
            ClientId=settings.COGNITO_CLIENT_ID,
            SecretHash=calc_secret_hash(body.email),
            Username=user.email,
            Password=body.password,
            ClientMetadata={"url": settings.ROOT_URL},
        )
    except Exception as e:
        logging.error(f"Failed to create user: {e}")
        delete_user(db, user.id)
        raise HTTPException(status_code=400, detail="Failed to create user")

    # Add user to group
    try:
        cognito_client.admin_add_user_to_group(
            UserPoolId=settings.COGNITO_USER_POOL_ID,
            Username=user.email,
            GroupName=role_to_cognito_group_map[body.role],
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to confirm user")

    return response


@router.post("/signin", response_model=UserSignInResponse)
def signin(body: UserSignInRequest,
           response: Response,
           settings: SettingsDep,
           db: DbSessionDep,
           cognito_client: CognitoIdpDep,
           calc_secret_hash: SecretHashFuncDep):
    """Sign in route.

    This route is used to sign in a user and start a new session.
    """
    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": body.email,
                "PASSWORD": body.password,
                "SECRET_HASH": calc_secret_hash(body.email),
            },
        )
    except ClientError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "code": e.response["Error"]["Code"],
                "message": e.response["Error"]["Message"],
            },
        )

    if (auth_response.get("ChallengeName")
            and auth_response["ChallengeName"] == "NEW_PASSWORD_REQUIRED"):
        userId = auth_response["ChallengeParameters"]["USER_ID_FOR_SRP"]
        sessionId = auth_response["Session"]
        root_url = settings.ROOT_URL
        return RedirectResponse(
            f"{root_url}/create-password?userId={userId}&sessionId={sessionId}"
        )

    user = get_user(db, body.email)
    if user is None:
        raise HTTPException(status_code=400, detail="User not found")

    set_session_cookie(response, auth_response)

    return {
        "user": user,
        "token": auth_response["AuthenticationResult"]["AccessToken"],
    }

# @router.get(
#         "/signout", dependencies=[
#         Depends(requires_auth)
#     ])
# def signout(response: Response, cognito_client: CognitoIdpDep):
    
    

#     # Signout user
#     response = cognito_client.global_sign_out(
#         AccessToken=access_token
#     )

#     # Remove refresh token cookie
#     session.pop('refresh_token', None)

#     # send response
#     return response


@router.get(
    "/secret",
    dependencies=[
        Depends(requires_auth),
        Security(allow_roles, scopes=["guest"]),
    ],
)
def secret():
    """Secret route.

    This route is a secret route that requires authentication and the guest role.
    """
    return {"message": "Welcome to the secret route"}


@router.get("/session", response_model=UserSignInResponse)
def current_session(request: Request,
                    settings: SettingsDep,
                    db: DbSessionDep,
                    cognito_client: CognitoIdpDep,
                    calc_secret_hash: SecretHashFuncDep):
    """Current session route.

    This route is used to get the current session and user info upon page refresh.
    """
    id_token = request.cookies.get('id_token')
    refresh_token = request.cookies.get('refresh_token')
    if None in (id_token, refresh_token):
        raise HTTPException(status_code=401, detail="Missing session cookies")

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    user = get_user(db, decoded_id_token['email'])

    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN':
                refresh_token,
                'SECRET_HASH':
                calc_secret_hash(decoded_id_token["email"])
            })
    except ClientError as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise HTTPException(status_code=400,
                            detail={
                                "code": code,
                                "message": message
                            })

    return {
        "user": user,
        "token": auth_response['AuthenticationResult']['AccessToken'],
    }


@router.get("/refresh", response_model=RefreshTokenResponse)
def refresh(request: Request,
            settings: SettingsDep,
            cognito_client: CognitoIdpDep,
            calc_secret_hash: SecretHashFuncDep):
    """Refresh route.

    This route is used to refresh the current access token during session.
    """
    refresh_token = request.cookies.get('refresh_token')
    id_token = request.cookies.get('id_token')

    if None in (refresh_token, id_token):
        raise HTTPException(status_code=401,
                            detail="Missing refresh token or id token")

    decoded = jwt.decode(id_token,
                         algorithms=["RS256"],
                         options={"verify_signature": False})

    try:
        response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token,
                'SECRET_HASH': calc_secret_hash(decoded["email"])
            })
    except ClientError as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise HTTPException(status_code=400,
                            detail={
                                "code": code,
                                "message": message
                            })

    access_token = response['AuthenticationResult']['AccessToken']

    # Return access token
    return {"token": access_token}


@router.post("/forgot_password", response_model=ForgotPasswordResponse)
def forgot_password(body: ForgotPasswordRequest,
                    settings: SettingsDep,
                    cognito_client: CognitoIdpDep,
                    calc_secret_hash: SecretHashFuncDep):
    """Forgot Password Route.

    This route handles forgot password requests by hashing credentials
    and sending to AWS Cognito.
    """
    secret_hash = calc_secret_hash(body.email)

    try:
        cognito_client.forgot_password(ClientId=settings.COGNITO_CLIENT_ID,
                                       SecretHash=secret_hash,
                                       Username=body.email)
    except boto3.exceptions.Boto3Error as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise HTTPException(status_code=401,
                            detail={
                                "code": code,
                                "message": message
                            })

    return {"message": "Password reset instructions sent"}


@router.post("/confirm_forgot_password",
             response_model=ConfirmForgotPasswordResponse)
def confirm_forgot_password(body: ConfirmForgotPasswordRequest,
                            settings: SettingsDep,
                            cognito_client: CognitoIdpDep,
                            calc_secret_hash: SecretHashFuncDep):
    """Confirm forgot password route.

    This route handles forgot password confirmation code requests by receiving
    the confirmation code and sending to AWS Cognito to verify.
    """
    secret_hash = calc_secret_hash(body.email)

    try:
        cognito_client.confirm_forgot_password(
            ClientId=settings.COGNITO_CLIENT_ID,
            SecretHash=secret_hash,
            Username=body.email,
            ConfirmationCode=body.code,
            Password=body.password)
    except boto3.exceptions.Boto3Error as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise HTTPException(status_code=401,
                            detail={
                                "code": code,
                                "message": message
                            })

    return {"message": "Password has been reset successfully"}
