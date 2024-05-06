from sqlalchemy import func, select, delete

from openapi_server.models.database import DataAccessLayer, Form, Response
from openapi_server.models.schema import form_schema, response_schema, ResponseSchema, Response

def create_form(form_json):
    new_form = form_schema.load(form_json)
    with DataAccessLayer.session() as session:
        session.add(new_form)
    return form_schema.dump(new_form), 200

def get_form(form_id):
    form = None
    with DataAccessLayer.session() as session:
        form = session.get(Form, form_id)
    if form:
        return form_schema.dump(form), 200
    return dict(), 404

def update_responses(response_json, user_id):
    for response in response_json:
        response["user_id"] = user_id

    with DataAccessLayer.session() as session:
        new_responses = response_schema.load(response_json)
        field_ids = [r.field_id for r in new_responses]
        session.execute(
            delete(Response)\
            .where(Response.user_id == user_id)\
            .where(Response.field_id.in_(field_ids))
        )
        for new_response in new_responses:
            session.add(new_response)
    
def get_responses(form_id, user_id):
    with DataAccessLayer.session() as session:
        form = session.get(Form, form_id)
        field_ids = set()
        for group in form.field_groups:
            for field in group.fields:
                field_ids.add(field.field_id)

        responses = session.execute(
            select(Response).\
            where(Response.user_id == user_id).\
            where(Response.field_id.in_(field_ids))
        )

        return response_schema.dump(responses)