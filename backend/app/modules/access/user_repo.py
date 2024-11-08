from app.modules.access.models import UserId, User, Role, UserRoleEnum


class UserRepository:

    def __init__(self, session_factory):
        self.session_factory = session_factory

    def add_user(self,
                 email: str,
                 role: UserRoleEnum,
                 firstName: str,
                 middleName: str = None,
                 lastName: str = None) -> User:
        new_user = User(email=email,
                        firstName=firstName,
                        middleName=middleName,
                        lastName=lastName,
                        role=role.value)
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
