from app.core.event_store import DomainEvent, InMemoryEventStore

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Event1(DomainEvent):
    test: str

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(test=data['test'])


@dataclass(frozen=True)
class Event2(DomainEvent):
    test: int

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(test=int(data['test']))


def test_in_memory_event_store():
    events = [Event1("x"), Event2(1)]
    stream_id = "test-stream"

    event_store = InMemoryEventStore()

    event_stream = event_store.fetch(stream_id)
    assert len(event_stream.events) == 0
    assert event_stream.version == 0

    event_store.append(stream_id, events, event_stream.version)
    event_stream = event_store.fetch(stream_id)
    assert len(event_stream.events) == 2
    assert event_stream.version == 2
    assert event_stream.events == events

    event_store.append(stream_id, events, event_stream.version)
    event_stream = event_store.fetch(stream_id)
    assert len(event_stream.events) == 4
    assert event_stream.version == 4
    assert event_stream.events == events + events
