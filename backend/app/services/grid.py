import os
import geopandas as gpd
from shapely.geometry import box, Polygon, Point, MultiPolygon, shape
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Path to the compressed population raster (relative to this file's location)
_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
POPULATION_TIF = os.path.join(_DATA_DIR, "idn_ppp_2020_compressed.tif")

import glob

def _sample_from_multi_tifs(grid_gdf: gpd.GeoDataFrame, tif_pattern: str, is_building: bool = False, is_green: bool = False) -> np.ndarray:
    """Samples density from multiple TIF files by checking intersection first."""
    tif_files = glob.glob(tif_pattern, recursive=True)
    if not tif_files:
        logger.warning(f"No TIFs found for pattern {tif_pattern}")
        return None
    
    result = np.zeros(len(grid_gdf))
    sampled_mask = np.zeros(len(grid_gdf), dtype=bool)
    
    for tif in tif_files:
        try:
            import rasterio
            with rasterio.open(tif) as src:
                # To check intersection, we need grid bounds in TIF CRS
                if src.crs is not None:
                    grid_proj = grid_gdf.to_crs(src.crs)
                else:
                    grid_proj = grid_gdf
                    
                tif_bounds = src.bounds
                minx, miny, maxx, maxy = grid_proj.total_bounds
                
                # Check spatial intersection of bounding boxes first
                if not (minx <= tif_bounds.right and maxx >= tif_bounds.left and miny <= tif_bounds.top and maxy >= tif_bounds.bottom):
                    continue # Skip this TIF
                
                # Filter points to those strictly inside this TIF's bounds
                centroids = grid_proj.geometry.centroid
                inside_coords = []
                idx_map = []
                b_left, b_bottom, b_right, b_top = tif_bounds
                
                # Check all centroids - idx is the absolute index in grid_gdf
                for idx, pt in enumerate(centroids):
                    if b_left <= pt.x <= b_right and b_bottom <= pt.y <= b_top:
                        inside_coords.append((pt.x, pt.y))
                        idx_map.append(idx)
                        
                if not inside_coords:
                    continue
                    
                sampled = np.array([v[0] for v in src.sample(inside_coords)], dtype=float)
                
                # Specific logic based on data type
                if is_building:
                    # GHSL indicates percentage built-up (0-100). Convert to 0.0 - 1.0. 
                    # Nodata is usually 65535 or >100.
                    sampled = np.where(sampled > 100, 0, sampled) / 100.0
                elif is_green:
                    # ESA WorldCover classes: 
                    # 10=Tree cover, 20=Shrubland, 30=Grassland, 40=Cropland
                    # 50=Built-up (Ignore), 60=Bare/Sparse vegetation, 
                    # 70=Snow/Ice, 80=Permanent water bodies, 90=Herbaceous wetland, 95=Mangroves, 100=Moss/Lichen
                    is_green_mask = np.isin(sampled, [10, 20, 30, 40, 90, 95, 100])
                    # Represent as 1.0 if it's green, 0.0 otherwise
                    sampled = np.where(is_green_mask, 1.0, 0.0)
                    
                # Update result array
                for i, s_val in zip(idx_map, sampled):
                    if s_val > 0:
                        result[i] = s_val
                        sampled_mask[i] = True
                        
        except Exception as e:
            logger.warning(f"Error reading {tif}: {e}")
            
    if not sampled_mask.any():
        return None
        
    return result


def _sample_population_from_tif(grid_gdf: gpd.GeoDataFrame) -> np.ndarray:
    """
    Sample WorldPop population counts from idn_ppp_2020_compressed.tif
    for each grid cell centroid. Returns an integer array of population per cell.
    Falls back to None if the TIF file is unavailable.
    """
    try:
        import rasterio

        tif_path = os.path.abspath(POPULATION_TIF)
        if not os.path.exists(tif_path):
            logger.warning(f"Population TIF not found at {tif_path}. Falling back to building-area estimate.")
            return None

        centroids = grid_gdf.geometry.centroid
        coords = [(pt.x, pt.y) for pt in centroids]

        with rasterio.open(tif_path) as src:
            sampled = np.array([v[0] for v in src.sample(coords)], dtype=float)

        # WorldPop uses -99999 or negative as NoData — clamp to 0
        sampled = np.where(sampled < 0, 0.0, sampled)
        sampled = np.nan_to_num(sampled, nan=0.0, posinf=0.0, neginf=0.0)

        population = np.floor(sampled).astype(int)
        logger.info(f"Population sampled from TIF. Range: {population.min()}-{population.max()}, Total: {population.sum()}")
        return population

    except Exception as e:
        logger.warning(f"Failed to sample population from TIF: {e}. Falling back to building-area estimate.")
        return None

def create_grid(min_lon: float, min_lat: float, max_lon: float, max_lat: float, cell_size_m: int = 100, clip_polygon: dict = None):
    cell_size_deg = cell_size_m / 111320.0

    if max_lon - min_lon < cell_size_deg * 5:
        center_lon = (min_lon + max_lon) / 2
        min_lon, max_lon = center_lon - (cell_size_deg * 2.5), center_lon + (cell_size_deg * 2.5)

    if max_lat - min_lat < cell_size_deg * 5:
        center_lat = (min_lat + max_lat) / 2
        min_lat, max_lat = center_lat - (cell_size_deg * 2.5), center_lat + (cell_size_deg * 2.5)

    # Cap grid cells to prevent slow computation
    MAX_CELLS = 1500
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
    water_gdf = osm_data.get("waterways") if osm_data else None

    has_real_osm_buildings = buildings_gdf is not None and len(buildings_gdf) > 0 and "geometry" in buildings_gdf.columns
    has_real_water = water_gdf is not None and len(water_gdf) > 0 and "geometry" in water_gdf.columns

    grid_gdf = grid_gdf.copy()
    grid_proj = grid_gdf.to_crs("EPSG:32748").copy()

    # ---- Building density (From TIF or OSM fallback) ----
    building_tif_pattern = os.path.join(_DATA_DIR, "Building", "*.tif")
    tif_building_density = _sample_from_multi_tifs(grid_gdf, building_tif_pattern, is_building=True)
    
    if tif_building_density is not None:
        grid_gdf["building_density"] = tif_building_density
        # Approximate building area based on cell size (100x100m = 10000m2)
        grid_gdf["building_area_m2"] = grid_gdf["building_density"] * 10000.0
        logger.info("synthesize_microclimate: used REAL Building TIF data.")
    elif has_real_osm_buildings:
        bld_proj = buildings_gdf.to_crs("EPSG:32748")
        grid_gdf["building_density"] = _compute_density_sjoin(grid_proj, bld_proj)
        grid_gdf["building_area_m2"] = _compute_area_per_cell(grid_proj, bld_proj)
    else:
        np.random.seed(42)
        grid_gdf["building_density"] = np.random.uniform(0.0, 0.8, n)
        grid_gdf["building_area_m2"] = np.zeros(n)

    # ---- Green density (From TIF or OSM fallback) ----
    green_tif_pattern = os.path.join(_DATA_DIR, "terrascope_download_*", "WORLDCOVER", "ESA_WORLDCOVER_10M_2021_V200", "MAP", "*", "*.tif")
    tif_green_density = _sample_from_multi_tifs(grid_gdf, green_tif_pattern, is_green=True)
    
    if tif_green_density is not None:
        grid_gdf["green_density"] = tif_green_density
        logger.info("synthesize_microclimate: used REAL Green TIF data.")
    else:
        # Fallback to OSM or random
        green_gdf = osm_data.get("greenspaces") if osm_data else None
        has_real_green = green_gdf is not None and len(green_gdf) > 0 and "geometry" in green_gdf.columns
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
    # Equity is derived from building density (penalizes equity if no green) and green density
    # A fully built-up block with no green space gets a low score.
    grid_gdf["equityScore"] = (grid_gdf["green_density"] * 100) + ((1.0 - grid_gdf["building_density"]) * 20)
    grid_gdf["equityScore"] = grid_gdf["equityScore"].clip(5, 95)

    # =========================
    # Population (from WorldPop TIF or fallback estimate)
    # =========================
    # Priority 1: Real WorldPop data from idn_ppp_2020_compressed.tif
    tif_population = _sample_population_from_tif(grid_gdf)
    if tif_population is not None:
        grid_gdf["population"] = tif_population
    else:
        # Priority 2: Estimate from building density (avoid checking is None directly on numpy)
        # Using building_density to estimate built-up square meters per 500x500m cell
        # 500x500m cell = 250,000 sq m total area. 
        # Typically high-density urban areas like Jakarta have ~150-300 people per hectare (10,000 sq m)
        # We can scale max 1500 people per grid cell
        estimated_pop = grid_gdf["building_density"] * 1500.0
        grid_gdf["population"] = np.floor(estimated_pop).clip(0, 50000).astype(int)
        logger.info(f"Population estimated from building density. Range: {grid_gdf['population'].min()}-{grid_gdf['population'].max()}")

    return grid_gdf

