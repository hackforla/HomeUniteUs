"""SQLAlchemy models for the Housing Org."""

from typing import Annotated
from typing import List
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.core.db import Base

intpk = Annotated[int, mapped_column(primary_key=True)]


class HousingOrg(Base):
    __tablename__ = "housing_orgs"

    housing_org_id: Mapped[intpk]
    org_name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    programs: Mapped[List["HousingProgram"]] = relationship(
        back_populates="housing_org")

    def __repr__(self):
        return f"HousingOrg(housing_org_id={self.housing_org_id},org_name='{self.org_name}')"


class HousingProgram(Base):
    __tablename__ = "housing_programs"

    housing_program_id: Mapped[intpk]
    program_name: Mapped[str] = mapped_column(String, nullable=False)
    housing_org_id: Mapped[int] = mapped_column(
        ForeignKey('housing_orgs.housing_org_id'), nullable=False)
    housing_org: Mapped["HousingOrg"] = relationship(back_populates="programs")
