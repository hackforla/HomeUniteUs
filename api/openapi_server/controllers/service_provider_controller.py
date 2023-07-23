# Third Party
import connexion
import traceback

# Local
from openapi_server.models.service_provider import ServiceProvider  # noqa: E501
from openapi_server.repositories.service_provider_repository import HousingProviderRepository

housing_provider_repository = HousingProviderRepository()

def create_service_provider():  # noqa: E501
    """Create a housing program service provider

     # noqa: E501

    :rtype: ServiceProviderWithId
    """
    if not connexion.request.is_json:
        return "Bad Request", 400
    
    try:
        # The auto-generated ServiceProvider provides 
        # validation of required columns
        provider = ServiceProvider.from_dict(
            connexion.request.get_json()).to_dict()  
    except ValueError:
        return traceback.format_exc(ValueError), 400
    
    withId = housing_provider_repository.create_service_provider(provider)
    return withId, 201


def delete_service_provider(provider_id):  # noqa: E501
    """Delete a service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: None
    """
    housing_provider_repository.delete_service_provider(provider_id)
    return f"Service Provider with id {provider_id} successfully deleted", 200

def get_service_provider_by_id(provider_id):  # noqa: E501
    """Get details about a housing program service provider from an ID

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: ServiceProviderWithId
    """
    provider = housing_provider_repository.get_service_provider_by_id(provider_id)
    return provider, 200 if provider != None else "Not Found", 404

def get_service_providers():  # noqa: E501
    """Get a list of housing program service providers.

     # noqa: E501

    :rtype: List[ServiceProviderWithId]
    """
    providers = housing_provider_repository.get_service_providers()
    return providers, 200


def update_service_provider(provider_id):  # noqa: E501
    """Update a housing program service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: ServiceProviderWithId
    """
    if not connexion.request.is_json:
        return "Bad Request", 400
    
    try:
        # The auto-generated ServiceProvider provides 
        # validation of required columns
        provider = ServiceProvider.from_dict(
            connexion.request.get_json()).to_dict() 
    except ValueError:
        return traceback.format_exc(ValueError), 400
    
    updated = housing_provider_repository.update_service_provider(provider, provider_id)
    return updated, 200 if updated != None else "Not Found", 404
