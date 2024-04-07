import string
import re
import pytest
from werkzeug.http import parse_cookie
from openapi_server.models.database import DataAccessLayer, User 

from tests.setup_utils import create_user, create_and_signin_user


def strip_punctuation(text):
    return text.translate(str.maketrans("", "", string.punctuation))

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
    assert response.status_code == 400
    assert re.search(r"missing cookie.*session", response.json['detail'], flags=re.IGNORECASE)

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

def _signup_unconfirmed(signup_endpoint, client, is_mocking):
    email = 'inbox928@placeholder.org'
    password = 'Fakepass%^&7!asdf'
    signup_response = client.post(
        signup_endpoint,
        json = {
            'email': email,
            'password': password
        }
    )

    assert signup_response.status_code == 200, "Signup attempt failed"
    expect_user_confirmed = is_mocking
    assert signup_response.json["UserConfirmed"] == expect_user_confirmed, (
        "When using the real AWS service newly signed up users should not be confirmed. "
        "Mocked users, however, should be auto-confirmed for convenience.")

    signin_response = client.post(
        '/api/auth/signin',
        json = {
            'email': email,
            'password': password
        }
    )
    
    if expect_user_confirmed:
        assert signin_response.status_code == 200, "Mocked users should be able to signin without confirmation."
        assert "token" in signin_response.json, "Signin succeeded but no token provided"
    else:
        assert signin_response.status_code == 401, (
            "When using the real AWS service signin should fail since user is unconfirmed. ")
        assert signin_response.json["Code"] == "UserNotConfirmedException"

def test_signup_unconfirmed_host(client, is_mocking):
    '''
    Use the host signup endpoint to 
    test that unconfirmed accounts cannot be used to login to the API.
    Mocked users are automatically confirmed.
    '''
    _signup_unconfirmed('/api/auth/signup/host', client, is_mocking)

def test_signup_unconfirmed_coordinator(client, is_mocking):
    '''
    Use the coordinator signup endpoint to 
    test that unconfirmed accounts cannot be used to login to the API.
    Mocked users are automatically confirmed.
    '''
    _signup_unconfirmed('/api/auth/signup/coordinator', client, is_mocking)

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

def test_signin_returns_session_cookie(client):
    '''
    Test that the /signin endpoint returns a session cookie. 
    The session cookie stores the refresh token.
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
    all_cookies = map(parse_cookie, response.headers.getlist("Set-Cookie"))
    session_cookie_filter = filter(lambda cookie: "session" in cookie, all_cookies)
    session_cookie = next(session_cookie_filter)
    assert len(session_cookie["session"]) > 0, "Session cookie is empty" 
    with pytest.raises(StopIteration):
        # Only one session cookie should be available
        next(session_cookie_filter)

def test_refresh_endpoint(client):
    '''
    Test refreshing a JWT using the /refresh endpoint.
    '''
    EMAIL = 'inbox928@placeholder.org'
    PASSWORD = 'Fake4!@#$2589FFF'
    create_and_signin_user(client, EMAIL, PASSWORD)

    # The test_client automatically attaches the session cookie to the request
    # The session cookie stores the refresh token.
    response = client.get(
        'api/auth/refresh',
    )

    assert response.status_code == 200, f"refresh failed: {response.json}"
    assert 'token' in response.json, 'refresh succeeded but token field missing from response'

def test_session_endpoint(client):
    '''
    Test refreshing a JWT using the /session endpoint.
    '''
    EMAIL = 'inbox928@placeholder.org'
    PASSWORD = 'Fake4!@#$2589FFF'
    jwt = create_and_signin_user(client, EMAIL, PASSWORD)

    # The test_client automatically attaches the session cookie to the request
    # The session cookie stores the refresh token.
    response = client.get(
        'api/auth/session',
        headers={"Authorization": f"Bearer {jwt}"}
    )

    assert response.status_code == 200, f"session failed: {response.json}"
    assert 'token' in response.json, 'session succeeded but token field missing from response'

def test_user_signup_rollback(app):
    """ Verify that a failed signup with cognito 
    reverts the local DB entry of the user's email."""


    rollback_email = 'test_user_signup_rollback@fake.com'
    signup_response = app.test_client().post(
        '/api/auth/signup/host',
        json = {
            'email': rollback_email,
            'password': 'lol'
        }
    )
    assert signup_response.status_code == 400
    with pytest.raises(app.boto_client.exceptions.UserNotFoundException):
        app.boto_client.admin_delete_user(
            UserPoolId=app.config['COGNITO_USER_POOL_ID'],
            Username=rollback_email
        )
    with DataAccessLayer.session() as sess:
        rolledback_user = sess.query(User).filter_by(email=rollback_email).first()\
        # This assertion will fail on `main` because no rollback is happening
        assert rolledback_user is None