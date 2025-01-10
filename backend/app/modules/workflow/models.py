from typing import Annotated
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.core.db import Base

intpk = Annotated[int, mapped_column(primary_key=True)]


class UnmatchedGuestCase(Base):
    __tablename__ = "unmatched_guest_case"
    id: Mapped[intpk]
    guest_id: Mapped[int] = mapped_column(ForeignKey('user.id'),
                                          nullable=False)
    coordinator_id: Mapped[int] = mapped_column(ForeignKey('user.id'),
                                                nullable=False)
    status_id: Mapped[int] = mapped_column(
        ForeignKey('unmatched_guest_case_status.id'), nullable=False)
    status: Mapped["UnmatchedGuestCaseStatus"] = relationship(
        back_populates="cases")


class UnmatchedGuestCaseStatus(Base):
    __tablename__ = "unmatched_guest_case_status"
    id: Mapped[intpk]
    status_text: Mapped[str] = mapped_column(nullable=False, unique=True)
    cases: Mapped["UnmatchedGuestCase"] = relationship(back_populates="status")
