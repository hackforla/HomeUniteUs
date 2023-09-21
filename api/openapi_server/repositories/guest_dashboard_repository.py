
from typing import Optional, List
from sqlalchemy.orm import Session
from openapi_server.models.database import User, DataAccessLayer


class GuestRepository:
    def create_guest(self, data: dict) -> Optional[User]:
        """
        create a new guest - adds data entry to the database
        """
        with DataAccessLayer.session() as session:
            new_guest = User(
                # db auto generates and auto increments an id
                first_name=data["first_name"],
                last_name=data["last_name"],
                email=data["email"],
                email_confirmed=data["email_confirmed"],
                password_hash=data["password_hash"],
                date_created=data["date_created"],
                is_admin=data["is_admin"],
                is_host=data["is_host"],
                is_guest=data["is_guest"]
            )
            session.add(new_guest)# places instance into the session
            session.commit() # writes changes to db
            session.refresh(new_guest) # erases all attributes of the instance and refreshes them with the current state of the db by emitting a SQL query. this is important for autoincrementing id
            return new_guest # returns the info from the db to the business logic 


    def get_guest_by_id(self, id: int) -> Optional[User]:
        """
        gets a guest by id
        """
        with DataAccessLayer.session() as session:
            return session.query(User).get(id)  

    def get_guest_by_email(self, user_email: str) -> Optional[User]:
        """
        gets a guest by email
        """
        with DataAccessLayer.session() as session:
            return session.query(User).filter(User.email == user_email).first()