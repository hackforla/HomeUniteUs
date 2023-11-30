import string
import re

from tests.setup_utils import create_user

def strip_punctuation(text):
    return text.translate(str.maketrans('', '', string.punctuation))

def test_signin_with_fake_credentials(client):
    response = client.post(
            '/api/auth/signin',
            json = {
                'email': 'inbox928@placeholder.org',
                'password': '_pp#FXo;h$i~'
            }
        )
    assert response.status_code == 401

def test_signin_without_email_format(client):
    '''
    Attempts to login using an email field that 
    does not follow the email format will return a 
    400 error instead of 401.
    '''
    response = client.post(
        '/api/auth/signin',
        json = {
            'email': 'notta_email',
            'password': '_pp#FXo;h$i~'
        }
    )

    assert response.status_code == 400
    assert "is not a email" in strip_punctuation(response.json["detail"].lower())

def test_refresh_without_cookie(client):
    '''
    Attempts to use the refresh endpoint without a session
    cookie attached should return a 'cookie missing' 
    error instead of an authentication failure.
    '''
    response = client.get(
        'api/auth/refresh'
    )
    assert response.status_code == 400
    assert "missing cookie" in response.json['detail'].lower()

def test_session_without_jwt(client):
    '''
    Attempts to use the refresh endpoint without a session
    cookie attached should return a 'JWT missing' 
    error instead of an authentication failure.
    '''
    response = client.get(
        'api/auth/session'
    )
    assert response.status_code == 401 
    assert "no authorization token provided" in response.json['detail'].lower()

def test_session_without_cookie(client):
    '''
    Attempts to use the refresh endpoint without a session
    cookie attached should return a 'cookie missing' 
    error instead of an authentication failure.
    '''
    response = client.get(
        'api/auth/session',
        headers={"Authorization": "Bearer fake_jwt_token_here"}
    )
    assert response.status_code == 401
    assert re.search(r"invalid.*token", response.json['message'], flags=re.IGNORECASE)

def test_incorrect_JWT_fail_auth(client):
    '''
    Attempts to use an incorrect JWT with the user endpoint returns
    and authentication error.
    '''
    response = client.get(
        'api/auth/user',
        headers={"Authorization": "Bearer fake_jwt_token_here"}
    )
    assert response.status_code == 401
    assert re.search(r"invalid.*token", response.json['message'], flags=re.IGNORECASE)

def test_signup_unconfirmed(client):
    '''
    Test that unconfirmed accounts cannot be used to login to the API.
    '''
    email = 'inbox928@placeholder.org'
    password = 'Fakepass%^&7!asdf'
    signup_response = client.post(
        '/api/auth/signup/host',
        json = {
            'email': email,
            'password': password
        }
    )

    assert signup_response.status_code == 200, "Signup attempt failed"
    assert not signup_response.json["UserConfirmed"], "Newly signed up user was already confirmed!"

    signin_response = client.post(
        '/api/auth/signin',
        json = {
            'email': email,
            'password': password
        }
    )

    assert signin_response.status_code == 401, "Signin should fail since user is unconfirmed!"
    assert signin_response.json["Code"] == "UserNotConfirmedException"

def test_signup_confirmed(client):
    '''
    Test that confirmed accounts can be used to login to the API.
    '''
    EMAIL = 'inbox928@placeholder.org'
    PASSWORD = 'Fakepass%^&7!asdf'
    create_user(client, EMAIL, PASSWORD)
    
    signin_response = client.post(
        '/api/auth/signin',
        json = {
            'email': EMAIL,
            'password': PASSWORD
        }
    )
    assert signin_response.status_code == 200, "Signup attempt failed"
    assert "token" in signin_response.json, "Signin succeeded but no token provided"
    assert len(signin_response.json["token"]) > 0

def test_weak_passwords_rejected(client):
    '''
    Test that attempting to signup a new user with a password
    that does not meet AWS Cognito password complexity requirements
    returns a valid error.
    '''
    email = 'inbox928@placeholder.org'
    password = 'weakpa55'
    signup_response = client.post(
        '/api/auth/signup/host',
        json = {
            'email': email,
            'password': password
        }
    )

    assert signup_response.status_code == 400, "The weak password worked for signup!"
    assert "password did not conform with policy" in signup_response.json["message"].lower()

def test_basic_auth_flow(client):
    '''
    Create a new user, confirm it, and login using the 
    /signin endpoint, and use the returned JWT to access 
    a protected endpoint.
    '''
    EMAIL = 'inbox928@placeholder.org'
    PASSWORD = 'Fake4!@#$2589FFF'
    create_user(client, EMAIL, PASSWORD)

    response = client.post(
        '/api/auth/signin',
        json = {
            'email': EMAIL,
            'password': PASSWORD
        }
    )
    assert response.status_code == 200, "Signin failed"
    assert 'token' in response.json, 'Signin succeeded but token field missing from response'
    jwt = response.json['token']
    assert jwt is not None, 'Signin succeeded but returned empty jwt'
    assert len(jwt) > 0

    response = client.get(
        'api/auth/user',
        headers={"Authorization": f"Bearer {jwt}"}
    )

    assert response.status_code == 200, '/user authentication failed'
    assert 'user' in response.json
    assert 'email' in response.json['user']
    assert response.json['user']['email'] == EMAIL
