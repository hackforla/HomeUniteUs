from abc import abstractmethod
from typing import Any, Protocol 
from dataclasses import dataclass
import uuid
import datetime
import json


class DomainEvent:
    pass


class AppendOnlyStoreConcurrencyException(Exception):
    pass


class EventStore(Protocol):
    """Abstraction for something that stores domain events."""

    @abstractmethod
    def fetch(self, instance_id: uuid.UUID) -> list[DomainEvent]:
        raise NotImplementedError

    @abstractmethod
    def append(self, instance_id: uuid.UUID, new_events: list[DomainEvent],
               expected_version: int):
        raise NotImplementedError


@dataclass
class DomainEventStream:
    version: int
    events: list[DomainEvent]


class InMemoryEventStore:

    @dataclass
    class EventStoreRow:
        stream_id: uuid.UUID
        stream_version: int
        event_name: Any
        event_data: Any
        meta_data: dict[str, Any]
        stored_at: datetime.datetime

    def __init__(self):
        self.events: dict[int, list[self.EventStoreRow]] = {}

    def fetch(self, instance_id: uuid.UUID) -> DomainEventStream:
        stream = DomainEventStream(version=1, events=[])

        for row in self.events.get(instance_id, []):
            stream.version = row.stream_version
            stream.events.append(json.load(row.event_data, row.event_name))

        return stream

    def append(self, instance_id: uuid.UUID, new_events: list[DomainEvent],
               expected_version: int):
        rows = self.events.get(instance_id, [])

        version = max(row.stream_version for row in rows)
        if version != expected_version:
            raise AppendOnlyStoreConcurrencyException()

        rows.extend([
            self.EventStoreRow(
                stream_id=instance_id,
                stream_version=version + 1,
                event_name=type(e),
                event_data=json.dump(e),
                stored_at=datetime.datetime.utcnow(),
            ) for e in new_events
        ])

        self.events[instance_id] = rows
