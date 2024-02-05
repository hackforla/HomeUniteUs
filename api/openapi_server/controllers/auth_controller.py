import connexion
import botocore
import requests

from flask import (
    redirect, 
    request, 
    session, 
    current_app # type: openapi_server.app.HUUFlaskApp
)
from openapi_server.exceptions import AuthError
from openapi_server.models.database import DataAccessLayer, User
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from botocore.exceptions import ClientError

cognito_client_url = 'https://homeuniteus.auth.us-east-1.amazoncognito.com'

# Get user attributes from Cognito response
def get_user_attr(user_data):
    email = None
    for attribute in user_data['UserAttributes']:
        if attribute['Name'] == 'email':
            email = attribute['Value']
            break

    return {
      'email': email
    }

# Get auth token from header
def get_token_auth_header():
    auth = request.headers.get('Authorization', None)
    if not auth:
        raise AuthError({
        'code': 'authorization_header_missing',
        'message': 'Authorization header is expected.'
        }, 401)
    
    parts = auth.split()

    # check if the header is in the correct format
    if parts[0].lower() != 'bearer':
        raise AuthError({
        'code': 'invalid_header',
        'message': 'Authorization header must start with "Bearer".'
        }, 401)
    
    if len(parts) == 1:
            raise AuthError({"code": "invalid_header",
                            "message": "Token not found"}, 401)
    if len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                            "message":
                                "Authorization header must be"
                                " Bearer token"}, 401)
    # return token
    token = parts[1]
    return token

def signUpHost(body: dict):
    """Signup a new Host"""
    secret_hash = current_app.calc_secret_hash(body['email'])

    with DataAccessLayer.session() as session:
        user = User(email=body['email'])
        session.add(user)
        try:
            session.commit()
        except IntegrityError:
            session.rollback()
            raise AuthError({
                "message": "A user with this email already exists."
            }, 422)

    try:
        response = current_app.boto_client.sign_up(
          ClientId=current_app.config['COGNITO_CLIENT_ID'],
          SecretHash=secret_hash,
          Username=body['email'],
          Password=body['password'],
          ClientMetadata={
              'url': current_app.root_url
          }
        )

        return response

    except botocore.exceptions.ClientError as error:
        match error.response['Error']['Code']:
            case 'UsernameExistsException': 
                msg = "A user with this email already exists."
                raise AuthError({  "message": msg }, 400)
            case 'NotAuthorizedException':
                msg = "User is already confirmed."
                raise AuthError({  "message": msg }, 400)
            case 'InvalidPasswordException':
                msg = "Password did not conform with policy"
                raise AuthError({  "message": msg }, 400)
            case 'TooManyRequestsException':
                msg = "Too many requests made. Please wait before trying again."
                raise AuthError({  "message": msg }, 400)
            case _:
                msg = "An unexpected error occurred."
                raise AuthError({  "message": msg }, 400)
    except botocore.excepts.ParameterValidationError as error:
        msg = f"The parameters you provided are incorrect: {error}"
        raise AuthError({"message": msg}, 500)
    

def signUpCoordinator(body: dict):  # noqa: E501
    """Signup a new Coordinator"""
    return signUpHost(body)

def signin(body: dict):
    secret_hash = current_app.calc_secret_hash(body['email'])

    # initiate authentication
    try:
        response = current_app.boto_client.initiate_auth(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': body['email'],
                'PASSWORD': body['password'],
                'SECRET_HASH': secret_hash
            }
        )
    except ClientError as e:
        raise AuthError(e.response["Error"], 401)
    
    if(response.get('ChallengeName') and response['ChallengeName'] == 'NEW_PASSWORD_REQUIRED'):
        userId = response['ChallengeParameters']['USER_ID_FOR_SRP']
        sessionId = response['Session']
        return redirect(f"{current_app.root_url}/create-password?userId={userId}&sessionId={sessionId}")              

    access_token = response['AuthenticationResult']['AccessToken']
    refresh_token = response['AuthenticationResult']['RefreshToken']

    # retrieve user data
    user_data = current_app.boto_client.get_user(AccessToken=access_token)

    # create user object from user data
    user = get_user_attr(user_data)

    # set refresh token cookie
    session['refresh_token'] = refresh_token
    session['username'] = user_data['Username']

    # return user data json
    return {
        'token': access_token,
        'user': user
    }


def resend_confirmation_code():
    '''
    Resends the registration confirmation code to the specified user (identified by email).
    '''

    if connexion.request.is_json:
        body = connexion.request.get_json()

    if "email" not in body:
        raise AuthError({"message": "email invalid"}, 400)

    secret_hash = current_app.calc_secret_hash(body['email'])

    try:
        email = body['email']
        current_app.boto_client.resend_confirmation_code(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=email,
            ClientMetadata={
              'url': current_app.root_url
          }
        )
        message = "A confirmation code is being sent again."
        return {"message": message}, 200
    except botocore.exceptions.ClientError as error:
        match error.response['Error']['Code']:
            case 'UserNotFoundException':
                msg = "User not found. Confirmation not sent."
                raise AuthError({"message": msg}, 400)
            case 'TooManyRequestsException':
                msg = "Too many attempts to resend confirmation in a short amount of time."
                raise AuthError({"message": msg}, 429)
            case _:
                msg = error.response['Error']['Message']
                raise AuthError({"message": msg}, 500)
    except botocore.exceptions.ParamValidationError as error:
        msg = f"The parameters you provided are incorrect: {error}"
        raise AuthError({"message": msg}, 500)


def confirm_sign_up(body: dict):   
    secret_hash = current_app.calc_secret_hash(body['email'])

    try:
        response = current_app.boto_client.confirm_sign_up(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=body['email'],
            ConfirmationCode=body['code'],
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    return response

def signout():
    access_token = get_token_auth_header()

    # Signout user
    response = current_app.boto_client.global_sign_out(
        AccessToken=access_token
    )

    # Remove refresh token cookie
    session.pop('refresh_token', None)

    # send response
    return response

def token():
    # get code from body
    code = request.get_json()['code']
    client_id = current_app.config['COGNITO_CLIENT_ID']
    client_secret = current_app.config['COGNITO_CLIENT_SECRET']
    callback_uri = request.args['callback_uri']

    token_url = f"{cognito_client_url}/oauth2/token"
    auth = requests.auth.HTTPBasicAuth(client_id, client_secret)
    redirect_uri = f"{current_app.root_url}{callback_uri}"

    params = {
      'grant_type': 'authorization_code',
      'client_id': client_id,
      'code': code,
      'redirect_uri': redirect_uri
    }

    # get tokens from oauth2/token endpoint
    response = requests.post(token_url, auth=auth, data=params)

    refresh_token = response.json().get('refresh_token')
    access_token = response.json().get('access_token')

    # retrieve user data
    try:
        user_data = current_app.boto_client.get_user(AccessToken=access_token)
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    # create user object from user data
    user = get_user_attr(user_data)

    with DataAccessLayer.session() as db_session:
        db_user = User(email=user['email'])
        user_id = db_session.execute(
            select(User.id).filter_by(email=user["email"])
        ).first()
        if user_id is None:
            db_session.add(db_user)
            db_session.commit()

    # set refresh token cookie
    session['refresh_token'] = refresh_token

    # return user data json
    return {
        'token': access_token,
        'user': user
    }


def current_session():
    return {
        'token': refresh().get('refresh_token'),
        'user': {
            'email': session.get('username')
        }
    }

def refresh():
    refreshToken = session.get('refresh_token')
    username = session.get('username')
    if None in (refreshToken, username):
        raise AuthError({
            'code': 'session_expired',
            'message': 'Session not found'
        }, 401)

    try:
        response = current_app.boto_client.initiate_auth(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refreshToken,
                'SECRET_HASH': current_app.calc_secret_hash(username)
            }
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    accessToken = response['AuthenticationResult']['AccessToken']

    # Return access token
    return {
      "token": accessToken
    }

def forgot_password():
    # check for json in request body
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = current_app.calc_secret_hash(body['email'])
    
    # call forgot password method
    try:
        response = current_app.boto_client.forgot_password(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=body['email']
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)
    
    return response

def confirm_forgot_password():
    # check for json in request body
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = current_app.calc_secret_hash(body['email'])

    # call forgot password method
    try:
        response = current_app.boto_client.confirm_forgot_password(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=body['email'],
            ConfirmationCode=body['code'],
            Password=body['password']
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)
        
    return response

def user(token_info):
    return {
      "user": {
          "email": token_info["Username"]
      }
    }

def private(token_info):
    return {'message': 'Success - private'}

def google():
    client_id = current_app.config['COGNITO_CLIENT_ID']
    root_url = current_app.root_url
    redirect_uri = request.args['redirect_uri']
    print(f"{cognito_client_url}/oauth2/authorize?client_id={client_id}&response_type=code&scope=email+openid+profile+phone+aws.cognito.signin.user.admin&redirect_uri={root_url}{redirect_uri}&identity_provider=Google")

    return redirect(f"{cognito_client_url}/oauth2/authorize?client_id={client_id}&response_type=code&scope=email+openid+profile+phone+aws.cognito.signin.user.admin&redirect_uri={root_url}{redirect_uri}&identity_provider=Google")

# What comes first invite or adding the user 
#Do I have an oauth token
def invite():

    get_token_auth_header()

    if connexion.request.is_json:
        body = connexion.request.get_json()

    if "email" not in body:
        raise AuthError({"message": "email invalid"},400)       
        
    try:

        email = body['email']

        response = current_app.boto_client.admin_create_user(
            UserPoolId=current_app.config['COGNITO_USER_POOL_ID'],
            Username=email,
            UserAttributes=[
            {
                'Name': "email",
                'Value': email
            }
            ],
            DesiredDeliveryMediums=["EMAIL"])

        return response

    except Exception as e:
        
        msg = "Invite could not be sent"
        
        if e.response != None:
            msg = e.response['Error']['Message']

        raise AuthError({
                  "message": msg
              }, 500)