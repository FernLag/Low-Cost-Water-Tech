const SENSOR_TYPES = {
  DF_robot: {
    label: "DF_robot",
    tip: "Direct ADC reading 0-1023",
    outputs: [
      {
        value: "Raw value",
        tip: "Direct ADC reading 0-1023",
      },
      {
        value: "Transformed Raw Value",
        tip: "",
      },
      {
        value: "TAW",
        tip: "",
      },
      {
        value: "Rate of change",
        tip: "",
      },
      {
        value: "Wetting front",
        tip: "",
      },
      {
        value: "1-2-3 point calibration",
        tip: "",
      },
      {
        value: "Threshold (very dry/dry/wet)",
        tip: "",
      },
    ],
    params: [
      {
        name: "air_val",
        display: "Air value",
        label: "Air value — raw ADC reading in open air",
        value: "0",
        min: "0",
        max: "1023",
      },
      {
        name: "water_val",
        display: "Water value",
        label: "Water value — raw ADC reading submerged in water",
        value: "0",
        min: "0",
        max: "1023",
      },
      {
        name: "fc",
        display: "Field Capacity",
        label: "Field capacity — volumetric water content at FC",
        value: "0",
        min: "0",
        max: "100",
      },
      {
        name: "wp",
        display: "Wilting point",
        label: "Wilting point — volumetric water content at WP",
        value: "0",
        min: "0",
        max: "100",
      },
      {
        name: "k",
        display: "k",
        label: "k — calibration scaling factor",
        value: "0",
        min: "0",
        max: "100",
      },
    ],
  },
  Watermark: {
    label: "Watermark",
    tip: "",
    outputs: [
      {
        value: "Transformed Raw value",
        tip: "",
      },
      {
        value: "Raw value",
        tip: "na",
      },
      {
        value: "Transformed raw value",
        tip: "",
      },
      {
        value: "Raw values",
        tip: "",
      },
    ],
    params: [
      {
        name: "air_val",
        display: "Air value",
        label: "Air value — raw ADC reading in open air",
        value: "0",
        min: "0",
        max: "100",
      },
      {
        name: "water_val",
        display: "Water value",
        label: "Water value — raw ADC reading submerged in water",
        value: "0",
        min: "0",
        max: "100",
      },
    ],
  },
  Watermark_Temperature: {
    label: "Watermark_Temperature",
    tip: "",
    outputs: [
      {
        value: "Transformed raw value",
        tip: "",
      },
      {
        value: "Temperature",
        tip: "",
      },
      {
        value: "Tension",
        tip: "",
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
  {
    value: "none",
    label: "No visualization",
    tip: "No Serial output.",
  },
  {
    value: "bar",
    label: "Loading bar",
    tip: "",
  },
  {
    value: "raw",
    label: "Raw value",
    tip: "",
  },
  {
    value: "state",
    label: "State: very dry / dry / wet",
    tip: "",
  },
  {
    value: "transformed",
    label: "Transformed Raw Value 0-100",
    tip: "",
  },
  {
    value: "rate",
    label: "Rate of change (future)",
    tip: "",
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

function initTooltips() {
  const popup = document.createElement("div");
  popup.id = "tooltip-popup";
  popup.style.cssText = `
    position: fixed;
    z-index: 9999;
    max-width: 260px;
    padding: 8px 11px;
    background: #1a2a08;
    color: #e8f0d0;
    font-size: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.22);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    white-space: normal;
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
    const x = e.clientX + 14;
    const y = e.clientY + 14;
    const pw = popup.offsetWidth;
    const ph = popup.offsetHeight;
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
          <label>
            Port <span class="req">*</span>
            ${tipBadge(PORT_TIPS[freePort] || "", `port-tip-${bid}`)}
          </label>
          <select id="port-sel-${bid}" required
            onchange="checkDuplicatePorts(); updatePortTip(${bid})">
            ${PORTS.map((p) => `<option value="${p}" ${p === freePort ? "selected" : ""}>${p}</option>`).join("")}
          </select>
          <span class="err-msg" id="err-port-${bid}">Required.</span>
        </div>
        <div class="field">
          <label>
            Sensor type <span class="req">*</span>
            ${tipBadge(defCfg.tip || "", `stype-tip-${bid}`)}
          </label>
          <select id="stype-sel-${bid}" required onchange="onSensorChange(${bid})">
            ${sensorOpts}
          </select>
        </div>
      </div>

      <div class="section-card">
        <div class="section-head">
          <span class="section-label">
            Output variable <span class="req">*</span>
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
            Visualization
            ${tipBadge(VIZ_OPTIONS[0]?.tip || "", `viz-tip-${bid}`)}
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
        <div class="section-head">
          <span class="section-label">Parameters</span>
        </div>
        <div class="section-body">
          <div id="params-${bid}"></div>
        </div>
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
  const port = document.getElementById(`port-sel-${bid}`).value;
  setTip(`port-tip-${bid}`, PORT_TIPS[port] || "");
}

function updateOutputTip(bid) {
  const val = document.getElementById(`output-sel-${bid}`).value;
  const key = document.getElementById(`stype-sel-${bid}`).value;
  const cfg = SENSOR_TYPES[key];
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
      <label>
        Variable name <span class="req">*</span>
        ${tooltipText ? tipBadge(tooltipText) : ""}
      </label>
      <input type="text" id="pname-${rid}" value="${nameVal}"
             placeholder="variable name" required readonly style="display:none">
      <div class="param-display-name">${shownName}</div>
    </div>
    <div class="field">
      <label>Value <span class="req">*</span></label>
      <input type="number" id="pval-${rid}" value="${defaultVal}"
             placeholder="0" step="0.01" required
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
               if (dot !== -1 && this.value.length - dot - 1 > 2) {
                 this.value = this.value.slice(0, dot + 3);
               }
             ">
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
  document.querySelectorAll("[id^='port-sel-']").forEach((el) => {
    portMap[el.value] = (portMap[el.value] || 0) + 1;
  });
  const dupes = Object.entries(portMap)
    .filter(([, c]) => c > 1)
    .map(([p]) => p);
  const warn = document.getElementById("port-warning");
  if (dupes.length) {
    warn.textContent = `Warning: port${dupes.length > 1 ? "s" : ""} ${dupes.join(", ")} used in more than one block. Each port must be unique.`;
    warn.classList.add("show");
  } else {
    warn.classList.remove("show");
  }
}

function validate() {
  let valid = true;
  const portMap = {};
  document.querySelectorAll("[id^='port-sel-']").forEach((el) => {
    portMap[el.value] = (portMap[el.value] || []).concat(el.id);
  });
  if (Object.values(portMap).some((ids) => ids.length > 1)) {
    alert("Duplicate ports detected. Each block must use a unique port.");
    return false;
  }
  document.querySelectorAll("input[required]").forEach((el) => {
    const empty = !el.value || el.value.trim() === "";
    el.classList.toggle("error", empty);
    if (empty) valid = false;
  });
  return valid;
}

function buildIno(blocks, surveyAnswers = {}) {
  const now = new Date().toISOString().slice(0, 10);
  const numBlocks = blocks.length;

  function pval(b, name, fallback = "0") {
    const p = b.params.find((p) => p.name === name);
    return p && p.value !== "" ? p.value : fallback;
  }

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

  let constants = "";
  blocks.forEach((b, i) => {
    const idx = i + 1;
    constants += `/* Sensor ${idx}: ${b.sensor} on port ${b.port} */\n`;

    if (b.sensor === "DF_robot") {
      const Vwat = pval(b, "water_val");
      const Vair = pval(b, "air_val");
      const k = pval(b, "k", "1");
      const WP = pval(b, "wp");
      const FC = pval(b, "fc");
      constants += `const int   Vwat_${idx} = ${Vwat};         /* sensor value in water */\n`;
      constants += `const float b_${idx}    = log(${Vair} - ${Vwat});  /* b = ln(Vair-Vwat) */\n`;
      constants += `const float a_${idx}    = -1.0 / ${k};     /* a = -1/k */\n`;
      constants += `float WP_${idx}         = ${WP};            /* wilting point (%vol) */\n`;
      constants += `float FC_${idx}         = ${FC};            /* field capacity (%vol) */\n`;
    } else {
      b.params.forEach((p) => {
        const val = p.value !== "" ? p.value : "0";
        constants += `const float ${(p.name + "_" + idx).padEnd(20)} = ${val};\n`;
      });
    }
    constants += "\n";
  });

  const usesLCD = blocks.some((b) => b.viz === "bar");

  const lcdIncludes = usesLCD ? `#include <LiquidCrystal.h>\n` : "";
  const lcdSetup = usesLCD
    ? `  lcd.begin(LCD_NB_COLUMNS, LCD_NB_ROWS);\n  setup_progressbar();\n`
    : "";

  const lcdGlobals = usesLCD
    ? `
LiquidCrystal lcd(8, 9, 4, 5, 6, 7);
const int LCD_NB_ROWS    = 2;
const int LCD_NB_COLUMNS = 16;
`
    : "";

  const analogBlocks = blocks.filter((b) => b.port.startsWith("A"));
  const usesButton = usesLCD && analogBlocks.length > 0;
  const numInputs = analogBlocks.length;

  const buttonGlobals = usesButton
    ? `
const int buttonPin = A0;
int currentInput    = ${analogBlocks[0]?.port || "A1"};
const int numInputs = ${numInputs};
`
    : "";

  const buttonFunctions = usesButton
    ? `
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
    if (button == 0) currentInput = (currentInput < ${analogBlocks[0]?.port || "A1"} + numInputs - 1) ? currentInput + 1 : ${analogBlocks[0]?.port || "A1"};
    if (button == 3) currentInput = (currentInput > ${analogBlocks[0]?.port || "A1"})                  ? currentInput - 1 : ${analogBlocks[0]?.port || "A1"} + numInputs - 1;
    lastPressTime = currentTime;
  }
}
`
    : "";

  const progressBarCode = usesLCD
    ? `
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

void draw_progressbar(byte pct, int sensorNum) {
  lcd.setCursor(0, 0);
  lcd.print("S"); lcd.print(sensorNum); lcd.print(": ");
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
}
`
    : "";

  function sensorRead(b, idx) {
    if (b.sensor === "DF_robot") {
      return (
        `  int   raw_${idx}  = analogRead(SENSOR_${idx}_PIN);
` +
        `  float x_${idx}    = S${idx}_k * (log(raw_${idx} - S${idx}_water_val) - log(S${idx}_air_val - S${idx}_water_val));
` +
        `  int   pct_${idx};
` +
        `  if      (raw_${idx} <= S${idx}_water_val)  pct_${idx} = 100;
` +
        `  else if (x_${idx}  <= S${idx}_wp)      pct_${idx} = 0;
` +
        `  else if (x_${idx}  >= S${idx}_fc)      pct_${idx} = 100;
` +
        `  else pct_${idx} = (int)((x_${idx} - S${idx}_wp) * 100.0 / (S${idx}_fc - S${idx}_wp));
`
      );
    }
    if (b.sensor === "Watermark") {
      return (
        `  int   raw_${idx}  = analogRead(SENSOR_${idx}_PIN);
` +
        `  int   pct_${idx}  = raw_${idx};
`
      );
    }
    if (b.sensor === "Watermark_Temperature") {
      return (
        `  int   raw_${idx}  = analogRead(SENSOR_${idx}_PIN);
` +
        `  int   pct_${idx}  = raw_${idx};
`
      );
    }
    return (
      `  int   raw_${idx}  = analogRead(SENSOR_${idx}_PIN);
` +
      `  int   pct_${idx}  = raw_${idx};
`
    );
  }

  function vizBlock(b, idx) {
    switch (b.viz) {
      case "none":
        return `  /* no visualization for sensor ${idx} */`;
      case "bar":
        return `  draw_progressbar(percent, ${idx});`;
      case "raw":
        return (
          `  Serial.print("Sensor ${idx} [${b.port}] raw: ");\n` +
          `  Serial.println(sensorValue_${idx});`
        );
      case "state":
        return (
          `  if      (percent == 0)  Serial.println("Sensor ${idx} [${b.port}]: VERY DRY");\n` +
          `  else if (percent < 50)  Serial.println("Sensor ${idx} [${b.port}]: DRY");\n` +
          `  else                    Serial.println("Sensor ${idx} [${b.port}]: WET");`
        );
      case "transformed":
        return (
          `  Serial.print("Sensor ${idx} [${b.port}] TAW%: ");\n` +
          `  Serial.println(percent);`
        );
      case "rate":
        return (
          `  static int prev_${idx} = 0;\n` +
          `  int rate_${idx} = percent - prev_${idx};\n` +
          `  prev_${idx} = percent;\n` +
          `  Serial.print("Sensor ${idx} [${b.port}] rate: ");\n` +
          `  Serial.println(rate_${idx});`
        );
      default:
        return `  Serial.println(percent);`;
    }
  }

  let loopBody = "";
  if (usesButton) loopBody += `  handleButtonPress();\n\n`;
  blocks.forEach((b, i) => {
    const idx = i + 1;
    loopBody += sensorRead(b, idx) + "\n";
    loopBody += `  Serial.print("Analog value (${b.port}): ");\n`;
    loopBody += `  Serial.println(sensorValue_${idx});\n\n`;
    loopBody += vizBlock(b, idx) + "\n\n";
  });

  return `/*
 * ════════════════════════════════════════════════
 *  Pillowtech Code Generator
 *  Generated : ${now}
 *  Sensors   : ${numBlocks}
 * ────────────────────────────────────────────────
${header}
${surveySection} * ════════════════════════════════════════════════
 */

#include <math.h>
${lcdIncludes}
#define BAUD_RATE 9600

/* Module variables */
int   percent;
float x;
${lcdGlobals}${buttonGlobals}
/* Calibration constants */
${constants.trimEnd()}
${progressBarCode}${buttonFunctions}
void setup() {
  Serial.begin(BAUD_RATE);
${lcdSetup}  Serial.println("Sketch ready.");
}

void loop() {

${loopBody}  delay(1000);
}
`;
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

  openSurvey();
}

function openSurvey() {
  const overlay = document.getElementById("survey-overlay");
  const body = document.getElementById("survey-body");

  body.innerHTML = SURVEY_QUESTIONS.map((q) => {
    const req = q.required ? `<span class="req">*</span>` : "";
    if (q.type === "select") {
      return `
        <div class="field survey-field">
          <label>${q.label} ${req}</label>
          <select id="sq-${q.key}" ${q.required ? "required" : ""}>
            <option value="">— select —</option>
            ${q.options.map((o) => `<option value="${o}">${o}</option>`).join("")}
          </select>
          <span class="err-msg" id="sqerr-${q.key}">Required.</span>
        </div>`;
    }
    return `
      <div class="field survey-field">
        <label>${q.label} ${req}</label>
        <input type="${q.type}" id="sq-${q.key}"
               placeholder="${q.placeholder || ""}"
               ${q.required ? "required" : ""}>
        <span class="err-msg" id="sqerr-${q.key}">Required.</span>
      </div>`;
  }).join("");

  overlay.classList.add("show");
}

function closeSurvey() {
  document.getElementById("survey-overlay").classList.remove("show");
}

function confirmSurvey() {
  let valid = true;
  SURVEY_QUESTIONS.forEach((q) => {
    if (!q.required) return;
    const el = document.getElementById(`sq-${q.key}`);
    const err = document.getElementById(`sqerr-${q.key}`);
    const empty = !el.value || el.value.trim() === "";
    el.classList.toggle("error", empty);
    if (err) err.classList.toggle("show", empty);
    if (empty) valid = false;
  });
  if (!valid) return;

  const answers = {};
  SURVEY_QUESTIONS.forEach((q) => {
    answers[q.key] = document.getElementById(`sq-${q.key}`).value.trim();
  });

  closeSurvey();

  const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbwIj0HroQeAM9pg2329xblMrHphfm1YVhL71jdbsDUGCnfUFrMFbDCBCxatpmdWrkFH8w/exec";
  fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify(answers),
  }).catch(() => {});

  const code = buildIno(_pendingBlocks, answers);

  const rawName = (answers.filename || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/\.ino$/i, "");
  const filename = rawName ? rawName + ".ino" : _pendingFilename;

  downloadFile(code, filename);

  document.getElementById("preview-code").textContent = code;
  document.getElementById("preview-wrap").classList.add("show");
  document.getElementById("success-filename").textContent = filename;
  document.getElementById("success-banner").classList.add("show");
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
