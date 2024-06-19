from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy.fields import Nested
from openapi_server.models.database import *
from openapi_server.models.user_roles import UserRole

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

user_schema = UserSchema()
users_schema = UserSchema(many=True)
service_provider_schema = HousingProgramServiceProviderSchema()
service_provider_list_schema = HousingProgramServiceProviderSchema(many=True)