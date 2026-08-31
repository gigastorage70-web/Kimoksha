#!/usr/bin/env python3
"""
validate_json_schema.py
Automated validation of Elementor 0.4 JSON templates in elementor-json/.
"""

import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

JSON_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "elementor-json")

def validate_element(el, seen_ids, is_top_level=False, depth=0):
    errors = []
    el_id = el.get("id")
    el_type = el.get("elType")
    is_inner = el.get("isInner")

    # Check ID
    if not el_id:
        errors.append(f"Missing 'id' field at depth {depth}")
    elif el_id in seen_ids:
        errors.append(f"Duplicate element ID collision: '{el_id}' at depth {depth}")
    else:
        seen_ids.add(el_id)

    # Check isInner rules
    if el_type == "container":
        if is_top_level and is_inner is not False:
            errors.append(f"Top-level container ID {el_id} MUST have isInner=False, found: {is_inner}")
        elif not is_top_level and is_inner is not True:
            errors.append(f"Nested inner container ID {el_id} MUST have isInner=True, found: {is_inner}")
    elif el_type == "widget":
        if "elements" not in el or el["elements"] != []:
            errors.append(f"Widget ID {el_id} must have 'elements': []")

    # Check padding string format in settings
    settings = el.get("settings", {})
    for p_key in ["padding", "margin"]:
        if p_key in settings and isinstance(settings[p_key], dict):
            for side in ["top", "right", "bottom", "left"]:
                val = settings[p_key].get(side)
                if val is not None and not isinstance(val, str):
                    errors.append(f"Element ID {el_id} {p_key}.{side} should be a string, found {type(val)}: {val}")

    # Recursively check children
    for child in el.get("elements", []):
        errors.extend(validate_element(child, seen_ids, is_top_level=False, depth=depth + 1))

    return errors

def validate_template_file(filepath):
    errors = []
    filename = os.path.basename(filepath)
    size_kb = os.path.getsize(filepath) / 1024

    if size_kb > 200:
        errors.append(f"File size {size_kb:.1f} KB exceeds recommended 200 KB threshold")

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        return [f"JSON Parse Error in {filename}: {str(e)}"], 0, size_kb

    # Top-level checks
    if data.get("version") != "0.4":
        errors.append(f"Expected version '0.4', found '{data.get('version')}'")
    if data.get("type") != "page":
        errors.append(f"Expected type 'page', found '{data.get('type')}'")
    if not isinstance(data.get("content"), list):
        errors.append("Expected 'content' to be a list of sections")

    seen_ids = set()
    for sec_idx, section in enumerate(data.get("content", [])):
        errors.extend(validate_element(section, seen_ids, is_top_level=True, depth=0))

    return errors, len(seen_ids), size_kb

def main():
    print("==================================================")
    print("  Elementor JSON Schema Validation Test Suite")
    print("==================================================")

    if not os.path.exists(JSON_DIR):
        print(f"Error: Directory {JSON_DIR} does not exist!")
        sys.exit(1)

    json_files = [f for f in sorted(os.listdir(JSON_DIR)) if f.endswith(".json")]
    if not json_files:
        print(f"Error: No JSON templates found in {JSON_DIR}")
        sys.exit(1)

    total_errors = 0
    for jf in json_files:
        full_path = os.path.join(JSON_DIR, jf)
        errors, element_count, size_kb = validate_template_file(full_path)
        if errors:
            print(f"\n[FAIL]: {jf} ({size_kb:.1f} KB, {element_count} elements)")
            for err in errors:
                print(f"   - {err}")
            total_errors += len(errors)
        else:
            print(f"[PASS]: {jf:<50} | {size_kb:>5.1f} KB | {element_count:>3} Unique Element IDs")

    print("--------------------------------------------------")
    if total_errors == 0:
        print(f"SUCCESS: ALL {len(json_files)} ELEMENTOR JSON FILES PASSED 100% VALIDATION!")
        sys.exit(0)
    else:
        print(f"FAILED WITH {total_errors} SCHEMA ERRORS!")
        sys.exit(1)

if __name__ == "__main__":
    main()
