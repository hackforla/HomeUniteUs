"""Defines a SQLAlchemy-backed Repository for the IntakeProfile."""
from typing import Optional

from sqlalchemy.orm import Session
from model import IntakeProfile


class IntakeProfileRepository:
    """Repository backed by SQLAlchemy for data persistence."""

    def __init__(self, session: Session):
        """Initialize an IntakeProfile Repository with a SQLAlchemy Session.

        An Exception will be thrown if a Session is not used to create an
        object of this class.
        """
        if session is None:
            raise Exception(
                "IntakeProfileRepository is not valid without a SQLAlchemy Session"
            )
        self.session = session

    def add(self, intake_profile: IntakeProfile):
        """Add the given IntakeProfile to the repository."""
        with self.session as session:
            session.add(intake_profile)

    def get(self, intake_profile_id: int) -> Optional[IntakeProfile]:
        """Get an IntakeProfile with the given identifier."""
        return self.session.query(IntakeProfile).get(intake_profile_id)
