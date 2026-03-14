import geopandas as gpd
from shapely.geometry import box, Polygon, Point, MultiPolygon, shape
import numpy as np
import logging

logger = logging.getLogger(__name__)

def create_grid(min_lon: float, min_lat: float, max_lon: float, max_lat: float, cell_size_m: int = 100, clip_polygon: dict = None):
    cell_size_deg = cell_size_m / 111320.0

    if max_lon - min_lon < cell_size_deg * 5:
        center_lon = (min_lon + max_lon) / 2
        min_lon, max_lon = center_lon - (cell_size_deg * 2.5), center_lon + (cell_size_deg * 2.5)

    if max_lat - min_lat < cell_size_deg * 5:
        center_lat = (min_lat + max_lat) / 2
        min_lat, max_lat = center_lat - (cell_size_deg * 2.5), center_lat + (cell_size_deg * 2.5)

    # Cap grid cells to prevent slow computation
    MAX_CELLS = 2000
    lon_cells = int((max_lon - min_lon) / cell_size_deg)
    lat_cells = int((max_lat - min_lat) / cell_size_deg)
    if lon_cells * lat_cells > MAX_CELLS and lon_cells > 0 and lat_cells > 0:
        scale = (lon_cells * lat_cells / MAX_CELLS) ** 0.5
        cell_size_deg *= scale
        logger.info(f"Grid cell size scaled to {cell_size_deg:.6f}° to cap at ~{MAX_CELLS} cells.")

    lons = np.arange(min_lon, max_lon, cell_size_deg)
    lats = np.arange(min_lat, max_lat, cell_size_deg)

    polygons = []
    grid_indices = []

    if len(lons) > 1 and len(lats) > 1:
        for i in range(len(lons) - 1):
            for j in range(len(lats) - 1):
                polygons.append(box(lons[i], lats[j], lons[i+1], lats[j+1]))
                grid_indices.append((i, j))

    grid = gpd.GeoDataFrame(
        {'geometry': polygons, 'grid_idx_x': [i[0] for i in grid_indices], 'grid_idx_y': [i[1] for i in grid_indices]},
        crs="EPSG:4326"
    )

    if clip_polygon:
        try:
            city_geom = shape(clip_polygon)
            city_gdf = gpd.GeoDataFrame({'geometry': [city_geom]}, crs="EPSG:4326")

            if city_geom.geom_type in ['Polygon', 'MultiPolygon']:
                clipped_grid = gpd.sjoin(grid, city_gdf, how='inner', predicate='intersects')
                clipped_grid = clipped_grid.drop(columns=['index_right'])

                if len(clipped_grid) > 0:
                    grid = clipped_grid
                    logger.info(f"Clipped grid to city bounds. Remaining cells: {len(grid)}")
                else:
                    logger.warning("Clipped grid is empty, falling back to unclipped bounding box.")
            else:
                logger.info(f"Geometry type is {city_geom.geom_type}. Skipping clipping.")

        except Exception as e:
            logger.error(f"Failed to clip polygon: {str(e)}")

    logger.info(f"Generated grid with {len(grid)} cells.")
    return grid


def _compute_density_sjoin(grid_gdf_proj: gpd.GeoDataFrame, features_gdf_proj: gpd.GeoDataFrame) -> np.ndarray:
    """
    Fast vectorized density estimation using spatial join count per grid cell.
    Counts how many feature polygons overlap each grid cell, then normalizes to 0-1.
    ~50x faster than per-cell Python-level intersection.
    """
    if features_gdf_proj is None or len(features_gdf_proj) == 0:
        return np.zeros(len(grid_gdf_proj))

    grid_reset = grid_gdf_proj.reset_index(drop=True)
    joined = gpd.sjoin(grid_reset, features_gdf_proj[["geometry"]], how='left', predicate='intersects')
    counts = joined.groupby(joined.index)['index_right'].count()
    counts = counts.reindex(grid_reset.index, fill_value=0)
    max_count = counts.max()
    return (counts / max_count).clip(0.0, 1.0).values if max_count > 0 else np.zeros(len(grid_gdf_proj))


def _compute_area_per_cell(grid_gdf_proj: gpd.GeoDataFrame, features_gdf_proj: gpd.GeoDataFrame) -> np.ndarray:
    """
    Computes total feature area intersecting each grid cell (in m²).
    Uses vectorized gpd.overlay for speed (~50-100x faster than per-cell loop).
    """
    if features_gdf_proj is None or len(features_gdf_proj) == 0:
        return np.zeros(len(grid_gdf_proj))

    grid_reset = grid_gdf_proj.reset_index(drop=True)
    grid_reset["_grid_idx"] = grid_reset.index

    try:
        overlay = gpd.overlay(
            grid_reset[["geometry", "_grid_idx"]],
            features_gdf_proj[["geometry"]],
            how="intersection",
        )
        overlay["_area"] = overlay.geometry.area
        area_per_cell = overlay.groupby("_grid_idx")["_area"].sum()
        result = np.zeros(len(grid_reset))
        result[area_per_cell.index.astype(int)] = area_per_cell.values
        return result
    except Exception as e:
        logger.warning(f"_compute_area_per_cell overlay failed: {e}")
        return np.zeros(len(grid_reset))


def synthesize_microclimate(grid_gdf: gpd.GeoDataFrame, base_temp: float, osm_data: dict, weather_data: dict = None):
    n = len(grid_gdf)

    buildings_gdf = osm_data.get("buildings") if osm_data else None
    green_gdf = osm_data.get("greenspaces") if osm_data else None
    water_gdf = osm_data.get("waterways") if osm_data else None

    has_real_buildings = buildings_gdf is not None and len(buildings_gdf) > 0 and "geometry" in buildings_gdf.columns
    has_real_green = green_gdf is not None and len(green_gdf) > 0 and "geometry" in green_gdf.columns
    has_real_water = water_gdf is not None and len(water_gdf) > 0 and "geometry" in water_gdf.columns

    grid_gdf = grid_gdf.copy()

    grid_proj = None
    if has_real_buildings or has_real_green or has_real_water:
        grid_proj = grid_gdf.to_crs("EPSG:32748").copy()

    # ---- Building density ----
    if has_real_buildings:
        bld_proj = buildings_gdf.to_crs("EPSG:32748")
        grid_gdf["building_density"] = _compute_density_sjoin(grid_proj, bld_proj)
        # Also compute building area for population
        grid_gdf["building_area_m2"] = _compute_area_per_cell(grid_proj, bld_proj)
    else:
        np.random.seed(42)
        grid_gdf["building_density"] = np.random.uniform(0.0, 0.8, n)
        grid_gdf["building_area_m2"] = np.zeros(n)

    # ---- Green density ----
    if has_real_green:
        green_proj = green_gdf.to_crs("EPSG:32748")
        grid_gdf["green_density"] = _compute_density_sjoin(grid_proj, green_proj)
    else:
        np.random.seed(99)
        grid_gdf["green_density"] = np.random.uniform(0.0, 0.5, n)

    # ---- Water proximity (for flood) ----
    if has_real_water:
        water_proj = water_gdf.to_crs("EPSG:32748")
        grid_gdf["water_proximity"] = _compute_density_sjoin(grid_proj, water_proj)
    else:
        grid_gdf["water_proximity"] = np.zeros(n)

    if has_real_buildings or has_real_green or has_real_water:
        logger.info("synthesize_microclimate: used real OSM density data.")
    else:
        logger.warning("synthesize_microclimate: no OSM data, using stochastic fallback.")

    # =========================
    # Heat Risk (LST)
    # =========================
    grid_gdf["lst"] = base_temp + (grid_gdf["building_density"] * 6.0) - (grid_gdf["green_density"] * 4.0)

    # =========================
    # Flood Risk Score (0-100)
    # =========================
    # Extract precipitation & soil moisture from weather_data
    # Prefer daily sum over real-time current for flood risk
    daily = weather_data.get("daily", {}) if weather_data else {}
    daily_precip = daily.get("precipitation_sum", [0.0])
    precip_mm = float(daily_precip[0]) if daily_precip else 0.0
    
    soil_moisture = 0.0
    if weather_data and isinstance(weather_data, dict) and "current" in weather_data:
        current = weather_data["current"]
        # Fallback to current if daily not available
        if precip_mm == 0.0:
            precip_mm = float(current.get("precipitation", 0.0) or 0.0)
        soil_moisture = float(current.get("soil_moisture_0_to_7cm", 0.0) or 0.0)

    precip_factor = min(precip_mm / 50.0, 1.0)    # 0mm→0, 50mm+→1
    soil_factor = min(soil_moisture / 0.6, 1.0)    # dry→0, saturated→1

    # Base flood risk from geographic features: 
    # High building density (impervious) increases risk, green spaces decrease it
    # We add a base geographic score (20-40) depending on density
    base_flood_risk = 20.0 + (grid_gdf["building_density"] * 30.0) - (grid_gdf["green_density"] * 10.0)
    
    # Weighted combination: water proximity gives huge boost, weather gives moderate boost
    flood_scores = (
        base_flood_risk + 
        (grid_gdf["water_proximity"].values * 40.0) +
        (precip_factor * 20.0) +
        (soil_factor * 10.0)
    )

    grid_gdf["floodScore"] = np.clip(flood_scores, 10.0, 95.0)

    # =========================
    # Green Equity Score
    # =========================
    # Equity is derived from building density (penalizes equity) and green density (boosts it)
    # Rather than random, we use purely geographic features
    grid_gdf["equityScore"] = 100 - (grid_gdf["building_density"] * 70) + (grid_gdf["green_density"] * 30)
    grid_gdf["equityScore"] = grid_gdf["equityScore"].clip(10, 95)

    # =========================
    # Population (estimated)
    # =========================
    # ~1 person per 20 m² floor area, average 2 floors in Indonesian urban areas
    if has_real_buildings:
        estimated_pop = (grid_gdf["building_area_m2"] * 2.0) / 20.0
        grid_gdf["population"] = np.floor(estimated_pop).clip(0, 50000).astype(int)
        logger.info(f"Population estimated from building area. Range: {grid_gdf['population'].min()}-{grid_gdf['population'].max()}")
    else:
        np.random.seed(21)
        grid_gdf["population"] = np.random.randint(50, 2000, n)

    return grid_gdf

