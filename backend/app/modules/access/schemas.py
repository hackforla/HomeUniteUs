from pydantic import BaseModel, ConfigDict, EmailStr

from enum import Enum


class UserRoleEnum(str, Enum):
    ADMIN = "admin"
    GUEST = "guest"
    HOST = "host"
    COORDINATOR = "coordinator"


class RoleBase(BaseModel):
    id: int
    type: UserRoleEnum

    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    email: EmailStr
    firstName: str
    middleName: str | None = None
    lastName: str | None = None


class UserCreate(UserBase):
    password: str
    role: UserRoleEnum


class User(UserBase):
    id: int
    role: RoleBase

    model_config = ConfigDict(from_attributes=True)


class UserSignInRequest(BaseModel):
    email: EmailStr
    password: str


class UserSignInResponse(BaseModel):
    user: User
    token: str


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


# class SmartNested(Nested):
#     '''
#     Schema attribute used to serialize nested attributes to
#     primary keys, unless they are already loaded. This
#     enables serialization of complex nested relationships.
#     Modified from
#     https://marshmallow-sqlalchemy.readthedocs.io/en/latest/recipes.html#smart-nested-field
#     '''

#     def serialize(self, attr, obj, accessor=None):
#         if hasattr(obj, attr):
#             value = getattr(obj, attr, None)
#             if value is None:
#                 return None
#             elif hasattr(value, 'id'):
#                 return {"id": value.id}
#             else:
#                 return super(SmartNested, self).serialize(attr, obj, accessor)
#         else:
#             raise AttributeError(
#                 f"{obj.__class__.__name__} object has no attribute '{attr}'")

# class RoleSchema(BaseModel):

#     model_config = ConfigDict(from_attributes=True)

# class UserSchema(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

# user_schema = UserSchema()
# users_schema = UserSchema(many=True)
