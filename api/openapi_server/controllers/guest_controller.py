import connexion
import six

from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.guest import Guest  # noqa: E501
from openapi_server import util


def create_guest():  # noqa: E501
    """Create a guest

     # noqa: E501


    :rtype: None
    """
    return 'do some magic!'


def delete_guest(guest_id):  # noqa: E501
    """Deletes a guest

    Delete a guest # noqa: E501

    :param guest_id: guest id to delete
    :type guest_id: int

    :rtype: None
    """
    return 'do some magic!'


def list_guests(limit=None):  # noqa: E501
    """List all guests

    See the full list of guests # noqa: E501

    :param limit: How many items to return at one time (max 100)
    :type limit: int

    :rtype: List[Guest]
    """
    return 'do some magic!'


def update_guest(guest):  # noqa: E501
    """Update a guest

    Update a guest # noqa: E501

    :param guest: Update guest
    :type guest: dict | bytes

    :rtype: Guest
    """
    if connexion.request.is_json:
        guest = Guest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def upload_guest_image(guest_id, additional_metadata=None, body=None):  # noqa: E501
    """uploads an image

     # noqa: E501

    :param guest_id: ID of guest to update
    :type guest_id: str
    :param additional_metadata: Additional Metadata
    :type additional_metadata: str
    :param body: 
    :type body: str

    :rtype: ApiResponse
    """
    return 'do some magic!'
