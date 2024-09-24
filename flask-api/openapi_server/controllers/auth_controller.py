import connexion
import botocore
import requests
import jwt
import random
import json

from flask import (
    redirect, 
    request, 
    session, 
    current_app # type: openapi_server.app.HUUFlaskApp
)
from openapi_server.exceptions import AuthError
from openapi_server.models.database import DataAccessLayer, User
from openapi_server.repositories.user_repo import UnmatchedCaseRepository, UserRepository
from openapi_server.models.user_roles import UserRole
from openapi_server.models.schema import user_schema
from sqlalchemy import select

from botocore.exceptions import ClientError


cognito_client_url = 'https://homeuniteus.auth.us-east-1.amazoncognito.com'

# Get user attributes from Cognito response
def get_user_attr(user_data):
    user_attr = {}
    for attribute in user_data['UserAttributes']:
        if attribute['Name'] == 'email':
            user_attr["email"] = attribute['Value']
        if attribute['Name'] == 'given_name':
            user_attr["first_name"] = attribute['Value']
        if attribute['Name'] == 'family_name':
            user_attr["last_name"] = attribute['Value']


    return user_attr

# Get auth token from header
def get_token_auth_header():
    auth = request.headers.get('Authorization', None)
    if not auth:
        raise AuthError({
        'code': 'authorization_header_missing',
        'message': 'Authorization header is expected.'
        }, 401)
    
    parts = auth.split()

    # check if the header is in the correct format
    if parts[0].lower() != 'bearer':
        raise AuthError({
        'code': 'invalid_header',
        'message': 'Authorization header must start with "Bearer".'
        }, 401)
    
    if len(parts) == 1:
            raise AuthError({"code": "invalid_header",
                            "message": "Token not found"}, 401)
    if len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                            "message":
                                "Authorization header must be"
                                " Bearer token"}, 401)
    # return token
    token = parts[1]
    return token

def sign_up(body: dict, role: UserRole):
    from openapi_server.controllers.admin_controller import remove_user
    # import locally to avoid circular import error 
    secret_hash = current_app.calc_secret_hash(body['email'])

    try:
        with DataAccessLayer.session() as db_session:
            user_repo = UserRepository(db_session)
            user_repo.add_user(
                email=body['email'],
                role=role,
                firstName=body['firstName'],
                middleName=body.get('middleName', ''),
                lastName=body.get('lastName', '')
            )
    except Exception as error:
        raise AuthError({"message": str(error)}, 400)

    try:
        response = current_app.boto_client.sign_up(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=body['email'],
            Password=body['password'],
            ClientMetadata={
                'url': current_app.root_url
            }
        )
        return response

    except botocore.exceptions.ClientError as error:
        match error.response['Error']['Code']:
            case 'UsernameExistsException': 
                msg = "A user with this email already exists."
                raise AuthError({  "message": msg }, 400)
            case 'NotAuthorizedException':
                msg = "User is already confirmed."
                raise AuthError({  "message": msg }, 400)
            case 'InvalidPasswordException':
                msg = "Password did not conform with policy"
                remove_user(body, removeDB=True, removeCognito=False)
                raise AuthError({  "message": msg }, 400)
            case 'TooManyRequestsException':
                msg = "Too many requests made. Please wait before trying again."
                remove_user(body, removeDB=True, removeCognito=False)
                raise AuthError({  "message": msg }, 408)
            case _:
                msg = "An unexpected error occurred."
                remove_user(body, removeDB=True, removeCognito=False)
                raise AuthError({  "message": msg }, 400)
    except botocore.excepts.ParameterValidationError as error:
        msg = f"The parameters you provided are incorrect: {error}"
        remove_user(body, True, False)
        raise AuthError({"message": msg}, 500)
    
def signUpAdmin(body: dict):
    return sign_up(body, UserRole.ADMIN)

def signUpHost(body: dict):
    """Signup a new Host"""
    return sign_up(body, UserRole.HOST)

def signUpCoordinator(body: dict):  # noqa: E501
    """Signup a new Coordinator"""
    return sign_up(body, UserRole.COORDINATOR)

def sign_in(body: dict):
    secret_hash = current_app.calc_secret_hash(body['email'])

    # initiate authentication
    try:
        response = current_app.boto_client.initiate_auth(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': body['email'],
                'PASSWORD': body['password'],
                'SECRET_HASH': secret_hash
            }
        )

        current_app.logger.info('%s initiated auth with Cognito successfully', body['email'])
    except ClientError as e:
        current_app.logger.info('Failed to initiate auth with Cognito for user: %s', body['email'])
        raise AuthError({
            'code': e.response["Error"]["Code"], 
            'message': e.response["Error"]["Message"]}, 401)
    
    if(response.get('ChallengeName') and response['ChallengeName'] == 'NEW_PASSWORD_REQUIRED'):
        current_app.logger.info('User being redirected to create new password page', body['email'])

        userId = response['ChallengeParameters']['USER_ID_FOR_SRP']
        sessionId = response['Session']
        return redirect(f"{current_app.root_url}/create-password?userId={userId}&sessionId={sessionId}")              

    access_token = response['AuthenticationResult']['AccessToken']
    refresh_token = response['AuthenticationResult']['RefreshToken']
    id_token = response['AuthenticationResult']['IdToken']

    user_data = None
    try:
        with DataAccessLayer.session() as db_session:
            user_repo = UserRepository(db_session)
            signed_in_user = user_repo.get_user(body['email'])
            user_data = user_schema.dump(signed_in_user)
    except Exception as e:
        current_app.logger.info('Failed to retrieve user: %s from db', body['email'])
        raise AuthError({
            'code': 'database_error',
            'message': str(e)
        }, 401)
    
    # set refresh token cookie
    session['refresh_token'] = refresh_token
    session['id_token'] = id_token
    session['username'] = body['email']

    # return user data json
    return {
        'token': access_token,
        'user': user_data
    }

def resend_confirmation_code():
    '''
    Resends the registration confirmation code to the specified user (identified by email).
    '''

    if connexion.request.is_json:
        body = connexion.request.get_json()

    if "email" not in body:
        raise AuthError({"message": "email invalid"}, 400)

    secret_hash = current_app.calc_secret_hash(body['email'])

    try:
        email = body['email']
        current_app.boto_client.resend_confirmation_code(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=email,
            ClientMetadata={
              'url': current_app.root_url
          }
        )
        message = "A confirmation code is being sent again."
        return {"message": message}, 200
    except botocore.exceptions.ClientError as error:
        match error.response['Error']['Code']:
            case 'UserNotFoundException':
                msg = "User not found. Confirmation not sent."
                raise AuthError({"message": msg}, 400)
            case 'TooManyRequestsException':
                msg = "Too many attempts to resend confirmation in a short amount of time."
                raise AuthError({"message": msg}, 429)
            case _:
                msg = error.response['Error']['Message']
                raise AuthError({"message": msg}, 500)
    except botocore.exceptions.ParamValidationError as error:
        msg = f"The parameters you provided are incorrect: {error}"
        raise AuthError({"message": msg}, 500)


def confirm_sign_up():
    code = request.args['code']
    email = request.args['email']
    client_id = request.args['clientId']

    secret_hash = current_app.calc_secret_hash(email)

    try:
        current_app.boto_client.confirm_sign_up(
            ClientId=client_id,
            SecretHash=secret_hash,
            Username=email,
            ConfirmationCode=code
        )

        return redirect(f"{current_app.root_url}/email-verification-success")
    except Exception as e:
        return redirect(f"{current_app.root_url}/email-verification-error")
    
def confirm_sign_up_v2(body: dict):   
    secret_hash = current_app.calc_secret_hash(body['email'])

    try:
        response = current_app.boto_client.confirm_sign_up(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=body['email'],
            ConfirmationCode=body['code'],
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    return response

def signout():
    access_token = get_token_auth_header()

    # Signout user
    response = current_app.boto_client.global_sign_out(
        AccessToken=access_token
    )

    # Remove refresh token cookie
    session.pop('refresh_token', None)

    # send response
    return response

def google_sign_in():
    # get code from body
    code = request.get_json()['code']
    client_id = current_app.config['COGNITO_CLIENT_ID']
    client_secret = current_app.config['COGNITO_CLIENT_SECRET']
    callback_uri = request.args['callback_uri']

    token_url = f"{cognito_client_url}/oauth2/token"
    auth = requests.auth.HTTPBasicAuth(client_id, client_secret)
    redirect_uri = f"{current_app.root_url}{callback_uri}"

    params = {
      'grant_type': 'authorization_code',
      'client_id': client_id,
      'code': code,
      'redirect_uri': redirect_uri
    }

    # get tokens from oauth2/token endpoint
    response = requests.post(token_url, auth=auth, data=params)

    refresh_token = response.json().get('refresh_token')
    access_token = response.json().get('access_token')
    id_token = response.json().get('id_token')

    # retrieve user data
    try:
        user_data = current_app.boto_client.get_user(AccessToken=access_token)
    except botocore.exceptions.ClientError as e:        
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    # create user object from user data
    user_attrs = get_user_attr(user_data)

    # check if user exists in database
    with DataAccessLayer.session() as db_session:
        user_repo = UserRepository(db_session)
        signed_in_user = user_repo.get_user(user_attrs['email'])
        if(bool(signed_in_user) == True):
            user = user_schema.dump(signed_in_user)
        else:
            #if user does not exist in database, they haven't gone through sign up process, delete user from Cognito and return error
            try:
                decoded = jwt.decode(id_token, algorithms=["RS256"], options={"verify_signature": False})
                
                current_app.logger.info('Deleting user from Cognito')
                response = current_app.boto_client.admin_delete_user(
                    UserPoolId=current_app.config['COGNITO_USER_POOL_ID'],
                    Username=decoded["cognito:username"]
                )
                current_app.logger.info('User deleted from Cognito')
                raise AuthError({
                    'code': 'No user found',
                    'message': 'No user found'
                }, 400)
            except botocore.exceptions.ClientError as e:
                current_app.logger.error('Failed to delete user from Cognito')
                code = e.response['Error']['Code']
                message = e.response['Error']['Message']
                raise AuthError({
                    'code': code,
                    'message': message
                }, 400)

    # set refresh token cookie
    session['refresh_token'] = refresh_token
    session['username'] = user_attrs['email']
    session['id_token'] = id_token


    # return user data json
    return {
        'token': access_token,
        'user': user
    }

def google_sign_up():
    # get code from body
    code = request.get_json()['code']
    client_id = current_app.config['COGNITO_CLIENT_ID']
    client_secret = current_app.config['COGNITO_CLIENT_SECRET']
    callback_uri = request.args['callback_uri']

    token_url = f"{cognito_client_url}/oauth2/token"
    auth = requests.auth.HTTPBasicAuth(client_id, client_secret)
    redirect_uri = f"{current_app.root_url}{callback_uri}"

    params = {
      'grant_type': 'authorization_code',
      'client_id': client_id,
      'code': code,
      'redirect_uri': redirect_uri
    }

    # get tokens from oauth2/token endpoint
    response = requests.post(token_url, auth=auth, data=params)

    refresh_token = response.json().get('refresh_token')
    access_token = response.json().get('access_token')
    id_token = response.json().get('id_token')

    # retrieve user data
    try:
        user_data = current_app.boto_client.get_user(AccessToken=access_token)
    except botocore.exceptions.ClientError as e:        
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    # create user object from user data
    user_attrs = get_user_attr(user_data)
    user_role = callback_uri.split('/')[2].capitalize()

    role = None
    if user_role == 'Coordinator':
        role = UserRole.COORDINATOR
    
    if user_role == 'Host':
        role = UserRole.HOST
    
    # if role is None, delete user from Cognito and return error
    if role is None:
        try:
            current_app.logger.info('Deleting user from Cognito')
            decoded = jwt.decode(id_token, algorithms=["RS256"], options={"verify_signature": False})

            response = current_app.boto_client.admin_delete_user(
                UserPoolId=current_app.config['COGNITO_USER_POOL_ID'],
                Username=decoded["cognito:username"]
            )
            current_app.logger.info('User deleted from Cognito')
            raise AuthError({
                'code': 'invalid_role',
                'message': 'Invalid role. no role found provided'
            }, 400)
        except botocore.exceptions.ClientError as e:
            current_app.logger.error('Failed to delete user from Cognito')
            code = e.response['Error']['Code']
            message = e.response['Error']['Message']
            raise AuthError({
                'code': code,
                'message': message
            }, 400)



    try:
        with DataAccessLayer.session() as db_session:
            user_repo = UserRepository(db_session)
            user_repo.add_user(
                email=user_attrs['email'],
                role=role,
                firstName=user_attrs['first_name'],
                middleName=user_attrs.get('middle_name', ''),
                lastName=user_attrs.get('last_name', '')
            )
    except Exception as error:
        raise AuthError({"message": str(error)}, 400)
    
    with DataAccessLayer.session() as db_session:
        user_repo = UserRepository(db_session)
        signed_in_user = user_repo.get_user(user_attrs['email'])
        if(bool(signed_in_user) == True):
            user = user_schema.dump(signed_in_user)
        else:
            raise AuthError({"message": "User not found in database"}, 400)
        
    # set refresh token cookie
    session['refresh_token'] = refresh_token
    session['username'] = user_attrs['email']
    session['id_token'] = id_token


    # return user data json
    return {
        'token': access_token,
        'user': user
    }

def current_session():
    user_data = None
    with DataAccessLayer.session() as db_session:
        user_repo = UserRepository(db_session)
        signed_in_user = user_repo.get_user(session.get('username'))
        user_data = user_schema.dump(signed_in_user)

    token = refresh().get('token')

    return {
        'token': token,
        'user': user_data
    }

def refresh():
    refreshToken = session.get('refresh_token')
    username = session.get('username')
    id_token = session.get('id_token')

    if None in (refreshToken, username, id_token):
        raise AuthError({
            'code': 'session_expired',
            'message': 'Session not found'
        }, 401)

    decoded = jwt.decode(id_token, algorithms=["RS256"], options={"verify_signature": False})

    try:
        response = current_app.boto_client.initiate_auth(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            AuthFlow='REFRESH_TOKEN',
            AuthParameters={
                'REFRESH_TOKEN': refreshToken,
                'SECRET_HASH': current_app.calc_secret_hash(decoded["cognito:username"])
            }
        )
    except botocore.exceptions.ClientError as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)

    accessToken = response['AuthenticationResult']['AccessToken']

    # Return access token
    return {
      "token": accessToken
    }

def forgot_password():
    # check for json in request body
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = current_app.calc_secret_hash(body['email'])
    
    # call forgot password method
    try:
        response = current_app.boto_client.forgot_password(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=body['email']
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)
    
    return response

def confirm_forgot_password():
    # check for json in request body
    if connexion.request.is_json:
        body = connexion.request.get_json()

    secret_hash = current_app.calc_secret_hash(body['email'])

    # call forgot password method
    try:
        response = current_app.boto_client.confirm_forgot_password(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            SecretHash=secret_hash,
            Username=body['email'],
            ConfirmationCode=body['code'],
            Password=body['password']
        )
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                  "code": code, 
                  "message": message
              }, 401)
        
    return response

def user(token_info):
    email = None
    for attribute in token_info['UserAttributes']:
        if attribute['Name'] == 'email':
            email = attribute['Value']

    if(email is None):
        raise AuthError({
            'code': 'email_not_found',
            'message': 'Email not found in user data.'
        }, 401)

    user_data = None

    try:
        with DataAccessLayer.session() as db_session:
            user_repo = UserRepository(db_session)
            signed_in_user = user_repo.get_user(email)
            user_data = user_schema.dump(signed_in_user)
    except Exception as e:
        raise AuthError({
            'code': 'database_error',
            'message': str(e)
        }, 401)
    
    return {
      "user": user_data
    }

def private(token_info):
    return {'message': 'Success - private'}

def google():
    client_id = current_app.config['COGNITO_CLIENT_ID']
    root_url = current_app.root_url
    redirect_uri = request.args['redirect_uri']

    return redirect(f"{cognito_client_url}/oauth2/authorize?client_id={client_id}&response_type=code&scope=email+openid+profile+phone+aws.cognito.signin.user.admin&redirect_uri={root_url}{redirect_uri}&identity_provider=Google")

# What comes first invite or adding the user 
#Do I have an oauth token
def invite():

    if connexion.request.is_json:
        body = connexion.request.get_json()

    # TODO: Possibly encrypt these passwords?
    numbers = '0123456789'
    lowercase_chars = 'abcdefghijklmnopqrstuvwxyz'
    uppercase_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    symbols = '.-_~'
    temporary_password = ''.join(random.choices(numbers, k=3)) + ''.join(random.choices(lowercase_chars, k=3)) + ''.join(random.choices(symbols, k=1)) + ''.join(random.choices(uppercase_chars, k=3))
        
    try:
        current_app.boto_client.admin_create_user(
            UserPoolId=current_app.config['COGNITO_USER_POOL_ID'],
            Username=body['email'],
            TemporaryPassword=temporary_password,
            ClientMetadata={
                'url': current_app.config['ROOT_URL']
            },
            DesiredDeliveryMediums=["EMAIL"]
        )

    except botocore.exceptions.ClientError as error:
        match error.response['Error']['Code']:
            case 'UserNotFoundException':
                msg = "User not found. Confirmation not sent."
                raise AuthError({"message": msg}, 400)
            case _:
                msg = error.response['Error']['Message']
                raise AuthError({"message": msg}, 500)
    except botocore.exceptions.ParamValidationError as error:
        msg = f"The parameters you provided are incorrect: {error}"
        raise AuthError({"message": msg}, 500)
    
    try:
        coordinator_email = session['username']
        with DataAccessLayer.session() as db_session:
            user_repo = UserRepository(db_session)
            user_repo.add_user(
                email=body['email'],
                role=UserRole.GUEST,
                firstName=body['firstName'],
                middleName=body.get('middleName', ''),
                lastName=body.get('lastName', '')
            )
            guest_id = user_repo.get_user_id(body['email'])
            coordinator_id = user_repo.get_user_id(coordinator_email)
            unmatched_case_repo = UnmatchedCaseRepository(db_session)
            unmatched_case_repo.add_case(
                guest_id=guest_id,
                coordinator_id=coordinator_id
            )
    except Exception as error:
        raise AuthError({"message": str(error)}, 400)
    
    

    


def confirm_invite():
    
    email = request.args['email']
    password = request.args['password']
    secret_hash = current_app.calc_secret_hash(email)
    
    try:
        response = current_app.boto_client.initiate_auth(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': email,
                'PASSWORD': password,
                'SECRET_HASH': secret_hash
            }
        )
        
        if response.get('ChallengeName') == 'NEW_PASSWORD_REQUIRED':
            userId = response['ChallengeParameters']['USER_ID_FOR_SRP']
            sessionId = response['Session']

            return redirect(f"{current_app.config['ROOT_URL']}/create-password?userId={userId}&sessionId={sessionId}")
        else:
            return redirect(f"{current_app.config['ROOT_URL']}/create-password?error=There was an unexpected error. Please try again.")

    except botocore.exceptions.ClientError as error:
        msg = ''
        match error.response['Error']['Code']:
            case 'NotAuthorizedException':
                msg = "Incorrect username or password. Your inviation link may be invalid."
            case 'UserNotFoundException':
                msg = "User not found. Confirmation not sent."
            case 'TooManyRequestsException':
                msg = "Too many attempts to use invite in a short amount of time."
            case _:
                msg = error.response['Error']['Message']
        return redirect(f"{current_app.config['ROOT_URL']}/create-password?error={msg}")
    except botocore.exceptions.ParamValidationError as error:
        msg = f"The parameters you provided are incorrect: {error}"
        return redirect(f"{current_app.config['ROOT_URL']}/create-password?error={msg}")



