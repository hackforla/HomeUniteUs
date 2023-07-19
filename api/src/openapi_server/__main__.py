# Standard Lib
from os import environ as env
from dotenv import load_dotenv, find_dotenv, get_key

# Third Party
import connexion

# Local
from openapi_server import encoder
from openapi_server.models.database import DataAccessLayer
from openapi_server.exceptions import AuthError, handle_auth_error
from configs.configs import compile_config
from configs.config_properties import ConfigProperties as cp

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
SECRET_KEY = env.get("SECRET_KEY")

DataAccessLayer.db_init()

# `connexion.App` is aliased to `connexion.FlaskApp` (as of connexion v2.13.1)
# which is the connexion layer built on top of Flask. So we think of it as
# the connexion application.
# `connexion_app` is made available at the module level so that it can
# be loaded by a WSGI server in a production-like environment.
connexion_app = connexion.App(__name__, specification_dir="./_spec/")

connexion_app.add_api(
    "openapi.yaml", arguments={"title": "Home Unite Us"}, pythonic_params=True
)
connexion_app.add_error_handler(AuthError, handle_auth_error)

# The underlying instance of Flask is stored in `connexion_app.app`.
# This is an instance of `flask.Flask`.
# Below, the Flask configuration handler is loaded.
env_config_profile = get_key(find_dotenv(), "CONFIG_PROFILE")
flask_app = connexion_app.app
flask_app.config.from_object(compile_config(env_config_profile))
flask_app.json_encoder = encoder.JSONEncoder
flask_app.secret_key = SECRET_KEY

if __name__ == "__main__":
    # This will/should be only run in a development environment
    connexion_app.run(
        host=flask_app.config[cp.HOST.name],
        port=flask_app.config[cp.PORT.name],
        debug=flask_app.config[cp.DEBUG.name],
        use_reloader=flask_app.config[cp.USE_RELOADER.name],
    )
