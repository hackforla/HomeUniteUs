from typing import List

from openapi_server.repositories.service_provider_repository import HousingProviderRepository

def populate_test_database(num_entries) -> List[int]:
    '''
    Add num_entries rows to the test database and return the
    created Ids. Fail test if any of the creation requests
    fails.

    Note: Providers are created using SQLAlchemy commands, 
    not API requests.
    '''
    ids = []
    db_helper = HousingProviderRepository()
    for i in range(num_entries):
        provider = db_helper.create_service_provider(f"Provider No {i}")
        assert provider is not None, (
            f"Test setup failure. Failed to create Provider No {i}."
            "Cannot perform endpoint test!")
        ids.append(provider.id)
    return ids

def create_user(test_client, email: str, password: str) -> None:
    '''
    Signup and confirm a new user. Fail the test if the 
    signup or confirm operation fails.
    '''
    app = test_client.application
    def _signup_user(email: str, password: str) -> None:
        signup_response = app.test_client().post(
            '/api/auth/signup/host',
            json = {
                'email': email,
                'password': password
            }
        )
        assert signup_response.status_code == 200, f"User factory failed to signup user: {signup_response.json['message']}"

    def _confirm_user(email: str) -> None:
        confirm_response = app.boto_client.admin_confirm_sign_up(
            UserPoolId=app.config["COGNITO_USER_POOL_ID"],
            Username=email
        )
        assert confirm_response['ResponseMetadata']['HTTPStatusCode'] == 200, f"User factory failed to confirm user"

    _signup_user(email, password)
    _confirm_user(email)