# Third Party
import pytest

# Local
from openapi_server.models.database import DataAccessLayer
from openapi_server.repositories.service_provider_repository import HousingProviderRepository

@pytest.fixture
def empty_housing_repo() -> HousingProviderRepository:
    '''
    SetUp and TearDown an empty housing repository for 
    testing purposes.
    '''
    DataAccessLayer._engine = None
    DataAccessLayer.db_init("sqlite:///:memory:")

    yield HousingProviderRepository()
    
    test_engine, DataAccessLayer._engine = DataAccessLayer._engine, None 
    test_engine.dispose()

@pytest.fixture
def housing_repo_5_entries(empty_housing_repo: HousingProviderRepository) -> HousingProviderRepository:
    '''
    SetUp and TearDown a housing repository with five service providers. 
    The providers will have ids [1-5] and names Provider 1...Provider5
    '''
    for i in range(1, 6):
        new = empty_housing_repo.create_service_provider(f"Provider {i}")
        assert new is not None, f"Test Setup Failure! Failed to create provider {i}"
        assert new.id == i, "The test ids are expected to go from 1-5"
    yield empty_housing_repo

def test_empty_db_count(empty_housing_repo: HousingProviderRepository):
    '''
    Test our test setup, to ensure that newly created repos are in fact empty.
    '''
    assert empty_housing_repo.provider_count() == 0

def test_create_provider(empty_housing_repo: HousingProviderRepository):
    '''
    Test creating a new provider within an empty database.
    '''
    EXPECTED_NAME = "MyFancyProvider"

    newProvider = empty_housing_repo.create_service_provider(EXPECTED_NAME)
    
    assert newProvider is not None, "Repo create method failed"
    assert newProvider.id == 1, "Expected id 1 since this is the first created provider"
    assert newProvider.provider_name == EXPECTED_NAME, "Created provider name did not match request"

def test_delete_nonexistent_provider(empty_housing_repo: HousingProviderRepository):
    '''
    Attempt to delete a service provider that does 
    not exist. Verify that the deletion gracefully
    fails.
    '''
    assert empty_housing_repo.delete_service_provider(42) == False

def test_delete_newly_created_provider(empty_housing_repo: HousingProviderRepository):
    '''
    Test creating and then deleting a new service provider, without error.
    '''
    new = empty_housing_repo.create_service_provider("Doomed Provider")
    assert new is not None, "Test setup failure! Initial create failed."
    assert empty_housing_repo.delete_service_provider(new.id)

def test_get_existing_provider_by_id(housing_repo_5_entries: HousingProviderRepository):
    '''
    Test getting a provider by id.
    '''
    for i in range(1, 6):
        provider = housing_repo_5_entries.get_service_provider_by_id(i)
        assert provider.provider_name == f"Provider {i}"
        assert provider.id == i

def test_get_all_providers(housing_repo_5_entries: HousingProviderRepository):
    '''
    Test getting all available service providers
    '''
    all = housing_repo_5_entries.get_service_providers()
    assert all is not None
    assert len(all) == 5
    
    for i in range(1, 6):
        provider = all[i-1]
        assert provider.id == i
        assert provider.provider_name == f"Provider {i}"

def test_get_all_providers_empty_db(empty_housing_repo: HousingProviderRepository):
    all = empty_housing_repo.get_service_providers()
    assert all is not None
    assert len(all) == 0

def test_get_nonexisting_provider_by_id(housing_repo_5_entries: HousingProviderRepository):
    failed_get = housing_repo_5_entries.get_service_provider_by_id(42)
    assert failed_get is None

def test_update_existing_service_provider(housing_repo_5_entries: HousingProviderRepository):
    UPDATED_NAME = "Rad New Name"
    UPDATED_ID = 3
    returned_provider = housing_repo_5_entries.update_service_provider(UPDATED_NAME, UPDATED_ID)
    retrieved_provider = housing_repo_5_entries.get_service_provider_by_id(UPDATED_ID)

    assert retrieved_provider is not None 
    assert retrieved_provider is not None

    assert returned_provider.id == UPDATED_ID
    assert returned_provider.provider_name == UPDATED_NAME

    assert retrieved_provider.id == UPDATED_ID
    assert retrieved_provider.provider_name == UPDATED_NAME 

def test_update_nonexistent_provider(housing_repo_5_entries: HousingProviderRepository):
    returned_provider = housing_repo_5_entries.update_service_provider(9999, "Failed Update Name")
    assert returned_provider is None

def test_provider_count(housing_repo_5_entries: HousingProviderRepository):
    assert housing_repo_5_entries.provider_count() == 5