import os
from dotenv import find_dotenv, load_dotenv

def key_weather(lat, long):

    load_dotenv(find_dotenv())

    weather_key = os.getenv("WEATHER_KEY")
    
    return f'https://api.pirateweather.net/forecast/{weather_key}/{lat},{long}'


def key_fashion(season, gender, imgCount):

    load_dotenv(find_dotenv())

    fashion_key = os.getenv("FASHION_KEY")

    return f'https://www.googleapis.com/customsearch/v1?q={season}%20outfits%20{gender}%20adults&num=10&start={imgCount}&searchType=image&key={fashion_key}&cx=e7a714a7b971a4536'

