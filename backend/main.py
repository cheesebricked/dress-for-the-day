from app import create_app
from db.models import db

app = create_app()

if __name__ == "__main__":      # only excecute main if we are running main directly
    app.run(debug = True)