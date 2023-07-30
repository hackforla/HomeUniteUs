# Third Party
from sqlalchemy.orm import Session

# Local
from openapi_server.models.guest_dashboard_with_guest_id_and_application_id import GuestDashboardWithGuestIdAndApplicationId as gd
from openapi_server.models import database as db

class GuestDashboardRepository:

    def __init__(self, db_engine=None):
        """Instantiate GuestDashboardRepository

        :param db_engine: persistence layer instance
        :type db_engine: Engine

        :rtype: None
        """
        if db_engine is None:
            db_engine = db.DataAccessLayer.get_engine()
        self.db_engine = db_engine

    def create_guest_dashboard(self,guest_dashboard):
        """Create a guest dashboard

        :param guest_id: guest id
        :type guest_id: int
        :param application_id: application id
        :type application_id: int

        :rtype: GuestDashboardWithGuestIdAndApplicationId
        """
        session = self._get_session()
        row = self._generate_row(guest_dashboard)
        session.add(row)
        session.commit()
        # guest_dashboard["id"] = row.id
        guest_dashboard.id = row.id

        session.close()
        return gd.from_dict(guest_dashboard)
    
    def delete_guest_dashboard(self, guest_id, application_id):
        """ Delete a guest dashboard. Return false if the guest dashboard is not found. Return true otherwise

        :param guest_id: guest id
        :type guest_id: int
        :param application_id: application id
        :type application_id: int

        :rtype: bool
        """
        num_rows_deleted = 0
        session = self._get_session()
        query = self._get_query_by_id(session, guest_id, application_id)
        if query.first() != None:
            num_rows_deleted = query.delete()
            session.commit()
        
        session.close()
        return bool(num_rows_deleted > 0)

    def get_guest_dashboard_by_id_and_application_id(self, guest_id, application_id):
        """Get details about a guest dashboard by id and application id

        :param guest_id: guest id
        :type guest_id: int
        :param application_id: application id
        :type application_id: int

        :rtype: GuestDashboardWithGuestIdAndApplicationId
        """ 

        session = self._get_session()
        result = None

        row = session.get(db.GuestApplications, application_id)
        session.close()

        if row is None:
            return None

        ## Real code below to be used when the database is running with real data

        # guest_dashboard = gd(guest_id=row.guest_id, application_id=row.id).to_dict()
        # guest_dashboard["id"] = row.id
        # result = gd.from_dict(guest_dashboard)

        ######################### Testing - Delete after database gets runnning #########################
        guest_id = 1
        application_id = 1
        result = gd(guest_id=guest_id, application_id=application_id)
        ######################### Testing - Delete after database gets running #########################

        return result
            
    def update_guest_dashboard(self, guest_id, application_id, guest_dashboard):
        """ Update guest dashboard
        :param guest_id: guest id
        :type guest_id: int
        :param application_id: application id
        :type application_id: int

        :rtype: GuestDashboardWithGuestIdAndApplicationId
    
        """
        result = None
        session = self._get_session()
        query = session.query(db.GuestApplications).filter(db.GuestApplications.guest_id == guest_id, db.GuestApplications.id == application_id)
        if query.first() != None:
            query.update(guest_dashboard)
            session.commit()
            guest_dashboard["id"] = guest_dashboard
            result = gd.from_dict(guest_dashboard)
        session.close()
        return result      
    
    def _get_session(self):
        return Session(self.db_engine)
    
    # def _generate_row(self, guest_id, application_id):
    #     return db.GuestApplications(
    #         application_id=guest_dashboard["id"]
    #     )
    def _generate_row(self, guest_dashboard):
        return db.GuestApplications(
            guest_id=guest_dashboard.guest_id,
            application_id=guest_dashboard.application_id
        )
    
    def _get_query_by_id(self, session, application_id):
        return session.query(
                db.GuestApplications).filter(
                    db.GuestApplications.id == application_id)


