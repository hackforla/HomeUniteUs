# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO


from openapi_server.test import BaseTestCase


class TestGuestDashboardController(BaseTestCase):

    def test_get_guest_dashboard_tasks(self):
        """Test case for get_guest_ dashboard_tasks

        Get a list of tasks or steps to complete application in order to complete the matching process.
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/application_management/guests/{guest_id}/applications/{application_id}/tasks',
            method='GET',
            headers=headers)
        self.assert200(response,
                    'Response body is : ' + response.data.decode('utf-8'))

if __name__ == '__main__':
    unittest.main()