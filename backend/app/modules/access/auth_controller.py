import logging
import random
import jwt
import boto3


from fastapi import Depends, APIRouter, HTTPException, Response, Request, Cookie, status
from fastapi.security import HTTPBearer
from fastapi.responses import RedirectResponse, JSONResponse
from botocore.exceptions import ClientError, ParamValidationError

from app.modules.access.schemas import (
    UserCreate, UserSignInRequest, UserSignInResponse, ForgotPasswordRequest, ConfirmForgotPasswordResponse,
    ConfirmForgotPasswordRequest, RefreshTokenResponse, InviteRequest, UserRoleEnum, ConfirmInviteRequest, NewPasswordRequest, ResendConfirmationCodeRequest)
from app.modules.workflow.models import ( UnmatchedGuestCase )

from app.modules.access.crud import create_user, delete_user, get_user
from app.modules.deps import (SettingsDep, DbSessionDep, CognitoIdpDep,
                              SecretHashFuncDep, requires_auth, allow_roles,
                              role_to_cognito_group_map)

router = APIRouter()
logger = logging.getLogger(__name__)


# Helper function to set session cookies
def set_session_cookie(response: Response, auth_response: dict):
    refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]
    id_token = auth_response["AuthenticationResult"]["IdToken"]

    response.set_cookie("refresh_token", refresh_token, httponly=True)
    response.set_cookie("id_token", id_token, httponly=True)


@router.get('/signup/confirm')   
def confirm_sign_up(
    code: str, 
    email: str, 
    settings: SettingsDep, 
    cognito_client: CognitoIdpDep, 
    calc_secret_hash: SecretHashFuncDep
):
    try:
        cognito_client.confirm_sign_up(
            ClientId=settings.COGNITO_CLIENT_ID,
            SecretHash=calc_secret_hash(email),
            Username=email,
            ConfirmationCode=code
        )
        return RedirectResponse(f"{settings.ROOT_URL}/email-verification-success")
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        logger.error("Failed to confirm signup", extra={
            "error_code": error_code,
            "email": email
        })
        # Add error code to URL for better error messaging on frontend
        return RedirectResponse(
            f"{settings.ROOT_URL}/email-verification-error?code={error_code}"
        )

    except Exception as e:
        logger.error("Unexpected error in confirm signup", extra={
            "error": str(e),
            "email": email
        })
        return RedirectResponse(f"{settings.ROOT_URL}/email-verification-error")


@router.post("/resend_confirmation_code", description="Resend the signup confirmation code to user's email")
def resend_confirmation_code(
   body: ResendConfirmationCodeRequest,
   settings: SettingsDep,
   cognito_client: CognitoIdpDep,
   calc_secret_hash: SecretHashFuncDep
) -> JSONResponse:
   
   try:
       try:
           cognito_client.admin_get_user(
               UserPoolId=settings.COGNITO_USER_POOL_ID,
               Username=body.email
           )
       except ClientError as e:
           if e.response['Error']['Code'] == 'UserNotFoundException':
               logger.error(f"User not found in Cognito: {body.email}")
               raise HTTPException(
                   status_code=status.HTTP_404_NOT_FOUND,
                   detail={
                       "code": "AUTH002",
                       "message": "User not found"
                   }
               )
           raise e
       
       response = cognito_client.resend_confirmation_code(
           ClientId=settings.COGNITO_CLIENT_ID,
           SecretHash=calc_secret_hash(body.email),
           Username=body.email,
           ClientMetadata={"url": settings.ROOT_URL}
       )
       
       return JSONResponse(
           content={"message": "Confirmation code has been resent to your email"}
       )
       
   except ClientError as e:
       error_code = e.response['Error']['Code']
       error_message = e.response['Error']['Message']
       
       if error_code == "LimitExceededException":
           logger.warning(f"Rate limit exceeded for: {body.email}")
           raise HTTPException(
               status_code=status.HTTP_400_BAD_REQUEST,
               detail={
                   "code": "AUTH008",
                   "message": "Too many attempts. Please try again later"
               }
           )
       elif error_code == "InvalidParameterException":
           logger.error(f"Invalid email format: {body.email}")
           raise HTTPException(
               status_code=status.HTTP_400_BAD_REQUEST,
               detail={
                   "code": "AUTH009", 
                   "message": "Invalid email format"
               }
           )
       else:
           logger.error(f"Unexpected Cognito error: {error_code} - {error_message}")
           raise HTTPException(
               status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
               detail={
                   "code": "AUTH999",
                   "message": "An unexpected error occurred"
               }
           )


@router.post("/signup")
def signup(body: UserCreate,
           settings: SettingsDep,
           db: DbSessionDep,
           cognito_client: CognitoIdpDep,
           calc_secret_hash: SecretHashFuncDep) -> JSONResponse:

    # First check if user exists in database
    existing_user = get_user(db, body.email)
    if existing_user:
        logger.error(f"Signup failed - user already exists in database: {body.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "USER_EXISTS",
                "message": "An account with this email already exists"
            }
        )

    # Create user in database
    try:
        user = create_user(db, body)

    except Exception as e:
        logger.error("Failed to create user in database", extra={
            "error": str(e)
        })
        raise HTTPException(status_code=400, detail="Failed to create user")

    # Add user to cognito
    try:
        signup_response = cognito_client.sign_up(  
            ClientId=settings.COGNITO_CLIENT_ID,
            SecretHash=calc_secret_hash(body.email),
            Username=user.email,
            Password=body.password,
            ClientMetadata={"url": settings.ROOT_URL},
        )
        
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        error_message = e.response.get("Error", {}).get("Message")
        logger.error("Cognito signup failed", extra={
            "error_code": error_code,
            "error_message": error_message
        })
        
        delete_user(db, user.id)
        raise HTTPException(status_code=400, detail=f"Failed to create user: {error_message}")
        
    except Exception as e:
        logger.error("Unexpected error during Cognito signup", extra={
            "error": str(e)
        })
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
        logger.error("Failed to add user to group", extra={
            "error": str(e),
            "group": role_to_cognito_group_map[body.role]
        })
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

        if "AuthenticationResult" not in auth_response or "AccessToken" not in auth_response["AuthenticationResult"]:
            logger.error(f"Unexpected auth response structure: {auth_response}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "code": "AUTH007",
                    "message": "Invalid authentication response"
                }
            )
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        error_message = e.response["Error"]["Message"]

        logger.error("Authentication failed", extra={
            "error_code": error_code,
            "user_email": body.email
        })

        if error_code == "NotAuthorizedException":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "code": "AUTH001",
                    "message": "You may have entered an invalid email or password",
                }
            )
        elif error_code == "UserNotFoundException":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "code": "AUTH002",
                    "message": "User not found",
                }
            )
        elif error_code == "UserNotConfirmedException":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "AUTH003",
                    "message": "Please verify your email first",
                }
            )
        else:
            logger.error(f"Unexpected Cognito error: {error_code} - {error_message}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "code": "AUTH999",
                    "message": "An unexpected authentication error occurred",
                }
            )

    if (auth_response.get("ChallengeName")
            and auth_response["ChallengeName"] == "NEW_PASSWORD_REQUIRED"):
        try:
            userId = auth_response["ChallengeParameters"]["USER_ID_FOR_SRP"]
            sessionId = auth_response["Session"]
            root_url = settings.ROOT_URL
            return RedirectResponse(
                f"{root_url}/create-password?userId={userId}&sessionId={sessionId}"
            )
        except KeyError as e:
            logger.error(f"Missing expected challenge parameter: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "code": "AUTH004",
                    "message": "Error processing password change request"
                }
            ) 
    try:
        user = get_user(db, body.email)
        if user is None:
            logger.error("User found in Cognito but not in database", extra={
            "user_email": body.email
            })
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "code": "AUTH005",
                    "message": "User not found in database"
                }
            )

        set_session_cookie(response, auth_response)

        return {
            "user": user,
            "token": auth_response["AuthenticationResult"]["AccessToken"],
        }
    except Exception as e:
        logger.error("Database error during user lookup", extra={
            "error": str(e),
            "user_email": body.email
        })
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "AUTH006",
                "message": "Error retrieving user information"
            }
        )
   

@router.post(
    "/signout", 
    dependencies=[
        Depends(HTTPBearer()),
        Depends(requires_auth)
    ]
)
def signout(request: Request, cognito_client: CognitoIdpDep) -> JSONResponse:
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            logger.error("Missing Authorization header during signout")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "code": "AUTH001",
                    "message": "Missing authorization"
                }
            )

        access_token = auth_header.split(" ")[1]

        try:
            cognito_client.global_sign_out(
                AccessToken=access_token
            )
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error("Cognito signout failed", extra={
                "error_code": error_code,
                "error_message": e.response["Error"]["Message"]
            })
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": error_code,
                    "message": "Sign out failed"
                }
            )

        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "User signed out successfully"}
        )
        response.delete_cookie("refresh_token")
        response.delete_cookie("id_token")

        return response

    except Exception as e:
        if not isinstance(e, HTTPException):
            logger.error(f"Unexpected error during signout: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "code": "AUTH999",
                    "message": "An unexpected error occurred during sign out"
                }
            )
        raise e


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
        logger.error("Session refresh failed", extra={
            "reason": "Missing tokens",
            "has_id_token": id_token is not None,
            "has_refresh_token": refresh_token is not None
        })
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
        logger.error("Token refresh failed", extra={
            "error_code": code,
            "error_message": message,
            "username": decoded_id_token.get("cognito:username")
        })
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
        logger.error("Token refresh failed", extra={
            "reason": "Missing tokens",
            "has_refresh_token": refresh_token is not None,
            "has_id_token": id_token is not None
        })
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
        logger.error("Token refresh failed", extra={
            "error_code": code,
            "error_message": message,
            "username": decoded_id_token.get("cognito:username")
        })
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
        logger.error("Forgot password request failed", extra={
            "error_code": code,
            "error_message": message
        })
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
        logger.error("Password reset confirmation failed", extra={
            "error_code": code,
            "error_message": message
        })
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
        logger.error("Invite request failed", extra={
            "reason": "Missing tokens",
            "has_refresh_token": refresh_token is not None,
            "has_id_token": id_token is not None
        })
        raise HTTPException(status_code=401,
                            detail="Missing refresh token or id token")

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    coordinator_email = decoded_id_token.get('email')
    if not coordinator_email:
        logger.error("Invite request failed", extra={
            "reason": "Missing email in decoded token"
        })
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
        error_code = error.response['Error']['Code']
        error_message = error.response['Error']['Message']

        logger.error("Failed to create user in Cognito", extra={
            "error_code": error_code,
            "error_message": error_message,
            "invited_by": coordinator_email
        })

        if error_code == 'UserNotFoundException':
            raise HTTPException(status_code=400, detail="User not found. Confirmation not sent.")
        else:
            raise HTTPException(status_code=500, detail=error_message)
   
    try:
      
        user = create_user(db, UserCreate(
            role=UserRoleEnum.GUEST,
            email=body.email,
            firstName=body.firstName,
            middleName=body.middleName,
            lastName=body.lastName
        ))
        guest_id = user.id
        coordinator = get_user(db, coordinator_email)
        if not coordinator:
            logger.error("Coordinator not found", extra={
                "coordinator_email": coordinator_email
            })
            raise HTTPException(status_code=400, detail="Coordinator not found")
        coordinator_id = coordinator.id
        
        unmatched_case_repo = UnmatchedGuestCase(db)
        unmatched_case_repo.add_case(
                guest_id=guest_id,
                coordinator_id=coordinator_id
            )
    except Exception as error:
        logger.error("Failed to complete invite process", extra={
            "error": str(error),
            "invited_by": coordinator_email
        })
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
            logger.error("Unexpected error during invite confirmation")
            return RedirectResponse(f"{settings.ROOT_URL}/create-password?error=There was an unexpected error. Please try again.")

    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_messages = {
            'NotAuthorizedException': "Incorrect username or password. Your invitation link may be invalid.",
            'UserNotFoundException': "User not found. Confirmation not sent.",
            'TooManyRequestsException': "Too many attempts to use invite in a short amount of time."
        }
        msg = error_messages.get(error_code, e.response['Error']['Message'])

        logger.error("Invite confirmation failed", extra={
            "error_code": error_code,
            "error_message": msg
        })
        raise HTTPException(status_code=400, detail={"code": error_code, "message": msg})
    except ParamValidationError as e:
        error_msg = f"The parameters you provided are incorrect: {e}"

        logger.error("Parameter validation failed during invite confirmation", extra={
            "error_message": error_msg
        })

        raise HTTPException(status_code=400, detail={"code": "ParamValidationError", "message": error_msg})



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
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']

        logger.error("Failed to respond to password change challenge", extra={
            "error_code": error_code,
            "error_message": error_message
        })

        raise HTTPException(status_code=500, detail={
            "code": error_code,
            "message": error_message
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
            logger.error("User not found in database after password change")
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error("Database error during user lookup", extra={
            "error": str(e)
        })
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    response.set_cookie("refresh_token", refresh_token, httponly=True)
    response.set_cookie("id_token", id_token, httponly=True)

    return {
        "user": user,
        "token": access_token
    }



