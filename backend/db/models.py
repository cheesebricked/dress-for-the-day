from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# gotta figure out how to store a list of links here (liked photos)

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)      
    username = db.Column(db.String(80), unique = False, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(80), unique = True, nullable = False)
    #likes = db.relationship('Like', backref='owner')

    def to_json(self):
        # returns a python dicitonary of the contact
        return {
            "id" : self.id,
            "username" : self.username,
            "email" : self.email,
            "password" : self.password
        }

"""
class Like(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    image_link = db.Column(db.String(999), unique = False, nullable = False)
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'))
"""