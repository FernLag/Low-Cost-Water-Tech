# Watermark.py
# Sensor: Watermark

air_val = 0  # Air value: raw reading in open air  # min: 0  max: 1023
water_val = 0  # Water value: raw reading submerged in water  # min: 0  max: 1023

# Supported outputs:
#   - Transformed Raw value  # inputs: air_val (non modifiable by user), water_val (non modifiable by user)  # equation: same as above
#   - Raw value
#   - Transformed raw value
#   - Raw values


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Watermark")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
