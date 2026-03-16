import httpx
from app.services.cache import weather_cache
import logging

logger = logging.getLogger(__name__)

async def fetch_open_meteo_current(client: httpx.AsyncClient, lat: float, lon: float):

    cache_key = f"{round(lat, 2)},{round(lon, 2)}"
    cached = weather_cache.get(cache_key)
    if cached:
        return cached

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
        "daily": ["precipitation_sum"],
        "forecast_days": 1,
        "timezone": "Asia/Jakarta"
    }
    
    try:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        weather_cache.set(cache_key, data)
        return data
    except Exception as e:
        logger.error(f"Open-Meteo API error: {e}")

        return {"current": {"temperature_2m": 30.0}}
