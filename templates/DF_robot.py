# DF_robot.py
# Sensor: DF_robot

air_val = 0  # Air value: raw reading in open air  # min: 0  max: 1023
water_val = 0  # Water value: raw reading submerged in water  # min: 0  max: 1023
fc = 0  # Field capacity: The amount of water that remains in the soil after all the excess water at saturation has been drained.  # min: 0  max: 1023
wp = 0  # Wilting point:  When plants take up all the available water for a given soil and it dries out to the point where it cannot supply any water to keep plants from dying  # min: 0  max: 1023
k = 0  # k: calibration scaling factor and it is determined by searching for an optimal match between the gravimetric and simulated soil moisture and minimisation of error.  # min: 0  max: 1023

# Supported outputs:
#   - Raw value  # inputs: air_val (min)
#   - Transformed Raw Value  # inputs: air_val (max), water_val  # equation: (X-min)/(max-min)*100
#   - TAW  # inputs: air_val, water_val, FC, WP  # equation: soil_moisture=1/k*ln(V-water_val)/(air_val-water_val)
#   - Rate of change  # equation: dV/dt = a(good or stop irrigating)
#   - Wetting front
#   - 1-2-3 point calibration  # inputs: a, b  # equation: basically same as TAW but possible ore equations
#   - Threshold (very dry/dry/wet)  # inputs: a, b  # equation: x < a → 'Too a' x < b → 'v ab' → 'good'


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : DF_robot")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
