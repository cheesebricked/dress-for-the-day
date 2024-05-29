from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # allows cross origin requests

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"       # specifices what to name database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False        # tracks modifications made to the database

db = SQLAlchemy(app) # creates a database instance