from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from openapi_server.models.database import *

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True

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

class HostSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Host
        include_relationships = True
        load_instance = True

host_schema = HostSchema()
hosts_schema = HostSchema(many=True)
service_provider_schema = HousingProgramServiceProviderSchema()
service_provider_list_schema = HousingProgramServiceProviderSchema(many=True)