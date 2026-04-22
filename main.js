const SENSOR_TYPES = {
  df_moisture: {
    label: "Df_robot_water",
    outputs: [
      "Raw value",
      "TAW",
      "Transformed Raw Value",
      "Rate of change",
      "1-2-3 point calibration",
      "Threshold (very dry/dry/wet)",
    ],
    params: [
      { name: "air_val", value: "0", unit: "" },
      { name: "water_val", value: "0", unit: "" },
      { name: "fc", value: "0.00", unit: "" },
      { name: "wp", value: "0.00", unit: "" },
      { name: "k", value: "0.0", unit: "" },
    ],
  },
  Watermark_moisture: {
    label: "Watermark 200SS",
    outputs: ["Transformed Raw value"],
    params: [],
  },
  Watermark_3x_200SSVA3_Temp: {
    label: "3x Watermark 200SS + 200SSVA3 + Temperature",
    outputs: [
      "Raw value",
      "Transformed raw value",
      "Tension (3 locations)",
      "Temperature",
    ],
    params: [],
  },
  temp: {
    label: "Temperature",
    outputs: ["Celsius", "Fahrenheit", "Raw value"],
    params: [],
  },
  ph: {
    label: "pH sensor",
    outputs: ["pH value", "Raw voltage", "Raw value"],
    params: [],
  },
  ec: {
    label: "EC / conductivity",
    outputs: ["µS/cm", "mS/cm", "Raw value"],
    params: [],
  },
};

const PORTS = [
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
];
let uid = 0;
const nextUid = () => ++uid;

function addBlock() {
  const bid = nextUid();
  const defKey = "moisture";
  const defCfg = SENSOR_TYPES[defKey];
  const usedPorts = [...document.querySelectorAll("[id^='port-sel-']")].map(
    (s) => s.value,
  );
  const freePort = PORTS.find((p) => !usedPorts.includes(p)) || PORTS[0];
  const sensorOpts = Object.entries(SENSOR_TYPES)
    .map(([k, v]) => `<option value="${k}">${v.label}</option>`)
    .join("");
  const outputOpts = defCfg.outputs
    .map((o) => `<option value="${o}">${o}</option>`)
    .join("");

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
                <label>Port <span class="req">*</span></label>
                <select id="port-sel-${bid}" required onchange="checkDuplicatePorts()">
                  ${PORTS.map((p) => `<option value="${p}" ${p === freePort ? "selected" : ""}>${p}</option>`).join("")}
                </select>
                <span class="err-msg" id="err-port-${bid}">Required.</span>
              </div>
              <div class="field">
                <label>Sensor type <span class="req">*</span></label>
                <select id="stype-sel-${bid}" required onchange="onSensorChange(${bid})">
                  ${sensorOpts}
                </select>
              </div>
            </div>

            <div class="section-card">
              <div class="section-head">
                <span class="section-label">Output variables <span class="req">*</span></span>
              </div>
              <div class="section-body">
                <div class="field">
                  <label>Select output</label>
                  <select id="output-sel-${bid}" required>
                    ${outputOpts}
                  </select>
                  <span class="err-msg" id="err-output-${bid}">Required.</span>
                </div>
                <div class="add-option-row">
                  <input type="text" id="output-new-${bid}" placeholder="Add custom output option…">
                  <button class="add-option-btn" onclick="addOptionToDropdown('output-sel-${bid}','output-new-${bid}')">+ Add</button>
                </div>
              </div>
            </div>

            <div class="section-card">
              <div class="section-head">
                <span class="section-label">Sensor type options</span>
              </div>
              <div class="section-body">
                <div class="field">
                  <label>Current sensor type dropdown</label>
                  <select id="stype-display-${bid}" onchange="syncSensorType(${bid})">
                    ${sensorOpts}
                  </select>
                </div>
                <div class="add-option-row">
                  <input type="text" id="stype-new-${bid}" placeholder="Add custom sensor type…">
                  <button class="add-option-btn" onclick="addOptionToDropdown('stype-sel-${bid}','stype-new-${bid}');addOptionToDropdown('stype-display-${bid}','stype-new-${bid}')">+ Add</button>
                </div>
              </div>
            </div>

            <div class="section-card">
              <div class="section-head">
                <span class="section-label">Parameters <span class="req">*</span></span>
              </div>
              <div class="section-body">
                <div id="params-${bid}"></div>
                <button class="add-param-btn" onclick="addParamRow(${bid})">+ Add parameter row</button>
              </div>
            </div>
          </div>
        `;

  document.getElementById("sensors-list").appendChild(block);
  defCfg.params.forEach((p) => addParamRow(bid, p.name, p.value, p.unit));
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

function onSensorChange(bid) {
  const key = document.getElementById(`stype-sel-${bid}`).value;
  const cfg = SENSOR_TYPES[key];
  if (!cfg) return;
  const disp = document.getElementById(`stype-display-${bid}`);
  if (disp) disp.value = key;
  document.getElementById(`output-sel-${bid}`).innerHTML = cfg.outputs
    .map((o) => `<option value="${o}">${o}</option>`)
    .join("");
  const container = document.getElementById(`params-${bid}`);
  container.innerHTML = "";
  cfg.params.forEach((p) => addParamRow(bid, p.name, p.value, p.unit));
}

function syncSensorType(bid) {
  const val = document.getElementById(`stype-display-${bid}`).value;
  const main = document.getElementById(`stype-sel-${bid}`);
  if (main) {
    main.value = val;
    onSensorChange(bid);
  }
}

function addOptionToDropdown(selectId, inputId) {
  const sel = document.getElementById(selectId);
  const inp = document.getElementById(inputId);
  if (!sel || !inp) return;
  const val = inp.value.trim();
  if (!val) return;
  if (![...sel.options].some((o) => o.value === val)) {
    const opt = document.createElement("option");
    opt.value = opt.textContent = val;
    sel.appendChild(opt);
  }
  sel.value = val;
  inp.value = "";
}

function addParamRow(bid, nameVal = "", valueVal = "", unitVal = "") {
  const rid = nextUid();
  const container = document.getElementById(`params-${bid}`);
  const row = document.createElement("div");
  row.className = "param-row";
  row.dataset.rid = rid;
  row.innerHTML = `
          <div class="field">
            <label>Name <span class="req">*</span></label>
            <input type="text" id="pname-${rid}" value="${nameVal}" placeholder="e.g. air_val" required>
          </div>
          <div class="field">
            <label>Value <span class="req">*</span></label>
            <input type="number" id="pval-${rid}" value="${valueVal}" placeholder="e.g. 520" step="any" required>
          </div>
          <div class="field">
            <label>Unit</label>
            <input type="text" id="punit-${rid}" value="${unitVal}" placeholder="e.g. ADC">
          </div>
          <button class="rem-param-btn" title="Remove row" onclick="removeParamRow(${bid},'${rid}')">−</button>
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
  document.querySelectorAll(".sensor-block").forEach((block) => {
    const bid = block.dataset.bid;
    const pRows = document.querySelectorAll(`#params-${bid} .param-row`);
    if (pRows.length === 0) {
      alert(
        `Sensor block ${block.querySelector(".sensor-num").textContent} needs at least one parameter.`,
      );
      valid = false;
    }
  });
  return valid;
}

function buildIno(blocks, viz) {
  const now = new Date().toISOString().slice(0, 10);
  const numBlocks = blocks.length;

  let constants = "";
  blocks.forEach((b, i) => {
    const idx = i + 1;
    constants += `// ── Sensor ${idx}: ${b.sensor} on port ${b.port} ──\n`;
    constants += `const int   SENSOR_${idx}_PIN = ${b.port};\n`;
    b.params.forEach((p) => {
      const constName = `SENSOR_${idx}_${p.name.toUpperCase()}`;
      const unitNote = p.unit ? `  // ${p.unit}` : "";
      constants += `const float ${constName.padEnd(30)} = ${p.value};${unitNote}\n`;
    });
    constants += "\n";
  });

  function vizBlock(b, idx) {
    const pin = `SENSOR_${idx}_PIN`;
    const prefix = `SENSOR_${idx}`;
    switch (viz) {
      case "bar":
        return `  Serial.println(val_${idx});`;
      case "raw":
        return `  Serial.print("${b.sensor} [${b.port}] raw: ");\n  Serial.println(val_${idx});`;
      case "state": {
        const wp = b.params.find((p) => p.name === "wp")?.value || "0.12";
        const fc = b.params.find((p) => p.name === "fc")?.value || "0.35";
        return (
          `  if (pct_${idx} < ${(wp * 100).toFixed(0)}) Serial.println("${b.sensor} [${b.port}]: DRY");\n` +
          `  else if (pct_${idx} < ${(fc * 100).toFixed(0)}) Serial.println("${b.sensor} [${b.port}]: MOIST");\n` +
          `  else Serial.println("${b.sensor} [${b.port}]: WET");`
        );
      }
      case "csv":
        return `  Serial.print(millis()); Serial.print(","); Serial.print("${b.port}"); Serial.print(","); Serial.println(val_${idx});`;
      case "json":
        return `  Serial.print("{\\"sensor\\":\\"${b.sensor}\\",\\"port\\":\\"${b.port}\\",\\"value\\":"); Serial.print(val_${idx}); Serial.println("}");`;
      case "threshold": {
        const wp = b.params.find((p) => p.name === "wp")?.value || "0.12";
        return `  if (pct_${idx} < ${(wp * 100).toFixed(0)}) Serial.println("ALERT: ${b.sensor} [${b.port}] below threshold!");`;
      }
      case "average":
        return `  static float avg_${idx} = 0;\n  avg_${idx} = avg_${idx} * 0.9 + val_${idx} * 0.1;\n  Serial.println(avg_${idx});`;
      case "oled":
        return `  display.clearDisplay();\n  display.setCursor(0,${(idx - 1) * 10});\n  display.print("${b.port}:"); display.println(val_${idx});\n  display.display();`;
      case "color":
        return (
          `  analogWrite(9,  map(val_${idx}, 0, 1023, 0,   255));  // R\n` +
          `  analogWrite(10, map(val_${idx}, 0, 1023, 255, 0));    // G`
        );
      case "buzzer":
        return `  if (val_${idx} < 300) tone(8, 1000, 200);`;
      default:
        return `  Serial.println(val_${idx});`;
    }
  }

  let loopReads = "";
  let loopViz = "";
  blocks.forEach((b, i) => {
    const idx = i + 1;
    const air = b.params.find((p) => p.name === "air_val")?.value || "520";
    const wat = b.params.find((p) => p.name === "water_val")?.value || "260";
    loopReads += `  int   val_${idx} = analogRead(SENSOR_${idx}_PIN);\n`;
    loopReads += `  float pct_${idx} = constrain(map(val_${idx}, ${air}, ${wat}, 0, 100), 0, 100);\n`;
    loopViz += vizBlock(b, idx) + "\n";
  });

  const header = blocks
    .map(
      (b, i) =>
        ` *   Sensor ${i + 1}: ${b.sensor} on ${b.port} → output: ${b.output}`,
    )
    .join("\n");

  return `/*
 * ════════════════════════════════════════════════
 *  Hello World
 *  Generated : ${now}
 *  Sensors   : ${numBlocks}
 *  Visual mode  : ${viz}
 * ────────────────────────────────────────────────
${header}
 * ════════════════════════════════════════════════
 */

// ── Serial baud rate ──────────────────────────
#define BAUD_RATE 9600

// ── Pin + calibration constants ───────────────
${constants.trimEnd()}

// ─────────────────────────────────────────────
void setup() {
  Serial.begin(BAUD_RATE);
  Serial.println("Hello World.");
}

// ─────────────────────────────────────────────
void loop() {

  // Read all sensors
${loopReads}
  // Output
${loopViz}
  delay(500);
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

function handleGenerate() {
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));
  if (!validate()) return;

  const blocks = [];
  document.querySelectorAll(".sensor-block").forEach((block) => {
    const bid = block.dataset.bid;
    const params = [];
    document.querySelectorAll(`#params-${bid} .param-row`).forEach((row) => {
      const rid = row.dataset.rid;
      params.push({
        name: document.getElementById(`pname-${rid}`)?.value || "",
        value: document.getElementById(`pval-${rid}`)?.value || "",
        unit: document.getElementById(`punit-${rid}`)?.value || "",
      });
    });
    blocks.push({
      port: document.getElementById(`port-sel-${bid}`).value,
      sensor: document.getElementById(`stype-sel-${bid}`).value,
      output: document.getElementById(`output-sel-${bid}`).value,
      params,
    });
  });

  const viz = document.getElementById("viz").value;
  const code = buildIno(blocks, viz);
  const filename =
    blocks.length === 1
      ? `sensor_${blocks[0].port}.ino`
      : `sensors_${blocks.map((b) => b.port).join("_")}.ino`;

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

addBlock();
addBlock();
