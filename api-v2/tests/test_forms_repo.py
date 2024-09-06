from types import MappingProxyType

from openapi_server.repositories.forms import FormsRepository
from openapi_server.repositories.user_repo import UserRepository, UserRole

TEST_FORM_READ_ONLY = MappingProxyType({
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
})

def assert_form_equal(actual_form: dict, expected_form: dict):
    '''
    Do a deep equality check of a form, excluding dynamically
    assigned values like timestamps and primary key ids.
    '''
    actual_copy = actual_form.copy()
    del actual_copy['created_at']
    for group in actual_copy['field_groups']:
        del group['form']
        for field in group['fields']:
            del field['field_id']
            del field['group']

    assert actual_copy == expected_form

def test_add_form_valid_json(empty_db_session_provider):
    form_json = dict(TEST_FORM_READ_ONLY)

    form_repo = FormsRepository(empty_db_session_provider.session())
    created_form_id = form_repo.add_form(form_json)
    retrieved_form = form_repo.get_form_json(created_form_id)
    
    assert_form_equal(retrieved_form, form_json)

def test_add_get_responses(empty_db_session_provider):
    with empty_db_session_provider.session() as session:
        user_repo = UserRepository(session)
        form_repo = FormsRepository(session)
        
        user_repo.add_user('fake@email.com', UserRole.COORDINATOR, 'firstname')
        user_id = user_repo.get_user_id('fake@email.com')
        created_form_id = form_repo.add_form(TEST_FORM_READ_ONLY)
        retrieved_form = form_repo.get_form_json(created_form_id)

        def _get_field_id(lcl_form, ref):
            for group in lcl_form['field_groups']:
                for field in group['fields']:
                    if field['ref'] == ref:
                        return int(field['field_id'])
            raise ValueError(f'ref {ref} not found in test form')
        
        expected_responses = [
            {
                "user_id": user_id,
                "field_id": _get_field_id(retrieved_form, 'position'),
                "answer_text": "Designer"
            },
            {
                "user_id": user_id,
                "field_id": _get_field_id(retrieved_form, 'service_length'),
                "answer_text": "5"
            },
            {
                "user_id": user_id,
                "field_id": _get_field_id(retrieved_form, 'start date'),
                "answer_text": '2024-05-19'
            }
        ]
        form_repo.add_user_responses(user_id, expected_responses)

        retrieved_answers = form_repo.get_user_responses(user_id, created_form_id)

        assert len(retrieved_answers) == 3
        for expected, actual in zip(expected_responses, retrieved_answers):
            assert expected['answer_text'] == actual['answer_text']
            assert expected['user_id'] == actual['user']['id']
            assert expected['field_id'] == actual['field']['field_id']