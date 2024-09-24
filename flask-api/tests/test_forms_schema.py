from types import MappingProxyType
import pytest
from marshmallow import ValidationError

from openapi_server.models.schema import (
    form_schema,
    FieldSchema,
    FieldValidationsSchema,
    FieldPropertiesSchema,
    FieldGroupSchema
)

VALID_FORM_JSON = MappingProxyType({
        "title": "Employee Onboarding",
        "description": "Collect necessary employee data.",
        "field_groups": [
            {
                "title": "Personal Details",
                "description": "Please enter your personal details.",
                "fields": [
                    {
                        "ref": "position",
                        "properties": {
                            "description": "Position in the company",
                            "field_type": "dropdown",
                            "choices": ['Manager', 'Developer', 'Designer'],
                        },
                        "validations": {
                            "required": True,
                            "max_length": 12
                        }
                    }, 
                    {
                        "ref": "service_length",
                        "properties": {
                            "description": "Years in the company",
                            "field_type": "number",
                            "choices": None,
                        },
                        "validations": {
                            "required": False,
                            "max_length": None
                        }
                    }
                ]
            },
            {
                "title": "Second Group",
                "description": "A second field group.",
                "fields": [
                    {
                        "ref": "start date",
                        "properties": {
                            "description": "Start date",
                            "field_type": "date",
                            "choices": "11-22-2005",
                        },
                        "validations": {
                            "required": True,
                            "max_length": 12
                        }
                    }
                ]
            }
        ]
    }
    )


def test_serialize_form_no_questions(empty_db_session):
    form_json = {"title": "mytitle", "description": "mydesc", "field_groups": []}
    form = form_schema.load(form_json, session=empty_db_session)

    assert "mytitle" == form.title
    assert "mydesc" == form.description
    assert list() == form.field_groups

def test_deserialize_field_validations(empty_db_session):
    validation_json = {
        "required": True,
        "max_length": None
    }
    validation = FieldValidationsSchema().load(validation_json, session=empty_db_session)
    assert validation.required
    assert validation.max_length is None

def test_deserialize_field_property(empty_db_session):
    property_json = {
        "description": "sample desc",
        "field_type": "long_text",
        "choices": ['one', 'two','three']
    }
    property = FieldPropertiesSchema().load(property_json, session=empty_db_session)
    assert property_json["field_type"] == property.field_type
    assert property_json["description"] == property.description

def test_deserialize_field(empty_db_session):
    single_field_json = {
        "ref": "position",
        "properties": {
            "description": "Position in the company",
            "field_type": "dropdown",
            "choices": ['Manager', 'Developer', 'Designer'],
        },
        "validations": {
            "required": True,
            "max_length": 12
        }
    }
    field = FieldSchema().load(single_field_json, session=empty_db_session)
    assert single_field_json["ref"] == field.ref
    assert single_field_json["properties"]["description"] == field.properties.description
    assert single_field_json["properties"]["choices"] == field.properties.choices
    assert single_field_json["validations"]["max_length"] == field.validations.max_length
    assert field.validations.required    

def test_deserialize_fields(empty_db_session):
    multiple_fields = [
        {
            "ref": "position",
            "properties": {
                "description": "Position in the company",
                "field_type": "dropdown",
                "choices": ['Manager', 'Developer', 'Designer'],
            },
            "validations": {
                "required": True,
                "max_length": 12
            }
        }, 
        {
            "ref": "service_length",
            "properties": {
                "description": "Years in the company",
                "field_type": "number",
                "choices": None,
            },
            "validations": {
                "required": False,
                "max_length": None
            }
        }
    ]
    fields = FieldSchema(many=True).load(multiple_fields, session=empty_db_session)
    assert 2 == len(fields)
    for expected, actual in zip(multiple_fields, fields):
        assert expected['properties']['description'] == actual.properties.description
        assert expected['properties']['field_type'] == actual.properties.field_type

def test_deserialize_field_group(empty_db_session):
    group_json = [
        {
            "title": "Personal Details",
            "description": "Please enter your personal details.",
            "fields": [
                {
                    "ref": "position",
                    "properties": {
                        "description": "Position in the company",
                        "field_type": "dropdown",
                        "choices": ['Manager', 'Developer', 'Designer'],
                    },
                    "validations": {
                        "required": True,
                        "max_length": 12
                    }
                }, 
                {
                    "ref": "service_length",
                    "properties": {
                        "description": "Years in the company",
                        "field_type": "number",
                        "choices": None,
                    },
                    "validations": {
                        "required": False,
                        "max_length": None
                    }
                }
            ]
        },
        {
            "title": "Second Group",
            "description": "A second field group.",
            "fields": [
                {
                    "ref": "start date",
                    "properties": {
                        "description": "Start date",
                        "field_type": "date",
                        "choices": "11-22-2005",
                    },
                    "validations": {
                        "required": True,
                        "max_length": 12
                    }
                }
            ]
        }
    ]
    groups = FieldGroupSchema(many=True).load(group_json, session=empty_db_session)
    assert len(group_json) == len(groups)
    for expected_group, actual_group in zip(group_json, groups):
        assert expected_group['title'] == actual_group.title
        assert expected_group['description'] == actual_group.description
        for expected_fields, actual_fields in zip(expected_group['fields'], actual_group.fields):
            assert expected_fields['ref'] == actual_fields.ref
            assert expected_fields['validations']['required'] == actual_fields.validations.required
            assert expected_fields['validations']['max_length'] == actual_fields.validations.max_length
            assert expected_fields['properties']['description'] == actual_fields.properties.description
            assert expected_fields['properties']['field_type'] == actual_fields.properties.field_type
            assert expected_fields['properties']['choices'] == actual_fields.properties.choices

def test_deserialize_form_happypath(empty_db_session):
    form_json = dict(VALID_FORM_JSON)
    form = form_schema.load(form_json, session=empty_db_session)
    assert form_json["title"] == form.title
    assert form_json["description"] == form.description
    assert 2 == len(form.field_groups)
    for expected, actual in zip(form_json["field_groups"], form.field_groups):
        assert expected["title"] == actual.title
        assert expected["description"] == actual.description
        assert len(expected["fields"]) == len(actual.fields)


def test_deserialize_form_extra_key(empty_db_session):
    invalid_form_json = dict(VALID_FORM_JSON)
    invalid_form_json['extra_key'] = 'extra_value'

    with pytest.raises(ValidationError, match=r"Unknown field"):
        form_schema.load(invalid_form_json, session=empty_db_session)

def test_deserialize_form_missing_key(empty_db_session):
    invalid_form_json = dict(VALID_FORM_JSON)
    del invalid_form_json['title']

    with pytest.raises(ValidationError, match=r"Missing data for required field"):
        form_schema.load(invalid_form_json, session=empty_db_session)