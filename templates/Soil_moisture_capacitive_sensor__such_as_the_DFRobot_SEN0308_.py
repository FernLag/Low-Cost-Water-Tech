# Soil_moisture_capacitive_sensor__such_as_the_DFRobot_SEN0308_.py
# Sensor: Soil moisture capacitive sensor (such as the DFRobot SEN0308)

air_val = 0  # Air value: raw reading in open air  # min: 0  max: 1023
water_val = 0  # Water value: raw reading submerged in water  # min: 0  max: 1023
fc = 0  # Field capacity: The amount of water that remains in the soil after all the excess water at saturation has been drained.  # min: 0  max: 1
wp = 0  # Wilting point:  When plants take up all the available water for a given soil and it dries out to the point where it cannot supply any water to keep plants from dying  # min: 0  max: 1
k = 0  # k: calibration scaling factor and it is determined by searching for an optimal match between the gravimetric and simulated soil moisture and minimisation of error.  # min: 0  max: 1
air_val_min = 0  # Air value: raw reading in open air  # min: 0  max: 0
air_val_max = 1023  # Air value: raw reading in open air  # min: 1023  max: 1023

# Supported outputs:
#   - Raw Value (bits)  # inputs: air_val_min
#   - Raw Value (%)  # inputs: air_val_max, water_val  # equation: (X-min)/(max-min)*100
#   - Volumetric Soil Moisture  # inputs: air_val, water_val, FC, WP  # equation: 1/k*ln(V-water_val)/(air_val-water_val)
#   - Total Available Water  # inputs: air_val, water_val, FC, WP  # equation: soil_moisture-WP*100/(FC-WP)
#   - Rate of Change of Soil Water Status  # equation: dV/dt = a(good or stop irrigating)
#   - Wetting Front  # inputs: shallow, deep, threshold
#   - 1-2-3 point calibration  # inputs: a, b  # equation: soil_moisture-WP*100/(FC-WP)
#   - Thresholds  # inputs: a, b  # equation: x < a → 'Too a' x < b → 'v ab' → 'good'


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : Soil moisture capacitive sensor (such as the DFRobot SEN0308)")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
