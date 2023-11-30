import os

import pytest
from typing import Callable
from pytest import MonkeyPatch

from openapi_server.configs.staging import StagingHUUConfig
from openapi_server.configs.development import DevelopmentHUUConfig
from openapi_server.app import create_app
from openapi_server.configs.mock_aws import aws_mocking, temporary_aws_userpool
from openapi_server.models.database import DataAccessLayer
from openapi_server.repositories.service_provider_repository import HousingProviderRepository

def pytest_addoption(parser: pytest.Parser) -> None:
    '''
    pytest hook used to register argparse-style options and ini-style config values, 
    called once at the beginning of a test run.
    '''    
    parser.addoption(
        "--mode",
        action="store",
        default="debug",
        help="run tests in debug or release mode",
    )

def pytest_configure(config: pytest.Config) -> None:
    '''
    pytest hook used to perform initial test application configuration, 
    called at the beginning of a test run, within conftest.py file.
    '''
    mode = config.getoption("mode", default='debug').lower()
    if mode == 'debug':
        # All application configurations are defined explicitly in code. The 
        # system environment is not used. All resources that can be safely 
        # mocked, will be mocked (e.g. mock AWS cognito API calls)
        with MonkeyPatch().context() as m:
            for env_var in os.environ.keys():
                m.delenv(env_var)
            app_config = DevelopmentHUUConfig(
                TESTING=True,
                FLASK_DEBUG=True,
                DATABASE_URL = 'sqlite:///:memory:'
            )
    elif mode == 'release':
        # Load configuration from the environment, to allow the use of 
        # secrets, and disable the mocking of any resources 
        from dotenv import load_dotenv, find_dotenv
        dot_env = find_dotenv()
        if dot_env:
            load_dotenv(dot_env)
        app_config = StagingHUUConfig(
            TESTING=True,
            FLASK_DEBUG=True,
            DATABASE_URL = 'sqlite:///:memory:'
        )
    else:
        raise KeyError(f"pytest application configuration mode {mode} not"
                   "recognized. Only debug and release modes supported.")
    
    config.app_config = app_config

@pytest.fixture(scope="session")
def app_config(request):
    return request.config.app_config

@pytest.fixture(scope='class')
def pass_app_config(request):
    '''
    Attach the pytest configuration to the decorated class as a field. 
    This fixutre is needed to pass pytest configurations to 
    unittest.TestCase classes.
    '''
    setattr(request.cls, 'app_config', request.config.app_config)

@pytest.fixture
def empty_environment(monkeypatch: MonkeyPatch) -> MonkeyPatch:
    '''
    Create an isolated environment for testing purposes.
    The environment variables are cleared to ensure the 
    configuration object is not dependent on the machine configuration.
    '''
    for env_var in os.environ.keys():
        monkeypatch.delenv(env_var)
    return monkeypatch

@pytest.fixture
def fake_prod_env(empty_environment: MonkeyPatch) -> MonkeyPatch:
    '''
    Define a fake production environment by setting each of the required
    production configuration variables with fake values.
    '''
    empty_environment.setenv("ENV", "production")
    empty_environment.setenv("FLASK_DEBUG", "False")
    empty_environment.setenv("TESTING", "False")
    empty_environment.setenv("SECRET_KEY", "A completely made up fake secret !@#$12234")
    empty_environment.setenv("DATABASE_URL", "sqlite:///:memory:")
    empty_environment.setenv("COGNITO_CLIENT_ID", "Totally fake client id")
    empty_environment.setenv("COGNITO_CLIENT_SECRET", "Yet another fake secret12")
    empty_environment.setenv("COGNITO_REGION", "Not even the region actually exists")
    empty_environment.setenv("COGNITO_REDIRECT_URI", "Redirect your way back to writing more test cases")
    empty_environment.setenv("COGNITO_USER_POOL_ID", "Water's warm. IDs are fake")
    empty_environment.setenv("COGNITO_ACCESS_ID", "If you need fake access, use this ID")
    empty_environment.setenv("COGNITO_ACCESS_KEY", "WARNING: This is a real-ly fake key 12345a6sdf")
    return empty_environment

@pytest.fixture()
def app(pytestconfig):
    flask_app = create_app(pytestconfig.app_config).app

    mocking_context = None 
    if isinstance(pytestconfig.app_config, DevelopmentHUUConfig):
        mocking_context = aws_mocking()
        config = mocking_context.__enter__()
        flask_app.configure_botoclient(config)
    userpool_context = temporary_aws_userpool(flask_app.boto_client)
    client_config = userpool_context.__enter__()
    flask_app.configure_userpool(client_config)

    yield flask_app

    try:
        userpool_context.__exit__(None, None, None)
    finally:
        if mocking_context:
            mocking_context.__exit__(None, None, None)

    test_engine, DataAccessLayer._engine = DataAccessLayer._engine, None
    test_engine.dispose()

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def create_user(app) -> Callable[[str, str], None]:
    '''
    Return a method that will signup and confirm 
    a user each time it is called. Fail test if the 
    user signup fails.
    '''
    def _signup_user(email: str, password: str) -> None:
        signup_response = app.test_client().post(
            '/api/auth/signup/host',
            json = {
                'email': email,
                'password': password
            }
        )
        assert signup_response.status_code == 200, f"User factory failed to signup user: {signup_response.json['message']}"

    def _confirm_user(email: str) -> None:
        confirm_response = app.boto_client.admin_confirm_sign_up(
            UserPoolId=app.config["COGNITO_USER_POOL_ID"],
            Username=email
        )
        assert confirm_response['ResponseMetadata']['HTTPStatusCode'] == 200, f"User factory failed to confirm user"

    def _factory(email: str, password: str):
        _signup_user(email, password)
        _confirm_user(email)

    return _factory
