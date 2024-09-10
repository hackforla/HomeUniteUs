"""Model."""

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.orm import validates as validates_sqlachemy
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError

from app.core.db import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True)
    firstName = Column(String(255), nullable=False)
    middleName = Column(String(255), nullable=True)
    lastName = Column(String(255), nullable=True)
    roleId = Column(Integer, ForeignKey("role.id"), nullable=False)

    role = relationship("Role", back_populates="users")

    @validates_sqlachemy("firstName")
    def validate_first_name(self, key, value):
        if not value or not value.strip():
            raise ValueError(
                f"{key} must contain at least one non-space character")
        return value.strip()


class Role(Base):
    __tablename__ = "role"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False, unique=True)

    users = relationship("User", back_populates="role")


class UnmatchedGuestCase(Base):
    __tablename__ = "unmatched_guest_case"
    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    coordinator_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    status_id = Column(Integer,
                       ForeignKey('unmatched_guest_case_status.id'),
                       nullable=False)
    status = relationship("UnmatchedGuestCaseStatus", back_populates="cases")


class UnmatchedGuestCaseStatus(Base):
    __tablename__ = "unmatched_guest_case_status"
    id = Column(Integer, primary_key=True, index=True)
    status_text = Column(String(255), nullable=False, unique=True)
    cases = relationship("UnmatchedGuestCase", back_populates="status")


