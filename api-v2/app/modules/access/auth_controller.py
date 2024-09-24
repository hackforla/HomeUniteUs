import logging
import random
import jwt
import boto3


from fastapi import Depends, APIRouter, HTTPException, Response, Request
from fastapi.security import HTTPBearer
from fastapi.responses import RedirectResponse, JSONResponse
from botocore.exceptions import ClientError

from app.modules.access.schemas import (
    UserCreate, UserSignInRequest, UserSignInResponse, ForgotPasswordRequest, ConfirmForgotPasswordResponse,
    ConfirmForgotPasswordRequest, RefreshTokenResponse, InviteRequest, InviteResponse)

from app.modules.access.crud import create_user, delete_user, get_user
from app.modules.deps import (SettingsDep, DbSessionDep, CognitoIdpDep,
                              SecretHashFuncDep, requires_auth, allow_roles,
                              role_to_cognito_group_map)

router = APIRouter()


# Helper function to set session cookies
def set_session_cookie(response: Response, auth_response: dict):
    refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]
    id_token = auth_response["AuthenticationResult"]["IdToken"]

    response.set_cookie("refresh_token", refresh_token, httponly=True)
    response.set_cookie("id_token", id_token, httponly=True)

@router.get('/signup/confirm')   
def confirm_sign_up(code: str, email: str, settings: SettingsDep, cognito_client: CognitoIdpDep, calc_secret_hash: SecretHashFuncDep):
    secret_hash = calc_secret_hash(email)

    try:
        cognito_client.confirm_sign_up(
            ClientId=settings.COGNITO_CLIENT_ID,
            SecretHash=secret_hash,
            Username=email,
            ConfirmationCode=code
        )

        return RedirectResponse(f"{settings.ROOT_URL}/email-verification-success")
    except Exception as e:
        return RedirectResponse(f"{settings.ROOT_URL}/email-verification-error")

@router.post("/signup", description="Sign up a new user")
def signup(body: UserCreate,
           settings: SettingsDep,
           db: DbSessionDep,
           cognito_client: CognitoIdpDep,
           calc_secret_hash: SecretHashFuncDep) -> JSONResponse:

    # Create user in database
    try:
        user = create_user(db, body)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to create user")
 
    if user is None:
        raise HTTPException(status_code=400, detail="User already exists")

    # Add user to cognito
    try:
        cognito_client.sign_up(
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
        cognito_client.admin_delete_user(
            UserPoolId=settings.COGNITO_USER_POOL_ID,
            Username=user.email
        )
        delete_user(db, user.id)
        raise HTTPException(status_code=400, detail="Failed to confirm user")

    return JSONResponse(content={"message": "User sign up successful"})


@router.post("/signin", description="Sign in a user and start a new session", response_model=UserSignInResponse)
def signin(body: UserSignInRequest,
           response: Response,
           settings: SettingsDep,
           db: DbSessionDep,
           cognito_client: CognitoIdpDep,
           calc_secret_hash: SecretHashFuncDep):
    
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

@router.post(
        "/signout", dependencies=[
        Depends(HTTPBearer()),
        Depends(requires_auth)
    ])
def signout(request: Request, cognito_client: CognitoIdpDep) -> JSONResponse:
    access_token = request.headers.get("Authorization").split(" ")[1]
    

    # Signout user
    response = cognito_client.global_sign_out(
        AccessToken=access_token
    )

    response = JSONResponse(content={"message": "User signed out successfully"})

    # Remove refresh token cookie
    response.delete_cookie("refresh_token")
    response.delete_cookie("id_token")

    # send response
    return response


@router.get("/session", description="Get the current session and user info upon page refresh", response_model=UserSignInResponse)
def current_session(
                    request: Request,
                    settings: SettingsDep,
                    db: DbSessionDep,
                    cognito_client: CognitoIdpDep,
                    calc_secret_hash: SecretHashFuncDep):

    id_token = request.cookies.get('id_token')
    refresh_token = request.cookies.get('refresh_token')

    if None in (refresh_token, id_token):
        raise HTTPException(status_code=401,
                            detail="Missing refresh token or id token")

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    user = get_user(db, decoded_id_token['email'])

    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token,
                # DO NOT CHANGE TO EMAIL. THE REFRESH TOKEN AUTH FLOW REQUIRES the use of the 'cognito:username' instead of email
                'SECRET_HASH': calc_secret_hash(decoded_id_token["cognito:username"])
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


@router.get("/refresh", description="Refresh the current access token during session", response_model=RefreshTokenResponse)
def refresh(request: Request,
            settings: SettingsDep,
            cognito_client: CognitoIdpDep,
            calc_secret_hash: SecretHashFuncDep):
    refresh_token = request.cookies.get('refresh_token')
    id_token = request.cookies.get('id_token')

    if None in (refresh_token, id_token):
        raise HTTPException(status_code=401,
                            detail="Missing refresh token or id token")

    decoded_id_token = jwt.decode(id_token,
                         algorithms=["RS256"],
                         options={"verify_signature": False})

    try:
        response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token,
                # DO NOT CHANGE TO EMAIL. THE REFRESH TOKEN AUTH FLOW REQUIRES the use of the 'cognito:username' instead of email
                'SECRET_HASH': calc_secret_hash(decoded_id_token["cognito:username"])
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


@router.post(
        "/forgot-password", 
        description="Handles forgot password requests by hashing credentials and sending to AWS Cognito", 
        )
def forgot_password(body: ForgotPasswordRequest,
                    settings: SettingsDep,
                    cognito_client: CognitoIdpDep,
                    calc_secret_hash: SecretHashFuncDep) -> JSONResponse:
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

    return JSONResponse(content={"message": "Password reset instructions sent"})


@router.post("/forgot-password/confirm",
             description="Handles forgot password confirmation code requests by receiving the confirmation code and sending to AWS Cognito to verify",
             response_model=ConfirmForgotPasswordResponse)
def confirm_forgot_password(body: ConfirmForgotPasswordRequest,
                            settings: SettingsDep,
                            cognito_client: CognitoIdpDep,
                            calc_secret_hash: SecretHashFuncDep) -> JSONResponse:
 
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

    return {"message": "Password reset successful"}




@router.post("/invite",
             description="Invites a new user to application after creating account with email and temporary password in AWS Cognito",
             response_model=InviteResponse)
def invite(request: InviteRequest, 
           settings: SettingsDep,
           db: DbSessionDep,
           cognito_client: CognitoIdpDep):
    # create temporary password for user 
    numbers = '0123456789'
    lowercase_chars = 'abcdefghijklmnopqrstuvwxyz'
    uppercase_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    symbols = '.-_~'
    temporary_password = ''.join(random.choices(numbers, k=3)) + ''.join(random.choices(lowercase_chars, k=3)) + ''.join(random.choices(symbols, k=1)) + ''.join(random.choices(uppercase_chars, k=3))
    # create the new user in cognito
    try:
        cognito_client.admin_create_user(
            UserPoolId=settings.COGNITO_USER_POOL_ID,
            Username=request.email,
            TemporaryPassword=temporary_password,
            ClientMetadata={
                'url': settings.ROOT_URL
            },
            DesiredDeliveryMediums=["EMAIL"]
        )
    # handle errors
    except ClientError as error:
        if error.response['Error']['Code'] == 'UserNotFoundException':
            raise HTTPException(status_code=400, detail="User not found. Confirmation not sent.")
        else:
            raise HTTPException(status_code=500, detail=error.response['Error']['Message'])
    # if there are no errors create the user in the database
    try:
        # get the cooridinator email from somewhere
        coordinator_email = request.id_token
          
        # create the user in the database
        user = create_user(db, UserCreate(
            email=request.email,
            role=UserRole.GUEST,
            firstName=request.firstName,
            middleName=request.middleName,
            lastName=request.lastName
        ))
        # get the guest id, cooridinator id from database
        guest_id = user.id
        coordinator = get_user(db, coordinator_email)
        if not coordinator:
            raise HTTPException(status_code=400, detail="Coordinator not found")
        coordinator_id = coordinator.id
        # Assuming you have a create_unmatched_case function in your crud module
        create_unmatched_case(db, guest_id=guest_id, coordinator_id=coordinator_id)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))

    return {"message": "Invitation sent successfully"}





@router.post("/confirmInvite",
             description="",
             response_model=None)

def confirm_invite():
    pass




@router.post("/new_password",
             description="",
             response_model=None)
def new_password():
    pass



