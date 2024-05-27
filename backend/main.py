from flask import Flask, jsonify, request
import requests
from keys import key_weather, key_fashion
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



@app.route('/')
def main():
    return "lmao"

@app.route('/weather')
@cross_origin()
def weather_key():
    lat = request.args.get('lat')
    long = request.args.get('long')
    return requests.get(key_weather(lat, long)).content

@app.route('/fashion')
@cross_origin()
def fashion_key():
    season = request.args.get('season')
    gender = request.args.get('gender')
    imgCount = request.args.get('img_count')
    return requests.get(key_fashion(season, gender, imgCount)).content
    