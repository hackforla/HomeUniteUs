# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.host import Host  # noqa: E501
from openapi_server.test import BaseTestCase


class TestHostController(BaseTestCase):
    """HostController integration test stubs"""

    def test_create_host(self):
        """Test case for create_host

        Create a host
        """
        headers = { 
        }
        response = self.client.open(
            '/api/hosts',
            method='POST',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_host(self):
        """Test case for delete_host

        Deletes a host
        """
        headers = { 
        }
        response = self.client.open(
            '/api/hosts'.format(host_id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_hosts(self):
        """Test case for list_hosts

        List all hosts
        """
        query_string = [('limit', 56)]
        headers = { 
        }
        response = self.client.open(
            '/api/hosts',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_host(self):
        """Test case for update_host

        Update a host
        """
        host = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "name",
  "id" : 0,
  "tag" : "tag"
}
        headers = { 
        }
        response = self.client.open(
            '/api/hosts',
            method='PUT',
            headers=headers,
            data=json.dumps(host),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    @unittest.skip("application/octet-stream not supported by Connexion")
    def test_upload_host_image(self):
        """Test case for upload_host_image

        uploads an image
        """
        body = '/path/to/file'
        query_string = [('additionalMetadata', 'additional_metadata_example')]
        headers = { 
        }
        response = self.client.open(
            '/api/hosts/{host_id}/uploadImage'.format(host_id='host_id_example'),
            method='POST',
            headers=headers,
            data=json.dumps(body),
            content_type='application/octet-stream',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
