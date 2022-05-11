#!/usr/bin/env python3

import connexion
from os import environ as env

from openapi_server import encoder
from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.database import HousingProgramServiceProvider, DataAccessLayer
from sqlalchemy import select
from sqlalchemy.orm import Session
from openapi_server.exceptions import AuthError, handle_auth_error
from dotenv import load_dotenv, find_dotenv


ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
SECRET_KEY=env.get('SECRET_KEY')


def add_provider(provider_name):

    dal = DataAccessLayer()
    dal.db_init()

    with Session(dal.engine) as session:

        provider = HousingProgramServiceProvider(
            provider_name=provider_name
        )

        session.add(provider)
        session.commit()


def list_providers():

    dal = DataAccessLayer()
    dal.db_init()

    with Session(dal.engine) as session:
        statement = select(HousingProgramServiceProvider)

        print(f'list_providers: results:')
        for provider in session.scalars(statement):
            print(f'- provider: {provider}')



def main():
    app = connexion.App(__name__, specification_dir='./openapi/')
    app.app.json_encoder = encoder.JSONEncoder
    app.app.secret_key = SECRET_KEY
    app.add_api('openapi.yaml',
                arguments={'title': 'Home Unite Us'},
                pythonic_params=True)             
    app.add_error_handler(AuthError, handle_auth_error)
    app.run(port=8080)


if __name__ == '__main__':
    main()