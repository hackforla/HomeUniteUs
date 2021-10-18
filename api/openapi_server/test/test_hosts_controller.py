# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.host import Host  # noqa: E501
from openapi_server.test import BaseTestCase


class TestHostsController(BaseTestCase):
    """HostsController integration test stubs"""

    def test_show_host_by_id(self):
        """Test case for show_host_by_id

        Info for a specific host
        """
        headers = { 
        }
        response = self.client.open(
            '/api/hosts/{host_id}'.format(host_id='host_id_example'),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()