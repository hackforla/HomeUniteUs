import logging
import jwt

from fastapi import Depends, APIRouter, HTTPException, Response, Security, Request
from fastapi.responses import RedirectResponse

import app.modules.access.adapters.aim_exceptions as aim_exceptions
from app.modules.access.schemas import (
    UserCreate, UserSignInRequest, UserSignInResponse, ForgotPasswordRequest,
    ForgotPasswordResponse, ConfirmForgotPasswordResponse,
    ConfirmForgotPasswordRequest, RefreshTokenResponse)

from app.modules.access.crud import create_user, get_user
from app.modules.deps import (
    SettingsDep,
    DbSessionDep,
    AimDep,
    requires_auth,
    allow_roles,
    OAuthTokenDep,
)

from fastapi.security import HTTPBearer

logger = logging.Logger(__name__)

router = APIRouter()


# Helper function to set session cookies
def set_session_cookie(response: Response, refresh_token, id_token):

    response.set_cookie("refresh_token", refresh_token)
    response.set_cookie("id_token", id_token)


@router.post("/signup")
def sign_up(user_to_sign_up: UserCreate, settings: SettingsDep,
            db: DbSessionDep, aim: AimDep):
    """Sign-up route.

    This route is used to sign-up a new user.
    """
    try:
        response = aim.sign_up(user_to_sign_up)
    except aim_exceptions.SignUpUserError:
        raise HTTPException(status_code=400, detail="Failed to create user")

    # Create user in database
    user = get_user(db, user_to_sign_up.email)
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    user = create_user(db, user_to_sign_up)

    return response


@router.post("/signin", response_model=UserSignInResponse)
def sign_in(user_sign_in: UserSignInRequest, response: Response,
            settings: SettingsDep, db: DbSessionDep, aim: AimDep):
    """Sign-in route.

    This route is used to sign-in a user and start a new session.
    """
    try:
        result = aim.sign_in(user_sign_in)
    except aim_exceptions.SignInError as e:
        raise HTTPException(status_code=400,
                            detail={
                                "code": e.code,
                                "message": e.message,
                            })

    match result:
        case {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "id_token": id_token
        }:
            user = get_user(db, user_sign_in.email)
            if user is None:
                logger.info(
                    "User signed in but was not found in the database.")
                user = create_user(db, user_sign_in)

            set_session_cookie(response,
                               refresh_token=refresh_token,
                               id_token=id_token)

            sign_in_response = UserSignInResponse(user=user,
                                                  token=access_token)
            return sign_in_response
        case {"redirect": redirect_url}:
            return RedirectResponse(redirect_url)
        case _:
            raise HTTPException(status_code=500, detail="Unable to sign-in")


@router.get(
    "/secret",
    dependencies=[
        Depends(HTTPBearer()),
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
def current_session(request: Request, settings: SettingsDep, db: DbSessionDep,
                    aim: AimDep):
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
    email = decoded_id_token['email']

    user = get_user(db, email)

    try:
        access_token = aim.session(email=email, refresh_token=refresh_token)
    except aim_exceptions.SessionError as e:
        raise HTTPException(status_code=400,
                            detail={
                                "code": e.code,
                                "message": e.message
                            })

    return UserSignInResponse(user=user, token=access_token)


@router.get("/refresh", response_model=RefreshTokenResponse)
def refresh(request: Request, settings: SettingsDep, aim: AimDep):
    """Refresh route.

    This route is used to refresh the current access token during session.
    """
    refresh_token = request.cookies.get('refresh_token')
    id_token = request.cookies.get('id_token')

    if None in (refresh_token, id_token):
        raise HTTPException(status_code=401,
                            detail="Missing refresh token or id token")

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    email = decoded_id_token['email']

    try:
        access_token = aim.refresh(email, refresh_token)
    except aim_exceptions.RefreshError as e:
        raise HTTPException(status_code=400,
                            detail={
                                "code": e.code,
                                "message": e.message
                            })

    # Return access token
    return RefreshTokenResponse(token=access_token)


@router.post("/forgot_password", response_model=ForgotPasswordResponse)
def forgot_password(body: ForgotPasswordRequest, settings: SettingsDep,
                    aim: AimDep):
    """Forgot Password Route.

    This route handles forgot password requests by hashing credentials
    and sending to AWS Cognito.
    """

    try:
        aim.forgot_password(body.email)
    except aim_exceptions.ForgotPasswordError as e:
        raise HTTPException(status_code=401,
                            detail={
                                "code": e.code,
                                "message": e.message
                            })

    return ForgotPasswordResponse(code=200,
                                  type="",
                                  message="Password reset instructions sent")


@router.post("/confirm_forgot_password",
             response_model=ConfirmForgotPasswordResponse)
def confirm_forgot_password(body: ConfirmForgotPasswordRequest,
                            settings: SettingsDep, aim: AimDep):
    """Confirm forgot password route.

    This route handles forgot password confirmation code requests by receiving
    the confirmation code and sending to AWS Cognito to verify.
    """
    try:
        aim.confirm_forgot_password(email=body.email,
                                    confirmation_code=body.code,
                                    password=body.password)
    except aim_exceptions.ConfirmForgotPasswordError as e:
        raise HTTPException(status_code=401,
                            detail={
                                "code": e.code,
                                "message": e.message
                            })

    return ConfirmForgotPasswordResponse(
        message="Password has been reset successfully")
