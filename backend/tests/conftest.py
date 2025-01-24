import os

import pytest

from fastapi.testclient import TestClient

import boto3
from moto import mock_aws

import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from app.main import app as main_app
from app.core.db import Base
from app.core.config import get_settings
from app.modules.deps import db_session, get_cognito_client

import tests.cognito_setup as cognito_setup


@pytest.fixture
def db_engine():
    SQLALCHEMY_DATABASE_URL = "sqlite+pysqlite:///:memory:"

    engine = sa.create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    return engine


@pytest.fixture
def session_factory(db_engine) -> Session:
    TestingSessionLocal = sessionmaker(autocommit=False,
                                       autoflush=False,
                                       bind=db_engine)

    import app.seed
    Base.metadata.create_all(bind=db_engine)

    return TestingSessionLocal


@pytest.fixture(scope="module")
def api_settings():
    """Configure test settings."""
    os.environ["COGNITO_ACCESS_ID"] = "testing"
    os.environ["COGNITO_ACCESS_KEY"] = "testing"
    os.environ["COGNITO_CLIENT_ID"] = "testing"
    os.environ["COGNITO_CLIENT_SECRET"] = "testing"
    os.environ["COGNITO_REGION"] = "us-east-1"
    os.environ["COGNITO_REDIRECT_URI"] = "testing"
    os.environ["COGNITO_USER_POOL_ID"] = "testing"
    os.environ["ROOT_URL"] = "testing"
    os.environ["DATABASE_URL"] = "testing"
    os.environ["HUU_ENVIRONMENT"] = "testing" 
    return get_settings()


@pytest.fixture(scope="module")
def cognito_client(api_settings):
    """Return a mocked Cognito IDP client."""
    with mock_aws():
        client = boto3.client("cognito-idp",
                              region_name=api_settings.COGNITO_REGION)
        with cognito_setup.AWSTemporaryUserpool(client) as temp_pool:
            api_settings.COGNITO_USER_POOL_ID = temp_pool.tmp_userpool_id
            api_settings.COGNITO_CLIENT_ID = temp_pool.tmp_client_id
            api_settings.COGNITO_CLIENT_SECRET = temp_pool.tmp_client_secret

            yield client


@pytest.fixture
def client(session_factory) -> TestClient:

    def override_db_session():
        try:
            session = session_factory()
            yield session
        finally:
            session.close()

    main_app.dependency_overrides[db_session] = override_db_session
    main_app.dependency_overrides[get_cognito_client] = lambda: None

    return TestClient(main_app)
