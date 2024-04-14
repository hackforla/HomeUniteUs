import json
import pytest
from marshmallow.exceptions import ValidationError

from openapi_server.models.schema import HostSchema, host_schema, hosts_schema, HousingProgramServiceProviderSchema
from openapi_server.models.database import Host, DataAccessLayer

def test_create_host():
    test_host_string = "{\"id\": 5, \"name\": \"test\"}"

    test_host = HostSchema(many=True)

    test_host.fields["id"] = 5
    test_host.fields["name"] = "test"

    assert test_host is not None,  "HostSchema is null"

    assert test_host.fields["id"] == 5, "HostSchema id field did not match what was input"

    assert test_host.fields["name"] == "test", "HostSchema name field did not match what was input"

    jsonresult = json.dumps(test_host.fields)

    assert jsonresult == test_host_string, "HostSchema json did not match test string "


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

def test_deserialize_fromjson(client):
    '''
    Verify that the host schema can be deserialized from json.
    '''
    json_from_request ='{"id": 1, "name": "Josh"}'
    host = host_schema.load(json.loads(json_from_request), session=DataAccessLayer.session())

    assert host is not None, "Host is null"
    assert isinstance(host, Host), "host is not of type Host"
    assert host.id == 1, "Host id did not match what was input"
    assert host.name == "Josh", "Host name did not match what was input"

def test_serialize_tojson():
    '''
    Verify that the host schema can be serialized to json.
    '''
    host_to_respond_with = Host(id=1, name="Josh")
    json_from_host = host_schema.dump(host_to_respond_with)
    assert json_from_host is not None, "Json from host is null"
    assert json_from_host['id'] == 1, "Json from host id did not match what was input"
    assert json_from_host['name'] == "Josh", "Json from host name did not match what was input"

def test_deserialize_multiplehost(client):
    '''
    Verify that the host schema can be deserialized from multiple hosts.
    '''
    json_from_request = '[{"id": 1, "name": "Josh"}, {"id": 2, "name": "John"}]'
    hosts = hosts_schema.load(json.loads(json_from_request), session=DataAccessLayer.session())
    assert hosts is not None, "Hosts is null"
    assert len(hosts) == 2, "Hosts length did not match what was input"
    assert isinstance(hosts[0], Host), "Hosts is not of type Host"
    assert hosts[0].id == 1, "Hosts id did not match what was input"
    assert hosts[0].name == "Josh", "Hosts name did not match what was input"
    assert hosts[1].id == 2, "Hosts id did not match what was input"
    assert hosts[1].name == "John", "Hosts name did not match what was input"

def test_serialize_multiplehost():
    '''
    Verify that the host schema can be serialized to multiple hosts.
    '''
    hosts_to_respond_with = [Host(id=1, name="Josh"), Host(id=2, name="John")]
    json_from_hosts = hosts_schema.dump(hosts_to_respond_with)
    
    assert json_from_hosts is not None, "Json from hosts is null"
    assert len(json_from_hosts) == 2, "Json from hosts length did not match what was input"
    assert json_from_hosts[0]['id'] == 1, "Json from hosts id did not match what was input"
    assert json_from_hosts[0]['name'] == "Josh", "Json from hosts name did not match what was input"
    assert json_from_hosts[1]['id'] == 2, "Json from hosts id did not match what was input"
    assert json_from_hosts[1]['name'] == "John", "Json from hosts name did not match what was input"

def test_deserializejson_extrafield_error(client):
    '''
    Verify that json with extra fields will raise a validation error.
    '''
    json_from_request ='{"id": 1, "name": "Josh", "extra_field": "extra"}'
    data_from_request = json.loads(json_from_request)
    with pytest.raises(ValidationError):
        host_schema.load(data_from_request, session=DataAccessLayer.session())

def test_deserializejson_missingfield_error(client):
    '''
    Verify that json with a missing field will raise a validation error.
    '''
    json_from_request ='{"id": 1}'
    data_from_request = json.loads(json_from_request)
    with pytest.raises(ValidationError):
        host_schema.load(data_from_request, session=DataAccessLayer.session())

def test_deserializejson_missingindex_noerror(client):
    '''
    Verify that json with a missing id will not raise a validation error.
    '''
    json_from_request ='{"name": "Josh"}'
    data_from_request = json.loads(json_from_request)
    host = host_schema.load(data_from_request, session=DataAccessLayer.session())
    assert host.id == None, "Host id is not null"