# called before every test
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

import pytest
from backend.db.models import db
from backend.app import create_app

@pytest.fixture()
def app():
    app = create_app("sqlite://")
    app.config['TESTING'] = True

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()
        db.session.remove()


@pytest.fixture()
def client(app):
    return app.test_client()


