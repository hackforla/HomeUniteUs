from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import UserId, UserRoleEnum


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    middle_name: str | None = None
    last_name: str | None = None


class UserCreate(UserBase):
    password: str
    role: UserRoleEnum


class User(UserBase):
    id: str = Field(alias="user_id")
    role: UserRoleEnum

    model_config = ConfigDict(from_attributes=True)


class UserSignInRequest(BaseModel):
    email: EmailStr
    password: str


class UserSignInResponse(BaseModel):
    user: User
    access_token: str
    id_token: str
    token_type: str


class RefreshTokenResponse(BaseModel):
    token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ConfirmForgotPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    password: str


class ConfirmForgotPasswordResponse(BaseModel):
    message: str


class InviteRequest(BaseModel):
    email: EmailStr
    firstName: str
    middleName: str
    lastName: str
    role: UserRoleEnum = UserRoleEnum.GUEST


class InviteResponse(BaseModel):
    message: str
    status: str


class Cookies(BaseModel):
    refresh_token: str
    id_token: str


class ConfirmInviteRequest(BaseModel):
    email: str
    password: str


class NewPasswordRequest(BaseModel):
    userId: str
    password: str
    sessionId: str
