# Watermark.py
# Sensor: Irrometer Watermark (200SS)

air_val = 600  # Air value: raw reading in open air  # min: 0  max: 1023
water_val = 0  # Water value: raw reading submerged in water  # min: 0  max: 200
Resistance = 0  # Resistance  # min: 0  max: 200
air_val_max = 200  #   # min: 0  max: 200

# Supported outputs:
#   - Raw value (Resistance)  # equation: Rx*(Vs-A1)/A1
#   - Raw Value (%)  # inputs: abs(air_val_max), water_val  # equation: (X-min)/(max-min)*100
#   - Tension (kPa)


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Irrometer Watermark (200SS)")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
