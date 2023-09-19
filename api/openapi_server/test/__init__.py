import logging
from typing import List

from flask_testing import TestCase

from openapi_server.models.database import DataAccessLayer
from openapi_server.repositories.service_provider_repository import HousingProviderRepository
from openapi_server.app import create_app

from .app_config import DebugTestConfig, ReleaseTestConfig

class BaseTestCase(TestCase):

    def create_app(self):
        '''
        Create a instance of our Flask App, configured for testing purposes.

        The base class will never start the Flask App. It instead create a
        mock self.client class that is used to simulate requests to the WSGI server.

        https://flask.palletsprojects.com/en/2.2.x/testing/
        https://werkzeug.palletsprojects.com/en/2.3.x/test/
        '''
        self.provider_repo = HousingProviderRepository()

        logging.getLogger('connexion.operation').setLevel('ERROR')
        return create_app(DebugTestConfig()).app
    
    def tearDown(self):
        '''
        Delete our temporary testing database and restore the DataAccessLayer
        to its state before our test case ran.
        '''
        self.provider_repo = None
        test_engine, DataAccessLayer._engine = DataAccessLayer._engine, None
        test_engine.dispose()

    def populate_test_database(self, num_entries) -> List[int]:
        '''
        Add num_entries rows to the test database and return the
        created Ids. Fail test if any of the creation requests
        fails.

        Note: Providers are created using SQLAlchemy commands, 
        not API requests.
        '''
        ids = []
        for i in range(num_entries):
            provider = self.provider_repo.create_service_provider(f"Provider No {i}")
            assert provider is not None, (
                f"Test setup failure. Failed to create Provider No {i}."
                "Cannot perform endpoint test!")
            ids.append(provider.id)
        return ids

