import string
import secrets
import pytest

from fastapi.testclient import TestClient

from app.modules.deps import get_cognito_client
from app.modules.access.models import User

PATH = "/api/auth"
secretsGenerator = secrets.SystemRandom()


@pytest.fixture
def client(client, cognito_client) -> TestClient:
    client.app.dependency_overrides[
        get_cognito_client] = lambda: cognito_client

    return client


def signup_user(client: TestClient,
                email: str,
                password: str,
                first_name: str = None,
                middle_name: str = None,
                last_name: str = None) -> None:
    if not first_name:
        first_name = "firstName"
    if not last_name:
        last_name = "lastName"
    if not middle_name:
        middle_name = ""

    signup_response = client.post(PATH + '/signup',
                                  json={
                                      'email': email,
                                      'password': password,
                                      'firstName': first_name,
                                      'middleName': middle_name,
                                      'lastName': last_name,
                                      'role': 'host',
                                  })
    assert signup_response.status_code != 400, signup_response.text
    assert signup_response.status_code == 200, signup_response.text


def confirm_user(cognito_client, api_settings, email: str) -> None:
    confirm_response = cognito_client.admin_confirm_sign_up(
        UserPoolId=api_settings.COGNITO_USER_POOL_ID, Username=email)
    assert confirm_response['ResponseMetadata'][
        'HTTPStatusCode'] == 200, confirm_response


def create_user(client: TestClient,
                api_settings,
                cognito_client,
                email: str,
                password: str,
                firstName: str = None,
                middleName: str = None,
                lastName: str = None) -> None:
    """Sign-up and confirm a new user.

    Fail the test if the signup or confirm operation fails.
    """
    signup_user(client, email, password, firstName, middleName, lastName)
    confirm_user(cognito_client, api_settings, email)


def signin_user(client: TestClient, email: str, password: str) -> str:
    """Sign-in a user and return the access token.

    Fail the test if the sign-in operation fails.
    """
    response = client.post(PATH + '/signin',
                           json={
                               'email': email,
                               'password': password
                           })
    assert response.status_code == 200, "Signin failed"
    assert "token" in response.json(), "Signin succeeded but no token provided"
    return response.json()['token']


def create_and_signin_user(client: TestClient, api_settings, cognito_client,
                           email: str, password: str) -> (str, str):
    """
    Signup, confirm, and signin a new user. Return the JWT.
    Fail the test if the signup, confirm, or signin operation fails.
    """
    create_user(client, api_settings, cognito_client, email, password)
    return signin_user(client, email, password)


def strip_punctuation(text):
    return text.translate(str.maketrans("", "", string.punctuation))


def test_signin_with_fake_credentials(client):
    response = client.post(PATH + '/signin',
                           json={
                               'email': 'mdndndkde@email.com',
                               'password': '_pp#FXo;h$i~'
                           })

    body = response.json()
    assert response.status_code == 400, body
    assert body["detail"]["code"] == "UserNotFoundException", body


def test_signin_without_email_format(client):
    """Test login using a malformed email."""
    response = client.post(PATH + '/signin',
                           json={
                               'email': 'not_an_email',
                               'password': '_pp#FXo;h$i~'
                           })

    assert response.status_code == 422
    assert "not a valid email address" in response.text, response


def test_signup_with_missing_fields(client):
    """Test attempts to sign-up without all required fields."""
    BAD_SIGNUP_REQUESTS = [{
        'email': 'inbox928@placeholder.org',
        'password': 'Fakepass%^&7!asdf'
    }, {
        'email': 'inbox928@placeholder.org',
        'password': 'Fakepass%^&7!asdf',
        'lastName': 'test'
    }, {
        'email': 'inbox928@placeholder.org',
        'firstName': 'test',
        'lastName': 'test'
    }, {
        'password': 'Fakepass%^&7!asdf',
        'firstName': 'test',
        'lastName': 'test'
    }, {
        'password': 'Fakepass%^&7!asdf',
        'role': 'guest'
    }, {}]

    for req in BAD_SIGNUP_REQUESTS:
        response = client.post(PATH + '/signup', json=req)
        assert response.status_code == 422, req
        assert 'Field required' in response.text, req


def test_refresh_without_cookie(client):
    """Test attempts to use the refresh endpoint without a session cookie."""
    response = client.get(PATH + '/refresh')
    assert response.status_code == 401
    assert "Missing refresh token" in response.json()['detail']


def test_session_without_cookie(client):
    """Test attempt to use the session endpoint without a session cookie.
    """
    response = client.get(
        PATH + '/session',
        headers={"Authorization": "Bearer fake_jwt_token_here"})
    assert response.status_code == 401
    assert "Missing refresh token or id token" in response.json()['detail']


def test_incorrect_JWT_fail_auth(client):
    """Test attempts to use an incorrect JWT with the user endpoint."""
    response = client.get(
        '/api/users/current',
        headers={"Authorization": "Bearer fake_jwt_token_here"})
    assert response.status_code == 401
    assert "Missing id token" in response.json()['detail']


def _signup_unconfirmed(signup_endpoint, role, client, expect_user_confirmed):
    email = f'{secretsGenerator.randint(1_000, 2_000)}@email.com'
    password = 'Fakepass%^&7!asdf'
    signup_response = client.post(signup_endpoint,
                                  json={
                                      'email': email,
                                      'password': password,
                                      "firstName": "valid name",
                                      "role": role,
                                  })

    assert signup_response.status_code == 200, signup_response.text
    assert signup_response.json(
    )["message"] == "User sign up successful", signup_response.text

    signin_response = client.post(PATH + '/signin',
                                  json={
                                      'email': email,
                                      'password': password
                                  })

    if expect_user_confirmed:
        assert signin_response.status_code == 200, signin_response.text
        assert "token" in signin_response.json(), signin_response.text
    else:
        assert signin_response.status_code == 400, signin_response.text
        assert signin_response.json()["detail"][
            "code"] == "UserNotConfirmedException", signin_response.text


def test_signup_unconfirmed_host(client):
    """
    Use the host signup endpoint to
    test that unconfirmed accounts cannot be used to login to the API.
    Mocked users are automatically confirmed.
    """
    _signup_unconfirmed(PATH + "/signup", "host", client, False)


def test_signup_unconfirmed_coordinator(client):
    """
    Use the coordinator signup endpoint to
    test that unconfirmed accounts cannot be used to login to the API.
    Mocked users are automatically confirmed.
    """
    _signup_unconfirmed(PATH + "/signup", "coordinator", client, False)


def test_signup_confirmed(client, api_settings, cognito_client):
    """Test that confirmed accounts can be used to login to the API."""
    email = f'{secretsGenerator.randint(1_000, 2_000)}@email.com'
    password = 'Fakepass%^&7!asdf'
    create_user(client, api_settings, cognito_client, email, password)

    signin_response = client.post(PATH + '/signin',
                                  json={
                                      'email': email,
                                      'password': password
                                  })
    assert signin_response.status_code == 200, "Signup attempt failed"
    assert "token" in signin_response.json(
    ), "Signin succeeded but no token provided"
    assert len(signin_response.json()["token"]) > 0


def test_weak_passwords_rejected(client):
    """Test that attempting to sign-up a new user with a password
    that does not meet AWS Cognito password complexity requirements
    returns a valid error.
    """
    email = f'{secretsGenerator.randint(1_000, 2_000)}@email.com'
    password = 'weakpa55'
    signup_response = client.post(PATH + '/signup',
                                  json={
                                      'email': email,
                                      'password': password,
                                      'firstName': 'unqiue',
                                      'lastName': 'name',
                                      'role': 'host'
                                  })

    assert signup_response.status_code == 400, "The weak password worked for signup!"
    assert "Failed to create user" in signup_response.text, signup_response.text


def test_basic_auth_flow(client, api_settings, cognito_client):
    """Create a new user, confirm it, and login using the
    /signin endpoint, and use the returned JWT to access
    a protected endpoint.
    """
    EMAIL = f'{secretsGenerator.randint(1_000, 2_000)}@email.com'
    PASSWORD = 'Fake4!@#$2589FFF'
    FIRST_NAME = "test"
    LAST_NAME = "test"
    create_user(client,
                api_settings,
                cognito_client,
                EMAIL,
                PASSWORD,
                firstName=FIRST_NAME,
                lastName=LAST_NAME)

    response = client.post(PATH + '/signin',
                           json={
                               'email': EMAIL,
                               'password': PASSWORD
                           })

    assert response.status_code == 200, "Signin failed"
    assert 'token' in response.json(
    ), 'Signin succeeded but token field missing from response'
    jwt = response.json()['token']
    assert jwt is not None, 'Signin succeeded but returned empty jwt'
    assert len(jwt) > 0

    response = client.get('/api/users/current',
                          headers={"Authorization": f"Bearer {jwt}"})

    assert response.status_code == 200, '/user authentication failed'
    assert response.json()['email'] == EMAIL
    assert response.json()['firstName'] == FIRST_NAME
    assert response.json()['middleName'] == ''
    assert response.json()['lastName'] == LAST_NAME


def test_signin_returns_refresh_token(client, api_settings, cognito_client):
    """Test that the /signin endpoint returns a session cookie.

    The session cookie stores the refresh token.
    """
    EMAIL = f'{secretsGenerator.randint(1_000, 2_000)}@email.com'
    PASSWORD = 'Fake4!@#$2589FFF'
    create_user(client, api_settings, cognito_client, EMAIL, PASSWORD)
    response = client.post(PATH + '/signin',
                           json={
                               'email': EMAIL,
                               'password': PASSWORD
                           })

    assert response.status_code == 200, "Signin failed"
    all_cookies = response.cookies
    assert all_cookies.get("refresh_token"), "Session cookie is empty"

@pytest.mark.skip(reason="""moto is not behaving as expected.
It is calculating the secret hash using email while AWS Cognito wants it to be calculated using username.
This causes moto to give false negatives when requesting a refresh token.""")
def test_refresh_endpoint(client, api_settings, cognito_client):
    """Test refreshing a JWT using the /refresh endpoint."""
    EMAIL = f'{secretsGenerator.randint(1_000, 2_000)}@email.com'
    PASSWORD = 'Fake4!@#$2589FFF'
    jwt = create_and_signin_user(client, api_settings, cognito_client, EMAIL,
                                 PASSWORD)

    response = client.get(PATH + '/refresh',
                          headers={"Authorization": f"Bearer {jwt}"})

    assert response.status_code == 200, response.text
    assert 'token' in response.json(), response.text


@pytest.mark.skip(reason="""moto is not behaving as expected.
It is calculating the secret hash using email while AWS Cognito wants it to be calculated using username.
This causes moto to give false negatives when requesting a refresh token.""")
def test_session_endpoint(client, api_settings, cognito_client):
    """Test refreshing a JWT using the /session endpoint."""
    EMAIL = f'{secretsGenerator.randint(1_000, 2_000)}@email.com'
    PASSWORD = 'Fake4!@#$2589FFF'
    jwt = create_and_signin_user(client, api_settings, cognito_client, EMAIL,
                                 PASSWORD)

    import jwt as j
    print(
        j.decode(client.cookies["id_token"],
                 algorithms=["RS256"],
                 options={"verify_signature": False}))
    response = client.get(PATH + '/session',
                          headers={"Authorization": f"Bearer {jwt}"})

    assert response.status_code == 200, response.text
    assert 'token' in response.json(), response.text


def test_user_signup_rollback(client, api_settings, cognito_client,
                              session_factory):
    """Test that a failed sign-up with Cognito.

    Ensure the local DB entry of the user's email is deleted."""

    rollback_email = 'test_user_signup_rollback@fake.com'
    signup_response = client.post(PATH + '/signup',
                                  json={
                                      'email': rollback_email,
                                      'password': 'lol',
                                      'firstName': 'firstname',
                                      'lastName': 'lastname',
                                      'role': 'host',
                                  })

    assert signup_response.status_code == 400

    with pytest.raises(cognito_client.exceptions.UserNotFoundException):
        cognito_client.admin_delete_user(
            UserPoolId=api_settings.COGNITO_USER_POOL_ID,
            Username=rollback_email)

    with session_factory() as sess:
        rolledback_user = sess.query(User).filter_by(
            email=rollback_email).first()
        assert rolledback_user is None
