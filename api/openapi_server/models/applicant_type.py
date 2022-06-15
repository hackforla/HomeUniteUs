# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from openapi_server.models.base_model_ import Model
from openapi_server import util


class ApplicantType(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, applicant_type_description=None):  # noqa: E501
        """ApplicantType - a model defined in OpenAPI

        :param applicant_type_description: The applicant_type_description of this ApplicantType.  # noqa: E501
        :type applicant_type_description: str
        """
        self.openapi_types = {
            'applicant_type_description': str
        }

        self.attribute_map = {
            'applicant_type_description': 'applicant_type_description'
        }

        self._applicant_type_description = applicant_type_description

    @classmethod
    def from_dict(cls, dikt) -> 'ApplicantType':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The ApplicantType of this ApplicantType.  # noqa: E501
        :rtype: ApplicantType
        """
        return util.deserialize_model(dikt, cls)

    @property
    def applicant_type_description(self):
        """Gets the applicant_type_description of this ApplicantType.


        :return: The applicant_type_description of this ApplicantType.
        :rtype: str
        """
        return self._applicant_type_description

    @applicant_type_description.setter
    def applicant_type_description(self, applicant_type_description):
        """Sets the applicant_type_description of this ApplicantType.


        :param applicant_type_description: The applicant_type_description of this ApplicantType.
        :type applicant_type_description: str
        """
        if applicant_type_description is None:
            raise ValueError("Invalid value for `applicant_type_description`, must not be `None`")  # noqa: E501

        self._applicant_type_description = applicant_type_description
