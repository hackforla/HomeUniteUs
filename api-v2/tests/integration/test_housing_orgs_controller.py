from fastapi.testclient import TestClient

PATH = "/api/housing-orgs"


def populate_test_database(client: TestClient, num_entries: int) -> list[int]:
    """Add the given number of entries to the database.

    Add num_entries rows to the test database and return the
    created ids. fail test if any of the creation requests
    fails.

    note: orgs are created using sqlalchemy commands,
    not api requests.
    """
    ids = []
    for i in range(num_entries):
        REQUESTED_ORG = {"org_name": f"org no {i}"}
        response = client.post(PATH, json=REQUESTED_ORG)
        assert response.status_code == 201, "Could not create housing org."
        org = response.json()
        assert org is not None, (
            f"test setup failure. failed to create org no {i}."
            "cannot perform endpoint test!")
        assert 'id' in org
        ids.append(org["id"])
    return ids


def test_create_housing_org(client):
    """Test create a new housing org."""
    requested_org = {"org_name": "-123ASCII&"}

    # POST
    response = client.post(PATH, json=requested_org)
    assert response.status_code == 201
    response_obj = response.json()
    assert response_obj["org_name"] == requested_org["org_name"]

    # GET
    response = client.get(f"{PATH}/{response_obj['id']}")
    assert response.status_code == 200
    response_obj = response.json()
    assert response_obj["id"] == 1
    assert response_obj["org_name"] == requested_org["org_name"]


def test_create_duplicate_housing_org_redirects(client):
    """Test create a duplicate housing org redirects."""
    requested_org = {"org_name": "-123ASCII&"}

    # POST 1 of 2
    response = client.post(PATH, json=requested_org)
    assert response.status_code == 201
    response_obj = response.json()
    assert response_obj["id"] is not None
    assert response_obj["org_name"] == requested_org["org_name"]

    org_id = response_obj["id"]

    # POST 2 of 2 should redirect instead of creating a new one
    # Explicitly turn on following redirects to get a HTTP 200.
    # The wrong status code (307) was being returned when setting
    # follow_redirect to False. At the time of this writting, it
    # seems that something changed the controller's RedirectResponse
    # status code.
    response = client.post(PATH, follow_redirects=True, json=requested_org)
    assert response.status_code == 200, "Should have redirected to existing resource."
    response_obj = response.json()
    assert response_obj["id"] is not None
    assert response_obj["org_name"] == requested_org["org_name"]


def test_create_with_extra_data(client):
    """Test that sending an create POST request with extra
    json entries in the body does not disrupt the update.

    We should safely ignore additional fields.
    """
    create_request = {
        "org_name": "A new org",
        "extra_int": 1,
        "extra_bool": True,
        "extra_string": "I'm notta name"
    }

    response = client.post(PATH, json=create_request)
    response_body = response.json()

    assert response.status_code == 201
    assert 'org_name' in response_body
    assert 'id' in response_body
    assert response_body['org_name'] == create_request['org_name']
    assert 'extra_int' not in response_body, "We should not send back request json extra fields"
    assert 'extra_bool' not in response_body, "We should not send back request json extra fields"
    assert 'extra_string' not in response_body, "We should not send back request json extra fields"

    response = client.get(f"{PATH}/{response_body['id']}")
    assert response.status_code == 200, "POST succeeded but the housing org doesn't exist."
    assert response_body["org_name"] == create_request["org_name"]


def test_create_bad_json_invalid_type(client):
    bad_create_request = {"org_name": 1}
    response = client.post(PATH, json=bad_create_request)

    assert response.status_code == 422


def test_create_bad_json_missing_name(client):
    bad_create_request = {"org_namez": 1}
    response = client.post(PATH, json=bad_create_request)

    assert response.status_code == 422


def test_delete_housing_org(client: TestClient):
    """
    Test deleting a housing org that we know exists,
    using a delete request.
    """
    ids = populate_test_database(client=client, num_entries=1)
    path = f'{PATH}/{ids[0]}'
    response = client.delete(path)
    assert response.status_code == 204

    response = client.get(path)
    assert response.status_code == 404, "Housing org was not deleted."


def test_delete_nonexistant_org(client: TestClient):
    """
    Test that deleting a nonexistant org responds with the
    correct status code and does not modify the db.
    """
    NUM_ROWS = 4
    populate_test_database(client=client, num_entries=NUM_ROWS)

    response = client.get(PATH)
    response_body = response.json()
    assert response.status_code == 200, "Housing orgs endpoint failure."
    assert len(response_body) == NUM_ROWS

    response = client.delete(f"{PATH}/{999}")
    assert response.status_code == 404

    response = client.get(PATH)
    response_body = response.json()
    assert response.status_code == 200, "Housing orgs endpoint failure."
    assert len(response_body) == NUM_ROWS


def test_get_nonexistent_org(client: TestClient):
    populate_test_database(client=client, num_entries=8)
    response = client.get(f"{PATH}/{999}")
    response_body = response.json()

    assert response.status_code == 404
    assert 'org_name' not in response_body


def test_get_housing_orgs(client: TestClient):
    """Test case for get_housing_orgs

    Get a list of housing orgs.
    """
    expected_org_count = 12
    populate_test_database(client=client, num_entries=expected_org_count)

    response = client.get(PATH)
    response_body = response.json()

    assert response.status_code == 200
    assert len(response_body) == expected_org_count


def test_get_housing_org_empty_db(client):
    response = client.get(PATH)
    response_body = response.json()

    assert response.status_code == 200
    assert len(response_body) == 0


def test_put_update_housing_org(client: TestClient):
    """Test case for update_housing_org

    Update a housing org
    """
    ids = populate_test_database(client=client, num_entries=1)
    updated_org = {"org_name": "Rebranded Org~~~"}

    response = client.put(f"{PATH}/{ids[0]}", json=updated_org)

    assert response.status_code == 200

    response_obj = response.json()
    assert response_obj["org_name"] == updated_org["org_name"]
    assert response_obj["id"] == ids[0]


def test_put_create_housing_org_no_id(client: TestClient):
    put_body = {"org_name": "New Housing Org Name"}
    response = client.put(f"{PATH}/{999}", json=put_body)
    assert response.status_code == 201


def test_put_create_housing_org_mismatch_id(client: TestClient):
    failed_put_body = {"id": 1, "org_name": "New Housing Org Name"}
    response = client.put(f"{PATH}/{999}", json=failed_put_body)
    assert response.status_code == 409


def test_put_with_extra_data(client: TestClient):
    """
    Test that sending an update PUT request with extra
    json entries in the body does not disrupt the update.

    We should safely ignore additional fields.
    """
    ids = populate_test_database(client=client, num_entries=1)
    update_request = {
        "org_name": "A brand new name",
        "extra_int": 1,
        "extra_bool": True,
        "extra_string": "I'm notta name"
    }
    response = client.put(f"{PATH}/{ids[0]}", json=update_request)
    response_body = response.json()

    assert response.status_code == 200

    assert 'org_name' in response_body
    assert 'id' in response_body
    assert 'extra_int' not in response_body, "We should not send back request json extra fields"
    assert 'extra_bool' not in response_body, "We should not send back request json extra fields"
    assert 'extra_string' not in response_body, "We should not send back request json extra fields"

    assert response_body['org_name'] == update_request["org_name"]
    assert response_body['id'] == ids[0]
