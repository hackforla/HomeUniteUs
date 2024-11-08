"""The Invite aggregate handles invites into the system."""
from collections.abc import Callable
from datetime import datetime

from app.core.interfaces import DomainEvent
from ..models import EmailAddress, User, UserId
from ..schemas import UserRoleEnum
from .contracts import (
    InviteId,
    SendInviteRequestedDomainEvent,
    InviteSentDomainEvent,
    InviteAcceptedDomainEvent,
    InviteSentFailedDomainEvent,
    InviteAlreadySentException,
    NotInvitedException,
    UserCreatedDomainEvent,
)


class InviteState:
    """Holds the state of the Invite aggregate."""

    email: InviteId
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
    sent_at: datetime
    accepted_at: datetime

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
        self.first_name = event.first_name
        self.middle_name = event.middle_name
        self.last_name = event.last_name
        self.invitee_role = event.invitee_role
        self.inviter_id = event.inviter_id
        self.inviter_role = event.inviter_role
        self.requested_at = event.requested_at
        self.expire_at = event.expire_at

        self.pending_send_invite = True

    def when_InviteSentDomainEvent(self, event: InviteSentDomainEvent):
        """Update the state of an Invite."""
        self.sent_at = event.sent_at

        self.invited = True

    def when_UserCreatedDomainEvent(self, event: UserCreatedDomainEvent):
        """Update the state of an Invite."""
        pass

    def when_InviteAcceptedDomainEvent(self, event: InviteAcceptedDomainEvent):
        """Update state of an Invite."""
        self.accepted_at = event.accepted_at

    def when_InviteSentFailedDomainEvent(self,
                                         event: InviteSentFailedDomainEvent):
        """Update state of an Invite."""
        pass


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

    def send_invite(self, email: EmailAddress, first_name: str,
                    middle_name: str | None, last_name: str,
                    invitee_role: UserRoleEnum, inviter_id: str,
                    inviter_role: UserRoleEnum, requested_at: datetime,
                    expire_policy: Callable[[datetime], datetime],
                    user_service: Callable[[UserId], User]):
        """Send an invite to the given recipient."""
        if self._state.pending_send_invite or self._state.invited:
            raise InviteAlreadySentException(email)

        inviter = user_service(inviter_id)

        e = SendInviteRequestedDomainEvent(
            email=email,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            invitee_role=invitee_role,
            inviter_id=inviter_id,
            inviter_first_name=inviter.first_name,
            inviter_middle_name=inviter.middle_name,
            inviter_last_name=inviter.last_name,
            inviter_role=inviter_role,
            requested_at=requested_at,
            expire_at=expire_policy(requested_at))

        self._apply(e)

    def process_sent_invite(self, user_id: UserId, email: EmailAddress,
                            sent_at: datetime):
        """Process a sent invite."""
        e1 = InviteSentDomainEvent(user_id=user_id,
                                   email=email,
                                   first_name=self._state.first_name,
                                   middle_name=self._state.middle_name,
                                   last_name=self._state.last_name,
                                   role=self._state.invitee_role,
                                   inviter_id=self._state.inviter_id,
                                   sent_at=sent_at)

        e2 = UserCreatedDomainEvent(user_id=user_id,
                                    email=email,
                                    first_name=self._state.first_name,
                                    middle_name=self._state.middle_name,
                                    last_name=self._state.last_name,
                                    role=self._state.invitee_role)

        self._apply(e1)
        self._apply(e2)

    def accept_invite(self, email: str, accepted_at: datetime):
        """Accept an invite."""
        if not self._state.invited:
            raise NotInvitedException(f"{email} was not invited.")

        e = InviteAcceptedDomainEvent(email=email, accepted_at=accepted_at)

        self._apply(e)

    def failed_invite_send(self, email: str):
        """Send invite failed."""
        e = InviteSentFailedDomainEvent(email)

        self._apply(e)
