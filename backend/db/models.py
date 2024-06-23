from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# gotta figure out how to store a list of links here (liked photos)

user_likes = db.Table('user_likes',
                      db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                      db.Column('like_id', db.Integer, db.ForeignKey('like.id')))

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)      
    username = db.Column(db.String(80), unique = False, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(80), unique = False, nullable = False)
    likes = db.relationship('Like', secondary = user_likes, backref='likers')

    def __repr__(self):
        return f'User(id = {self.id}, username = {self.username}, email = {self.email}, password = {self.password})'

class Like(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    image_link = db.Column(db.String(999), unique = False, nullable = False)

    def __repr__(self):
        return f'Like(id = {self.id}, image_link = {self.image_link})'