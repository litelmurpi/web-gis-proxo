import httpx
from shapely.geometry import shape
from app.services.cache import geocoder_cache

async def search_city_boundary(client: httpx.AsyncClient, city_name: str, country: str = "Indonesia"):
    cache_key = f"{city_name.lower().strip()},{country.lower().strip()}"
    cached = geocoder_cache.get(cache_key)
    if cached:
        return cached
        
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": f"{city_name}, {country}",
        "format": "json",
        "polygon_geojson": 1,
        "limit": 1
    }
    headers = {
        "User-Agent": "UrbanInsight-AI-App/1.0"
    }

    response = await client.get(url, params=params, headers=headers)
    response.raise_for_status()
    data = response.json()

    if not data:
        raise ValueError(f"City '{city_name}' not found.")

    result = data[0]

    bbox_str = result.get('boundingbox', [])
    if len(bbox_str) == 4:
        min_lat, max_lat, min_lon, max_lon = map(float, bbox_str)
    else:
        min_lat, max_lat, min_lon, max_lon = 0, 0, 0, 0

    geojson_geom = result.get('geojson')

    output = {
        "display_name": result.get("display_name"),
        "lat": float(result.get("lat")),
        "lon": float(result.get("lon")),
        "boundingbox": (min_lon, min_lat, max_lon, max_lat),
        "geometry": geojson_geom
    }
    
    geocoder_cache.set(cache_key, output)
    return output
