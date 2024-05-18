from typing import Optional

from openapi_server.models.schema import form_schema, FormSchema
from openapi_server.models.database import Form
from openapi_server.repositories.base import BaseRepo

class FormsRepository(BaseRepo):

    def add_form(self, form_json) -> int:
        with self.session as session:
            form = form_schema.load(form_json, session=session)
            session.add(form)
            session.commit()
            return form.form_id 
    
    def get_form(self, form_id) -> Optional[Form]:
        return self.session.query(Form).get(form_id)
    
    def get_form_json(self, form_id) -> Optional[FormSchema]:
        form = self.get_form(form_id)
        if form is not None:
            return form_schema.dump(form)
        return None