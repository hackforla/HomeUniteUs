from marshmallow import Schema, fields

class HostSchema(Schema):
    id = fields.Int(missing=None)
    name = fields.Str(required=True)

class HousingProgramServiceProviderSchema(Schema):
    id = fields.Int(missing=None)
    provider_name = fields.Str(required=True)

host_schema = HostSchema()
hosts_schema = HostSchema(many=True)
service_provider_schema = HousingProgramServiceProviderSchema()
service_provider_list_schema = HousingProgramServiceProviderSchema(many=True)