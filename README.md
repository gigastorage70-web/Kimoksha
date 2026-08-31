# Kimosha Telecom — 6 Unique Website Redesign Showcase & Elementor MVP

Professional MVP deliverables for **Kimosha Telecom** (Wholesale SMS & Voice Provider).

This repository contains **6 completely unique, independently designed website options**, available as:
1. **Interactive Standalone HTML Previews** (self-contained, responsive, zero build step).
2. **WordPress Elementor-Importable JSON Templates** (tested against Elementor 3.x+ flexbox container schema).
3. **Unified Meta-Showcase (`index.html`)** with live 6-tab switcher, responsive viewport simulator (Desktop / Tablet / Mobile), and direct JSON download buttons.

---

## 📁 Repository Directory Structure

```
KImosha/
├── index.html                                        # Unified Client Approval Meta-Showcase (6 Options)
├── vercel.json                                       # Vercel Deployment Configuration
├── README.md                                         # Master Project Documentation
├── Kimosha-logo.png                                  # Official Brand Logo
├── Kimosha-Telecom-Build-Guide.md                    # Master Build Specification Guide
│
├── html-previews/                                    # Standalone Self-Contained HTML Previews
│   ├── preview-option-1.html                         # Option 1: Enterprise CPaaS Platform
│   ├── preview-option-2.html                         # Option 2: Global Carrier Network Hub
│   ├── preview-option-3.html                         # Option 3: Minimal Voice + SMS
│   ├── preview-option-4.html                         # Option 4: Modern Bento Grid
│   ├── preview-option-5.html                         # Option 5: Routing Studio & Telemetry Deck
│   └── preview-option-6.html                         # Option 6: Liquid Spatial CPaaS (iOS 26 / One UI 9)
│
├── elementor-json/                                   # Elementor 3.x+ JSON Templates (WordPress)
│   ├── Kimosha-Telecom-Option-1-Enterprise-CPaaS.json
│   ├── Kimosha-Telecom-Option-2-Global-Carrier-Hub.json
│   ├── Kimosha-Telecom-Option-3-Minimal-Voice-SMS.json
│   ├── Kimosha-Telecom-Option-4-Bento-Grid-Modern.json
│   ├── Kimosha-Telecom-Option-5-Routing-Studio.json
│   └── Kimosha-Telecom-Option-6-Liquid-Spatial.json
│
├── scripts/                                          # Automation & Template Builders
│   ├── generate_elementor_templates.py               # Generates all 6 Elementor JSON templates
│   └── extract_content.py                            # Elementor JSON hierarchy inspection tool
│
├── test/                                             # Automated QA & Validation Test Suite
│   ├── validate_json_schema.py                       # Validates Elementor 0.4 JSON schema & rules
│   ├── test_previews.py                              # Validates HTML preview files & brand tokens
│   └── test_uniqueness_matrix.py                     # Validates 100% uniqueness across 6 designs
│
├── data/                                             # Telecom Domain Data & Reference Research
│   ├── telecom_services_elaborated.json              # Deep domain specifications (A2P, SMPP, CLI, DLR)
│   └── reference_sites_analysis.md                   # Structural design analysis of reference sites
│
└── waste/                                            # Scratchpad, logs, and deprecated notes
    └── scrap_notes.md                                # Archive scratchpad
```

---

## 🎨 6 Unique Design Breakdown

| Option | Style DNA | Hero Layout | Services Pattern | Signature Interactive Widget | Footer Style |
|---|---|---|---|---|---|
| **Option 1** | Enterprise CPaaS (Sinch / Twilio) | 55/45 Split | 2x2 equal grid with orange left border | Interactive World Carrier Network Visual (Light theme, animated packets, Dubai HQ pulses) | 4-Column Grid |
| **Option 2** | Global Carrier Hub (Fortuna Messaging / Telnyx) | Centered full-width with world mesh | 3x2 numbered grid with top accent | Interactive SVG Map with 7 hoverable latency nodes | 3-Column Minimal |
| **Option 3** | Precision Voice & SMS Engine (Orange + Navy + Slate) | 55/45 Split | 3-Card Transactional SMS Pipeline Grid | Interactive Live SMS Ingestion Simulator & HD Voice Waveform Spectrogram | 4-Column Deep Navy Footer |
| **Option 4** | Modern Bento Grid (Apple / Zenso Digital) | 60/40 Split + overlapping stats | Asymmetric mosaic (2 large + 4 small) | Interactive Volume & TPS Capacity Slider | 1-Row Compact |
| **Option 5** | Routing Studio & Telemetry Deck (FinTech / Engineering Studio) | 55/45 Editorial Split | Route Physics 3-Card Mosaic | Interactive Route Inspector & Audio-Visual Codec Spectrogram | Editorial Studio Footer |
| **Option 6** | Liquid Spatial CPaaS (iOS 26 / One UI 9 Liquid-Morphism) | 55/45 Spatial Glass Split | One UI 9 4-Tile Grid | Spatial 3D Telemetry Control Island with tactile toggles & Dynamic Island | Floating Liquid Glass Footer |

---

## 🚀 How to Run & Preview

### Local Preview
Open `index.html` directly in any web browser, or run a local static server:
```bash
# Python
python -m http.server 8000

# or npx
npx serve .
```

### Running QA Validation Tests
```bash
# Validate Elementor JSON schema & ID uniqueness
python test/validate_json_schema.py

# Validate HTML previews & brand colors
python test/test_previews.py

# Verify 100% architectural uniqueness
python test/test_uniqueness_matrix.py
```

### Importing into WordPress Elementor
1. Go to **WordPress Admin &rarr; Templates &rarr; Saved Templates**.
2. Click **Import Templates** at the top.
3. Select any of the JSON files from the `elementor-json/` directory.
4. Create a new page, set template to **Elementor Full Width**, and insert your imported template.

---

## 🔒 Brand Identity Rules
- **Brand Orange**: `#F26522` (primary CTA & accent badges)
- **Dark Text**: `#1A1A2E` (headings) / `#5A6370` (body copy)
- **Light Theme Only**: `#FFFFFF` (primary) and `#F8F9FB` (secondary alternating)
- **Typography**: `Plus Jakarta Sans` (Display), `Inter` (Body), `JetBrains Mono` (Badges/APIs)
