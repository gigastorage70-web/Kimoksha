# Kimosha Telecom — Complete MVP Build Guide
## 5 Sample Website Designs · Elementor JSON + HTML Preview · Wholesale SMS & Voice Provider

---

> **Purpose of this document**: This is a complete, step-by-step procedure guide to be fed into **Antigravity** for building the **Kimosha Telecom** MVP website showcase. It replicates and improves upon the exact workflow used for the **Text-Telecom** project, with all lessons learned, error handling, and theme adaptations for the new client.

> **Client**: Kimosha Telecom — Wholesale SMS and Voice Provider  
> **Deliverables**: 5 sample website designs, each with:
> 1. **Elementor-importable JSON file** (WordPress compatible)
> 2. **Standalone HTML preview file** (browser-viewable)
> 3. **Unified index.html showcase** to view all 5 in one place for MVP approval

> **!!! CRITICAL UNIQUENESS RULE !!!**  
> Each of the 5 sample websites MUST be a **completely unique, independently designed webpage**. This is NOT about creating one base template and making 5 variants with minor widget swaps. Each option must have:
> - Its own **unique layout structure** (different section ordering, column splits, grid patterns)
> - Its own **unique hero design** (different visual hierarchy, copy treatment, CTA placement)
> - Its own **unique services presentation** (grid vs list vs bento vs timeline vs cards)
> - Its own **unique interactive element** in the hero section
> - Its own **unique navigation style** and footer design
> - Its own **unique section types** (not all 5 need the same sections)
> - All 5 share ONLY the brand color palette, typography system, and company content
>
> Use the **UI/UX Pro MCP tool** (`https://github.com/redf0x1/ui-ux-pro-mcp.git`) for design inspiration, landing page patterns, color validation, and layout recommendations. See Section 14 for setup and usage.

---

## TABLE OF CONTENTS

1. [Brand Identity & Color Palette (from Logo)](#1-brand-identity--color-palette-from-logo)
2. [Design Theme & UI/UX Direction](#2-design-theme--uiux-direction)
3. [Project File Structure](#3-project-file-structure)
4. [Phase 1: Content Extraction & Planning](#4-phase-1-content-extraction--planning)
5. [Phase 2: Build 5 Preview HTML Files](#5-phase-2-build-5-preview-html-files)
6. [Phase 3: Build Elementor JSON Generator Script](#6-phase-3-build-elementor-json-generator-script)
7. [Phase 4: Build the Unified Showcase index.html](#7-phase-4-build-the-unified-showcase-indexhtml)
8. [Phase 5: Deployment Configuration](#8-phase-5-deployment-configuration)
9. [Elementor JSON Schema — Complete Reference](#9-elementor-json-schema--complete-reference)
10. [Common Errors & How to Fix Them](#10-common-errors--how-to-fix-them)
11. [5 COMPLETELY UNIQUE Sample Site Designs](#11-5-completely-unique-sample-site-designs-for-kimosha-telecom)
12. [Content Sources & Reference Links](#12-content-sources--reference-links)
13. [Pre-Flight Checklist](#13-pre-flight-checklist)
14. [UI/UX Pro MCP Tool — Design Intelligence](#14-uiux-pro-mcp-tool--design-intelligence)

---

## 1. Brand Identity & Color Palette (from Logo)

### Logo Analysis: `Kimosha-logo.png`

The Kimosha Telecom logo contains:
- **Icon**: A hexagonal chat bubble with signal/broadcast waves — represents messaging + connectivity
- **Wordmark**: "kimosha" in dark rounded sans-serif, "telco" in brand orange with letter-spacing
- **Primary Colors from logo**: Vibrant **Orange** (`#F26522`) and **Dark Charcoal** (`#2D2D2D`)

### Derived Color Palette — Light Theme, Minimal Dark

> **CRITICAL RULE**: This palette is light-theme dominant. Use white and near-white backgrounds. Dark colors are for text only. No dark section backgrounds. Orange is the accent — use it sparingly for buttons, badges, and highlights.

```css
:root {
  /* ——— Primary Brand Colors (from logo) ——— */
  --brand:          #F26522;   /* Kimosha Orange — primary accent */
  --brand-hover:    #E05A1A;   /* Darker hover state */
  --brand-light:    #FFF3EB;   /* Ultra-light orange tint for backgrounds */
  --brand-soft:     #FDEADB;   /* Soft orange for badges/pills */
  --brand-border:   #F9C9A6;   /* Orange-tinted border for accent cards */
  --brand-dark:     #A8420E;   /* Deep orange for small text on light bg */

  /* ——— Text Colors ——— */
  --text:           #1A1A2E;   /* Near-black — primary headings & body */
  --text-muted:     #5A6370;   /* Gray — secondary/supporting text */
  --text-soft:      #8D95A0;   /* Light gray — captions, timestamps */

  /* ——— Background Colors (LIGHT THEME ONLY) ——— */
  --bg:             #FFFFFF;   /* Pure white — primary background */
  --bg-alt:         #F8F9FB;   /* Off-white — alternating sections */
  --bg-warm:        #FEFCFA;   /* Very slight warm tint */

  /* ——— Border & Surface ——— */
  --border:         #E5E7EB;   /* Default subtle border */
  --border-light:   #F0F1F4;   /* Extra subtle border */
  --panel:          #FFFFFF;   /* Card/panel background */

  /* ——— Shadows (always light, never dark) ——— */
  --shadow-sm:      0 2px 8px rgba(26, 26, 46, 0.04);
  --shadow-md:      0 8px 24px rgba(26, 26, 46, 0.06);
  --shadow-lg:      0 16px 40px rgba(26, 26, 46, 0.08);

  /* ——— Radius Tokens ——— */
  --radius-sm:      8px;
  --radius-md:      14px;
  --radius-lg:      20px;
  --radius-full:    999px;
}
```

### Typography System

```css
/* Google Fonts to load */
/* https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap */

/* Usage */
--font-display:   'Plus Jakarta Sans', sans-serif;  /* Headings, hero text, buttons */
--font-body:      'Inter', sans-serif;               /* Body copy, paragraphs, descriptions */
--font-mono:      'JetBrains Mono', monospace;        /* Tags, labels, code snippets, API blocks */
```

### Color Usage Rules

| Element | Color | Notes |
|---------|-------|-------|
| Page backgrounds | `#FFFFFF` or `#F8F9FB` | Alternate between white & off-white per section |
| Section backgrounds | NEVER use dark | Only `--bg`, `--bg-alt`, or `--bg-warm` |
| Primary headings | `#1A1A2E` | Dark but NOT black |
| Body text | `#5A6370` | Muted gray |
| Brand accent (CTA buttons, links) | `#F26522` | The orange from the logo |
| Button text on orange bg | `#FFFFFF` | White text on orange buttons |
| Badge/pill backgrounds | `#FFF3EB` with `#F26522` text | Light orange bg, orange text |
| Card borders | `#E5E7EB` | Subtle gray borders |
| Hover states | `#E05A1A` on buttons | Slightly darker orange |
| Active/success states | `#F26522` | Same brand orange |
| SVG icons | `#F26522` (stroke) or `#1A1A2E` | Orange or dark charcoal |

---

## 2. Design Theme & UI/UX Direction

### Core Design Principles

```
Theme: "Light, Clean, Professional Telecom"
Style: Minimalistic with purpose
Animation: LOW — only subtle entrance fades and hover transitions
Color: Light backgrounds ONLY. Minimal dark. Orange accents.
Layout: Clean grid systems, generous whitespace, clear hierarchy
Icons: SVG line icons (Lucide/Feather style), stroke-based, not filled
```

### Specific Guidelines

1. **Backgrounds**: 
   - Use ONLY white (`#FFFFFF`) and near-white (`#F8F9FB`) for section backgrounds
   - NEVER use dark backgrounds for any section including footer
   - Even the footer should be light with subtle border separation

2. **Animations** (MINIMAL):
   - `transition: all 0.2s ease` on buttons and interactive elements
   - Subtle opacity fade on scroll (optional, CSS `@keyframes fadeInUp` with `animation-duration: 0.5s`)
   - No parallax, no heavy scroll animations, no GSAP
   - Hover: slight shadow lift on cards, color shift on buttons
   - SVG icons: NO animation on icons. Static display only.

3. **Typography**:
   - H1: 48-52px, weight 800, `Plus Jakarta Sans`
   - H2: 34-38px, weight 700, `Plus Jakarta Sans`
   - H3: 20-24px, weight 700, `Plus Jakarta Sans`
   - Body: 15-17px, weight 400, `Inter`, color `#5A6370`
   - Tags/Labels: 11-12px, weight 700, `JetBrains Mono`, uppercase, letter-spacing 0.06em

4. **Layout**:
   - Max content width: `1200px` (boxed)
   - Section vertical padding: `80px top / 80px bottom` (desktop), `48px` (mobile)
   - Horizontal padding: `24px`
   - Card border-radius: `14-16px`
   - Button border-radius: `999px` (full pill shape)
   - Card gap: `20-24px`

5. **Cards**:
   - White background (`#FFFFFF`)
   - 1px solid border `#E5E7EB`
   - Subtle shadow `var(--shadow-sm)`
   - `16-20px` border-radius
   - `28-32px` padding

6. **Buttons**:
   - Primary: `background: #F26522; color: #FFFFFF; border-radius: 999px; padding: 13px 26px;`
   - Secondary/Outline: `background: #FFFFFF; color: #1A1A2E; border: 1px solid #E5E7EB;`
   - On hover primary: `background: #E05A1A;`
   - On hover outline: `border-color: #F26522;`

---

## 3. Project File Structure

Create this exact file structure for the Kimosha Telecom project:

```
Kimosha-Telecom/
├── index.html                                            # Unified Showcase with 5-tab switcher
├── preview-option-1.html                                 # Option 1: Full HTML preview
├── preview-option-2.html                                 # Option 2: Full HTML preview
├── preview-option-3.html                                 # Option 3: Full HTML preview
├── preview-option-4.html                                 # Option 4: Full HTML preview
├── preview-option-5.html                                 # Option 5: Full HTML preview
├── Kimosha-Telecom-Option-1-Enterprise-CPaaS.json        # Elementor Template 1
├── Kimosha-Telecom-Option-2-Global-Carrier-Hub.json      # Elementor Template 2
├── Kimosha-Telecom-Option-3-Minimal-Voice-SMS.json       # Elementor Template 3
├── Kimosha-Telecom-Option-4-Bento-Grid-Modern.json       # Elementor Template 4
├── Kimosha-Telecom-Option-5-Wholesale-Portal.json        # Elementor Template 5
├── generate_elementor_templates.py                       # Python script to generate all 5 JSON files
├── generate_clean_elementor.py                           # Advanced version with full section coverage
├── build_elementor_opt1.py                               # Dedicated builder for Option 1 (most complex)
├── extract_content.py                                    # Utility to extract content from existing JSON
├── Kimosha-logo.png                                      # Brand logo file
├── vercel.json                                           # Vercel deployment config
├── README.md                                             # Project documentation
└── frontend-design/
    └── SKILL.md                                          # Design guidance skill file
```

---

## 4. Phase 1: Content Extraction & Planning

### Step 1: Gather Content from Reference Sites

Before building, extract real content from the reference links the client provides. Create an `extract_content.py` script to parse any existing JSON templates or scrape reference sites for:

- Company description and tagline
- Service descriptions (Wholesale SMS, A2P SMS, Voice Services, etc.)
- Contact information (office address, email, phone)
- Stats and metrics (countries covered, uptime SLA, messages/sec, etc.)
- Feature lists and differentiators

```python
# extract_content.py — Utility to extract content structure from existing Elementor JSON
import json

with open('source-template.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('extracted_data.txt', 'w', encoding='utf-8') as out:
    out.write(f"Title: {data.get('title')}\n")
    out.write(f"Type: {data.get('type')}\n")
    out.write(f"Version: {data.get('version')}\n\n")
    
    def dump_el(el, depth=0):
        indent = "  " * depth
        el_type = el.get('elType', '')
        widget_type = el.get('widgetType', '')
        cid = el.get('id', '')
        out.write(f"{indent}[{el_type.upper()}] {widget_type} (id: {cid})\n")
        
        settings = el.get('settings', {})
        for k, v in settings.items():
            if any(text_key in k for text_key in ['title', 'text', 'editor', 'heading', 'link', 'icon', 'image', 'label', 'caption', 'sub']):
                out.write(f"{indent}  * {k}: {v}\n")
            elif k in ['background_background', 'background_color', '_padding', '_margin', 'typography_typography']:
                out.write(f"{indent}  - {k}: {v}\n")
                
        for child in el.get('elements', []):
            dump_el(child, depth + 1)

    for i, sec in enumerate(data.get('content', [])):
        out.write(f"\n{'='*20} SECTION {i} {'='*20}\n")
        dump_el(sec, 0)

print("Extracted successfully!")
```

### Step 2: Define Kimosha Telecom Content

```
Company: Kimosha Telecom (kimosha telco)
Industry: Wholesale SMS and Voice Provider
Services:
  1. Wholesale SMS Termination — bulk A2P/P2P routes to 200+ countries
  2. Voice Termination (VoIP/TDM) — wholesale voice minutes, CLI pass-through
  3. A2P Enterprise Messaging — OTP, alerts, notifications, transactional SMS
  4. SMS Hubbing & Aggregation — hub-to-hub interconnects, LCR routing
  5. SMPP/HTTP API Platform — developer-friendly integration, real-time DLR
  6. Voice Broadcasting — automated IVR campaigns, mass voice notifications

Stats (use realistic telecom metrics):
  - 200+ Countries Connected
  - 99.99% Network Uptime SLA
  - 10,000+ TPS Throughput
  - 24/7 NOC Support
  - 500+ Carrier Interconnects
  - Sub-second SMS Delivery

Contact (placeholder — client will update):
  - HQ: [Client will provide]
  - Email: info@kimoshatelco.com / sales@kimoshatelco.com
  - NOC: noc@kimoshatelco.com
```

---

## 5. Phase 2: Build 5 Preview HTML Files

Each preview HTML file is a **complete, standalone, self-contained HTML page** with inline CSS and inline JS. No external CSS files, no bundling. Each file must work when opened directly in a browser.

### HTML Template Structure (for each option)

Every preview file follows this exact section structure:

```
Section 0: Top Announcement Bar (optional — thin banner)
Section 1: Hero Section (H1 + subtitle + 2 CTAs + interactive visual)
Section 2: Stats Ribbon (4 metric cards in a row)
Section 3: Services Grid (4-6 service cards in 2-3 columns)
Section 4: Comparison Table OR Feature Deep-Dive
Section 5: About Company + Mission/Vision
Section 6: Contact Form + Company Info
Section 7: Footer (4-column grid + copyright)
```

### Key HTML Rules

1. **Inline everything** — all CSS in `<style>` tags, all JS in `<script>` tags
2. **Google Fonts** — load via `<link>` in `<head>`
3. **Responsive** — include `@media` queries for tablet (<=1024px) and mobile (<=767px)
4. **No images** — use SVG inline icons (Lucide/Feather icon paths), CSS shapes, and HTML widgets
5. **Forms** — use `onsubmit="event.preventDefault()"` for demo forms
6. **Navigation** — sticky header with logo text, nav links (Services, About, Contact), and CTA button
7. **Semantic HTML** — use `<header>`, `<section>`, `<main>`, `<footer>`, `<nav>`

### Preview HTML Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kimosha Telecom | [Option Name]</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #F26522;
      --brand-hover: #E05A1A;
      --brand-light: #FFF3EB;
      --brand-soft: #FDEADB;
      --brand-dark: #A8420E;
      --text: #1A1A2E;
      --text-muted: #5A6370;
      --bg: #FFFFFF;
      --bg-alt: #F8F9FB;
      --border: #E5E7EB;
      --shadow-sm: 0 2px 8px rgba(26,26,46,0.04);
      --shadow-md: 0 8px 24px rgba(26,26,46,0.06);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }
    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* === HEADER === */
    /* ... navigation styles ... */

    /* === HERO === */
    /* ... hero styles ... */

    /* === SERVICES === */
    /* ... services grid styles ... */

    /* === CONTACT === */
    /* ... contact/form styles ... */

    /* === FOOTER === */
    /* ... footer styles ... */

    /* === RESPONSIVE === */
    @media (max-width: 1024px) { /* tablet overrides */ }
    @media (max-width: 767px) { /* mobile overrides */ }
  </style>
</head>
<body>
  <!-- Top Bar (optional) -->
  <!-- Sticky Navigation -->
  <header>...</header>

  <!-- Hero Section -->
  <section id="hero">...</section>

  <!-- Stats Ribbon -->
  <section id="stats">...</section>

  <!-- Services Grid -->
  <section id="services">...</section>

  <!-- About / Why Choose Us -->
  <section id="about">...</section>

  <!-- Contact Section -->
  <section id="contact">...</section>

  <!-- Footer -->
  <footer>...</footer>

  <script>
    // Form handling, interactive widgets, live counters
  </script>
</body>
</html>
```

---

## 6. Phase 3: Build Elementor JSON Generator Script

### Elementor JSON Generator — Core Pattern

The generator is a Python script that programmatically builds the Elementor-compatible JSON structure. This is the **most error-prone** part of the build. Follow these rules exactly.

```python
# generate_elementor_templates.py
import json
import uuid

def gen_id():
    """Generate 8-char hex ID for each element — Elementor requires unique IDs"""
    return uuid.uuid4().hex[:8]

def make_container(elements=None, settings=None, is_inner=False):
    """Create an Elementor Flexbox Container element"""
    return {
        "id": gen_id(),
        "elType": "container",
        "isInner": is_inner,
        "settings": settings or {},
        "elements": elements or []
    }

def make_widget(widget_type, settings=None):
    """Create an Elementor Widget element"""
    return {
        "id": gen_id(),
        "elType": "widget",
        "isInner": False,
        "widgetType": widget_type,
        "settings": settings or {},
        "elements": []
    }
```

### JSON Document Top-Level Structure

```python
doc = {
    "version": "0.4",              # MUST be "0.4" for Elementor 3.x+
    "title": "Kimosha-Telecom-Option-1-Enterprise-CPaaS",
    "type": "page",                # MUST be "page"
    "content": [                   # Array of top-level containers (sections)
        section_0,
        section_1,
        section_2,
        # ...
    ],
    "page_settings": {
        "hide_title": "yes"        # Optional: hide WordPress page title
    }
}
```

### Building Sections — Pattern from Text-Telecom

Every section follows this nesting pattern:

```
Top-level Container (full-width, is_inner=False)
  |__ Inner Container (boxed, max-width 1200px, is_inner=True)
       |__ Content Containers and Widgets
```

#### Example: Hero Section Builder

```python
def build_hero_section():
    # Left column: text + CTAs
    left_col = make_container(
        elements=[
            make_widget("heading", {
                "title": "Wholesale SMS & Voice<br>Built for Scale.",
                "header_size": "h1",
                "title_color": "#1A1A2E",
                "typography_typography": "custom",
                "typography_font_family": "Plus Jakarta Sans",
                "typography_font_size": {"unit": "px", "size": 50},
                "typography_font_weight": "800",
                "typography_line_height": {"unit": "em", "size": 1.12}
            }),
            make_widget("text-editor", {
                "editor": '<p style="font-size:17px; color:#5A6370; line-height:1.65;">Kimosha Telecom delivers carrier-grade wholesale SMS and voice termination across 200+ countries with direct operator interconnects and sub-second delivery.</p>'
            }),
            make_container(
                elements=[
                    make_widget("button", {
                        "text": "Start Integration",
                        "link": {"url": "#contact", "is_external": False, "nofollow": False},
                        "background_color": "#F26522",
                        "button_text_color": "#FFFFFF",
                        "border_radius": {"unit": "px", "top": "999", "right": "999", "bottom": "999", "left": "999", "isLinked": True},
                        "text_padding": {"unit": "px", "top": "14", "right": "28", "bottom": "14", "left": "28", "isLinked": False}
                    }),
                    make_widget("button", {
                        "text": "View Services",
                        "link": {"url": "#services", "is_external": False, "nofollow": False},
                        "background_color": "#FFFFFF",
                        "button_text_color": "#1A1A2E",
                        "border_border": "solid",
                        "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1", "isLinked": True},
                        "border_color": "#E5E7EB",
                        "border_radius": {"unit": "px", "top": "999", "right": "999", "bottom": "999", "left": "999", "isLinked": True},
                        "text_padding": {"unit": "px", "top": "14", "right": "28", "bottom": "14", "left": "28", "isLinked": False}
                    })
                ],
                settings={"flex_direction": "row", "gap": {"unit": "px", "size": 16}}
            )
        ],
        settings={
            "width": {"unit": "%", "size": 55},
            "flex_direction": "column",
            "gap": {"unit": "px", "size": 18}
        }
    )

    # Right column: interactive visual widget
    right_col = make_container(
        elements=[
            make_widget("html", {
                "html": """<div><!-- Interactive hero widget HTML here --></div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 42}}
    )

    # Inner container
    inner = make_container(
        elements=[left_col, right_col],
        settings={
            "content_width": "boxed",
            "boxed_width": {"unit": "px", "size": 1200},
            "flex_direction": "row",
            "flex_wrap": "wrap",
            "justify_content": "space-between",
            "align_items": "center",
            "gap": {"unit": "px", "size": 40}
        },
        is_inner=True
    )

    # Outer container (top-level section)
    return make_container(
        elements=[inner],
        settings={
            "content_width": "full",
            "background_background": "classic",
            "background_color": "#FFFFFF",
            "padding": {"unit": "px", "top": "80", "right": "24", "bottom": "80", "left": "24", "isLinked": False}
        },
        is_inner=False
    )
```

### Generating All 5 Templates — EACH MUST BE FULLY UNIQUE

> **CRITICAL**: Unlike the Text-Telecom project where templates 2-5 were variants of template 1 with only the hero widget swapped, the Kimosha Telecom project requires **5 completely independent, ground-up webpage designs**. Each `create_template_X()` function MUST build its own unique:
> - Section structure (different number and order of sections)
> - Layout patterns (different column splits, grid systems)
> - Hero design (different visual hierarchy and interactive widget)
> - Services presentation (grid vs bento vs timeline vs accordion vs list)
> - Navigation and footer styles
> - Unique section types not found in other options
>
> DO NOT copy Template 1 and modify it. Build each from scratch using `make_container()` and `make_widget()` helpers.

```python
# IMPORTANT: Each create_template_X function must be a FULLY INDEPENDENT build.
# DO NOT do: t = create_template_1(); t["title"] = "..."; return t
# INSTEAD: Build every section from scratch per option.

def create_template_1():
    """Option 1: Enterprise CPaaS — Split hero, horizontal stats, 2-col services grid"""
    content = []
    # Build ALL sections from scratch for this specific layout
    # ... (unique hero, unique stats, unique services, unique contact, unique footer)
    return {"version": "0.4", "title": "...", "type": "page", "content": content, "page_settings": {}}

def create_template_2():
    """Option 2: Carrier Network Hub — Full-width hero, interactive map, 3-col services"""
    content = []
    # Build ALL sections from scratch — completely different layout from Option 1
    return {"version": "0.4", "title": "...", "type": "page", "content": content, "page_settings": {}}

def create_template_3():
    """Option 3: Minimal Voice+SMS — Centered hero, no split, timeline services"""
    content = []
    # Build ALL sections from scratch — unique minimalist approach
    return {"version": "0.4", "title": "...", "type": "page", "content": content, "page_settings": {}}

def create_template_4():
    """Option 4: Bento Grid — Asymmetric bento hero, mosaic services, accordion FAQ"""
    content = []
    # Build ALL sections from scratch — unique bento grid system
    return {"version": "0.4", "title": "...", "type": "page", "content": content, "page_settings": {}}

def create_template_5():
    """Option 5: Wholesale Portal — Data-table hero, rate matrix, portal-style nav"""
    content = []
    # Build ALL sections from scratch — unique B2B portal design
    return {"version": "0.4", "title": "...", "type": "page", "content": content, "page_settings": {}}

templates = {
    1: {"name": "Enterprise-CPaaS", "fn": create_template_1},
    2: {"name": "Global-Carrier-Hub", "fn": create_template_2},
    3: {"name": "Minimal-Voice-SMS", "fn": create_template_3},
    4: {"name": "Bento-Grid-Modern", "fn": create_template_4},
    5: {"name": "Wholesale-Portal", "fn": create_template_5},
}

for num, info in templates.items():
    template = info["fn"]()
    filename = f"Kimosha-Telecom-Option-{num}-{info['name']}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(template, f, indent=2)
    print(f"Generated: {filename}")
```

---

## 7. Phase 4: Build the Unified Showcase index.html

The `index.html` is a **meta-showcase** that loads all 5 preview options inside iframes with a tab switcher bar. This is the **client approval interface**.

### index.html Features

1. **Header Bar** with:
   - Brand logo badge (KT in orange `#F26522`)
   - Title: "Kimosha Telecom Redesign Showcase"
   - Subtitle badge: "5 Light-Theme Options + Elementor JSON"

2. **5 Option Tab Buttons** — pill-style toggle buttons

3. **Responsive Viewport Switcher** — Desktop / Tablet / Mobile buttons

4. **Action Links**:
   - "Open in New Tab" — opens current preview in new tab
   - "Download Elementor JSON" — downloads current option's JSON file

5. **Preview Stage** — full-height iframe that loads the selected preview HTML

### index.html Template (adapted from Text-Telecom)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kimosha Telecom &bull; 5 Modern Light-Theme Redesigns Showcase</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #F8F9FB;
      --panel: #FFFFFF;
      --brand: #F26522;
      --brand-dark: #A8420E;
      --text: #1A1A2E;
      --text-muted: #5A6370;
      --border: #E5E7EB;
      --shadow: 0 4px 20px rgba(26, 26, 46, 0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .showcase-header {
      background: var(--panel);
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
      z-index: 50;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand-area { display: flex; align-items: center; gap: 12px; }
    .logo-badge {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--brand); color: #FFFFFF;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 15px;
    }
    .brand-title { font-size: 16px; font-weight: 800; }
    .brand-subtitle {
      font-size: 12px; color: var(--brand-dark); font-weight: 600;
      background: #FFF3EB; padding: 2px 8px; border-radius: 999px;
    }

    .option-tabs {
      display: flex; background: var(--bg); padding: 4px;
      border-radius: 999px; border: 1px solid var(--border); gap: 4px;
    }
    .opt-btn {
      padding: 8px 16px; border-radius: 999px; border: none;
      background: transparent; font-family: inherit; font-size: 13px;
      font-weight: 700; color: var(--text-muted); cursor: pointer;
      transition: all 0.2s; white-space: nowrap;
    }
    .opt-btn:hover { color: var(--text); }
    .opt-btn.active {
      background: #FFFFFF; color: var(--text);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .viewport-controls {
      display: flex; align-items: center; gap: 6px;
      background: var(--bg); padding: 4px 8px;
      border-radius: 8px; border: 1px solid var(--border);
    }
    .view-btn {
      padding: 6px 10px; border: none; background: transparent;
      border-radius: 6px; cursor: pointer; color: var(--text-muted);
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 600;
    }
    .view-btn.active {
      background: #FFFFFF; color: var(--text);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }

    .action-links { display: flex; align-items: center; gap: 10px; }
    .btn-action {
      font-size: 12.5px; font-weight: 700; padding: 7px 14px;
      border-radius: 999px; text-decoration: none;
      display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.2s;
    }
    .btn-action-primary { background: var(--brand); color: #FFFFFF; }
    .btn-action-primary:hover { background: #E05A1A; }
    .btn-action-outline {
      background: #FFFFFF; border: 1px solid var(--border); color: var(--text);
    }
    .btn-action-outline:hover { border-color: var(--brand); }

    .preview-stage {
      flex: 1; display: flex; justify-content: center; align-items: center;
      padding: 16px; background: #F0F1F4; overflow: hidden;
    }
    .iframe-wrapper {
      width: 100%; height: 100%; background: #FFFFFF;
      border-radius: 12px; border: 1px solid var(--border);
      box-shadow: var(--shadow);
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden; display: flex; flex-direction: column;
    }
    iframe { width: 100%; height: 100%; border: none; }

    .viewport-desktop { width: 100%; max-width: 100%; }
    .viewport-tablet { width: 768px; max-width: 100%; }
    .viewport-mobile { width: 390px; max-width: 100%; }
  </style>
</head>
<body>
  <header class="showcase-header">
    <div class="brand-area">
      <div class="logo-badge">KT</div>
      <div>
        <div class="brand-title">Kimosha Telecom Redesign Showcase</div>
        <span class="brand-subtitle">5 Light-Theme Options + Elementor JSON</span>
      </div>
    </div>

    <div class="option-tabs">
      <button class="opt-btn active" onclick="loadOption(1, this)">1. Enterprise CPaaS</button>
      <button class="opt-btn" onclick="loadOption(2, this)">2. Global Carrier Hub</button>
      <button class="opt-btn" onclick="loadOption(3, this)">3. Minimal Voice+SMS</button>
      <button class="opt-btn" onclick="loadOption(4, this)">4. Bento Grid</button>
      <button class="opt-btn" onclick="loadOption(5, this)">5. Wholesale Portal</button>
    </div>

    <div class="viewport-controls">
      <button class="view-btn active" onclick="setViewport('desktop', this)">Desktop</button>
      <button class="view-btn" onclick="setViewport('tablet', this)">Tablet</button>
      <button class="view-btn" onclick="setViewport('mobile', this)">Mobile</button>
    </div>

    <div class="action-links">
      <a id="openTabLink" href="preview-option-1.html" target="_blank"
         class="btn-action btn-action-outline">Open in New Tab</a>
      <a id="elementorJsonLink"
         href="Kimosha-Telecom-Option-1-Enterprise-CPaaS.json" download
         class="btn-action btn-action-primary">Download Elementor JSON</a>
    </div>
  </header>

  <main class="preview-stage">
    <div class="iframe-wrapper viewport-desktop" id="frameWrapper">
      <iframe id="previewFrame" src="preview-option-1.html"></iframe>
    </div>
  </main>

  <script>
    const options = {
      1: { preview: 'preview-option-1.html', json: 'Kimosha-Telecom-Option-1-Enterprise-CPaaS.json' },
      2: { preview: 'preview-option-2.html', json: 'Kimosha-Telecom-Option-2-Global-Carrier-Hub.json' },
      3: { preview: 'preview-option-3.html', json: 'Kimosha-Telecom-Option-3-Minimal-Voice-SMS.json' },
      4: { preview: 'preview-option-4.html', json: 'Kimosha-Telecom-Option-4-Bento-Grid-Modern.json' },
      5: { preview: 'preview-option-5.html', json: 'Kimosha-Telecom-Option-5-Wholesale-Portal.json' },
    };

    function loadOption(num, btn) {
      document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const opt = options[num];
      document.getElementById('previewFrame').src = opt.preview;
      document.getElementById('openTabLink').href = opt.preview;
      document.getElementById('elementorJsonLink').href = opt.json;
    }

    function setViewport(type, btn) {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('frameWrapper').className = 'iframe-wrapper viewport-' + type;
    }
  </script>
</body>
</html>
```

---

## 8. Phase 5: Deployment Configuration

### Vercel Config (`vercel.json`)

```json
{
  "version": 2,
  "name": "kimosha-telecom-demo",
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Deployment Steps

1. Initialize git: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Kimosha Telecom MVP - 5 design options"`
4. Push to GitHub
5. Connect to Vercel or deploy: `npx vercel --prod`

---

## 9. Elementor JSON Schema — Complete Reference

### Critical Schema Rules

> **CAUTION**: These are the exact rules that caused errors in the Text-Telecom project. Follow them precisely or Elementor will reject the import.

#### 1. Top-Level Document Structure

```json
{
  "version": "0.4",
  "title": "Template Name",
  "type": "page",
  "content": [],
  "page_settings": {}
}
```

- `version` MUST be `"0.4"` (string, not number)
- `type` MUST be `"page"`
- `content` is an array of **top-level containers** (sections)

#### 2. Element ID Rules

- Every element MUST have a unique `"id"` field
- Use `uuid.uuid4().hex[:8]` to generate 8-character hex IDs
- **NEVER reuse IDs** — Elementor silently breaks if IDs collide

#### 3. Container vs Widget

```
Container (elType: "container"):
  - Can contain other containers and widgets
  - Has "elements" array
  - Has "isInner" boolean (True for nested, False for top-level section)
  - Supports flex properties: flex_direction, flex_wrap, gap, etc.

Widget (elType: "widget"):
  - Leaf nodes — cannot contain other elements
  - "elements" must be an empty array []
  - Has "widgetType" field ("heading", "text-editor", "button", "html", "divider")
  - "isInner" is always False
```

#### 4. Padding/Margin Format

```json
{
  "padding": {
    "unit": "px",
    "top": "80",
    "right": "24",
    "bottom": "80",
    "left": "24",
    "isLinked": false
  }
}
```

> **WARNING**: The values for top/right/bottom/left MUST be **strings**, not numbers! `"80"` not `80`.  
> `isLinked` is a boolean: use `false` (not Python `False`). Python's `json.dump` handles this automatically.

#### 5. Width/Size Format

```json
{
  "width": {"unit": "%", "size": 55},
  "boxed_width": {"unit": "px", "size": 1200},
  "typography_font_size": {"unit": "px", "size": 50}
}
```

> `size` here IS a number (int or float), not a string.

#### 6. Border Format

```json
{
  "border_border": "solid",
  "border_width": {
    "unit": "px",
    "top": "1", "right": "1", "bottom": "1", "left": "1",
    "isLinked": true
  },
  "border_color": "#E5E7EB",
  "border_radius": {
    "unit": "px",
    "top": "14", "right": "14", "bottom": "14", "left": "14",
    "isLinked": true
  }
}
```

#### 7. Typography Settings

```json
{
  "typography_typography": "custom",
  "typography_font_family": "Plus Jakarta Sans",
  "typography_font_size": {"unit": "px", "size": 50},
  "typography_font_weight": "800",
  "typography_line_height": {"unit": "em", "size": 1.15}
}
```

#### 8. Background Settings

```json
{
  "background_background": "classic",
  "background_color": "#FFFFFF"
}
```

> You MUST set `background_background` alongside `background_color` or the color is ignored.

#### 9. Gap (Flexbox Spacing)

Simple format:
```json
{ "gap": {"unit": "px", "size": 24} }
```

Column/row format:
```json
{ "gap": {"column": "24", "row": "24", "unit": "px"} }
```

#### 10. Widget Types Available

| Widget Type | Key Settings |
|-------------|-------------|
| `heading` | `title`, `header_size` (h1-h6), `title_color`, typography settings |
| `text-editor` | `editor` (HTML string) |
| `button` | `text`, `link`, `background_color`, `button_text_color`, border, padding |
| `html` | `html` (raw HTML string — for complex interactive widgets) |
| `divider` | `color`, `width`, `gap` |
| `image` | `image` (requires WordPress media library — avoid in portable templates) |
| `icon` | `icon` (requires Elementor icon library — use SVG in HTML widget instead) |

---

## 10. Common Errors & How to Fix Them

### Error Registry from Text-Telecom Project

> **IMPORTANT**: These are real errors encountered during the Text-Telecom build. Each one wasted time. Avoid them.

---

#### ERROR 1: `isInner` Flag Misuse

**Problem**: Top-level sections had `isInner: true`, causing Elementor to nest them incorrectly.

**Fix**: 
- Top-level containers (sections): `"isInner": false`
- All nested containers inside sections: `"isInner": true`

```python
# Top-level sections
make_container(elements=[...], settings={...}, is_inner=False)

# Inner containers (columns, rows, card wrappers)
make_container(elements=[...], settings={...}, is_inner=True)
```

---

#### ERROR 2: Missing `"elements": []` on Widgets

**Problem**: Widget elements were created without the `"elements"` key, causing import failure.

**Fix**: Every widget MUST have `"elements": []` even though widgets can't contain children.

```python
def make_widget(widget_type, settings=None):
    return {
        "id": gen_id(),
        "elType": "widget",
        "isInner": False,
        "widgetType": widget_type,
        "settings": settings or {},
        "elements": []     # <-- ALWAYS include this
    }
```

---

#### ERROR 3: Inline HTML Escaping in `"editor"` Field

**Problem**: Double quotes inside the `editor` HTML string broke JSON serialization.

**Fix**: Use single quotes for HTML attributes inside the editor string. Python's `json.dump` will handle double-quote escaping automatically when the string value itself uses double quotes:

```python
# SAFE — single quotes in inline styles
"editor": "<p style='color:#5A6370; font-size:17px;'>Body text here.</p>"

# ALSO SAFE — json.dump handles the escaping
"editor": '<p style="color:#5A6370;">Body text here.</p>'
```

---

#### ERROR 4: `version` as Number Instead of String

**Problem**: `"version": 0.4` was rejected by Elementor.

**Fix**: Version MUST be a string: `"version": "0.4"`

---

#### ERROR 5: `background_background` Missing When Setting Color

**Problem**: Setting `background_color` without `background_background` had no effect.

**Fix**: Always set both:
```python
settings = {
    "background_background": "classic",  # <-- REQUIRED
    "background_color": "#FFFFFF"
}
```

---

#### ERROR 6: Complex HTML Widgets Not Rendering

**Problem**: Large HTML blocks in the `html` widget type were truncated or malformed.

**Fix**:
1. Use Python triple-quoted strings for large HTML blocks
2. Validate HTML is complete (no unclosed tags)
3. Test the HTML standalone in a browser first
4. Avoid deeply nested inline styles — keep HTML widget content relatively flat

---

#### ERROR 7: Font Family Not Loading

**Problem**: Custom fonts specified in JSON didn't render because WordPress didn't load them.

**Fix**: 
1. In preview HTML, fonts load via Google Fonts `<link>` tag — this always works.
2. In Elementor, the font MUST be either:
   - A Google Font (Elementor auto-loads registered Google Fonts)
   - OR pre-installed in the WordPress theme
3. Stick to common Google Fonts: `Plus Jakarta Sans`, `Inter`, `Space Grotesk`, `Outfit`

---

#### ERROR 8: Button Link Format

**Problem**: Button links formatted as plain strings were ignored.

**Fix**: Links MUST be objects:
```json
{
  "link": {
    "url": "#contact",
    "is_external": false,
    "nofollow": false
  }
}
```

---

#### ERROR 9: Responsive Settings Not Applying

**Problem**: Tablet and mobile overrides weren't working in the JSON.

**Fix**: Use Elementor's responsive suffixes:
```python
settings = {
    "width": {"unit": "%", "size": 50},           # Desktop
    "width_tablet": {"unit": "%", "size": 100},    # Tablet
    "width_mobile": {"unit": "%", "size": 100},    # Mobile
    "flex_direction": "row",                        # Desktop
    "flex_direction_tablet": "column",              # Tablet
}
```

---

#### ERROR 10: Flex Container `content_width` Confusion

**Problem**: Using `"content_width": "boxed"` with `"boxed_width"` on inner containers caused double-boxing.

**Fix**:
- **Top-level sections**: `"content_width": "full"` — always full width
- **Inner wrapper**: use `"container_max_width": {"unit": "px", "size": 1200}` for boxing
- OR use `"content_width": "boxed"` with `"boxed_width"` on the inner container (not both outer and inner)

---

#### ERROR 11: `text-editor` vs `heading` Widget Confusion

**Problem**: Used `heading` widget with inline HTML — Elementor stripped the HTML tags.

**Fix**:
- `heading` widget: Use for clean text titles. Only supports the `title` field (limited HTML like `<span>` and `<br>`)
- `text-editor` widget: Use for any rich HTML content with inline styles
- `html` widget: Use for complex interactive widgets with JavaScript

---

#### ERROR 12: JSON File Too Large for Elementor Import

**Problem**: Option 1 JSON (238KB) caused timeout on some WordPress hosts.

**Fix**:
1. Minimize HTML widget content — remove unnecessary whitespace
2. Use CSS classes in a `<style>` block inside one HTML widget at top instead of repeated inline styles
3. Keep JSON under 200KB if possible
4. If over 200KB, increase WordPress `upload_max_filesize` and `max_execution_time`

---

## 11. 5 COMPLETELY UNIQUE Sample Site Designs for Kimosha Telecom

> **MANDATORY RULE**: Each option below is a fully independent webpage design. They share the Kimosha brand palette (`#F26522` orange, `#1A1A2E` text, light backgrounds) and company content, but everything else — layout, section order, hero style, services presentation, navigation, footer, interactive elements — is UNIQUE per option. DO NOT build one base template and create variants.
>
> Use the `ui-ux-pro-mcp` tool (see Section 14) to query for design patterns:
> - `search_landing` — for landing page layout patterns
> - `search_ui_styles` — for component styles
> - `get_design_system` — for complete design system generation
> - `search_ux_guidelines` — for UX best practices

---

### OPTION 1: Enterprise CPaaS Platform
> *Design DNA: Twilio / Sinch / MessageBird enterprise SaaS*  
> *UI/UX MCP Query: `get_design_system` with query "SaaS enterprise telecom platform light mode"*

#### Unique Layout Structure
```
[Top Announcement Bar] → thin, dismissible, brand-light bg
[Sticky Nav] → logo left, 4 text links center, orange CTA right
[Hero] → 55/45 split: left text column, right API terminal card
[Stats Ribbon] → 4 horizontal cards on gray bar
[Services Grid] → 2x2 card grid, equal-size cards
[Comparison Table] → full-width data table with column highlights
[About + Pillars] → 50/50 split: left copy, right 4 stacked pillar cards
[Contact] → centered header, then 45/55 split: info card / form
[Footer] → 4-column grid on off-white
```

#### Unique Design Elements
- **Navigation**: Clean horizontal nav with text links + single orange pill CTA button
- **Hero**: Classic SaaS split — left column has eyebrow badge pill, H1, subtitle, 2 CTAs (pill buttons). Right column has a **dark-background API code terminal** (the ONLY dark element on the page) showing cURL request + response with syntax highlighting
- **Stats**: Horizontal ribbon with 4 bordered white cards showing big number + label, on `#F8F9FB` bg
- **Services**: 2x2 grid of equal cards. Each card has: numbered tag (01, 02...), H3 title, description, bottom pill tags. Cards have subtle left-border accent in orange
- **Comparison Table**: Full-width HTML table comparing "Kimosha Direct" vs "Standard Aggregators" across 6 features. Kimosha column has light orange highlight
- **About Section**: Left side has company story with mission/vision in orange-left-bordered quote blocks. Right side has 4 pillar cards (Reliability, Transparency, Innovation, Dedicated Team) with SVG check icons
- **Contact**: Centered section header, then split — left: company address/email/NOC info card. Right: multi-field form with pill submit button
- **Footer**: 4-column (brand description, Core Services links, Company links, Newsletter signup)
- **Interactive Widget**: API terminal card with tab switcher (cURL / Node.js / Python), live delivery status indicator

#### Unique Section IDs & Count: 9 sections

---

### OPTION 2: Global Carrier Network Hub
> *Design DNA: Fortuna Messaging / Telnyx / Carrier-grade interconnect portal*  
> *UI/UX MCP Query: `search_landing` with query "telecom carrier network global hub"*

#### Unique Layout Structure
```
[Full-Width Hero] → stacked: centered headline over SVG network map background
[Scrolling Logo Ticker] → partner/carrier logo marquee strip
[Services] → 3x2 grid of numbered cards with monospace tags
[Network Coverage] → full-width interactive SVG world map
[Technical Specs] → 3-column feature comparison cards
[Testimonial/Trust] → single large quote block with client attribution
[CTA Banner] → full-width orange gradient banner with centered CTA
[Contact] → centered form (no split)
[Footer] → 3-column minimal footer
```

#### Unique Design Elements
- **Navigation**: Logo + hamburger-style minimal nav (only 3 links + CTA). Different from Option 1's full horizontal nav
- **Hero**: FULL-WIDTH centered layout (NOT split). Large centered H1 over a **light SVG world map illustration** as decorative background. Single centered CTA button + supporting text below. No right column at all
- **Logo Ticker**: Horizontal auto-scrolling marquee of carrier/partner logos (use text placeholders like "Carrier A", "MNO B" in bordered boxes)
- **Services**: 3x2 grid (6 cards). Each card has monospace numbered tag (01 / A2P CORE), title, description, and 3 feature pills. Cards have top-border accent in orange
- **Network Coverage**: Full-width section with an **interactive SVG carrier map**. Nodes for Dubai HQ, London, Frankfurt, Singapore, New York, Johannesburg, Sao Paulo. Hover reveals tooltip with latency/route info. Pulsing animation on Dubai hub node
- **Technical Specs**: 3 feature cards side-by-side comparing Direct Routes, API Platform, and NOC Support. Each has icon, title, bullet points
- **Trust Block**: Single large centered testimonial quote with quotation marks, attribution name, company. Light orange bg
- **CTA Banner**: Full-width section with warm orange gradient, white centered H2 + CTA button. This is a UNIQUE section not in other options
- **Contact**: Centered single-column form (NOT split like Option 1)
- **Footer**: 3-column layout (different from Option 1's 4-column)
- **Interactive Widget**: SVG world map with 7 interactive hover nodes, pulsing route lines, live throughput counter

#### Unique Section IDs & Count: 10 sections (different from Option 1's 9)

---

### OPTION 3: Minimal Voice + SMS
> *Design DNA: Linear.app / Stripe / Vercel — Scandinavian precision minimalism*  
> *UI/UX MCP Query: `get_design_system` with query "minimal clean SaaS landing light theme"*

#### Unique Layout Structure
```
[Minimal Nav] → logo left, 2 text links, no CTA button in nav
[Hero] → CENTERED single column: headline, subtitle, single CTA, subtle animated underline
[Integration Roadmap] → 3-step horizontal timeline with connecting lines
[Services] → vertical alternating left-right sections (zigzag layout)
[Live Demo] → centered SMS delivery simulator widget
[Metrics Strip] → inline horizontal stat counters (no cards, just numbers)
[FAQ Accordion] → expandable Q&A section
[Contact] → minimal single-column centered form
[Footer] → 2-column ultra-minimal footer
```

#### Unique Design Elements
- **Navigation**: Ultra-minimal — just logo + 2 text links (Services, Contact). NO CTA button in nav. NO announcement bar. Clean and quiet
- **Hero**: CENTERED single-column (not split, not full-width map). Elegant centered H1 with `font-weight: 700` (not 800). Short subtitle below. Single orange CTA button centered. Below the CTA, a subtle animated SVG underline accent. Generous whitespace above and below. NO interactive widget in the hero itself
- **Integration Roadmap**: Unique to Option 3 — a 3-step horizontal timeline ("Connect" → "Configure" → "Send") with connecting dotted lines, step numbers in orange circles, brief description per step. This section replaces the stats ribbon
- **Services**: NOT a grid. Instead, uses **alternating left-right zigzag layout** — Section A has text left + visual right, Section B has visual left + text right, alternating. Each service gets its own full-width row. 4 services total, each with one thin-line SVG icon, title, description
- **Live Demo Widget**: A centered standalone section showing a **mobile phone mockup frame** with a simulated SMS message delivery. Shows: sender ID, message text, delivery timestamp, and a "DELIVERED (1.4s)" status badge. This is the interactive element, placed mid-page (NOT in the hero)
- **Metrics Strip**: Not cards — just inline horizontal numbers separated by thin vertical dividers. "200+ Countries | 99.99% Uptime | <1.2s Delivery | 24/7 NOC". Ultra-clean
- **FAQ Accordion**: Expandable Q&A section with smooth open/close animation. 5-6 questions about Kimosha services. This section is UNIQUE to Option 3
- **Contact**: Single centered column form, minimal fields (name, email, message, submit). No company info beside it
- **Footer**: 2-column only (brand + copyright left, 3 links right). Ultra-minimal
- **Animation**: Only uses CSS `transition` on accordion open/close and button hovers. No scroll animations

#### Unique Section IDs & Count: 9 sections (completely different section types from Options 1 & 2)

---

### OPTION 4: Modern Bento Grid
> *Design DNA: Apple Vision Pro site / Raycast / modern asymmetric bento*  
> *UI/UX MCP Query: `search_ui_styles` with query "bento grid modern SaaS dashboard"*

#### Unique Layout Structure
```
[Glassmorphic Nav] → semi-transparent sticky nav with backdrop-blur
[Hero] → 60/40 split with bento stat cards overlapping the hero bottom
[Bento Services Grid] → asymmetric mosaic: 2 large + 4 small cards
[Volume Calculator] → interactive widget in a centered card
[Feature Highlights] → 3 horizontal feature rows with icon+text+visual
[Client Logos] → horizontal row of client/partner logos
[Contact Bento] → bento-style: form card + 3 info cards in grid
[Footer] → single-row compact footer with inline links
```

#### Unique Design Elements
- **Navigation**: Semi-transparent with `backdrop-filter: blur(12px)` and `rgba(255,255,255,0.85)` bg. Gives a frosted-glass effect when scrolling. CTA is a small orange pill
- **Hero**: 60/40 split but with a twist — **3 small bento stat cards overlap the bottom edge** of the hero section, bridging into the next section. Creates visual depth. Left: H1 + subtitle + CTA. Right: a decorative abstract SVG mesh/wave pattern (not interactive)
- **Bento Services Grid**: The signature element — an **asymmetric bento/mosaic grid**:
  - Row 1: 1 large card (spans 2 cols) + 1 tall card (spans 2 rows)
  - Row 2: 2 small square cards + the tall card continues
  - Row 3: 1 wide card (spans full width)
  - Each card has: tag, title, description, subtle orange accent line at top
  - Cards have varied padding and content density based on size
- **Volume Calculator**: Centered section with a standalone calculator card. Shows: monthly volume input, estimated TPS output, global latency estimate, SLA tier. Uses HTML `<input type="range">` slider for volume. Results update dynamically via JS
- **Feature Highlights**: 3 horizontal rows, each with: left SVG icon in orange circle, center title + description, right decorative mini-visual. This is NOT a card grid — it's inline horizontal features
- **Client Logos**: Simple horizontal row of placeholder logos in gray (muted, professional)
- **Contact Bento**: NOT a simple split. Uses a mini bento layout:
  - Large form card (spans 2 rows)
  - Small address card (top right)
  - Small email card (middle right)
  - Small NOC hours card (bottom right)
- **Footer**: Single row — logo, 4 inline links, copyright. Extremely compact. Different from all other options
- **Animation**: Smooth CSS `transition` on bento cards hover (slight lift + shadow increase). Calculator slider has smooth value update

#### Unique Section IDs & Count: 8 sections (fewer but denser sections due to bento packing)

---

### OPTION 5: Wholesale Telecom Portal
> *Design DNA: B2B SaaS portal / Premiumy / rate-sheet enterprise tool*  
> *UI/UX MCP Query: `search_products` with query "B2B wholesale portal enterprise dashboard"*

#### Unique Layout Structure
```
[Utility Bar] → top thin bar with email + NOC status badge
[Portal Nav] → enterprise-style nav with logo, mega-menu style links, 2 CTAs
[Hero] → 50/50 split: left copy, right searchable rate matrix table
[Trust Badges] → horizontal strip of certifications/compliance badges
[Services] → tab-switchable panels (not a grid) — click tab to reveal service
[Rate Lookup] → full-width interactive country route matrix with search
[Technical Integration] → code block showcase with SMPP bind + REST examples
[Pricing Tiers] → 3-column pricing cards (Starter / Growth / Enterprise)
[Contact] → enterprise form with more fields (company size, monthly volume dropdown)
[Footer] → 5-column footer with legal links row below
```

#### Unique Design Elements
- **Utility Bar**: Unique to Option 5 — a thin top bar with left: email/phone, right: green dot + "Network Status: Operational". Professional B2B feel
- **Navigation**: Enterprise-style with more links than other options. Logo + 5 nav items (Services, Coverage, API, Pricing, Support) + 2 CTAs ("Login" outline, "Get Started" orange). This is the most complex nav across all options
- **Hero**: 50/50 split but the right side has a **live rate lookup mini-table** (not a visual widget). Shows 5 sample country routes (UAE, KSA, UK, Germany, USA) with route type, latency, and SLA percentage. Has a search input at top of the card
- **Trust Badges**: Horizontal row of compliance/certification badges (ISO 27001, GDPR, SOC2, PCI-DSS — use text placeholders in bordered pill badges). This section is UNIQUE to Option 5
- **Services Tabs**: NOT a grid. Uses a **horizontal tab bar** at the top (Wholesale SMS | A2P SMS | Voice | SMPP/API | Hubbing | Broadcasting). Clicking each tab reveals a unique content panel below with description, features list, and CTA. Only one panel visible at a time. This is completely different from all other options' services sections
- **Rate Lookup Matrix**: Full-width searchable table. Search input at top. Table columns: Country, Code, Route Type, Avg Latency, Delivery SLA, Status. Pre-populated with 10+ countries. Rows filterable by search. This is the showcase interactive element
- **Technical Integration**: Side-by-side code blocks showing SMPP 3.4 bind config (left) and REST API cURL example (right) on light code-bg with monospace font. This section is UNIQUE to Option 5
- **Pricing Tiers**: 3-column pricing cards with: tier name, monthly volume range, price-per-SMS indicator, feature checklist, CTA button. Middle card (Growth) is highlighted with orange border + "Popular" badge. This section is UNIQUE to Option 5
- **Contact**: More fields than other options — includes: Name, Email, Company, Company Size (dropdown), Monthly Volume (dropdown), Destination Countries (textarea), Submit. Enterprise-grade form
- **Footer**: 5-column layout (most columns of any option) + a secondary row below with legal links (Privacy, Terms, Cookie Policy, Acceptable Use)
- **Animation**: Table row hover highlight. Tab switch with fade transition. Search input with real-time filtering

#### Unique Section IDs & Count: 10 sections (most sections of any option, with 3 unique section types)

---

### Uniqueness Verification Matrix

| Feature | Opt 1 | Opt 2 | Opt 3 | Opt 4 | Opt 5 |
|---------|-------|-------|-------|-------|-------|
| Hero Layout | 55/45 split | Full-width centered | Single-col centered | 60/40 + overlapping bento | 50/50 + rate table |
| Nav Style | Horizontal + CTA | Minimal + hamburger | Ultra-minimal (2 links) | Glassmorphic blur | Enterprise mega-nav |
| Services | 2x2 grid | 3x2 numbered grid | Zigzag alternating rows | Asymmetric bento mosaic | Tab-switchable panels |
| Interactive Element | API terminal | SVG world map | SMS delivery simulator | Volume calculator | Searchable rate matrix |
| Unique Sections | Comparison table | CTA banner, logo ticker | Roadmap, FAQ accordion | Bento contact, calculator | Pricing tiers, code blocks, trust badges |
| Footer | 4-column | 3-column | 2-column | Single-row compact | 5-column + legal row |
| Total Sections | 9 | 10 | 9 | 8 | 10 |

---

## 12. Content Sources & Reference Links

> **Instructions**: The client will provide reference website links. When they do, visit each link and extract:

### What to Extract from Reference Sites

1. **Layout Structure** — how sections are ordered, what animations are used
2. **Copy Tone** — formal vs casual, technical depth
3. **Feature Descriptions** — how they describe SMS/Voice services
4. **Stats & Metrics** — what numbers they showcase
5. **CTAs** — button text patterns
6. **Visual Style** — card designs, color usage, icon style

### Reference Site Extraction Template

```
Reference: [URL]
Layout Notes:
  - Hero: [describe]
  - Services: [describe]
  - Differentiators: [describe]
  - CTA text: [exact text]
Copy Samples:
  - Headline: "[exact headline]"
  - Subtext: "[exact subtext]"
  - Service descriptions: [summarize]
Visual Notes:
  - Primary color: [hex]
  - Font: [name]
  - Animation style: [describe]
  - Card style: [describe]
```

### Kimosha Telecom Service Content (Draft — adapt from references)

```
Service 1: Wholesale SMS Termination
- Description: High-volume SMS termination with direct carrier routes across 200+
  countries. Competitive tiered pricing with dynamic least-cost routing and
  dedicated high-TPS bandwidth.
- Tags: Direct Routes, LCR Routing, High Volume

Service 2: Voice Termination
- Description: Premium wholesale voice minutes with CLI transparency, low PDD,
  and direct TDM/VoIP interconnects to global operators.
- Tags: VoIP/TDM, CLI Pass-through, Low PDD

Service 3: A2P Enterprise SMS
- Description: Mission-critical A2P messaging for OTP delivery, banking alerts,
  appointment reminders, and marketing campaigns with real-time DLR.
- Tags: OTP, Transactional, Real-time DLR

Service 4: SMPP/HTTP API Platform
- Description: Developer-friendly SMPP 3.4 binds and RESTful HTTP APIs with TLS
  encryption, webhook callbacks, and comprehensive documentation.
- Tags: SMPP 3.4, REST API, TLS 1.3

Service 5: SMS Hubbing
- Description: Hub-to-hub SMS interconnects for carriers and aggregators.
  Centralized traffic management with intelligent routing and quality-first
  path selection.
- Tags: Hub-to-Hub, Intelligent Routing, Quality-First

Service 6: Voice Broadcasting
- Description: Automated IVR and voice broadcast campaigns. Mass notification
  delivery with DTMF interaction support and call recording.
- Tags: IVR, Mass Voice, DTMF
```

---

## 13. Pre-Flight Checklist

### Before Starting Build

- [ ] Logo file (`Kimosha-logo.png`) is in project root
- [ ] Color palette variables defined and documented
- [ ] All 5 option concepts finalized
- [ ] Content/copy is drafted for all sections
- [ ] Reference sites have been reviewed and notes extracted
- [ ] Python 3.x is available for running generator scripts
- [ ] `ui-ux-pro-mcp` installed and configured (see Section 14)
- [ ] MCP design system queries run for each of the 5 options

### After Building Preview HTML Files

- [ ] All 5 `preview-option-X.html` files open correctly in browser
- [ ] All files are fully self-contained (no external dependencies except Google Fonts)
- [ ] Navigation links scroll to correct sections
- [ ] Forms prevent default submit and show confirmation
- [ ] Responsive layouts work at Desktop (1200px+), Tablet (768px), Mobile (390px)
- [ ] No dark backgrounds used anywhere
- [ ] Brand orange `#F26522` used consistently for CTAs and accents
- [ ] Typography matches the defined system
- [ ] Interactive hero widgets work in all 5 options
- [ ] **UNIQUENESS CHECK**: Each option has a different hero layout (verify against matrix in Section 11)
- [ ] **UNIQUENESS CHECK**: Each option has a different nav style (no two navs are identical)
- [ ] **UNIQUENESS CHECK**: Each option has a different services section pattern (grid vs zigzag vs bento vs tabs etc.)
- [ ] **UNIQUENESS CHECK**: Each option has a different footer column count
- [ ] **UNIQUENESS CHECK**: Each option has at least 1 section type not found in any other option
- [ ] **UNIQUENESS CHECK**: No two options share the same section order or count

### After Building Elementor JSON Files

- [ ] All 5 JSON files are valid JSON (`python -m json.tool filename.json`)
- [ ] `version` is `"0.4"` (string)
- [ ] `type` is `"page"`
- [ ] Every element has a unique `id`
- [ ] Top-level containers have `isInner: false`
- [ ] Inner containers have `isInner: true`
- [ ] All widgets have `"elements": []`
- [ ] `background_background` is set alongside `background_color`
- [ ] Padding/margin values are strings: `"80"` not `80`
- [ ] Button links are objects with `url`, `is_external`, `nofollow`
- [ ] File sizes are under 200KB each (aim for <150KB)
- [ ] Test import in WordPress Elementor on staging site

### After Building index.html Showcase

- [ ] Tab switcher correctly loads all 5 options
- [ ] Viewport switcher works (Desktop/Tablet/Mobile)
- [ ] "Open in New Tab" link updates per option
- [ ] "Download Elementor JSON" link updates per option
- [ ] Showcase header uses Kimosha brand colors (orange badge, warm accents)

### Deployment

- [ ] `vercel.json` is configured with correct project name
- [ ] All files are committed to git
- [ ] Deployed URL loads correctly
- [ ] All 5 options accessible via deployed URL

---

## Quick Command Reference

```bash
# Validate JSON files
python -m json.tool Kimosha-Telecom-Option-1-Enterprise-CPaaS.json > /dev/null

# Generate all 5 Elementor templates
python generate_elementor_templates.py

# Generate clean/advanced Option 1
python generate_clean_elementor.py

# Build advanced Option 1 with full sections
python build_elementor_opt1.py

# Extract content from existing template
python extract_content.py

# Deploy to Vercel
npx vercel --prod

# Start local dev server (for preview testing)
npx serve .
```

---

## Summary of Workflow Order

```
 1. Set up project directory structure
 2. Copy Kimosha-logo.png into project root
 3. Install & configure ui-ux-pro-mcp for design intelligence (Section 14)
 4. Extract content from reference sites (client provides links)
 5. Query ui-ux-pro-mcp for each option's design system/layout
 6. Build preview-option-1.html (FULLY UNIQUE design from scratch)
 7. Build preview-option-2.html (FULLY UNIQUE — different layout from Option 1)
 8. Build preview-option-3.html (FULLY UNIQUE — different layout from Options 1 & 2)
 9. Build preview-option-4.html (FULLY UNIQUE — different layout from Options 1-3)
10. Build preview-option-5.html (FULLY UNIQUE — different layout from Options 1-4)
11. Run uniqueness verification matrix to confirm no duplicated patterns
12. Build generate_elementor_templates.py (5 independent create_template_X() functions)
13. Run the generator to create all 5 JSON files
14. Validate all JSON files
15. Build index.html showcase
16. Set up vercel.json
17. Deploy and share URL with client for MVP approval
```

---

## 14. UI/UX Pro MCP Tool — Design Intelligence

### What It Is

The **UI/UX Pro MCP** tool (`https://github.com/redf0x1/ui-ux-pro-mcp.git`) is an AI-powered design intelligence server with **1,920+ curated design resources** accessible through natural language search. Use it to get design patterns, color palettes, typography recommendations, landing page structures, and UX best practices for each of the 5 unique Kimosha Telecom designs.

### Installation

#### Option A: NPX (Recommended — no install needed)
```bash
npx ui-ux-pro-mcp
```

#### Option B: Global Install
```bash
npm install -g ui-ux-pro-mcp
ui-ux-pro-mcp
```

#### Option C: From Source
```bash
git clone https://github.com/redf0x1/ui-ux-pro-mcp.git
cd ui-ux-pro-mcp
npm install
npm run build
npm start
```

### MCP Configuration

Add to your MCP settings (`mcp.json` or equivalent):

```json
{
  "mcpServers": {
    "ui-ux-pro": {
      "command": "npx",
      "args": ["ui-ux-pro-mcp", "--stdio"]
    }
  }
}
```

### Available Tools for Kimosha Telecom Design

| Tool | Use For | Example Query |
|------|---------|---------------|
| `search_landing` | Landing page layout patterns | `"SaaS telecom landing page sections"` |
| `search_ui_styles` | UI component styles | `"bento grid modern card layout"` |
| `search_colors` | Color palette validation | `"orange brand light theme SaaS palette"` |
| `search_typography` | Font pairing recommendations | `"modern SaaS heading body font pairing"` |
| `search_ux_guidelines` | UX best practices | `"enterprise B2B form design best practices"` |
| `search_icons` | Icon set recommendations | `"line icons telecom technology SVG"` |
| `search_products` | Product page patterns | `"B2B wholesale portal enterprise dashboard"` |
| `search_charts` | Data visualization | `"dashboard metrics display cards"` |
| `get_design_system` | Complete design system | `"SaaS enterprise telecom platform light mode"` |
| `search_all` | Broad design search | `"minimalist SaaS landing page light theme"` |

### Recommended Queries per Option

Use these exact queries to get design intelligence for each unique option:

```
OPTION 1 — Enterprise CPaaS:
  get_design_system: "SaaS enterprise telecom platform light mode"
  search_landing: "enterprise SaaS split hero landing page conversion"
  search_ui_styles: "API code terminal dark card light page"

OPTION 2 — Global Carrier Hub:
  get_design_system: "global network carrier telecom hub light"
  search_landing: "full width centered hero map landing page"
  search_ui_styles: "interactive map nodes hover tooltip"

OPTION 3 — Minimal Voice + SMS:
  get_design_system: "minimal clean SaaS landing light theme"
  search_landing: "minimalist centered hero timeline landing"
  search_ux_guidelines: "zigzag alternating content layout"

OPTION 4 — Bento Grid Modern:
  get_design_system: "bento grid modern SaaS dashboard light"
  search_ui_styles: "asymmetric bento mosaic card grid"
  search_ui_styles: "glassmorphic navigation sticky blur"

OPTION 5 — Wholesale Portal:
  get_design_system: "B2B wholesale portal enterprise dashboard"
  search_products: "enterprise data table searchable portal"
  search_landing: "pricing tier cards B2B SaaS comparison"
```

### How `get_design_system` Works

The `get_design_system` tool returns a complete, code-ready design system including:

1. **Color Palette** — with CSS variables and dark mode equivalents
2. **Typography** — font pairings with sizing scale
3. **Layout Recommendations** — section structure, grid patterns, spacing
4. **Component Styles** — button, card, nav, form recommendations
5. **AI Metadata** — intent classification, confidence score, matched keywords

Example response structure:
```json
{
  "_meta": {
    "query_interpretation": "SaaS enterprise telecom platform light mode",
    "detected_intent": "landing",
    "intent_confidence": 0.85,
    "matched_keyword": "landing page"
  },
  "colors": {
    "css_variables": "--primary: #F26522; --background: #FFFFFF; --text: #1A1A2E;",
    "tailwind_config": "colors: { primary: '#F26522', ... }"
  },
  "layout": {
    "source": "landing",
    "sections": ["hero", "features", "pricing", "cta", "footer"]
  }
}
```

### Integration Rule

> **IMPORTANT**: Use the MCP tool queries BEFORE building each option's HTML preview. The tool's layout and style recommendations should inform (not replace) your design decisions. Always adapt the MCP output to fit the Kimosha brand palette and light-theme constraints defined in this guide.

---

> **END OF GUIDE**  
> Feed this entire file to Antigravity with the project context and reference links.  
> The agent will follow these steps to produce all 5 COMPLETELY UNIQUE deliverables.

