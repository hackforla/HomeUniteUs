
import string

from openapi_server.controllers.auth_controller import get_token_auth_header

from openapi_server.models.database import DataAccessLayer, User
from flask import session, current_app
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from openapi_server.exceptions import AuthError

def delete_user(user_id: string):
    # get access token from header
    access_token = get_token_auth_header()

    # delete user from cognito
    try:
        response = current_app.boto_client.delete_user(
            AccessToken=access_token
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