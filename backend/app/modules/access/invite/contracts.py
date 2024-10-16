"""The identities, classes, value objects that make up the Invite contracts."""
from app.core.interfaces import Identity, DomainCommand, DomainEvent

from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class InviteId(Identity):
    """The identity of an Invite."""

    id: str

    def __str__(self):
        """Represent Invite ID as a string."""
        return f"invite-{self.id}"


class SendInviteCommand(DomainCommand):
    """Command with data needed to send an Invite."""

    full_name: str
    email: str
    invitee_role: str
    sent_by: str
    sent_at: datetime


@dataclass
class InviteSentDomainEvent(DomainEvent):
    """An Invite domain event."""

    full_name: str
    email: str
    invitee_role: str
    sent_by: str
    sent_at: datetime
    token: str

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        """Deserialize from dict to the correct event class."""
        sent_at = datetime.fromisoformat(data['sent_at'])
        return cls(full_name=data['full_name'],
                   email=data['email'],
                   invitee_role=data['invitee_role'],
                   sent_by=data['sent_by'],
                   sent_at=sent_at,
                   token=data['token'])


@dataclass
class InviteAcceptedDomainEvent(DomainEvent):
    """An Invite was accepted domain event."""

    email: str
    token: str

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        """Deserialize from dict to the correct event class."""
        return cls(email=data['email'], token=data['token'])


class InviteAlreadySentException(Exception):
    """Invite was already sent."""

    pass


class UninvitedException(Exception):
    """An invite was accepted without an invitation."""

    pass
