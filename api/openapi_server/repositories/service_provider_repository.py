from typing import Optional, List

# Third Party
from sqlalchemy import func, select
from sqlalchemy.orm import Session

# Local
from openapi_server.models.database import HousingProgramServiceProvider, DataAccessLayer

class HousingProviderRepository:

    def create_service_provider(self, provider_name: str) -> Optional[HousingProgramServiceProvider]:
        """
        Create a housing program service provider, if it
        is not already in the database. 

        Return the newly created service provider. Return None
        if the service provider already exists.
        """
        with DataAccessLayer.session() as session:
            existing_provider = session.execute(select(HousingProgramServiceProvider).filter(
                HousingProgramServiceProvider.provider_name == provider_name
            )).scalar_one_or_none()

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
            provider = session.get(HousingProgramServiceProvider, provider_id)
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
            return session.get(HousingProgramServiceProvider, provider_id)
            
    def get_service_providers(self) -> List[HousingProgramServiceProvider]:
        """
        Get a list of all housing program service providers.
        """
        with DataAccessLayer.session() as session:
            result = session.execute(select(HousingProgramServiceProvider)).scalars()
            scalar = session.scalars(select(HousingProgramServiceProvider)).all()
            return session.execute(select(HousingProgramServiceProvider)).scalars().all()

    def update_service_provider(self, new_name: str, provider_id: int) -> Optional[HousingProgramServiceProvider]:  
        """
        Update a housing program service provider with
        id 'provider_id'. Return the updated service provider
        if update is successful, otherwise return None.
        """
        with DataAccessLayer.session() as session:
            provider_to_update = session.get(HousingProgramServiceProvider, provider_id)
            if provider_to_update:
                provider_to_update.provider_name = new_name
                session.commit()
                session.refresh(provider_to_update)
                return provider_to_update
        return None
    
    def provider_count(self, existing_session: Session = None):
        def count(lcl_session: Session):
            return lcl_session.scalar(select(func.count(HousingProgramServiceProvider.id)))
        
        if existing_session is None:
            with DataAccessLayer.session() as session:
                return count(session) 
        return count(existing_session)