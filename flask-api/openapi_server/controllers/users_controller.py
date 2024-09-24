
from openapi_server.controllers.auth_controller import get_token_auth_header

from openapi_server.models.database import DataAccessLayer, User
from flask import session, current_app
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from openapi_server.exceptions import AuthError
from openapi_server.repositories.user_repo import UnmatchedCaseRepository, UserRepository

from openapi_server.models.database import Role, UnmatchedGuestCase
from openapi_server.models.user_roles import UserRole

def delete_user(user_id: int):    

    # get the user's username (i.e. email) from db
    with DataAccessLayer.session() as db_session:
        try:
            user_repo = UserRepository(db_session)
            user: User = user_repo.get_user_by_id(user_id)
            role = db_session.query(Role).filter_by(id=user.role_id).first()
            
            if role.name == UserRole.GUEST.value:
                unmatched_cases_repo = UnmatchedCaseRepository(db_session)
                unmatched_cases_repo.delete_case_for_guest(user.id)
                
            unmatched_cases = []
            if role.name == UserRole.COORDINATOR.value:
                unmatched_cases = db_session.query(UnmatchedGuestCase).filter_by(coordinator_id=user.id).all()


            if len(unmatched_cases) > 0:
                user_repo = UserRepository(db_session)
                guests_by_id = {x.id: x for x in user_repo.get_users_with_role(UserRole.GUEST)}
                guest_emails_with_ids = [{
                    'id': x.guest_id,
                    'email': guests_by_id[x.guest_id].email,
                } for x in unmatched_cases]

                guest_emails_with_ids_strs = [f'{g["email"]} (#{g["id"]})' for g in guest_emails_with_ids]
                
                return {
                    "message": f"Coordinator is associated with {len(unmatched_cases)} case(s). Move these Guest(s) to a different Coordinator before attempting to delete this account",
                    "items":guest_emails_with_ids_strs
                }, 400
            
        except AuthError as auth_error:
            raise auth_error
        except IntegrityError:
            db_session.rollback()
            raise AuthError({
                "message": "An error occured while removing user to database."
            }, 422)
    

    # delete user from cognito
    try:
        response = current_app.boto_client.admin_delete_user(
            UserPoolId=current_app.config['COGNITO_USER_POOL_ID'],
            Username=user.email
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)
    
    # delete user from database
    with DataAccessLayer.session() as db_session:
        db_session.execute(
            delete(User).where(User.id==user_id)
        )
        try:
            db_session.commit()
        except IntegrityError:
            db_session.rollback()
            raise AuthError({
                "message": "An error occured while removing user to database."
            }, 422)
        
    # Remove refresh token cookie
    session.pop('refresh_token', None)

    return response