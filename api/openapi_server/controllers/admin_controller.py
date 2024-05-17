
import connexion
import jwt
from sqlalchemy.exc import IntegrityError
from flask import session, current_app

from openapi_server.controllers import auth_controller
from openapi_server.exceptions import AuthError
from openapi_server.models.database import DataAccessLayer, User
from openapi_server.repositories.user_repo import UserRepository
from openapi_server.models.schema import user_schema
import botocore

def new_password(): 
    """Sets new password.
     
    Removes auto generated password and replaces with 
    user assigned password. Used for account setup.

    Returns: 
        Response object or exception
    """
    body = connexion.request.get_json()
    userId = body['userId']
    password = body['password']
    sessionId = body['sessionId']

    try:        
        secret_hash = current_app.calc_secret_hash(userId)
    
        # call forgot password method
        response = current_app.boto_client.respond_to_auth_challenge(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            ChallengeName = 'NEW_PASSWORD_REQUIRED',
            Session=sessionId,
            ChallengeResponses = {
                'NEW_PASSWORD': password ,
                'USERNAME': userId,
                'SECRET_HASH': secret_hash
            },
            
        )
    except Exception as e:  
        raise AuthError({"message": "failed to change password"}, 500) from e
    
    access_token = response['AuthenticationResult']['AccessToken']
    refresh_token = response['AuthenticationResult']['RefreshToken']
    id_token = response['AuthenticationResult']['IdToken']

    decoded_id_token = jwt.decode(id_token, algorithms=["RS256"], options={"verify_signature": False})
    print('decoded_id_token:', decoded_id_token)

    try:
        with DataAccessLayer.session() as db_session:
            user_repo = UserRepository(db_session)
            signed_in_user = user_repo.get_user(decoded_id_token['email'])
            user = user_schema.dump(signed_in_user)
    except Exception as e:
        current_app.logger.info('Failed to retrieve user: %s from db', decoded_id_token['email'])
        raise AuthError({
            'code': 'database_error',
            'message': str(e)
        }, 401)

    session['refresh_token'] = refresh_token
    session['id_token'] = id_token
    session['username'] = decoded_id_token['email']

    # return user data json
    return {
        'token': access_token,
        'user': user
    }

def remove_user(body: dict, removeDB: bool = True, removeCognito: bool = True):
    '''
    Remove a user from connected database and AWS Cognito user pool.
    This method is only available to admin users.

    body should contain the email of the user to be removed, e.g.:
    {
        "email": "EMAIL_TO_REMOVE"
    }
    Function takes removeDB and removeCognito params to specificy 
    where the user is removed from. By default, the user is removed from both.
    '''
    if not removeDB and not removeCognito:
        print("User was not deleted in Database nor Cognito")
    if removeDB:   
        with DataAccessLayer.session() as session:
            user = session.query(User).filter_by(email=body['email']).first()
            if user:
                session.delete(user)
            try:
                session.commit()
            except IntegrityError:
                session.rollback()
                # Since we're deleting, an IntegrityError might indicate a different problem
                # Adjust the error message accordingly
                raise AuthError({
                    "message": "Could not delete the user due to a database integrity constraint."
                }, 422)
    if removeCognito:
        try:
            response = current_app.boto_client.admin_delete_user(
                UserPoolId=current_app.config['COGNITO_USER_POOL_ID'],
                Username=body['email']
            )
            return response
        except botocore.exceptions.ClientError as error:
            match error.response['Error']['Code']:
                case 'UserNotFoundException':
                    msg = "User not found. Could not delete user."
                    raise AuthError({"message": msg}, 400)
                case _:
                    msg = error.response['Error']['Message']
                    raise AuthError({"message": msg}, 500)