from flask import Response

from openapi_server.models.database import User, DataAccessLayer
from openapi_server.models.schema import user_schema, users_schema
from openapi_server.models.user_roles import UserRole
from openapi_server.repositories.user_repo import UserRepository
from sqlalchemy import select

def create_host(body: dict) -> Response:
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        new_host = user_repo.add_user(
            email=body['email'],
            role=UserRole.HOST,
            first_name=body['first_name'],
            middle_name=body.get('middle_name', None),
            last_name=body['last_name']
        )
        return user_schema.dump(new_host), 201

def get_hosts() -> Response:
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        all_users = user_repo.get_users_with_role(UserRole.HOST)
        return users_schema.dump(all_users), 200
