import jwt

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from sqlalchemy.exc import IntegrityError

from app.modules.access.schemas import User
from app.modules.access.crud import get_user, get_user_by_id, delete_user
from app.modules.deps import DbSessionDep, CognitoIdpDep, SettingsDep

router = APIRouter()


@router.get("/current", dependencies=[Depends(HTTPBearer())], response_model=User)
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

@router.delete("/{user_id}", dependencies=[Depends(HTTPBearer())])
def delete_user(id: int, db: DbSessionDep, cognito_client: CognitoIdpDep, settings: SettingsDep):

    try:
        user = get_user_by_id(db, id)

    #TODO: Add back once unmatched cases are implemented
    #     role = db_session.query(Role).filter_by(id=user.role_id).first()
        
    #     if role.name == UserRole.GUEST.value:
    #         unmatched_cases_repo = UnmatchedCaseRepository(db_session)
    #         unmatched_cases_repo.delete_case_for_guest(user.id)
            
    #     unmatched_cases = []
    #     if role.name == UserRole.COORDINATOR.value:
    #         unmatched_cases = db_session.query(UnmatchedGuestCase).filter_by(coordinator_id=user.id).all()


    #     if len(unmatched_cases) > 0:
    #         user_repo = UserRepository(db_session)
    #         guests_by_id = {x.id: x for x in user_repo.get_users_with_role(UserRole.GUEST)}
    #         guest_emails_with_ids = [{
    #             'id': x.guest_id,
    #             'email': guests_by_id[x.guest_id].email,
    #         } for x in unmatched_cases]

    #         guest_emails_with_ids_strs = [f'{g["email"]} (#{g["id"]})' for g in guest_emails_with_ids]
            
    #         return {
    #             "message": f"Coordinator is associated with {len(unmatched_cases)} case(s). Move these Guest(s) to a different Coordinator before attempting to delete this account",
    #             "items":guest_emails_with_ids_strs
    #         }, 400
        
    except Exception as error:
        raise HTTPException(status_code=400, detail=error)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=422, detail={
            "message": "An error occured while removing user to database."
        })   

    # delete user from cognito
    try:
        cognito_client.admin_delete_user(
            UserPoolId=settings.COGNITO_USER_POOL_ID,
            Username=user.email
        )
    except Exception as e:
        message = e.response['Error']['Message']
        raise HTTPException(status_code=401, detail=message)

    # delete user from database
    try:
        delete_user(db, id)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=422, detail="An error occured while removing user to database.")

    return {"message": "User deleted successfully"}
