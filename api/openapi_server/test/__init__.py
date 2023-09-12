import logging
from pathlib import Path

import connexion
from flask_testing import TestCase
from typing import List

from openapi_server.encoder import JSONEncoder
from openapi_server.models.database import DataAccessLayer
from openapi_server.__main__ import get_bundled_specs
from openapi_server.repositories.service_provider_repository import HousingProviderRepository
from openapi_server.repositories.guest_dashboard_repository import GuestDashboardRepository


class BaseTestCase(TestCase):

    def create_app(self):
        """
        Create a temporary, empty database for testing purposes and return
        a new instance of our Flask App to the base class for testing purposes.

        The base class will never start the Flask App. It instead create a
        mock self.client class that is used to simulate requests to the WSGI server.

        https://flask.palletsprojects.com/en/2.2.x/testing/
        https://werkzeug.palletsprojects.com/en/2.3.x/test/
        """
        # Create a temporary, memory only database. This temp db will be
        # automatically destroyed when the refcount drops to zero
        DataAccessLayer._engine = None
        DataAccessLayer._conn_string = "sqlite:///:memory:"
        DataAccessLayer.db_init()
        self.provider_repo = HousingProviderRepository()
        self.guest_dashboard_repo = GuestDashboardRepository()

        logging.getLogger("connexion.operation").setLevel("ERROR")
        app = connexion.App(__name__)
        app.app.json_encoder = JSONEncoder
        app.add_api(get_bundled_specs(Path("openapi_server/openapi/openapi.yaml")),
                pythonic_params=True)
        return app.app

    def tearDown(self):
        """
        Delete our temporary testing database and restore the DataAccessLayer
        to its state before our test case ran.
        """
        self.provider_repo = None
        test_engine, DataAccessLayer._engine = DataAccessLayer._engine, None
        test_engine.dispose()

    def populate_test_database(self, num_entries) -> List[int]:
        """
        Add num_entries rows to the test database and return the
        created Ids. Fail test if any of the creation requests
        fails.

        Note: Providers are created using SQLAlchemy commands,
        not API requests.
        """
        ids = []
        for i in range(num_entries):
            provider = self.provider_repo.create_service_provider(f"Provider No {i}")
            assert provider is not None, (
                f"Test setup failure. Failed to create Provider No {i}."
                "Cannot perform endpoint test!")
            ids.append(provider.id)
        return ids

    def populate_test_database_for_guest_dashboard(self, num_entries) -> List[GuestDashboardWithGuestIdAndApplicationId]:
        """
        Add num_entries rows to the test database and return the
        created guest_id's and application_id's. Fail test if any
        of the creation requests fails.
        """
        guest_dashboards = []
        for i in range(num_entries):
            dashboard = self.guest_dashboard_repo.create_guest_dashboard(f"Guest Dashboard {i}")
            assert dashboard is not None, (
                f"Test setup failure! Failed to create Guest Dashboard No {i}"
                "Cannot perform endpoint test!")
            guest_dashboards.append(dashboard)
        return guest_dashboards

