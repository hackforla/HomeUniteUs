import connexion
import six
import traceback

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.housing_program_service_provider import HousingProgramServiceProvider  # noqa: E501
from openapi_server.models import database as db
from sqlalchemy.orm import Session

dal = db.DataAccessLayer()
dal.db_init()

def create_service_provider():  # noqa: E501
    """Create a housing program service provider

     # noqa: E501

    :param housing_program_service_provider: 
    :type housing_program_service_provider: dict | bytes

    :rtype: HousingProgramServiceProvider
    """
    if connexion.request.is_json:
        try:
            # The auto-generated HousingProgramServiceProvider provides 
            # validation of required columns
            provider = HousingProgramServiceProvider.from_dict(
                connexion.request.get_json()).to_dict()  
        except ValueError:
            return traceback.format_exc(ValueError), 400
        with Session(dal.engine) as session:
            row = db.HousingProgramServiceProvider(
                provider_name=provider["provider_name"]
            )

            session.add(row)
            session.commit()

            provider["id"] = row.id
            return provider, 201
    else:
        return "Bad Request", 400


def delete_service_provider(provider_id):  # noqa: E501
    """Delete a service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int

    :rtype: None
    """
    with Session(dal.engine) as session:
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

    :rtype: HousingProgramServiceProvider
    """
    with Session(dal.engine) as session:
        row = session.get(
            db.HousingProgramServiceProvider, provider_id)
        if row != None:
            provider = HousingProgramServiceProvider(
                provider_name=row.provider_name).to_dict()
            
            provider["id"] = row.id
            return provider, 200
        else:
            return "Not Found", 404


def get_service_providers():  # noqa: E501
    """Get a list of housing program service providers.

     # noqa: E501


    :rtype: List[HousingProgramServiceProvider]
    """
    resp = []
    with Session(dal.engine) as session:
        table = session.query(db.HousingProgramServiceProvider).all()
        for row in table:
            provider = HousingProgramServiceProvider(
                provider_name=row.provider_name).to_dict()
            
            provider["id"] = row.id
            resp.append(provider)
    return resp, 200


def update_service_provider(provider_id):  # noqa: E501
    """Update a housing program service provider

     # noqa: E501

    :param provider_id: The ID of the service provider to read, update or delete
    :type provider_id: int
    :param housing_program_service_provider: 
    :type housing_program_service_provider: dict | bytes

    :rtype: HousingProgramServiceProvider
    """
    if connexion.request.is_json:
        try:
            # The auto-generated HousingProgramServiceProvider provides 
            # validation of required columns
            provider = HousingProgramServiceProvider.from_dict(
                connexion.request.get_json()).to_dict() 
        except ValueError:
            return traceback.format_exc(ValueError), 400
        with Session(dal.engine) as session:
            query = session.query(
                db.HousingProgramServiceProvider).filter(
                    db.HousingProgramServiceProvider.id == provider_id)
            if query.first() != None:
                query.update(provider)
                session.commit()
                provider["id"] = provider_id
                return provider, 200
            else:
                return "Not Found", 404
    else:
        return "Bad Request", 400

