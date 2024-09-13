from fastapi import APIRouter

from app.modules.access import auth_controller, user_controller
from app.modules.intake_profile import controller as intake_profile
from app.modules.tenant_housing_orgs import controller as housing_org


api_router = APIRouter()


api_router.include_router(
    auth_controller.router, prefix="/auth", tags=["auth"]
)
api_router.include_router(
    user_controller.router, prefix="/user", tags=["user"]
)
api_router.include_router(
    intake_profile.router, prefix="/intake-profile", tags=["intake_profile"]
)
api_router.include_router(
    housing_org.router, prefix="/housing-orgs", tags=["tenant_housing_orgs"]
)
