
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

# Define env variables
COGNITO_REGION=env.get('COGNITO_REGION')
COGNITO_CLIENT_ID=env.get('COGNITO_CLIENT_ID')
COGNITO_CLIENT_SECRET=env.get('COGNITO_CLIENT_SECRET')
COGNITO_USER_POOL_ID=env.get('COGNITO_USER_POOL_ID')
COGNITO_REDIRECT_URI = env.get('COGNITO_REDIRECT_URI')
SECRET_KEY=env.get('SECRET_KEY')

def get_secret_hash(username):
    message = username + COGNITO_CLIENT_ID
    dig = hmac.new(bytearray(COGNITO_CLIENT_SECRET, 'utf-8'), msg=message.encode('utf-8'), digestmod='sha256').digest()
    return base64.b64encode(dig).decode()

userClient = boto3.client('cognito-idp', region_name=COGNITO_REGION)


def inital_sign_in_reset_password():
    # check for json in request body
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = get_secret_hash(body['email'])
    try:
        # call forgot password method
        response = userClient.respond_to_auth_challenge(
            ClientId=COGNITO_CLIENT_ID,
            ChallengeName = 'NEW_PASSWORD_REQUIRED',
            
            ChallengeResponses = {'NEW_PASSWORD':body['password'] ,
                                'USERNAME':body['email'],
                                'SECRET_HASH':secret_hash},
            
        )
    except Exception as e:
        print(e)
        raise AuthError({
                  "message": e.response['Error']['Message']
              }, 500)  
    
    return response