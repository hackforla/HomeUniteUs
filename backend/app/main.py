from datetime import timedelta
from contextlib import asynccontextmanager

from fastapi import FastAPI

from .health import health_router
from app.modules.router import api_router
import app.core.db as db
import app.core.config as config
from app.core.sa_event_store import SqlAlchemyEventStore
import app.core.message_bus as message_bus

from app.modules.deps import get_cognito_client
from app.modules.access.user_repo import UserRepository
from app.modules.access.invite.contracts import (
    SendInviteCommand, ProcessSentInviteCommand, FailedSentInviteCommand,
    SendInviteRequestedDomainEvent, InviteSentDomainEvent,
    UserCreatedDomainEvent,
    InviteAcceptedDomainEvent, InviteSentFailedDomainEvent)
from app.modules.access.invite.application_service import InviteService
from app.modules.access.invite.processor import CognitoInviteUserProcessor
from app.projections.dashboard_users_view import DashboardUsersProjection


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = config.get_settings()
    engine = db.db_engine(settings)
    import app.seed
    db.init_db(engine)
    yield


settings = config.get_settings()
engine = db.db_engine(settings)
session_factory = db.db_session_factory(engine)
cognito_client = get_cognito_client(settings)
event_store = SqlAlchemyEventStore(session_factory)
user_repo = UserRepository(session_factory)
invite_service = InviteService(
    event_store,
    expire_policy=lambda requested_at: requested_at + timedelta(days=7),
    user_service=user_repo.get_user_by_id)
dashboard_users_projection = DashboardUsersProjection(session_factory)

message_bus.COMMAND_HANDLERS = {
    SendInviteCommand: [invite_service],
    ProcessSentInviteCommand: [invite_service],
    FailedSentInviteCommand: [invite_service],
}

message_bus.EVENT_HANDLERS = {
    SendInviteRequestedDomainEvent: [
        dashboard_users_projection,
        CognitoInviteUserProcessor(cognito_client, settings),
    ],
    InviteSentDomainEvent: [dashboard_users_projection],
    UserCreatedDomainEvent: [user_repo],
    InviteAcceptedDomainEvent: [],
    InviteSentFailedDomainEvent: [dashboard_users_projection],
}

app = FastAPI(lifespan=lifespan)

app.include_router(api_router, prefix="/api")
app.include_router(health_router, prefix="/api/health", tags=["health"])
