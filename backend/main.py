from app import create_app
from db.models import db

app = create_app()

if __name__ == "__main__":      # only excecute main if we are running main directly
    with app.app_context():
        db.create_all()         # create all models in database
    
    app.run(debug = True)