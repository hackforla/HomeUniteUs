import json
import pytest
from marshmallow.exceptions import ValidationError

from openapi_server.models.schema import user_schema, users_schema, HousingProgramServiceProviderSchema
from openapi_server.models.database import User, Role
from openapi_server.models.user_roles import UserRole
from openapi_server.repositories.user_repo import UserRepository

def test_housing_program_service_provider():
    test_housing_program_service_provide_string = "{\"id\": 5, \"provider_name\": \"test\"}"

    housing_program_service_provider = HousingProgramServiceProviderSchema(many=True)

    housing_program_service_provider.fields["id"] = 5
    housing_program_service_provider.fields["provider_name"] = "test"

    assert housing_program_service_provider is not None, "HousingProgramServiceProviderSchema is null"

    assert housing_program_service_provider.fields["id"] == 5, "HousingProgramServiceProviderSchema id field did not match what was input"

    assert housing_program_service_provider.fields["provider_name"] == "test", "HousingProgramServiceProviderSchema provider_name field did not match what was input"

    jsonresult = json.dumps(housing_program_service_provider.fields)

    assert jsonresult == test_housing_program_service_provide_string, "HousingProgramServiceProvider json did not match test string "

def test_deserialize_host(empty_db_session):
    '''
    Verify that the host schema can be deserialized from json.
    '''
    json_from_request = '{"role": {"name": "Host"}, "email": "realemail@fakedomain.com", "firstName": "first", "middleName": "middle", "lastName": "last"}'
    host = user_schema.load(json.loads(json_from_request), session=empty_db_session)

    assert host is not None, "Host is null"
    assert isinstance(host, User), "host is not of type User"
    assert host.firstName == 'first'
    assert host.middleName == 'middle'
    assert host.lastName == 'last'
    assert host.email == 'realemail@fakedomain.com'
    assert isinstance(host.role, Role)
    assert host.role.name == 'Host'

def test_serialize_host(empty_db_session):
    '''
    Verify that the host schema can be serialized to json.
    '''
    user_repo = UserRepository(empty_db_session)
    new_host = user_repo.add_user("realemail@fakedomain.com", UserRole.HOST, "first", "middle", "last")
    json_from_host = user_schema.dump(new_host)
    assert json_from_host is not None, "Json from host is null"
    assert 'name' in json_from_host["role"]
    assert json_from_host['role']['name'] == 'Host'
    assert json_from_host['firstName'] == 'first'
    assert json_from_host['middleName'] == 'middle'
    assert json_from_host['lastName'] == 'last'
    assert json_from_host['email'] == "realemail@fakedomain.com"
    assert 'id' not in json_from_host, "The user Id should be excluded from serialization"
    assert 'role_id' not in json_from_host, "The role Id should be excluded from serialization"

def test_deserialize_multiplehost(empty_db_session):
    '''
    Verify that the user schema can be deserialize multiple users.
    '''
    json_from_request = '[{"role": {"name": "Host"}, "email": "realemail@fakedomain.com0", "firstName": "first0", "middleName": "middle0", "lastName": "last0"}, ' + \
                        ' {"role": {"name": "Guest"}, "email": "realemail@fakedomain.com1", "firstName": "first1", "middleName": "middle1", "lastName": "last1"}, ' + \
                        ' {"role": {"name": "Admin"}, "email": "realemail@fakedomain.com2", "firstName": "first2", "middleName": "middle2", "lastName": "last2"}, ' + \
                        ' {"role": {"name": "Coordinator"}, "email": "realemail@fakedomain.com3", "firstName": "first3", "middleName": "middle3", "lastName": "last3"}, ' + \
                        ' {"role": {"name": "Guest"}, "email": "realemail@fakedomain.com4", "firstName": "first4", "middleName": "middle4", "lastName": "last4"} ]'
    users = users_schema.load(json.loads(json_from_request), session=empty_db_session)
    
    expected_role = ("Host", "Guest", "Admin", "Coordinator", "Guest")
    assert len(users) == len(expected_role)
    for idx, (actual_user, expected_role) in enumerate(zip(users, expected_role)):
        assert actual_user is not None
        assert actual_user.role.name == expected_role
        assert actual_user.email == f"realemail@fakedomain.com{idx}"
        assert actual_user.firstName == f"first{idx}"
        assert actual_user.middleName == f"middle{idx}"
        assert actual_user.lastName == f"last{idx}"

def test_serialize_multiplehost(empty_db_session):
    '''
    Verify that the host schema can be serialized to multiple hosts.
    '''
    user_repo = UserRepository(empty_db_session)
    hosts_to_respond_with = [
        user_repo.add_user("realemail@fakedomain.com0", UserRole.HOST, "first0", "middle0", "last0"),
        user_repo.add_user("realemail@fakedomain.com1", UserRole.GUEST, "first1", "middle1", "last1"),
        user_repo.add_user("realemail@fakedomain.com2", UserRole.ADMIN, "first2", "middle2", "last2"),
        user_repo.add_user("realemail@fakedomain.com3", UserRole.COORDINATOR, "first3", "middle3", "last3"),
        user_repo.add_user("realemail@fakedomain.com4", UserRole.GUEST, "first4", "middle4", "last4")
    ]
    users = users_schema.dump(hosts_to_respond_with)
    
    expected_role = ("Host", "Guest", "Admin", "Coordinator", "Guest")
    assert len(users) == len(expected_role)
    for idx, (actual_user, expected_role) in enumerate(zip(users, expected_role)):
        assert actual_user is not None
        assert actual_user["role"]["name"] == expected_role
        assert actual_user["email"] == f"realemail@fakedomain.com{idx}"
        assert actual_user["firstName"] == f"first{idx}"
        assert actual_user["middleName"] == f"middle{idx}"
        assert actual_user["lastName"] == f"last{idx}"

def test_deserializejson_extrafield_noerror(empty_db_session):
    '''
    Verify that json with extra fields will not raise a validation error.
    This allows us to map request json directly into model objects.
    '''
    json_from_request = '{"extra_field": "extra", "role": {"name": "Host"}, "email": "realemail@fakedomain.com", "firstName": "first", "lastName": "last"}'
    data_from_request = json.loads(json_from_request)
    user = user_schema.load(data_from_request, session=empty_db_session)
    assert user.role.name == UserRole.HOST.value
    assert user.email == "realemail@fakedomain.com"
    assert user.firstName == "first"
    assert user.middleName == None
    assert user.lastName == "last"

def test_deserializeuser_missingfield_error(empty_db_session):
    '''
    Verify that json with a missing field will raise a validation error.
    '''
    # Missing First name
    json_from_request = '{"role": {"name": "Host"}, "email": "realemail@fakedomain.com", "middleName": "middle", "lastName": "last"}'
    data_from_request = json.loads(json_from_request)
    with pytest.raises(ValidationError):
        user_schema.load(data_from_request, session=empty_db_session)

def test_deserializeuser_missingrelationship_error(empty_db_session):
    '''
    Verify that json with a missing field will raise a validation error.
    '''
    # Missing role
    json_from_request = '{"email": "realemail@fakedomain.com", "firstName": "first", "middleName": "middle", "lastName": "last"}'
    data_from_request = json.loads(json_from_request)
    with pytest.raises(ValidationError):
        user_schema.load(data_from_request, session=empty_db_session)

def test_deserialize_nonexistantrole_err(empty_db_session):
    '''
    Verify that json with a missing id will not raise a validation error.
    '''
    json_from_request = '{"role": {"name": "FakeRole"}, "email": "realemail@fakedomain.com", "firstName": "first", "middleName": "middle", "lastName": "last"}'
    data_from_request = json.loads(json_from_request)
    with pytest.raises(ValidationError, match="Role FakeRole does not exist"):
        user_schema.load(data_from_request, session=empty_db_session)
