import connexion
import six

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.guest import Guest  # noqa: E501
from openapi_server import util


def show_guest_by_id(guest_id):  # noqa: E501
    """Info for a specific guest

     # noqa: E501

    :param guest_id: The id of the guest to retrieve
    :type guest_id: str

    :rtype: Guest
    """
    return 'do some magic!'
