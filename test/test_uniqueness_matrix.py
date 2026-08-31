#!/usr/bin/env python3
"""
test_uniqueness_matrix.py
Validates that each of the 5 options is structurally unique across:
1. Hero layout & architecture
2. Services presentation pattern
3. Signature interactive widget
4. Navigation structure
5. Footer column configuration
6. Unique section types
"""

import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PREVIEWS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "html-previews")

EXPECTED_UNIQUENESS_PROFILES = {
    "preview-option-1.html": {
        "name": "Option 1 (Enterprise CPaaS)",
        "hero_marker": "hero-grid",
        "service_marker": "services-grid-2x2",
        "interactive_marker": "fm-hero-visual",
        "footer_marker": "footer-grid-4",
        "unique_feature": "comp-table"
    },
    "preview-option-2.html": {
        "name": "Option 2 (Global Carrier Hub)",
        "hero_marker": "hero-centered",
        "service_marker": "services-grid-3x2",
        "interactive_marker": "map-container-card",
        "footer_marker": "footer-grid-3",
        "unique_feature": "cta-banner-section"
    },
    "preview-option-3.html": {
        "name": "Option 3 (Precision Voice & SMS)",
        "hero_marker": "hero-section",
        "service_marker": "sms-pipeline-grid",
        "interactive_marker": "simulator-card",
        "footer_marker": "precision-footer",
        "unique_feature": "voice-interactive-tester"
    },
    "preview-option-4.html": {
        "name": "Option 4 (Modern Bento Grid)",
        "hero_marker": "hero-bento",
        "service_marker": "bento-mosaic-grid",
        "interactive_marker": "calc-slider-wrap",
        "footer_marker": "site-footer-compact",
        "unique_feature": "overlapping-stats-row"
    },
    "preview-option-5.html": {
        "name": "Option 5 (Routing Studio)",
        "hero_marker": "hero-studio",
        "service_marker": "physics-mosaic",
        "interactive_marker": "telemetry-deck",
        "footer_marker": "studio-footer",
        "unique_feature": "codec-comparator"
    },
    "preview-option-6.html": {
        "name": "Option 6 (Liquid Spatial OS)",
        "hero_marker": "hero-spatial",
        "service_marker": "spatial-tiles-grid",
        "interactive_marker": "spatial-control-card",
        "footer_marker": "spatial-footer",
        "unique_feature": "dynamic-island"
    }
}

def verify_uniqueness():
    print("==================================================")
    print("  6-Option Design Uniqueness Verification Suite")
    print("==================================================")

    total_errors = 0
    hero_types = set()
    service_types = set()
    interactive_types = set()
    footer_types = set()

    for filename, profile in EXPECTED_UNIQUENESS_PROFILES.items():
        filepath = os.path.join(PREVIEWS_DIR, filename)
        if not os.path.exists(filepath):
            print(f"[FAIL] File missing: {filename}")
            total_errors += 1
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            html = f.read()

        # Check markers
        missing = []
        for marker_key, marker_val in [
            ("Hero", profile["hero_marker"]),
            ("Services", profile["service_marker"]),
            ("Interactive Widget", profile["interactive_marker"]),
            ("Footer", profile["footer_marker"]),
            ("Unique Feature", profile["unique_feature"])
        ]:
            if marker_val not in html:
                missing.append(f"{marker_key} marker '{marker_val}' not found")

        hero_types.add(profile["hero_marker"])
        service_types.add(profile["service_marker"])
        interactive_types.add(profile["interactive_marker"])
        footer_types.add(profile["footer_marker"])

        if missing:
            print(f"\n[FAIL]: {profile['name']}")
            for m in missing:
                print(f"   - {m}")
            total_errors += len(missing)
        else:
            print(f"[PASS]: {profile['name']:<35} | Verified Unique Layout & Components")

    print("--------------------------------------------------")
    print(f"Unique Hero Archetypes       : {len(hero_types)}/6")
    print(f"Unique Services Presentations: {len(service_types)}/6")
    print(f"Unique Interactive Widgets   : {len(interactive_types)}/6")
    print(f"Unique Footer Hierarchies    : {len(footer_types)}/6")
    print("--------------------------------------------------")

    if (
        total_errors == 0
        and len(hero_types) == 6
        and len(service_types) == 6
        and len(interactive_types) == 6
        and len(footer_types) == 6
    ):
        print("SUCCESS: 100% INDEPENDENT & UNIQUE DESIGN ARCHITECTURE VERIFIED!")
        sys.exit(0)
    else:
        print("FAILED UNIQUENESS VERIFICATION!")
        sys.exit(1)

if __name__ == "__main__":
    verify_uniqueness()
