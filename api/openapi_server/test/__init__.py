import logging
from pathlib import Path

import connexion
from flask import json
from flask_testing import TestCase
from typing import List
from werkzeug.test import TestResponse

from openapi_server.encoder import JSONEncoder
from openapi_server.models import database


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
        app = connexion.App(__name__, specification_dir='../_spec/')
        app.app.json_encoder = JSONEncoder
        app.add_api('openapi.yaml', pythonic_params=True)
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

