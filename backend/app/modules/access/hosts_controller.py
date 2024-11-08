from .models import UserRoleEnum
from . import schemas
from .user_repo import UserRepository

from app.modules.deps import DbSessionDep

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_hosts(db_session: DbSessionDep) -> list[schemas.User]:
    with db_session.begin():
        user_repo = UserRepository(db_session)
        all_users = user_repo.get_users_with_role(UserRoleEnum.HOST)
        return all_users
