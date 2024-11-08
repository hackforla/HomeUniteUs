from datetime import datetime, timezone
import logging
import jwt
import boto3
from typing import Annotated

from fastapi import Depends, APIRouter, HTTPException, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse, JSONResponse
from botocore.exceptions import ClientError, ParamValidationError

from app.modules.access.schemas import (
    UserCreate, UserSignInResponse, ForgotPasswordRequest,
    ConfirmForgotPasswordResponse, ConfirmForgotPasswordRequest,
    RefreshTokenResponse, InviteRequest, InviteResponse, UserRoleEnum,
    ConfirmInviteRequest, NewPasswordRequest)
# from app.modules.workflow.models import (UnmatchedGuestCase)

from app.modules.access.crud import create_user, delete_user, get_user
from app.modules.deps import (SettingsDep, DbSessionDep, CognitoIdpDep,
                              SecretHashFuncDep, CoordinatorDep,
                              requires_auth, allow_roles,
                              role_to_cognito_group_map)

from app.modules.access.models import EmailAddress
from app.modules.access.invite.contracts import SendInviteCommand, InviteAlreadySentException, NotInvitedException
import app.core.message_bus as message_bus

router = APIRouter()


# Helper function to set session cookies
def set_session_cookie(response: Response, auth_response: dict):
    refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]
    id_token = auth_response["AuthenticationResult"]["IdToken"]

    response.set_cookie("refresh_token", refresh_token, httponly=True)
    response.set_cookie("id_token", id_token, httponly=True)


@router.get('/signup/confirm')
def confirm_sign_up(code: str, email: str, settings: SettingsDep,
                    cognito_client: CognitoIdpDep,
                    calc_secret_hash: SecretHashFuncDep):
    secret_hash = calc_secret_hash(email)

    try:
        cognito_client.confirm_sign_up(ClientId=settings.COGNITO_CLIENT_ID,
                                       SecretHash=secret_hash,
                                       Username=email,
                                       ConfirmationCode=code)

        return RedirectResponse(
            f"{settings.ROOT_URL}/email-verification-success")
    except Exception as e:
        return RedirectResponse(
            f"{settings.ROOT_URL}/email-verification-error")


@router.post("/signup", description="Sign up a new user")
def signup(body: UserCreate, settings: SettingsDep, db: DbSessionDep,
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
            UserPoolId=settings.COGNITO_USER_POOL_ID, Username=user.email)
        delete_user(db, user.id)
        raise HTTPException(status_code=400, detail="Failed to confirm user")

    return JSONResponse(content={"message": "User sign up successful"})


@router.post("/signin",
             description="Sign in a user and start a new session",
             response_model=UserSignInResponse)
async def signin(form_data: Annotated[OAuth2PasswordRequestForm,
                                      Depends()], response: Response,
                 settings: SettingsDep, db: DbSessionDep,
                 cognito_client: CognitoIdpDep,
                 calc_secret_hash: SecretHashFuncDep):

    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": form_data.username,
                "PASSWORD": form_data.password,
                "SECRET_HASH": calc_secret_hash(form_data.username),
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

    user = get_user(db, EmailAddress(form_data.username))
    if user is None:
        raise HTTPException(status_code=400, detail="User not found")

    set_session_cookie(response, auth_response)

    return UserSignInResponse(
        user=user,
        access_token=auth_response["AuthenticationResult"]["AccessToken"],
        id_token=auth_response["AuthenticationResult"]["IdToken"],
        token_type="bearer")


@router.post("/signout", dependencies=[Depends(requires_auth)])
def signout(request: Request, cognito_client: CognitoIdpDep) -> JSONResponse:
    access_token = request.headers.get("Authorization").split(" ")[1]

    # Signout user
    response = cognito_client.global_sign_out(AccessToken=access_token)

    response = JSONResponse(
        content={"message": "User signed out successfully"})

    # Remove refresh token cookie
    response.delete_cookie("refresh_token")
    response.delete_cookie("id_token")

    # send response
    return response


@router.get(
    "/session",
    description="Get the current session and user info upon page refresh",
    response_model=UserSignInResponse)
def current_session(request: Request, settings: SettingsDep, db: DbSessionDep,
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
                'REFRESH_TOKEN':
                refresh_token,
                # DO NOT CHANGE TO EMAIL. THE REFRESH TOKEN AUTH FLOW REQUIRES the use of the 'cognito:username' instead of email
                'SECRET_HASH':
                calc_secret_hash(decoded_id_token["cognito:username"])
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


@router.get("/refresh",
            description="Refresh the current access token during session",
            response_model=RefreshTokenResponse)
def refresh(request: Request, settings: SettingsDep,
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
                'REFRESH_TOKEN':
                refresh_token,
                # DO NOT CHANGE TO EMAIL. THE REFRESH TOKEN AUTH FLOW REQUIRES the use of the 'cognito:username' instead of email
                'SECRET_HASH':
                calc_secret_hash(decoded_id_token["cognito:username"])
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
    description=
    "Handles forgot password requests by hashing credentials and sending to AWS Cognito",
)
def forgot_password(body: ForgotPasswordRequest, settings: SettingsDep,
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

    return JSONResponse(
        content={"message": "Password reset instructions sent"})


@router.post(
    "/forgot-password/confirm",
    description=
    "Handles forgot password confirmation code requests by receiving the confirmation code and sending to AWS Cognito to verify",
    response_model=ConfirmForgotPasswordResponse)
def confirm_forgot_password(
        body: ConfirmForgotPasswordRequest, settings: SettingsDep,
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


@router.post(
    "/invite",
    status_code=202,
    description="Invites a new user to join HUU.",
)
def invite(invite_request: InviteRequest, coordinator: CoordinatorDep) -> InviteResponse:
    """Invite a new user to join HUU."""
    inviter = coordinator

    cmd = SendInviteCommand(first_name=invite_request.firstName,
                            middle_name=invite_request.middleName,
                            last_name=invite_request.lastName,
                            email=EmailAddress(invite_request.email),
                            invitee_role=invite_request.role,
                            inviter_id=inviter.user_id,
                            inviter_role=UserRoleEnum.COORDINATOR,
                            requested_at=datetime.now(timezone.utc))

    try:
        message_bus.handle(cmd)
        return InviteResponse(message="Invite accepted.", status="In Progress")
    except InviteAlreadySentException:
        raise HTTPException(status_code=409, detail="Invite already sent.")


@router.post(
    "/confirm-invite",
    description=
    "Confirms user invite by signing them in using the link sent to their email"
)
def confirm_invite(body: ConfirmInviteRequest, settings: SettingsDep,
                   cognito_client: CognitoIdpDep,
                   calc_secret_hash: SecretHashFuncDep):
    """Confirm user invite by signing them in using the link sent to their email."""
    secret_hash = calc_secret_hash(body.email)

    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': body.email,
                'PASSWORD': body.password,
                'SECRET_HASH': secret_hash
            })

        if auth_response.get('ChallengeName') == 'NEW_PASSWORD_REQUIRED':
            userId = auth_response['ChallengeParameters']['USER_ID_FOR_SRP']
            sessionId = auth_response['Session']
            return RedirectResponse(
                f"{settings.ROOT_URL}/create-password?userId={userId}&sessionId={sessionId}"
            )
        else:
            return RedirectResponse(
                f"{settings.ROOT_URL}/create-password?error=There was an unexpected error. Please try again."
            )

    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_messages = {
            'NotAuthorizedException':
            "Incorrect username or password. Your invitation link may be invalid.",
            'UserNotFoundException':
            "User not found. Confirmation not sent.",
            'TooManyRequestsException':
            "Too many attempts to use invite in a short amount of time."
        }
        msg = error_messages.get(error_code, e.response['Error']['Message'])
        raise HTTPException(status_code=400,
                            detail={
                                "code": error_code,
                                "message": msg
                            })
    except ParamValidationError as e:
        msg = f"The parameters you provided are incorrect: {e}"
        raise HTTPException(status_code=400,
                            detail={
                                "code": "ParamValidationError",
                                "message": msg
                            })


@router.post(
    "/new-password",
    description=
    "Removes auto generated password and replaces with user assigned password. Used for account setup.",
    response_model=UserSignInResponse)
def new_password(body: NewPasswordRequest, response: Response,
                 settings: SettingsDep, db: DbSessionDep,
                 cognito_client: CognitoIdpDep,
                 calc_secret_hash: SecretHashFuncDep):

    secret_hash = calc_secret_hash(body.userId)

    try:
        auth_response = cognito_client.respond_to_auth_challenge(
            ClientId=settings.COGNITO_CLIENT_ID,
            ChallengeName='NEW_PASSWORD_REQUIRED',
            Session=body.sessionId,
            ChallengeResponses={
                'NEW_PASSWORD': body.password,
                'USERNAME': body.userId,
                'SECRET_HASH': secret_hash
            },
        )
    except ClientError as e:
        raise HTTPException(status_code=500,
                            detail={
                                "code": e.response['Error']['Code'],
                                "message": e.response['Error']['Message']
                            })

    access_token = auth_response['AuthenticationResult']['AccessToken']
    refresh_token = auth_response['AuthenticationResult']['RefreshToken']
    id_token = auth_response['AuthenticationResult']['IdToken']

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    try:
        user = get_user(db, decoded_id_token['email'])
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"Database error: {str(e)}")

    response.set_cookie("refresh_token", refresh_token, httponly=True)
    response.set_cookie("id_token", id_token, httponly=True)

    return {"user": user, "token": access_token}
