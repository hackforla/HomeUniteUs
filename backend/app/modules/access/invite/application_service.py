from collections.abc import Callable
from datetime import datetime

from app.core.event_store import EventStore
from app.core.interfaces import DomainCommand, Identity
from ..models import User
from .contracts import InviteId, SendInviteCommand, ProcessSentInviteCommand
from .invite_aggregate import Invite


class InviteService:

    def __init__(self, event_store: EventStore,
                 expire_policy: Callable[[datetime], datetime],
                 user_service: Callable[[Identity], User]):
        if event_store is None:
            raise ValueError("Event Store needed")
        if expire_policy is None:
            raise ValueError("Expire policy needed")
        if user_service is None:
            raise ValueError("User service needed")

        self._event_store = event_store
        self._expire_policy = expire_policy
        self._user_service = user_service

    def execute(self, command: DomainCommand):
        getattr(self, 'when_' + command.__class__.__name__)(command)

    def _update(self, id: InviteId, update: Callable[[Invite], None]):
        event_stream = self._event_store.fetch(id)
        invite = Invite(event_stream.events)
        update(invite)
        self._event_store.append(id, invite.changes, event_stream.version)

    def when_SendInviteCommand(self, cmd: SendInviteCommand):
        func: Callable[[str, str], int] = lambda invite: invite.send_invite(
            cmd.email, cmd.first_name, cmd.middle_name, cmd.last_name, cmd.
            invitee_role, cmd.inviter_id, cmd.inviter_role, cmd.requested_at,
            self._expire_policy, self._user_service)

        self._update(InviteId(id=cmd.email), func)

    def when_ProcessSentInviteCommand(self, cmd: ProcessSentInviteCommand):
        func: Callable[[str, str],
                       int] = lambda invite: invite.process_sent_invite(
                           cmd.user_id, cmd.email, cmd.sent_at)

        self._update(InviteId(id=cmd.email), func)
