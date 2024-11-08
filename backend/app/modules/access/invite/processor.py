from datetime import datetime, timezone
import logging
import random

from botocore.exceptions import ClientError

from app.core.config import Settings
from app.core.interfaces import DomainEvent
import app.core.message_bus as message_bus
from app.modules.access.models import UserId
from app.modules.access.invite.contracts import (
    SendInviteRequestedDomainEvent, ProcessSentInviteCommand,
    FailedSentInviteCommand)

NUMBERS = '0123456789'
LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
SYMBOLS = '.-_~'

log = logging.Logger(__name__)


class CognitoInviteUserProcessor:

    def __init__(self, cognito_client, settings: Settings):
        if cognito_client is None:
            raise ValueError("Expected a Cognito client but got none.")
        if settings is None:
            raise ValueError("Expected Settings but got none.")
        self._cognito_client = cognito_client
        self._settings = settings

    def mutate(self, domain_event: DomainEvent):
        """Process domain event."""
        getattr(self, 'when_' + domain_event.__class__.__name__)(domain_event)

    def when_SendInviteRequestedDomainEvent(
            self, event: SendInviteRequestedDomainEvent):
        """Send the invite via Cognito create user."""

        invite_to_send = event
        cognito_client = self._cognito_client
        settings = self._settings

        temporary_password = ''.join(random.choices(NUMBERS, k=3)) + ''.join(
            random.choices(LOWERCASE_CHARS, k=3)) + ''.join(
                random.choices(SYMBOLS, k=1)) + ''.join(
                    random.choices(UPPERCASE_CHARS, k=3))

        try:
            response = cognito_client.admin_create_user(
                UserPoolId=settings.COGNITO_USER_POOL_ID,
                Username=invite_to_send.email,
                TemporaryPassword=temporary_password,
                ClientMetadata={'url': settings.ROOT_URL},
                DesiredDeliveryMediums=["EMAIL"])

            sub = [
                s['Value'] for s in response['User']['Attributes']
                if s['Name'] == 'sub'
            ]
            guest_id = sub[0]

            cmd = ProcessSentInviteCommand(
                user_id=UserId(guest_id),
                email=invite_to_send.email,
                sent_at=datetime.now(timezone.utc),
            )
            message_bus.handle(cmd)
        except ClientError as error:
            if error.response['Error']['Code'] == 'UsernameExistsException':
                log.error(
                    f'User with email {invite_to_send.email} already exists.')
                cmd = FailedSentInviteCommand(
                    invite_to_send.email,
                    "User with this email exists already.")
            else:
                log.error(f'Cognito AdminCreateUser: ' +
                          error.response['Code'] + " " +
                          error.response['Message'])
                cmd = FailedSentInviteCommand(invite_to_send.email,
                                              "Programming error.")

            message_bus.handle(cmd)
        except IndexError:
            cmd = FailedSentInviteCommand(invite_to_send.email,
                                          "Programming error.")
            message_bus.handle(cmd)
