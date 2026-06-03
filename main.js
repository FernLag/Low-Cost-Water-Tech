const SENSOR_TYPES = {
  DF_robot: {
    label: "DF_robot",
    tip: "Direct sensor reading",
    outputs: [
      { value: "Raw value", tip: "Direct sensor reading" },
      { value: "Transformed Raw Value", tip: "Mapped to 0-100 scale" },
      { value: "TAW", tip: "Total Available Water" },
      { value: "Rate of change", tip: "Change between readings" },
      { value: "Wetting front", tip: "" },
      { value: "1-2-3 point calibration", tip: "" },
      {
        value: "Threshold (very dry/dry/wet)",
        tip: "Three-state classification",
      },
    ],
    params: [
      {
        name: "air_val",
        display: "Air value",
        label: "Air value: raw reading in open air",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "water_val",
        display: "Water value",
        label: "Water value: raw reading submerged in water",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "fc",
        display: "Field Capacity",
        label:
          "Field capacity: The amount of water that remains in the soil after all the excess water at saturation has been drained.",
        value: "0",
        min: "0",
        max: "1023",
        units: "%vol",
      },
      {
        name: "wp",
        display: "Wilting point",
        label:
          "Wilting point: When plants take up all the available water for a given soil and it dries out to the point where it cannot supply any water to keep plants from dying",
        value: "0",
        min: "0",
        max: "1023",
        units: "%vol",
      },
      {
        name: "k",
        display: "k",
        label:
          "k: calibration scaling factor and it is determined by searching for an optimal match between the gravimetric and simulated soil moisture and minimisation of error.",
        value: "0",
        min: "0",
        max: "1023",
        units: "m³/m³",
      },
    ],
  },
  Watermark: {
    label: "Watermark",
    tip: "Watermark soil moisture sensor",
    outputs: [
      { value: "Raw value", tip: "Direct ADC reading" },
      { value: "Transformed Raw Value", tip: "Mapped to 0-100 scale" },
    ],
    params: [
      {
        name: "air_val",
        display: "Air value",
        label: "Air value: raw reading in open air",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
      {
        name: "water_val",
        display: "Water value",
        label: "Water value: raw reading submerged in water",
        value: "0",
        min: "0",
        max: "1023",
        units: "ADC",
      },
    ],
  },
  Watermark_Temperature: {
    label: "Watermark_Temperature",
    tip: "Watermark with temperature compensation",
    outputs: [
      { value: "Raw value", tip: "Direct ADC reading" },
      { value: "Temperature", tip: "Temperature reading (TODO)" },
      { value: "Tension", tip: "Soil tension (TODO)" },
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
];

const SURVEY_QUESTIONS = [
  {
    key: "filename",
    label: "File name",
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
    key: "notes",
    label: "Additional notes",
    type: "text",
    required: false,
    placeholder: "Optional...",
  },
];

const TEMPLATES = {
  sensors: {
    DF_robot: {
      constants: `/* Sensor {idx}: DF_robot on port {port} */
const int   Vwat_{idx} = {water_val};         /* sensor value in water */
const float b_{idx}    = log({air_val} - {water_val});  /* b = ln(Vair - Vwat) */
const float a_{idx}    = -1.0 / {k};          /* a = -1/k */
float WP_{idx}         = {wp};                 /* wilting point (%vol) */
float FC_{idx}         = {fc};                 /* field capacity (%vol) */
`,
      read: `  int sensorValue_{idx} = analogRead({readPin});
  x = a_{idx} * (log(sensorValue_{idx} - Vwat_{idx}) - b_{idx});`,
    },

    Watermark: {
      constants: `/* Sensor {idx}: Watermark on port {port} */
const int Vair_{idx} = {air_val};            /* sensor value in air */
const int Vwat_{idx} = {water_val};          /* sensor value in water */
`,
      read: `  int sensorValue_{idx} = analogRead({readPin});`,
    },

    Watermark_Temperature: {
      constants: `/* Sensor {idx}: Watermark_Temperature on port {port} */
`,
      read: `  int sensorValue_{idx} = analogRead({readPin});`,
    },
  },

  outputs: {
    "Raw value": `  percent = sensorValue_{idx};`,

    "Transformed Raw Value": `  percent = (int)constrain((sensorValue_{idx} - Vwat_{idx}) * 100.0 / (Vair_{idx} - Vwat_{idx}), 0, 100);`,

    TAW: `  if (sensorValue_{idx} <= Vwat_{idx}) {
    percent = 100;
  } else if (x <= WP_{idx}) {
    percent = 0;
  } else if (x >= FC_{idx}) {
    percent = 100;
  } else {
    percent = (int)((x - WP_{idx}) * 100.0 / (FC_{idx} - WP_{idx}));
  }`,

    "Threshold (very dry/dry/wet)": `  if (sensorValue_{idx} <= Vwat_{idx}) {
    percent = 100;
  } else if (x <= WP_{idx}) {
    percent = 0;
  } else if (x >= FC_{idx}) {
    percent = 100;
  } else {
    percent = (int)((x - WP_{idx}) * 100.0 / (FC_{idx} - WP_{idx}));
  }`,

    "Rate of change": `  static int prev_{idx} = 0;
  percent = sensorValue_{idx} - prev_{idx};
  prev_{idx} = sensorValue_{idx};`,

    "Wetting front": `  percent = sensorValue_{idx};  /* TODO: implement wetting front detection */`,

    "1-2-3 point calibration": `  percent = sensorValue_{idx};  /* TODO: implement 1-2-3 point calibration */`,

    Temperature: `  percent = sensorValue_{idx};  /* TODO: convert ADC to temperature */`,

    Tension: `  percent = sensorValue_{idx};  /* TODO: convert ADC to soil tension */`,
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

/* Progress bar custom characters */
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
  },

  buttonNav: {
    globals: `const int buttonPin = A0;
int currentInput    = A1;
const int numInputs = 5;  /* A1 to A5 */

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

function lookupTemplate(map, name) {
  if (!name || !map) return null;
  if (map[name]) return map[name];
  const lower = name.toLowerCase().trim();
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
  let globals = "";
  let setupBody = "";
  let constants = "";
  let loopBody = "";

  const lcdTpl = TEMPLATES.viz.bar;
  if (lcdTpl.includes) includes.add(lcdTpl.includes);
  if (lcdTpl.globals) globals += lcdTpl.globals + "\n";
  if (lcdTpl.setup) setupBody += lcdTpl.setup + "\n";

  globals += TEMPLATES.buttonNav.globals + "\n";
  loopBody += TEMPLATES.buttonNav.loopHook + "\n\n";

  blocks.forEach((b, i) => {
    const idx = i + 1;
    const readPin = usesButton ? "currentInput" : b.port;

    const vars = { idx, port: b.port, readPin };
    b.params.forEach((p) => {
      vars[p.name] =
        p.value !== "" && p.value !== null && p.value !== undefined
          ? p.value
          : "0";
    });

    const sensorTpl = lookupTemplate(TEMPLATES.sensors, b.sensor);
    if (sensorTpl) {
      constants += render(sensorTpl.constants, vars) + "\n";
      loopBody += render(sensorTpl.read, vars) + "\n";
    } else {
      loopBody += `  int sensorValue_${idx} = analogRead(${readPin});\n`;
    }

    const outputTpl = lookupTemplate(TEMPLATES.outputs, b.output);
    if (outputTpl) {
      loopBody += render(outputTpl, vars) + "\n";
    } else {
      loopBody += `  percent = sensorValue_${idx};\n`;
    }

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
    (q) => q.key !== "filename" && surveyAnswers[q.key],
  )
    .map((q) => ` *   ${q.label.padEnd(24)}: ${surveyAnswers[q.key]}`)
    .join("\n");

  const surveySection = surveyLines
    ? ` * ────────────────────────────────────────────────\n${surveyLines}\n`
    : "";

  const includeBlock = [...includes].join("\n");

  return `/*
 * ════════════════════════════════════════════════
 *  Pillowtech Code Generator
 *  Generated : ${now}
 *  Sensors   : ${numBlocks}
 * ────────────────────────────────────────────────
${header}
${surveySection} * ════════════════════════════════════════════════
 */

${includeBlock}

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
    background: #1a2a08; color: #e8f0d0; font-size: 12px;
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
    .map((o) => `<option value="${o.value}">${o.value}</option>`)
    .join("");
  const vizOpts = VIZ_OPTIONS.map(
    (v) => `<option value="${v.value}">${v.label}</option>`,
  ).join("");

  const block = document.createElement("div");
  block.className = "sensor-block";
  block.dataset.bid = bid;

  block.innerHTML = `
    <div class="block-head">
      <span class="block-title">
        <span class="sensor-num" id="bnum-${bid}"></span>
        Sensor block
      </span>
      <button class="remove-btn" onclick="removeBlock(${bid})">Remove block</button>
    </div>
    <div class="block-body">
      <div class="row2">
        <div class="field">
          <label>Port <span class="req">*</span> ${tipBadge(PORT_TIPS[freePort] || "", `port-tip-${bid}`)}</label>
          <select id="port-sel-${bid}" required onchange="checkDuplicatePorts(); updatePortTip(${bid})">
            ${PORTS.map((p) => `<option value="${p}" ${p === freePort ? "selected" : ""}>${p}</option>`).join("")}
          </select>
          <span class="err-msg" id="err-port-${bid}">Required.</span>
        </div>
        <div class="field">
          <label>Sensor type <span class="req">*</span> ${tipBadge(defCfg.tip || "", `stype-tip-${bid}`)}</label>
          <select id="stype-sel-${bid}" required onchange="onSensorChange(${bid})">
            ${sensorOpts}
          </select>
        </div>
      </div>

      <div class="section-card">
        <div class="section-head">
          <span class="section-label">
            Output <span class="req">*</span>
            ${tipBadge(defCfg.outputs[0]?.tip || "", `output-tip-${bid}`)}
          </span>
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
          <span class="section-label">
            Visualization ${tipBadge(VIZ_OPTIONS[0]?.tip || "", `viz-tip-${bid}`)}
          </span>
        </div>
        <div class="section-body">
          <div class="field">
            <select id="viz-sel-${bid}" onchange="updateVizTip(${bid})">
              ${vizOpts}
            </select>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-head"><span class="section-label">Parameters</span></div>
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
  const cfg = SENSOR_TYPES[document.getElementById(`stype-sel-${bid}`).value];
  const match = cfg?.outputs.find((o) => o.value === val);
  setTip(`output-tip-${bid}`, match?.tip || "");
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
    .map((o) => `<option value="${o.value}">${o.value}</option>`)
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
  const defaultVal =
    valueVal !== "" && valueVal !== null && valueVal !== undefined
      ? valueVal
      : "0";
  const shownName = displayVal || nameVal;
  row.innerHTML = `
    <div class="field">
      <label>Parameter name <span class="req">*</span> ${tooltipText ? tipBadge(tooltipText) : ""}</label>
      <input type="text" id="pname-${rid}" value="${nameVal}" placeholder="parameter name" required readonly style="display:none">
      <div class="param-display-name">${shownName}</div>
    </div>
    <div class="field value-unit-field">
      <div class="value-unit-labels">
        <label>Value <span class="req">*</span></label>
        <label class="unit-label">Units <span class="req">*</span></label>
      </div>
      <div class="value-unit-row">
        <input type="number" id="pval-${rid}" value="${defaultVal}"
               placeholder="0" step="0.001" required
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
                 if (dot !== -1 && this.value.length - dot - 1 > 3) {
                   this.value = this.value.slice(0, dot + 4);
                 }
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
  if (dupes.length) {
    messages.push(
      `Port${dupes.length > 1 ? "s" : ""} ${dupes.join(", ")} used in more than one block. Each port must be unique.`,
    );
  }
  if (analogCount >= 5) {
    messages.push(
      `All 5 analog ports (A1–A5) are in use. To add more sensors, use a digital port (D1–D14). The Arduino only has 5 analog input pins available for sensors.`,
    );
  }

  const warn = document.getElementById("port-warning");
  if (messages.length) {
    warn.innerHTML = messages.map((m) => `⚠ ${m}`).join("<br>");
    warn.classList.add("show");
  } else {
    warn.classList.remove("show");
  }
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

const SAVED_KEY = "pillowtech_survey_v1";
const FILES_KEY = "pillowtech_files_v1";
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
    _savedFiles[filename] = {
      blocks,
      timestamp: new Date().toISOString(),
    };
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
    const params = [];
    document.querySelectorAll(`#params-${bid} .param-row`).forEach((row) => {
      const rid = row.dataset.rid;
      params.push({
        name: document.getElementById(`pname-${rid}`)?.value || "",
        value: document.getElementById(`pval-${rid}`)?.value || "",
      });
    });
    _pendingBlocks.push({
      port: document.getElementById(`port-sel-${bid}`).value,
      sensor: document.getElementById(`stype-sel-${bid}`).value,
      output: document.getElementById(`output-sel-${bid}`).value,
      viz: document.getElementById(`viz-sel-${bid}`).value,
      params,
    });
  });

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
    if (q.type === "select") {
      return `
        <div class="field survey-field">
          <label>${q.label} ${req}</label>
          <select id="sq-${q.key}" ${q.required ? "required" : ""}>
            <option value="">— select —</option>
            ${q.options.map((o) => `<option value="${o}" ${o === val ? "selected" : ""}>${o}</option>`).join("")}
          </select>
          <span class="err-msg" id="sqerr-${q.key}">Required.</span>
        </div>`;
    }
    return `
      <div class="field survey-field">
        <label>${q.label} ${req}</label>
        <input type="${q.type}" id="sq-${q.key}"
               placeholder="${q.placeholder || ""}"
               value="${val.replace(/"/g, "&quot;")}"
               ${q.required ? "required" : ""}>
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
            <span class="filename-section-help">Click a file below to fill in its name automatically. Your old file on your computer will be replaced when you re-download.</span>
          </div>
          <div class="saved-file-list">
            ${fileNames
              .map((fn) => {
                const ts = new Date(_savedFiles[fn].timestamp).toLocaleString();
                return `
                <div class="saved-file-row">
                  <button type="button" class="saved-file-btn"
                          onclick="selectSavedFilename('${fn.replace(/'/g, "\\'")}')">
                    <span class="saved-file-name">${fn}</span>
                    <span class="saved-file-meta">
                      <span class="saved-file-ts">Last used: ${ts}</span>
                      <span class="saved-file-action">Click to use →</span>
                    </span>
                  </button>
                  <button type="button" class="saved-file-del"
                          onclick="removeSavedFile('${fn.replace(/'/g, "\\'")}'); return false;"
                          title="Forget this filename">✕</button>
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
        </div>
      `
    : "";

  body.innerHTML = `
    ${fileList}
    <div class="field survey-field">
      <label>${hasFiles ? "File name (new or selected from above)" : "File name"} <span class="req">*</span></label>
      <input type="text" id="sq-filename"
             placeholder="e.g. apples_field2 (no spaces, no .ino)" required>
      <span class="err-msg" id="sqerr-filename">Required.</span>
    </div>
    <p class="saved-info-note">
      Submitting as <strong>${_savedAnswers.name}</strong> (${_savedAnswers.email}).
      <a href="#" onclick="closeSurvey(); editSavedAnswers(); return false;">Not you?</a>
    </p>
  `;

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
      `Delete saved configuration "${fn}"? This only removes it from your browser, not from your downloaded files.`,
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
  document.getElementById("success-filename").textContent = filename;
  document.getElementById("success-banner").classList.add("show");

  try {
    const variables = _pendingBlocks
      .map((b, i) => {
        const paramStr = b.params
          .map((p) => `${p.name}: ${p.value}`)
          .join(", ");
        return `Sensor ${i + 1} : Type: ${b.sensor} | Port: ${b.port} | Output: ${b.output} | Viz: ${b.viz} | Params: ${paramStr}`;
      })
      .join(" || ");

    const payload = {
      timestamp: new Date().toISOString(),
      name: answers.name || "",
      email: answers.email || "",
      country: answers.country || "",
      notes: answers.notes || "",
      filename: answers.filename || "",
      variables,
    };

    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbzBDJalu2LdNU2UC-ySZJlxW5dh_3Djhq73sBU4JycPbOGjfBLdSuepAJs9jiIKUH1uUw/exec";
    fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload),
    }).catch(() => {});
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

initTooltips();
addBlock();
loadSavedAnswers();
loadSavedFiles();
