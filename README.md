# Kimosha Telecom — Global Carrier Hub (Next.js)

Official Next.js production web application for **Kimosha Telecom** (Wholesale SMS & Voice Provider), built based on the client-approved **Option 2: Global Carrier Hub** architecture.

---

## 📁 Repository Structure

```
KImosha/
├── kimosha-app/                                      # Next.js Production Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js                             # Root layout, Google Fonts & SEO metadata
│   │   │   ├── page.js                               # Assembled Global Carrier Hub page
│   │   │   └── globals.css                           # Vanilla CSS design system tokens & animations
│   │   └── components/
│   │       ├── Navbar.jsx                            # Sticky navigation & Connect NOC CTA
│   │       ├── Hero.jsx                              # Full-width centered hero with SVG carrier network
│   │       ├── CarrierMarquee.jsx                    # Infinite CSS ticker of regional routes
│   │       ├── ServicesGrid.jsx                      # 3x2 wholesale services portfolio grid
│   │       ├── CarrierNetworkMap.jsx                 # Interactive SVG PoP Map with live node tooltips
│   │       ├── TechnicalSpecs.jsx                    # 3-column carrier telecom compliance standards
│   │       ├── Testimonial.jsx                       # Wholesale carrier partner quote
│   │       ├── CtaBanner.jsx                         # High-contrast orange gradient banner
│   │       ├── InterconnectForm.jsx                  # Interactive bilateral onboarding form
│   │       └── Footer.jsx                            # 3-column telecom footer
│   ├── public/                                       # Static assets (Kimosha-logo.png)
│   ├── package.json                                  # Next.js app package manifest
│   └── next.config.mjs                               # Next.js configuration
│
├── package.json                                      # Root monorepo workspace manifest
├── vercel.json                                       # Vercel deployment configuration
├── README.md                                         # Master Project Documentation
├── Kimosha-logo.png                                  # Brand Logo
├── Kimosha-Telecom-Build-Guide.md                    # Domain Build Specification Guide
│
├── data/                                             # Telecom Domain Data & Research
│   ├── telecom_services_elaborated.json              # Deep domain specifications (A2P, SMPP, CLI, DLR)
│   └── reference_sites_analysis.md                   # Structural analysis of reference sites
│
└── waste/                                            # Legacy archive & scratchpad
    └── legacy-showcase/                              # Archived 6-option demo showcase & HTML previews
```

---

## 🚀 Running Locally

```bash
# From the root directory:
npm run dev

# Or directly in kimosha-app:
cd kimosha-app
npm run dev
```

Visit `http://localhost:3000` to view the application.

---

## ⚡ Deploying to Vercel

1. Push to GitHub: `https://github.com/gigastorage70-web/Kimosha-demo.git`
2. In Vercel, import the project.
3. Vercel automatically builds and deploys the Next.js application using the root `package.json` and `vercel.json` configuration.

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
