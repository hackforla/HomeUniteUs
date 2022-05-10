# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.database import HousingProgramServiceProvider  # noqa: E501
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
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/api/serviceProviders',
            method='POST',
            headers=headers,
            data=json.dumps(housing_program_service_provider),
            content_type='application/json')
        self.assertStatus(response, 201,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_service_provider(self):
        """Test case for delete_service_provider

        Delete a service provider
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/serviceProviders/{provider_id}'.format(provider_id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_service_provider_by_id(self):
        """Test case for get_service_provider_by_id

        Get details about a housing program service provider from an ID
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/serviceProviders/{provider_id}'.format(provider_id=56),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_service_providers(self):
        """Test case for get_service_providers

        Get a list of housing program service providers.
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/serviceProviders',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_service_provider(self):
        """Test case for update_service_provider

        Update a housing program service provider
        """
        housing_program_service_provider = {
  "provider_name" : "provider_name"
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/api/serviceProviders/{provider_id}'.format(provider_id=56),
            method='PUT',
            headers=headers,
            data=json.dumps(housing_program_service_provider),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
