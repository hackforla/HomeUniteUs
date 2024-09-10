import os

import pytest
from pytest import MonkeyPatch
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app as main_app
from app.core.db import Base
from app.api.deps import get_db


@pytest.fixture
def client():
    SQLALCHEMY_DATABASE_URL = "sqlite+pysqlite:///:memory:"

    engine = sa.create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False,
                                       autoflush=False,
                                       bind=engine)

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        try:
            session = TestingSessionLocal()
            yield session
        finally:
            session.close()

    main_app.dependency_overrides[get_db] = override_get_db

    return TestClient(main_app)


# @pytest.fixture
# def empty_environment(monkeypatch: MonkeyPatch) -> MonkeyPatch:
#     """Create an isolated environment for testing purposes.

#     The environment variables are cleared to ensure the
#     configuration object is not dependent on the machine configuration.
#     """
#     for env_var in os.environ.keys():
#         monkeypatch.delenv(env_var)
#     return monkeypatch

# @pytest.fixture
# def fake_prod_env(empty_environment: MonkeyPatch) -> MonkeyPatch:
#     """Define a fake production environment.

#     Define a fake production environment by setting each of the required
#     production configuration variables with fake values.
#     """
#     empty_environment.setenv("SECRET_KEY",
#                              "A completely made up fake secret !@#$12234")
#     empty_environment.setenv("DATABASE_URL", "sqlite:///:memory:")
#     empty_environment.setenv("COGNITO_CLIENT_ID", "Totally fake client id")
#     empty_environment.setenv("COGNITO_CLIENT_SECRET",
#                              "Yet another fake secret12")
#     empty_environment.setenv("COGNITO_REGION",
#                              "Not even the region actually exists")
#     empty_environment.setenv(
#         "COGNITO_REDIRECT_URI",
#         "Redirect your way back to writing more test cases")
#     empty_environment.setenv("COGNITO_USER_POOL_ID",
#                              "Water's warm. IDs are fake")
#     empty_environment.setenv("COGNITO_ACCESS_ID",
#                              "If you need fake access, use this ID")
#     empty_environment.setenv("COGNITO_ACCESS_KEY",
#                              "WARNING: This is a real-ly fake key 12345a6sdf")
#     return empty_environment
