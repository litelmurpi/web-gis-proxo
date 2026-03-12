import requests
from shapely.geometry import shape

def search_city_boundary(city_name: str, country: str = "Indonesia"):
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

    response = requests.get(url, params=params, headers=headers)
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

    return {
        "display_name": result.get("display_name"),
        "lat": float(result.get("lat")),
        "lon": float(result.get("lon")),
        "boundingbox": (min_lon, min_lat, max_lon, max_lat),
        "geometry": geojson_geom
    }
