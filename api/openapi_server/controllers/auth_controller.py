import connexion
from os import environ as env
from dotenv import load_dotenv, find_dotenv

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)


COGNITO_REGION=env.get('COGNITO_REGION')
COGNITO_CLIENT_ID=env.get('COGNITO_GOOGLE_CLIENT_ID')



def signup():  # noqa: E501
    """Signup a new user
    """
    if connexion.request.is_json:
        body = connexion.request.get_json()


    print(COGNITO_CLIENT_ID)  
    print(body)

    return 'do some magic!'