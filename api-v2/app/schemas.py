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


class SmartNested(Nested): 
    '''
    Schema attribute used to serialize nested attributes to 
    primary keys, unless they are already loaded. This
    enables serialization of complex nested relationships.

    Modified from 
    https://marshmallow-sqlalchemy.readthedocs.io/en/latest/recipes.html#smart-nested-field
    '''

    def serialize(self, attr, obj, accessor=None):
        if hasattr(obj, attr):
            value = getattr(obj, attr, None)
            if value is None:
                return None
            elif hasattr(value, 'id'):
                return {"id": value.id}
            else:
                return super(SmartNested, self).serialize(attr, obj, accessor)
        else:
            raise AttributeError(
                f"{obj.__class__.__name__} object has no attribute '{attr}'")


class RoleSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)


class UnmatchedCaseSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)


class UnmatchedCaseStatusSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)


class UserSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class HousingProgramServiceProviderSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)


class HousingProgramSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)


class FieldValidationsSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    required : bool
    max_length : int


class FieldPropertiesSchema(BaseModel):

    class Meta:
        model = FieldProperties
        include_relationships = True
        load_instance = True
        exclude = ('properties_id', )

    description = auto_field()
    field_type = auto_field()
    choices = auto_field()


class FieldSchema(BaseModel):

    class Meta:
        model = Field
        include_relationships = True
        load_instance = True
        exclude = ('properties_id', 'validations_id', 'group_id')

    field_id = auto_field(dump_only=True)
    ref = auto_field()
    properties = SmartNested(FieldPropertiesSchema)
    validations = SmartNested(FieldValidationsSchema)


class FieldGroupSchema(BaseModel):

    class Meta:
        model = FieldGroup
        include_relationships = True
        load_instance = True
        exclude = ('group_id', 'form_id')

    title = auto_field()
    description = auto_field()
    fields = SmartNested(FieldSchema, many=True)


class FormSchema(BaseModel):

    class Meta:
        model = Form
        include_relationships = True
        load_instance = True
        exclude = ('form_id', )

    title = auto_field()
    description = auto_field()
    field_groups = SmartNested(FieldGroupSchema, many=True)


class ResponseSchema(BaseModel):

    class Meta:
        model = Response
        include_relationship = True
        load_instance = True
        exclude = ('answer_id', )

    user_id = auto_field(load_only=True)
    field_id = auto_field(load_only=True)
    answer_text = auto_field()
    user = SmartNested(UserSchema, only=['name'], required=False, missing=None)
    field = SmartNested(FieldSchema,
                        only=['field_id', 'ref', 'properties'],
                        required=False,
                        missing=None)

    @post_load
    def make_response(self, data, **kwargs):
        if data.user is None:
            user = self._session.query(User).get(data.user_id)
            if not user:
                raise ValidationError('User not found', 'user_id')
            data.user = user

        if data.field is None:
            field = self._session.query(Field).get(data.field_id)
            if not field:
                raise ValidationError('Field not found', 'field_id')
            data.field = field

        return data

class ForgotPasswordRequest(BaseModel):
    email: str


class ForgotPasswordResponse(BaseModel):
    code: int
    type: str
    message: str
    
user_schema = UserSchema()
users_schema = UserSchema(many=True)
service_provider_schema = HousingProgramServiceProviderSchema()
service_provider_list_schema = HousingProgramServiceProviderSchema(many=True)
form_schema = FormSchema()
response_schema = ResponseSchema(many=True)
unmatched_cs_schema = UnmatchedCaseStatusSchema()
unmatched_c_schema = UnmatchedCaseSchema()
