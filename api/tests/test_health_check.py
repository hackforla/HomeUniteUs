
def test_get_nonexistent_provider(client):
    '''
    Test that the healthcheck endpoint works.
    The endpoint should always return a success code.
    '''
    response = client.get(f"/api/health")
    assert response.status_code == 200, f'Response body is : {response.json}'
    assert len(response.json) > 0