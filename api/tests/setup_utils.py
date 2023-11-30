from typing import List

from openapi_server.repositories.service_provider_repository import HousingProviderRepository

def populate_test_database(num_entries) -> List[int]:
    '''
    Add num_entries rows to the test database and return the
    created Ids. Fail test if any of the creation requests
    fails.

    Note: Providers are created using SQLAlchemy commands, 
    not API requests.
    '''
    ids = []
    db_helper = HousingProviderRepository()
    for i in range(num_entries):
        provider = db_helper.create_service_provider(f"Provider No {i}")
        assert provider is not None, (
            f"Test setup failure. Failed to create Provider No {i}."
            "Cannot perform endpoint test!")
        ids.append(provider.id)
    return ids