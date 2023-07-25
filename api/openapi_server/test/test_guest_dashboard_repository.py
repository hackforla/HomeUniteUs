# Third Party
import pytest
from unittest.mock import MagicMock

# Local
class TestGuestDashboardRepository:

    def test_get_guest_dashboard_tasks(self):
        repo = GuestDashboardRepository(None)
        mock_session = MagicMock()
        mock_query = MagicMock()

        expected_tasks = [
            {
                "Application and Onboarding": [
                    "Application Approval",
                    "Onboarding Forms/?"
                ]
            },
            {
                "Host Selection": [
                    "Find matches",
                    "Pre Match Meetings",
                    "Finalize meetings"
                ]
            }
        ]

        mock_session.query.return_value = mock_query
        mock_query.all.return_value = expected_tasks
        repo._get_session = lambda: mock_session

        actual = repo.get_guest_dashboard_tasks()

        assert expected_tasks == actual
        mock_session.close.assert_called_once()


# include testwhen nothing is returned