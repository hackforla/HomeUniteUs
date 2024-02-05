import string
from tests import TestsWithMockingDisabled


def strip_punctuation(text):
    return text.translate(str.maketrans("", "", string.punctuation))


class TestAuthenticationEndpoints(TestsWithMockingDisabled):
    def test_signin_with_fake_credentials(self):
        """
        Attempts to login using incorrect credentials
        should return a 401 error.
        """
        response = self.client.post(
            "/api/auth/signin",
            json={
                "email": "inbox928@placeholder.org",
                "password": "_pp#FXo;h$i~",
            },
        )
        self.assert401(response)

    def test_signin_without_email_format(self):
        """
        Attempts to login using an email field that
        does not follow the email format will return a
        400 error instead of 401.
        """
        response = self.client.post(
            "/api/auth/signin",
            json={"email": "notta_email", "password": "_pp#FXo;h$i~"},
        )
        self.assert400(response)
        assert "is not a email" in strip_punctuation(
            response.json["detail"].lower()
        )

    def test_refresh_without_cookie(self):
        """
        Attempts to use the refresh endpoint without a session
        cookie attached should return a 'cookie missing'
        error instead of an authentication failure.
        """
        response = self.client.get("api/auth/refresh")
        self.assert400(response)
        assert "missing cookie" in response.json["detail"].lower()

    def test_session_without_jwt(self):
        """
        Attempts to use the refresh endpoint without a session
        cookie attached should return a 'JWT missing'
        error instead of an authentication failure.
        """
        response = self.client.get("api/auth/session")
        self.assert401(response)
        assert (
            "no authorization token provided"
            in response.json["detail"].lower()
        )

    def test_session_without_cookie(self):
        """
        Attempts to use the refresh endpoint without a session
        cookie attached should return a 'cookie missing'
        error instead of an authentication failure.
        """
        response = self.client.get(
            "api/auth/session",
            headers={"Authorization": "Bearer fake_jwt_token_here"},
        )
        self.assert401(response)
        assert "invalid access token" in response.json["message"].lower()
