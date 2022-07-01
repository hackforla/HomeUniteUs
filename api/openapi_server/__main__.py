#!/usr/bin/env python3

import connexion
from os import environ as env

from openapi_server import encoder
from openapi_server.models.database import DataAccessLayer
from openapi_server.exceptions import AuthError, handle_auth_error
from dotenv import load_dotenv, find_dotenv


ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
SECRET_KEY=env.get('SECRET_KEY')

DataAccessLayer.db_init()

def main():
    app = connexion.App(__name__, specification_dir='./_spec/')
    app.app.json_encoder = encoder.JSONEncoder
    app.app.secret_key = SECRET_KEY
    app.add_api('openapi.yaml',
                arguments={'title': 'Home Unite Us'},
                pythonic_params=True)             
    app.add_error_handler(AuthError, handle_auth_error)
    app.run(port=8080, debug=True)


if __name__ == '__main__':
    main()
