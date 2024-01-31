
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