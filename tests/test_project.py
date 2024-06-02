

from backend.db.models import User

def test_main(client):
    # check if '/' works
    response = client.get("/")
    assert b"lmao" in response.data

def test_register(client, app):
    # test registration for one
    response = client.post("/register", data={"username":"user", "email":"tester@test.com", "password":"pwd"})
    assert b'New user user created!' in response.data
    assert b"You must include a username, password, and email." not in response.data

    with app.app_context():
        assert User.query.count() == 1
        assert User.query.filter_by(username="user").first().email == "tester@test.com"

def test_register_two(client, app):
    # test registration for two
    client.post("/register", data={"username":"user", "email":"tester@test.com", "password":"pwd"})
    response = client.post("/register", data={"username":"general zod", "email":"zod@krypton.com", "password":"louislane"})
    assert b'New user general zod created!' in response.data
    assert b"You must include a username, password, and email." not in response.data

    with app.app_context():
        assert User.query.count() == 2
        assert User.query.filter_by(username="general zod").first().email == "zod@krypton.com"

def test_register_empty(client):
    response = client.post("/register", data={"username":"", "email":"tester@test.com", "password":"pwd"})
    assert b"You must include a username, password, and email." in response.data
    response = client.post("/register", data={"username":"user", "email":"", "password":"pwd"})
    assert b"You must include a username, password, and email." in response.data
    response = client.post("/register", data={"username":"user", "email":"tester@test.com", "password":""})
    assert b"You must include a username, password, and email." in response.data