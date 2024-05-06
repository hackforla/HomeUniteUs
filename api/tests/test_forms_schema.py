import json

from openapi_server.models.schema import (
    form_schema,
    response_schema,
    FieldSchema,
    FieldValidationsSchema,
    FieldPropertiesSchema,
    FieldGroupSchema
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
    assert multiple_fields[0]["properties"]["description"] == fields[0].properties.description
    assert multiple_fields[1]["properties"]["description"] == fields[1].properties.description
    assert multiple_fields[1]["properties"]["field_type"] == fields[1].properties.field_type

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
    group = FieldGroupSchema(many=True).load(group_json, session=empty_db_session)
    pass

def test_deserialize_form_happypath(empty_db_session):
    form_json = {
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
    form = form_schema.load(form_json, session=empty_db_session)
    assert form_json["title"] == form.title
    assert form_json["description"] == form.description
    assert 2 == len(form.field_groups)
    for expected, actual in zip(form_json["field_groups"], form.field_groups):
        assert expected["title"] == actual.title
        assert expected["description"] == actual.description
        assert len(expected["fields"]) == len(actual.fields)

    form_schema.dump(form)
    empty_db_session.add(form)
    empty_db_session.commit()
    from openapi_server.models.database import Form
    new_form = empty_db_session.get(Form, 1)

    from openapi_server.models.database import User, Field
    from openapi_server.repositories.user_repo import UserRepository
    from openapi_server.models.user_roles import UserRole
    new_user = UserRepository(empty_db_session).add_user(
                email="email@email.com",
        firstName="firstName",
        role=UserRole.HOST
    )

    response_json = [
        {
            "user_id": new_user.id,
            "field_id": new_form.field_groups[0].fields[0].field_id,
            "answer_text": "Fancy JSON answer"
        }
    ]
    from openapi_server.models.database import Response
    responses = response_schema.load(response_json, session=empty_db_session)
    empty_db_session.add(responses[0])
    empty_db_session.commit()
    empty_db_session.get(Response, responses[0].answer_id)

    for group in new_form.field_groups:
        for field in group.fields:
            pass # field.response


def test_response_deserialization(empty_db_session):
    response_json = [
        {
            "user_id": 11,
            "field_id": 1,
            "answer_text": "answer stored as text"
        },
        
    ]
    return 
    from openapi_server.models.database import User, Field
    response_user = User(
        email="email@email.com",
        firstName="firstName",
        role="Host"
    )
    field_json = {
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
    field = FieldSchema().load(field_json, session=empty_db_session)
    empty_db_session.add(response_user)
    empty_db_session.add(field_json)
    pass
