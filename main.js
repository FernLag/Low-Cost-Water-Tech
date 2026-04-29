const SENSOR_TYPES = {
  df_moisture: {
    label: "Df_robot_water",
    tip: "DFRobot capacitive soil moisture sensor. Outputs an analog voltage proportional to soil water content. Requires air and water calibration values.",
    outputs: [
      {
        value: "Raw value",
        tip: "No transformation applied.",
      },
      {
        value: "TAW",
        tip: "Total Available Water: ",
      },
      {
        value: "Transformed Raw Value",
        tip: "Raw value mapped to 0–100.",
      },
      {
        value: "Rate of change",
        tip: "",
      },
      {
        value: "1-2-3 point calibration",
        tip: "",
      },
      {
        value: "Threshold (very dry/dry/wet)",
        tip: "Classifies moisture into three states.",
      },
    ],
    params: [
      {
        name: "air_val",
        label: "Air value: ",
        value: "",
      },
      {
        name: "water_val",
        label: "Water value: ",
        value: "",
      },
      {
        name: "fc",
        label: "Field capacity: ",
        value: "",
      },
      {
        name: "wp",
        label: "Wilting point: ",
        value: "",
      },
      { name: "k", label: "k: ", value: "" },
    ],
  },
  Watermark_moisture: {
    label: "Watermark 200SS",
    tip: "",
    outputs: [
      {
        value: "Transformed Raw value",
        tip: "",
      },
    ],
    params: [],
  },
  Watermark_3x_200SSVA3_Temp: {
    label: "3x Watermark 200SS + 200SSVA3 + Temperature",
    tip: "Combination setup: three Watermark 200SS sensors, one 200SSVA3, and one temperature probe for temperature correction.",
    outputs: [
      {
        value: "Raw value",
        tip: "",
      },
      {
        value: "Transformed raw value",
        tip: "All three sensors converted to centibars using the Watermark lookup table.",
      },
      {
        value: "Tension (3 locations)",
        tip: "",
      },
      {
        value: "Temperature",
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
};

const PORTS = ["A1", "A2", "A3", "A4", "A5"];

const VIZ_OPTIONS = [
  {
    value: "none",
    label: "No visualization",
    tip: "No Serial output for this sensor. Useful when you only want to log data without displaying it.",
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
    label: "Transformed Raw Value 0–100",
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
    placeholder: "e.g. apples_field2  (no spaces, no .ino)",
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
    placeholder: "Optional…",
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
            <select id="output-sel-${bid}" required
              onchange="updateOutputTip(${bid})">
              ${outputOpts}
            </select>
            <span class="err-msg" id="err-output-${bid}">Required.</span>
          </div>
          <div class="add-option-row">
            <input type="text" id="output-new-${bid}" placeholder="Add custom output option…">
            <button class="add-option-btn"
              onclick="addOptionToDropdown('output-sel-${bid}','output-new-${bid}')">+ Add</button>
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
          <div class="add-option-row">
            <input type="text" id="viz-new-${bid}" placeholder="Add custom visualization…">
            <button class="add-option-btn"
              onclick="addOptionToDropdown('viz-sel-${bid}','viz-new-${bid}')">+ Add</button>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-head">
          <span class="section-label">Parameters</span>
        </div>
        <div class="section-body">
          <div id="params-${bid}"></div>
          <button class="add-param-btn" onclick="addParamRow(${bid})">+ Add parameter</button>
        </div>
      </div>

    </div>
  `;

  document.getElementById("sensors-list").appendChild(block);
  defCfg.params.forEach((p) => addParamRow(bid, p.name, p.value, p.label));
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
  cfg.params.forEach((p) => addParamRow(bid, p.name, p.value, p.label));
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

function addParamRow(bid, nameVal = "", valueVal = "", tooltipText = "") {
  const rid = nextUid();
  const container = document.getElementById(`params-${bid}`);
  const row = document.createElement("div");
  row.className = "param-row";
  row.dataset.rid = rid;
  row.innerHTML = `
    <div class="field">
      <label>
        Variable name <span class="req">*</span>
        ${tooltipText ? tipBadge(tooltipText) : ""}
      </label>
      <input type="text" id="pname-${rid}" value="${nameVal}"
             placeholder="variable name" required>
    </div>
    <div class="field">
      <label>Value <span class="req">*</span></label>
      <input type="number" id="pval-${rid}" value="${valueVal}"
             placeholder="0" step="any" required>
    </div>
    <button class="rem-param-btn" title="Remove row"
      onclick="removeParamRow(${bid},'${rid}')">−</button>
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

  let constants = "";
  blocks.forEach((b, i) => {
    const idx = i + 1;
    constants += `// Sensor ${idx}: ${b.sensor} on port ${b.port}\n`;
    constants += `const int   SENSOR_${idx}_PIN = ${b.port};\n`;
    b.params.forEach((p) => {
      const constName = `SENSOR_${idx}_${p.name.toUpperCase()}`;
      constants += `const float ${constName.padEnd(32)} = ${p.value};\n`;
    });
    constants += "\n";
  });

  function vizBlock(b, idx) {
    const wp = parseFloat(
      b.params.find((p) => p.name === "wp")?.value || "0.12",
    );
    const fc = parseFloat(
      b.params.find((p) => p.name === "fc")?.value || "0.35",
    );
    switch (b.viz) {
      case "none":
        return `  // no visualization selected`;
      case "bar":
        return `  Serial.println(val_${idx});`;
      case "raw":
        return `  Serial.print("${b.sensor} [${b.port}] raw: "); Serial.println(val_${idx});`;
      case "state":
        return (
          `  if      (pct_${idx} < ${(wp * 100).toFixed(0)}) Serial.println("${b.sensor}: VERY DRY");\n` +
          `  else if (pct_${idx} < ${(fc * 100).toFixed(0)}) Serial.println("${b.sensor}: DRY");\n` +
          `  else                                              Serial.println("${b.sensor}: WET");`
        );
      case "transformed":
        return (
          `  float tval_${idx} = pct_${idx};\n` +
          `  Serial.print("${b.sensor} [${b.port}] 0-100: "); Serial.println(tval_${idx});`
        );
      case "rate":
        return (
          `  static float prev_${idx} = 0;\n` +
          `  float rate_${idx} = val_${idx} - prev_${idx};\n` +
          `  prev_${idx} = val_${idx};\n` +
          `  Serial.print("${b.sensor} rate: "); Serial.println(rate_${idx});`
        );
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

  return `/*
 * ════════════════════════════════════════════════
 *  Pillowtech Code Generator
 *  Generated : ${now}
 *  Sensors   : ${numBlocks}
 * ────────────────────────────────────────────────
${header}
${surveySection} * ════════════════════════════════════════════════
 */

#define BAUD_RATE 9600

${constants.trimEnd()}

void setup() {
  Serial.begin(BAUD_RATE);
  Serial.println("Sketch ready.");
}

void loop() {

${loopReads}
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
