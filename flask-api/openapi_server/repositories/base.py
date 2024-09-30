from sqlalchemy.orm import Session

from openapi_server.models.database import DataAccessLayer

class BaseRepo:

    def __init__(self, session: Session = None):
        if session is None:
            session = DataAccessLayer.session()
        self.session = session