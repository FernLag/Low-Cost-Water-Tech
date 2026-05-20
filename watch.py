import subprocess
import time
import os

WATCH_FILE = "sensor_configuration.xlsx"
last_modified = 0

print(f"Watching {WATCH_FILE} for changes... (Ctrl+C to stop)")

while True:
    try:
        mtime = os.path.getmtime(WATCH_FILE)
        if mtime != last_modified and last_modified != 0:
            print(f"Change detected: running build.py...")
            subprocess.run(["python3", "build.py"])
            print("Done.\n")
        last_modified = mtime
    except FileNotFoundError:
        print(f"Waiting for {WATCH_FILE}...")
    time.sleep(2)