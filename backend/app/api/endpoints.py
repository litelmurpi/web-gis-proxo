from fastapi import APIRouter, Request, Depends
from fastapi.concurrency import run_in_threadpool
import asyncio
import time
from app.services.open_meteo import fetch_open_meteo_current
from app.services.osm import fetch_osm_data
from app.services.grid import create_grid, synthesize_microclimate
from app.services.geocoder import search_city_boundary
import json
import logging

logger = logging.getLogger("uvicorn")

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/analysis/heat")
async def generate_heat_grid(request: Request, lat: float, lon: float, radius_km: float = 1.0):
    try:
        client = request.app.state.client
        deg_radius = radius_km / 111.0
        min_lon = lon - deg_radius
        max_lon = lon + deg_radius
        min_lat = lat - deg_radius
        max_lat = lat + deg_radius

        weather_data = await fetch_open_meteo_current(client, lat, lon)
        current_temp = weather_data['current']['temperature_2m']

        # Run CPU-bound geospatial tasks in threadpool
        grid_gdf = await run_in_threadpool(create_grid, min_lon, min_lat, max_lon, max_lat, 300)
        result_gdf = await run_in_threadpool(synthesize_microclimate, grid_gdf, current_temp, {}, weather_data)

        # to_json() is also potentially blocking for large dataframes
        res_json_str = await run_in_threadpool(result_gdf.to_json)
        res_json = await run_in_threadpool(json.loads, res_json_str)
        
        return res_json

    except Exception as e:
        logger.error(f"Error in /heat: {e}", exc_info=True)
        return {"error": str(e)}

@router.get("/analysis/search")
async def search_and_generate_heat(request: Request, city: str):
    try:
        start_time = time.time()
        client = request.app.state.client
        
        # 1. Geocode first (blocking, needed for coordinates)
        city_info = await search_city_boundary(client, city)
        lat = city_info["lat"]
        lon = city_info["lon"]
        min_lon, min_lat, max_lon, max_lat = city_info["boundingbox"]
        clip_geom = city_info["geometry"]

        # Clamp bounding box if too large
        max_span = 0.3
        if (max_lon - min_lon) > max_span:
            min_lon = lon - (max_span / 2)
            max_lon = lon + (max_span / 2)
        if (max_lat - min_lat) > max_span:
            min_lat = lat - (max_span / 2)
            max_lat = lat + (max_span / 2)

        span_deg = max_lon - min_lon
        cell_size = 300 if span_deg < 0.15 else 400

        # 2. Parallel fetching of Weather and OSM data
        weather_task = fetch_open_meteo_current(client, lat, lon)
        osm_task = fetch_osm_data(client, min_lon, min_lat, max_lon, max_lat)
        
        weather_data, osm_data = await asyncio.gather(weather_task, osm_task, return_exceptions=True)
        
        # Handle exceptions gracefully
        if isinstance(weather_data, Exception):
            logger.error(f"Weather fetch failed: {weather_data}")
            current_temp = 30.0 # fallback
        else:
            current_temp = weather_data['current']['temperature_2m']
            
        if isinstance(osm_data, Exception):
            logger.warning(f"OSM fetch failed, using mock densities: {osm_data}")
            osm_data = {}

        # 3. Create grid and synthesize - CPU bound tasks delegated to threadpool
        grid_gdf = await run_in_threadpool(
            create_grid, min_lon, min_lat, max_lon, max_lat, cell_size, clip_geom
        )
        result_gdf = await run_in_threadpool(
            synthesize_microclimate, grid_gdf, current_temp, osm_data,
            weather_data if not isinstance(weather_data, Exception) else None
        )

        # to_json() is also potentially blocking for large dataframes
        res_json_str = await run_in_threadpool(result_gdf.to_json)
        res_json = await run_in_threadpool(json.loads, res_json_str)

        processing_time = time.time() - start_time
        logger.info(f"Processed /search for {city} in {processing_time:.3f} seconds.")

        return {
            "center": [lon, lat],
            "bbox": [min_lon, min_lat, max_lon, max_lat],
            "geojson": res_json
        }

    except Exception as e:
        logger.error(f"Error in /search: {e}", exc_info=True)
        return {"error": str(e)}
