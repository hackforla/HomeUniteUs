# Local
from openapi_server.models import database as db

class GuestApplicationRepository:
    
    def __init__(self, db_engine=None):
        if db_engine is None:
            db_engine = db.DataAccessLayer.get_engine()
        self.db_engine = db_engine

    def get_application_steps(self, guest_id: int, application_id: int):

        return steps