import connexion
import six

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.housing_program_service_provider import HousingProgramServiceProvider  # noqa: E501
from openapi_server import util


def create_service_provider(housing_program_service_provider=None):  # noqa: E501
    """Create a housing program service provider

     # noqa: E501

    :param housing_program_service_provider: 
    :type housing_program_service_provider: dict | bytes

    :rtype: HousingProgramServiceProvider
    """
    if connexion.request.is_json:
        housing_program_service_provider = HousingProgramServiceProvider.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def delete_service_provider(provider_id):  # noqa: E501
    """Delete a service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: None
    """
    return 'do some magic!'


def get_service_provider_by_id(provider_id):  # noqa: E501
    """Get details about a housing program service provider from an ID

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: HousingProgramServiceProvider
    """
    return 'do some magic!'


def get_service_providers():  # noqa: E501
    """Get a list of housing program service providers.

     # noqa: E501


    :rtype: List[HousingProgramServiceProvider]
    """
    return 'do some magic!'


def update_service_provider(provider_id, housing_program_service_provider=None):  # noqa: E501
    """Update a housing program service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int
    :param housing_program_service_provider: 
    :type housing_program_service_provider: dict | bytes

    :rtype: HousingProgramServiceProvider
    """
    if connexion.request.is_json:
        housing_program_service_provider = HousingProgramServiceProvider.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
