import rasterio
import sys
import json

def get_info(filepath):
    info = {"file": filepath}
    try:
        with rasterio.open(filepath) as src:
            info["crs"] = str(src.crs)
            info["width"] = src.width
            info["height"] = src.height
            info["bands"] = src.count
            info["dtypes"] = [str(d) for d in src.dtypes]
            info["nodata"] = src.nodatavals
            
            data = src.read(1)
            info["min"] = float(data.min())
            info["max"] = float(data.max())
    except Exception as e:
        info["error"] = str(e)
    return info

if __name__ == "__main__":
    results = [get_info(f) for f in sys.argv[1:]]
    with open("tif_info.json", "w") as f:
        json.dump(results, f, indent=2)
