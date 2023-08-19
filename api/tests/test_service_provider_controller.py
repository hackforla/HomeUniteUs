# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.database import HousingProgramServiceProvider  # noqa: E501
from . import BaseTestCase


class TestServiceProviderController(BaseTestCase):
    """ServiceProviderController integration test stubs"""

    def test_create_service_provider(self):
        """Test case for create_service_provider

        Create a housing program service provider
        """
        response = self.create_service_provider()
        self.assertStatus(response, 201,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_service_provider(self):
        """Test case for delete_service_provider

        Delete a service provider
        """
        # Test database is empty at start. Create an entry to delete
        ids = self.populate_test_database(num_entries=1)
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            f'/api/serviceProviders/{ids[0]}',
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_service_provider_by_id(self):
        """Test case for get_service_provider_by_id

        Get details about a housing program service provider from an ID
        """
        ids = self.populate_test_database(num_entries=8)
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            f"/api/serviceProviders/{ids[3]}",
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_service_providers(self):
        """Test case for get_service_providers

        Get a list of housing program service providers.
        """
        expected_provider_count = 12
        self.populate_test_database(num_entries=expected_provider_count)
        
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/serviceProviders',
            method='GET',
            headers=headers)
        response_str = response.data.decode('utf-8')  
        self.assert200(response,
                       f"Response body is : {response_str}")
        decoded_response = json.loads(response_str)
        assert len(decoded_response) == expected_provider_count

    def test_update_service_provider(self):
        """Test case for update_service_provider

        Update a housing program service provider
        """
        ids = self.populate_test_database(num_entries=1)
        housing_program_service_provider = {
  "provider_name" : "provider_name"
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            f"/api/serviceProviders/{ids[0]}",
            method='PUT',
            headers=headers,
            data=json.dumps(housing_program_service_provider),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))
