import json

from openapi_server.models.schema import HostSchema, HousingProgramServiceProviderSchema


def test_create_host(client):
    test_host_string = "{\"id\": 5, \"name\": \"test\"}"

    test_host = HostSchema(many=True)

    test_host.fields["id"] = 5
    test_host.fields["name"] = "test"

    assert test_host is not None,  "HostSchema is null"

    assert test_host.fields["id"] == 5, "HostSchema id field did not match what was input"

    assert test_host.fields["name"] == "test", "HostSchema name field did not match what was input"

    jsonresult = json.dumps(test_host.fields)

    assert jsonresult == test_host_string, "HostSchema json did not match test string "


def test_housing_program_service_provider(client):
    test_housing_program_service_provide_string = "{\"id\": 5, \"provider_name\": \"test\"}"

    housing_program_service_provider = HousingProgramServiceProviderSchema(many=True)

    housing_program_service_provider.fields["id"] = 5
    housing_program_service_provider.fields["provider_name"] = "test"

    assert housing_program_service_provider is not None, "HousingProgramServiceProviderSchema is null"

    assert housing_program_service_provider.fields["id"] == 5, "HousingProgramServiceProviderSchema id field did not match what was input"

    assert housing_program_service_provider.fields["provider_name"] == "test", "HousingProgramServiceProviderSchema provider_name field did not match what was input"

    jsonresult = json.dumps(housing_program_service_provider.fields)

    assert jsonresult == test_housing_program_service_provide_string, "HousingProgramServiceProvider json did not match test string "
