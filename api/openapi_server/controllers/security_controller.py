from flask import current_app

from openapi_server.exceptions import AuthError

def requires_auth(token):
    # Check if token is valid
    try:
        # Get user info from token
        userInfo = current_app.boto_client.get_user(
            AccessToken=token
        )

        return userInfo

    # handle any errors
    except Exception as e:
        code = e.response['Error']['Code']
        message = e.response['Error']['Message']
        raise AuthError({
                    "code": code, 
                    "message": message
                }, 401)