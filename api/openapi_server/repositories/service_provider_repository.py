from typing import Optional, List

# Third Party
from sqlalchemy.orm import Session

# Local
from openapi_server.models import database as db
from openapi_server.models.database import HousingProgramServiceProvider
from openapi_server.models.database import DataAccessLayer

class HousingProviderRepository:
    
    def __init__(self, db_engine=None):
        """Instantiate HousingProviderRepository

        :param db_engine: persistence layer instance
        :type db_engine: Engine

        :rtype: None
        """
        if db_engine is None:
            db_engine = db.DataAccessLayer.get_engine()
        self.db_engine = db_engine

    def create_service_provider(self, provider_name: str) -> Optional[HousingProgramServiceProvider]:
        """
        Create a housing program service provider, if it
        is not already in the database. 

        Return the newly created service provider. Return None
        if the service provider already exists.
        """
        with DataAccessLayer.session() as session:
            existing_provider = session.query(HousingProgramServiceProvider).filter(
                HousingProgramServiceProvider.provider_name == provider_name
            ).one_or_none()

            if existing_provider is None:
                new_provider = HousingProgramServiceProvider(
                    provider_name = provider_name
                )
                session.add(new_provider)
                session.commit()
                session.refresh(new_provider)
                return new_provider
            
        return None
    
    def delete_service_provider(self, provider_id: int) -> bool:
        """Delete a service provider. Return false if the
        service provider is not found. Return true otherwise.

        :param provider_id: The ID of the service provider to delete.
        """
        with DataAccessLayer.session() as session:
            provider = session.query(HousingProgramServiceProvider).get(provider_id)
            if provider:
                session.delete(provider)
                session.commit()
                return True

        return False

    def get_service_provider_by_id(self, provider_id: int) -> Optional[HousingProgramServiceProvider]: 
        """Get details about a housing program service provider from an ID

        :param provider_id: The ID of the service provider to read, update or delete
        :type provider_id: int
        """
        with DataAccessLayer.session() as session:
            return session.query(HousingProgramServiceProvider).get(provider_id)
            
    def get_service_providers(self) -> List[HousingProgramServiceProvider]:
        """
        Get a list of all housing program service providers.
        """
        with DataAccessLayer.session() as session:
            return session.query(HousingProgramServiceProvider).all()

    def update_service_provider(self, new_name: str, provider_id: int) -> Optional[HousingProgramServiceProvider]:  
        """
        Update a housing program service provider with
        id 'provider_id'. Return the updated service provider
        if update is successful, otherwise return None.
        """
        with DataAccessLayer.session() as session:
            provider_to_update = session.query(HousingProgramServiceProvider).get(provider_id)
            if provider_to_update:
                provider_to_update.provider_name = new_name
                session.commit()
                session.refresh(provider_to_update)
                return provider_to_update
        return None
    
    def provider_count(self, existing_session: Session = None):
        def count(lcl_session: Session):
            return lcl_session.query(HousingProgramServiceProvider).count()
        
        if existing_session is None:
            with DataAccessLayer.session() as session:
                return count(session) 
        return count(existing_session)