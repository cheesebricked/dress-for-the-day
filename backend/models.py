from config import db

# gotta figure out how to store a list of links here (liked photos)

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)      
    username = db.Column(db.String(80), unique = False, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(80), unique = True, nullable = False)

    def to_json(self):
        # returns a python dicitonary of the contact
        return {
            "id" : self.id,
            "username" : self.username,
            "email" : self.email,
            "password" : self.password
        }