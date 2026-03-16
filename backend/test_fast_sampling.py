import os
import time
import json
import geopandas as gpd
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "app"))
from services.grid import create_grid, synthesize_microclimate

def run_test():
    min_lon, min_lat = 106.80, -6.22
    max_lon, max_lat = 106.85, -6.18
    
    t0 = time.time()
    grid_gdf = create_grid(min_lon, min_lat, max_lon, max_lat, cell_size_m=100)
    t_grid = time.time() - t0
    
    t1 = time.time()
    result_gdf = synthesize_microclimate(grid_gdf, base_temp=30.0, osm_data={}, weather_data={})
    t_micro = time.time() - t1
    
    # Dump test results to json
    out = {
        "grid_time_s": t_grid,
        "microclimate_time_s": t_micro,
        "total_time_s": t_grid + t_micro,
        "fast_enough": (t_grid + t_micro) < 10.0,
        "num_cells": len(grid_gdf),
        "building_density_max": float(result_gdf["building_density"].max()),
        "green_density_max": float(result_gdf["green_density"].max()),
        "population_sum": float(result_gdf["population"].sum())
    }
    with open("test_result.json", "w") as f:
        json.dump(out, f, indent=2)

if __name__ == "__main__":
    run_test()
