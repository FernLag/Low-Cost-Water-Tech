# Watermark_3x_200SSVA3_Temp.py
# Sensor: 3x Watermark 200SS + 200SSVA3 + Temperature

# No parameters defined

# Supported outputs:
#   - Raw value
#   - Transformed raw value
#   - Tension (3 locations)
#   - Temperature


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : 3x Watermark 200SS + 200SSVA3 + Temperature")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
