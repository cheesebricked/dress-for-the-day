from flask import jsonify, request, Blueprint
import requests
from keys import key_weather, key_fashion
from db.models import *

app_bp = Blueprint('main', __name__)

@app_bp.route('/')
def main():
    return "lmao"


# API fetching

@app_bp.route('/weather')
def weather_key():
    try:
        lat = request.args.get('lat')
        long = request.args.get('long')
        return requests.get(key_weather(lat, long)).content, 200
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions

@app_bp.route('/fashion')
def fashion_key():
    try:
        season = request.args.get('season')
        gender = request.args.get('gender')
        imgCount = request.args.get('img_count')
        return requests.get(key_fashion(season, gender, imgCount)).content, 200
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions



# user handling

@app_bp.route('/login')
def login():
    pass

@app_bp.route('/register', methods=["POST"])
def register():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")     # maybe hashing can happen before password is sent so it cant be intercepted?

    if not username or not email or not password:
        return jsonify({"message" : "You must include a username, password, and email."}), 400

    new_contact = User(username = username, email = email, password = password)
    try:
        db.session.add(new_contact)         # prepare to write to database
        db.session.commit()                 # write to database
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions
    
    return jsonify({"message" : f'New user {username} created!'}), 201

@app_bp.route('/get_users', methods=["GET"])
def get_users():
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"contacts": json_users})

@app_bp.route("/update_user/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message":"User not found"}), 404
    
    data = request.form
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.password = data.get("password", user.password)

    db.session.commit()

    return jsonify({"message":"User updated"}), 201

@app_bp.route('/delete_user/<int:user_id>', methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message":"User not found"}), 404
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message":'User deleted'})