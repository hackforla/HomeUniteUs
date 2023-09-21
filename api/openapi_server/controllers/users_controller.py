
import string
import boto3

from openapi_server.controllers.auth_controller import get_token_auth_header

from os import environ as env
from openapi_server.models.database import DataAccessLayer, User
from openapi_server.models.schema import user_schema
from dotenv import load_dotenv, find_dotenv
from flask import session
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from openapi_server.exceptions import AuthError

# Local
from openapi_server.repositories.guest_dashboard_repository import GuestRepository

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

def get_user_by_email(user_email: str):

    guest_repo = GuestRepository()
    user = guest_repo.get_guest_by_email(user_email)# get data object from db

    response = user_schema.dump(user) # serialize data object into json for the api response

    return response

    # ############# Testing without db ############# 
    # user = {
    #     "id": 1,
    #     "first_name": "Alejandro",
    #     "last_name": "Gomez",
    #     "email": "ale.gomez@hackforla.org",
    #     "email_confirmed": False,
    #     "password_hash": "lfOcifi3DoKdjfvhwlrbugvywe3495!#$%",
    #     "date_created": "2023-09-19 12:00:00",
    #     "is_admin": False,
    #     "is_host": False,
    #     "is_guest": True
    # }
    # if user["email"] == user_email:
    #     return user
    # ##################### End #####################


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