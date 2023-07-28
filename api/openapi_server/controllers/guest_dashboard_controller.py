# # Third Party
import connexion
import traceback

# Local
from openapi_server.repositories.guest_dashboard_repository import GuestDashboardRepository # noqa: E501

guest_dashboard_repository = GuestDashboardRepository()

def get_application_tasks(guest_id,application_id):
    """sumary_line

    # noqa: E501

    Keyword arguments:
    argument -- description
    Return: return_description
    """
    tasks = guest_dashboard_repository.get_application_tasks(guest_id,application_id)
    if tasks != None:
        return tasks, 200
    else:
        return "tasks not found", 404
