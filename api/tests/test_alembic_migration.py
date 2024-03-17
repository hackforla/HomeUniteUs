from openapi_server.models.database import DataAccessLayer

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
    assert DataAccessLayer.revision_id() == 'e4c8bb426528'