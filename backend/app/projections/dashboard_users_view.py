from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, Mapped, mapped_column

from app.core.db import Base
from app.core.interfaces import DomainEvent
from app.modules.access.invite.contracts import (
    SendInviteRequestedDomainEvent,
    InviteSentDomainEvent,
    InviteSentFailedDomainEvent,
)


class DashboardUsersReadModel(Base):
    """
    id:
            type: string
    userName:
            type: string
    caseStatus:
            type: string
    coordinatorName:
            type: string
    userType:
            type: string
    lastUpdated:
            type: string
    notes:
            type: string
    """
    __tablename__ = "dashboard_users_read_model"
    user_id: Mapped[str] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    role: Mapped[str]
    status: Mapped[str]
    coordinator_name: Mapped[str]
    updated: Mapped[datetime]
    notes: Mapped[str]


# TODO: Add skip, limit, order
def view(session: Session) -> list[DashboardUsersReadModel]:
    stmt = select(DashboardUsersReadModel)
    return session.scalars(stmt).all()


class DashboardUsersProjection:

    def __init__(self, session_factory: Session):
        if session_factory is None:
            raise ValueError(
                "Expected a SQLAlchemy Session Factory (result of sessionmaker) but got none."
            )
        self._session_factory = session_factory

    def mutate(self, domain_event: DomainEvent):
        """Update the projection based on the domain event."""
        getattr(self, 'when_' + domain_event.__class__.__name__)(domain_event)

    def when_SendInviteRequestedDomainEvent(
            self, event: SendInviteRequestedDomainEvent):
        with self._session_factory.begin() as session:
            coordinator_name = f"{event.inviter_first_name} {event.inviter_last_name}"
            read_model = DashboardUsersReadModel(
                user_id="-1",
                email=event.email,
                name=event.last_name + ", " + event.first_name,
                role=event.invitee_role,
                status="Invite Pending",
                coordinator_name=coordinator_name,
                updated=event.requested_at,
                notes="",
            )
            session.add(read_model)

    def when_InviteSentDomainEvent(self, event: InviteSentDomainEvent):
        stmt = select(DashboardUsersReadModel).filter_by(email=event.email)
        with self._session_factory.begin() as session:
            read_model = session.scalars(stmt).one_or_none()
            if read_model:
                read_model.status = "Invite Sent"
