"""Pydantic schemas for the Housing Org."""
from pydantic import BaseModel, ConfigDict


class HousingOrg(BaseModel):
    housing_org_id: int | None = None
    org_name: str

    model_config = ConfigDict(from_attributes=True)
