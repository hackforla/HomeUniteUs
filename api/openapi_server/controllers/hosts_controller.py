import connexion
import six

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.host import Host  # noqa: E501
from openapi_server import util


def show_host_by_id(host_id):  # noqa: E501
    """Info for a specific host

     # noqa: E501

    :param host_id: The id of the host to retrieve
    :type host_id: str

    :rtype: Host
    """
    return 'do some magic!'
