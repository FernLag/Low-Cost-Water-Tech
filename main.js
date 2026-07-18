const SENSOR_TYPES = {
  DF_robot: {
    label: "DF_robot",
    tip: "Direct sensor reading",
    outputs: [
      { value: "Raw Value", tip: "Raw sensor value (direct reading)" },
      {
        value: "Transformed Raw Value",
        tip: "Value sensor in the air (units): (X-min)/(max-min)*100",
      },
      {
        value: "Total Available Water (volumetric?)",
        tip: "Soil moisture: 1/k*ln(V-water_val)/(air_val-water_val)",
      },
      { value: "Total Available Water", tip: "soil_moisture - WP*100/(FC-WP)" },
      { value: "Rate of Change", tip: "dV/dt = a (good or stop irrigating)" },
      {
        value: "Wetting Front",
        tip: "Dual-depth: 'Front detected' when water reaches the deep sensor. Needs a second sensor block.",
      },
      {
        value: "1-2-3 point calibration",
        tip: "soil_moisture - WP*100/(FC-WP)",
      },
      {
        value: "Threshold (very dry/dry/wet)",
        tip: "x<a -> Too dry, x<b -> Very dry, else -> Good",
      },
    ],
    params: [
      {
        name: "air_val_min",
        display: "Air value (min)",
        label:
          "air_val_min: raw reading in open air, used as the 'min' baseline.",
        value: "0",
        min: "0",
        max: "1023",
        units: "kΩ",
      },
      {
        name: "air_val_max",
        display: "Air value (max)",
        label:
          "air_val_max: raw reading in open air, used as 'max' in Transformed Raw Value.",
        value: "0",
        min: "0",
        max: "1023",
        units: "kPa",
      },
      {
        name: "air_val",
        display: "Air value",
        label:
          "air_val: raw reading in open air, used in Total Available Water.",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "water_val",
        display: "Water value",
        label: "water_val: raw reading submerged in water.",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "fc",
        display: "Field Capacity",
        label:
          "FC: volumetric water content when soil has drained freely after saturation.",
        value: "0",
        min: "0",
        max: "1",
        units: "m³/m³",
      },
      {
        name: "wp",
        display: "Wilting point",
        label:
          "WP: volumetric water content below which plants cannot extract water.",
        value: "0",
        min: "0",
        max: "1",
        units: "m³/m³",
      },
      {
        name: "k",
        display: "k",
        label: "k: calibration scaling factor.",
        value: "0",
        min: "0",
        max: "1",
        units: "",
      },
      {
        name: "a",
        display: "a (threshold)",
        label: "a: lower threshold — below this is 'Too dry'.",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "b",
        display: "b (threshold)",
        label: "b: upper threshold — above this is 'Good'.",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "shallow",
        display: "Shallow sensor",
        label: "shallow: the analog reading of this (upper) sensor.",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "deep",
        display: "Deep sensor port",
        label:
          "deep: the analog port of the lower sensor (chosen via the partner dropdown).",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "threshold",
        display: "Front threshold",
        label:
          "threshold: how much the deep sensor must change (ADC units) to count as the front arriving.",
        value: "50",
        min: "0",
        max: "1023",
        units: "ADC",
      },
    ],
  },
  Watermark: {
    label: "Watermark",
    tip: "Watermark soil moisture sensor",
    outputs: [
      {
        value: "Transformed Raw Value",
        tip: "x<a -> Too dry, x<b -> Very dry, else -> Good",
      },
      {
        value: "Raw value (Resistance)",
        tip: "Resistance reading: R = Rx*(Vs-A1)/A1",
      },
    ],
    params: [
      {
        name: "air_val_non_modifiable",
        display: "Air value (non-modifiable)",
        label:
          "air_val_non_modifiable: resistance in open air, fixed by hardware. Used as threshold 'a'.",
        value: "0",
        min: "0",
        max: "200",
        units: "kΩ",
      },
      {
        name: "water_val_non_modifiable",
        display: "Water value (non-modifiable)",
        label:
          "water_val_non_modifiable: resistance in water, fixed by hardware. Used as threshold 'b'.",
        value: "0",
        min: "0",
        max: "200",
        units: "kΩ",
      },
    ],
  },
  Watermark_Temperature: {
    label: "Watermark_Temperature",
    tip: "Watermark with temperature compensation",
    outputs: [
      { value: "Raw value (Temperature)", tip: "Temperature, directly read" },
      {
        value: "Transformed Raw Value",
        tip: "kPa = (-3.213R - 4.093)/(1 - 0.009733R - 0.01205T)",
      },
      { value: "Temperature", tip: "Temperature, directly read" },
      {
        value: "Tension",
        tip: "Soil tension in kPa (computed inside the code)",
      },
    ],
    params: [],
  },
};

const PORT_TIPS = {
  A1: "Analog pin 1",
  A2: "Analog pin 2",
  A3: "Analog pin 3",
  A4: "Analog pin 4",
  A5: "Analog pin 5",
  D1: "Digital pin 1",
  D2: "Digital pin 2",
  D3: "Digital pin 3",
  D4: "Digital pin 4",
  D5: "Digital pin 5",
  D6: "Digital pin 6",
  D7: "Digital pin 7",
  D8: "Digital pin 8",
  D9: "Digital pin 9",
  D10: "Digital pin 10",
  D11: "Digital pin 11",
  D12: "Digital pin 12",
  D13: "Digital pin 13",
  D14: "Digital pin 14",
};

const PORTS = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "D11",
  "D12",
  "D13",
  "D14",
];

const VIZ_OPTIONS = [
  { value: "none", label: "No visualization", tip: "No output." },
  { value: "bar", label: "Loading bar (LCD)", tip: "16x2 LCD progress bar." },
  {
    value: "raw_lcd",
    label: "Raw value (LCD)",
    tip: "Displays the raw ADC reading on the LCD screen",
  },
  {
    value: "state_lcd",
    label: "State: very dry / dry / wet (LCD)",
    tip: "Three-state classification on the LCD screen",
  },
  {
    value: "transformed_lcd",
    label: "Transformed value (LCD)",
    tip: "Displays the percent on the LCD screen",
  },
  {
    value: "front_lcd",
    label: "Front detected (LCD)",
    tip: "Shows 'Front detected' when the wetting front reaches the deep sensor",
  },
  {
    value: "temp_lcd",
    label: "Temperature °C (LCD)",
    tip: "Displays the temperature in Celsius on the LCD",
  },
  {
    value: "kpa_lcd",
    label: "Tension kPa (LCD)",
    tip: "Displays the soil tension in kPa on the LCD",
  },
];

const SURVEY_QUESTIONS = [
  {
    key: "filename",
    label: "Name of file to generate",
    type: "text",
    required: true,
    placeholder: "e.g. apples_field2 (no spaces, no .ino)",
  },
  {
    key: "name",
    label: "Your name",
    type: "text",
    required: true,
    placeholder: "e.g. John R.",
  },
  {
    key: "country",
    label: "Country",
    type: "text",
    required: true,
    placeholder: "e.g. United States of America",
  },
  {
    key: "email",
    label: "Email address",
    type: "email",
    required: true,
    placeholder: "e.g. name@example.com",
  },
  {
    key: "ino_comment",
    label: "Comment to include in the code (optional)",
    type: "text",
    required: false,
    placeholder: "e.g. Orchard block 2, installed June 2026",
  },
];

const OUTPUT_PARAMS = {
  DF_robot: {
    "Raw Value": ["air_val_min"],
    "Transformed Raw Value": ["air_val_max", "water_val"],
    "Total Available Water (volumetric?)": ["air_val", "water_val", "fc", "wp"],
    "Total Available Water": ["air_val", "water_val", "fc", "wp"],
    "Rate of Change": [],
    "Wetting Front": ["shallow", "deep", "threshold"],
    "1-2-3 point calibration": ["a", "b"],
    "Threshold (very dry/dry/wet)": ["a", "b"],
  },
  Watermark: {
    "Transformed Raw Value": [
      "air_val_non_modifiable",
      "water_val_non_modifiable",
    ],
    "Raw value (Resistance)": [],
  },
  Watermark_Temperature: {
    "Raw value (Temperature)": [],
    "Transformed Raw Value": [],
    Temperature: [],
    Tension: [],
  },
};

const OUTPUT_VIZ = {
  DF_robot: {
    "Raw Value": ["none", "raw_lcd"],
    "Transformed Raw Value": ["none", "bar", "transformed_lcd"],
    "Total Available Water (volumetric?)": [
      "none",
      "bar",
      "transformed_lcd",
      "state_lcd",
    ],
    "Total Available Water": ["none", "bar", "transformed_lcd", "state_lcd"],
    "Rate of Change": ["none", "state_lcd"],
    "Wetting Front": ["none", "front_lcd"],
    "1-2-3 point calibration": ["none", "bar", "transformed_lcd"],
    "Threshold (very dry/dry/wet)": ["none", "state_lcd"],
  },
  Watermark: {
    "Transformed Raw Value": ["none", "state_lcd"],
    "Raw value (Resistance)": ["none", "raw_lcd"],
  },
  Watermark_Temperature: {
    "Raw value (Temperature)": ["none", "temp_lcd"],
    "Transformed Raw Value": ["none", "kpa_lcd"],
    Temperature: ["none", "temp_lcd"],
    Tension: ["none", "kpa_lcd"],
  },
};

const TEMPLATES = {
  sensors: {
    DF_robot: {
      constants: `/* Sensor {idx}: DF_robot on port {port} */
const int   air_val_min_{idx} = {air_val_min};
const int   air_val_max_{idx} = {air_val_max};
const int   Vair_{idx}        = {air_val};
const int   Vwat_{idx}        = {water_val};
const float b_{idx}           = log({air_val} - {water_val});
const float a_coef_{idx}      = -1.0 / {k};
float WP_{idx}                = {wp};
float FC_{idx}                = {fc};
const int   thr_a_{idx}       = {a};
const int   thr_b_{idx}       = {b};
const int   front_thr_{idx}   = {threshold};
`,
      read: `  int sensorValue_{idx} = analogRead({readPin});
  x = a_coef_{idx} * (log(sensorValue_{idx} - Vwat_{idx}) - b_{idx});`,
    },
    Watermark: {
      constants: `/* Sensor {idx}: Watermark on port {port} */
const float Rx_{idx}    = 10000.0;   /* series resistor (Ω), fixed on the NodeFlow board */
const float Vs_{idx}    = 5.0;       /* Uno R3 supply voltage */
const int   thr_a_{idx} = {air_val_non_modifiable};
const int   thr_b_{idx} = {water_val_non_modifiable};
`,
      read: `  int   sensorValue_{idx} = analogRead({readPin});
  float A1_{idx} = (sensorValue_{idx} / 1023.0) * Vs_{idx};   /* analog measurement in volts */
  float R_{idx}  = Rx_{idx} * (Vs_{idx} - A1_{idx}) / A1_{idx};`,
    },
    Watermark_Temperature: {
      constants: `/* Sensor {idx}: Watermark_Temperature on port {port} */
const float Rx_{idx} = 10000.0;   /* series resistor (Ω), fixed on the NodeFlow board */
const float Vs_{idx} = 5.0;       /* Uno R3 supply voltage */
`,
      read: `  int   sensorValue_{idx} = analogRead({readPin});
  float A1_{idx} = (sensorValue_{idx} / 1023.0) * Vs_{idx};   /* analog measurement in volts */
  float R_{idx}  = Rx_{idx} * (Vs_{idx} - A1_{idx}) / A1_{idx};
  float T_{idx}  = (sensorValue_{idx} / 1023.0) * 100.0;       /* temperature, directly read (scaled) */`,
    },
  },
  outputs: {
    DF_robot: {
      "Raw Value": `  percent = sensorValue_{idx};`,
      "Transformed Raw Value": `  /* (X-min)/(max-min)*100 */
  percent = (int)constrain(
    ((float)sensorValue_{idx} - Vwat_{idx}) * 100.0 / (air_val_max_{idx} - Vwat_{idx}),
    0, 100
  );`,
      "Total Available Water (volumetric?)": `  if (sensorValue_{idx} <= Vwat_{idx}) {
    percent = 100;
  } else if (x <= WP_{idx}) {
    percent = 0;
  } else if (x >= FC_{idx}) {
    percent = 100;
  } else {
    x = (x - WP_{idx}) * 100.0 / (FC_{idx} - WP_{idx});
    percent = (int)x;
  }`,
      "Total Available Water": `  if (sensorValue_{idx} <= Vwat_{idx}) {
    percent = 100;
  } else if (x <= WP_{idx}) {
    percent = 0;
  } else if (x >= FC_{idx}) {
    percent = 100;
  } else {
    x = (x - WP_{idx}) * 100.0 / (FC_{idx} - WP_{idx});
    percent = (int)x;
  }`,
      "Rate of Change": `  /* dV/dt = a (good or stop irrigating) */
  static unsigned long lastTime_{idx}  = 0;
  static int            prevValue_{idx} = sensorValue_{idx};
  unsigned long nowTime_{idx} = millis();
  float dt_{idx} = (nowTime_{idx} - lastTime_{idx}) / 1000.0;
  float dVdt_{idx} = (dt_{idx} > 0) ? ((sensorValue_{idx} - prevValue_{idx}) / dt_{idx}) : 0;
  percent = (dVdt_{idx} <= thr_a_{idx}) ? 100 : 0;  /* 100 = good, 0 = stop irrigating */
  prevValue_{idx} = sensorValue_{idx};
  lastTime_{idx}  = nowTime_{idx};`,
      "Wetting Front": `  /* Dual-depth wetting front: shallow = this sensor, deep = partner port */
  int deepValue_{idx} = analogRead({partnerPort});
  static int deepBaseline_{idx} = deepValue_{idx};
  percent = (abs(deepValue_{idx} - deepBaseline_{idx}) > front_thr_{idx}) ? 100 : 0;`,
      "1-2-3 point calibration": `  /* soil_moisture - WP*100/(FC-WP) */
  float soil_moisture_{idx} = (float)(sensorValue_{idx} - thr_a_{idx}) * 100.0 / (thr_b_{idx} - thr_a_{idx});
  percent = (int)(soil_moisture_{idx} - WP_{idx} * 100.0 / (FC_{idx} - WP_{idx}));`,
      "Threshold (very dry/dry/wet)": `  if      (sensorValue_{idx} < thr_a_{idx}) percent = 0;
  else if (sensorValue_{idx} < thr_b_{idx}) percent = 50;
  else                                       percent = 100;`,
    },
    Watermark: {
      "Transformed Raw Value": `  if      (R_{idx} < thr_a_{idx}) percent = 0;
  else if (R_{idx} < thr_b_{idx}) percent = 50;
  else                              percent = 100;`,
      "Raw value (Resistance)": `  percent = (int)R_{idx};  /* resistance in kΩ */`,
    },
    Watermark_Temperature: {
      "Raw value (Temperature)": `  percent = (int)T_{idx};  /* temperature, directly read */`,
      "Transformed Raw Value": `  /* kPa = (-3.213R - 4.093)/(1 - 0.009733R - 0.01205T) */
  float kPa_{idx} = (-3.213f * R_{idx} - 4.093f) / (1.0f - 0.009733f * R_{idx} - 0.01205f * T_{idx});
  percent = (int)kPa_{idx};`,
      Temperature: `  percent = (int)T_{idx};  /* temperature, directly read */`,
      Tension: `  /* kPa = (-3.213R - 4.093)/(1 - 0.009733R - 0.01205T) */
  float kPa_{idx} = (-3.213f * R_{idx} - 4.093f) / (1.0f - 0.009733f * R_{idx} - 0.01205f * T_{idx});
  percent = (int)kPa_{idx};`,
    },
  },
  viz: {
    none: {
      includes: "",
      globals: "",
      setup: "",
      loop: `  /* no visualization for sensor {idx} */`,
    },
    bar: {
      includes: `#include <LiquidCrystal.h>`,
      globals: `LiquidCrystal lcd(8, 9, 4, 5, 6, 7);
const int LCD_NB_ROWS    = 2;
const int LCD_NB_COLUMNS = 16;

byte START_DIV_0_OF_1[8] = { B01111, B11000, B10000, B10000, B10000, B10000, B11000, B01111 };
byte START_DIV_1_OF_1[8] = { B01111, B11000, B10011, B10111, B10111, B10011, B11000, B01111 };
byte DIV_0_OF_2[8]       = { B11111, B00000, B00000, B00000, B00000, B00000, B00000, B11111 };
byte DIV_1_OF_2[8]       = { B11111, B00000, B11000, B11000, B11000, B11000, B00000, B11111 };
byte DIV_2_OF_2[8]       = { B11111, B00000, B11011, B11011, B11011, B11011, B00000, B11111 };
byte END_DIV_0_OF_1[8]   = { B11110, B00011, B00001, B00001, B00001, B00001, B00011, B11110 };
byte END_DIV_1_OF_1[8]   = { B11110, B00011, B11001, B11101, B11101, B11001, B00011, B11110 };

void setup_progressbar() {
  lcd.createChar(0, START_DIV_0_OF_1);
  lcd.createChar(1, START_DIV_1_OF_1);
  lcd.createChar(2, DIV_0_OF_2);
  lcd.createChar(3, DIV_1_OF_2);
  lcd.createChar(4, DIV_2_OF_2);
  lcd.createChar(5, END_DIV_0_OF_1);
  lcd.createChar(6, END_DIV_1_OF_1);
}

void draw_progressbar(byte pct, int analogNum) {
  lcd.setCursor(0, 0);
  lcd.print("A"); lcd.print(analogNum); lcd.print(": ");
  lcd.print(pct); lcd.print(F(" %  "));
  lcd.setCursor(0, 1);
  byte nb_columns = map(pct, 0, 100, 0, LCD_NB_COLUMNS * 2 - 2);
  for (byte i = 0; i < LCD_NB_COLUMNS; ++i) {
    if (i == 0) {
      lcd.write(nb_columns > 0 ? (nb_columns -= 1, 1) : (byte)0);
    } else if (i == LCD_NB_COLUMNS - 1) {
      lcd.write(nb_columns > 0 ? 6 : 5);
    } else {
      if      (nb_columns >= 2) { lcd.write(4); nb_columns -= 2; }
      else if (nb_columns == 1) { lcd.write(3); nb_columns -= 1; }
      else                        lcd.write(2);
    }
  }
}`,
      setup: `  lcd.begin(LCD_NB_COLUMNS, LCD_NB_ROWS);
  setup_progressbar();`,
      loop: `  draw_progressbar((byte)constrain(percent, 0, 100), currentInput - A1 + 1);`,
    },
    raw_lcd: {
      includes: "",
      globals: "",
      setup: "",
      loop: `  lcd.setCursor(0, 0);
  lcd.print("A"); lcd.print(currentInput - A1 + 1); lcd.print(": ");
  lcd.print(sensorValue_{idx}); lcd.print(F("      "));
  lcd.setCursor(0, 1);
  lcd.print(F("                "));`,
    },
    state_lcd: {
      includes: "",
      globals: "",
      setup: "",
      loop: `  lcd.setCursor(0, 0);
  lcd.print("A"); lcd.print(currentInput - A1 + 1); lcd.print(": ");
  if      (percent == 0)  lcd.print(F("VERY DRY    "));
  else if (percent < 50)  lcd.print(F("DRY         "));
  else                    lcd.print(F("WET         "));
  lcd.setCursor(0, 1);
  lcd.print(F("                "));`,
    },
    transformed_lcd: {
      includes: "",
      globals: "",
      setup: "",
      loop: `  lcd.setCursor(0, 0);
  lcd.print("A"); lcd.print(currentInput - A1 + 1); lcd.print(": ");
  lcd.print(percent); lcd.print(F(" %       "));
  lcd.setCursor(0, 1);
  lcd.print(F("                "));`,
    },
    front_lcd: {
      includes: "",
      globals: "",
      setup: "",
      loop: `  lcd.setCursor(0, 0);
  if (percent == 100) lcd.print(F("Front detected  "));
  else                lcd.print(F("No front yet    "));
  lcd.setCursor(0, 1);
  lcd.print(F("                "));`,
    },
    temp_lcd: {
      includes: "",
      globals: "",
      setup: "",
      loop: `  lcd.setCursor(0, 0);
  lcd.print("A"); lcd.print(currentInput - A1 + 1); lcd.print(": ");
  lcd.print(percent); lcd.print(F(" C       "));
  lcd.setCursor(0, 1);
  lcd.print(F("                "));`,
    },
    kpa_lcd: {
      includes: "",
      globals: "",
      setup: "",
      loop: `  lcd.setCursor(0, 0);
  lcd.print("A"); lcd.print(currentInput - A1 + 1); lcd.print(": ");
  lcd.print(percent); lcd.print(F(" kPa     "));
  lcd.setCursor(0, 1);
  lcd.print(F("                "));`,
    },
  },
  buttonNav: {
    globals: `const int buttonPin = A0;
int currentInput    = A1;
const int numInputs = 5;

int readButton() {
  int v = analogRead(buttonPin);
  if (v < 50)   return 0;
  if (v < 250)  return 1;
  if (v < 450)  return 2;
  if (v < 650)  return 3;
  if (v < 850)  return 4;
  return -1;
}

void handleButtonPress() {
  int button = readButton();
  static unsigned long lastPressTime = 0;
  unsigned long currentTime = millis();
  if (currentTime - lastPressTime > 200) {
    if (button == 0) currentInput = (currentInput < A1 + numInputs - 1) ? currentInput + 1 : A1;
    if (button == 3) currentInput = (currentInput > A1) ? currentInput - 1 : A1 + numInputs - 1;
    lastPressTime = currentTime;
  }
}`,
    loopHook: `  handleButtonPress();`,
  },
};

function render(template, vars) {
  if (!template) return "";
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? vars[key] : "0",
  );
}

const SENSOR_ALIASES = {
  "soil moisture capacitive sensor (such as the dfrobot sen0308)": "DF_robot",
  df_robot: "DF_robot",
  "irrometer watermark (200ss)": "Watermark",
  watermark: "Watermark",
  "irrometer watermark (200ss) combined with irrometer soil temperature sensor":
    "Watermark_Temperature",
  watermark_temperature: "Watermark_Temperature",
};

function resolveSensorKey(name) {
  if (!name) return name;
  const alias = SENSOR_ALIASES[name.toLowerCase().trim()];
  return alias || name;
}

const OUTPUT_ALIASES = {
  "raw value (bits)": "Raw Value",
  "raw sensor value (bits)": "Raw Value",
  "raw value (%)": "Transformed Raw Value",
  "raw sensor value (%)": "Transformed Raw Value",
  "volumetric soil moisture": "Total Available Water (volumetric?)",
  "total available water": "Total Available Water",
  "rate of change of soil water status": "Rate of Change",
  "rate of change": "Rate of Change",
  "wetting front": "Wetting Front",
  "1-2-3 point calibration": "1-2-3 point calibration",
  thresholds: "Threshold (very dry/dry/wet)",
  "threshold (very dry/dry/wet)": "Threshold (very dry/dry/wet)",
  "raw value (resistance)": "Raw value (Resistance)",
  "raw value (resistance, in kω)": "Raw value (Resistance)",
  "tension (kpa)": "Tension",
  tension: "Tension",
  "raw value (temperature, in °f)": "Raw value (Temperature)",
  "raw value (temperature, in °c)": "Raw value (Temperature)",
  "raw value (temperature)": "Raw value (Temperature)",
  temperature: "Temperature",
};

function resolveOutputKey(name) {
  if (!name) return name;
  const alias = OUTPUT_ALIASES[name.toLowerCase().trim()];
  return alias || name;
}

function lookupTemplate(map, name) {
  if (!name || !map) return null;
  if (map[name]) return map[name];
  const resolved = resolveOutputKey(name);
  if (map[resolved]) return map[resolved];
  const lower = resolved.toLowerCase().trim();
  for (const [k, v] of Object.entries(map)) {
    if (k.toLowerCase().trim() === lower) return v;
  }
  return null;
}

function buildIno(blocks, surveyAnswers = {}) {
  const now = new Date().toISOString().slice(0, 10);
  const numBlocks = blocks.length;
  const analogBlocks = blocks.filter((b) => b.port.startsWith("A"));
  const usesButton = analogBlocks.length === 1;
  const includes = new Set(["#include <math.h>"]);
  let globals = "",
    setupBody = "",
    constants = "",
    loopBody = "";

  const lcdTpl = TEMPLATES.viz.bar;
  if (lcdTpl.includes) includes.add(lcdTpl.includes);
  if (lcdTpl.globals) globals += lcdTpl.globals + "\n";
  if (lcdTpl.setup) setupBody += lcdTpl.setup + "\n";

  globals += TEMPLATES.buttonNav.globals + "\n";
  loopBody += TEMPLATES.buttonNav.loopHook + "\n\n";

  blocks.forEach((b, i) => {
    const idx = i + 1;
    const readPin = usesButton ? "currentInput" : b.port;
    const vars = {
      idx,
      port: b.port,
      readPin,
      partnerPort: b.partnerPort || "A2",
    };
    b.params.forEach((p) => {
      vars[p.name] =
        p.value !== "" && p.value !== null && p.value !== undefined
          ? p.value
          : "0";
    });

    const sensorKey = resolveSensorKey(b.sensor);
    const sensorTpl = lookupTemplate(TEMPLATES.sensors, sensorKey);
    if (sensorTpl) {
      constants += render(sensorTpl.constants, vars) + "\n";
      loopBody += render(sensorTpl.read, vars) + "\n";
    } else {
      loopBody += `  int sensorValue_${idx} = analogRead(${readPin});\n`;
    }

    const sensorOutputs = lookupTemplate(TEMPLATES.outputs, sensorKey) || {};
    const outputTpl = lookupTemplate(sensorOutputs, b.output);
    loopBody += outputTpl
      ? render(outputTpl, vars) + "\n"
      : `  percent = sensorValue_${idx};\n`;

    if (usesButton) {
      loopBody += `  Serial.print("Analog value (A");\n`;
      loopBody += `  Serial.print(currentInput - A1 + 1);\n`;
      loopBody += `  Serial.print("): ");\n`;
      loopBody += `  Serial.println(sensorValue_${idx});\n`;
    } else {
      loopBody += `  Serial.print("Sensor ${idx} (${b.port}): ");\n`;
      loopBody += `  Serial.println(sensorValue_${idx});\n`;
    }

    const vizTpl = lookupTemplate(TEMPLATES.viz, b.viz) || TEMPLATES.viz.none;
    loopBody += render(vizTpl.loop, vars) + "\n\n";
  });

  const header = blocks
    .map(
      (b, i) =>
        ` *   Sensor ${i + 1}: ${b.sensor} on ${b.port} → ${b.output} [${b.viz}]`,
    )
    .join("\n");

  const surveyLines = SURVEY_QUESTIONS.filter(
    (q) =>
      q.key !== "filename" && q.key !== "ino_comment" && surveyAnswers[q.key],
  )
    .map((q) => ` *   ${q.label.padEnd(24)}: ${surveyAnswers[q.key]}`)
    .join("\n");

  const surveySection = surveyLines
    ? ` * ────────────────────────────────────────────────\n${surveyLines}\n`
    : "";

  const commentSection = surveyAnswers.ino_comment
    ? ` * ────────────────────────────────────────────────\n *  Note: ${surveyAnswers.ino_comment}\n`
    : "";

  return `/*
 * ════════════════════════════════════════════════
 *  NodeFlow On-site Sensing System
 *  Generated : ${now}
 *  Sensors   : ${numBlocks}
${commentSection} * ────────────────────────────────────────────────
${header}
${surveySection} * ════════════════════════════════════════════════
 */

${[...includes].join("\n")}

#define BAUD_RATE 9600

/* Module variables */
int   percent;
float x;

${globals.trimEnd()}

/* Calibration constants */
${constants.trimEnd()}

void setup() {
  Serial.begin(BAUD_RATE);
${setupBody}  Serial.println("Sketch ready.");
}

void loop() {

${loopBody}  delay(1000);
}
`;
}

function initTooltips() {
  const popup = document.createElement("div");
  popup.id = "tooltip-popup";
  popup.style.cssText = `
    position: fixed; z-index: 9999; max-width: 260px; padding: 8px 11px;
    background: #232326; color: #eef2d4; font-size: 12px;
    font-family: system-ui, -apple-system, sans-serif; line-height: 1.5;
    border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.22);
    pointer-events: none; opacity: 0; transition: opacity 0.15s; white-space: normal;
  `;
  document.body.appendChild(popup);

  document.addEventListener("mouseover", (e) => {
    const badge = e.target.closest(".tip-badge");
    if (!badge) return;
    const text = badge.dataset.tip;
    if (!text) return;
    popup.textContent = text;
    popup.style.opacity = "1";
  });

  document.addEventListener("mousemove", (e) => {
    const badge = e.target.closest(".tip-badge");
    if (!badge) {
      popup.style.opacity = "0";
      return;
    }
    const x = e.clientX + 14,
      y = e.clientY + 14;
    const pw = popup.offsetWidth,
      ph = popup.offsetHeight;
    popup.style.left =
      (x + pw > window.innerWidth ? e.clientX - pw - 10 : x) + "px";
    popup.style.top =
      (y + ph > window.innerHeight ? e.clientY - ph - 10 : y) + "px";
  });

  document.addEventListener("mouseout", (e) => {
    if (!e.target.closest(".tip-badge")) popup.style.opacity = "0";
  });
}

function tipBadge(text, id = "") {
  const safe = (text || "").replace(/"/g, "&quot;");
  const idAttr = id ? `id="${id}"` : "";
  return `<span class="tip-badge" ${idAttr} data-tip="${safe}">i</span>`;
}

function setTip(id, text) {
  const el = document.getElementById(id);
  if (el) el.dataset.tip = text || "";
}

let uid = 0;
const nextUid = () => ++uid;

function addBlock() {
  const bid = nextUid();
  const defKey = Object.keys(SENSOR_TYPES)[0];
  const defCfg = SENSOR_TYPES[defKey];
  const usedPorts = [...document.querySelectorAll("[id^='port-sel-']")].map(
    (s) => s.value,
  );
  const freePort = PORTS.find((p) => !usedPorts.includes(p)) || PORTS[0];

  const sensorOpts = Object.entries(SENSOR_TYPES)
    .map(([k, v]) => `<option value="${k}">${v.label}</option>`)
    .join("");
  const outputOpts = defCfg.outputs
    .map((o) => `<option value="${o.value}">${o.display || o.value}</option>`)
    .join("");
  const vizOpts = VIZ_OPTIONS.map(
    (v) => `<option value="${v.value}">${v.label}</option>`,
  ).join("");

  const block = document.createElement("div");
  block.className = "sensor-block";
  block.dataset.bid = bid;

  block.innerHTML = `
    <div class="block-head">
      <span class="block-title"><span class="sensor-num" id="bnum-${bid}"></span> Sensor-Arduino port connection specifications</span>
      <button class="remove-btn" onclick="removeBlock(${bid})">Remove</button>
    </div>
    <div class="block-body">
      <p class="block-intro">
        For each sensor, select the items you want from the lists below.
        Leaving the default values will generate a default code that may not meet your requirements.
      </p>

      <p class="pair-caption">
        The sensor specified below will be plugged into the Arduino board port specified below.
      </p>
      <div class="row2">
        <div class="field">
          <label>Sensor type <span class="req">*</span> ${tipBadge("The sensors that can be used with the NodeFlow On-site Sensing System are listed in our written guidelines.", `stype-tip-${bid}`)}</label>
          <select id="stype-sel-${bid}" required onchange="onSensorChange(${bid})">
            ${sensorOpts}
          </select>
        </div>
        <div class="field">
          <label>Port <span class="req">*</span> ${tipBadge("The letter and number of the port are written on the left side of each port. The ports associated to the Arduino board are shown on the LCD screen.", `port-tip-${bid}`)}</label>
          <select id="port-sel-${bid}" required onchange="checkDuplicatePorts(); updatePortTip(${bid})">
            ${PORTS.map((p) => `<option value="${p}" ${p === freePort ? "selected" : ""}>${p}</option>`).join("")}
          </select>
          <span class="err-msg" id="err-port-${bid}">Required.</span>
        </div>
      </div>

      <div class="section-card">
        <div class="section-head">
          <span class="section-label">For this sensor and this port, I want to see the variable specified below on my screen: <span class="req">*</span> ${tipBadge("The sensor will send out a raw value that can be transformed into other variables that may be easier to understand and read on a regular basis. Please choose how you want to read your data.", `output-tip-${bid}`)}</span>
        </div>
        <div class="section-body">
          <div class="field">
            <select id="output-sel-${bid}" required onchange="updateOutputTip(${bid})">
              ${outputOpts}
            </select>
            <span class="err-msg" id="err-output-${bid}">Required.</span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-head">
          <span class="section-label">For this sensor and this port, I want this variable to appear as: ${tipBadge("You can display your variable in different ways. For example, you may want it to appear as a number, or a percentage, or a progress bar. Please select.", `viz-tip-${bid}`)}</span>
        </div>
        <div class="section-body">
          <div class="field">
            <select id="viz-sel-${bid}" onchange="updateVizTip(${bid})">${vizOpts}</select>
          </div>
        </div>
      </div>

      <div class="section-card" id="partner-card-${bid}" style="display:none">
        <div class="section-head"><span class="section-label">Deep (partner) sensor port <span class="req">*</span></span></div>
        <div class="section-body">
          <div class="wetting-front-msg">
            Wetting front needs two sensors at different depths. This block is the <strong>shallow</strong> sensor.
            Add a second sensor block for the <strong>deep</strong> sensor, then choose its port here.
          </div>
          <div class="field">
            <select id="partner-sel-${bid}" onchange="refreshAllBlocks()"></select>
          </div>
        </div>
      </div>

      <div class="section-card" id="params-card-${bid}">
        <div class="section-head"><span class="section-label">The information listed below is necessary to configure your NodeFlow<sub class="nf-sub">(On-site)</sub>. Please fill in each case to the best of your knowledge. ${tipBadge("In the configuration you specified in the boxes above, we need to know the value of the parameters listed below. Default values are specified but they may not be suitable for your specific situation. Please refer to the guidelines to learn how to measure these values.", `params-tip-${bid}`)}</span></div>
        <div class="section-body"><div id="params-${bid}"></div></div>
      </div>
    </div>
  `;

  document.getElementById("sensors-list").appendChild(block);
  defCfg.params.forEach((p) =>
    addParamRow(
      bid,
      p.name,
      p.display || p.name,
      p.value,
      p.label,
      p.min,
      p.max,
      p.units || "",
    ),
  );
  renumberBlocks();
  updateRemoveBtns();
  checkDuplicatePorts();
  refreshParams(bid);
  refreshViz(bid);
}

function removeBlock(bid) {
  document.querySelector(`.sensor-block[data-bid="${bid}"]`).remove();
  renumberBlocks();
  updateRemoveBtns();
  checkDuplicatePorts();
}

function renumberBlocks() {
  document.querySelectorAll(".sensor-block").forEach((b, i) => {
    const el = b.querySelector(".sensor-num");
    if (el) el.textContent = i + 1;
  });
}

function updateRemoveBtns() {
  const blocks = document.querySelectorAll(".sensor-block");
  blocks.forEach((b) => {
    const btn = b.querySelector(".remove-btn");
    if (btn) btn.disabled = blocks.length === 1;
  });
}

function updatePortTip(bid) {
  setTip(
    `port-tip-${bid}`,
    PORT_TIPS[document.getElementById(`port-sel-${bid}`).value] || "",
  );
}

function updateOutputTip(bid) {
  const val = document.getElementById(`output-sel-${bid}`).value;
  const key = document.getElementById(`stype-sel-${bid}`).value;
  const cfg = SENSOR_TYPES[key];
  const match = cfg?.outputs.find((o) => o.value === val);
  setTip(`output-tip-${bid}`, match?.tip || "");
  refreshParams(bid);
  refreshViz(bid);
}

function refreshViz(bid) {
  const sensorKey = document.getElementById(`stype-sel-${bid}`).value;
  const outputVal = document.getElementById(`output-sel-${bid}`).value;
  const sel = document.getElementById(`viz-sel-${bid}`);
  if (!sel) return;

  const vizMap = OUTPUT_VIZ[sensorKey] || {};
  let allowed = vizMap[outputVal];
  if (!allowed || allowed.length === 0)
    allowed = VIZ_OPTIONS.map((v) => v.value);
  if (!allowed.includes("none")) allowed = ["none", ...allowed];

  const prev = sel.value;
  sel.innerHTML = VIZ_OPTIONS.filter((v) => allowed.includes(v.value))
    .map((v) => `<option value="${v.value}">${v.label}</option>`)
    .join("");
  sel.value = allowed.includes(prev) ? prev : "none";
  updateVizTip(bid);
}

function refreshParams(bid) {
  const sensorKey = document.getElementById(`stype-sel-${bid}`).value;
  const outputVal = document.getElementById(`output-sel-${bid}`).value;
  const cfg = SENSOR_TYPES[sensorKey];
  if (!cfg) return;

  const outputMap = OUTPUT_PARAMS[sensorKey] || {};
  const needed = outputMap[outputVal] ?? cfg.params.map((p) => p.name);

  document.querySelectorAll(`#params-${bid} .param-row`).forEach((row) => {
    const rid = row.dataset.rid;
    const nameEl = document.getElementById(`pname-${rid}`);
    if (!nameEl) return;
    const isLocked = row.dataset.locked === "1";
    const visible = needed.includes(nameEl.value) && !isLocked;
    row.style.display = visible ? "" : "none";
    const valInput = document.getElementById(`pval-${rid}`);
    if (valInput) valInput.required = visible;
  });

  const card = document.getElementById(`params-card-${bid}`);
  if (card) {
    const anyVisible = [
      ...document.querySelectorAll(`#params-${bid} .param-row`),
    ].some((r) => r.style.display !== "none");
    card.style.display = anyVisible ? "" : "none";
  }

  const partnerCard = document.getElementById(`partner-card-${bid}`);
  if (partnerCard) {
    const myPort = document.getElementById(`port-sel-${bid}`).value;
    const isWettingFront = outputVal === "Wetting Front";
    const isDeepPartner = isPortUsedAsDeepPartner(myPort, bid);

    if (isWettingFront && !isDeepPartner) {
      partnerCard.style.display = "";
      partnerCard.querySelector(".wetting-front-msg").innerHTML =
        `Wetting front needs two sensors at different depths. This block is the <strong>shallow</strong> sensor. ` +
        `Add a second sensor block for the <strong>deep</strong> sensor, then choose its port here.`;
      populatePartnerPorts(bid);
    } else if (isWettingFront && isDeepPartner) {
      partnerCard.style.display = "";
      partnerCard.querySelector(".wetting-front-msg").innerHTML =
        `This sensor is already linked as the <strong>deep</strong> partner of another wetting-front block. ` +
        `No partner selection needed here.`;
      const sel = document.getElementById(`partner-sel-${bid}`);
      if (sel) sel.style.display = "none";
    } else {
      partnerCard.style.display = "none";
    }
  }
}

function isPortUsedAsDeepPartner(port, selfBid) {
  if (!port) return false;
  let used = false;
  document.querySelectorAll(".sensor-block").forEach((block) => {
    const bid = block.dataset.bid;
    if (bid === String(selfBid)) return;
    const out = document.getElementById(`output-sel-${bid}`);
    const sel = document.getElementById(`partner-sel-${bid}`);
    if (out && out.value === "Wetting Front" && sel && sel.value === port)
      used = true;
  });
  return used;
}

function populatePartnerPorts(bid) {
  const sel = document.getElementById(`partner-sel-${bid}`);
  if (!sel) return;
  const myPort = document.getElementById(`port-sel-${bid}`).value;
  const others = [...document.querySelectorAll("[id^='port-sel-']")]
    .map((el) => el.value)
    .filter((p) => p !== myPort && /^A[1-5]$/.test(p));
  const current = sel.value;
  if (others.length === 0) {
    sel.innerHTML = `<option value="">— add a second sensor block first —</option>`;
  } else {
    sel.innerHTML = others
      .map(
        (p) =>
          `<option value="${p}" ${p === current ? "selected" : ""}>${p}</option>`,
      )
      .join("");
  }
}

function refreshAllPartnerDropdowns() {
  document.querySelectorAll(".sensor-block").forEach((block) => {
    const bid = block.dataset.bid;
    const out = document.getElementById(`output-sel-${bid}`);
    if (out && out.value === "Wetting Front") populatePartnerPorts(bid);
  });
}

function refreshAllBlocks() {
  document
    .querySelectorAll(".sensor-block")
    .forEach((block) => refreshParams(block.dataset.bid));
}

function updateVizTip(bid) {
  const val = document.getElementById(`viz-sel-${bid}`).value;
  const match = VIZ_OPTIONS.find((v) => v.value === val);
  setTip(`viz-tip-${bid}`, match?.tip || "");
}

function onSensorChange(bid) {
  const key = document.getElementById(`stype-sel-${bid}`).value;
  const cfg = SENSOR_TYPES[key];
  if (!cfg) return;
  setTip(`stype-tip-${bid}`, cfg.tip || "");
  document.getElementById(`output-sel-${bid}`).innerHTML = cfg.outputs
    .map((o) => `<option value="${o.value}">${o.display || o.value}</option>`)
    .join("");
  updateOutputTip(bid);
  const container = document.getElementById(`params-${bid}`);
  container.innerHTML = "";
  cfg.params.forEach((p) =>
    addParamRow(
      bid,
      p.name,
      p.display || p.name,
      p.value,
      p.label,
      p.min,
      p.max,
      p.units || "",
    ),
  );
  refreshParams(bid);
}

function addParamRow(
  bid,
  nameVal = "",
  displayVal = "",
  valueVal = "",
  tooltipText = "",
  minVal = "",
  maxVal = "",
  unitsVal = "",
) {
  const rid = nextUid();
  const container = document.getElementById(`params-${bid}`);
  const row = document.createElement("div");
  row.className = "param-row";
  row.dataset.rid = rid;
  const isLocked =
    minVal !== "" && maxVal !== "" && String(minVal) === String(maxVal);
  row.dataset.locked = isLocked ? "1" : "0";
  const defaultVal =
    valueVal !== "" && valueVal !== null && valueVal !== undefined
      ? valueVal
      : "0";
  const shownName = displayVal || nameVal;
  row.innerHTML = `
    <div class="field">
      <label>Parameter name <span class="req">*</span> ${tooltipText ? tipBadge(tooltipText) : ""}</label>
      <input type="text" id="pname-${rid}" value="${nameVal}" required readonly style="display:none">
      <div class="param-display-name">${shownName}</div>
    </div>
    <div class="field value-unit-field">
      <div class="value-unit-labels">
        <label>Value <span class="req">*</span></label>
        <label class="unit-label">Units <span class="req">*</span></label>
      </div>
      <div class="value-unit-row">
        <input type="number" id="pval-${rid}" value="${defaultVal}" placeholder="0" step="0.001" required
               ${minVal !== "" ? `min="${minVal}"` : ""}
               ${maxVal !== "" ? `max="${maxVal}"` : ""}
               oninput="
                 const mn = this.min !== '' ? parseFloat(this.min) : -Infinity;
                 const mx = this.max !== '' ? parseFloat(this.max) : Infinity;
                 if (this.value !== '' && !isNaN(parseFloat(this.value))) {
                   if (parseFloat(this.value) < mn) this.value = mn;
                   if (parseFloat(this.value) > mx) this.value = mx;
                 }
                 const dot = this.value.indexOf('.');
                 if (dot !== -1 && this.value.length - dot - 1 > 3) this.value = this.value.slice(0, dot + 4);
               ">
        ${unitsVal ? '<div class="unit-box">' + unitsVal + "</div>" : ""}
      </div>
    </div>
  `;
  container.appendChild(row);
  updateParamRemoveBtns(bid);
}

function removeParamRow(bid, rid) {
  const container = document.getElementById(`params-${bid}`);
  if (container.querySelectorAll(".param-row").length <= 1) return;
  container.querySelector(`.param-row[data-rid="${rid}"]`)?.remove();
  updateParamRemoveBtns(bid);
}

function updateParamRemoveBtns(bid) {
  const rows = document.querySelectorAll(`#params-${bid} .param-row`);
  rows.forEach((r) => {
    const btn = r.querySelector(".rem-param-btn");
    if (btn) btn.disabled = rows.length === 1;
  });
}

function checkDuplicatePorts() {
  refreshAllPartnerDropdowns();
  const portMap = {};
  const ports = [];
  document.querySelectorAll("[id^='port-sel-']").forEach((el) => {
    portMap[el.value] = (portMap[el.value] || 0) + 1;
    ports.push(el.value);
  });
  const dupes = Object.entries(portMap)
    .filter(([, c]) => c > 1)
    .map(([p]) => p);
  const analogCount = ports.filter((p) => /^A[1-5]$/.test(p)).length;
  const messages = [];
  if (dupes.length)
    messages.push(
      `Port${dupes.length > 1 ? "s" : ""} ${dupes.join(", ")} used in more than one block. Each port must be unique.`,
    );
  if (analogCount >= 5)
    messages.push(
      `All 5 analog ports (A1–A5) are in use. To add more sensors, use a digital port (D1–D14).`,
    );
  const warn = document.getElementById("port-warning");
  if (messages.length) {
    warn.innerHTML = messages.map((m) => `⚠ ${m}`).join("<br>");
    warn.classList.add("show");
  } else warn.classList.remove("show");
}

function validate() {
  const portMap = {};
  document.querySelectorAll("[id^='port-sel-']").forEach((el) => {
    portMap[el.value] = (portMap[el.value] || []).concat(el.id);
  });
  if (Object.values(portMap).some((ids) => ids.length > 1)) {
    alert("Duplicate ports detected. Each block must use a unique port.");
    return false;
  }
  let valid = true;
  document.querySelectorAll("input[required]").forEach((el) => {
    if (el.style.display === "none") return;
    if (el.offsetParent === null) return;
    const empty = !el.value || el.value.trim() === "";
    el.classList.toggle("error", empty);
    if (empty) valid = false;
  });
  return valid;
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

let _pendingBlocks = [];
let _pendingFilename = "";

const SAVED_KEY = "nodeflow_survey_v1";
const FILES_KEY = "nodeflow_files_v1";
let _savedAnswers = null;
let _savedFiles = {};

function loadSavedFiles() {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    _savedFiles = raw ? JSON.parse(raw) : {};
  } catch (_) {
    _savedFiles = {};
  }
}

function saveFile(filename, blocks) {
  try {
    _savedFiles[filename] = { blocks, timestamp: new Date().toISOString() };
    localStorage.setItem(FILES_KEY, JSON.stringify(_savedFiles));
  } catch (_) {}
}

function deleteSavedFile(filename) {
  delete _savedFiles[filename];
  try {
    localStorage.setItem(FILES_KEY, JSON.stringify(_savedFiles));
  } catch (_) {}
}

function loadSavedAnswers() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    _savedAnswers = raw ? JSON.parse(raw) : null;
  } catch (_) {
    _savedAnswers = null;
  }
  renderSavedBanner();
}

function saveAnswers(answers) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(answers));
    _savedAnswers = answers;
    renderSavedBanner();
  } catch (_) {}
}

function clearSavedAnswers() {
  try {
    localStorage.removeItem(SAVED_KEY);
  } catch (_) {}
  _savedAnswers = null;
  renderSavedBanner();
}

function renderSavedBanner() {
  const banner = document.getElementById("saved-banner");
  if (!banner) return;
  if (_savedAnswers && _savedAnswers.name) {
    banner.innerHTML = `Welcome back, <strong>${_savedAnswers.name}</strong>. Your info is saved.
      <a href="#" onclick="editSavedAnswers(); return false;">Edit my info</a> ·
      <a href="#" onclick="clearSavedAnswers(); return false;">Clear</a>`;
    banner.classList.add("show");
  } else {
    banner.classList.remove("show");
  }
}

function editSavedAnswers() {
  openSurvey(_savedAnswers);
}

function handleGenerate() {
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));
  if (!validate()) return;

  _pendingBlocks = [];
  document.querySelectorAll(".sensor-block").forEach((block) => {
    const bid = block.dataset.bid;
    const sensorKey = document.getElementById(`stype-sel-${bid}`).value;
    const outputVal = document.getElementById(`output-sel-${bid}`).value;
    const outputMap = OUTPUT_PARAMS[sensorKey] || {};
    const cfg = SENSOR_TYPES[sensorKey];
    const needed =
      outputMap[outputVal] ?? (cfg ? cfg.params.map((p) => p.name) : []);
    const params = [];
    document.querySelectorAll(`#params-${bid} .param-row`).forEach((row) => {
      const rid = row.dataset.rid;
      const pname = document.getElementById(`pname-${rid}`)?.value || "";
      if (!needed.includes(pname)) return;
      params.push({
        name: pname,
        value: document.getElementById(`pval-${rid}`)?.value || "",
      });
    });
    const partnerSel = document.getElementById(`partner-sel-${bid}`);
    _pendingBlocks.push({
      port: document.getElementById(`port-sel-${bid}`).value,
      sensor: document.getElementById(`stype-sel-${bid}`).value,
      output: document.getElementById(`output-sel-${bid}`).value,
      viz: document.getElementById(`viz-sel-${bid}`).value,
      partnerPort: partnerSel ? partnerSel.value : "",
      params,
    });
  });

  const deepPorts = _pendingBlocks
    .filter((b) => b.output === "Wetting Front" && b.partnerPort)
    .map((b) => b.partnerPort);
  for (const b of _pendingBlocks) {
    if (
      b.output === "Wetting Front" &&
      !b.partnerPort &&
      !deepPorts.includes(b.port)
    ) {
      alert(
        "A Wetting Front sensor needs a second (deep) sensor block. Add another block and select its port as the deep partner.",
      );
      return;
    }
  }

  _pendingFilename =
    _pendingBlocks.length === 1
      ? `sensor_${_pendingBlocks[0].port}.ino`
      : `sensors_${_pendingBlocks.map((b) => b.port).join("_")}.ino`;

  if (_savedAnswers && _savedAnswers.name && _savedAnswers.email) {
    openFilenamePrompt();
  } else {
    openSurvey();
  }
}

function openSurvey(prefill = {}) {
  const overlay = document.getElementById("survey-overlay");
  const body = document.getElementById("survey-body");
  body.innerHTML = SURVEY_QUESTIONS.map((q) => {
    const req = q.required ? `<span class="req">*</span>` : "";
    const val = prefill[q.key] || "";
    return `
      <div class="field survey-field">
        <label>${q.label} ${req}</label>
        <input type="${q.type}" id="sq-${q.key}" placeholder="${q.placeholder || ""}"
               value="${val.replace(/"/g, "&quot;")}" ${q.required ? "required" : ""}>
        <span class="err-msg" id="sqerr-${q.key}">Required.</span>
      </div>`;
  }).join("");
  overlay.classList.add("show");
  const cb = document.getElementById("consent-checkbox");
  const btn = document.getElementById("confirm-btn");
  if (cb) cb.checked = false;
  if (btn) btn.disabled = true;
}

function openFilenamePrompt() {
  const overlay = document.getElementById("survey-overlay");
  const body = document.getElementById("survey-body");
  const fileNames = Object.keys(_savedFiles).sort();
  const hasFiles = fileNames.length > 0;

  const fileList = hasFiles
    ? `
    <div class="filename-section">
      <div class="filename-section-head">
        <strong>Option 1 — Reuse a previous filename</strong>
        <span class="filename-section-help">Click a file to auto-fill the name below. Re-downloading replaces your old file.</span>
      </div>
      <div class="saved-file-list">
        ${fileNames
          .map((fn) => {
            const ts = new Date(_savedFiles[fn].timestamp).toLocaleString();
            return `
          <div class="saved-file-row">
            <button type="button" class="saved-file-btn" onclick="selectSavedFilename('${fn.replace(/'/g, "\\'")}')">
              <span class="saved-file-name">${fn}</span>
              <span class="saved-file-meta">
                <span class="saved-file-ts">Last used: ${ts}</span>
                <span class="saved-file-action">Click to use →</span>
              </span>
            </button>
            <button type="button" class="saved-file-del" onclick="removeSavedFile('${fn.replace(/'/g, "\\'")}'); return false;" title="Forget this filename">✕</button>
          </div>`;
          })
          .join("")}
      </div>
    </div>
    <div class="saved-file-divider"><span>OR</span></div>
    <div class="filename-section">
      <div class="filename-section-head">
        <strong>Option 2 — Make a new file</strong>
        <span class="filename-section-help">Type a new name to create a separate file.</span>
      </div>
    </div>`
    : "";

  body.innerHTML = `
    ${fileList}
    <div class="field survey-field">
      <label>${hasFiles ? "Name of file to generate (new or selected from above)" : "Name of file to generate"} <span class="req">*</span></label>
      <input type="text" id="sq-filename" placeholder="e.g. apples_field2 (no spaces, no .ino)" required>
      <span class="err-msg" id="sqerr-filename">Required.</span>
    </div>
    <div class="field survey-field">
      <label>Comment to include in the code (optional)</label>
      <input type="text" id="sq-ino_comment" placeholder="e.g. Orchard block 2, installed June 2026">
    </div>
    <p class="saved-info-note">
      Submitting as <strong>${_savedAnswers.name}</strong> (${_savedAnswers.email}).
      <a href="#" onclick="closeSurvey(); editSavedAnswers(); return false;">Not you?</a>
    </p>`;

  overlay.classList.add("show");
  const cb = document.getElementById("consent-checkbox");
  const btn = document.getElementById("confirm-btn");
  if (cb) cb.checked = true;
  if (btn) btn.disabled = false;
}

function selectSavedFilename(fn) {
  const input = document.getElementById("sq-filename");
  if (input) {
    input.value = fn;
    input.focus();
  }
}

function removeSavedFile(fn) {
  if (
    !confirm(
      `Delete saved configuration "${fn}"? This only removes it from your browser.`,
    )
  )
    return;
  deleteSavedFile(fn);
  openFilenamePrompt();
}

function closeSurvey() {
  document.getElementById("survey-overlay").classList.remove("show");
}

function confirmSurvey() {
  let valid = true;
  SURVEY_QUESTIONS.forEach((q) => {
    if (!q.required) return;
    const el = document.getElementById(`sq-${q.key}`);
    if (!el) return;
    const err = document.getElementById(`sqerr-${q.key}`);
    const empty = !el.value || el.value.trim() === "";
    el.classList.toggle("error", empty);
    if (err) err.classList.toggle("show", empty);
    if (empty) valid = false;
  });
  if (!valid) return;

  const answers = {};
  SURVEY_QUESTIONS.forEach((q) => {
    const el = document.getElementById(`sq-${q.key}`);
    if (el) {
      answers[q.key] = el.value.trim();
    } else if (_savedAnswers && _savedAnswers[q.key]) {
      answers[q.key] = _savedAnswers[q.key];
    } else {
      answers[q.key] = "";
    }
  });

  const toSave = { ...answers };
  delete toSave.filename;
  delete toSave.ino_comment;
  saveAnswers(toSave);
  closeSurvey();

  const code = buildIno(_pendingBlocks, answers);
  const rawName = (answers.filename || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/\.ino$/i, "");
  const filename = rawName ? rawName + ".ino" : _pendingFilename;
  downloadFile(code, filename);
  saveFile(filename, _pendingBlocks);

  document.getElementById("preview-code").textContent = code;
  document.getElementById("preview-wrap").classList.add("show");
  const sf = document.getElementById("success-filename");
  if (sf) sf.textContent = filename;
  document.getElementById("success-banner").classList.add("show");

  try {
    const variables = _pendingBlocks
      .map((b, i) => {
        const paramStr = b.params
          .map((p) => `${p.name}: ${p.value}`)
          .join(", ");
        return `Sensor ${i + 1}: Type: ${b.sensor} | Port: ${b.port} | Output: ${b.output} | Viz: ${b.viz} | Params: ${paramStr}`;
      })
      .join(" || ");

    const payload = {
      timestamp: new Date().toISOString(),
      name: answers.name || "",
      email: answers.email || "",
      country: answers.country || "",
      filename: answers.filename || "",
      ino_comment: answers.ino_comment || "",
      variables,
    };

    fetch(
      "https://script.google.com/macros/s/AKfycbzBDJalu2LdNU2UC-ySZJlxW5dh_3Djhq73sBU4JycPbOGjfBLdSuepAJs9jiIKUH1uUw/exec",
      {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      },
    ).catch(() => {});
  } catch (_) {}
}

function copyPreview() {
  const code = document.getElementById("preview-code").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
}

const INFO_KEY = "nodeflow_info_open_v1";

function toggleInfoBox() {
  const body = document.getElementById("info-box-body");
  const chevron = document.getElementById("info-box-chevron");
  const btn = document.querySelector(".info-box-title");
  if (!body) return;

  const isOpen = !body.classList.contains("collapsed");
  body.classList.toggle("collapsed", isOpen);
  if (chevron) chevron.innerHTML = isOpen ? "&#9656;" : "&#9662;";
  if (btn) btn.setAttribute("aria-expanded", String(!isOpen));

  try {
    localStorage.setItem(INFO_KEY, isOpen ? "closed" : "open");
  } catch (_) {}
}

function restoreInfoBoxState() {
  let state = "open";
  try {
    state = localStorage.getItem(INFO_KEY) || "open";
  } catch (_) {}
  if (state === "closed") {
    const body = document.getElementById("info-box-body");
    const chevron = document.getElementById("info-box-chevron");
    const btn = document.querySelector(".info-box-title");
    if (body) body.classList.add("collapsed");
    if (chevron) chevron.innerHTML = "&#9656;";
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
}

initTooltips();
addBlock();
loadSavedAnswers();
loadSavedFiles();
restoreInfoBoxState();
