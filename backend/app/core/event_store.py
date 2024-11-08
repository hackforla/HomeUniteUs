from abc import abstractmethod
from dataclasses import dataclass
from datetime import datetime, timezone
import importlib
import json
from typing import Any, Protocol

from .interfaces import Identity, DomainEvent


class AppendOnlyStoreConcurrencyException(Exception):
    pass


@dataclass
class DomainEventStream:
    version: int
    events: list[DomainEvent]


class EventStore(Protocol):
    """Abstraction for something that stores domain events."""

    @abstractmethod
    def fetch(self, stream_id: Identity) -> DomainEventStream:
        raise NotImplementedError

    @abstractmethod
    def append(self, stream_id: Identity, new_events: list[DomainEvent],
               expected_version: int):
        raise NotImplementedError


class InMemoryEventStore:

    @dataclass
    class EventStreamEntry:
        stream_id: str
        stream_version: int
        event_data: str
        meta_data: dict[str, Any]
        stored_at: datetime

    def __init__(self):
        self.events: dict[int, list[self.EventStreamEntry]] = {}

    def fetch(self, stream_id: Identity) -> DomainEventStream:
        stream = DomainEventStream(version=0, events=[])

        for stream_entry in self.events.get(stream_id, []):
            stream.version = stream_entry.stream_version
            stream.events.append(
                self._deserialize_event(json.loads(stream_entry.event_data)))

        return stream

    def append(self, stream_id: Identity, new_events: list[DomainEvent],
               expected_version: int):
        stream_entries = self.events.get(stream_id, [])

        version = len(stream_entries)
        if version != expected_version:
            raise AppendOnlyStoreConcurrencyException(
                f"version={version}, expected={expected_version}")

        stream_entries.extend([
            self.EventStreamEntry(
                stream_id=str(stream_id),
                stream_version=version + inc,
                event_data=json.dumps(e.to_dict(), default=str),
                meta_data={},
                stored_at=datetime.now(tz=timezone.utc),
            ) for inc, e in enumerate(new_events, start=1)
        ])

        self.events[stream_id] = stream_entries

    def _deserialize_event(self, event_data):
        """Convert a dictionary back to the correct event class."""
        fully_qualified_type = event_data["type"]
        module_name, class_name = fully_qualified_type.rsplit(".", 1)

        # Dynamically import the module and get the class
        module = importlib.import_module(module_name)
        event_class = getattr(module, class_name)

        return event_class.from_dict(event_data["data"])
