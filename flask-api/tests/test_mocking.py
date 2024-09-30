import pytest
import json
import requests
from pathlib import Path

from openapi_server.configs.mock_aws import AWSTemporaryUserpool, AWSMockService
from tests.setup_utils import signup_user, signin_user

def get_user_pools(boto_client):
    """Helper function to count the number of user pools."""
    MAXRESULT = 60
    response = boto_client.list_user_pools(MaxResults=60) 
    result = response['UserPools']
    assert len(result) < MAXRESULT, ("Number of userpools exceeds 60. " +
                                "To get an accurate count delete user pools or implement pagination.")
    return result

def delete_temporary_userpools(app):
    '''
    Delete all of the AWS Cognito temporary userpools, except
    for the one in use by the current app.

    Please proceed with caution before using or modifying
    this method because production userpools can be deleted
    if the name is modified (unless delete protection is in place).
    '''
    cur_app_poolid = app.config["COGNITO_USER_POOL_ID"]
    for pool in get_user_pools(app.boto_client):
        if (AWSTemporaryUserpool.is_temp_pool(pool["Name"]) 
            and pool["Id"] != cur_app_poolid):
            app.boto_client.delete_user_pool(
                UserPoolId=pool["Id"]
            )
    
def count_user_pools(boto_client):
    return len(get_user_pools(boto_client))

def tmp_userpool_count(boto_client):
    user_pools = get_user_pools(boto_client)
    return sum(AWSTemporaryUserpool.is_temp_pool(pool["Name"]) for pool in user_pools)

def count_users_in_userpool(app):
    user_count = 0
    pagination_token = None
    userpool_id = app.config["COGNITO_USER_POOL_ID"]
    while True:
        if pagination_token:
            response = app.boto_client.list_users(UserPoolId=userpool_id, PaginationToken=pagination_token)
        else:
            response = app.boto_client.list_users(UserPoolId=userpool_id)

        user_count += len(response['Users'])
        
        pagination_token = response.get('PaginationToken')
        if not pagination_token:
            break

    return user_count

def test_AWSTemporaryUserpool_cleanup(app):
    '''
    Test the temporary userpool is deleted when
    destroy() is called.
    '''
    initial_count = count_user_pools(app.boto_client)

    # Using the context manager to automatically create and destroy the user pool
    with AWSTemporaryUserpool(app):
        assert count_user_pools(app.boto_client) == (initial_count + 1), "Userpool was not created!" 

    # After exiting the block, the user pool should be destroyed
    final_count = count_user_pools(app.boto_client)

    assert initial_count == final_count, "User pool was not properly deleted"

def test_AWSTemporaryUserpool_is_temp_pool_strs():
    '''
    Test that the AWSTemporaryUserpool.is_temp_pool strictly
    matches the temporary user pool naming format. These tests
    safegaurd against accidentally removing a production user 
    pool in the event of a resource leak.
    '''
    istmp = AWSTemporaryUserpool.is_temp_pool
    assert istmp("TestUserPoola809bcbf-800a-4da0-870f-a1205e8bf40a"), "t1"
    assert istmp("TestUserPoola908dc0b-afb6-4f8a-aa50-96ca9b813b05"), "t2"
    assert istmp("TestUserPoolca0ddbf1-53fe-4bdc-bbf7-262e97d32399"), "t3"
    assert istmp("TestUserPool6eaa346c-3b55-456d-86b5-2f48ffee0b9a"), "t4"
    assert istmp("TestUserPoolced3909b-36b9-4479-8584-087cfe8d7479"), "t5"
    assert istmp("TestUserPool46eec7e1-10fb-46fe-8303-46310c63406c"), "t6"

    assert not istmp(""), "f1"
    assert not istmp("Home Unite Us"), "f2"
    assert not istmp("testUserPoola809bcbf-800a-4da0-870f-a1205e8bf40a"), "f3"
    assert not istmp("estUserPoola809bcbf-800a-4da0-870f-a1205e8bf40a"), "f4"
    assert not istmp("TestuserPoola809bcbf-800a-4da0-870f-a1205e8bf40a"), "f5"
    assert not istmp("TestUserPool a809bcbf-800a-4da0-870f-a1205e8bf40a"), "f6"
    assert not istmp("TestUserPool_a809bcbf-800a-4da0-870f-a1205e8bf40a"), "f7"
    assert not istmp("TestUserPoola809bcbf_800a-4da0-870f-a1205e8bf40a"), "f8"
    assert not istmp("TestUserPoola809bcbf-800ab-4da0-870f-a1205e8bf40a"), "f9"
    assert not istmp("TestUserPoola809bcbf-800a-4da01-870f-a1205e8bf40a"), "f9"
    assert not istmp("TestUserPoola809bcbf-800a-4da0a-870f-a1205e8bf40a"), "f10"
    assert not istmp("TestUserPoola809bcbf-800a-4da0-870f1-a1205e8bf40a"), "f11"
    assert not istmp("TestUserPoola809bcbf-800-4da0-870f-a1205e8bf40a"), "f12"
    assert not istmp("TestUserPoola809bcbf-800a-4da0-870f-a1205e8bf40a1"), "f13"
    assert not istmp("TestUserPoola809bcbf-800a-4da0-870f-a1205e8bf40aa"), "f14"
    assert not istmp("TestUserPoola809bcbf-800a-4da0-870f-a1205e8bf40"), "f15"

    with pytest.raises(TypeError):
        istmp(None)

def test_AWSTemporaryUserpool_is_temp_pool_real(app):
    '''
    Test that is_temp_pool properly identifies newly
    created temporary userpools.
    '''
    def _poolset(userpools: dict) -> set:
        return set((pool["Name"] for pool in userpools))

    existing_pools = _poolset(get_user_pools(app.boto_client))
    with AWSTemporaryUserpool(app):
        new_pool = _poolset(get_user_pools(app.boto_client)).difference(existing_pools)
        assert len(new_pool) == 1, "More than one temp user pool was created!"
        assert AWSTemporaryUserpool.is_temp_pool(new_pool.pop()) 

def test_AWSTemporaryUserpool_count(app):
    '''
    Test that the application and/or test suites do not
    have a resource leak that is polluting the AWS Cognito 
    user pools with temporary user pools. We'll set the limit
    to 30 userpools. If this number is exceeded then the developer 
    needs to delete the userpools.
    '''
    # This function can be used to cleanup leaked 
    # temporary tools. Leave it commented out before
    # pushing, however, to make sure we can detect
    # resource leaks when they occur. 
    #delete_temporary_userpools(app)
    assert tmp_userpool_count(app.boto_client) <= 30, ("AWS Cognito has a large number of temporary "
                                                       "userpools. We may have a userpool resource leak. " 
                                                       "Delete the unused pools and search for a resource leak.")

def test_AWSMockService(app, is_mocking):
    '''
    Test that starting the AWSMocking service properly 
    activates and deactivates the moto mocking service. 

    Ensure that calls to AWSCognito are properly 
    intercepted.
    '''
    # Moto uses regex patterns to intercept all cognito public key requests
    moto_fake_key_url = "https://cognito-idp.us-west-2.amazonaws.com/somekey/.well-known/jwks.json"
    if is_mocking:
        import moto
        moto_dir = Path(moto.__file__).parent
        jwks_file_path = moto_dir / "cognitoidp" / "resources" / "jwks-public.json"
        assert jwks_file_path.is_file(), "Moto public key not found. Can't proceed with test"
        with open(jwks_file_path, 'r') as file:
            moto_jwks = json.load(file)

        actual_jwks = get_json_from_url(moto_fake_key_url)
        assert actual_jwks is not None
        assert actual_jwks == moto_jwks, ("The mocking service does not appear to have been started correctly "
                                          "moto should intercept calls to AWS cognito jwks.json and return the "
                                          "fake public key stored in the moto resources folder.")
    else:
        # If mocking is not enabled then our fake url request will fail
        with pytest.raises(requests.exceptions.HTTPError):
            get_json_from_url(moto_fake_key_url)

def get_json_from_url(url):
    response = requests.get(url)
    # Raises an HTTPError if the response was an unsuccessful status code
    response.raise_for_status()  
    return response.json()

def test_signup_confirmation(client, is_mocking):
    '''
    Test that the signup confirmation works with any confirmation
    code when authentication mocking is enabled. 

    When mocking is disabled a real confirmation code will be 
    required, so the confirmation should fail.
    '''
    email = 'nottaemail@gmail.com'
    signup_user(client.application, email, 'Passw0rd!')

    response = client.post(
        '/api/auth/confirm',
        json = {
            'email': email,
            'code': 'fakeCode'
        }
    )
    
    if is_mocking:
        assert response.status_code == 200
    else:
        assert response.status_code == 401
        assert "invalid code" in response.json["message"].lower()

def test_mock_config_includes_test_users(client, is_mocking):
    '''
    Test that the mock configuration includes test users.
    '''
    if not is_mocking:
        pytest.skip("Test only applies to mock configurations")
    for user in AWSMockService.TEST_USERS:
        signin_user(client, user["email"], user["password"])