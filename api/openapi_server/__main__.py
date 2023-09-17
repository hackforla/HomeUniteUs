# Standard Lib
import os
from pathlib import Path
from typing import Dict, Any

# Third Party
import connexion
import prance

# Local
from openapi_server import encoder
from openapi_server.models.database import DataAccessLayer
from openapi_server.exceptions import AuthError, handle_auth_error
from openapi_server.configs.registry import HUUConfigRegistry
from openapi_server.configs.huu_config import HUUConfig
DataAccessLayer.db_init()


def get_bundled_specs(main_file: Path) -> Dict[str, Any]:
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
    parser = prance.ResolvingParser(str(main_file.absolute()), lazy=True, strict=True)
    parser.parse()

    return parser.specification

def get_version():
    from importlib.metadata import version, PackageNotFoundError

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
    `openapi_server.__main__:create_app()`.
    '''

    if (test_config):
        conf = test_config
    else: 
        app_environment = os.getenv("ENV")
        if not app_environment:
            raise EnvironmentError("The ENV variable or a test configuration must be provided. This variable "
                                "is used to select the application configuration "
                                "at runtime. Available options are "
                                f"{HUUConfigRegistry.available_environments()}")
        conf = HUUConfigRegistry.load_config(app_environment)

    # `connexion.App` is aliased to `connexion.FlaskApp` (as of connexion v2.13.1)
    # which is the connexion layer built on top of Flask. So we think of it as
    # the connexion application.
    connexion_app = connexion.App(__name__)
    api_spec_path = connexion_app.get_root_path() / Path('./openapi/openapi.yaml')
    parsed_specs = get_bundled_specs(api_spec_path)

    parsed_specs['info']['version'] = get_version()

    connexion_app.add_api(parsed_specs, pythonic_params=True)
    connexion_app.add_error_handler(AuthError, handle_auth_error)

    # The underlying instance of Flask is stored in `connexion_app.app`.
    # This is an instance of `flask.Flask`.
    flask_app = connexion_app.app
    flask_app.json_encoder = encoder.JSONEncoder
    flask_app.config.from_object(conf)

    return connexion_app


if __name__ == "__main__":
    dev_config = HUUConfigRegistry.load_config(HUUConfigRegistry.DEVELOPMENT)
    create_app(dev_config).run(
        host=dev_config.HOST,
        port=dev_config.PORT,
        load_dotenv=False
    )
