"""Model."""

from dataclasses import dataclass
from enum import Enum
import uuid

from email_validator import validate_email, EmailNotValidError
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import TypeDecorator, Uuid, String

from app.core.db import Base
from app.core.interfaces import Identity, ValueObject


class InvalidEmailError(Exception):
    pass


@dataclass(frozen=True)
class EmailAddress(ValueObject, str):
    """Represent a valid email address."""

    email: str

    def __post_init__(self):
        try:
            validate_email(self.email,
                           check_deliverability=False,
                           allow_quoted_local=True)

        except EmailNotValidError as e:
            raise InvalidEmailError(e)

    @classmethod
    def from_str(cls, email: str) -> "EmailAddress":
        try:
            emailinfo = validate_email(email,
                                       check_deliverability=False,
                                       allow_quoted_local=True)

            return cls(emailinfo.normalized)

        except EmailNotValidError as e:
            raise InvalidEmailError(e)

    def __eq__(self, o):
        if self is o:
            return True

        if str(o) == self.email:
            return True

        return False

    def __str__(self):
        return self.email


class EmailAddressType(TypeDecorator):
    impl = String  # Use String or another appropriate base SQL type
    cache_ok = True

    def process_bind_param(self, value: EmailAddress, dialect):
        # Convert EmailAddress instance to string before storing in DB
        return str(value.email) if value else None

    def process_result_value(self, value, dialect):
        # Convert string from DB back to EmailAddress instance
        return EmailAddress(value) if value else None


class UserRoleEnum(str, Enum):
    ADMIN = "admin"
    GUEST = "guest"
    HOST = "host"
    COORDINATOR = "coordinator"


class Role(Base):
    __tablename__ = "roles"
    role: Mapped[str] = mapped_column(primary_key=True)

    users: Mapped[list["User"]] = relationship(back_populates="role_relation")

class UserId(Identity, str):
    id: uuid.UUID

    def __init__(self, id: uuid.UUID = None):
        if id is None:
            self.id = uuid.uuid4()
        self.id = uuid.UUID(f'{id}')

    def __str__(self):
        return str(self.id)


class UserIdType(TypeDecorator):
    impl = Uuid  # Use String or another appropriate base SQL type
    cache_ok = True

    def process_bind_param(self, value: UserId, dialect):
        # Convert UserId instance to string before storing in DB
        return str(value.id) if value else None

    def process_result_value(self, value, dialect):
        # Convert string from DB back to UserId instance
        return UserId(value) if value else None


class User(Base):
    __tablename__ = "users"
    user_id: Mapped[UserId] = mapped_column(UserIdType, primary_key=True)
    email: Mapped[EmailAddress] = mapped_column(EmailAddressType,
                                                unique=True,
                                                nullable=False,
                                                index=True)
    first_name: Mapped[str]
    middle_name: Mapped[str | None]
    last_name: Mapped[str]
    role: Mapped[str] = mapped_column(ForeignKey("roles.role"))
    role_relation: Mapped["Role"] = relationship(back_populates="users")
    disabled: bool = False

    @classmethod
    def coordinator(cls, email, first_name, middle_name, last_name) -> "User":
        return cls(id=UserId(),
                   email=email,
                   first_name=first_name,
                   middle_name=middle_name,
                   last_name=last_name,
                   role=UserRoleEnum.COORDINATOR.value)

    @classmethod
    def guest(cls, email, first_name, middle_name, last_name) -> "User":
        return cls(id=UserId(),
                   email=email,
                   first_name=first_name,
                   middle_name=middle_name,
                   last_name=last_name,
                   role=UserRoleEnum.GUEST.value)

    @classmethod
    def host(cls, email, first_name, middle_name, last_name) -> "User":
        return cls(id=UserId(),
                   email=email,
                   first_name=first_name,
                   middle_name=middle_name,
                   last_name=last_name,
                   role=UserRoleEnum.HOST.value)
