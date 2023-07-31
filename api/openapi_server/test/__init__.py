import logging
from pathlib import Path

import connexion
from flask import json
from flask_testing import TestCase
from typing import List
from werkzeug.test import TestResponse

from openapi_server.encoder import JSONEncoder
from openapi_server.models import database
from openapi_server.__main__ import get_bundled_specs


class BaseTestCase(TestCase):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cached_engine = None
        self.tmp_testing_database = Path("testinghomeuniteus.db")
        

    def create_app(self):
        '''
        Create a temporary, empty database for testing purposes and setup
        a new instance of our Flask App for testing purposes.
        '''
        # Cache a reference to the current engine, so we can restore the previous
        # DataAccessLayer once our test is complete
        self.cached_engine = database.DataAccessLayer._engine

        database.DataAccessLayer._engine = None 
        database.DataAccessLayer.get_engine(f"sqlite:///./{self.tmp_testing_database}")
        database.DataAccessLayer.db_init()

        logging.getLogger('connexion.operation').setLevel('ERROR')
        app = connexion.App(__name__)
        app.app.json_encoder = JSONEncoder
        app.add_api(get_bundled_specs(Path('openapi_server/openapi/openapi.yaml')),
                arguments={'title': 'Home Unite Us'},
                pythonic_params=True)   
        return app.app
    
    def tearDown(self):
        '''
        Delete our temporary testing database and restore the DataAccessLayer
        to its state before our test case ran.
        '''
        database.DataAccessLayer._engine = self.cached_engine
        self.tmp_testing_database.unlink(missing_ok=True)

    def create_service_provider(self) -> TestResponse:
        housing_program_service_provider = {
        "provider_name" : "provider_name"
        }
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        return self.client.open(
            '/api/serviceProviders',
            method='POST',
            headers=headers,
            data=json.dumps(housing_program_service_provider),
            content_type='application/json')

    def create_guest_dashboard(self) -> TestResponse:
        guest_dashboard = {
        "guest_id" : 1,
        "application_id" : 1
        }
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        return self.client.open(
            '/api/application_management/guests/{guest_id}/applications/{application_id}/tasks',
            method='POST',
            headers=headers,
            data=json.dumps(guest_dashboard),
            content_type='application/json')
    
    def populate_test_database(self, num_entries) -> List[int]:
        '''
        Add num_entries rows to the test database and return the
        created Ids. Fail test if any of the creation requests
        fails.
        '''
        ids = []
        for _ in range(num_entries):
            create_response = self.create_service_provider()
            raw_response = create_response.data.decode('utf-8')
            self.assertStatus(create_response, 201,
                       f"Test setup failure! Received response {raw_response}")
            deserialized_response = json.loads(raw_response)
            ids.append(deserialized_response["id"])
        return ids

    def populate_test_database_for_guest_dashboard(self) -> List[int]:
        '''
        Add num_entries rows to the test database and return the
        created guest_id's and application_id's. Fail test if any of the creation requests
        fails.
        '''
        guest_dashboard_ids = []
        create_response = self.create_guest_dashboard()
        raw_response = create_response.data.decode('utf-8')
        self.assertStatus(create_response, 201, f"Test setup failure! Received response {raw_response}")
        deserialized_response = json.loads(raw_response)
        guest_dashboard_ids.append(deserialized_response["id"])
        return guest_dashboard_ids

