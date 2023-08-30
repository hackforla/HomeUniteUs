from marshmallow import Schema, fields

class HostSchema(Schema):
    id = fields.Int(missing=None)
    name = fields.Str(required=True)

class HousingProgramServiceProviderSchema(Schema):
    id = fields.Int(missing=None)
    provider_name = fields.Str(required=True)

hostSchema = HostSchema()
hostsSchema = HostSchema(many=True)
housingProgramServiceProviderSchema = HousingProgramServiceProviderSchema()
housingProgramServiceProviderListSchema = HousingProgramServiceProviderSchema(many=True)