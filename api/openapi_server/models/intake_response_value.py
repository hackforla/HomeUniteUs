# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from openapi_server.models.base_model_ import Model
from openapi_server.models.intake_question import IntakeQuestion
from openapi_server import util

from openapi_server.models.intake_question import IntakeQuestion  # noqa: E501

class IntakeResponseValue(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, response_text=None, intake_question=None):  # noqa: E501
        """IntakeResponseValue - a model defined in OpenAPI

        :param response_text: The response_text of this IntakeResponseValue.  # noqa: E501
        :type response_text: str
        :param intake_question: The intake_question of this IntakeResponseValue.  # noqa: E501
        :type intake_question: IntakeQuestion
        """
        self.openapi_types = {
            'response_text': str,
            'intake_question': IntakeQuestion
        }

        self.attribute_map = {
            'response_text': 'response_text',
            'intake_question': 'intake_question'
        }

        self._response_text = response_text
        self._intake_question = intake_question

    @classmethod
    def from_dict(cls, dikt) -> 'IntakeResponseValue':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The IntakeResponseValue of this IntakeResponseValue.  # noqa: E501
        :rtype: IntakeResponseValue
        """
        return util.deserialize_model(dikt, cls)

    @property
    def response_text(self):
        """Gets the response_text of this IntakeResponseValue.


        :return: The response_text of this IntakeResponseValue.
        :rtype: str
        """
        return self._response_text

    @response_text.setter
    def response_text(self, response_text):
        """Sets the response_text of this IntakeResponseValue.


        :param response_text: The response_text of this IntakeResponseValue.
        :type response_text: str
        """
        if response_text is None:
            raise ValueError("Invalid value for `response_text`, must not be `None`")  # noqa: E501

        self._response_text = response_text

    @property
    def intake_question(self):
        """Gets the intake_question of this IntakeResponseValue.


        :return: The intake_question of this IntakeResponseValue.
        :rtype: IntakeQuestion
        """
        return self._intake_question

    @intake_question.setter
    def intake_question(self, intake_question):
        """Sets the intake_question of this IntakeResponseValue.


        :param intake_question: The intake_question of this IntakeResponseValue.
        :type intake_question: IntakeQuestion
        """
        if intake_question is None:
            raise ValueError("Invalid value for `intake_question`, must not be `None`")  # noqa: E501

        self._intake_question = intake_question