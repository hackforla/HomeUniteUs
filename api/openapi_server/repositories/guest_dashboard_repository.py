# Third Party
from sqlalchemy.orm import Session

# Local
from openapi_server.models import database as db

class GuestDashboardRepository:

    def __init__(self, db_engine=db.DataAccessLayer.get_engine()):
        """Instantiate GuestDashboardRepository

        :param db_engine: persistence layer instance
        :type db_engine: Engine

        :rtype: None
        """
        self.db_engine = db_engine

    def get_application_tasks(self, guest_id, application_id):
        """Get guest dashboard information

        :rtype: dict
        """
        # session = self._get_session()
        # result = None

        if (not guest_id or not application_id):
            return {"message" : "error"}


        tasks = [
            {
                "Application and Onboarding": "Application and Onboarding Complete"
            },
            {
                "Host Selection": "Host Selection Complete"
            },
            {
                "Match": "Match Complete"
            }
        ]

        result = {
            "guest_id": guest_id,
            "application_id": application_id,
            "tasks": tasks
        }

        # session.close()
        return result
    
    def _get_session(self):
        return Session(self.db_engine)