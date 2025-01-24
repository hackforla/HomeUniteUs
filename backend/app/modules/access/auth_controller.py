import logging
import random
import boto3.session
import jwt
import boto3
import json

from fastapi import Depends, APIRouter, HTTPException, Response, Request, Cookie
from fastapi.security import HTTPBearer
from fastapi.responses import RedirectResponse, JSONResponse
from botocore.exceptions import ClientError, ParamValidationError
import requests
from requests import Response as RequestsResponse
from app.modules.access.schemas import (
    UserCreate, UserSignInRequest, UserSignInResponse, ForgotPasswordRequest, ConfirmForgotPasswordResponse,
    ConfirmForgotPasswordRequest, RefreshTokenResponse, InviteRequest, UserRoleEnum, ConfirmInviteRequest, NewPasswordRequest, AuthCodeSignUpRequest)
from app.modules.workflow.models import ( UnmatchedGuestCase )

from app.modules.access.crud import create_user, create_user_from_schema, delete_user, get_role_by_id, get_user
from app.modules.deps import (SettingsDep, DbSessionDep, CognitoIdpDep,
                              SecretHashFuncDep, requires_auth, allow_roles,
                              role_to_cognito_group_map)

router = APIRouter()


# Helper function to set session cookies
def set_session_cookie(response: Response, auth_response: dict):
    refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]
    id_token = auth_response["AuthenticationResult"]["IdToken"]
    set_session_cookies(
        response=response, 
        refresh_token=refresh_token, 
        id_token=id_token
    )

def set_session_cookies(response: Response, refresh_token: str, id_token: str):
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
        user = create_user_from_schema(db, body)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to create user in database")
 
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
        print(e)
        logging.error(f"Failed to create user in cognito: {e}")
        delete_user(db, user.id)
        raise HTTPException(status_code=400, detail="Failed to create user in cognito")

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

@router.get("/google", description="Use identity provider")
def google(redirect_uri: str, settings: SettingsDep):
    client_id = settings.COGNITO_CLIENT_ID
    root_url = settings.ROOT_URL

    return RedirectResponse(url=f"{settings.COGNITO_ENDPOINT_URL}/oauth2/authorize?client_id={client_id}&response_type=code&scope=email+openid+profile+phone+aws.cognito.signin.user.admin&redirect_uri={root_url}{redirect_uri}&identity_provider=Google")

@router.post("/google/sign_up", description="Sign up a new user with identity provider")
def signup_google(callback_uri: str,
            body: AuthCodeSignUpRequest,
            response: Response,
            settings: SettingsDep,
            db: DbSessionDep,
            cognito_client: CognitoIdpDep,
            calc_secret_hash: SecretHashFuncDep) -> JSONResponse:
    
    logging.error(f'signup_google: calling cognito oauth/token with auth code from google')


    auth_header_maybe = requests.auth.HTTPBasicAuth(
        settings.COGNITO_CLIENT_ID, 
        settings.COGNITO_CLIENT_SECRET
    )
    logging.info(f"signup_google: auth_header_maybe = {auth_header_maybe}")

    # authenticate the user with HUU Cognito using the authcode from Google
    oauth_response: RequestsResponse = requests.post(
        url=f'{settings.COGNITO_ENDPOINT_URL}/oauth2/token',
        auth=auth_header_maybe,
        data={
            'grant_type': 'authorization_code',
            'client_id': settings.COGNITO_CLIENT_ID,
            'code': body.code,
            'redirect_uri': f'{settings.ROOT_URL}{callback_uri}'
        }        
    ).json()

    logging.info(f'signup_google: oauth_response = {json.dumps(oauth_response)}')
    logging.info(f'signup_google: parsing cognito oauth/token response')

    # vars for reference in following user auth/storage operations
    refresh_token = oauth_response.get('refresh_token')
    access_token = oauth_response.get('access_token')
    id_token = oauth_response.get('id_token')

    # get the user from Cognito User Pool using access token
    try:
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-idp/client/get_user.html
        cognito_user = cognito_client.get_user(AccessToken=access_token)
        logging.info(f'signup_google: cognito_user = {json.dumps(cognito_user)}')

    except ClientError as boto_client_error:
        # boto_client_error
        logging.error(f"signup_google: failed to get new Google user from Cognito: {e}")
        raise HTTPException(status_code=400, detail="Failed to load user")

    except Exception as e:
        logging.error(f"signup_google: failed to get new Google user from Cognito: {e}")
        raise HTTPException(status_code=400, detail="Failed to load user")
 
    # a mapping of claim attribute names
    attr_mapping = {
        'email':'email',
        'given_name':'first_name',
        'family_name':'last_name'
    }

    try:
        user_attrs = {
            attr_mapping[attr['Name']]:attr['Value'] 
            for attr in cognito_user['UserAttributes'] 
            if attr['Name'] in attr_mapping.keys()
        }
        logging.info(f'signup_google: parsed new user_attrs: {json.dumps(user_attrs)}')
    except Exception as e:
        logging.error(f"signup_google: failed to select expected cognito user attributes: {e}")
        raise HTTPException(status_code=400, detail="Failed to load user attributes")
    
    user_role = callback_uri.split('/')[2].lower()

    id_token_decoded = jwt.decode(
        id_token, 
        algorithms=["RS256"], 
        options={"verify_signature": False}
    )

    if not user_role:
        try:
            logging.warning(f"signup_google: deleting user with email '{user_attrs['email']}' as this request was missing expected role in callback_uri path: '{callback_uri}'")
            
            # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-idp/client/admin_delete_user.html
            cognito_client.admin_delete_user(
                UserPoolId=settings.COGNITO_USER_POOL_ID,
                Username=id_token_decoded["cognito:username"]
            )
            logging.warning(f"signup_google: deleted user with cognito:username='{id_token_decoded['cognito:username']}' without expected role in callback_uri path: '{callback_uri}'")
            raise HTTPException(status_code=400, detail=f"Failed to complete google signup for user after encountering a missing expected param for 'role' in callback_uri. User has been removed from system")

        except Exception as e:
            logging.error(f"signup_google: encountered error while deleting user '{user_attrs['email']}' without a valid role in callback_uri")
            raise HTTPException(status_code=400, detail="Failed to delete user after encountering a missing expected param for 'role' in callback_uri")
    else:
        logging.info(f"signup_google: parsed user_role '{user_role}' from callback_uri")

    # Add user to group
    try:
        group_name = role_to_cognito_group_map[user_role]
        user_email = user_attrs['email']
        logging.info(f"signup_google: adding user '{user_email}' to cognito group '{group_name}'")
        cognito_client.admin_add_user_to_group(
            UserPoolId=settings.COGNITO_USER_POOL_ID,
            Username=id_token_decoded["cognito:username"],
            GroupName=group_name,
        )
    except Exception as e:
        logging.error(f"Failed to add user '{user_email}' to the '{group_name}' Cognito group: {e}")
        
        cognito_client.admin_delete_user(
            UserPoolId=settings.COGNITO_USER_POOL_ID,
            Username=user_email
        )
        delete_user(db, cognito_user.id)
        raise HTTPException(status_code=400, detail="Failed to confirm user")
    
    try:
        logging.info(f"signup_google: creating user '{user_attrs['email']}' in users table with role '{user_role}'")
        user = create_user(
            db=db,
            email=user_attrs['email'],
            role=user_role,
            firstName=user_attrs['first_name'],
            middleName=user_attrs.get('middle_name', ''),
            lastName=user_attrs.get('last_name', '')
        )
    except Exception as e:
        logging.error(f"Failed to get user with email '{user_email}' from DB: {e}")
        raise HTTPException(status_code=400, detail="Failed to load created user")
    
    logging.info(f"signup_google: setting session cookies for user '{user_attrs['email']}'")
    set_session_cookies(
        response=response,
        refresh_token=refresh_token,
        id_token=id_token
    )

    logging.info(f"signup_google: SUCCESS added user '{user.email}'")
    return JSONResponse(content={
        'token': access_token,
        'refresh_token': refresh_token,
        'id_token': id_token,
        'user': {
            'email': user.email,
            'firstName': user.firstName,
            'middleName': user.middleName,
            'lastName': user.lastName,
            'role': user_role
        }
    })

@router.post("/google/sign_in", description="Sign up a new user with identity provider", response_model=UserSignInResponse)
def signin_google(callback_uri: str,
            body: AuthCodeSignUpRequest,
            settings: SettingsDep,
            db: DbSessionDep,
            cognito_client: CognitoIdpDep,
            calc_secret_hash: SecretHashFuncDep) -> JSONResponse:
    
    oauth_response: RequestsResponse = requests.post(
        url=f'{settings.COGNITO_ENDPOINT_URL}/oauth2/token',
        auth=requests.auth.HTTPBasicAuth(
            settings.COGNITO_CLIENT_ID, 
            settings.COGNITO_CLIENT_SECRET
        ),
        data={
            'grant_type': 'authorization_code',
            'client_id': settings.COGNITO_CLIENT_ID,
            'code': body.code,
            'redirect_uri': f'{settings.ROOT_URL}{callback_uri}'
        }        
    ).json()

    refresh_token = oauth_response.get('refresh_token')
    access_token = oauth_response.get('access_token')
    id_token = oauth_response.get('id_token')


    # Create user in database
    try:
        cognito_user = cognito_client.get_user(AccessToken=access_token)
    except Exception as e:
        logging.error(f"Failed to get user '{body.email}' from Cognito: {e}")
        raise HTTPException(status_code=400, detail="Failed to create user")
 

    attr_mapping = {
        'email':'email',
        'given_name':'email',
        'family_name':'last_name'
    }

    user_attrs = {
        attr_mapping[attr['Name']]:attr['Value'] 
        for attr in cognito_user['UserAttributes'] 
        if attr['Name'] in attr_mapping.keys()
    }

    try:
        user = get_user(db, user_attrs['email'])
    except Exception as e:
        logging.error(f"Failed to get user with email '{user_attrs['email']}' from DB: {e}")

        raise HTTPException(status_code=400, detail="Failed to load existing user")

    try:
        role_name = get_role_by_id(db, user.roleId)
    except Exception as e:
        logging.error(f"Failed to get user with email '{user_attrs['email']}' from DB: {e}")

        raise HTTPException(status_code=400, detail="Failed to load existing user")

    # return {
    #     'token': access_token,
    #     'user': user
    # }

    return JSONResponse(content={
        'token': access_token,
        'refresh_token': refresh_token,
        'id_token': id_token,
        'user': user
    })

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
        "id_token": id_token,
        "refresh_token": refresh_token
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
    return {
        "token": access_token,
        "id_token": id_token,
        "refresh_token": refresh_token,
    }

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
             description="Invites a new user to application after creating a new account with user email and a temporary password in AWS Cognito.",
             )
def invite(body: InviteRequest, 
           request: Request, 
           settings: SettingsDep,
           db: DbSessionDep,
           cognito_client: CognitoIdpDep):
    
    id_token = request.cookies.get('id_token')
    refresh_token = request.cookies.get('refresh_token')

    if None in (refresh_token, id_token):
        raise HTTPException(status_code=401,
                            detail="Missing refresh token or id token")

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    coordinator_email = decoded_id_token.get('email')
    if not coordinator_email:
        raise HTTPException(status_code=401,
                            detail="Missing 'email' field in the decoded ID token.")

    numbers = '0123456789'
    lowercase_chars = 'abcdefghijklmnopqrstuvwxyz'
    uppercase_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    symbols = '.-_~'
    temporary_password = ''.join(random.choices(numbers, k=3)) + ''.join(random.choices(lowercase_chars, k=3)) + ''.join(random.choices(symbols, k=1)) + ''.join(random.choices(uppercase_chars, k=3))

    try:
        cognito_client.admin_create_user(
            UserPoolId=settings.COGNITO_USER_POOL_ID,
            Username=body.email,
            TemporaryPassword=temporary_password,
            ClientMetadata={
                'url': settings.ROOT_URL
            },
            DesiredDeliveryMediums=["EMAIL"]
        )

    except ClientError as error:
        if error.response['Error']['Code'] == 'UserNotFoundException':
            raise HTTPException(status_code=400, detail="User not found. Confirmation not sent.")
        else:
            raise HTTPException(status_code=500, detail=error.response['Error']['Message'])
   
    try:
      
        user = create_user_from_schema(db, UserCreate(
            role=UserRoleEnum.GUEST,
            email=body.email,
            firstName=body.firstName,
            middleName=body.middleName,
            lastName=body.lastName
        ))
        guest_id = user.id
        coordinator = get_user(db, coordinator_email)
        if not coordinator:
            raise HTTPException(status_code=400, detail="Coordinator not found")
        coordinator_id = coordinator.id
        
        unmatched_case_repo = UnmatchedGuestCase(db)
        unmatched_case_repo.add_case(
                guest_id=guest_id,
                coordinator_id=coordinator_id
            )
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))

@router.post("/confirm-invite", description="Confirms user invite by signing them in using the link sent to their email")
def confirm_invite(
    body: ConfirmInviteRequest,
    settings: SettingsDep,
    cognito_client: CognitoIdpDep,
    calc_secret_hash: SecretHashFuncDep
):
    secret_hash = calc_secret_hash(body.email)
    
    try:
        auth_response = cognito_client.initiate_auth(
            ClientId=settings.COGNITO_CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': body.email,
                'PASSWORD': body.password,
                'SECRET_HASH': secret_hash
            }
        )
        
        if auth_response.get('ChallengeName') == 'NEW_PASSWORD_REQUIRED':
            userId = auth_response['ChallengeParameters']['USER_ID_FOR_SRP']
            sessionId = auth_response['Session']
            return RedirectResponse(f"{settings.ROOT_URL}/create-password?userId={userId}&sessionId={sessionId}")
        else:
            return RedirectResponse(f"{settings.ROOT_URL}/create-password?error=There was an unexpected error. Please try again.")

    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_messages = {
            'NotAuthorizedException': "Incorrect username or password. Your invitation link may be invalid.",
            'UserNotFoundException': "User not found. Confirmation not sent.",
            'TooManyRequestsException': "Too many attempts to use invite in a short amount of time."
        }
        msg = error_messages.get(error_code, e.response['Error']['Message'])
        raise HTTPException(status_code=400, detail={"code": error_code, "message": msg})
    except ParamValidationError as e:
        msg = f"The parameters you provided are incorrect: {e}"
        raise HTTPException(status_code=400, detail={"code": "ParamValidationError", "message": msg})

@router.post("/new-password",
             description="Removes auto generated password and replaces with user assigned password. Used for account setup.",
             response_model=UserSignInResponse)
def new_password(
    body: NewPasswordRequest,
    response: Response,
    settings: SettingsDep,
    db: DbSessionDep,
    cognito_client: CognitoIdpDep,
    calc_secret_hash: SecretHashFuncDep
):
  
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
        raise HTTPException(status_code=500, detail={
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
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    response.set_cookie("refresh_token", refresh_token, httponly=True)
    response.set_cookie("id_token", id_token, httponly=True)

    return {
        "user": user,
        "token": access_token,
        "id_token": id_token,
        "refresh_token": refresh_token
    }
