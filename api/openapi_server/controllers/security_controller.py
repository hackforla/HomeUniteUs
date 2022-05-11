import boto3
from dotenv import load_dotenv, find_dotenv
from os import environ as env

from openapi_server.exceptions import AuthError


# Load .env file
ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

# Define env variables
COGNITO_REGION=env.get('COGNITO_REGION')

# Initialize Cognito clients
userClient = boto3.client('cognito-idp', region_name=COGNITO_REGION)


def requires_auth(token):
    # Check if token is valid
    try:
        # Get user info from token
        userInfo = userClient.get_user(
            AccessToken=token
        )
    
        return userInfo

    # handle other errors
    except Exception as e:
        code = e.response['Error']['Code']
        description = e.response['Error']['Message']
        raise AuthError({
                    "code": code, 
                    "description": description
                }, 401)