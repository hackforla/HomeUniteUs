
import connexion

from openapi_server.controllers import auth_controller
from flask import session, current_app
from openapi_server.exceptions import AuthError

def initial_sign_in_reset_password(): 
    """Sets initial password.
     
    Removes auto generated password and replaces with 
    user assigned password. Used for account setup.

    Returns: 
        Response object or exception
    """
    try:
        # check for json in request body. If not Json throws an error
        if connexion.request.is_json:
            body = connexion.request.get_json()
        else:
            raise AuthError({"message": "bad response from server"},500)

        if "email" not in body:
            raise AuthError({"message": "bad response, no email"},500)
        
        if "password" not in body:
            raise AuthError({"message": "bad response, no password"},500)
        
        secret_hash = current_app.calc_secret_hash(body['email'])
    
        # call forgot password method
        response = current_app.boto_client.respond_to_auth_challenge(
            ClientId=current_app.config['COGNITO_CLIENT_ID'],
            ChallengeName = 'NEW_PASSWORD_REQUIRED',
            Session=body['session'],
            ChallengeResponses = {
                'NEW_PASSWORD':body['password'] ,
                'USERNAME':body['email'],
                'SECRET_HASH':secret_hash
            },
            
        )
    except Exception as e:
        print(e)
        raise AuthError({"message": "failed to change password"}, 500) from e
    
    access_token = response['AuthenticationResult']['AccessToken']
    refresh_token = response['AuthenticationResult']['RefreshToken']

    user_data = current_app.boto_client.get_user(AccessToken=access_token)
    user = auth_controller.get_user_attr(user_data)

    session['refresh_token'] = refresh_token

    # return user data json
    return {
        'token': access_token,
        'user': user
    }