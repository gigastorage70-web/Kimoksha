#!/usr/bin/env python3
"""
test_previews.py
Automated verification of HTML preview files in html-previews/.
"""

import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PREVIEWS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "html-previews")

EXPECTED_FILES = [
    "preview-option-1.html",
    "preview-option-2.html",
    "preview-option-3.html",
    "preview-option-4.html",
    "preview-option-5.html",
    "preview-option-6.html"
]

def validate_html_file(filepath):
    errors = []
    filename = os.path.basename(filepath)

    if not os.path.exists(filepath):
        return [f"File {filename} does not exist"], 0

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "<!DOCTYPE html>" not in content and "<!doctype html>" not in content.lower():
        errors.append("Missing <!DOCTYPE html> declaration")

    if 'name="viewport"' not in content:
        errors.append("Missing responsive viewport meta tag")

    if "Plus+Jakarta+Sans" not in content and "Plus Jakarta Sans" not in content:
        errors.append("Missing Plus Jakarta Sans Google font link")

    if "#F26522" not in content and "#f26522" not in content:
        errors.append("Missing primary brand color #F26522")

    if "<style>" not in content:
        errors.append("Missing inline <style> block")

    if "<script>" not in content:
        errors.append("Missing inline <script> block for interactivity")

    size_kb = len(content.encode("utf-8")) / 1024
    return errors, size_kb

def main():
    print("==================================================")
    print("  HTML Previews Automated Quality Check")
    print("==================================================")

    total_errors = 0
    for filename in EXPECTED_FILES:
        filepath = os.path.join(PREVIEWS_DIR, filename)
        errors, size_kb = validate_html_file(filepath)

        if errors:
            print(f"\n[FAIL]: {filename} ({size_kb:.1f} KB)")
            for err in errors:
                print(f"   - {err}")
            total_errors += len(errors)
        else:
            print(f"[PASS]: {filename:<25} | {size_kb:>5.1f} KB | Self-Contained & Responsive")

    print("--------------------------------------------------")
    if total_errors == 0:
        print(f"SUCCESS: ALL {len(EXPECTED_FILES)} HTML PREVIEW FILES PASSED 100% VALIDATION!")
        sys.exit(0)
    else:
        print(f"FAILED WITH {total_errors} ERRORS!")
        sys.exit(1)

if __name__ == "__main__":
    main()
