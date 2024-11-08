"""The identities, classes, value objects that make up the Invite contracts."""
from app.core.interfaces import Identity, DomainCommand, DomainEvent
from ..models import EmailAddress, UserId
from ..schemas import UserRoleEnum

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class InviteId(Identity):
    """The identity of an Invite."""

    id: EmailAddress

    def __str__(self):
        """Represent Invite ID as a string."""
        return f"invite-{self.id}"


###############################################################################
# Domain Commands
###############################################################################


@dataclass
class SendInviteCommand(DomainCommand):
    """Command with data needed to send an Invite."""

    first_name: str
    middle_name: str | None
    last_name: str
    email: EmailAddress
    invitee_role: UserRoleEnum
    inviter_id: Identity
    inviter_role: UserRoleEnum
    requested_at: datetime


@dataclass
class ProcessSentInviteCommand(DomainCommand):
    """Command to process a sent invite."""

    user_id: UserId
    email: EmailAddress
    sent_at: datetime


@dataclass
class FailedSentInviteCommand(DomainCommand):
    """Command to indicate failed to send an invite."""

    email: EmailAddress
    reason: str


###############################################################################
# Domain Events
###############################################################################


@dataclass
class SendInviteRequestedDomainEvent(DomainEvent):
    """An Invite domain event."""

    email: EmailAddress
    first_name: str
    middle_name: str | None
    last_name: str
    invitee_role: UserRoleEnum
    inviter_id: str
    inviter_first_name: str
    inviter_middle_name: str | None
    inviter_last_name: str
    inviter_role: UserRoleEnum
    requested_at: datetime
    expire_at: datetime


@dataclass
class InviteSentDomainEvent(DomainEvent):
    """An Invite domain event."""

    user_id: UserId
    email: EmailAddress
    first_name: str
    middle_name: str | None
    last_name: str
    role: UserRoleEnum
    inviter_id: UserId
    sent_at: datetime


@dataclass
class UserCreatedDomainEvent(DomainEvent):
    """An Invite domain event."""

    user_id: UserId
    email: EmailAddress
    first_name: str
    middle_name: str | None
    last_name: str
    role: UserRoleEnum


@dataclass
class InviteAcceptedDomainEvent(DomainEvent):
    """An Invite was accepted domain event."""

    email: EmailAddress
    accepted_at: datetime


@dataclass
class InviteSentFailedDomainEvent(DomainEvent):
    """An Invite failed to send."""

    email: EmailAddress


###############################################################################
# Exceptions
###############################################################################


class InviteAlreadySentException(Exception):
    """Invite was already sent."""

    pass


class NotInvitedException(Exception):
    """An invite was accepted without an invitation."""

    pass
