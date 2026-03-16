import os
import geopandas as gpd
from shapely.geometry import box, Polygon, Point, MultiPolygon, shape
import numpy as np
import logging

logger = logging.getLogger(__name__)

_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
POPULATION_TIF = os.path.join(_DATA_DIR, "idn_ppp_2020_compressed.tif")

import glob

_BPS_DENSITY_KM2 = {

    "jakarta": 16705, "jakarta pusat": 20522, "jakarta selatan": 15700,
    "jakarta utara": 12300, "jakarta barat": 19800, "jakarta timur": 14100,

    "bandung": 14600, "kota bandung": 14600, "bekasi": 13500, "kota bekasi": 13500,
    "depok": 11800, "kota depok": 11800, "bogor": 4600, "kota bogor": 8800,
    "cimahi": 16900, "sukabumi": 2100, "cirebon": 7200, "tasikmalaya": 3200,
    "kabupaten bandung": 4100, "kabupaten bekasi": 3200, "kabupaten bogor": 2800,

    "semarang": 4700, "kota semarang": 4700, "surakarta": 11800, "solo": 11800,
    "kota surakarta": 11800, "magelang": 1700, "salatiga": 3100,
    "klaten": 1980, "kabupaten klaten": 1980, "purworejo": 640,
    "banyumas": 970, "kebumen": 620, "cilacap": 740, "wonosobo": 740,
    "temanggung": 820, "kendal": 870, "demak": 1290, "kudus": 1880,
    "pati": 720, "blora": 380, "rembang": 490, "jepara": 1060,
    "grobogan": 600, "sragen": 960, "karanganyar": 810, "sukoharjo": 1720,
    "wonogiri": 440, "boyolali": 830, "batang": 770, "pekalongan": 930,
    "pemalang": 950, "tegal": 1120, "brebes": 910,

    "surabaya": 8463, "kota surabaya": 8463, "malang": 6000, "kota malang": 6000,
    "kediri": 4400, "blitar": 2200, "madiun": 2800, "mojokerto": 4500,
    "pasuruan": 5700, "probolinggo": 2800, "batu": 1600, "kota batu": 1600,
    "sidoarjo": 3700, "gresik": 2100, "lamongan": 710, "tuban": 600,
    "bojonegoro": 440, "ngawi": 560, "magetan": 720, "ponorogo": 580,
    "trenggalek": 500, "tulungagung": 960, "blitar kabupaten": 680,
    "kediri kabupaten": 790, "malang kabupaten": 700, "pasuruan kabupaten": 1220,
    "mojokerto kabupaten": 1380, "jombang": 1050, "nganjuk": 700, "madiun kabupaten": 640,
    "lumajang": 440, "jember": 820, "banyuwangi": 400, "situbondo": 330,
    "bondowoso": 410, "probolinggo kabupaten": 560, "sumenep": 490,
    "pamekasan": 810, "sampang": 710, "bangkalan": 760,

    "tangerang": 9600, "kota tangerang": 9600, "tangerang selatan": 9400,
    "kota tangerang selatan": 9400, "serang": 3100, "kota serang": 3100, "lebak": 510,

    "medan": 8942, "kota medan": 8942, "palembang": 3600, "pekanbaru": 2800,
    "padang": 1300, "bandar lampung": 4400, "batam": 2800, "binjai": 5100,

    "samarinda": 1200, "balikpapan": 1600, "banjarmasin": 8500,
    "pontianak": 3600, "palangkaraya": 130,

    "makassar": 8700, "kota makassar": 8700, "manado": 2100, "palu": 920,
    "kendari": 550, "gorontalo": 2100,

    "denpasar": 7100, "kota denpasar": 7100, "mataram": 8100, "kupang": 1600,
}

def _lookup_city_density(city_name: str) -> float | None:
    """Look up real BPS population density for a city name. Returns people/km² or None."""
    if not city_name:
        return None
    key = city_name.lower().strip()

    if key in _BPS_DENSITY_KM2:
        return _BPS_DENSITY_KM2[key]

    for bps_key, density in _BPS_DENSITY_KM2.items():
        if bps_key in key or key in bps_key:
            logger.info(f"Matched city '{key}' -> BPS key '{bps_key}' = {density}/km²")
            return density
    return None

def _sample_from_multi_tifs(grid_gdf: gpd.GeoDataFrame, tif_pattern: str,
                             is_building: bool = False, is_green: bool = False) -> np.ndarray:
    """Samples density from multiple TIF files by checking intersection first."""
    tif_files = glob.glob(tif_pattern, recursive=True)
    if not tif_files:
        logger.warning(f"No TIFs found for pattern {tif_pattern}")
        return None

    result = np.full(len(grid_gdf), np.nan)
    sampled_mask = np.zeros(len(grid_gdf), dtype=bool)

    for tif in tif_files:
        try:
            import rasterio
            with rasterio.open(tif) as src:
                if src.crs is not None:
                    grid_proj_tif = grid_gdf.to_crs(src.crs)
                else:
                    grid_proj_tif = grid_gdf

                tif_bounds = src.bounds
                minx, miny, maxx, maxy = grid_proj_tif.total_bounds

                if not (minx <= tif_bounds.right and maxx >= tif_bounds.left
                        and miny <= tif_bounds.top and maxy >= tif_bounds.bottom):
                    continue

                centroids = grid_proj_tif.geometry.centroid
                inside_coords = []
                idx_map = []
                b_left, b_bottom, b_right, b_top = tif_bounds

                for idx, pt in enumerate(centroids):
                    if b_left <= pt.x <= b_right and b_bottom <= pt.y <= b_top:
                        inside_coords.append((pt.x, pt.y))
                        idx_map.append(idx)

                if not inside_coords:
                    continue

                sampled = np.array([v[0] for v in src.sample(inside_coords)], dtype=float)

                if is_building:

                    sampled = np.where(sampled > 100, np.nan, sampled / 100.0)
                elif is_green:

                    is_green_mask = np.isin(sampled, [10, 20, 30, 40, 90, 95, 100])
                    sampled = np.where(sampled == 0, np.nan, np.where(is_green_mask, 1.0, 0.0))

                for i, s_val in zip(idx_map, sampled):
                    if not np.isnan(s_val):
                        if np.isnan(result[i]):
                            result[i] = s_val
                        else:
                            result[i] = max(result[i], s_val)
                        sampled_mask[i] = True

        except Exception as e:
            logger.warning(f"Error reading {tif}: {e}")

    if not sampled_mask.any():
        return None

    return result

def _sample_population_from_tif(grid_gdf: gpd.GeoDataFrame) -> np.ndarray:
    """
    Sample WorldPop population counts from idn_ppp_2020_compressed.tif.
    Returns integer array of population per cell, or None if TIF unavailable.
    """
    try:
        import rasterio
        tif_path = os.path.abspath(POPULATION_TIF)
        if not os.path.exists(tif_path):
            logger.warning(f"Population TIF not found at {tif_path}. Using BPS/GHSL fallback.")
            return None

        centroids = grid_gdf.geometry.centroid
        coords = [(pt.x, pt.y) for pt in centroids]

        with rasterio.open(tif_path) as src:
            sampled = np.array([v[0] for v in src.sample(coords)], dtype=float)

        sampled = np.where(sampled < 0, 0.0, sampled)
        sampled = np.nan_to_num(sampled, nan=0.0, posinf=0.0, neginf=0.0)
        population = np.floor(sampled).astype(int)
        logger.info(f"Population sampled from TIF. Range: {population.min()}-{population.max()}, Total: {population.sum()}")
        return population

    except Exception as e:
        logger.warning(f"Failed to sample population from TIF: {e}. Using BPS/GHSL fallback.")
        return None

def create_grid(min_lon: float, min_lat: float, max_lon: float, max_lat: float,
                cell_size_m: int = 100, clip_polygon: dict = None):
    cell_size_deg = cell_size_m / 111320.0

    if max_lon - min_lon < cell_size_deg * 5:
        center_lon = (min_lon + max_lon) / 2
        min_lon, max_lon = center_lon - (cell_size_deg * 2.5), center_lon + (cell_size_deg * 2.5)

    if max_lat - min_lat < cell_size_deg * 5:
        center_lat = (min_lat + max_lat) / 2
        min_lat, max_lat = center_lat - (cell_size_deg * 2.5), center_lat + (cell_size_deg * 2.5)

    MAX_CELLS = 1500
    lon_cells = int((max_lon - min_lon) / cell_size_deg)
    lat_cells = int((max_lat - min_lat) / cell_size_deg)
    if lon_cells * lat_cells > MAX_CELLS and lon_cells > 0 and lat_cells > 0:
        scale = (lon_cells * lat_cells / MAX_CELLS) ** 0.5
        cell_size_deg *= scale
        logger.info(f"Grid cell size scaled to {cell_size_deg:.6f}° (~{MAX_CELLS} cells cap).")

    lons = np.arange(min_lon, max_lon, cell_size_deg)
    lats = np.arange(min_lat, max_lat, cell_size_deg)
    polygons = []
    grid_indices = []

    if len(lons) > 1 and len(lats) > 1:
        for i in range(len(lons) - 1):
            for j in range(len(lats) - 1):
                polygons.append(box(lons[i], lats[j], lons[i + 1], lats[j + 1]))
                grid_indices.append((i, j))

    grid = gpd.GeoDataFrame(
        {'geometry': polygons,
         'grid_idx_x': [i[0] for i in grid_indices],
         'grid_idx_y': [i[1] for i in grid_indices]},
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
                    logger.info(f"Clipped grid to city bounds. Cells: {len(grid)}")
                else:
                    logger.warning("Clipped grid is empty, keeping bbox.")
            else:
                logger.info(f"Geometry type {city_geom.geom_type}: skipping clip.")
        except Exception as e:
            logger.error(f"Clip polygon failed: {str(e)}")

    logger.info(f"Generated grid with {len(grid)} cells.")
    return grid

def _compute_density_sjoin(grid_gdf_proj: gpd.GeoDataFrame, features_gdf_proj: gpd.GeoDataFrame) -> np.ndarray:
    if features_gdf_proj is None or len(features_gdf_proj) == 0:
        return np.zeros(len(grid_gdf_proj))
    grid_reset = grid_gdf_proj.reset_index(drop=True)
    joined = gpd.sjoin(grid_reset, features_gdf_proj[["geometry"]], how='left', predicate='intersects')
    counts = joined.groupby(joined.index)['index_right'].count()
    counts = counts.reindex(grid_reset.index, fill_value=0)
    max_count = counts.max()
    return (counts / max_count).clip(0.0, 1.0).values if max_count > 0 else np.zeros(len(grid_gdf_proj))

def _compute_area_per_cell(grid_gdf_proj: gpd.GeoDataFrame, features_gdf_proj: gpd.GeoDataFrame) -> np.ndarray:
    if features_gdf_proj is None or len(features_gdf_proj) == 0:
        return np.zeros(len(grid_gdf_proj))
    grid_reset = grid_gdf_proj.reset_index(drop=True)
    grid_reset["_grid_idx"] = grid_reset.index
    try:
        overlay = gpd.overlay(grid_reset[["geometry", "_grid_idx"]],
                              features_gdf_proj[["geometry"]], how="intersection")
        overlay["_area"] = overlay.geometry.area
        area_per_cell = overlay.groupby("_grid_idx")["_area"].sum()
        result = np.zeros(len(grid_reset))
        result[area_per_cell.index.astype(int)] = area_per_cell.values
        return result
    except Exception as e:
        logger.warning(f"_compute_area_per_cell failed: {e}")
        return np.zeros(len(grid_reset))

def synthesize_microclimate(grid_gdf: gpd.GeoDataFrame, base_temp: float,
                             osm_data: dict, weather_data: dict = None,
                             city_name: str = None):
    n = len(grid_gdf)
    buildings_gdf = osm_data.get("buildings") if osm_data else None
    water_gdf = osm_data.get("waterways") if osm_data else None
    has_real_osm_buildings = (buildings_gdf is not None and len(buildings_gdf) > 0
                               and "geometry" in buildings_gdf.columns)
    has_real_water = (water_gdf is not None and len(water_gdf) > 0
                      and "geometry" in water_gdf.columns)

    grid_gdf = grid_gdf.copy()
    grid_proj = grid_gdf.to_crs("EPSG:32748").copy()

    building_tif_pattern = os.path.join(_DATA_DIR, "Building", "*.tif")
    tif_building_density = _sample_from_multi_tifs(grid_gdf, building_tif_pattern, is_building=True)

    if tif_building_density is not None:
        nans = np.isnan(tif_building_density)
        if nans.any():
            np.random.seed(42)
            tif_building_density[nans] = np.random.uniform(0.05, 0.3, nans.sum())
            logger.info(f"Filled {nans.sum()} cells with synthetic building density.")
        grid_gdf["building_density"] = tif_building_density
        grid_gdf["building_area_m2"] = tif_building_density * grid_proj.geometry.area
        logger.info("Building density: REAL GHSL TIF data.")
    elif has_real_osm_buildings:
        bld_proj = buildings_gdf.to_crs("EPSG:32748")
        grid_gdf["building_density"] = _compute_density_sjoin(grid_proj, bld_proj)
        grid_gdf["building_area_m2"] = _compute_area_per_cell(grid_proj, bld_proj)
    else:
        np.random.seed(42)
        grid_gdf["building_density"] = np.random.uniform(0.0, 0.8, n)
        grid_gdf["building_area_m2"] = np.zeros(n)

    green_tif_pattern = os.path.join(_DATA_DIR, "terrascope_download_*",
                                      "WORLDCOVER", "ESA_WORLDCOVER_10M_2021_V200", "MAP", "*", "*.tif")
    tif_green_density = _sample_from_multi_tifs(grid_gdf, green_tif_pattern, is_green=True)

    if tif_green_density is not None:
        nans = np.isnan(tif_green_density)
        if nans.any():
            np.random.seed(99)
            tif_green_density[nans] = np.random.uniform(0.1, 0.4, nans.sum())
        grid_gdf["green_density"] = tif_green_density
        logger.info("Green density: REAL ESA WorldCover TIF data.")
    else:
        green_gdf = osm_data.get("greenspaces") if osm_data else None
        has_real_green = (green_gdf is not None and len(green_gdf) > 0
                          and "geometry" in green_gdf.columns)
        if has_real_green:
            green_proj = green_gdf.to_crs("EPSG:32748")
            grid_gdf["green_density"] = _compute_density_sjoin(grid_proj, green_proj)
        else:
            np.random.seed(99)
            grid_gdf["green_density"] = np.random.uniform(0.0, 0.5, n)

    if has_real_water:
        water_proj = water_gdf.to_crs("EPSG:32748")
        grid_gdf["water_proximity"] = _compute_density_sjoin(grid_proj, water_proj)
    else:
        grid_gdf["water_proximity"] = np.zeros(n)

    grid_gdf["lst"] = base_temp + (grid_gdf["building_density"] * 2.5) - (grid_gdf["green_density"] * 1.5)

    daily = weather_data.get("daily", {}) if weather_data else {}
    daily_precip = daily.get("precipitation_sum", [0.0])
    precip_mm = float(daily_precip[0]) if daily_precip else 0.0
    soil_moisture = 0.0
    if weather_data and isinstance(weather_data, dict) and "current" in weather_data:
        current = weather_data["current"]
        if precip_mm == 0.0:
            precip_mm = float(current.get("precipitation", 0.0) or 0.0)
        soil_moisture = float(current.get("soil_moisture_0_to_7cm", 0.0) or 0.0)

    precip_factor = min(precip_mm / 50.0, 1.0)
    soil_factor = min(soil_moisture / 0.6, 1.0)
    base_flood_risk = 15.0 + (grid_gdf["building_density"] * 35.0) - (grid_gdf["green_density"] * 20.0)
    flood_scores = (base_flood_risk
                    + (grid_gdf["water_proximity"].values * 30.0)
                    + (precip_factor * 25.0)
                    + (soil_factor * 10.0))
    grid_gdf["floodScore"] = np.clip(flood_scores, 5.0, 95.0)

    grid_gdf["equityScore"] = 20.0 + (grid_gdf["green_density"] * 100.0) - (grid_gdf["building_density"] * 15.0)
    grid_gdf["equityScore"] = grid_gdf["equityScore"].clip(5, 95)

    tif_population = _sample_population_from_tif(grid_gdf)
    if tif_population is not None:
        grid_gdf["population"] = tif_population
    else:

        bps_density = _lookup_city_density(city_name)

        if bps_density is not None:

            total_area_km2 = grid_proj.geometry.area.sum() / 1_000_000.0
            total_estimated_pop = total_area_km2 * bps_density
            density_sum = grid_gdf["building_density"].sum()
            weight = grid_gdf["building_density"] / density_sum if density_sum > 0 else np.ones(n) / n
            estimated_pop = weight * total_estimated_pop
            logger.info(f"BPS lookup '{city_name}': {bps_density}/km², area={total_area_km2:.1f}km², total={total_estimated_pop:.0f}")

        else:

            p75 = float(np.percentile(grid_gdf["building_density"], 75))
            p50 = float(np.percentile(grid_gdf["building_density"], 50))

            if p75 < 0.15:
                people_per_km2 = 500.0
            elif p75 < 0.25:
                people_per_km2 = 1500.0
            elif p75 < 0.35:
                people_per_km2 = 3500.0
            elif p75 < 0.50:
                people_per_km2 = 7000.0
            elif p75 < 0.65:
                people_per_km2 = 12000.0
            else:
                people_per_km2 = 18000.0

            total_area_km2 = grid_proj.geometry.area.sum() / 1_000_000.0
            total_estimated_pop = total_area_km2 * people_per_km2
            density_sum = grid_gdf["building_density"].sum()
            weight = grid_gdf["building_density"] / density_sum if density_sum > 0 else np.ones(n) / n
            estimated_pop = weight * total_estimated_pop
            logger.info(f"GHSL heuristic: p75={p75:.3f}, p50={p50:.3f}, tier={people_per_km2:.0f}/km², area={total_area_km2:.1f}km², total={total_estimated_pop:.0f}")

        grid_gdf["population"] = np.floor(estimated_pop).clip(0, 50000).astype(int)
        logger.info(f"Population per cell: min={grid_gdf['population'].min()}, max={grid_gdf['population'].max()}, sum={grid_gdf['population'].sum()}")

    return grid_gdf
