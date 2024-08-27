from typing import List

from openapi_server.models.database import UnmatchedGuestCase, UnmatchedGuestCaseStatus, User, Role
from openapi_server.models.user_roles import UmatchedCaseStatus, UserRole

class UnmatchedCaseRepository:
    def __init__(self, session):
        self.session = session
        
    def add_case(self, guest_id: int, coordinator_id: int) -> UnmatchedGuestCase:
        status_id = self.session.query(UnmatchedGuestCaseStatus).filter_by(status_text=UmatchedCaseStatus.IN_PROGRESS).first().id
        new_guest_case = UnmatchedGuestCase(guest_id=guest_id,coordinator_id=coordinator_id,status_id=status_id)
        self.session.add(new_guest_case)
        self.session.commit()

        return new_guest_case
        
        
    def delete_case_for_guest(self, guest_id: int) -> bool:
        guest_case = self.session.query(UnmatchedGuestCaseStatus).filter_by(guest_id=guest_id).first()
        if guest_case:
            self.session.delete(guest_case)
            self.session.commit()
            return True
        return False
        
    def get_case_for_guest(self, guest_id: int) -> UnmatchedGuestCase:
        return self.session.query(UnmatchedGuestCase).filter_by(guest_id=guest_id).first()

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
    
    def get_user_by_id(self, id: int) -> User:
        return self.session.query(User).filter_by(id=id).first()    
    
    def get_user(self, email: str) -> User:
        return self.session.query(User).filter_by(email=email).first()
    
    def get_all_users(self) -> List[User]:
        return self.session.query(User).all()
    
    def get_user_id(self, email: str) -> int:
        return self.session.query(User).filter_by(email=email).first().id
    
    def get_users_with_role(self, role: UserRole) -> List[User]:
        return self.session.query(User).filter_by(role=self._get_role(role))