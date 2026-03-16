"""
Simulation API endpoints for UrbanInsight AI.

Provides POST /simulate for running the RL tree placement simulation,
and GET /simulate/quick for fast re-simulation with cached grid data.
"""

from fastapi import APIRouter, Request
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field
from typing import Optional, Dict
import asyncio
import time
import logging

from app.services.geocoder import search_city_boundary
from app.services.open_meteo import fetch_open_meteo_current
from app.services.osm import fetch_osm_data
from app.services.grid import create_grid, synthesize_microclimate
from app.services.rl_engine import run_simulation, DEFAULT_WEIGHTS
from app.services.cache import simulation_cache

logger = logging.getLogger("uvicorn")

router = APIRouter()

class SimulationWeights(BaseModel):
    heat: float = Field(default=0.35, ge=0.0, le=1.0)
    flood: float = Field(default=0.30, ge=0.0, le=1.0)
    equity: float = Field(default=0.25, ge=0.0, le=1.0)
    cost: float = Field(default=0.10, ge=0.0, le=1.0)

class SimulationRequest(BaseModel):
    city: str = Field(..., min_length=1, description="City name to simulate")
    budget: int = Field(default=50, ge=1, le=500, description="Number of trees to plant")
    weights: Optional[SimulationWeights] = None

@router.post("/simulate")
async def simulate_tree_placement(request: Request, body: SimulationRequest):
    """
    Run RL tree placement simulation for a city.

    1. Geocodes the city to get boundary
    2. Fetches weather + OSM data in parallel
    3. Creates grid and synthesizes microclimate
    4. Runs RL greedy agent to place trees optimally
    5. Returns before/after metrics, tree placements, and updated grid
    """
    start_time = time.time()
    client = request.app.state.client

    try:

        city_info = await search_city_boundary(client, body.city)
        lat = city_info["lat"]
        lon = city_info["lon"]
        min_lon, min_lat, max_lon, max_lat = city_info["boundingbox"]
        clip_geom = city_info["geometry"]

        max_span = 0.3
        if (max_lon - min_lon) > max_span:
            min_lon = lon - (max_span / 2)
            max_lon = lon + (max_span / 2)
        if (max_lat - min_lat) > max_span:
            min_lat = lat - (max_span / 2)
            max_lat = lat + (max_span / 2)

        span_deg = max_lon - min_lon
        cell_size = 300 if span_deg < 0.15 else 400

        cache_key = f"sim_{body.city.lower().strip()}"
        cached_grid = simulation_cache.get(cache_key)

        if cached_grid is not None:
            grid_gdf = cached_grid
            logger.info(f"Using cached grid for {body.city}")
        else:

            weather_task = fetch_open_meteo_current(client, lat, lon)
            osm_task = fetch_osm_data(client, min_lon, min_lat, max_lon, max_lat)

            weather_data, osm_data = await asyncio.gather(
                weather_task, osm_task, return_exceptions=True
            )

            if isinstance(weather_data, Exception):
                logger.error(f"Weather fetch failed: {weather_data}")
                current_temp = 30.0
                weather_data_clean = None
            else:
                current_temp = weather_data['current']['temperature_2m']
                weather_data_clean = weather_data

            if isinstance(osm_data, Exception):
                logger.warning(f"OSM fetch failed: {osm_data}")
                osm_data = {}

            grid_gdf = await run_in_threadpool(
                create_grid, min_lon, min_lat, max_lon, max_lat, cell_size, clip_geom
            )
            grid_gdf = await run_in_threadpool(
                synthesize_microclimate, grid_gdf, current_temp, osm_data, weather_data_clean
            )

            simulation_cache.set(cache_key, grid_gdf)

        weights = body.weights.model_dump() if body.weights else DEFAULT_WEIGHTS.copy()

        result = await run_in_threadpool(
            run_simulation, grid_gdf, body.budget, weights
        )

        processing_time = time.time() - start_time
        logger.info(f"Simulation for {body.city} completed in {processing_time:.3f}s")

        return {
            "center": [lon, lat],
            "city": body.city,
            "budget": body.budget,
            "weights": weights,
            "processing_time": round(processing_time, 3),
            **result,
        }

    except ValueError as e:
        logger.error(f"Simulation ValueError: {e}")
        return {"error": str(e)}
    except Exception as e:
        logger.error(f"Simulation error: {e}", exc_info=True)
        return {"error": str(e)}

@router.post("/simulate/quick")
async def simulate_quick(request: Request, body: SimulationRequest):
    """
    Quick re-simulation using cached grid data.
    Skips geocoding and data fetching — only re-runs the RL agent.
    Falls back to full simulation if no cache exists.
    """
    cache_key = f"sim_{body.city.lower().strip()}"
    cached_grid = simulation_cache.get(cache_key)

    if cached_grid is None:

        return await simulate_tree_placement(request, body)

    start_time = time.time()
    weights = body.weights.model_dump() if body.weights else DEFAULT_WEIGHTS.copy()

    result = await run_in_threadpool(
        run_simulation, cached_grid, body.budget, weights
    )

    processing_time = time.time() - start_time
    logger.info(f"Quick simulation for {body.city} completed in {processing_time:.3f}s")

    return {
        "city": body.city,
        "budget": body.budget,
        "weights": weights,
        "processing_time": round(processing_time, 3),
        **result,
    }
