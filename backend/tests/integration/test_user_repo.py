import pytest
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.modules.access.models import User
from app.modules.access.user_roles import UserRole
from app.modules.access.user_repo import UserRepository

def test_user_role_required(session_factory: Session):
    with session_factory() as empty_db_session:
        new_user = User(email="realemail@fakedomain.com",
                        firstName="realemail@fakedomain.com",
                        middleName="realemail@fakedomain.com",
                        lastName="realemail@fakedomain.com")
        empty_db_session.add(new_user)
        with pytest.raises(IntegrityError, match="NOT NULL constraint failed"):
            empty_db_session.commit()

        with pytest.raises(TypeError):
            repo = UserRepository(empty_db_session)
            repo.add_user(email="realemail@fakedomain.com",
                        firstName="realemail@fakedomain.com",
                        middleName="realemail@fakedomain.com",
                        lastName="realemail@fakedomain.com")


def test_add_user_firstname_only(session_factory: Session):
    """Verify that user middle and last name are not required.

    In some cultures, such as Indonesian and Icelandic, people may have only one name.
    """
    with session_factory() as empty_db_session:
        repo = UserRepository(empty_db_session)
        new_user = repo.add_user(email="realemail@fakedomain.com",
                                firstName="name",
                                role=UserRole.GUEST)
        assert new_user.role.type == UserRole.GUEST.value
        assert new_user.firstName == "name"
        assert new_user.middleName == None
        assert new_user.lastName == None
        assert new_user.email == "realemail@fakedomain.com"


def test_single_char_name(session_factory: Session):
    """Verify that user names can be just one character, per the
    US Web Design System Guidance.
    """
    with session_factory() as empty_db_session:
        repo = UserRepository(empty_db_session)
        new_user = repo.add_user(email="realemail@fakedomain.com",
                                firstName="n",
                                role=UserRole.GUEST)
        assert new_user.role.type == UserRole.GUEST.value
        assert new_user.firstName == "n"
        assert new_user.middleName == None
        assert new_user.lastName == None
        assert new_user.email == "realemail@fakedomain.com"


def test_firstname_required(session_factory: Session):
    """Test that the firstname must at least contain one non-space character."""
    with session_factory() as empty_db_session:
        repo = UserRepository(empty_db_session)
        with pytest.raises(
                ValueError,
                match="firstName must contain at least one non-space character"):
            repo.add_user(email="realemail@fakedomain.com",
                        firstName=" ",
                        role=UserRole.GUEST)
