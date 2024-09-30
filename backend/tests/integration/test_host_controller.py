from app.modules.access.user_repo import UserRepository
from app.modules.access.user_roles import UserRole


def test_get_hosts(client, session_factory):
    """Test that get_hosts returns all hosts available in the database.

    The endpoint should properly filter out all other user roles.
    """
    # Arrange
    with session_factory() as session:
        user_repo = UserRepository(session)
        user_repo.add_user(email="host0@email.com",
                           role=UserRole.HOST,
                           firstName="host0",
                           middleName=None,
                           lastName="host_last0")
        user_repo.add_user(email="host1@email.com",
                           role=UserRole.HOST,
                           firstName="host1",
                           middleName=None,
                           lastName="host_last1")
        user_repo.add_user(email="host2@email.com",
                           role=UserRole.HOST,
                           firstName="host2",
                           middleName=None,
                           lastName="host_last2")
        user_repo.add_user(email="guest1@email.com",
                           role=UserRole.GUEST,
                           firstName="guest0",
                           middleName=None,
                           lastName="guest_last0")
        user_repo.add_user(email="Admin2@email.com",
                           role=UserRole.ADMIN,
                           firstName="Admin0",
                           middleName=None,
                           lastName="cdmin_last0")
        user_repo.add_user(email="Coordinator3@email.com",
                           role=UserRole.COORDINATOR,
                           firstName="coodinator0",
                           middleName=None,
                           lastName="coordinator_last0")

    # Act
    response = client.get('/api/hosts')

    # Assert
    assert response.status_code == 200, response.json()
    assert isinstance(response.json(), list)
    assert len(response.json()) == 3
    host_emails_set = set()
    for host in response.json():
        assert 'host' in host["email"]
        assert 'host' in host["firstName"]
        assert 'host_last' in host["lastName"]
        assert host["role"]["type"] == UserRole.HOST.value
        assert host["middleName"] == None
        host_emails_set.add(host["email"])

    assert len(host_emails_set) == 3, "Duplicate hosts were returned!"
