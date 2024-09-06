from pydantic import BaseModel
from typing import Optional

from enum import Enum


class UserRoleEnum(str, Enum):
    ADMIN = "admin"
    GUEST = "guest"
    HOST = "host"
    COORDINATOR = "coordinator"


class RoleBase(BaseModel):
    id: int
    type: UserRoleEnum

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: str
    firstName: str
    middleName: Optional[str] = None
    lastName: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: UserRoleEnum


class User(UserBase):
    id: int
    role: RoleBase

    class Config:
        from_attributes = True


class UserSignIn(BaseModel):
    email: str
    password: str


class UserSignInResponse(BaseModel):
    user: User
    token: str
