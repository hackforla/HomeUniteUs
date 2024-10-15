from .interfaces import Identity, DomainEvent
from abc import abstractmethod
from typing import Any, Protocol
from dataclasses import dataclass
from datetime import datetime, timezone
import importlib
import json


class AppendOnlyStoreConcurrencyException(Exception):
    pass


class EventStore(Protocol):
    """Abstraction for something that stores domain events."""

    @abstractmethod
    def fetch(self, stream_id: Identity) -> list[DomainEvent]:
        raise NotImplementedError

    @abstractmethod
    def append(self, stream_id: Identity, new_events: list[DomainEvent],
               expected_version: int):
        raise NotImplementedError


@dataclass
class DomainEventStream:
    version: int
    events: list[DomainEvent]


class InMemoryEventStore:

    @dataclass
    class EventStoreRow:
        stream_id: str
        stream_version: int
        event_data: str
        meta_data: dict[str, Any]
        stored_at: datetime

    def __init__(self):
        self.events: dict[int, list[self.EventStoreRow]] = {}

    def fetch(self, stream_id: Identity) -> DomainEventStream:
        stream = DomainEventStream(version=0, events=[])

        for row in self.events.get(stream_id, []):
            stream.version = row.stream_version
            stream.events.append(
                self._deserialize_event(json.loads(row.event_data)))

        return stream

    def append(self, stream_id: Identity, new_events: list[DomainEvent],
               expected_version: int):
        rows = self.events.get(stream_id, [])

        version = len(rows)
        if version != expected_version:
            raise AppendOnlyStoreConcurrencyException(
                f"version={version}, expected={expected_version}")

        rows.extend([
            self.EventStoreRow(
                stream_id=str(stream_id),
                stream_version=version + inc,
                event_data=json.dumps(e.to_dict(), default=str),
                meta_data={},
                stored_at=datetime.now(tz=timezone.utc),
            ) for inc, e in enumerate(new_events, start=1)
        ])

        self.events[stream_id] = rows

    def _deserialize_event(self, event_data):
        """Convert a dictionary back to the correct event class."""
        fully_qualified_type = event_data["type"]
        module_name, class_name = fully_qualified_type.rsplit(".", 1)

        # Dynamically import the module and get the class
        module = importlib.import_module(module_name)
        event_class = getattr(module, class_name)

        return event_class.from_dict(event_data["data"])
