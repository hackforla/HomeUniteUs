from openapi_server.models.database import User, DataAccessLayer
from openapi_server.repositories.user_repo import UserRepository
from openapi_server.models.user_roles import UserRole

def test_signup_host(client):
    """
    Test creating a new host using a simulated post request. Verify that the 
    response is correct, and that the app database was properly updated.
    """
    
    NEW_HOST = {
        "email" : "test@email.com",
        "password": "Test!@123",
        "firstName": "Josh",
        "middleName": "Ray",
        "lastName": "Douglas"
    }
    response = client.post(
        '/api/auth/signup/host',
        json=NEW_HOST)
    
    assert response.status_code == 200, f'Response body is: {response.json}'

    # Make sure the database was updated to persist the values
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        test_host = user_repo.get_user(NEW_HOST['email'])
        assert test_host is not None
        assert test_host.email == NEW_HOST['email']
        assert test_host.firstName == NEW_HOST['firstName']
        assert test_host.middleName == NEW_HOST['middleName']
        assert test_host.lastName == NEW_HOST['lastName']
        assert test_host.role.name == UserRole.HOST.value
    
def test_get_hosts(client): 
    """
    Test that get_hosts returns all hosts available in the database. The endpoint
    should properly filter out all other user roles.
    """
    # Arrange
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        user_repo.add_user(email="host0@email.com", role=UserRole.HOST, firstName="host0", middleName = None, lastName="host_last0")
        user_repo.add_user(email="host1@email.com", role=UserRole.HOST, firstName="host1", middleName = None, lastName="host_last1")
        user_repo.add_user(email="host2@email.com", role=UserRole.HOST, firstName="host2", middleName = None, lastName="host_last2")
        user_repo.add_user(email="guest1@email.com", role=UserRole.GUEST, firstName="guest0", middleName = None, lastName="guest_last0")
        user_repo.add_user(email="Admin2@email.com", role=UserRole.ADMIN, firstName="Admin0", middleName = None, lastName="cdmin_last0")
        user_repo.add_user(email="Coordinator3@email.com", role=UserRole.COORDINATOR, firstName="coodinator0", middleName = None, lastName="coordinator_last0")
    
    # Act
    response = client.get('/api/host')

    # Assert
    assert response.status_code == 200, f'Response body is: {response.json}'
    assert isinstance(response.json, list)
    assert len(response.json) == 3
    host_emails_set = set()
    for host in response.json:
        assert 'host' in host["email"]
        assert 'host' in host["firstName"]
        assert 'host_last' in host["lastName"]
        assert host["role"]["name"] == UserRole.HOST.value
        assert host["middleName"] == None
        host_emails_set.add(host["email"])

    assert len(host_emails_set) == 3, "Duplicate hosts were returned!"