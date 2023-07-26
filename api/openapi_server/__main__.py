#!/usr/bin/env python3

# Standard Lib
from os import environ as env
from dotenv import load_dotenv, find_dotenv, get_key
from pathlib import Path
from typing import Dict, Any


# Third Party
import connexion
import prance

# Local
from openapi_server import encoder
from openapi_server.models.database import DataAccessLayer
from openapi_server.exceptions import AuthError, handle_auth_error
from configs.configs import compile_config
from configs.config_properties import ConfigProperties as cp


ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
SECRET_KEY=env.get('SECRET_KEY')

DataAccessLayer.db_init()

def get_bundled_specs(main_file: Path) -> Dict[str, Any]:
    parser = prance.ResolvingParser(str(main_file.absolute()), lazy=True, strict=True)
    parser.parse()
    
    return parser.specification


def main():    
    app = connexion.App(__name__)

    # Set configs
    env_config_profile = get_key(find_dotenv(), 'CONFIG_PROFILE')
    app.app.config.from_object(compile_config(env_config_profile))
    app.app.json_encoder = encoder.JSONEncoder
    app.app.secret_key = SECRET_KEY
    app.add_api(get_bundled_specs(Path('openapi_server/openapi/openapi.yaml')),
                arguments={'title': 'Home Unite Us'},
                pythonic_params=True)             
    app.add_error_handler(AuthError, handle_auth_error)
    app.run(
        host=app.app.config[cp.HOST.name],
        port=app.app.config[cp.PORT.name],
        debug=app.app.config[cp.DEBUG.name],
        use_reloader=app.app.config[cp.USE_RELOADER.name]
        )


if __name__ == '__main__':
    main()
