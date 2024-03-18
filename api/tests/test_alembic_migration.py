from openapi_server.models.database import DataAccessLayer
from openapi_server.models.user_roles import UserRole
from openapi_server.repositories.user_repo import UserRepository

# Importing these tests will register them within our test project
from pytest_alembic.tests import test_single_head_revision
from pytest_alembic.tests import test_upgrade
from pytest_alembic.tests import test_model_definitions_match_ddl
# BROKEN from pytest_alembic.tests import test_up_down_consistency

def test_db_session_version(empty_db_session):
    '''
    Test that the pytest in-memory database is at the most
    up-to-date alembic migration version. This will ensure all 
    the require database objects and pre-populated fields will 
    be available.
    '''
    # Adding a new database revision will break this test case

    # Before updating to the new revision please add additional 
    # test cases below that check the integrity of your new migration
    assert DataAccessLayer.revision_id() == 'e4c8bb426528'

def test_user_roles_available(empty_db_session):
    '''
    Test that all of the UserRole types are pre-populated within 
    the Role table after migrating the database to the HEAD revision.
    '''
    user_repo = UserRepository(empty_db_session)
    for role in UserRole:
        db_role = user_repo._get_role(role)
        assert db_role.name == role.value