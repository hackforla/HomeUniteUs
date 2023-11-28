import pytest
import logging
from typing import List, Optional

from flask_testing import TestCase

from openapi_server.configs.development import DevelopmentHUUConfig
from openapi_server.models.database import DataAccessLayer
from openapi_server.repositories.service_provider_repository import HousingProviderRepository
from openapi_server.app import create_app
from openapi_server.configs.mock_aws import aws_mocking, temporary_aws_userpool

@pytest.mark.usefixtures("pass_app_config")
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
        flask_app = create_app(self.app_config).app
        self.mocking_context = None 
        if isinstance(self.app_config, DevelopmentHUUConfig):
            self.mocking_context = aws_mocking()
            config = self.mocking_context.__enter__()
            flask_app.configure_botoclient(config)
        self.userpool_context = temporary_aws_userpool(flask_app.boto_client)
        client_config = self.userpool_context.__enter__()
        flask_app.configure_userpool(client_config)
        return flask_app
    
    def tearDown(self):
        '''
        Delete our temporary testing database and restore the DataAccessLayer
        to its state before our test case ran.
        '''
        try:
            self.userpool_context.__exit__(None, None, None)
        finally:
            if self.mocking_context:
                self.mocking_context.__exit__(None, None, None)

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
    
    def login(self, email: str, password: str) -> Optional[str]:
        '''
        Attempt to login to the REST API. Return None if unsuccessful.
        Return the JWT if successful.
        '''
        response = self.client.post(
            '/api/auth/signin',
            json = {
                'email': email,
                'password': password
            }
        )
        if (response.status_code == 200):
            assert 'token' in response.json, 'Signin succeeded but token field missing from response'
            return response.json['token']
        self.assert401(response, 'Failed signin attempt did not return 401')
        return None
    
    def signup_user(self, email, password):
        signup_response = self.client.post(
            '/api/auth/signup/host',
            json = {
                'email': email,
                'password': password
            }
        )

        self.assert200(signup_response, "Signup attempt failed")

    def confirm_user(self, email):
        app = self.client.application
        app.boto_client.admin_confirm_sign_up(
            UserPoolId=app.config["COGNITO_USER_POOL_ID"],
            Username=email
        )

class TestsWithMockingDisabled(BaseTestCase):
    '''
    This test suite will be skipped if mocking is enabled.
    '''
    def setUp(self):
        if isinstance(self.app_config, DevelopmentHUUConfig):
            pytest.skip("This test suite is only enabled when mocking is disabled")
        super().setUpClass()