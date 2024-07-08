from flask import Flask
from flask_cors import CORS


def create_app(database_uri="sqlite:///database.db"):
    app = Flask(__name__)
    CORS(app) 

    #app.config.from_object("db.config")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    with app.app_context():
        from routes import app_bp
        app.register_blueprint(app_bp)

    from db.models import db
    db.init_app(app)
    with app.app_context():
        db.create_all() 

    
    return app