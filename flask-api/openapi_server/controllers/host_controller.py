from flask import Response

from openapi_server.models.database import DataAccessLayer
from openapi_server.models.schema import users_schema
from openapi_server.models.user_roles import UserRole
from openapi_server.repositories.user_repo import UserRepository

def get_hosts() -> Response:
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        all_users = user_repo.get_users_with_role(UserRole.HOST)
        return users_schema.dump(all_users), 200
