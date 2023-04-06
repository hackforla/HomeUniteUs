
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
SECRET_KEY=env.get('SECRET_KEY')



userClient = boto3.client('cognito-idp', region_name=COGNITO_REGION)

def initial_sign_in_reset_password(): 
    """Sets initial password.
     
    Removes auto generated password and replaces with 
    user assigned password. Used for account setup.

    Returns: 
        Response object or exception
    """
    try:
        # check for json in request body. If not Json throws an error
        if connexion.request.is_json:
            body = connexion.request.get_json()
        else:
            raise AuthError({"message": "bad response from server"},500)

        if "email" not in body:
            raise AuthError({"message": "bad response, no email"},500)
        
        if "password" not in body:
            raise AuthError({"message": "bad response, no password"},500)
        
        secret_hash = auth_controller.get_secret_hash(body['email'])
    
        # call forgot password method
        response = userClient.respond_to_auth_challenge(
            ClientId=COGNITO_CLIENT_ID,
            ChallengeName = 'NEW_PASSWORD_REQUIRED',
            Session=body['session'],
            ChallengeResponses = {
                'NEW_PASSWORD':body['password'] ,
                'USERNAME':body['email'],
                'SECRET_HASH':secret_hash
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
    
    return response