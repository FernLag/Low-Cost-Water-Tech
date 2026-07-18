# changed_order.py
# Sensor: changed order

# No parameters defined

# Supported outputs:
#   - Volumetric Soil Moisture  # inputs: The volumetric soil moisture content, expressed here as a percentage (%), references to the volume of water reported to the volume of soil. It is calculated as θv = Vw/Vs⋅100 where Vw is  the water volume, Vs the dry soil volume., air_val, water_val, FC  # equation: WP
#   - Total Available Water  # inputs: Available water capacity is the amount of water that can be stored in a soil profile and be available for growing crops. It is also known as available water content (AWC), profile available water (PAW) or total available water (TAW)., air_val, water_val, FC  # equation: WP


def read(raw_value: float) -> dict:
    result = {}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : changed order")
    print(f"Raw    : {test_raw}")
    print(f"Output : {output}")
