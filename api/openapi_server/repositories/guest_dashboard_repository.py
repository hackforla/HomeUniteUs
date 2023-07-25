# Third Party
from sqlalchemy.orm import Session

# Local


class GuestDashboardRepository:

    def __init__(self, db_engine=db.DataAccessLayer.get_engine()):
        """Instantiate GuestDashboardRepository

        :param db_engine: persistence layer instance
        :type db_engine: Engine

        :rtype: None
        """
        self.db_engine = db_engine

    def get_guest_dashboard(self):
        """Get guest dashboard information

        :rtype: dict
        """
        pass
    
    def _get_session(self):
        return Session(self.db_engine)