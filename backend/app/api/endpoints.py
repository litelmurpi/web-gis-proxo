from fastapi import APIRouter
from app.services.open_meteo import fetch_open_meteo_current
from app.services.osm import fetch_osm_data
from app.services.grid import create_grid, synthesize_microclimate
from app.services.geocoder import search_city_boundary
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/analysis/heat")
def generate_heat_grid(lat: float, lon: float, radius_km: float = 1.0):
    try:
        deg_radius = radius_km / 111.0
        min_lon = lon - deg_radius
        max_lon = lon + deg_radius
        min_lat = lat - deg_radius
        max_lat = lat + deg_radius

        weather_data = fetch_open_meteo_current(lat, lon)
        current_temp = weather_data['current']['temperature_2m']

        grid_gdf = create_grid(min_lon, min_lat, max_lon, max_lat, cell_size_m=300)
        result_gdf = synthesize_microclimate(grid_gdf, current_temp, osm_data={})

        return json.loads(result_gdf.to_json())

    except Exception as e:
        return {"error": str(e)}

@router.get("/analysis/search")
def search_and_generate_heat(city: str):
    try:
        city_info = search_city_boundary(city)
        lat = city_info["lat"]
        lon = city_info["lon"]
        min_lon, min_lat, max_lon, max_lat = city_info["boundingbox"]
        clip_geom = city_info["geometry"]

        weather_data = fetch_open_meteo_current(lat, lon)
        current_temp = weather_data['current']['temperature_2m']

        max_span = 0.3
        if (max_lon - min_lon) > max_span:
            min_lon = lon - (max_span / 2)
            max_lon = lon + (max_span / 2)
        if (max_lat - min_lat) > max_span:
            min_lat = lat - (max_span / 2)
            max_lat = lat + (max_span / 2)

        span_deg = max_lon - min_lon
        cell_size = 300 if span_deg < 0.15 else 400

        grid_gdf = create_grid(min_lon, min_lat, max_lon, max_lat, cell_size_m=cell_size, clip_polygon=clip_geom)

        try:
            osm_data = fetch_osm_data(min_lon, min_lat, max_lon, max_lat)
        except Exception as osm_err:
            logger.warning(f"OSM fetch failed, using mock densities: {osm_err}")
            osm_data = {}

        result_gdf = synthesize_microclimate(grid_gdf, current_temp, osm_data=osm_data)

        res_json = json.loads(result_gdf.to_json())

        return {
            "center": [lon, lat],
            "bbox": [min_lon, min_lat, max_lon, max_lat],
            "geojson": res_json
        }

    except Exception as e:
        return {"error": str(e)}
