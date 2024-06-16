from typing import List

from openapi_server.models.database import User, Role
from openapi_server.models.user_roles import UserRole

class UserRepository:
    def __init__(self, session):
        self.session = session

    def _get_role(self, role: UserRole) -> Role:
        db_role = self.session.query(Role).filter_by(name=role.value).first()
        if not db_role:
            raise ValueError(f"{role.value} is not a valid user role type")
        return db_role

    def add_user(self, email: str, role: UserRole, firstName: str, middleName: str=None, lastName: str=None) -> User:      
        new_role = self._get_role(role)        
        new_user = User(email=email, firstName=firstName, middleName=middleName, 
                        lastName=lastName, role_id=new_role.id)
        self.session.add(new_user)
        self.session.commit()

        return new_user

    def delete_user(self, user_id: int) -> bool:
        user = self.session.query(User).filter_by(id=user_id).first()
        if user:
            self.session.delete(user)
            self.session.commit()
            return True
        return False
    
    def get_user(self, email: str) -> User:
        return self.session.query(User).filter_by(email=email).first()
    
    def get_user_id(self, email: str) -> int:
        return self.session.query(User).filter_by(email=email).first().id
    
    def get_users_with_role(self, role: UserRole) -> List[User]:
        return self.session.query(User).filter_by(role=self._get_role(role))