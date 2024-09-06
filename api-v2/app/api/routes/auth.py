import logging
import jwt

from fastapi import Depends, APIRouter, HTTPException, Response, Security, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from botocore.exceptions import ClientError


from schemas import UserCreate, UserSignInRequest, UserSignInResponse, RefreshTokenResponse, User
from crud import create_user, delete_user, get_user
from api.deps import (
    get_db,
    get_cognito_client,
    requires_auth,
    allow_roles,
    role_to_cognito_group_map,
)

from utils import calc_secret_hash
from core.config import settings

router = APIRouter()

cognito_client_id = settings.COGNITO_CLIENT_ID
root_url = settings.ROOT_URL


# Helper function to set session cookies
def set_session_cookie(response: Response, auth_response: dict):
    refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]
    id_token = auth_response["AuthenticationResult"]["IdToken"]

    response.set_cookie("refresh_token", refresh_token)
    response.set_cookie("id_token", id_token)


"""
# Sign up route

This route is used to Sign up a new user
"""


@router.post("/signup")
def signup(
    body: UserCreate,
    db: Session = Depends(get_db),
    cognito_client=Depends(get_cognito_client),
):
    # Create user in database
    user = create_user(db, body)
    if user is None:
        raise HTTPException(status_code=400, detail="User already exists")

    # Add user to cognito
    try:
        response = cognito_client.sign_up(
            ClientId=cognito_client_id,
            SecretHash=calc_secret_hash(body.email),
            Username=user.email,
            Password=body.password,
            ClientMetadata={"url": root_url},
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
        print(e)
        raise HTTPException(status_code=400, detail="Failed to confirm user")

    return response


"""
# Sign in route

This route is used to sign in a user and start a new session
"""


@router.post(
    "/signin",
    response_model=UserSignInResponse,
)
def signin(
    body: UserSignInRequest,
    response: Response,
    db: Session = Depends(get_db),
    cognito_client=Depends(get_cognito_client),
):
    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=cognito_client_id,
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

    if (
        auth_response.get("ChallengeName")
        and auth_response["ChallengeName"] == "NEW_PASSWORD_REQUIRED"
    ):
        userId = auth_response["ChallengeParameters"]["USER_ID_FOR_SRP"]
        sessionId = auth_response["Session"]
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


"""
# Secret route

This route is a secret route that requires authentication and the guest role
"""


@router.get(
    "/secret",
    dependencies=[
        Depends(requires_auth),
        Security(allow_roles, scopes=["guest"]),
    ],
)
def secret():
    return {"message": "Welcome to the secret route"}


'''
# Current session route

This route is used to get the current session and user info upon page refresh
'''


@router.get("/session", response_model=UserSignInResponse)
def current_session(request: Request, cognito_client=Depends(get_cognito_client), db: Session = Depends(get_db)):
    id_token = request.cookies.get('id_token')
    refresh_token = request.cookies.get('refresh_token')
    if None in (id_token, refresh_token):
        raise HTTPException(status_code=401, detail="Missing session cookies")
    
    decoded_id_token = jwt.decode(
        id_token, algorithms=["RS256"], options={"verify_signature": False}
    )

    user = get_user(db, decoded_id_token['email'])

    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=cognito_client_id,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token,
                'SECRET_HASH': calc_secret_hash(decoded_id_token["cognito:username"])
            }
        )
    except ClientError as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise HTTPException(status_code=400, detail={"code": code, "message": message})

    return {
        "user": user,
        "token": auth_response['AuthenticationResult']['AccessToken'],
    }


'''
# Refresh route

This route is used to refresh the current access token during session
'''


@router.get("/refresh", response_model=RefreshTokenResponse)
def refresh(request: Request, cognito_client=Depends(get_cognito_client)):
    refresh_token = request.cookies.get('refresh_token')
    id_token = request.cookies.get('id_token')

    if None in (refresh_token, id_token):
        raise HTTPException(status_code=401, detail="Missing refresh token or id token")

    decoded = jwt.decode(id_token, algorithms=["RS256"], options={"verify_signature": False})

    try:
        response = cognito_client.initiate_auth(
            ClientId=cognito_client_id,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token,
                'SECRET_HASH': calc_secret_hash(decoded["cognito:username"])
            }
        )
    except ClientError as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise HTTPException(status_code=400, detail={"code": code, "message": message})

    access_token = response['AuthenticationResult']['AccessToken']

    # Return access token
    return {
      "token": access_token
    }

