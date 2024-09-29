from fastapi import APIRouter

from app.modules.access import auth_controller, hosts_controller, users_controller
from app.modules.intake_profile import controller as intake_profile
from app.modules.tenant_housing_orgs import controller as housing_org
from app.modules.workflow.dashboards.coordinator import coordinator_dashboard

api_router = APIRouter()

api_router.include_router(auth_controller.router,
                          prefix="/auth",
                          tags=["auth"])
api_router.include_router(hosts_controller.router,
                          prefix="/hosts",
                          tags=["hosts"])
api_router.include_router(users_controller.router,
                          prefix="/users",
                          tags=["users"])
api_router.include_router(intake_profile.router,
                          prefix="/intake-profile",
                          tags=["intake_profile"])
api_router.include_router(housing_org.router,
                          prefix="/housing-orgs",
                          tags=["tenant_housing_orgs"])
api_router.include_router(coordinator_dashboard.router, tags=["coordinator"])
