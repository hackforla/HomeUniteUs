import string
import re
from tests import TestsWithMockingDisabled, BaseTestCase

def strip_punctuation(text):
    return text.translate(str.maketrans('', '', string.punctuation))

class TestAuthenticationEndpoints(BaseTestCase):

    def test_signin_with_fake_credentials(self):
        '''
        Attempts to login using incorrect credentials
        should return a 401 error.
        '''
        response = self.client.post(
            '/api/auth/signin',
            json = {
                'email': 'inbox928@placeholder.org',
                'password': '_pp#FXo;h$i~'
            }
        )
        self.assert401(response)

    def test_signin_without_email_format(self):
        '''
        Attempts to login using an email field that 
        does not follow the email format will return a 
        400 error instead of 401.
        '''
        response = self.client.post(
            '/api/auth/signin',
            json = {
                'email': 'notta_email',
                'password': '_pp#FXo;h$i~'
            }
        )
        self.assert400(response)
        assert "is not a email" in strip_punctuation(response.json["detail"].lower())

    def test_refresh_without_cookie(self):
        '''
        Attempts to use the refresh endpoint without a session
        cookie attached should return a 'cookie missing' 
        error instead of an authentication failure.
        '''
        response = self.client.get(
            'api/auth/refresh'
        )
        self.assert400(response)
        assert "missing cookie" in response.json['detail'].lower()

    def test_session_without_jwt(self):
        '''
        Attempts to use the refresh endpoint without a session
        cookie attached should return a 'JWT missing' 
        error instead of an authentication failure.
        '''
        response = self.client.get(
            'api/auth/session'
        )
        self.assert401(response)
        assert "no authorization token provided" in response.json['detail'].lower()

    def test_session_without_cookie(self):
        '''
        Attempts to use the refresh endpoint without a session
        cookie attached should return a 'cookie missing' 
        error instead of an authentication failure.
        '''
        response = self.client.get(
            'api/auth/session',
            headers={"Authorization": "Bearer fake_jwt_token_here"}
        )
        self.assert401(response)
        assert re.search(r"invalid.*token", response.json['message'], flags=re.IGNORECASE)

    def test_incorrect_JWT_fail_auth(self):
        '''
        Attempts to use an incorrect JWT with the user endpoint returns
        and authentication error.
        '''
        response = self.client.get(
            'api/auth/user',
            headers={"Authorization": "Bearer fake_jwt_token_here"}
        )
        self.assert401(response)
        assert re.search(r"invalid.*token", response.json['message'], flags=re.IGNORECASE)

    def test_signup_unconfirmed(self):
        '''
        Test that unconfirmed accounts cannot be used to login to the API.
        '''
        email = 'inbox928@placeholder.org'
        password = 'Fakepass%^&7!asdf'
        signup_response = self.client.post(
            '/api/auth/signup/host',
            json = {
                'email': email,
                'password': password
            }
        )

        self.assert200(signup_response, "Signup attempt failed")
        assert not signup_response.json["UserConfirmed"], "Newly signed up user was already confirmed!"

        signin_response = self.client.post(
            '/api/auth/signin',
            json = {
                'email': email,
                'password': password
            }
        )
        self.assert401(signin_response, "Signin should fail since user is unconfirmed!")
        assert signin_response.json["Code"] == "UserNotConfirmedException"

    def test_signup_confirmed(self):
        '''
        Test that confirmed accounts can be used to login to the API.
        '''
        email = 'inbox928@placeholder.org'
        password = 'Fakepass%^&7!asdf'
        
        self.signup_user(email, password)
        self.confirm_user(email)
        
        signin_response = self.client.post(
            '/api/auth/signin',
            json = {
                'email': email,
                'password': password
            }
        )
        self.assert200(signin_response, "Signup attempt failed")
        assert "token" in signin_response.json, "Signin succeeded but no token provided"
        assert len(signin_response.json["token"]) > 0

    def test_weak_passwords_rejected(self):
        '''
        Test that attempting to signup a new user with a password
        that does not meet AWS Cognito password complexity requirements
        returns a valid error.
        '''
        email = 'inbox928@placeholder.org'
        password = 'weakpa55'
        signup_response = self.client.post(
            '/api/auth/signup/host',
            json = {
                'email': email,
                'password': password
            }
        )

        self.assert400(signup_response, "The weak password worked for signup!")
        assert "password did not conform with policy" in signup_response.json["message"].lower()

    def test_basic_auth_flow(self):
        '''
        Create a new user, confirm it, and login using the 
        /signin endpoint, and use the returned JWT to access 
        a protected endpoint.
        '''
        email = 'inbox928@placeholder.org'
        password = 'Fake4!@#$2589FFF'

        self.signup_user(email, password)
        self.confirm_user(email)
        jwt = self.login(email, password)

        assert jwt is not None, 'Login failed'
        response = self.client.get(
            'api/auth/user',
            headers={"Authorization": f"Bearer {jwt}"}
        )
        self.assert200(response, '/user authentication failed')
        assert 'user' in response.json
        assert 'email' in response.json['user']
        assert response.json['user']['email'] == email
