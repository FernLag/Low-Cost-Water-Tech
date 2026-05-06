# Watermark_moisture.py
# Sensor: Watermark 200SS

# No parameters defined

# Supported outputs:
#   - Transformed Raw value


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Watermark 200SS")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
