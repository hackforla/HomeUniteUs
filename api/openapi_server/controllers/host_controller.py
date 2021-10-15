import connexion
import six

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.host import Host  # noqa: E501
from openapi_server import util


def create_host():  # noqa: E501
    """Create a host

     # noqa: E501


    :rtype: None
    """
    return 'do some magic!'


def delete_host(host_id):  # noqa: E501
    """Deletes a host

    Delete a host # noqa: E501

    :param host_id: host id to delete
    :type host_id: int

    :rtype: None
    """
    return 'do some magic!'


def list_hosts(limit=None):  # noqa: E501
    """List all hosts

    See the full list of hosts # noqa: E501

    :param limit: How many items to return at one time (max 100)
    :type limit: int

    :rtype: List[Host]
    """
    return 'do some magic!'


def update_host(host):  # noqa: E501
    """Update a host

    Update a host # noqa: E501

    :param host: Update host
    :type host: dict | bytes

    :rtype: Host
    """
    if connexion.request.is_json:
        host = Host.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def upload_host_image(host_id, additional_metadata=None, body=None):  # noqa: E501
    """uploads an image

     # noqa: E501

    :param host_id: ID of host to update
    :type host_id: str
    :param additional_metadata: Additional Metadata
    :type additional_metadata: str
    :param body: 
    :type body: str

    :rtype: ApiResponse
    """
    return 'do some magic!'
