"""This module implements a SQLAlchemy-backed Event Store."""
from datetime import datetime, timezone
import importlib
import uuid

from sqlalchemy import String, Integer, DateTime, JSON, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, mapped_column, Mapped

from app.core.db import Base
from app.core.interfaces import Identity
from .event_store import (AppendOnlyStoreConcurrencyException, DomainEvent,
                          DomainEventStream)


class EventStreamEntry(Base):
    """SQLAlchemy model representing a row entry in the event_streams table."""

    __tablename__ = 'event_streams'

    # Primary key: composite (stream_id, stream_version)
    stream_id: Mapped[str] = mapped_column(String(36),
                                           primary_key=True,
                                           default=lambda: str(uuid.uuid4()))
    stream_version: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Event data and meta data columns
    event_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    meta_data: Mapped[dict] = mapped_column(JSON, nullable=True)

    # Timestamp of when the event was stored
    stored_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                                                nullable=False,
                                                default=func.now)

    def __repr__(self):
        """Representation of this object as a string."""
        return (
            f"<EventStreamEntry(stream_id={self.stream_id}, stream_version={self.stream_version}, "
            f"stored_at={self.stored_at})>")


class SqlAlchemyEventStore:
    """Implementation of an Event Store backed by SQLAlchemy."""

    def __init__(self, session: Session):
        """Instantiate the Event Store using a SQLAlchemy session."""
        if session is None:
            raise ValueError("A Session is required to construct this Event Store.")

        self.session = session

    def fetch(self, stream_id: Identity) -> DomainEventStream:
        """Fetch the event stream for the given stream."""
        stream = DomainEventStream(version=0, events=[])

        stream_entries = self.session.execute(
            select(EventStreamEntry.stream_version,
                   EventStreamEntry.event_data)).all()

        for stream_version, event_data in stream_entries:
            stream.version = stream_version
            stream.events.append(
                self._deserialize_event(event_data))

        return stream

    def append(self, stream_id: Identity, new_events: list[DomainEvent],
               expected_version: int):
        """Append list of events for the given stream.

        An AppendOnlyStoreConcurrencyException is raised when the given
        expected version is not the last version found in the database for
        the given stream. This means that another process has already
        updated the stream's events.
        """
        statement = select(func.max(
            EventStreamEntry.stream_version)).filter_by(
                stream_id=str(stream_id))
        version = self.session.scalars(statement).one_or_none()

        if version is None:
            version = 0
        if version != expected_version:
            raise AppendOnlyStoreConcurrencyException(
                f"version={version}, expected={expected_version}, stream_id={stream_id}"
            )

        stream_entries = [
            EventStreamEntry(
                stream_id=str(stream_id),
                stream_version=version + inc,
                event_data=e.to_dict(),
                meta_data={},
                stored_at=datetime.now(tz=timezone.utc),
            ) for inc, e in enumerate(new_events, start=1)
        ]

        self.session.add_all(stream_entries)
        try:
            self.session.commit()
        except IntegrityError:
            self.session.rollback()
            raise ValueError(
                "Failed to append events due to database integrity error (likely a version conflict)."
            )

    def _deserialize_event(self, event_data):
        """Convert a dictionary back to the correct event class."""
        fully_qualified_type = event_data["type"]
        module_name, class_name = fully_qualified_type.rsplit(".", 1)

        # Dynamically import the module and get the class
        module = importlib.import_module(module_name)
        event_class = getattr(module, class_name)

        return event_class.from_dict(event_data["data"])
