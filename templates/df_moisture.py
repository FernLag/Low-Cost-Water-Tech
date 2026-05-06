# df_moisture.py
# Sensor: Df_robot_water

air_val = 1  # Air value:  # equation: example1
water_val = 1  # Water value:  # equation: example2
fc = 1  # Field capacity:  # equation: example3
wp = 1  # Wilting point:
k = 1  # k: calibration scaling factor

# Supported outputs:
#   - Raw value
#   - TAW
#   - Transformed Raw Value
#   - Rate of change
#   - 1-2-3 point calibration
#   - Threshold (very dry/dry/wet)


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Df_robot_water")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
