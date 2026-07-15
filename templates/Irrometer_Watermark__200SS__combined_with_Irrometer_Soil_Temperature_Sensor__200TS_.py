# Irrometer_Watermark__200SS__combined_with_Irrometer_Soil_Temperature_Sensor__200TS_.py
# Sensor: Irrometer Watermark (200SS) combined with Irrometer Soil Temperature Sensor (200TS)

# No parameters defined

# Supported outputs:
#   - Raw value (Resistance)  # equation: (−3.213*Resistance−4.093)/(1−0.009733*Resistance−0.01205*Temperature)
#   - Raw Value (%)  # inputs: air_val_non_modifiable, water_val_non_modifiable  # equation: x < a → 'Too a' x < b → 'v ab' → 'good'
#   - Tension  # equation: Inside of the code itself for simplicity
#   - Raw value (Temperature, in °F)  # equation: directly read
#   - Raw value (Temperature, in °C)  # equation: directly read


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Irrometer Watermark (200SS) combined with Irrometer Soil Temperature Sensor (200TS)")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
