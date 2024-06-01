
def test_register(client):
    response = client.post("/register", data={"username":"user", "email":"tester@test.com", "password":"pwd"})

    assert b"User created!" in response.data
