from marshmallow import Schema, fields

class HostSchema(Schema):
    id = fields.Int(missing=None)
    name = fields.Str(required=True)

class HousingProgramServiceProviderSchema(Schema):
    id = fields.Int(missing=None)
    provider_name = fields.Str(required=True)

class UserSchema(Schema):
    id = fields.Int(missing=None)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email = fields.Str(required=True)
    email_confirmed = fields.Bool(required=True)
    password_hash = fields.Str(required=True)
    date_created = fields.DateTime(required=True)
    is_admin = fields.Bool(required=True)
    is_host = fields.Bool(required=True)
    is_guest = fields.Bool(required=True)

user_schema = UserSchema(many=True) # iterable collections of objects

host_schema = HostSchema()
hosts_schema = HostSchema(many=True)
service_provider_schema = HousingProgramServiceProviderSchema()
service_provider_list_schema = HousingProgramServiceProviderSchema(many=True)