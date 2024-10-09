from app.core.event_store import DomainEvent, InMemoryEventStore

import datetime
from dataclasses import dataclass
import uuid

@dataclass
class InviteSentDomainEvent(DomainEvent):
    email: str
    invitee_role: str
    token: str
    sent_at: datetime.datetime
    sent_by: str

@dataclass
class InviteState:
    id: uuid.UUID
    invited: bool
    accepted: bool

class Invite:

    def __init__(self, domain_events: list[DomainEvent]):
        self.state = InviteState(invited=False, accepted=False)
        self.changes: list[DomainEvent] = []
        for domain_event in domain_events:
            self.mutate(domain_event)

    def apply(self, domain_event: DomainEvent):
        self.changes.append(domain_event)
        self.mutate(domain_event)

    def mutate(self, domain_event: DomainEvent):
        self.__dict__['when_'+domain_event.__class__.__name__](domain_event)

    def when_InviteSentDomainEvent(self, event: InviteSentDomainEvent):
        self.state.invited = True

    def send_invite(self, full_name: str, email: str, invitee_role: str, sent_by: str):
        pass

def test_send_invite():
    event_store = InMemoryEventStore()
