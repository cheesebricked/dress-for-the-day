from flask import Flask, jsonify, request
import requests
from keys import key_weather, key_fashion
from flask_cors import CORS, cross_origin
from config import *
from models import *


@app.route('/')
def main():
    return "lmao"

# API fetching

@app.route('/weather')
def weather_key():
    try:
        lat = request.args.get('lat')
        long = request.args.get('long')
        return requests.get(key_weather(lat, long)).content, 200
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions

@app.route('/fashion')
def fashion_key():
    try:
        season = request.args.get('season')
        gender = request.args.get('gender')
        imgCount = request.args.get('img_count')
        return requests.get(key_fashion(season, gender, imgCount)).content, 200
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions



# user handling

@app.route('/login')
def login():
    pass

@app.route('/register', methods=["POST"])
def register():
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")     # maybe hashing can happen before password is sent so it cant be intercepted?

    if not username or not email or not password:
        return jsonify({"message" : "You must include a username, password, and email."}), 400

    new_contact = User(username = username, email = email, password = password)
    try:
        db.session.add(new_contact)         # prepare to write to database
        db.session.commit()                 # write to database
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions
    
    return jsonify({"message" : "User created!"}), 201

    


def reset_db():
    db.drop_all()
    db.create_all()

if __name__ == "__main__":      # only excecute main if we are running main directly
    with app.app_context():
        db.create_all()         # create all models in database
    
    app.run(debug = True)