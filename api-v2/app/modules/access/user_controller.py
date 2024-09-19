import jwt

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer

from app.modules.access.schemas import User
from app.modules.access.crud import get_user
from app.modules.deps import DbSessionDep

router = APIRouter()


@router.get("/", dependencies=[Depends(HTTPBearer())], response_model=User)
def get_user_info(request: Request, db: DbSessionDep):
    """Get user route.

    This route is used to get the current user info.
    """
    id_token = request.cookies.get('id_token')
    if (id_token is None):
        raise HTTPException(status_code=401, detail="Missing id token")

    decoded = jwt.decode(id_token,
                         algorithms=["RS256"],
                         options={"verify_signature": False})
    email = decoded['email']
    if (email is None):
        raise HTTPException(status_code=401, detail="Email not found in token")

    user = get_user(db, email)

    return user
