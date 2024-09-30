from openapi_server.repositories.forms import FormsRepository
from openapi_server.models.database import DataAccessLayer

def create_form(body):
    forms_repo = FormsRepository(DataAccessLayer.session())

    form_id = forms_repo.add_form(body)
    form = forms_repo.get_form_json(form_id)
    if form:
        return form, 200
    return {}, 404

def get_form(form_id):
    forms_repo = FormsRepository(DataAccessLayer.session())
    form = forms_repo.get_form_json(form_id)
    if form:
        return form, 200
    return f"Form with id {form_id} does not exist.", 404