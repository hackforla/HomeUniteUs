
import string
import boto3

from openapi_server.controllers.auth_controller import get_token_auth_header

from os import environ as env
from openapi_server.models.database import DataAccessLayer, User
from dotenv import load_dotenv, find_dotenv
from flask import session
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
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
COGNITO_REDIRECT_URI = env.get('COGNITO_REDIRECT_URI')
SECRET_KEY=env.get('SECRET_KEY')

# Initialize Cognito clients
userClient = boto3.client('cognito-idp', region_name=COGNITO_REGION)


def delete(user_id: string):
    # get access token from header
    access_token = get_token_auth_header()

    # delete user from cognito
    try:
        response = userClient.delete_user(
            AccessToken=access_token
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)
    
    # delete user from database
    with DataAccessLayer.session() as db_session:
        db_session.query(User).filter_by(id=user_id).delete()
        try:
            db_session.commit()
        except IntegrityError:
            db_session.rollback()
            raise AuthError({
                "message": "An error occured while removing user to database."
            }, 422)
        
    # Remove refresh token cookie
    session.pop('refresh_token', None)

    return response