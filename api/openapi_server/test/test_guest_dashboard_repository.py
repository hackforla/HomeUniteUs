# Third Party
from unittest.mock import MagicMock

# Local
from openapi_server.models.guest_dashboard_with_guest_id_and_application_id import GuestDashboardWithGuestIdAndApplicationId as gd
from openapi_server.models import database as db
from openapi_server.repositories.guest_dashboard_repository import GuestDashboardRepository

class TestGuestDashboardRepository:

    def test_get_tasks_by_id_and_application_id_some_result(self):
        expected_guest_dashboard = gd(guest_id=1,application_id=1)
        
        repo = GuestDashboardRepository(None)

        expected_row = db.GuestApplications(
            id=expected_guest_dashboard.application_id
        )

        mock_session = MagicMock()

        mock_session.get.return_value = expected_row
        repo._get_session = lambda: mock_session

        actual = repo.get_guest_dashboard_by_id_and_application_id(expected_guest_dashboard.guest_id, expected_guest_dashboard.application_id)

        assert expected_guest_dashboard.guest_id == actual.guest_id
        assert expected_guest_dashboard.application_id == actual.application_id

        mock_session.close.assert_called_once()


    def test_get_tasks_by_id_and_application_id_no_result(self):
        repo = GuestDashboardRepository(None)
        expected_row = None
        mock_session = MagicMock()

        mock_session.get.return_value = expected_row
        repo._get_session = lambda: mock_session

        actual = repo.get_guest_dashboard_by_id_and_application_id(1, 1)

        assert actual == None
        mock_session.close.assert_called_once()

