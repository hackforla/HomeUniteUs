from openapi_server.repositories.forms import FormsRepository
from openapi_server.repositories.user_repo import UserRepository
from openapi_server.models.database import DataAccessLayer

def update_responses(body, form_id, token_info):
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        forms_repo = FormsRepository(session)
        user = user_repo.get_user(token_info['Username'])

        form = forms_repo.get_form(form_id)
        if not form:
            return f"Form with id {form_id} does not exist.", 404
        
        valid_field_ids = form.get_field_ids()
        for response in body:
            response["user_id"] = user.id
            if response["field_id"] not in valid_field_ids:
                return f"Form {form_id} does not contain field id {response['field_id']}", 400

        forms_repo.add_user_responses(user.id, body)

        return {}, 204
    
def get_responses(form_id, token_info):
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        forms_repo = FormsRepository(session)

        form = forms_repo.get_form_json(form_id)
        if not form:
            return f"Form with id {form_id} does not exist.", 404

        user = user_repo.get_user(token_info['Username'])
        responses = forms_repo.get_user_responses(user.id, form_id)
        if responses:
            return responses, 200
        return [], 202