from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app) 

    app.config.from_object("db.config")

    from db.models import db
    db.init_app(app)

    with app.app_context():
        from routes import app_bp
        app.register_blueprint(app_bp)

    return app