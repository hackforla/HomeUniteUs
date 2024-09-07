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


class DataAccessLayer:
    _engine: Engine = None

    @classmethod
    def db_init(cls, conn_string):
        # Check that a database engine is not already set. The test project will
        # hook into the DataAccessLayer to create a test project database engine.
        if cls._engine: return

        cls._engine = create_engine(conn_string, echo=True, future=True)
        Base.metadata.create_all(bind=cls._engine)

    @classmethod
    def session(cls) -> Session:
        return Session(cls._engine)

    @classmethod
    def revision_id(cls) -> str:
        "Return the database alembic migration revision number."
        if not cls._engine: return ""
        try:
            with cls._engine.connect() as conn:
                # Using text() to ensure the query is treated as a literal SQL statement
                result = conn.execute(
                    text("SELECT version_num FROM alembic_version"))
                revision_id = result.scalar()
                return revision_id
        except SQLAlchemyError:
            # This catches errors such as missing alembic_version table
            return ""
