import os
import re
from openpyxl import load_workbook

EXCEL_FILE    = "sensor_configuration.xlsx"
MAIN_JS_FILE  = "main.js"
TEMPLATES_DIR = "templates"

wb = load_workbook(EXCEL_FILE, data_only=True)

def sheet_rows(sheet_name, skip=1):
    ws = wb[sheet_name]
    rows = []
    for row in ws.iter_rows(min_row=skip + 1, values_only=True):
        if any(c is not None for c in row):
            rows.append([str(c).strip() if c is not None else "" for c in row])
    return rows

sensors_raw = sheet_rows("sensors")

active_keys = []
sensor_meta = {}
outputs_map = {}
params_map  = {}

for row in sensors_raw:
    key     = row[0]
    label   = row[1]
    active  = row[2].upper() == "TRUE"
    tip     = row[3]
    out_val = row[4]
    out_tip = row[5]
    p_name  = row[6]
    p_label = row[7]
    p_val   = row[8]
    eq_note = row[9] if len(row) > 9 else ""

    if not key:
        continue

    if key not in sensor_meta:
        sensor_meta[key] = {"label": label, "active": active, "tip": tip}
        if active and key not in active_keys:
            active_keys.append(key)

    if out_val:
        outputs_map.setdefault(key, [])
        if not any(o["value"] == out_val for o in outputs_map[key]):
            outputs_map[key].append({"value": out_val, "tip": out_tip})

    if p_name:
        params_map.setdefault(key, [])
        if not any(p["name"] == p_name for p in params_map[key]):
            params_map[key].append({
                "name":     p_name,
                "label":    p_label,
                "value":    p_val,
                "equation": eq_note,
            })

viz_raw      = sheet_rows("viz_options")
active_viz   = [r for r in viz_raw if r[3].upper() == "TRUE"]
survey_raw   = sheet_rows("survey_questions")
ports_raw    = sheet_rows("ports")
active_ports = [r[0] for r in ports_raw if r[0]]
port_tips    = {r[0]: r[1] for r in ports_raw if r[0]}


def jstr(s):
    return (s or "").replace("\\", "\\\\").replace('"', '\\"')


def build_sensor_types():
    lines = ["const SENSOR_TYPES = {"]
    for key in active_keys:
        meta    = sensor_meta[key]
        outputs = outputs_map.get(key, [])
        params  = params_map.get(key, [])
        lines.append(f'  {key}: {{')
        lines.append(f'    label: "{jstr(meta["label"])}",')
        lines.append(f'    tip: "{jstr(meta["tip"])}",')
        lines.append('    outputs: [')
        for o in outputs:
            lines.append(f'      {{')
            lines.append(f'        value: "{jstr(o["value"])}",')
            lines.append(f'        tip: "{jstr(o["tip"])}",')
            lines.append(f'      }},')
        lines.append('    ],')
        lines.append('    params: [')
        for p in params:
            lines.append(f'      {{')
            lines.append(f'        name: "{jstr(p["name"])}",')
            lines.append(f'        label: "{jstr(p["label"])}",')
            lines.append(f'        value: "{jstr(p["value"])}",')
            lines.append(f'      }},')
        lines.append('    ],')
        lines.append('  },')
    lines.append('};')
    return '\n'.join(lines)


def build_port_tips():
    lines = ["const PORT_TIPS = {"]
    for port, tip in port_tips.items():
        lines.append(f'  {port}: "{jstr(tip)}",')
    lines.append('};')
    return '\n'.join(lines)


def build_ports():
    items = ',\n'.join(f'  "{p}"' for p in active_ports)
    return f'const PORTS = [\n{items},\n];'


def build_viz_options():
    lines = ["const VIZ_OPTIONS = ["]
    for row in active_viz:
        key, label, tip = row[0], row[1], row[2]
        lines.append(f'  {{')
        lines.append(f'    value: "{jstr(key)}",')
        lines.append(f'    label: "{jstr(label)}",')
        lines.append(f'    tip: "{jstr(tip)}",')
        lines.append(f'  }},')
    lines.append('];')
    return '\n'.join(lines)


def build_survey_questions():
    lines = ["const SURVEY_QUESTIONS = ["]
    for row in survey_raw:
        key, label, qtype = row[0], row[1], row[2]
        required = "true" if row[3].upper() == "TRUE" else "false"
        extra    = row[4] if len(row) > 4 else ""
        lines.append(f'  {{')
        lines.append(f'    key: "{key}",')
        lines.append(f'    label: "{jstr(label)}",')
        lines.append(f'    type: "{qtype}",')
        lines.append(f'    required: {required},')
        if qtype.lower() == "select":
            options = [o.strip() for o in extra.split("|") if o.strip()]
            opts_js = "[" + ", ".join(f'"{jstr(o)}"' for o in options) + "]"
            lines.append(f'    options: {opts_js},')
        else:
            lines.append(f'    placeholder: "{jstr(extra)}",')
        lines.append(f'  }},')
    lines.append('];')
    return '\n'.join(lines)


with open(MAIN_JS_FILE, "r", encoding="utf-8") as f:
    js = f.read()

js = re.sub(r'const SENSOR_TYPES = \{.*?\};',
            build_sensor_types(), js, flags=re.DOTALL)
js = re.sub(r'const PORT_TIPS = \{.*?\};',
            build_port_tips(), js, flags=re.DOTALL)
js = re.sub(r'const PORTS = \[.*?\];',
            build_ports(), js, flags=re.DOTALL)
js = re.sub(r'const VIZ_OPTIONS = \[.*?\];',
            build_viz_options(), js, flags=re.DOTALL)
js = re.sub(r'const SURVEY_QUESTIONS = \[.*?\];',
            build_survey_questions(), js, flags=re.DOTALL)

with open(MAIN_JS_FILE, "w", encoding="utf-8") as f:
    f.write(js)

print(f"main.js updated — {len(active_keys)} sensor(s), {len(active_ports)} port(s), "
      f"{len(active_viz)} viz option(s), {len(survey_raw)} survey question(s)")


os.makedirs(TEMPLATES_DIR, exist_ok=True)

for key in active_keys:
    meta    = sensor_meta[key]
    params  = params_map.get(key, [])
    outputs = outputs_map.get(key, [])
    sep     = "-" * (len(key) + 3)

    param_lines = []
    for p in params:
        eq = f"  # equation: {p['equation']}" if p["equation"] else ""
        param_lines.append(f'{p["name"]} = {p["value"] or ""}  # {p["label"]}{eq}')
    param_block  = "\n".join(param_lines) if param_lines else "# No parameters defined"
    output_block = "\n".join(f'#   - {o["value"]}' for o in outputs) if outputs else "#   (none defined)"
    p0 = params[0]["name"] if len(params) > 0 else "param_1"
    p1 = params[1]["name"] if len(params) > 1 else "param_2"

    code = f'''# {key}.py
# Sensor: {meta["label"]}

{param_block}

# Supported outputs:
{output_block}


def read(raw_value: float) -> dict:
    result = {{}}
    return result


if __name__ == "__main__":
    test_raw = 512
    output   = read(test_raw)
    print(f"Sensor : {meta['label']}")
    print(f"Raw    : {{test_raw}}")
    print(f"Output : {{output}}")
'''

    path = os.path.join(TEMPLATES_DIR, f"{key}.py")
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"templates/{key}.py written")