# coding: utf-8
from __future__ import absolute_import

from openapi_server.test import BaseTestCase

class TestServiceProviderController(BaseTestCase):
    """ServiceProviderController integration test stubs"""

    def test_create_service_provider(self):
        """Test case for create_service_provider

        Create a housing program service provider
        """
        housing_program_service_provider = {
            "provider_name" : "provider_name"
        }
        response = self.client.post(
            '/api/serviceProviders',
            json=housing_program_service_provider)
        self.assertStatus(response, 201, 
                          f'Response body is: {response.get_data(as_text=True)}')

    def test_delete_service_provider(self):
        """Test case for delete_service_provider

        Delete a service provider
        """
        # Test database is empty at start. Create an entry to delete
        ids = self.populate_test_database(num_entries=1)
        response = self.client.delete(f'/api/serviceProviders/{ids[0]}')
        self.assert200(response, 
                       f'Response body is: {response.get_data(as_text=True)}')

    def test_get_service_provider_by_id(self):
        """Test case for get_service_provider_by_id

        Get details about a housing program service provider from an ID
        """
        ids = self.populate_test_database(num_entries=8)
        response = self.client.get(f"/api/serviceProviders/{ids[3]}")
        self.assert200(response,
                       f'Response body is : {response.get_data(as_text=True)}')

    def test_get_service_providers(self):
        """Test case for get_service_providers

        Get a list of housing program service providers.
        """
        expected_provider_count = 12
        self.populate_test_database(num_entries=expected_provider_count)
        
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.get('/api/serviceProviders')
        self.assert200(response,
                       f"Response body is : {response.json}")
        assert len(response.json) == expected_provider_count

    def test_update_service_provider(self):
        """Test case for update_service_provider

        Update a housing program service provider
        """
        ids = self.populate_test_database(num_entries=1)
        housing_program_service_provider = {
            "provider_name" : "provider_name"
        }
        response = self.client.put(
            f"/api/serviceProviders/{ids[0]}",
            json=housing_program_service_provider)
        self.assert200(response,
                       f'Response body is: {response.get_data(as_text=True)}')