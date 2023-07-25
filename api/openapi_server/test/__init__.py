import logging
from pathlib import Path

import connexion
from flask_testing import TestCase

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