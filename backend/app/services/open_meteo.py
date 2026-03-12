import requests

def fetch_open_meteo_current(lat: float, lon: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "rain",
            "showers",
            "soil_moisture_0_to_7cm",
            "soil_moisture_7_to_28cm"
        ],
        "timezone": "Asia/Jakarta"
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()
