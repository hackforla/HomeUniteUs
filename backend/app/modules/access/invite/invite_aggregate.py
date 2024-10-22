"""The Invite aggregate handles invites into the system."""
from app.core.interfaces import DomainEvent
from ..schemas import UserRoleEnum
from .contracts import (
    InviteId,
    SendInviteRequestedDomainEvent,
    InviteSentDomainEvent,
    InviteAcceptedDomainEvent,
    InviteAlreadySentException,
    NotInvitedException,
)

from collections.abc import Callable
from datetime import datetime


class InviteState:
    """Holds the state of the Invite aggregate."""

    email: InviteId = None
    full_name: str = None
    invitee_role: UserRoleEnum = None
    inviter_id: str = None
    inviter_role: UserRoleEnum = None
    sent_at: datetime = None
    expire_at: datetime = None
    accepted_at: datetime = None
    pending_send_invite: bool = False
    invited: bool = False

    def __init__(self, domain_events: list[DomainEvent]):
        """Initialize state from given events."""
        for domain_event in domain_events:
            self.mutate(domain_event)

    def mutate(self, domain_event: DomainEvent):
        """Update the state based on the domain event."""
        getattr(self, 'when_' + domain_event.__class__.__name__)(domain_event)

    def when_SendInviteRequestedDomainEvent(
            self, event: SendInviteRequestedDomainEvent):
        """Update the state of an Invite."""
        self.email = event.email
        self.full_name = event.full_name
        self.invitee_role = event.invitee_role
        self.inviter_id = event.inviter_id
        self.inviter_role = event.inviter_role
        self.sent_at = event.sent_at

        self.pending_send_invite = True

    def when_InviteSentDomainEvent(self, event: InviteSentDomainEvent):
        """Update the state of an Invite."""
        self.invited = True

    def when_InviteAcceptedDomainEvent(self, event: InviteAcceptedDomainEvent):
        """Update state of an Invite."""
        self.accepted_at = event.accepted_at


class Invite:
    """Allows invites to be sent and managed by existing users."""

    def __init__(self, domain_events: list[DomainEvent]):
        """Initialize an Invite."""
        self._state = InviteState(domain_events)
        self._changes: list[DomainEvent] = []

    def _apply(self, domain_event: DomainEvent):
        self._state.mutate(domain_event)
        self._changes.append(domain_event)

    @property
    def changes(self):
        """See a view into the events that cause state changes."""
        return self._changes

    def send_invite(self, full_name: str, email: str,
                    invitee_role: UserRoleEnum, inviter_id: str,
                    inviter_role: UserRoleEnum, sent_at: datetime,
                    expire_policy: Callable[[datetime], datetime]):
        """Send an invite to the given recipient."""
        if self._state.pending_send_invite or self._state.invited:
            raise InviteAlreadySentException(email)

        e = SendInviteRequestedDomainEvent(email=email,
                                           full_name=full_name,
                                           invitee_role=invitee_role,
                                           inviter_id=inviter_id,
                                           inviter_role=inviter_role,
                                           sent_at=sent_at,
                                           expire_at=expire_policy(sent_at))
        self._apply(e)

    def process_sent_invite(self, email: str):
        """Process a sent invite."""
        e = InviteSentDomainEvent(email, self._state.full_name,
                                  self._state.expire_at)

        self._apply(e)

    def accept_invite(self, email: str, accepted_at: datetime):
        """Accept an invite."""
        if not self._state.invited:
            raise NotInvitedException(f"{email} was not invited.")

        e = InviteAcceptedDomainEvent(email=email, accepted_at=accepted_at)

        self._apply(e)
