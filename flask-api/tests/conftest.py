import os

import pytest
import secrets
from collections.abc import Generator
from pytest import MonkeyPatch
import sqlalchemy
from sqlalchemy.orm import Session

from openapi_server.configs.staging import StagingHUUConfig
from openapi_server.configs.development import DevelopmentHUUConfig
from openapi_server.app import create_app
from openapi_server.configs.mock_aws import AWSMockService, AWSTemporaryUserpool
from openapi_server.models.database import DataAccessLayer

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
            config.mock_aws = True
    elif mode == 'release':
        # Load configuration from the environment, to allow the use of 
        # secrets, and disable the mocking of any resources 
        from dotenv import load_dotenv, find_dotenv
        dot_env = find_dotenv()
        if dot_env:
            load_dotenv(dot_env)
        with MonkeyPatch().context() as m:
            # The real userpool should never be used while testing
            # Our test infrastructure will create temporary user
            # pools for each test.
            m.setenv("COGNITO_CLIENT_ID", "Totally fake client id")
            m.setenv("COGNITO_CLIENT_SECRET", "Yet another fake secret12")
            m.setenv("COGNITO_REDIRECT_URI", "Redirect your way back to writing more test cases")
            m.setenv("COGNITO_USER_POOL_ID", "Water's warm. IDs are fake")
            m.setenv("SECRET_KEY", secrets.token_urlsafe(32))
            m.setenv("DATABASE_URL", "sqlite:///:memory:")
            app_config = StagingHUUConfig(
                TESTING=True,
                FLASK_DEBUG=True
            )
        config.mock_aws = False
    else:
        raise KeyError(f"pytest application configuration mode {mode} not"
                   "recognized. Only debug and release modes supported.")
    
    config.app_config = app_config

@pytest.fixture(scope="session")
def app_config(request):
    return request.config.app_config

@pytest.fixture(scope="session")
def is_mocking(pytestconfig):
    return pytestconfig.mock_aws

@pytest.fixture()
def app(pytestconfig, empty_db_session):
    flask_app = create_app(pytestconfig.app_config).app

    # Tests will never operate on real user data, so provide a 
    # temporary userpool even if mocking is disabled
    app_environment_cls = AWSMockService if pytestconfig.mock_aws else AWSTemporaryUserpool

    with app_environment_cls(flask_app):
        yield flask_app

@pytest.fixture
def alembic_engine():
    '''
    Override the pytest-alembic default engine to use an in-memory
    database at the base revision.
    '''
    return sqlalchemy.create_engine("sqlite:///:memory:")

@pytest.fixture()
def empty_db_session(alembic_runner, alembic_engine) -> Generator[Session, None, None]:
    '''
    SetUp and TearDown an empty in-memory database for 
    database repository tests.
    
    This fixture does not initialize the full application.
    '''
    # Upgrade the database to the current head revision
    # This applies all of our alembic migration scripts
    # to the empty database
    alembic_runner.migrate_up_to("heads")
    DataAccessLayer._engine = alembic_engine

    yield DataAccessLayer.session()
    
    test_engine, DataAccessLayer._engine = DataAccessLayer._engine, None 
    test_engine.dispose()

@pytest.fixture()
def empty_db_session_provider(empty_db_session):
    class _provider:
        def session(): return empty_db_session

    return _provider

@pytest.fixture()
def client(app):
    return app.test_client()

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