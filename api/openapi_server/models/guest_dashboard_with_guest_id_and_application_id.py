# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from openapi_server.models.base_model_ import Model
from openapi_server import util



class GuestDashboardWithGuestIdAndApplicationId(Model):
    """
    Model for guest dashboard with guest_id and application_id
    """

    def __init__(self, guest_id=None, application_id=None):  # noqa: E501
        """GuestDashboardWithGuestIdAndApplicationId - a model defined in OpenAPI

        :param guest_id: The guest_id of this GuestDashboardWithGuestIdAndApplicationId.  # noqa: E501
        :type guest_id: int
        :param application_id: The application_id of this GuestDashboardWithGuestIdAndApplicationId.  # noqa: E501
        :type application_id: int
        """
        self.openapi_types = {
            'guest_id': int,
            'application_id': int
        }

        self.attribute_map = {
            'guest_id': 'guest_id',
            'application_id': 'application_id'
        }

        self._guest_id = guest_id
        self._application_id = application_id

    @classmethod
    def from_dict(cls, dikt) -> 'GuestDashboardWithGuestIdAndApplicationId':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The GuestDashboardWithGuestIdAndApplicationId of this GuestDashboardWithGuestIdAndApplicationId.  # noqa: E501
        :rtype: GuestDashboardWithGuestIdAndApplicationId
        """
        return util.deserialize_model(dikt, cls)

    @property
    def guest_id(self):
        """Gets the guest_id of this GuestDashboardWithGuestIdAndApplicationId.


        :return: The guest_id of this GuestDashboardWithGuestIdAndApplicationId.
        :rtype: int
        """
        return self._guest_id

    @guest_id.setter
    def guest_id(self, guest_id):
        """Sets the guest_id of this GuestDashboardWithGuestIdAndApplicationId.


        :param guest_id: The guest_id of this GuestDashboardWithGuestIdAndApplicationId.
        :type guest_id: int
        """
        if guest_id is None:
            raise ValueError("Invalid value for `guest_id`, must not be `None`")  # noqa: E501

        self._guest_id = guest_id

    @property
    def application_id(self):
        """Gets the application_id of this GuestDashboardWithGuestIdAndApplicationId.


        :return: The application_id of this GuestDashboardWithGuestIdAndApplicationId.
        :rtype: int
        """
        return self._application_id

    @application_id.setter
    def application_id(self, application_id):
        """Sets the application_id of this GuestDashboardWithGuestIdAndApplicationId.


        :param application_id: The application_id of this GuestDashboardWithGuestIdAndApplicationId.
        :type application_id: int
        """
        if application_id is None:
            raise ValueError("Invalid value for `application_id`, must not be `None`")  # noqa: E501

        self._application_id = application_id
