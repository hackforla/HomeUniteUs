import pytest 
from sqlalchemy.exc import IntegrityError

from openapi_server.models.database import User, Role

def test_user_role_required(empty_db_session):
    new_user = User(email="realemail@fakedomain.com", firstName="realemail@fakedomain.com", middleName="realemail@fakedomain.com", 
                        lastName="realemail@fakedomain.com")
    empty_db_session.add(new_user)
    with pytest.raises(IntegrityError, match="NOT NULL constraint failed"):
        empty_db_session.commit()