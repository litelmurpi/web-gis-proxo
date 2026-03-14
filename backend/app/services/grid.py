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


def synthesize_microclimate(grid_gdf: gpd.GeoDataFrame, base_temp: float, osm_data: dict):
    n = len(grid_gdf)

    buildings_gdf = osm_data.get("buildings") if osm_data else None
    green_gdf = osm_data.get("greenspaces") if osm_data else None

    has_real_buildings = buildings_gdf is not None and len(buildings_gdf) > 0 and "geometry" in buildings_gdf.columns
    has_real_green = green_gdf is not None and len(green_gdf) > 0 and "geometry" in green_gdf.columns

    grid_gdf = grid_gdf.copy()

    if has_real_buildings or has_real_green:
        grid_proj = grid_gdf.to_crs("EPSG:32748").copy()

        if has_real_buildings:
            bld_proj = buildings_gdf.to_crs("EPSG:32748")
            grid_gdf["building_density"] = _compute_density_sjoin(grid_proj, bld_proj)
        else:
            np.random.seed(42)
            grid_gdf["building_density"] = np.random.uniform(0.0, 0.8, n)

        if has_real_green:
            green_proj = green_gdf.to_crs("EPSG:32748")
            grid_gdf["green_density"] = _compute_density_sjoin(grid_proj, green_proj)
        else:
            np.random.seed(99)
            grid_gdf["green_density"] = np.random.uniform(0.0, 0.5, n)

        logger.info("synthesize_microclimate: used real OSM density data.")

    else:
        logger.warning("synthesize_microclimate: no OSM data, using stochastic fallback.")
        np.random.seed(42)
        grid_gdf["building_density"] = np.random.uniform(0.0, 0.8, n)
        np.random.seed(99)
        grid_gdf["green_density"] = np.random.uniform(0.0, 0.5, n)

    grid_gdf["lst"] = base_temp + (grid_gdf["building_density"] * 3.0) - (grid_gdf["green_density"] * 2.5)

  
    water_proximity = np.zeros(n)
    waterways_gdf = osm_data.get("waterways") if osm_data else None
    has_waterways = waterways_gdf is not None and len(waterways_gdf) > 0 and "geometry" in waterways_gdf.columns
    if has_waterways:
        grid_proj = grid_gdf.to_crs("EPSG:32748")
        water_proximity = _compute_density_sjoin(grid_proj, waterways_gdf.to_crs("EPSG:32748"))

    weather_data = osm_data.get("weather_data") if osm_data else None
    precip_factor = 0.0
    soil_factor = 0.0
    if weather_data and isinstance(weather_data, dict) and "current" in weather_data:
        current = weather_data["current"]
        precip_mm = float(current.get("precipitation", 0.0) or 0.0)
        soil_moisture = float(current.get("soil_moisture_0_to_7cm", 0.0) or 0.0)
        precip_factor = min(precip_mm / 50.0, 1.0)
        soil_factor = min(soil_moisture / 0.6, 1.0)

    structural_flood = (
        grid_gdf["building_density"].values * 0.55 +
        (1.0 - grid_gdf["green_density"].values) * 0.45
    ) 

    water_weight = 0.25 if has_waterways else 0.0
    struct_weight = 1.0 - water_weight

    weather_boost = (precip_factor * 0.60 + soil_factor * 0.40) * 15.0

    flood_scores = (
        structural_flood * struct_weight +
        water_proximity * water_weight
    ) * 85.0 + weather_boost

    grid_gdf["floodScore"] = np.clip(flood_scores, 5, 95)

    np.random.seed(13)
    grid_gdf["equityScore"] = 100 - (grid_gdf["building_density"] * 60 + np.random.uniform(0, 20, n))
    grid_gdf["equityScore"] = grid_gdf["equityScore"].clip(10, 95)
    np.random.seed(21)
    grid_gdf["population"] = np.random.randint(50, 2000, n)

    return grid_gdf

