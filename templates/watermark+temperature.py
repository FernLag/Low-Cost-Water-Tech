# watermark+temperature.py
# Sensor: watermark+temperature

# No parameters defined

# Supported outputs:
#   - Transformed raw value
#   - Temperature  # equation: na
#   - Tension  # equation: see pdf V/0.0117(kPa)


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : watermark+temperature")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
