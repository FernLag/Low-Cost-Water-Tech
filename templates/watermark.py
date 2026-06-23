# Watermark.py
# Sensor: Watermark

air_val = 0  # Air value: raw reading in open air  # min: 0  max: 200
water_val = 0  # Water value: raw reading submerged in water  # min: 0  max: 200
Resistance = 0  # Resistance  # min: 0  max: 200

# Supported outputs:
#   - Transformed Raw Value  # inputs: air_val_non_modifiable, water_val_non_modifiable  # equation: x < a → 'Too a' x < b → 'v ab' → 'good'
#   - Raw value (Resistance)  # equation: R = Rx*(Vs-A1)/A1
#   - Raw value (Temperature)  # equation: directly read


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Watermark")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
