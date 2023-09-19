# Third Party
from flask import Response

# Local
from openapi_server.repositories.service_provider_repository import HousingProviderRepository
from openapi_server.models.schema import service_provider_schema, service_provider_list_schema

housing_provider_repository = HousingProviderRepository()

def create_service_provider(body: dict) -> Response:
    """
    Create a housing program service provider using 
    the requested name, and add the new provider to the 
    database.
    """
    provider_name = body["provider_name"]
    new_provider = housing_provider_repository.create_service_provider(provider_name)
    if new_provider:
        return service_provider_schema.dump(new_provider), 201
    return f"Provider with name {provider_name} already exists.", 409   

def delete_service_provider(provider_id: int) -> Response:
    """Delete a service provider

    :param provider_id: The ID of the service provider to read, update or delete
    """
    if housing_provider_repository.delete_service_provider(provider_id):
        return f"Service Provider with id {provider_id} successfully deleted", 200
    return f"Service provider {provider_id} not found", 404

def get_service_provider_by_id(provider_id: int) -> Response:
    """Get details about a housing program service provider from an ID

    :param provider_id: The ID of the service provider to read, update or delete
    """
    provider = housing_provider_repository.get_service_provider_by_id(provider_id)
    if provider:
        return service_provider_schema.dump(provider), 200
    return f"Failed to find provider with id {provider_id}", 404

def get_service_providers() -> Response:
    """
    Get a list of all housing program service providers.
    """
    providers = housing_provider_repository.get_service_providers()
    return service_provider_list_schema.dump(providers), 200

def update_service_provider(provider_id: int, body: dict) -> Response:
    """
    Update a housing program service provider
    with id provider_id.
    """
    updated_provider = housing_provider_repository.\
        update_service_provider(body["provider_name"], provider_id)

    if updated_provider:
        return service_provider_schema.dump(updated_provider), 200
    
    return f"Failed to find provider with id {provider_id}", 404
