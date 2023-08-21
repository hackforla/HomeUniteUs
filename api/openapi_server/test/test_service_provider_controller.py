# coding: utf-8
from __future__ import absolute_import

from openapi_server.test import BaseTestCase

class TestServiceProviderController(BaseTestCase):
    """ServiceProviderController integration test stubs"""

    def test_create_service_provider(self):
        """
        Test creating a new service provider using a 
        simulated post request. Verify that the 
        response is correct, and that the app 
        database was properly updated.
        """
        REQUESTED_PROVIDER = {
            "provider_name" : "-123ASCII&"
        }
        response = self.client.post(
            '/api/serviceProviders',
            json=REQUESTED_PROVIDER)
        
        self.assertStatus(response, 201, 
                          f'Response body is: {response.json}')
        assert 'provider_name' in response.json
        assert 'id' in response.json
        assert response.json['provider_name'] == REQUESTED_PROVIDER['provider_name']
        
        db_entry = self.provider_repo.get_service_provider_by_id(response.json['id'])
        assert db_entry is not None, "Request succeeeded but the database was not updated!"
        assert db_entry.provider_name == REQUESTED_PROVIDER['provider_name']

    def test_delete_service_provider(self):
        """
        Test deleting a service provider that we know exists, 
        using a simulated delete request. Verify that the request
        succeeds and check that the provider is no longer 
        availabe within the database.
        """        
        # Test database is empty at start. Create an entry to delete
        ids = self.populate_test_database(num_entries=1)
        response = self.client.delete(f'/api/serviceProviders/{ids[0]}')
        self.assert200(response, f'Response body is: {response.json}')

        deleted_provider = self.provider_repo.get_service_provider_by_id(ids[0])
        assert deleted_provider is None, "Request succeeded, but provider is still in the database!"

    def test_get_service_provider_by_id(self):
        """Test case for get_service_provider_by_id

        Get details about a housing program service provider from an ID
        """
        ids = self.populate_test_database(num_entries=8)
        ID_TO_TEST = ids[3]
        provider_in_db = self.provider_repo.get_service_provider_by_id(ID_TO_TEST)

        response = self.client.get(f"/api/serviceProviders/{ID_TO_TEST}")
        self.assert200(response, f'Response body is : {response.json}')

        assert 'provider_name' in response.json
        assert 'id' in response.json
        assert response.json['provider_name'] == provider_in_db.provider_name
        assert response.json['id'] == ID_TO_TEST

    def test_get_service_providers(self):
        """Test case for get_service_providers

        Get a list of housing program service providers.
        """
        expected_provider_count = 12
        self.populate_test_database(num_entries=expected_provider_count)
        
        response = self.client.get('/api/serviceProviders')
        self.assert200(response,
                       f"Response body is : {response.json}")
        assert len(response.json) == expected_provider_count

    def test_update_service_provider(self):
        """Test case for update_service_provider

        Update a housing program service provider
        """
        ids = self.populate_test_database(num_entries=1)
        updated_provider = {
            "provider_name" : "Rebranded Provider~~~"
        }
        response = self.client.put(
            f"/api/serviceProviders/{ids[0]}",
            json=updated_provider)
        self.assert200(response,
                       f'Response body is: {response.json}')
        
        assert 'provider_name' in response.json
        assert 'id' in response.json 

        assert response.json['provider_name'] == updated_provider["provider_name"]
        assert response.json['id'] == ids[0]