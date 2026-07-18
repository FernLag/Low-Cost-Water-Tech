# Irrometer_Watermark__200SS_.py
# Sensor: Irrometer Watermark (200SS)

# No parameters defined

# Supported outputs:
#   - Raw value (Resistance)  # equation: R = Rx*(Vs-A1)/A1
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
