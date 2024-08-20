from flask import jsonify, request, Blueprint
import requests
from call_apis import key_weather, key_fashion
from db.models import *

app_bp = Blueprint('main', __name__)


def item_exists(name, model):
    return db.session.query(db.exists().where(model == name)).scalar()


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



# USER ACCESS HANDLING

@app_bp.route('/login', methods=["POST"])       # TEST THIS
def login():
    post_email = request.form.get("email")
    post_password = request.form.get("password")
    post_confirm_password = request.form.get("confirm-password")

    if not post_email or not post_password:
        return jsonify({"message" : "You must include an email and password."}), 400
    
    if not post_password == post_confirm_password:
        return jsonify({"message" : "Passwords do not match."}), 400

    user_exists = item_exists(post_email, User.email)   # check if user with this email exists

    if not user_exists:
        return jsonify({"message" : "Incorrect email or passord."}), 400
    
    user = User.query.filter_by(email=post_email).first()

    if not (user.password == post_password):
        return jsonify({"message" : "Incorrect email or passord."}), 400
    

    # THEN HERE IS THE STUFF THAT HAPPENS ON A SUCESSFUL LOGIN
    # HAVENT FIGURED THAT OUT YET BUT I WILL
    


@app_bp.route('/register', methods=["POST"])
def register():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")

    if not username or not email or not password:
        return jsonify({"message" : "You must include a username, password, and email."}), 400

    new_contact = User(username = username, email = email, password = password)
    try:
        db.session.add(new_contact)         # prepare to write to database
        db.session.commit()                 # write to database
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions
    
    return jsonify({"message" : f'New user {username} created!'}), 201


# GETTERS

@app_bp.route('/get_users', methods=["GET"])
def get_users():
    users = User.query.all()
    json_users = list(map(lambda user: user.to_json(), users))

    return jsonify({"users": json_users}), 200


@app_bp.route('/get_likes', methods=["GET"])
def get_all_likes():
    likes = Like.query.all()
    json_likes = list(map(lambda like: like.to_json(), likes))

    return jsonify({"likes": json_likes}), 200


@app_bp.route('/get_user_likes/<int:user_id>', methods=["GET"])
def get_user_likes(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message":"User not found"}), 404
    
    user_likes = list(map(lambda like: like.to_json(), user.likes))

    return jsonify({f'user_likes_id:{user_id}' : user_likes}), 200




# USER UPDATE/DELETE HANDLING

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

    return jsonify({"message":'User deleted'}), 201


# LIKES

@app_bp.route('/add_like', methods=["POST"])
def add_like():
    like_url = request.args.get('like_url', None).strip()
    like_exists = item_exists(like_url, Like.image_link)
    if like_exists:
        return jsonify({"message":f'like with url "{like_url}" already exists'}), 200

    new_like = Like(image_link = like_url)
    db.session.add(new_like)
    db.session.commit()
    return jsonify({"message":f'Like with url "{like_url}" successfully added'}), 201
    

@app_bp.route('/delete_like/<int:like_id>', methods=["DELETE"])
def delete_like(like_id):
    like = Like.query.get(like_id)

    if not like:
        return jsonify({"message":"User not found"}), 404
    
    db.session.delete(like)
    db.session.commit()

    return jsonify({"message":'Like deleted'}), 201


@app_bp.route('/add_like_to_user', methods=["POST"])
def add_like_to_user():
    user_id = request.args.get('user_id', None)
    like_id = request.args.get('like_id', None)

    if not user_id or not like_id:
        return jsonify({"message":"Missing user_id or like_id"}), 400

    user = User.query.get(user_id)
    like = Like.query.get(like_id)
    if not user:
        return jsonify({"message":"User not found"}), 404
    if not like:
        return jsonify({"message":"Like not found"}), 404

    user.likes.append(like)

    db.session.commit()

    return jsonify({"message":f'Added like_id {like_id} to user_id {user_id}'}), 201


@app_bp.route('/remove_like_from_user', methods=["POST"])     # TEST THIS
def remove_like_from_user():
    user_id = request.args.get('user_id', None)
    like_id = request.args.get('like_id', None)

    if not user_id or not like_id:
        return jsonify({"message":"Missing user_id or like_id"}), 400

    user = User.query.get(user_id)
    like = Like.query.get(like_id)
    if not user:
        return jsonify({"message":"User not found"}), 404
    if not like:
        return jsonify({"message":"Like not found"}), 404

    user.likes.remove(like)     # add case for if like does not exist in user

    db.session.commit()

    return jsonify({"message":f'Removed Like from user_id {user_id}'}), 201