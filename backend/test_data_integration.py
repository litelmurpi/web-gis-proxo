"""Quick smoke test for real flood risk and population data."""
import requests
import json
import sys

def test_search(city="Bandung"):
    url = f"http://localhost:8000/api/analysis/search?city={city}"
    print(f"Testing: {url}")
    
    try:
        resp = requests.get(url, timeout=30)
        print(f"Status: {resp.status_code}")
        
        if resp.status_code != 200:
            print(f"Error: {resp.text}")
            return
            
        data = resp.json()
        
        if "error" in data:
            print(f"API Error: {data['error']}")
            return
            
        features = data.get('geojson', {}).get('features', [])
        print(f"Total grid cells: {len(features)}")
        
        if not features:
            print("FAIL: No features")
            return
        
        # Show sample properties
        props = features[0]['properties']
        print(f"\nSample cell properties:")
        print(json.dumps(props, indent=2))
        
        # Check flood scores
        flood_scores = [f['properties']['floodScore'] for f in features[:20]]
        print(f"\nFlood scores (first 20): {[round(s, 1) for s in flood_scores]}")
        unique_floods = len(set([round(s, 1) for s in flood_scores]))
        print(f"Unique flood values: {unique_floods}")
        
        # Check population
        pops = [f['properties']['population'] for f in features[:20]]
        print(f"\nPopulation (first 20): {pops}")
        
        # Check water_proximity if present
        if 'water_proximity' in props:
            water_vals = [f['properties']['water_proximity'] for f in features[:20]]
            nonzero_water = sum(1 for w in water_vals if w > 0)
            print(f"\nWater proximity > 0: {nonzero_water}/{len(water_vals)} cells")
        
        print("\n✅ Test passed!")
        
    except requests.ConnectionError:
        print("ERROR: Server not running on localhost:8000")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    city = sys.argv[1] if len(sys.argv) > 1 else "Bandung"
    test_search(city)
