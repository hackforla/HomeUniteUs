from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import validates, ValidationError, EXCLUDE, post_load
from marshmallow_sqlalchemy.fields import Nested
from openapi_server.models.database import *
from openapi_server.models.user_roles import UserRole

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
            raise AttributeError(f"{obj.__class__.__name__} object has no attribute '{attr}'")

class RoleSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Role
        include_relationships = True
        load_instance = True

class UserSchema(SQLAlchemyAutoSchema):
    role = Nested(RoleSchema, only=['name'], required=True)
    class Meta:
        model = User
        include_relationships = True
        load_instance = True
        exclude = ('id',)
        unknown = EXCLUDE

    @validates('role')
    def validate_role(self, value):
        if any(value.name == role.value for role in UserRole):
            return True
        raise ValidationError(f"Role {value.name} does not exist")

class HousingProgramServiceProviderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = HousingProgramServiceProvider
        include_relationships = True
        load_instance = True

class HousingProgramSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = HousingProgram
        include_relationships = True
        load_instance = True

class FieldValidationsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = FieldValidations
        include_relationships = True
        load_instance = True
        exclude = ('validations_id',)

    required = auto_field()
    max_length = auto_field()

class FieldPropertiesSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = FieldProperties
        include_relationships = True
        load_instance = True
        exclude = ('properties_id',)

    description = auto_field()
    field_type = auto_field()
    choices = auto_field()

class FieldSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Field
        include_relationships = True
        load_instance = True
        exclude = ('properties_id','validations_id','group_id')
    field_id = auto_field(dump_only=True)
    ref = auto_field()
    properties = SmartNested(FieldPropertiesSchema)
    validations = SmartNested(FieldValidationsSchema)

class FieldGroupSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = FieldGroup
        include_relationships = True
        load_instance = True
        exclude = ('group_id', 'form_id')

    title = auto_field()
    description = auto_field()
    fields = SmartNested(FieldSchema, many=True)

class FormSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Form
        include_relationships = True
        load_instance = True
        exclude = ('form_id',)

    title = auto_field()
    description = auto_field()
    field_groups = SmartNested(FieldGroupSchema, many=True)

class ResponseSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Response
        include_relationship = True
        load_instance = True
        exclude = ('answer_id',)
    
    user_id = auto_field(load_only=True)
    field_id = auto_field(load_only=True)
    answer_text = auto_field()
    user = SmartNested(UserSchema, only=['name'], required=False, missing=None)
    field = SmartNested(FieldSchema, only=['field_id', 'ref', 'properties'], required=False, missing=None)

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

user_schema = UserSchema()
users_schema = UserSchema(many=True)
service_provider_schema = HousingProgramServiceProviderSchema()
service_provider_list_schema = HousingProgramServiceProviderSchema(many=True)
form_schema = FormSchema()
response_schema = ResponseSchema(many=True)