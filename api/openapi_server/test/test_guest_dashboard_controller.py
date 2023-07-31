# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.database import GuestApplications  # noqa: E501
from openapi_server.test import BaseTestCase

class TestGuestDashboardController(BaseTestCase):
    """GuestDashboardController integration test stubs"""
   
    def test_get_guest_dashboard_by_id_and_application_id(self):
        """Test case for get_guest_dashboard_by_id_and_application_id

        Get tasks from guest dashboard 
        """
        guest_id = 1
        application_id = 1
        # guest_dashboards = self.populate_test_database_for_guest_dashboard(num_entries=5)

        headers = {
            'Accept': 'application/json',
        }
        response = self.client.open(
            f"api/application_management/guests/{guest_id}/applications/{application_id}/tasks",
            method='GET',
            headers=headers)
        self.assert200(response, 'Response body is : ' + response.data.decode('utf-8'))
