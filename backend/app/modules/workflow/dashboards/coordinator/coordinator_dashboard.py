from datetime import datetime

from fastapi import APIRouter, status
from pydantic import BaseModel, ConfigDict

from app.modules.deps import DbSessionDep, CoordinatorDep
import app.projections.dashboard_users_view as view

router = APIRouter()


class DashboardUsers(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    email: str
    name: str
    role: str
    status: str
    coordinator_name: str
    updated: datetime
    notes: str


class DashboardUsersView(BaseModel):
    dashboardItems: list[DashboardUsers]


@router.get("/coordinator/dashboard/all", status_code=status.HTTP_200_OK)
def get_dashboard_data(db_session: DbSessionDep,
                       coordinator: CoordinatorDep) -> DashboardUsersView:
    all_users = view.view(db_session)
    for u in all_users:
        print(u.user_id, u.email, u.name, u.status, u.role)
    return DashboardUsersView(dashboardItems=all_users)
