
import connexion
import boto3


from openapi_server.controllers import auth_controller
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
COGNITO_ACCESS_ID = env.get('COGNITO_ACCESS_ID')
COGNITO_ACCESS_KEY = env.get('COGNITO_ACCESS_KEY')
SECRET_KEY=env.get('SECRET_KEY')



userClient = boto3.client('cognito-idp', region_name=COGNITO_REGION, aws_access_key_id = COGNITO_ACCESS_ID, aws_secret_access_key = COGNITO_ACCESS_KEY)

def initial_sign_in_reset_password(): 
    """Sets initial password.
     
    Removes auto generated password and replaces with 
    user assigned password. Used for account setup.

    Returns: 
        Response object or exception
    """
    body = connexion.request.get_json()
    userId = body['userId']
    password = body['password']
    sessionId = body['sessionId']

    try:        
        secret_hash = auth_controller.get_secret_hash(userId)
    
        # call forgot password method
        response = userClient.respond_to_auth_challenge(
            ClientId=COGNITO_CLIENT_ID,
            ChallengeName = 'NEW_PASSWORD_REQUIRED',
            Session=sessionId,
            ChallengeResponses = {
                'NEW_PASSWORD': password ,
                'USERNAME': userId,
                'SECRET_HASH': secret_hash
            },
            
        )
    except Exception as e:  
        print(e)
        raise AuthError({"message": "failed to change password"}, 500) from e
    
    access_token = response['AuthenticationResult']['AccessToken']
    refresh_token = response['AuthenticationResult']['RefreshToken']

    user_data = userClient.get_user(AccessToken=access_token)
    user = auth_controller.get_user_attr(user_data)

    session['refresh_token'] = refresh_token

    # return user data json
    return {
        'token': access_token,
        'user': user
    }