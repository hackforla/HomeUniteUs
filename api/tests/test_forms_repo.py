from openapi_server.repositories.forms import FormsRepository

def test_add_form_valid_json(empty_db_session_provider):
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

    form_repo = FormsRepository(empty_db_session_provider.session())
    created_form_id = form_repo.add_form(form_json)
    retrieved_form = form_repo.get_form_json(created_form_id)

    # the json won't match exactly because retrieved_form has ids associated with
    # it, but we can do a spot check at least
    assert retrieved_form['title'] == form_json['title']
    assert len(retrieved_form['field_groups']) == len(form_json['field_groups'])
    assert len(retrieved_form['field_groups'][1]['fields']) == len(form_json['field_groups'][1]['fields'])
    assert retrieved_form['field_groups'][1]['fields'][0]['validations'] == form_json['field_groups'][1]['fields'][0]['validations']