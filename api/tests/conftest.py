import os

import pytest
from pytest import MonkeyPatch

from openapi_server.configs.staging import StagingHUUConfig
from openapi_server.configs.development import DevelopmentHUUConfig

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
