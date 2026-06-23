# Watermark_Temperature.py
# Sensor: Watermark_Temperature

# No parameters defined

# Supported outputs:
#   - Transformed Raw Value  # equation: (−3.213*Resistance−4.093)/(1−0.009733*Resistance−0.01205*Temperature)
#   - Temperature  # equation: directly read
#   - Tension  # equation: Inside of the code itself for simplicity


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Watermark_Temperature")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
