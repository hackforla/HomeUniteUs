import os
import hmac
import base64
from pathlib import Path
from typing import Dict, Any
from importlib.metadata import version, PackageNotFoundError

import prance
from flask import Flask
from connexion.apps.flask_app import (
    FlaskApp, 
    FlaskJSONEncoder, 
    NumberConverter, 
    IntegerConverter
)

from .models.database import DataAccessLayer
from .exceptions import AuthError, handle_auth_error
from .configs.registry import HUUConfigRegistry, HUUConfig

class HUUFlaskApp(Flask):
    '''
    The HUUFlaskApp can be accessed anywhere that the Flask application context
    is active, by using the Flask `current_app` proxy.
    '''
    def __init__(self,*args, **kwargs):
        super().__init__(*args, **kwargs)
        self._boto_client = None

    @property 
    def environment(self) -> str:
        return self.config["ENV"]
    
    @property 
    def is_debug_app(self) -> bool:
        return self.config["DEBUG"]
    
    @property
    def root_url(self) -> str:
        return self.config["ROOT_URL"]

    @property
    def supports_aws_cognito(self) -> bool:
        return all(key in self.config for key in [
            "COGNITO_REGION",
            "COGNITO_ACCESS_ID",
            "COGNITO_ACCESS_KEY"
        ])
    
    def assert_support_aws_cognito(self):
        if not self.supports_aws_cognito():
            raise NotImplementedError("The current application configuration does "
                                      "not support AWS cognito. In the future we will "
                                      "mock this functionality to enable for all "
                                      "configurations. This feature is planned "
                                      "in Issue #577")
    
    @property
    def boto_client(self):
        if self._boto_client:
            return self._boto_client
        
        self.assert_support_aws_cognito()
        
        import boto3
        self._boto_client = boto3.client('cognito-idp', 
                                         region_name=self.app.config["COGNITO_REGION"], 
                                         aws_access_key_id=self.app.config["COGNITO_ACCESS_ID"],
                                         aws_secret_access_key=self.app.config["COGNITO_ACCESS_KEY"]
                                        )
        return self._boto_client
    
    def calc_cognito_hash(self, username: str) -> str:
        self.assert_support_aws_cognito()
        message = username + self.config["COGNITO_CLIENT_ID"]
        secret = bytearray(self.config["COGNITO_CLIENT_SECRET"], 'utf-8')
        dig = hmac.new(secret, msg=message.encode('utf-8'), digestmod='sha256').digest()
        return base64.b64encode(dig).decode()

class HUUConnexionApp(FlaskApp):
    def __init__(self, app_package_name: str, api_spec_rel_path: Path, *args, **kwargs):
        super().__init__(app_package_name, *args, **kwargs)

        api_spec_path = self.get_root_path() / api_spec_rel_path
        parsed_specs = self._get_bundled_specs(api_spec_path)
        parsed_specs['info']['version'] = self._get_version()

        self.add_api(parsed_specs, pythonic_params=True)

    def create_app(self) -> HUUFlaskApp:
        # Do not call super() here. We are overriding the default
        # connexion create_app method, to return our HUUFlaskApp type
        app = HUUFlaskApp(self.import_name, **self.server_args)
        app.json_encoder = FlaskJSONEncoder
        app.url_map.converters['float'] = NumberConverter
        app.url_map.converters['int'] = IntegerConverter
        return app
         
    @staticmethod
    def _get_bundled_specs(spec_file: Path) -> Dict[str, Any]:
        '''
        Prance is able to resolve references to local *.yaml files.

        Use prance to parse the api specification document. Connexion's 
        default parser is not able to handle local file references, but
        our api specification is split across multiple files for readability.

        Args:
            main_file (Path): Path to a api specification .yaml file

        Returns:
            Dict[str, Any]: Parsed specification file, stored in a dict
        '''
        parser = prance.ResolvingParser(str(spec_file.absolute()), lazy=True, strict=True)
        parser.parse()

        return parser.specification
    
    @staticmethod
    def _get_version():
        try:
            return version("homeuniteus-api")
        except PackageNotFoundError:
            # package is not installed
            return "0.1.0.dev0" 
        
def create_app(test_config: HUUConfig = None):
    '''
    Creates a configured application that is ready to be run.

    The application is configured from external environment variables stored
    in either a local `.env` in a development environment or from environment
    variables that are configured prior to running the application.

    This function is made available at the module level so that it can
    be loaded by a WSGI server in a production-like environment with
    `openapi_server.app:create_app()`.
    '''
    if test_config:
        config = test_config
    else:
        app_environment = os.getenv("ENV")
        if not app_environment:
            raise EnvironmentError("The ENV variable or a test configuration must be provided. This variable "
                                "is used to select the application configuration "
                                "at runtime. Available options are "
                                f"{HUUConfigRegistry.available_environments()}")
        config = HUUConfigRegistry.load_config(app_environment)

    connexion_app = HUUConnexionApp(__name__, './openapi/openapi.yaml')
    connexion_app.add_error_handler(AuthError, handle_auth_error)

    flask_app = connexion_app.app
    flask_app.config.from_object(config)
    DataAccessLayer.db_init(flask_app.config["DATABASE_URL"])        
    
    return connexion_app