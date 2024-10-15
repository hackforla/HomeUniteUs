"""The Invite aggregate handles invites into the system."""
from app.core.interfaces import DomainEvent
from .contracts import (
    InviteId,
    InviteSentDomainEvent,
    InviteAcceptedDomainEvent,
    InviteAlreadySentException,
    UninvitedException,
)

from collections.abc import Callable
from datetime import datetime, timezone


class InviteState:
    """Holds the state of the Invite aggregate."""

    id: InviteId
    full_name: str = None
    email: str = None
    invitee_role: str = None
    sent_by: str = None
    sent_at: datetime = None
    invited: bool = False
    accepted: bool = False

    def __init__(self, domain_events: list[DomainEvent]):
        """Initialize state from given events."""
        for domain_event in domain_events:
            self.mutate(domain_event)

    def mutate(self, domain_event: DomainEvent):
        """Update the state based on the domain event."""
        getattr(self, 'when_' + domain_event.__class__.__name__)(domain_event)

    def when_InviteSentDomainEvent(self, event: InviteSentDomainEvent):
        """Update the state of an Invite."""
        self.full_name = event.full_name
        self.email = event.email
        self.invitee_role = event.invitee_role
        self.sent_by = event.sent_by
        self.sent_at = event.sent_at
        self.invited = True

    def when_InviteAcceptedDomainEvent(self, event: InviteAcceptedDomainEvent):
        """Update state of an Invite."""
        self.accepted = True

class Invite:
    """Allows invites to be sent and managed by existing users."""

    def __init__(self, domain_events: list[DomainEvent]):
        """Initialize an Invite."""
        self._state = InviteState(domain_events)
        self._changes: list[DomainEvent] = []

    def _apply(self, domain_event: DomainEvent):
        self._state.mutate(domain_event)
        self._changes.append(domain_event)

    def changes(self):
        """See a view into the events that cause state changes."""
        return self._changes

    def send_invite(self, full_name: str, email: str, invitee_role: str,
                    sent_by: str, token_gen: Callable[[str], str]):
        """Send an invite to the given recipient."""
        if self._state.invited:
            raise InviteAlreadySentException(email)

        e = InviteSentDomainEvent(full_name=full_name,
                                  email=email,
                                  invitee_role=invitee_role,
                                  sent_by=sent_by,
                                  sent_at=datetime.now(timezone.utc),
                                  token=token_gen(email))
        self._apply(e)

    def accept_invite(self, email: str, token: str):
        """Accept an invite."""
        if not self._state.invited:
            raise UninvitedException(f"{email} was not invited.")

        e = InviteAcceptedDomainEvent(email=email, token=token)

        self._apply(e)
