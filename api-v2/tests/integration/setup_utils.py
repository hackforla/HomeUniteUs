from fastapi import TestClient


def signup_user(client: TestClient,
                email: str,
                password: str,
                firstName: str = None,
                middleName: str = None,
                lastName: str = None) -> None:
    if not firstName: firstName = "firstName"
    if not lastName: lastName = "lastName"
    if not middleName: middleName = ""

    signup_response = client.post('/api/auth/signup/host',
                                  json={
                                      'email': email,
                                      'password': password,
                                      'firstName': firstName,
                                      'middleName': middleName,
                                      'lastName': lastName
                                  })
    # Currently the signup returns different response structures for auth
    # errors and "Bad Request" errors. Ideally the structure of the response
    # would always be the same where there is an error.
    assert signup_response.status_code != 400, f"User factory failed to signup user: {signup_response.status}, {signup_response.text}"
    assert signup_response.status_code == 200, f"User factory failed to signup user: {signup_response.json['message']}"


def confirm_user(boto_client, email: str) -> None:
    confirm_response = boto_client.admin_confirm_sign_up(
        UserPoolId=app.config["COGNITO_USER_POOL_ID"], Username=email)
    assert confirm_response['ResponseMetadata'][
        'HTTPStatusCode'] == 200, f"User factory failed to confirm user"


def create_user(client: TestClient,
                email: str,
                password: str,
                firstName: str = None,
                middleName: str = None,
                lastName: str = None) -> None:
    '''
    Signup and confirm a new user. Fail the test if the 
    signup or confirm operation fails.
    '''
    signup_user(client, email, password, firstName, middleName, lastName)
    confirm_user(client, email)


def signin_user(client: TestClient, email: str, password: str) -> str:
    '''
    Signin a user and return the JWT. Fail the test if the 
    signin operation fails.
    '''
    response = client.post('/api/auth/signin',
                           json={
                               'email': email,
                               'password': password
                           })
    assert response.status_code == 200, "Signin failed"
    assert "token" in response.json, "Signin succeeded but no token provided"
    return response.json['token']


def create_and_signin_user(client: TestClient, email: str,
                           password: str) -> (str, str):
    '''
    Signup, confirm, and signin a new user. Return the JWT.
    Fail the test if the signup, confirm, or signin operation fails.
    '''
    create_user(client, email, password)
    return signin_user(client, email, password)
