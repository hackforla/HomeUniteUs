from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.modules.access.user_roles import UserRole
from app.modules.access.user_repo import UserRepository

# Importing these tests will register them within our test project
# These tests do an excellent job of detecting errors in the alembic
# downgrade and upgrade scripts.
from pytest_alembic.tests import test_single_head_revision
from pytest_alembic.tests import test_upgrade
from pytest_alembic.tests import test_model_definitions_match_ddl
from pytest_alembic.tests import test_up_down_consistency


def revision_id(engine) -> str:
    "Return the database alembic migration revision number."
    if not engine:
        raise Exception("Engine needed to get revision ID.")

    try:
        with engine.connect() as conn:
            # Using text() to ensure the query is treated as a literal SQL statement
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            revision_id = result.scalar()
            return revision_id
    except SQLAlchemyError as e:
        raise Exception("Unable to get revision ID: " + e)

def test_db_session_version(db_session):
    """
    Test that the pytest in-memory database is at the most
    up-to-date alembic migration version. This will ensure all
    the require database objects and pre-populated fields will
    be available.
    """
    # Adding a new database revision will break this test case

    # Before updating to the new revision please add additional
    # test cases below that check the integrity of your new migration
    assert revision_id(db_session.get_bind()) == 'cfc4e41b69d3'


def test_user_roles_available(db_session):
    """
    Test that all of the UserRole types are pre-populated within
    the Role table after migrating the database to the HEAD revision.
    """
    user_repo = UserRepository(empty_db_session)
    for role in UserRole:
        db_role = user_repo._get_role(role)
        assert db_role.name == role.value
