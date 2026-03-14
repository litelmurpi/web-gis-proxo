import geopandas as gpd
import pandas as pd
from shapely.geometry import box
from app.services.grid import synthesize_microclimate

# Mock grid with 5 cells
grid_gdf = gpd.GeoDataFrame({
    'geometry': [box(0, 0, 1, 1)] * 5,
    'building_density': [0.1, 0.5, 0.8, 0.0, 0.2],
    'green_density': [0.8, 0.2, 0.0, 0.5, 0.1],
    'water_proximity': [0.0, 0.0, 0.5, 1.0, 0.1],
    'building_area_m2': [100, 500, 1000, 0, 200]
}, crs="EPSG:32748")

# OSM data missing (handled safely)
osm_data = {}

# Weather data (some rain)
weather_data = {
    'current': {
        'precipitation': 15.0, # some rain
        'soil_moisture_0_to_7cm': 0.3 # damp soil
    }
}

print("Running synthesize_microclimate...")
try:
    result = synthesize_microclimate(grid_gdf, base_temp=30.0, osm_data=osm_data, weather_data=weather_data)
    
    print("\nResults:")
    for _, row in result.iterrows():
        print(f"Bldg: {row['building_density']:.1f}, Green: {row['green_density']:.1f}, Water: {row['water_proximity']:.1f} --> Flood: {row['floodScore']:.1f}, Equity: {row['equityScore']:.1f}, Pop: {row['population']}")

    print("\nTrying with NO weather data:")
    result_dry = synthesize_microclimate(grid_gdf, base_temp=30.0, osm_data=osm_data, weather_data=None)
    for _, row in result_dry.iterrows():
         print(f"Bldg: {row['building_density']:.1f}, Green: {row['green_density']:.1f}, Water: {row['water_proximity']:.1f} --> Flood: {row['floodScore']:.1f}")

except Exception as e:
    import traceback
    traceback.print_exc()
