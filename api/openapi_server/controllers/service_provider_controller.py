
import connexion
import six
import traceback

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.service_provider import ServiceProvider  # noqa: E501
from openapi_server.models.service_provider_with_id import ServiceProviderWithId
from openapi_server.models import database as db
from sqlalchemy.orm import Session

db_engine = db.DataAccessLayer.get_engine()

def create_service_provider():  # noqa: E501
    """Create a housing program service provider

     # noqa: E501

    :rtype: ServiceProviderWithId
    """
    if connexion.request.is_json:
        try:
            # The auto-generated ServiceProvider provides 
            # validation of required columns
            provider = ServiceProvider.from_dict(
                connexion.request.get_json()).to_dict()  
        except ValueError:
            return traceback.format_exc(ValueError), 400
        with Session(db_engine) as session:
            row = db.HousingProgramServiceProvider(
                provider_name=provider["provider_name"]
            )

            session.add(row)
            session.commit()

            provider["id"] = row.id
            return ServiceProviderWithId.from_dict(provider), 201
    else:
        return "Bad Request", 400


def delete_service_provider(provider_id):  # noqa: E501
    """Delete a service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: None
    """
    with Session(db_engine) as session:
        query = session.query(
                db.HousingProgramServiceProvider).filter(
                    db.HousingProgramServiceProvider.id == provider_id)
        if query.first() != None:
            query.delete()
            session.commit()
            return f"Service Provider with id {provider_id} successfully deleted", 200


def get_service_provider_by_id(provider_id):  # noqa: E501
    """Get details about a housing program service provider from an ID

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: ServiceProviderWithId
    """
    with Session(db_engine) as session:
        row = session.get(
            db.HousingProgramServiceProvider, provider_id)
        if row != None:
            provider = ServiceProvider(
                provider_name=row.provider_name).to_dict()
            
            provider["id"] = row.id
            return ServiceProviderWithId.from_dict(provider), 200
        else:
            return "Not Found", 404


def get_service_providers():  # noqa: E501
    """Get a list of housing program service providers.

     # noqa: E501


    :rtype: List[ServiceProviderWithId]
    """
    resp = []
    with Session(db_engine) as session:
        table = session.query(db.HousingProgramServiceProvider).all()
        for row in table:
            provider = ServiceProvider(
                provider_name=row.provider_name).to_dict()
            
            provider["id"] = row.id
            resp.append(ServiceProviderWithId.from_dict(provider))
    return resp, 200


def update_service_provider(provider_id):  # noqa: E501
    """Update a housing program service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: ServiceProviderWithId
    """
    if connexion.request.is_json:
        try:
            # The auto-generated ServiceProvider provides 
            # validation of required columns
            provider = ServiceProvider.from_dict(
                connexion.request.get_json()).to_dict() 
        except ValueError:
            return traceback.format_exc(ValueError), 400
        with Session(db_engine) as session:
            query = session.query(
                db.HousingProgramServiceProvider).filter(
                    db.HousingProgramServiceProvider.id == provider_id)
            if query.first() != None:
                query.update(provider)
                session.commit()
                provider["id"] = provider_id
                return ServiceProviderWithId.from_dict(provider), 200
            else:
                return "Not Found", 404
    else:
        return "Bad Request", 400

