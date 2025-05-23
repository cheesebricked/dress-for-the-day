from flask import jsonify, request, Blueprint, current_app, make_response, url_for
import requests
from call_apis import key_weather, key_fashion
from db.models import *
import jwt
import datetime
from functools import wraps
from passlib.hash import pbkdf2_sha256

app_bp = Blueprint('main', __name__)

token_lifetime = 30     # IN MINUTES


def item_exists(name, model):
    return db.session.query(db.exists().where(model == name)).scalar()

def get_id_from_jwt(token):
    jwt_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    return jwt_token['id']


def token_required(f):      # put @token_required under app_bp.route to make it a token reuqired route
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('jwt_token')

        if not token:
            return jsonify({"message" : "Token is missing!"}), 403

        try:
            jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403
        
        return f(*args, **kwargs)
    return decorated


@app_bp.route('/get_username', methods=['GET'])
@token_required
def get_username():
    token = request.cookies.get('jwt_token')
    try:
        decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded_token.get('username')

        if username:
            return jsonify({'username': username})
        else:
            return jsonify({'error': 'Username not found in the token'}), 400
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@app_bp.route('/')
def main():
    return "lmao"


# API fetching

@app_bp.route('/weather', methods=["GET"])
def weather_key():
    try:
        lat = request.args.get('lat')
        long = request.args.get('long')
        return requests.get(key_weather(lat, long)).content, 200
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions

@app_bp.route('/fashion', methods=["GET"])
def fashion_key():
    try:
        season = request.args.get('season')
        gender = request.args.get('gender')
        imgCount = request.args.get('img_count')
        return requests.get(key_fashion(season, gender, imgCount)).content, 200
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions



# TOKEN STUFF
@app_bp.route('/validate_token', methods=["POST"])
@token_required
def validate_token():
    return jsonify({"message" : "Token valid"}), 200


# USER ACCESS HANDLING

@app_bp.route('/login', methods=["POST"])
def login():
    post_email = request.form.get("email")
    post_password = request.form.get("password")

    if not post_email or not post_password:
        return jsonify({"message" : "You must include an email and password."}), 400

    user_exists = item_exists(post_email, User.email)   # check if user with this email exists

    if not user_exists:
        return jsonify({"message" : "Incorrect email or password."}), 401
    
    user = User.query.filter_by(email=post_email).first()

    if not (pbkdf2_sha256.verify(post_password, user.password)):        # to add store passwords as hash, hash post password
        return jsonify({"message" : "Incorrect email or password."}), 401
    

    # on successful login:

    token = jwt.encode({'id' : user.id,
                        'user' : user.email,
                        'username': user.username,
                        'exp' :  datetime.datetime.utcnow() + datetime.timedelta(minutes=token_lifetime)},
                        current_app.config['SECRET_KEY'])

    resp = make_response(jsonify({"message" : "Login success!"}))
    resp.set_cookie(
        'jwt_token',
        token,
        max_age = (token_lifetime * 60),
        httponly = True,
        secure = True,
        samesite = 'None'
    )

    return resp, 200

@app_bp.route('/logout', methods=["POST"])
def logout():
    resp = make_response(jsonify({"message": "Logged out successfully"}))
    resp.set_cookie(
        'jwt_token', '', 
        expires=0,
        path='/',
        secure=True,
        samesite='None'
    )

    return resp, 200

@app_bp.route('/register', methods=["POST"])
def register():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    confirm_password = request.form.get("confirmPass")

    if not username or not email or not password:
        return jsonify({"message" : "You must include a username, password, and email."}), 400
    
    if not password == confirm_password:
        return jsonify({"message" : "Passwords do not match."}), 401
    
    user_exists = item_exists(email, User.email)

    if user_exists:
        return jsonify({"message" : "User already exists."}), 401
    
    hashed_password = pbkdf2_sha256.hash(password)

    new_contact = User(username = username, email = email, password = hashed_password)
    try:
        db.session.add(new_contact)         # prepare to write to database
        db.session.commit()                 # write to database
    except Exception as e:
        return jsonify({"message" : str(e)}), 400       # catch any exceptions
    
    return jsonify({"message" : f'New user {username} created!'}), 201


# GETTERS

"""
@app_bp.route('/get_users', methods=["GET"])
@token_required
def get_users():
    users = User.query.all()
    json_users = list(map(lambda user: user.to_json(), users))

    return jsonify({"users": json_users}), 200


@app_bp.route('/get_likes', methods=["GET"])
@token_required
def get_all_likes():
    likes = Like.query.all()
    json_likes = list(map(lambda like: like.to_json(), likes))

    return jsonify({"likes": json_likes}), 200
"""


@app_bp.route('/get_user_likes', methods=["GET"])
@token_required
def get_user_likes():
    token = request.cookies.get('jwt_token')
    user_id = get_id_from_jwt(token)
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message":"User not found"}), 404
    
    user_likes = list(map(lambda like: like.to_json(), user.likes))

    return jsonify({f'user_likes' : user_likes}), 200


# USER UPDATE/DELETE HANDLING

@app_bp.route("/update_user", methods=["PATCH"])        # REWORK
@token_required
def update_user():
    token = request.cookies.get('jwt_token')
    user_id = get_id_from_jwt(token)
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message":"User not found"}), 404
    
    data = request.form
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.password = data.get("password", user.password)

    db.session.commit()

    return jsonify({"message":"User updated"}), 201


@app_bp.route('/delete_user/<int:user_id>', methods=["DELETE"])     # REWORK
@token_required
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message":"User not found"}), 404
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message":'User deleted'}), 201


# LIKES

@app_bp.route('/delete_like/<int:like_id>', methods=["DELETE"])
@token_required
def delete_like(like_id):
    like = Like.query.get(like_id)

    if not like:
        return jsonify({"message":"Like not found"}), 404
    
    db.session.delete(like)
    db.session.commit()

    return jsonify({"message":'Like deleted'}), 201


@app_bp.route('/add_like_to_user', methods=["POST"])
@token_required
def add_like_to_user():
    #takes image and image url arg of image

    token = request.cookies.get('jwt_token')
    post_user_id = get_id_from_jwt(token)
    post_like_image = request.args.get('img_url', None)
    post_like_url = request.args.get('like_url', None)

    if not post_user_id or not post_like_url:
        return jsonify({"message":"Missing user_id or like_url"}), 400
    
    user = User.query.get(post_user_id)
    if not user:
        return jsonify({"message":"User not found"}), 404
    
    like_exists = item_exists(post_like_url, Like.image_link)

    if not like_exists:
        new_like = Like(image = post_like_image, image_link = post_like_url)
        db.session.add(new_like)
        db.session.commit()

    like_id = Like.query.filter_by(image_link = post_like_url).first().id

    like = Like.query.get(like_id)
    if not like:
        return jsonify({"message":"Like not found"}), 404
    
    if like in user.likes:
        return jsonify({"message" : "Like already added"}), 200

    user.likes.append(like)

    db.session.commit()

    return jsonify({"message":f'Added like_id {like_id} to user_id {post_user_id}'}), 201
    


@app_bp.route('/remove_like_from_user', methods=["POST"])     # TEST THIS
@token_required
def remove_like_from_user():
    token = request.cookies.get('jwt_token')
    user_id = get_id_from_jwt(token)
    img_url = request.args.get('img_url', None)
    like_url = request.args.get('like_url', None)

    if not user_id or not like_url:
        return jsonify({"message":"Missing user_id or like_id"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message":"User not found"}), 404
    
    like_id = Like.query.filter_by(image_link = like_url).first().id
    like = Like.query.get(like_id)
    if not like:
        return jsonify({"message":"Like not found"}), 404
    
    if like not in user.likes:
        return jsonify({"message": "Like not found in user's likes"}), 400

    try:
        user.likes.remove(like)  # Remove the like from the user's likes
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"message": f"{str(e)}, like id: {like} like url:{like_url} like list: {user.likes}"}), 500

    return jsonify({"message":f'Removed Like from user_id {user_id}'}), 201