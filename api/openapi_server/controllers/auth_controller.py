import connexion
import boto3
import hmac
import base64
import requests

from os import environ as env
from dotenv import load_dotenv, find_dotenv
from flask import redirect, request, session, redirect
from openapi_server.exceptions import AuthError
from openapi_server.models import database as db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from functools import wraps

db_engine = db.DataAccessLayer.get_engine()

# Load .env file
ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

# Define env variables
COGNITO_REGION=env.get('COGNITO_REGION')
COGNITO_CLIENT_ID=env.get('COGNITO_CLIENT_ID')
COGNITO_CLIENT_SECRET=env.get('COGNITO_CLIENT_SECRET')
COGNITO_USER_POOL_ID=env.get('COGNITO_USER_POOL_ID')
COGNITO_REDIRECT_URI = env.get('COGNITO_REDIRECT_URI')
SECRET_KEY=env.get('SECRET_KEY')

# Initialize Cognito clients
userClient = boto3.client('cognito-idp', region_name=COGNITO_REGION)

# Get secret hash
def get_secret_hash(username):
    message = username + COGNITO_CLIENT_ID
    dig = hmac.new(bytearray(COGNITO_CLIENT_SECRET, 'utf-8'), msg=message.encode('utf-8'), digestmod='sha256').digest()
    return base64.b64encode(dig).decode()

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

def signup():  # noqa: E501
    """Signup a new user
    """
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = get_secret_hash(body['email'])

    # Signup user
    with Session(db_engine) as session:
        user = db.User(email=body['email'])
        session.add(user)
        try:
            session.commit()
        except IntegrityError:
            session.rollback()
            raise AuthError({
                "message": "A user with this email already exists."
            }, 422)

    try:
        response = userClient.sign_up(
          ClientId=COGNITO_CLIENT_ID,
          SecretHash=secret_hash,
          Username=body['email'],
          Password=body['password'],
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        status_code = e.response['ResponseMetadata']['HTTPStatusCode']

        raise AuthError({
                  "code": code, 
                  "message": message
              }, status_code)

    return response


def signin():
    # Validate request data
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = get_secret_hash(body['email'])

    # initiate authentication
    try:
        response = userClient.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': body['email'],
                'PASSWORD': body['password'],
                'SECRET_HASH': secret_hash
            }
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        status_code = e.response['ResponseMetadata']['HTTPStatusCode']

        raise AuthError({
                  "code": code, 
                  "message": message
              }, status_code)
              
    access_token = response['AuthenticationResult']['AccessToken']
    refresh_token = response['AuthenticationResult']['RefreshToken']

    # retrieve user data
    user_data = userClient.get_user(AccessToken=access_token)

    # create user object from user data
    user = get_user_attr(user_data)

    # set refresh token cookie
    session['refresh_token'] = refresh_token

    # return user data json
    return {
        'token': access_token,
        'user': user
    }


def confirm():
    # Validate request data
    if connexion.request.is_json:
        body = connexion.request.get_json()
    
    secret_hash = get_secret_hash(body['email'])

    try:
        response = userClient.confirm_sign_up(
            ClientId=COGNITO_CLIENT_ID,
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
    response = userClient.global_sign_out(
        AccessToken=access_token
    )

    # Remove refresh token cookie
    session.pop('refresh_token', None)

    # send response
    return response

def token():
    # get code from body
    code = request.get_json()['code']
    client_id = COGNITO_CLIENT_ID
    client_secret = COGNITO_CLIENT_SECRET
    callback_uri = request.args['callback_uri']
    cognito_app_url = 'https://homeuudemo.auth.us-east-1.amazoncognito.com'

    token_url = f"{cognito_app_url}/oauth2/token"
    auth = requests.auth.HTTPBasicAuth(client_id, client_secret)

    params = {
      'grant_type': 'authorization_code',
      'client_id': client_id,
      'code': code,
      'redirect_uri': callback_uri
    }

    # get tokens from oauth2/token endpoint
    response = requests.post(token_url, auth=auth, data=params)

    refresh_token = response.json().get('refresh_token')
    access_token = response.json().get('access_token')

    # retrieve user data
    try:
        user_data = userClient.get_user(AccessToken=access_token)
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    # create user object from user data
    user = get_user_attr(user_data)

    with Session(db_engine) as db_session:
        db_user = db.User(email=user['email'])
        if db_session.query(db.User.id).filter_by(email=user["email"]).first() is None:
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
    # Get refresh token from cookie
    try:
      refreshToken = session['refresh_token']
    except Exception as e:
        raise AuthError({
                  "code": "session_expired", 
                  "message": "session not found"
              }, 401)

    # Refresh tokens
    try:
        response = userClient.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refreshToken,
                'SECRET_HASH': COGNITO_CLIENT_SECRET
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

    # retrieve user data
    user_data = userClient.get_user(AccessToken=accessToken)

    # create user object from user data
    user = get_user_attr(user_data)

    # return user data json
    return {
        'token': accessToken,
        'user': user
    }


def refresh():
    # Get refresh token from cookie
    refreshToken = session.get('refresh_token')
    if refreshToken is None:
        raise AuthError({
            'code': 'invalid_request',
            'message': 'Refresh token not found'
        }, 401)

    # Refresh tokens
    try:
        response = userClient.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refreshToken,
                'SECRET_HASH': COGNITO_CLIENT_SECRET
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

    secret_hash = get_secret_hash(body['email'])

    # call forgot password method
    response = userClient.forgot_password(
      ClientId=COGNITO_CLIENT_ID,
      SecretHash=secret_hash,
      Username=body['email']
    )
    
    return response

def reset_password():
    # check for json in request body
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = get_secret_hash(body['email'])

    # call forgot password method
    response = userClient.confirm_forgot_password(
        ClientId=COGNITO_CLIENT_ID,
        SecretHash=secret_hash,
        Username=body['email'],
        ConfirmationCode=body['code'],
        Password=body['password']
    )
    
    return response

def inital_sign_in_reset_password():
    # check for json in request body
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = get_secret_hash(body['email'])

    # call forgot password method
    response = userClient.respond_to_auth_challenge(
        ClientId=COGNITO_CLIENT_ID,
        ChallengeName = 'NEW_PASSWORD_REQUIRED',
        
        ChallengeResponses = {'NEW_PASSWORD':body['password'] ,
                              'USERNAME':body['email'],
                              'SECRET_HASH':secret_hash},
        
    )
    
    return response

def user(token_info):
    user = get_user_attr(token_info)

    return {
      "user": user
    }

def private(token_info):
    return {'message': 'Success - private'}

def google():
    # print hello
    redirect_uri = request.args['redirect_uri']
        
    return redirect(f"https://homeuudemo.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id={COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri={redirect_uri}&identity_provider=Google")

def confirm_signup():
    code = request.args['code']
    email = request.args['email']
    client_id = request.args['clientId']

    secret_hash = get_secret_hash(email)

    try:
        userClient.confirm_sign_up(
            ClientId=client_id,
            SecretHash=secret_hash,
            Username=email,
            ConfirmationCode=code
        )

        return redirect("http://localhost:4040/email-verification-success")
    except Exception as e:
        return redirect("http://localhost:4040/email-verification-error")