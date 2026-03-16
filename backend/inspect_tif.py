import rasterio
import sys

def inspect_tif(filepath):
    print(f"Inspecting {filepath}:")
    try:
        with rasterio.open(filepath) as src:
            print(f"CRS: {src.crs}")
            print(f"Transform: {src.transform}")
            print(f"Width/Height: {src.width}x{src.height}")
            print(f"Bands: {src.count}")
            print(f"Dtypes: {src.dtypes}")
            print(f"Nodata: {src.nodatavals}")
            
            # Read a small window to see value range
            data = src.read(1)
            print(f"Min: {data.min()}, Max: {data.max()}")
            print("-" * 40)
    except Exception as e:
        print(f"Failed to read {filepath}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        for f in sys.argv[1:]:
            inspect_tif(f)
    else:
        print("Provide file paths")
