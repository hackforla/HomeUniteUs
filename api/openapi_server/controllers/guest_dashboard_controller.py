# # Third Party
import connexion
import traceback

# Local
from openapi_server.repositories.guest_dashboard_repository import GuestDashboardRepository # noqa: E501
from openapi_server.models.guest_dashboard_with_guest_id_and_application_id import GuestDashboardWithGuestIdAndApplicationId as gd # noqa: E501

guest_dashboard_repository = GuestDashboardRepository()

def get_guest_dashboard_by_id_and_application_id(guest_id,application_id):
    """sumary_line
    # noqa: E501
    Keyword arguments:
    argument -- description
    Return: return_description
    """
    # tasks = guest_dashboard_repository.get_application_tasks(guest_id,application_id)
    # if tasks != None:
    #     return tasks, 200
    # else:
    #     return "tasks not found", 404



    ################################ Testing OpenAPI UI ################################
    tasks = [
        {
            "Application and Onboarding": "Application and Onboarding Complete"
        },
        {
            "Host Selection": "Host Selection Complete"
        },
        {
            "Match": "Match Complete"
        }
    ]

    result = {
        "guest_id": guest_id,
        "application_id": application_id,
        "tasks": tasks
    }

    if tasks != None:
        return result, 200
    else:
        return "tasks not found", 404
    ################################ Testing OpenAPI UI ################################
