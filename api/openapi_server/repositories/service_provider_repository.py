# Third Party
from sqlalchemy.orm import Session

# Local
from openapi_server.models.service_provider_with_id import ServiceProviderWithId
from openapi_server.models.service_provider import ServiceProvider
from openapi_server.models import database as db

class HousingProviderRepository:
    
    def __init__(self, db_engine=db.DataAccessLayer.get_engine()):
        """Instantiate HousingProviderRepository

        :param db_engine: persistence layer instance
        :type db_engine: Engine

        :rtype: None
        """
        self.db_engine = db_engine

    def create_service_provider(self, provider):
        """Create a housing program service provider

        :param provider: provider to create. 
        :type provider: ServiceProvider

        :rtype: ServiceProviderWithId
        """
        session = self._get_session()
        row = self._generate_row(provider)

        session.add(row)
        session.commit()
        provider["id"] = row.id

        session.close()
        return ServiceProviderWithId.from_dict(provider)
    
    def delete_service_provider(self, provider_id):
        """Delete a service provider. Return false if the
        service provider is not found. Return true otherwise.

        :param provider_id: The ID of the service provider to read, update or delete
        :type provider_id: int

        :rtype: bool
        """  
        num_rows_deleted = 0
        session = self._get_session()
        query = self._get_query_by_id(session, provider_id)
        if query.first() != None:
            num_rows_deleted = query.delete()
            session.commit()
        
        session.close()
        return bool(num_rows_deleted > 0)

    def get_service_provider_by_id(self, provider_id): 
        """Get details about a housing program service provider from an ID

        # noqa: E501

        :param provider_id: The ID of the service provider to read, update or delete
        :type provider_id: int

        :rtype: ServiceProviderWithId
        """
        session = self._get_session()
        result = None

        row = session.get(
                db.HousingProgramServiceProvider, provider_id)
        if row != None:
            provider = ServiceProvider(
                provider_name=row.provider_name).to_dict()
            
            provider["id"] = row.id
            result = ServiceProviderWithId.from_dict(provider)

        session.close()
        return result
            
    def get_service_providers(self):
        """Get a list of housing program service providers.

        :rtype: List[ServiceProviderWithId]
        """
        providers = []        
        session = self._get_session()
        table = session.query(db.HousingProgramServiceProvider).all()

        for row in table:
            provider = ServiceProvider(
                provider_name=row.provider_name).to_dict()
            
            provider["id"] = row.id
            providers.append(ServiceProviderWithId.from_dict(provider))

        session.close()
        return providers

    
    def update_service_provider(self, provider, provider_id):  
        """Update a housing program service provider

        :param provider: provider to create. 
        :type provider: ServiceProvider

        :param provider_id: The ID of the service provider to read, update or delete
        :type provider_id: int

        :rtype: ServiceProviderWithId
        """
        result = None
        session = self._get_session()
        query = session.query(
                db.HousingProgramServiceProvider).filter(
                    db.HousingProgramServiceProvider.id == provider_id)
        if query.first() != None:
            query.update(provider)
            session.commit()
            provider["id"] = provider_id
            result = ServiceProviderWithId.from_dict(provider)
        session.close()
        return result
    
    def _get_session(self):
        return Session(self.db_engine)
    
    def _generate_row(self, provider):
        return db.HousingProgramServiceProvider(
            provider_name=provider["provider_name"]
        )
    
    def _get_query_by_id(self, session, id):
        return session.query(
                db.HousingProgramServiceProvider).filter(
                    db.HousingProgramServiceProvider.id == id)