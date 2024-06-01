# called before every test

import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from backend.config import db

def create_app(db_name):
    app = Flask(__name__)
    CORS(app) # allows cross origin requests

    app.config["SQLALCHEMY_DATABASE_URI"] = db_name       # specifices what to name database
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False        # tracks modifications made to the database

    return app

@pytest.fixture()
def app():
    app = Flask(__name__)
    #CORS(app) # allows cross origin requests

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite://"       # specifices what to name database
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False        # tracks modifications made to the database
    

    with app.app_context():
        db.init_app(app)
        db.create_all()

    yield app       # yield runs after test

@pytest.fixture()
def client(app):
    return app.test_client()


