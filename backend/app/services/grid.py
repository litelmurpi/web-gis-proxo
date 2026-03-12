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


def synthesize_microclimate(grid_gdf: gpd.GeoDataFrame, base_temp: float, osm_data: dict):
    n = len(grid_gdf)

    buildings_gdf = osm_data.get("buildings") if osm_data else None
    green_gdf = osm_data.get("greenspaces") if osm_data else None

    has_real_buildings = buildings_gdf is not None and len(buildings_gdf) > 0 and "geometry" in buildings_gdf.columns
    has_real_green = green_gdf is not None and len(green_gdf) > 0 and "geometry" in green_gdf.columns

    if has_real_buildings or has_real_green:
        grid_proj = grid_gdf.to_crs("EPSG:32748").copy()
        grid_proj["cell_area"] = grid_proj.geometry.area

        if has_real_buildings:
            bld_proj = buildings_gdf.to_crs("EPSG:32748")
            bld_union = bld_proj.union_all()
            grid_proj["building_density"] = grid_proj.geometry.apply(
                lambda cell: cell.intersection(bld_union).area / cell.area if cell.area > 0 else 0.0
            ).clip(0.0, 1.0)
        else:
            np.random.seed(42)
            grid_proj["building_density"] = np.random.uniform(0.0, 0.8, n)

        if has_real_green:
            green_proj = green_gdf.to_crs("EPSG:32748")
            green_union = green_proj.union_all()
            grid_proj["green_density"] = grid_proj.geometry.apply(
                lambda cell: cell.intersection(green_union).area / cell.area if cell.area > 0 else 0.0
            ).clip(0.0, 1.0)
        else:
            np.random.seed(99)
            grid_proj["green_density"] = np.random.uniform(0.0, 0.5, n)

        grid_gdf = grid_gdf.copy()
        grid_gdf["building_density"] = grid_proj["building_density"].values
        grid_gdf["green_density"] = grid_proj["green_density"].values
        logger.info("synthesize_microclimate: used real OSM density data.")

    else:
        logger.warning("synthesize_microclimate: no OSM data, using stochastic fallback.")
        np.random.seed(42)
        grid_gdf = grid_gdf.copy()
        grid_gdf["building_density"] = np.random.uniform(0.0, 0.8, n)
        grid_gdf["green_density"] = np.random.uniform(0.0, 0.5, n)

    grid_gdf["lst"] = base_temp + (grid_gdf["building_density"] * 3.0) - (grid_gdf["green_density"] * 2.5)

    np.random.seed(7)
    grid_gdf["floodScore"] = np.random.uniform(10.0, 90.0, n)
    np.random.seed(13)
    grid_gdf["equityScore"] = 100 - (grid_gdf["building_density"] * 60 + np.random.uniform(0, 20, n))
    grid_gdf["equityScore"] = grid_gdf["equityScore"].clip(10, 95)
    np.random.seed(21)
    grid_gdf["population"] = np.random.randint(50, 2000, n)

    return grid_gdf
