# coding: utf-8
from __future__ import absolute_import

from tests import BaseTestCase

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

    def test_create_with_extra_data(self):
        '''
        Test that sending an create POST request with extra 
        json entries in the body does not disrupt the update.

        We should safely ignore additional fields.
        '''
        create_request = {
            "provider_name": "A new provider",
            "extra_int": 1,
            "extra_bool": True,
            "extra_string": "I'm notta name"
        }
        
        response = self.client.post(
            '/api/serviceProviders',
            json=create_request)
        
        self.assertStatus(response, 201, 
                          f'Response body is: {response.json}')
        assert 'provider_name' in response.json
        assert 'id' in response.json
        assert response.json['provider_name'] == create_request['provider_name']
        assert 'extra_int' not in response.json, "We should not send back request json extra fields"
        assert 'extra_bool' not in response.json, "We should not send back request json extra fields"
        assert 'extra_string' not in response.json, "We should not send back request json extra fields"
        
        db_entry = self.provider_repo.get_service_provider_by_id(response.json['id'])
        assert db_entry is not None, "Request succeeeded but the database was not updated!"
        assert db_entry.provider_name == create_request['provider_name']

    def test_create_bad_json_invalid_type(self):
        bad_create_request = {
            "provider_name": 1
        }
        response = self.client.post(
            '/api/serviceProviders',
            json=bad_create_request)
        
        self.assert400(response, f'Response body is: {response.json}')

    def test_create_bad_json_missing_name(self):
        bad_create_request = {
            "provider_namez": 1
        }
        response = self.client.post(
            '/api/serviceProviders',
            json=bad_create_request)
        
        self.assert400(response, f'Response body is: {response.json}')

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

    def test_delete_nonexistant_provider(self):
        """
        Test that deleting a nonexistant provider responds with the 
        correct status code and does not modify the db.
        """
        NUM_ROWS = 4
        ids = self.populate_test_database(num_entries=NUM_ROWS)
        assert self.provider_repo.provider_count() == NUM_ROWS, "Test setup failure"

        response = self.client.delete(f'/api/serviceProviders/{999}')
        self.assert404(response, f'Response body is: {response.json}')

        assert self.provider_repo.provider_count() == NUM_ROWS, (
            "Request failed, but the row count changed!"
        )

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

    def test_get_nonexistent_provider(self):
        self.populate_test_database(num_entries=8)
        response = self.client.get(f"/api/serviceProviders/{999}")
        self.assert404(response, f'Response body is : {response.json}')

        assert 'provider_name' not in response.json

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

    def test_get_service_provider_empty_db(self):
        response = self.client.get('/api/serviceProviders')
        self.assert200(response,
                       f"Response body is : {response.json}")
        assert len(response.json) == 0

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
        self.assert200(response, f'Response body is: {response.json}')
        
        assert 'provider_name' in response.json
        assert 'id' in response.json 

        assert response.json['provider_name'] == updated_provider["provider_name"]
        assert response.json['id'] == ids[0]

    def test_update_with_extra_data(self):
        '''
        Test that sending an update PUT request with extra 
        json entries in the body does not disrupt the update.

        We should safely ignore additional fields.
        '''
        ids = self.populate_test_database(num_entries=1)
        update_request = {
            "provider_name": "A brand new name",
            "extra_int": 1,
            "extra_bool": True,
            "extra_string": "I'm notta name"
        }
        response = self.client.put(
            f"/api/serviceProviders/{ids[0]}",
            json=update_request)
        
        self.assert200(response, f'Response body is: {response.json}')
        
        assert 'provider_name' in response.json
        assert 'id' in response.json
        assert 'extra_int' not in response.json, "We should not send back request json extra fields"
        assert 'extra_bool' not in response.json, "We should not send back request json extra fields"
        assert 'extra_string' not in response.json, "We should not send back request json extra fields"

        assert response.json['provider_name'] == update_request["provider_name"]
        assert response.json['id'] == ids[0]

    def test_update_nonexistant_service_provider(self):
        ids = self.populate_test_database(num_entries=1)
        failed_update_request = {
            "provider_name" : "Failed Update Name"
        }
        response = self.client.put(
            f"/api/serviceProviders/{999}",
            json=failed_update_request)
        self.assert404(response, f'Response body is: {response.json}')
        
        assert 'provider_name' not in response.json