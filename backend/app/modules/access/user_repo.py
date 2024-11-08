import logging

from app.core.interfaces import DomainEvent
from app.modules.access.models import EmailAddress, UserId, User, UserRoleEnum
from app.modules.access.invite.contracts import UserCreatedDomainEvent

log = logging.Logger(__name__)


class UserRepository:

    def __init__(self, session_factory):
        self.session_factory = session_factory

    def mutate(self, domain_event: DomainEvent):
        """Update the projection based on the domain event."""
        method = getattr(self, 'when_' + domain_event.__class__.__name__)
        if method:
            method(domain_event)
        else:
            log.warn(
                f"when_{domain_event.__class__.__name__} not implemented.")

    def when_UserCreatedDomainEvent(self, e: UserCreatedDomainEvent):
        """Update users."""
        if not self.get_user_by_id(e.user_id):
            self.add_user(e.user_id, e.email, e.role, e.first_name,
                          e.middle_name, e.last_name)

    def add_user(self,
                 user_id: UserId,
                 email: EmailAddress,
                 role: UserRoleEnum,
                 first_name: str,
                 middle_name: str = None,
                 last_name: str = None) -> User:
        new_user = User(user_id=user_id,
                        email=email,
                        first_name=first_name,
                        middle_name=middle_name,
                        last_name=last_name,
                        role=role)
        with self.session_factory.begin() as session:
            session.add(new_user)

        return new_user

    def delete_user(self, user_id: UserId) -> bool:
        with self.session_factory.begin() as session:
            user = session.query(User).filter_by(user_id=user_id).first()
            if user:
                session.delete(user)
                return True
            return False

    def get_user_by_id(self, id: UserId) -> User:
        with self.session_factory() as session:
            return session.query(User).filter_by(user_id=id).first()

    def get_user(self, email: str) -> User:
        with self.session_factory() as session:
            return session.query(User).filter_by(email=email).first()

    def get_all_users(self) -> list[User]:
        with self.session_factory() as session:
            return session.query(User).all()

    def get_user_id(self, email: str) -> UserId:
        with self.session_factory() as session:
            return session.query(User).filter_by(email=email).first().user_id

    def get_users_with_role(self, role: UserRoleEnum) -> list[User]:
        with self.session_factory() as session:
            return session.query(User).filter_by(role=role.value)
