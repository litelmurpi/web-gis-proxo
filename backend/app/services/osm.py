import requests
from shapely.geometry import Polygon, MultiPolygon
import geopandas as gpd
import logging

logger = logging.getLogger(__name__)

OSM_TIMEOUT_SECONDS = 8
OSM_MAX_AREA_DEG = 0.1

def fetch_osm_data(min_lon: float, min_lat: float, max_lon: float, max_lat: float):
    lon_span = max_lon - min_lon
    lat_span = max_lat - min_lat

    if lon_span > OSM_MAX_AREA_DEG or lat_span > OSM_MAX_AREA_DEG:
        center_lon = (min_lon + max_lon) / 2
        center_lat = (min_lat + max_lat) / 2
        half = OSM_MAX_AREA_DEG / 2
        min_lon, max_lon = center_lon - half, center_lon + half
        min_lat, max_lat = center_lat - half, center_lat + half
        logger.info(f"OSM query area clamped to {OSM_MAX_AREA_DEG}° × {OSM_MAX_AREA_DEG}° around city center.")

    overpass_url = "https://overpass-api.de/api/interpreter"
    bbox = f"{min_lat},{min_lon},{max_lat},{max_lon}"

    overpass_query = f"""
    [out:json][timeout:{OSM_TIMEOUT_SECONDS}];
    (
      way["building"]({bbox});
      way["leisure"="park"]({bbox});
      way["natural"="wood"]({bbox});
      way["landuse"="forest"]({bbox});
      way["landuse"="grass"]({bbox});
    );
    out body;
    >;
    out skel qt;
    """

    try:
        response = requests.post(overpass_url, data={'data': overpass_query}, timeout=OSM_TIMEOUT_SECONDS + 2)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        logger.error(f"Overpass API error: {e}")
        return {"buildings": gpd.GeoDataFrame(columns=["geometry"]), "greenspaces": gpd.GeoDataFrame(columns=["geometry"])}

    nodes = {}
    for el in data.get("elements", []):
        if el["type"] == "node":
            nodes[el["id"]] = (el["lon"], el["lat"])

    building_polys = []
    green_polys = []

    for el in data.get("elements", []):
        if el["type"] == "way" and "nodes" in el:
            coords = [nodes[n] for n in el["nodes"] if n in nodes]
            if len(coords) >= 3:
                try:
                    poly = Polygon(coords)
                    if not poly.is_valid:
                        poly = poly.buffer(0)

                    tags = el.get("tags", {})
                    if "building" in tags:
                        building_polys.append(poly)
                    elif any(k in tags for k in ["leisure", "natural", "landuse"]):
                        green_polys.append(poly)
                except Exception:
                    pass

    buildings_gdf = gpd.GeoDataFrame({"geometry": building_polys}, crs="EPSG:4326") if building_polys else gpd.GeoDataFrame(columns=["geometry"])
    green_gdf = gpd.GeoDataFrame({"geometry": green_polys}, crs="EPSG:4326") if green_polys else gpd.GeoDataFrame(columns=["geometry"])

    logger.info(f"OSM: {len(building_polys)} buildings, {len(green_polys)} green spaces fetched.")
    return {"buildings": buildings_gdf, "greenspaces": green_gdf}
