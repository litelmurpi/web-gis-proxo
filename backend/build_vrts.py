import os
import glob
import subprocess
import sys

def build_vrt():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    rio_exe = os.path.join(os.path.dirname(sys.executable), "rio.exe")
    
    # Building TIFs
    building_tifs = glob.glob(os.path.join(data_dir, "Building", "*.tif"))
    building_vrt = os.path.join(data_dir, "building.vrt")
    if building_tifs:
        print(f"Building VRT for {len(building_tifs)} Building TIFs...")
        try:
            result = subprocess.run([rio_exe, "vrt", building_vrt] + building_tifs, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"FAILED BUILDING. STDOUT: {result.stdout}")
                print(f"STDERR: {result.stderr}")
            else:
                print("Created building.vrt")
        except Exception as e:
            print(f"Error: {e}")
            
    # Green TIFs
    green_tifs = glob.glob(os.path.join(data_dir, "terrascope_download_*", "WORLDCOVER", "ESA_WORLDCOVER_10M_2021_V200", "MAP", "*", "*.tif"))
    green_vrt = os.path.join(data_dir, "green.vrt")
    if green_tifs:
        print(f"Building VRT for {len(green_tifs)} Green TIFs...")
        try:
            result = subprocess.run([rio_exe, "vrt", green_vrt] + green_tifs, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"FAILED GREEN. STDOUT: {result.stdout}")
                print(f"STDERR: {result.stderr}")
            else:
                print("Created green.vrt")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    build_vrt()
