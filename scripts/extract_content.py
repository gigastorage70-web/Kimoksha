#!/usr/bin/env python3
"""
extract_content.py
Utility to parse and inspect Elementor JSON structure and extract text content,
widget hierarchies, and settings for inspection and verification.
"""

import json
import sys
import os

def inspect_elementor_json(filepath):
    if not os.path.exists(filepath):
        print(f"Error: File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"=== Elementor Template Inspection ===")
    print(f"File: {os.path.basename(filepath)}")
    print(f"Title: {data.get('title')}")
    print(f"Type: {data.get('type')}")
    print(f"Version: {data.get('version')}")
    print(f"Total Top-Level Sections: {len(data.get('content', []))}")
    print("-" * 50)

    def dump_el(el, depth=0):
        indent = "  " * depth
        el_type = el.get('elType', '')
        widget_type = el.get('widgetType', '')
        cid = el.get('id', '')
        is_inner = el.get('isInner', False)
        
        info = f"{indent}[{el_type.upper()}] id:{cid} isInner:{is_inner}"
        if widget_type:
            info += f" widget:{widget_type}"
        print(info)

        settings = el.get('settings', {})
        for k in ['title', 'text', 'header_size', 'background_color', 'content_width']:
            if k in settings:
                print(f"{indent}  * {k}: {settings[k]}")

        for child in el.get('elements', []):
            dump_el(child, depth + 1)

    for idx, sec in enumerate(data.get('content', [])):
        print(f"\n--- Section {idx + 1} ---")
        dump_el(sec, 0)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        target = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "elementor-json", "Kimosha-Telecom-Option-1-Enterprise-CPaaS.json")
    inspect_elementor_json(target)
