# Watermark_Temperature.py
# Sensor: Irrometer Watermark (200SS) combined with Irrometer Soil Temperature Sensor (200TS)

air_val_max = 200  #   # min: 0  max: 200
water_val = 0  #   # min: 0  max: 200

# Supported outputs:
#   - Raw value (Resistance)  # equation: Rx*(Vs-A1)/A1
#   - Raw Value (%)  # inputs: abs(air_val_max), water_val  # equation: (X-min)/(max-min)*100
#   - Tension  # equation: Inside of the code itself for simplicity
#   - Raw value (Temperature, in °F)  # equation: 20 + 48.48(V-0.49)
#   - Raw value (Temperature, in °C)  # equation: ((20+48.48(V-0.49)-32)/1.8)


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Irrometer Watermark (200SS) combined with Irrometer Soil Temperature Sensor (200TS)")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
