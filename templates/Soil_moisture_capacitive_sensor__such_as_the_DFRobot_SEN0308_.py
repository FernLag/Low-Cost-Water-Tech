# Soil_moisture_capacitive_sensor__such_as_the_DFRobot_SEN0308_.py
# Sensor: Soil moisture capacitive sensor (such as the DFRobot SEN0308)

# No parameters defined

# Supported outputs:
#   - Raw Value (bits)  # inputs: air_val_min
#   - Raw Value (%)  # inputs: air_val_max, water_val  # equation: (X-min)/(max-min)*100
#   - Thresholds  # inputs: a, b  # equation: x < a → 'Too a' x < b → 'v ab' → 'good'
#   - Wetting Front  # inputs: shallow, deep, threshold
#   - 1-2-3 point calibrations  # inputs: a, b  # equation: soil_moisture-WP*100/(FC-WP)
#   - Rate of Change of Soil Water Status  # equation: dV/dt = a(good or stop irrigating)
#   - Volumetric Soil Moisture  # inputs: air_val, water_val, FC, WP  # equation: 1/k*ln(V-water_val)/(air_val-water_val)
#   - Total Available Water  # inputs: air_val, water_val, FC, WP  # equation: soil_moisture-WP*100/(FC-WP)


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Soil moisture capacitive sensor (such as the DFRobot SEN0308)")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
