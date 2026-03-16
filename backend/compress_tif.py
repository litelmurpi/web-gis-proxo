"""
Compress idn_ppp_2020.tif using DEFLATE lossless compression.
Run: python compress_tif.py
"""
import os
import sys
import rasterio
from rasterio.shutil import copy as rio_copy

INPUT = r"C:\Users\Sandy\web-gis-proxo\backend\data\idn_ppp_2020.tif"
OUTPUT = r"C:\Users\Sandy\web-gis-proxo\backend\data\idn_ppp_2020_compressed.tif"

def compress():
    print(f"Opening: {INPUT}")
    print(f"File size BEFORE: {os.path.getsize(INPUT) / 1e6:.1f} MB")

    with rasterio.open(INPUT) as src:
        original_meta = src.meta.copy()
        original_min = float(src.read(1).min())
        original_max = float(src.read(1).max())
        print(f"CRS      : {src.crs}")
        print(f"Shape    : {src.height} x {src.width}")
        print(f"Dtype    : {src.dtypes[0]}")
        print(f"Data min : {original_min}")
        print(f"Data max : {original_max}")

    print("\nCompressing with DEFLATE (lossless)...")
    rio_copy(
        INPUT,
        OUTPUT,
        driver="GTiff",
        compress="deflate",
        predictor=2,
        zlevel=9,
        tiled=True,
        blockxsize=256,
        blockysize=256,
    )

    print(f"\nFile size AFTER: {os.path.getsize(OUTPUT) / 1e6:.1f} MB")

    # Verify integrity
    print("\nVerifying compressed file...")
    with rasterio.open(OUTPUT) as src:
        data = src.read(1)
        compressed_min = float(data.min())
        compressed_max = float(data.max())
        print(f"Compressed min : {compressed_min}")
        print(f"Compressed max : {compressed_max}")

    if abs(original_min - compressed_min) < 0.001 and abs(original_max - compressed_max) < 0.001:
        print("\n✅ Verification passed! Data is identical.")
        print(f"\nYou can now safely delete the original:\n  {INPUT}")
    else:
        print("\n❌ WARNING: Values mismatch! Do NOT delete original.")
        sys.exit(1)

if __name__ == "__main__":
    compress()
