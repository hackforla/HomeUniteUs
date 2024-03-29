from openapi_server.models.database import DataAccessLayer, Host

def test_create_host(client):
    """
    Test creating a new host using a 
    simulated post request. Verify that the 
    response is correct, and that the app 
    database was properly updated.
    """
    
    NEW_HOST = {
        "name" : "new_host"
    }
    response = client.post(
        '/api/host',
        json=NEW_HOST)
    
    assert response.status_code == 201, f'Response body is: {response.json}'
    assert 'name' in response.json
    assert 'id' in response.json
    assert response.json['name'] == NEW_HOST['name']
    
    with DataAccessLayer.session() as session:
        test_host = session.query(Host).filter_by(name=NEW_HOST['name']).first()

    assert test_host is not None
    assert test_host.name == NEW_HOST['name']

def test_create_host_empty_body(client):
    """
    Test creating a new host with an empty JSON body.
    This should return an error response.
    """

    response = client.post(
        '/api/host',
        json={})

    assert response.status_code == 400 
    

def test_create_host_invalid_data(client):
    """
    Test creating a new host with invalid data in the request body.
    This should return an error response (e.g., 400 Bad Request).
    """
    invalid_host_data = {"invalid_field": "value"}

    response = client.post('/api/host', json=invalid_host_data)
    assert response.status_code == 400


def test_get_hosts(client): 
    """
    Test that checks if a list of 5 Hosts are returned from a GET request.
    The 5 test Hosts are created by this test.  
    """

    with DataAccessLayer.session() as session:
        host1 = Host(name="host1")
        host2 = Host(name="host2")
        host3 = Host(name="host3")
        host4 = Host(name="host4")
        host5 = Host(name="host5")
        session.add_all([host1, host2, host3, host4, host5])
        session.commit()

    response = client.get('/api/host')
    assert response.status_code == 200, f'Response body is: {response.json}'
    
    assert isinstance(response.json, list)
    assert len(response.json) == 5
    for i in range(1, len(response.json) + 1):
        assert response.json[i - 1]['name'] == f"host{i}"
        assert response.json[i - 1]['id'] == i