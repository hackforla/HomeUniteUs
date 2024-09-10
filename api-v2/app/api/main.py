from fastapi import APIRouter

from app.api.routes import auth
from app.intake_profile import controller as intake_profile
from app.tenant_housing_orgs import controller as housing_org


api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(intake_profile.router, prefix="/intake-profile", tags=["intake_profile"])
api_router.include_router(housing_org.router, prefix="/housing-orgs", tags=["tenant_housing_orgs"])
