"""This module implements a SQLAlchemy-backed Event Store."""
from datetime import datetime, timezone
import importlib
import json
import uuid

from sqlalchemy import String, Integer, DateTime, JSON, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, mapped_column, Mapped

from app.core.db import Base
from app.core.interfaces import Identity
from app.core.event_store import (AppendOnlyStoreConcurrencyException,
                                  DomainEvent, DomainEventStream)
import app.core.message_bus as message_bus


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

    def __init__(self, session_factory: Session):
        """Instantiate the Event Store using a SQLAlchemy Session factory."""
        if session_factory is None:
            raise ValueError(
                "A Session factory is required to construct this Event Store.")

        self.session_factory = session_factory

    def fetch(self, stream_id: Identity) -> DomainEventStream:
        """Fetch the event stream for the given stream."""
        stream = DomainEventStream(version=0, events=[])

        statement = select(EventStreamEntry.stream_version,
                           EventStreamEntry.event_data).filter_by(
                               stream_id=str(stream_id)).order_by(
                                   EventStreamEntry.stream_version)
        with self.session_factory() as session:
            stream_entries = session.execute(statement).all()

        for stream_version, event_data in stream_entries:
            stream.version = stream_version
            stream.events.append(self._deserialize_event(event_data))

        return stream

    def append(self, stream_id: Identity, new_events: list[DomainEvent],
               expected_version: int):
        """Append list of events for the given stream.

        An AppendOnlyStoreConcurrencyException is raised when the given
        expected version is not the last version found in the database for
        the given stream. This means that another process has already
        updated the stream's events.
        """
        with self.session_factory() as session:
            statement = select(func.max(
                EventStreamEntry.stream_version)).filter_by(
                    stream_id=str(stream_id))
            version = session.scalars(statement).one_or_none()

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

            session.add_all(stream_entries)
            try:
                session.commit()
                for e in new_events:
                    message_bus.handle(e)
            except IntegrityError:
                session.rollback()
                raise AppendOnlyStoreConcurrencyException(
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
