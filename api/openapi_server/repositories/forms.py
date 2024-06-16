from typing import Optional

from openapi_server.models.schema import form_schema, response_schema, FormSchema
from openapi_server.models.database import Form, Response
from openapi_server.repositories.base import BaseRepo

class FormsRepository(BaseRepo):

    def add_form(self, form_json) -> int:
        with self.session as session:
            form = form_schema.load(form_json, session=session)
            session.add(form)
            session.commit()
            return form.form_id 
    
    def get_form(self, form_id: int) -> Optional[Form]:
        return self.session.query(Form).get(form_id)
    
    def get_form_json(self, form_id) -> Optional[FormSchema]:
        form = self.get_form(form_id)
        if form is not None:
            return form_schema.dump(form)
        return None
    
    def get_user_responses(self, user_id: int, form_id: int):
        with self.session as session:
            form = session.query(Form).get(form_id)
            field_ids = [field.field_id for group in form.field_groups for field in group.fields]
            responses = session.query(Response).filter(
                Response.user_id == user_id,
                Response.field_id.in_(field_ids)
            ).all()
            return response_schema.dump(responses)
        
    def add_user_responses(self, user_id: int, responses) -> None:
        '''
        Add list of responses, from raw json. This function will 
        parse the json and overwrite any existing responses.
        '''
        with self.session as session:
            new_responses = response_schema.load(responses, session=session)
            new_field_ids = [resp.field_id for resp in new_responses]
            session.query(Response).filter(
                Response.user_id == user_id,
                Response.field_id.in_(new_field_ids)
            ).delete(synchronize_session=False)
            session.add_all(new_responses)
            session.commit()