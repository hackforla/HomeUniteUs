# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.guest import Guest  # noqa: E501
from openapi_server.test import BaseTestCase


class TestGuestController(BaseTestCase):
    """GuestController integration test stubs"""

    def test_create_guest(self):
        """Test case for create_guest

        Create a guest
        """
        headers = { 
        }
        response = self.client.open(
            '/api/guests',
            method='POST',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_guest(self):
        """Test case for delete_guest

        Deletes a guest
        """
        headers = { 
        }
        response = self.client.open(
            '/api/guests'.format(guest_id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_guests(self):
        """Test case for list_guests

        List all guests
        """
        query_string = [('limit', 56)]
        headers = { 
        }
        response = self.client.open(
            '/api/guests',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_guest(self):
        """Test case for update_guest

        Update a guest
        """
        guest = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "name",
  "id" : 0,
  "tag" : "tag"
}
        headers = { 
        }
        response = self.client.open(
            '/api/guests',
            method='PUT',
            headers=headers,
            data=json.dumps(guest),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    @unittest.skip("application/octet-stream not supported by Connexion")
    def test_upload_guest_image(self):
        """Test case for upload_guest_image

        uploads an image
        """
        body = '/path/to/file'
        query_string = [('additionalMetadata', 'additional_metadata_example')]
        headers = { 
        }
        response = self.client.open(
            '/api/guests/{guest_id}/uploadImage'.format(guest_id='guest_id_example'),
            method='POST',
            headers=headers,
            data=json.dumps(body),
            content_type='application/octet-stream',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
