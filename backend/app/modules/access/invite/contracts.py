"""The identities, classes, value objects that make up the Invite contracts."""
from app.core.interfaces import Identity, DomainCommand, DomainEvent
from ..schemas import UserRoleEnum

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
    invitee_role: UserRoleEnum
    inviter_id: str
    inviter_role: UserRoleEnum
    sent_at: datetime


@dataclass
class SendInviteRequestedDomainEvent(DomainEvent):
    """An Invite domain event."""

    email: str
    full_name: str
    invitee_role: UserRoleEnum
    inviter_id: str
    inviter_role: UserRoleEnum
    sent_at: datetime
    expire_at: datetime

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        """Deserialize from dict to the correct event class."""
        sent_at = datetime.fromisoformat(data['sent_at'])
        expire_at = datetime.fromisoformat(data['expire_at'])
        return cls(full_name=data['full_name'],
                   email=data['email'],
                   invitee_role=data['invitee_role'],
                   inviter_id=data['inviter_id'],
                   inviter_role=data['inviter_role'],
                   sent_at=sent_at,
                   expire_at=expire_at)


@dataclass
class InviteSentDomainEvent(DomainEvent):
    """An Invite domain event."""

    email: str
    full_name: str
    expire_at: datetime


@dataclass
class InviteAcceptedDomainEvent(DomainEvent):
    """An Invite was accepted domain event."""

    email: str
    accepted_at: datetime

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        """Deserialize from dict to the correct event class."""
        return cls(email=data['email'], accepted_at=data['accepted_at'])


class InviteAlreadySentException(Exception):
    """Invite was already sent."""

    pass


class NotInvitedException(Exception):
    """An invite was accepted without an invitation."""

    pass
