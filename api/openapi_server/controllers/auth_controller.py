from tkinter import E
import connexion
import boto3
import hmac
import base64
from os import environ as env
from dotenv import load_dotenv, find_dotenv
from flask import session
from openapi_server.exceptions import AuthError

# Load .env file
ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

# Define env variables
COGNITO_REGION=env.get('COGNITO_REGION')
COGNITO_CLIENT_ID=env.get('COGNITO_CLIENT_ID')
COGNITO_CLIENT_SECRET=env.get('COGNITO_CLIENT_SECRET')
COGNITO_USER_POOL_ID=env.get('COGNITO_USER_POOL_ID')
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


def signup():  # noqa: E501
    """Signup a new user
    """
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = get_secret_hash(body['email'])

     # Signup user
    try:
        response = userClient.sign_up(
          ClientId=COGNITO_CLIENT_ID,
          SecretHash=secret_hash,
          Username=body['email'],
          Password=body['password'],
        )
    except Exception as e:
        code = e.response['Error']['Code']
        description = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "description": description
              }, 401)

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
        description = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "description": description
              }, 401)
              
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
