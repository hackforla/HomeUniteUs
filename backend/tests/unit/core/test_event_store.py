from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
import uuid

from app.core.event_store import DomainEvent, InMemoryEventStore
from app.core.sa_event_store import SqlAlchemyEventStore


@dataclass(frozen=True)
class Event1(DomainEvent):
    test: str
    date: datetime
    id: uuid.UUID
    values: set
    amount: Decimal
    complex_num: complex
    data: bytes


@dataclass(frozen=True)
class Event2(DomainEvent):
    test: int


def test_in_memory_event_store():
    events = [
        Event1(test="x",
               date=datetime.now(),
               id=uuid.uuid4(),
               values=set([1, 2, 3]),
               amount=Decimal("2.34"),
               complex_num=complex("1+2j"),
               data="test".encode("utf8")),
        Event2(test=1)
    ]
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


def test_sqlalchemy_event_store(session_factory):
    events = [
        Event1(test="x",
               date=datetime.now(),
               id=uuid.uuid4(),
               values=set([1, 2, 3]),
               amount=Decimal("2.34"),
               complex_num=complex("1+2j"),
               data="test".encode("utf8")),
        Event2(test=1)
    ]
    stream_id_1 = "test-stream-1"
    stream_id_2 = "test-stream-2"

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_stream = event_store.fetch(stream_id_1)
        assert len(event_stream.events) == 0
        assert event_stream.version == 0

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_stream = event_store.fetch(stream_id_2)
        assert len(event_stream.events) == 0
        assert event_stream.version == 0

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_store.append(stream_id_1, events, event_stream.version)

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_store.append(stream_id_2, events[::-1], event_stream.version)

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_stream = event_store.fetch(stream_id_1)
        assert len(event_stream.events) == 2
        assert event_stream.version == 2
        assert event_stream.events == events

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_store.append(stream_id_1, events, event_stream.version)

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_stream = event_store.fetch(stream_id_1)
        assert len(event_stream.events) == 4
        assert event_stream.version == 4
        assert event_stream.events == events + events

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_stream = event_store.fetch(stream_id_2)
        assert len(event_stream.events) == 2
        assert event_stream.version == 2
        assert event_stream.events == events[::-1]

    with session_factory() as session:
        event_store = SqlAlchemyEventStore(session)
        event_stream = event_store.fetch('Non-existing ID')
        assert len(event_stream.events) == 0
        assert event_stream.version == 0
