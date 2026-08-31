#!/usr/bin/env python3
"""
generate_elementor_templates.py
Generates 5 completely unique, WordPress Elementor 3.x+ importable JSON templates
for Kimosha Telecom MVP website showcase.

Follows strict Elementor JSON schema rules:
1. "version": "0.4"
2. "type": "page"
3. Unique 8-char hex IDs per element
4. Top-level containers: isInner=False
5. Inner containers: isInner=True
6. Widgets have "elements": []
7. Padding/Margin values are strings ("80" not 80)
8. background_background: "classic" alongside background_color
9. Link format: {"url": "...", "is_external": False, "nofollow": False}
"""

import json
import os
import uuid

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "elementor-json")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def gen_id():
    return uuid.uuid4().hex[:8]

def make_container(elements=None, settings=None, is_inner=False):
    return {
        "id": gen_id(),
        "elType": "container",
        "isInner": is_inner,
        "settings": settings or {},
        "elements": elements or []
    }

def make_widget(widget_type, settings=None):
    return {
        "id": gen_id(),
        "elType": "widget",
        "isInner": False,
        "widgetType": widget_type,
        "settings": settings or {},
        "elements": []
    }

def make_heading(title, header_size="h2", color="#1A1A2E", font_size=36, weight="800", align="left"):
    return make_widget("heading", {
        "title": title,
        "header_size": header_size,
        "align": align,
        "title_color": color,
        "typography_typography": "custom",
        "typography_font_family": "Plus Jakarta Sans",
        "typography_font_size": {"unit": "px", "size": font_size},
        "typography_font_weight": weight,
        "typography_line_height": {"unit": "em", "size": 1.2}
    })

def make_text(html_text, color="#5A6370", font_size=16):
    return make_widget("text-editor", {
        "editor": f"<p style='color:{color}; font-size:{font_size}px; line-height:1.65;'>{html_text}</p>"
    })

def make_button(text, url="#contact", bg_color="#F26522", text_color="#FFFFFF", is_outline=False):
    settings = {
        "text": text,
        "link": {"url": url, "is_external": False, "nofollow": False},
        "background_color": "transparent" if is_outline else bg_color,
        "button_text_color": "#1A1A2E" if is_outline else text_color,
        "border_radius": {"unit": "px", "top": "999", "right": "999", "bottom": "999", "left": "999", "isLinked": True},
        "text_padding": {"unit": "px", "top": "13", "right": "28", "bottom": "13", "left": "28", "isLinked": False}
    }
    if is_outline:
        settings["border_border"] = "solid"
        settings["border_width"] = {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1", "isLinked": True}
        settings["border_color"] = "#E5E7EB"
    return make_widget("button", settings)

def make_section(inner_elements, bg_color="#FFFFFF", padding_top="80", padding_bottom="80"):
    inner = make_container(
        elements=inner_elements,
        settings={
            "content_width": "boxed",
            "boxed_width": {"unit": "px", "size": 1200},
            "flex_direction": "column",
            "gap": {"unit": "px", "size": 24}
        },
        is_inner=True
    )
    return make_container(
        elements=[inner],
        settings={
            "content_width": "full",
            "background_background": "classic",
            "background_color": bg_color,
            "padding": {"unit": "px", "top": padding_top, "right": "24", "bottom": padding_bottom, "left": "24", "isLinked": False}
        },
        is_inner=False
    )


# ==============================================================================
# OPTION 1: Enterprise CPaaS Platform (SaaS / Twilio / Sinch DNA)
# ==============================================================================
def create_template_1():
    content = []

    # Section 0: Top Announcement Bar
    announcement_html = """<div style='background:#FFF3EB; border-bottom:1px solid #F9C9A6; padding:8px 24px; font-size:13px; font-weight:600; color:#A8420E; display:flex; justify-content:center; align-items:center; gap:10px; text-align:center;'>
      <span style='background:#F26522; color:#FFF; font-size:11px; font-family:monospace; font-weight:700; padding:2px 8px; border-radius:999px;'>NEW</span>
      <span>Direct SMPP 3.4 & Tier-1 SS7 Interconnects now live in 200+ countries with sub-second delivery.</span>
    </div>"""
    content.append(make_section([make_widget("html", {"html": announcement_html})], bg_color="#FFF3EB", padding_top="0", padding_bottom="0"))

    # Section 1: Hero Section (55/45 Split)
    hero_left = make_container(
        elements=[
            make_widget("html", {"html": "<span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px; border:1px solid #F9C9A6;'>ENTERPRISE TELECOM INFRASTRUCTURE</span>"}),
            make_heading("Wholesale SMS & Voice<br><span style='color:#F26522;'>Built for Scale.</span>", header_size="h1", font_size=48),
            make_text("Kimosha Telecom delivers carrier-grade wholesale SMS termination, crystal-clear voice routes, and developer-first APIs across 200+ countries with direct operator interconnects and 99.99% SLA.", font_size=17),
            make_container(
                elements=[
                    make_button("Get Rate Card", "#contact", bg_color="#F26522"),
                    make_button("Explore Services", "#services", is_outline=True)
                ],
                settings={"flex_direction": "row", "gap": {"unit": "px", "size": 14}},
                is_inner=True
            )
        ],
        settings={"width": {"unit": "%", "size": 55}, "flex_direction": "column", "gap": {"unit": "px", "size": 18}},
        is_inner=True
    )

    hero_right = make_container(
        elements=[
            make_widget("html", {
                "html": """<div style='background:linear-gradient(160deg,#FFFFFF 0%,#FFF8F4 100%); border-radius:18px; border:1px solid #E5E7EB; padding:24px; box-shadow:0 16px 40px rgba(242,101,34,0.08); position:relative; overflow:hidden;'>
                  <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;'>
                    <span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:11px; font-weight:700; padding:3px 10px; border-radius:999px; border:1px solid #F9C9A6;'>LIVE CARRIER NETWORK</span>
                    <span style='color:#10B981; font-family:monospace; font-size:12px; font-weight:700;'>● 100% OPERATIONAL</span>
                  </div>
                  <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:20px; text-align:center; margin-bottom:14px;'>
                    <div style='font-size:32px; font-weight:800; color:#F26522;'>12,556 TPS</div>
                    <div style='font-size:12px; color:#5A6370; font-weight:600;'>Real-Time Messages Routed / Sec</div>
                  </div>
                  <div style='display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12.5px;'>
                    <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; padding:10px; text-align:center;'>
                      <strong style='color:#1A1A2E;'>200+</strong><br><span style='color:#5A6370; font-size:11px;'>Direct Countries</span>
                    </div>
                    <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; padding:10px; text-align:center;'>
                      <strong style='color:#F26522;'>99.99%</strong><br><span style='color:#5A6370; font-size:11px;'>Network SLA</span>
                    </div>
                  </div>
                </div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 42}},
        is_inner=True
    )

    hero_split = make_container(
        elements=[hero_left, hero_right],
        settings={"flex_direction": "row", "justify_content": "space-between", "align_items": "center", "flex_wrap": "wrap", "gap": {"unit": "px", "size": 36}},
        is_inner=True
    )
    content.append(make_section([hero_split], bg_color="#FFFFFF", padding_top="80", padding_bottom="60"))

    # Section 2: Stats Ribbon (4 Cards)
    stat_cards = []
    stats_data = [("200+", "Connected Countries"), ("99.99%", "Network Uptime SLA"), ("12,500+", "Peak TPS Throughput"), ("24/7/365", "Dedicated NOC Support")]
    for val, lbl in stats_data:
        c = make_container(
            elements=[
                make_widget("heading", {"title": val, "align": "center", "title_color": "#F26522", "typography_font_size": {"unit": "px", "size": 36}, "typography_font_weight": "800"}),
                make_widget("text-editor", {"editor": f"<p style='text-align:center; color:#5A6370; font-size:14px; font-weight:600;'>{lbl}</p>"})
            ],
            settings={"background_background": "classic", "background_color": "#FFFFFF", "border_border": "solid", "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1", "isLinked": True}, "border_color": "#E5E7EB", "border_radius": {"unit": "px", "top": "14", "right": "14", "bottom": "14", "left": "14", "isLinked": True}, "padding": {"unit": "px", "top": "24", "right": "20", "bottom": "24", "left": "20", "isLinked": False}, "width": {"unit": "%", "size": 23}},
            is_inner=True
        )
        stat_cards.append(c)
    stats_row = make_container(elements=stat_cards, settings={"flex_direction": "row", "justify_content": "space-between", "flex_wrap": "wrap", "gap": {"unit": "px", "size": 16}}, is_inner=True)
    content.append(make_section([stats_row], bg_color="#F8F9FB", padding_top="30", padding_bottom="30"))

    # Section 3: 2x2 Services Grid
    s_header = make_container(elements=[
        make_widget("html", {"html": "<div style='text-align:center;'><span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px; border:1px solid #F9C9A6;'>CORE TELECOM SERVICES</span></div>"}),
        make_heading("High-Capacity Telecom Infrastructure", align="center", font_size=36),
        make_text("<div style='text-align:center;'>Engineered for telecommunications carriers and aggregators demanding zero-downtime reliability.</div>", font_size=16)
    ], is_inner=True)

    services_data_1 = [
        ("01 / A2P CORE", "Wholesale SMS Termination", "Direct operator routes across 200+ countries with dynamic Least-Cost Routing (LCR), CLI preservation, and sub-second DLR reporting."),
        ("02 / VOICE SIP", "Voice Termination (VoIP & SIP)", "Premium wholesale voice minutes with guaranteed CLI transparency, ultra-low Post-Dial Delay (PDD < 1.5s), and global SBCs."),
        ("03 / TRANSACTIONAL", "A2P Enterprise Messaging & OTP", "Mission-critical verification messaging engineered for banking OTPs, 2FA codes, security alerts, and transactional notifications."),
        ("04 / DEVELOPER API", "SMPP 3.4 & RESTful API Platform", "Enterprise-grade SMPP binds supporting Transceiver/Receiver modes alongside modern REST APIs and real-time webhooks.")
    ]
    service_cards = []
    for tag, title, desc in services_data_1:
        sc = make_container(
            elements=[
                make_widget("html", {"html": f"<span style='font-family:monospace; font-size:12px; font-weight:700; color:#F26522; background:#FFF3EB; padding:3px 10px; border-radius:999px;'>{tag}</span>"}),
                make_heading(title, header_size="h3", font_size=22),
                make_text(desc, font_size=14.5)
            ],
            settings={"background_background": "classic", "background_color": "#FFFFFF", "border_border": "solid", "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "4", "isLinked": False}, "border_color": "#E5E7EB", "border_left_color": "#F26522", "border_radius": {"unit": "px", "top": "14", "right": "14", "bottom": "14", "left": "14", "isLinked": True}, "padding": {"unit": "px", "top": "32", "right": "28", "bottom": "32", "left": "28", "isLinked": False}, "width": {"unit": "%", "size": 48}, "flex_direction": "column", "gap": {"unit": "px", "size": 12}},
            is_inner=True
        )
        service_cards.append(sc)
    services_grid = make_container(elements=service_cards, settings={"flex_direction": "row", "flex_wrap": "wrap", "justify_content": "space-between", "gap": {"unit": "px", "size": 24}}, is_inner=True)
    content.append(make_section([s_header, services_grid], bg_color="#FFFFFF", padding_top="80", padding_bottom="80"))

    # Section 4: Comparison Table
    comp_html = """<div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:14px; overflow:hidden; box-shadow:0 2px 8px rgba(26,26,46,0.04);'>
      <table style='width:100%; border-collapse:collapse; text-align:left; font-size:14.5px;'>
        <tr style='background:#F8F9FB;'>
          <th style='padding:16px 20px; border-bottom:1px solid #E5E7EB;'>Feature Capability</th>
          <th style='padding:16px 20px; border-bottom:1px solid #E5E7EB; background:#FFF3EB; color:#A8420E; border-left:2px solid #F26522; border-right:2px solid #F26522;'>Kimosha Telecom Direct</th>
          <th style='padding:16px 20px; border-bottom:1px solid #E5E7EB;'>Standard Grey Aggregators</th>
        </tr>
        <tr><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB;'><strong>Route Architecture</strong></td><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB; background:#FFF3EB; font-weight:700; border-left:2px solid #F26522; border-right:2px solid #F26522;'>100% 1-Hop Direct MNO Interconnects</td><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB;'>Multi-hop Grey / Resold Paths</td></tr>
        <tr><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB;'><strong>Average Delivery Speed</strong></td><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB; background:#FFF3EB; font-weight:700; border-left:2px solid #F26522; border-right:2px solid #F26522;'>&lt; 1.2 seconds globally</td><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB;'>8 - 45 seconds (delayed queues)</td></tr>
        <tr><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB;'><strong>CLI & Sender ID Preservation</strong></td><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB; background:#FFF3EB; font-weight:700; border-left:2px solid #F26522; border-right:2px solid #F26522;'>Guaranteed True Pass-Through</td><td style='padding:14px 20px; border-bottom:1px solid #E5E7EB;'>Random / Overwritten Numbers</td></tr>
        <tr><td style='padding:14px 20px;'><strong>24/7 NOC Support</strong></td><td style='padding:14px 20px; background:#FFF3EB; font-weight:700; border-left:2px solid #F26522; border-right:2px solid #F26522;'>Dedicated Telecom Engineers</td><td style='padding:14px 20px;'>Email ticket queue (office hours only)</td></tr>
      </table>
    </div>"""
    comp_header = make_container(elements=[
        make_widget("html", {"html": "<div style='text-align:center;'><span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px; border:1px solid #F9C9A6;'>COMPETITIVE SUPERIORITY</span></div>"}),
        make_heading("Kimosha Direct vs Standard Aggregators", align="center", font_size=34)
    ], is_inner=True)
    content.append(make_section([comp_header, make_widget("html", {"html": comp_html})], bg_color="#F8F9FB", padding_top="80", padding_bottom="80"))

    # Section 5: About & 4 Pillars (50/50 Split)
    about_left = make_container(
        elements=[
            make_widget("html", {"html": "<span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px;'>ABOUT KIMOSHA</span>"}),
            make_heading("Built for Global Connectivity & Trust", font_size=32),
            make_text("Headquartered in Dubai with points of presence across Frankfurt, London, and Singapore, Kimosha Telecom bridges enterprises and operators with high-throughput routing solutions.", font_size=15.5),
            make_widget("html", {"html": "<div style='border-left:4px solid #F26522; padding-left:16px; font-style:italic; color:#1A1A2E; margin:16px 0; font-size:15.5px;'>&ldquo;Our mission is to eliminate friction in international telecommunications through carrier-grade SMS and voice connectivity backed by real SLAs.&rdquo;</div>"})
        ],
        settings={"width": {"unit": "%", "size": 48}, "flex_direction": "column", "gap": {"unit": "px", "size": 14}},
        is_inner=True
    )
    about_right = make_container(
        elements=[
            make_widget("html", {
                "html": """<div style='display:flex; flex-direction:column; gap:12px;'>
                  <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:16px 20px;'>
                    <h4 style='color:#1A1A2E; margin-bottom:4px; font-size:15px;'>✓ Carrier-Grade Reliability</h4>
                    <p style='color:#5A6370; font-size:13.5px; margin:0;'>Active-Active geo-redundant clusters guarantee 99.99% uptime with sub-second failover.</p>
                  </div>
                  <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:16px 20px;'>
                    <h4 style='color:#1A1A2E; margin-bottom:4px; font-size:15px;'>✓ Complete Route Transparency</h4>
                    <p style='color:#5A6370; font-size:13.5px; margin:0;'>Real-time delivery receipts, CDR extracts, and zero false-answer supervision (FAS).</p>
                  </div>
                  <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:16px 20px;'>
                    <h4 style='color:#1A1A2E; margin-bottom:4px; font-size:15px;'>✓ Dynamic Least Cost Routing</h4>
                    <p style='color:#5A6370; font-size:13.5px; margin:0;'>AI-driven path selection optimizes message throughput and wholesale voice pricing.</p>
                  </div>
                </div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 48}},
        is_inner=True
    )
    about_split = make_container(elements=[about_left, about_right], settings={"flex_direction": "row", "justify_content": "space-between", "align_items": "center", "flex_wrap": "wrap"}, is_inner=True)
    content.append(make_section([about_split], bg_color="#FFFFFF", padding_top="80", padding_bottom="80"))

    # Section 6: Contact Form (45/55 Split)
    c_left = make_container(
        elements=[
            make_heading("Direct Carrier Inquiries", font_size=24),
            make_text("Reach out to our global routing team for interconnect agreements and custom wholesale volume tiers.", font_size=14.5),
            make_widget("html", {
                "html": """<div style='margin-top:16px; font-size:14px; line-height:1.8; color:#5A6370;'>
                  <div><strong>Sales:</strong> sales@kimoshatelco.com</div>
                  <div><strong>24/7 NOC:</strong> noc@kimoshatelco.com</div>
                  <div><strong>HQ:</strong> Dubai Internet City, Dubai, UAE</div>
                </div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 42}},
        is_inner=True
    )
    c_right = make_container(
        elements=[
            make_widget("html", {
                "html": """<form onsubmit='event.preventDefault(); alert("Request submitted successfully!");' style='display:flex; flex-direction:column; gap:14px;'>
                  <input type='text' placeholder='Your Full Name' required style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; width:100%; font-size:14px;'>
                  <input type='email' placeholder='Corporate Email' required style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; width:100%; font-size:14px;'>
                  <select style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; width:100%; font-size:14px;'>
                    <option>Wholesale SMS Termination</option>
                    <option>Voice Termination (VoIP/SIP)</option>
                    <option>A2P Enterprise Messaging</option>
                  </select>
                  <textarea placeholder='Target Destinations / Expected Volume...' rows='3' style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; width:100%; font-size:14px;'></textarea>
                  <button type='submit' style='background:#F26522; color:#FFF; padding:13px; border:none; border-radius:999px; font-weight:700; cursor:pointer;'>Submit Interconnect Request</button>
                </form>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 52}, "background_background": "classic", "background_color": "#FFFFFF", "border_border": "solid", "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1", "isLinked": True}, "border_color": "#E5E7EB", "border_radius": {"unit": "px", "top": "16", "right": "16", "bottom": "16", "left": "16", "isLinked": True}, "padding": {"unit": "px", "top": "32", "right": "28", "bottom": "32", "left": "28", "isLinked": False}},
        is_inner=True
    )
    contact_split = make_container(elements=[c_left, c_right], settings={"flex_direction": "row", "justify_content": "space-between", "align_items": "center", "flex_wrap": "wrap"}, is_inner=True)
    content.append(make_section([contact_split], bg_color="#F8F9FB", padding_top="80", padding_bottom="80"))

    # Section 7: Footer (4-Column)
    footer_html = """<div style='display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr; gap:32px; font-size:14px; color:#5A6370; padding-bottom:32px; border-bottom:1px solid #E5E7EB;'>
      <div><strong style='font-size:18px; color:#1A1A2E;'>kimosha<span style='color:#F26522;'>telco</span></strong><p style='margin-top:8px; font-size:13px;'>Carrier-grade wholesale SMS termination and voice routing hub.</p></div>
      <div><strong style='color:#1A1A2E;'>Services</strong><br><a href='#services'>Wholesale SMS</a><br><a href='#services'>Voice VoIP</a><br><a href='#services'>A2P OTP</a></div>
      <div><strong style='color:#1A1A2E;'>Company</strong><br><a href='#about'>About Us</a><br><a href='#comparison'>Comparison</a><br><a href='#contact'>Carrier NOC</a></div>
      <div><strong style='color:#1A1A2E;'>Contact</strong><br>sales@kimoshatelco.com<br>noc@kimoshatelco.com</div>
    </div>
    <div style='padding-top:20px; font-size:13px; color:#8D95A0; text-align:center;'>&copy; 2026 Kimosha Telecom FZ-LLC. All rights reserved.</div>"""
    content.append(make_section([make_widget("html", {"html": footer_html})], bg_color="#F8F9FB", padding_top="50", padding_bottom="30"))

    return {"version": "0.4", "title": "Kimosha-Telecom-Option-1-Enterprise-CPaaS", "type": "page", "content": content, "page_settings": {"hide_title": "yes"}}


# ==============================================================================
# OPTION 2: Global Carrier Network Hub (Fortuna Messaging / Telnyx DNA)
# ==============================================================================
def create_template_2():
    content = []

    # Section 1: Full-Width Centered Hero with World Network Illustration
    hero_centered_elements = [
        make_widget("html", {"html": "<div style='text-align:center;'><span style='background:#FFFFFF; border:1px solid #E5E7EB; color:#5A6370; font-size:13px; font-weight:600; padding:6px 16px; border-radius:999px;'>● Global Routing Core: 100% Operational &bull; 500+ Interconnects</span></div>"}),
        make_heading("Global Carrier Hub for<br><span style='color:#F26522;'>Wholesale SMS & Voice</span>", header_size="h1", align="center", font_size=50),
        make_text("<div style='text-align:center; max-width:760px; margin:0 auto;'>Connecting Tier-1 telecom operators and international carriers across 200+ countries with dynamic least-cost routing and sub-second delivery SLAs.</div>", font_size=18),
        make_container(
            elements=[make_button("Establish Carrier Interconnect", "#contact", bg_color="#F26522")],
            settings={"justify_content": "center", "align_items": "center"},
            is_inner=True
        ),
        make_widget("html", {
            "html": """<div style='display:flex; justify-content:center; gap:36px; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:999px; padding:12px 32px; max-width:680px; margin:30px auto 0 auto; text-align:center;'>
              <div><strong style='color:#F26522; font-size:18px;'>200+</strong><br><span style='font-size:12px; color:#5A6370;'>Countries</span></div>
              <div><strong style='color:#F26522; font-size:18px;'>500+</strong><br><span style='font-size:12px; color:#5A6370;'>Direct MNOs</span></div>
              <div><strong style='color:#F26522; font-size:18px;'>99.99%</strong><br><span style='font-size:12px; color:#5A6370;'>SLA Uptime</span></div>
              <div><strong style='color:#F26522; font-size:18px;'>&lt; 1.2s</strong><br><span style='font-size:12px; color:#5A6370;'>DLR Latency</span></div>
            </div>"""
        })
    ]
    content.append(make_section(hero_centered_elements, bg_color="#FFFDFB", padding_top="90", padding_bottom="70"))

    # Section 2: Logo Marquee Strip
    marquee_html = """<div style='display:flex; justify-content:center; gap:24px; flex-wrap:wrap; font-size:13px; font-weight:700; color:#5A6370;'>
      <span style='background:#FFF; border:1px solid #E5E7EB; padding:6px 16px; border-radius:999px;'>📡 Tier-1 Operator Direct</span>
      <span style='background:#FFF; border:1px solid #E5E7EB; padding:6px 16px; border-radius:999px;'>🌍 GCC Direct Routes</span>
      <span style='background:#FFF; border:1px solid #E5E7EB; padding:6px 16px; border-radius:999px;'>🇪🇺 European Exchange (Equinix FR2)</span>
      <span style='background:#FFF; border:1px solid #E5E7EB; padding:6px 16px; border-radius:999px;'>🇺🇸 North America SS7 SIGTRAN</span>
    </div>"""
    content.append(make_section([make_widget("html", {"html": marquee_html})], bg_color="#F8F9FB", padding_top="18", padding_bottom="18"))

    # Section 3: 3x2 Numbered Services Grid
    s_header_2 = make_container(elements=[
        make_widget("html", {"html": "<div style='text-align:center;'><span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px;'>CARRIER SERVICE PORTFOLIO</span></div>"}),
        make_heading("Wholesale Telecommunication Solutions", align="center", font_size=34),
        make_text("<div style='text-align:center;'>Carrier-to-carrier interconnect solutions optimized for high-volume delivery.</div>", font_size=16)
    ], is_inner=True)

    services_data_2 = [
        ("01 / A2P TERMINATION", "Wholesale SMS Termination", "Direct 1-hop routes with dynamic least-cost routing, CLI preservation, and true handset SS7 acknowledgments."),
        ("02 / SIP TRUNKING", "Voice Termination (VoIP/TDM)", "Wholesale voice minutes with guaranteed CLI transparency, sub-50ms jitter, and low Post-Dial Delay via global SBCs."),
        ("03 / VERIFICATION", "A2P Enterprise Messaging", "Dedicated priority lanes for OTPs, two-factor authentication, and transaction alerts with zero queue delay."),
        ("04 / PROTOCOL", "SMPP 3.4 & API Platform", "High-throughput binary SMPP transceiver binds and RESTful JSON APIs for seamless switch and gateway integration."),
        ("05 / AGGREGATION", "SMS Hubbing & Interconnect", "Single commercial agreement giving instant access to 800+ mobile networks with real-time billing and anti-fraud filters."),
        ("06 / BROADCAST", "Voice Broadcasting & IVR", "Automated outbound voice campaigns with interactive DTMF key capture, Text-to-Speech in 40+ languages, and AMD detection.")
    ]
    cards_3x2 = []
    for tag, title, desc in services_data_2:
        c = make_container(
            elements=[
                make_widget("html", {"html": f"<span style='font-family:monospace; font-size:11.5px; font-weight:700; color:#A8420E;'>{tag}</span>"}),
                make_heading(title, header_size="h3", font_size=19),
                make_text(desc, font_size=14)
            ],
            settings={"background_background": "classic", "background_color": "#FFFFFF", "border_border": "solid", "border_width": {"unit": "px", "top": "4", "right": "1", "bottom": "1", "left": "1", "isLinked": False}, "border_color": "#E5E7EB", "border_top_color": "#F26522", "border_radius": {"unit": "px", "top": "14", "right": "14", "bottom": "14", "left": "14", "isLinked": True}, "padding": {"unit": "px", "top": "28", "right": "24", "bottom": "28", "left": "24", "isLinked": False}, "width": {"unit": "%", "size": 31}, "flex_direction": "column", "gap": {"unit": "px", "size": 10}},
            is_inner=True
        )
        cards_3x2.append(c)
    grid_3x2 = make_container(elements=cards_3x2, settings={"flex_direction": "row", "flex_wrap": "wrap", "justify_content": "space-between", "gap": {"unit": "px", "size": 20}}, is_inner=True)
    content.append(make_section([s_header_2, grid_3x2], bg_color="#FFFFFF", padding_top="80", padding_bottom="80"))

    # Section 4: Interactive SVG Network Map Section
    map_html = """<div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:18px; padding:32px; box-shadow:0 8px 24px rgba(26,26,46,0.06);'>
      <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;'>
        <div><strong style='font-size:18px;'>Global Point of Presence (PoP) Backbone</strong><p style='font-size:13.5px; color:#5A6370;'>Dubai HQ (Equinix DX1), London (LD4), Frankfurt (FR2), Singapore (SG1), New York (NY4)</p></div>
        <span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:6px 14px; border-radius:999px;'>Core Throughput: 11,420 TPS</span>
      </div>
      <div style='background:#F8F9FB; border:1px solid #E5E7EB; border-radius:12px; padding:40px; text-align:center;'>
        <div style='font-family:monospace; font-size:15px; color:#F26522; font-weight:700; margin-bottom:10px;'>● DUBAI MASTER ROUTING HUB (ACTIVE)</div>
        <p style='color:#5A6370; font-size:14px; max-width:600px; margin:0 auto;'>Sub-50ms packet transmission across Middle East, Africa, Europe, and Asia-Pacific carrier nodes.</p>
      </div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": map_html})], bg_color="#F8F9FB", padding_top="70", padding_bottom="70"))

    # Section 5: Technical Specs (3 Columns)
    specs_data = [
        ("Route Optimization", ["Dynamic Least Cost Routing (LCR)", "Automatic Quality Fallback Paths", "Real-Time Handset DLR Feedback"]),
        ("Protocol & Ingestion", ["SMPP v3.4 (TX, RX, TRX Binds)", "SIP 2.0 (RFC 3261) Trunking", "REST JSON API & Webhooks"]),
        ("Carrier Security & NOC", ["24/7/365 Tier-3 NOC Desk", "Anti-Spam & FAS Fraud Detection", "ISO 27001 & GDPR Certified"])
    ]
    spec_cards = []
    for stitle, slist in specs_data:
        items_html = "".join([f"<li style='padding:6px 0; border-bottom:1px solid #E5E7EB; font-size:13.5px; color:#5A6370;'>✓ {it}</li>" for it in slist])
        sc = make_container(
            elements=[
                make_heading(stitle, header_size="h3", font_size=18),
                make_widget("html", {"html": f"<ul style='list-style:none; padding:0;'>{items_html}</ul>"})
            ],
            settings={"background_background": "classic", "background_color": "#FFFFFF", "border_border": "solid", "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1", "isLinked": True}, "border_color": "#E5E7EB", "border_radius": {"unit": "px", "top": "14", "right": "14", "bottom": "14", "left": "14", "isLinked": True}, "padding": {"unit": "px", "top": "24", "right": "20", "bottom": "24", "left": "20", "isLinked": False}, "width": {"unit": "%", "size": 31}},
            is_inner=True
        )
        spec_cards.append(sc)
    specs_grid = make_container(elements=spec_cards, settings={"flex_direction": "row", "justify_content": "space-between", "gap": {"unit": "px", "size": 20}}, is_inner=True)
    content.append(make_section([specs_grid], bg_color="#FFFFFF", padding_top="70", padding_bottom="70"))

    # Section 6: Large Testimonial Block
    t_html = """<div style='background:#FFF3EB; border:1px solid #F9C9A6; border-radius:18px; padding:40px; text-align:center; max-width:800px; margin:0 auto;'>
      <p style='font-size:18px; font-style:italic; font-weight:600; color:#1A1A2E; margin-bottom:16px;'>&ldquo;Kimosha Telecom has given our carrier network 99.99% delivery fidelity across Middle East and African markets. Their SMPP 3.4 throughput is best-in-class.&rdquo;</p>
      <div style='font-weight:700; color:#A8420E;'>Tariq Al-Mansoor</div>
      <div style='font-size:13px; color:#5A6370;'>VP of Wholesale Carrier Relations</div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": t_html})], bg_color="#FFFFFF", padding_top="30", padding_bottom="30"))

    # Section 7: Orange Gradient CTA Banner
    cta_html = """<div style='text-align:center; color:#FFFFFF;'>
      <h2 style='font-size:36px; font-weight:800; color:#FFFFFF; margin-bottom:12px;'>Ready to Interconnect Your Carrier Network?</h2>
      <p style='font-size:16.5px; opacity:0.9; margin-bottom:24px;'>Receive our complete A-Z wholesale SMS and voice rate deck within 60 minutes.</p>
      <a href='#contact' style='display:inline-block; background:#FFFFFF; color:#A8420E; font-weight:800; padding:13px 32px; border-radius:999px; text-decoration:none;'>Request Interconnect Rate Deck &rarr;</a>
    </div>"""
    content.append(make_section([make_widget("html", {"html": cta_html})], bg_color="#F26522", padding_top="60", padding_bottom="60"))

    # Section 8: Centered Contact Form (No Split)
    c_form_html = """<div style='max-width:600px; margin:0 auto; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:18px; padding:36px; box-shadow:0 8px 24px rgba(26,26,46,0.06);'>
      <div style='text-align:center; margin-bottom:24px;'>
        <h3 style='font-size:24px; color:#1A1A2E;'>Open Carrier Bilateral Channel</h3>
        <p style='font-size:14px; color:#5A6370;'>Submit your technical specifications to initialize testing.</p>
      </div>
      <form onsubmit='event.preventDefault(); alert("Interconnect request sent!");' style='display:flex; flex-direction:column; gap:14px;'>
        <input type='text' placeholder='Your Name & Title' required style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; font-size:14px;'>
        <input type='email' placeholder='Corporate Carrier Email' required style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; font-size:14px;'>
        <input type='text' placeholder='Company / Operator Name' required style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; font-size:14px;'>
        <select style='padding:12px 14px; border:1px solid #E5E7EB; border-radius:8px; font-size:14px;'>
          <option>Wholesale SMS Termination (A-Z)</option>
          <option>VoIP / SIP Voice Minutes</option>
          <option>A2P OTP Direct Binds</option>
        </select>
        <button type='submit' style='background:#F26522; color:#FFF; padding:13px; border:none; border-radius:8px; font-weight:700; cursor:pointer;'>Submit Request</button>
      </form>
    </div>"""
    content.append(make_section([make_widget("html", {"html": c_form_html})], bg_color="#F8F9FB", padding_top="80", padding_bottom="80"))

    # Section 9: 3-Column Footer
    f3_html = """<div style='display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:32px; font-size:14px; color:#5A6370; padding-bottom:30px; border-bottom:1px solid #E5E7EB;'>
      <div><strong style='font-size:18px; color:#1A1A2E;'>kimosha<span style='color:#F26522;'>telco</span></strong><p style='margin-top:8px; font-size:13px;'>Global wholesale SMS termination, voice routing hub, and CPaaS infrastructure.</p></div>
      <div><strong style='color:#1A1A2E;'>Carrier Services</strong><br><a href='#services'>Wholesale SMS</a><br><a href='#services'>SIP Voice Termination</a><br><a href='#services'>A2P Messaging</a></div>
      <div><strong style='color:#1A1A2E;'>Interconnect NOC</strong><br>noc@kimoshatelco.com<br>sales@kimoshatelco.com</div>
    </div>
    <div style='padding-top:20px; font-size:13px; color:#8D95A0; text-align:center;'>&copy; 2026 Kimosha Telecom FZ-LLC. All rights reserved.</div>"""
    content.append(make_section([make_widget("html", {"html": f3_html})], bg_color="#F8F9FB", padding_top="50", padding_bottom="30"))

    return {"version": "0.4", "title": "Kimosha-Telecom-Option-2-Global-Carrier-Hub", "type": "page", "content": content, "page_settings": {"hide_title": "yes"}}


# ==============================================================================
# OPTION 3: Precision Voice & SMS Engine (Orange + Deep Cobalt Navy + Slate + Glass)
# ==============================================================================
def create_template_3():
    content = []

    # Section 0: Navy NOC Status Bar
    top_bar_html = """<div style='display:flex; justify-content:space-between; font-family:monospace; font-size:12px; color:#94A3B8; background:#0F172A; padding:8px 0;'>
      <span>● Direct Carrier Core: <strong style='color:#10B981;'>100% Operational</strong> &bull; Live Ingestion: <strong style='color:#F26522;'>12,556 TPS</strong></span>
      <span>Dubai (HQ) &bull; London LD4 &bull; Frankfurt FR2 &bull; Singapore SG1</span>
    </div>"""
    content.append(make_section([make_widget("html", {"html": top_bar_html})], bg_color="#0F172A", padding_top="4", padding_bottom="4"))

    # Section 1: Hero Section (55/45 Split with Live SMS Simulator)
    hero_p_left = make_container(
        elements=[
            make_widget("html", {"html": "<span style='background:#FFF; border:1px solid #E2E8F0; color:#0F172A; font-family:monospace; font-size:11px; font-weight:700; padding:4px 12px; border-radius:999px;'>CARRIER-GRADE TELECOM</span>"}),
            make_heading("Direct Interconnects.<br><span style='color:#F26522;'>Sub-Second Delivery.</span>", header_size="h1", font_size=46),
            make_text("Power your enterprise with carrier-grade wholesale A2P SMS and crystal-clear SIP voice termination. Direct 1-hop SS7 connections across 200+ countries with contractual 99.99% SLA.", font_size=17),
            make_container(
                elements=[
                    make_button("Dispatch Live Test", "#lookup", bg_color="#F26522"),
                    make_button("Inspect Codecs", "#voice", is_outline=True)
                ],
                settings={"flex_direction": "row", "gap": {"unit": "px", "size": 14}},
                is_inner=True
            )
        ],
        settings={"width": {"unit": "%", "size": 52}, "flex_direction": "column", "gap": {"unit": "px", "size": 16}},
        is_inner=True
    )
    hero_p_right = make_container(
        elements=[
            make_widget("html", {
                "html": """<div style='background:#FFFFFF; border:1px solid #E2E8F0; border-radius:18px; padding:22px; box-shadow:0 16px 36px rgba(15,23,42,0.08); font-size:13px;'>
                  <div style='display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-weight:700;'>
                    <span style='color:#0F172A;'>⚡ Live Ingestion Simulator</span>
                    <span style='color:#065F46; font-family:monospace;'>● 1-Hop SS7</span>
                  </div>
                  <div style='background:#F1F5F9; border-radius:10px; padding:12px; margin-bottom:12px;'>
                    <div style='font-size:11px; color:#64748B; margin-bottom:4px;'>Sender: KIMOSHA &bull; Route: True CLI Direct</div>
                    <div style='background:#FFF; padding:10px; border-radius:8px; font-size:12.5px; border:1px solid #E2E8F0;'>
                      Your verification PIN is <strong>849201</strong>. Valid for 5 mins.
                    </div>
                  </div>
                  <div style='display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; font-family:monospace; font-size:11px; text-align:center;'>
                    <div style='background:#F1F5F9; padding:6px; border-radius:6px;'><strong>0.64s</strong><div style='color:#64748B;'>Latency</div></div>
                    <div style='background:#F1F5F9; padding:6px; border-radius:6px;'><strong style='color:#059669;'>Delivered ✓✓</strong><div style='color:#64748B;'>Status</div></div>
                    <div style='background:#F1F5F9; padding:6px; border-radius:6px;'><strong>GSM-7</strong><div style='color:#64748B;'>Encoding</div></div>
                  </div>
                </div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 44}},
        is_inner=True
    )
    hero_p_row = make_container(elements=[hero_p_left, hero_p_right], settings={"flex_direction": "row", "justify_content": "space-between", "align_items": "center", "flex_wrap": "wrap"}, is_inner=True)
    content.append(make_section([hero_p_row], bg_color="#F8FAFC", padding_top="70", padding_bottom="60"))

    # Section 2: Voice Audio-Visual Deck
    voice_html = """<div style='display:grid; grid-template-columns:1fr 1fr; gap:24px;'>
      <div style='background:#F1F5F9; border:1px solid #E2E8F0; border-radius:16px; padding:28px;'>
        <div style='font-family:monospace; font-size:11.5px; font-weight:700; color:#F26522; margin-bottom:8px;'>VOIP / SIP CORE</div>
        <h3 style='font-size:22px; margin-bottom:10px; color:#0F172A;'>Crystal-Clear SIP Voice Engine</h3>
        <p style='color:#64748B; font-size:13.5px;'>Zero Post-Dial Delay, guaranteed True CLI, and dual Opus HD / G.711a codec architecture.</p>
        <div style='margin-top:14px; background:#FFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:13px;'>
          <div style='display:flex; justify-content:space-between; margin-bottom:4px;'><span>Answer Seizure Ratio (ASR)</span><strong style='color:#F26522;'>> 74.2%</strong></div>
          <div style='display:flex; justify-content:space-between;'><span>Post-Dial Delay (PDD)</span><strong style='color:#059669;'>&lt; 1.2s</strong></div>
        </div>
      </div>
      <div style='background:#0F172A; color:#FFF; border-radius:16px; padding:28px;'>
        <div style='display:flex; justify-content:space-between; margin-bottom:14px;'>
          <span style='font-family:monospace; font-size:12px; color:#F26522; font-weight:700;'>AUDIO SPECTROGRAM</span>
          <span style='font-family:monospace; font-size:11px; background:rgba(255,255,255,0.15); padding:2px 8px; border-radius:4px;'>MOS 4.45 / 5.0</span>
        </div>
        <div style='font-size:28px; font-weight:800; color:#F26522; margin-bottom:6px;'>Opus HD 48kHz</div>
        <p style='color:#94A3B8; font-size:13px;'>Optimized jitter buffers eliminate packet drops on high-frequency voice routes.</p>
      </div>
    </div>"""
    content.append(make_section([make_heading("High-Fidelity Telephony", align="center", font_size=32), make_widget("html", {"html": voice_html})], bg_color="#FFFFFF", padding_top="70", padding_bottom="70"))

    # Section 3: SMS Pipeline Grid (3 Cards)
    sms_pipe_html = """<div style='display:grid; grid-template-columns:repeat(3, 1fr); gap:20px;'>
      <div style='background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:24px;'>
        <span style='background:#FFF3EB; color:#F26522; font-family:monospace; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:4px;'>DIRECT SIGNALING</span>
        <h4 style='font-size:18px; margin:10px 0 6px 0; color:#0F172A;'>1-Hop MNO SS7 Binds</h4>
        <p style='color:#64748B; font-size:13.5px;'>Direct interconnects bypass transit brokers to eliminate false DLRs.</p>
        <div style='margin-top:14px; font-weight:800; color:#F26522; font-size:18px;'>&lt; 0.70s</div>
      </div>
      <div style='background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:24px;'>
        <span style='background:#FFF3EB; color:#F26522; font-family:monospace; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:4px;'>TRUE CLI</span>
        <h4 style='font-size:18px; margin:10px 0 6px 0; color:#0F172A;'>Alphanumeric Sender ID</h4>
        <p style='color:#64748B; font-size:13.5px;'>100% brand name preservation ensures maximum user open rates.</p>
        <div style='margin-top:14px; font-weight:800; color:#F26522; font-size:18px;'>100.0% Pass</div>
      </div>
      <div style='background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:24px;'>
        <span style='background:#FFF3EB; color:#F26522; font-family:monospace; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:4px;'>FAILOVER CORE</span>
        <h4 style='font-size:18px; margin:10px 0 6px 0; color:#0F172A;'>Algorithmic LCR</h4>
        <p style='color:#64748B; font-size:13.5px;'>Telemetry shifts traffic to backup Tier-1 routes in under 120ms.</p>
        <div style='margin-top:14px; font-weight:800; color:#F26522; font-size:18px;'>120ms Switch</div>
      </div>
    </div>"""
    content.append(make_section([make_heading("Transactional SMS Engine", align="center", font_size=32), make_widget("html", {"html": sms_pipe_html})], bg_color="#F8FAFC", padding_top="70", padding_bottom="70"))

    # Section 4: Global Direct Connect Network (Navy Deep Section)
    net_html = """<div style='color:#FFF;'>
      <div style='display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:28px;'>
        <div style='background:#1E293B; border:1px solid #334155; border-radius:12px; padding:20px; text-align:center;'>
          <strong style='font-size:16px;'>Dubai (DX1)</strong><br><span style='color:#F26522; font-size:12px;'>Master Core</span>
        </div>
        <div style='background:#1E293B; border:1px solid #334155; border-radius:12px; padding:20px; text-align:center;'>
          <strong style='font-size:16px;'>London (LD4)</strong><br><span style='color:#F26522; font-size:12px;'>UK / Transatlantic</span>
        </div>
        <div style='background:#1E293B; border:1px solid #334155; border-radius:12px; padding:20px; text-align:center;'>
          <strong style='font-size:16px;'>Frankfurt (FR2)</strong><br><span style='color:#F26522; font-size:12px;'>EU Exchange Hub</span>
        </div>
        <div style='background:#1E293B; border:1px solid #334155; border-radius:12px; padding:20px; text-align:center;'>
          <strong style='font-size:16px;'>Singapore (SG1)</strong><br><span style='color:#F26522; font-size:12px;'>APAC Core Link</span>
        </div>
      </div>
      <div style='background:#1E293B; border:1px solid #334155; border-radius:14px; padding:20px; display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; text-align:center;'>
        <div><div style='font-size:26px; font-weight:800; color:#F26522;'>200+</div><div style='font-size:12px; color:#94A3B8;'>Territories</div></div>
        <div><div style='font-size:26px; font-weight:800; color:#F26522;'>500+</div><div style='font-size:12px; color:#94A3B8;'>Direct MNOs</div></div>
        <div><div style='font-size:26px; font-weight:800; color:#F26522;'>99.99%</div><div style='font-size:12px; color:#94A3B8;'>Network SLA</div></div>
        <div><div style='font-size:26px; font-weight:800; color:#F26522;'>&lt; 0.8s</div><div style='font-size:12px; color:#94A3B8;'>Handset Ping</div></div>
      </div>
    </div>"""
    content.append(make_section([make_heading("<span style='color:#FFF;'>Global Edge Infrastructure</span>", align="center", font_size=32), make_widget("html", {"html": net_html})], bg_color="#0F172A", padding_top="70", padding_bottom="70"))

    # Section 5: Rate Lookup & Interconnect Contact
    lookup_html = """<div style='max-width:680px; margin:0 auto; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:18px; padding:32px; box-shadow:0 12px 32px rgba(15,23,42,0.06);'>
      <h3 style='font-size:22px; text-align:center; margin-bottom:18px; color:#0F172A;'>Check Live Routing Parameters</h3>
      <form onsubmit='event.preventDefault(); alert("Rate request received!");' style='display:flex; flex-direction:column; gap:12px;'>
        <div style='display:grid; grid-template-columns:1fr 1fr; gap:12px;'>
          <input type='text' placeholder='Your Name' required style='padding:11px; border:1px solid #E2E8F0; border-radius:8px;'>
          <input type='email' placeholder='Work Email' required style='padding:11px; border:1px solid #E2E8F0; border-radius:8px;'>
        </div>
        <select style='padding:11px; border:1px solid #E2E8F0; border-radius:8px;'>
          <option>United Arab Emirates (+971) - Direct SS7</option>
          <option>Saudi Arabia (+966) - Direct Bilateral</option>
          <option>United Kingdom (+44) - Direct Tier-1</option>
          <option>United States (+1) - 10DLC Route</option>
        </select>
        <button type='submit' style='background:#F26522; color:#FFF; padding:13px; border:none; border-radius:8px; font-weight:700; cursor:pointer;'>Request Rate Sheet & Sandbox &rarr;</button>
      </form>
    </div>"""
    content.append(make_section([make_widget("html", {"html": lookup_html})], bg_color="#F8FAFC", padding_top="70", padding_bottom="70"))

    # Section 6: Precision Navy & Orange Footer
    f3_html = """<div style='display:flex; justify-content:space-between; align-items:center; font-size:13.5px; color:#94A3B8;'>
      <div><strong style='color:#FFFFFF; font-size:16px;'>kimosha<span style='color:#F26522;'>telco</span></strong> <span style='font-size:11px; color:#64748B;'>PRECISION CORE</span></div>
      <div>Dubai Core (DX1) &bull; Frankfurt (FR2) &bull; London (LD4) &bull; Singapore (SG1)</div>
      <div>&copy; 2026 Kimosha Telecom FZ-LLC.</div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": f3_html})], bg_color="#0F172A", padding_top="30", padding_bottom="30"))

    return {"version": "0.4", "title": "Kimosha-Telecom-Option-3-Minimal-Voice-SMS", "type": "page", "content": content, "page_settings": {"hide_title": "yes"}}


# ==============================================================================
# OPTION 4: Modern Bento Grid (Apple / Raycast / Zenso Digital DNA)
# ==============================================================================
def create_template_4():
    content = []

    # Section 1: 60/40 Hero with Abstract Mesh Card
    hero_bento_left = make_container(
        elements=[
            make_widget("html", {"html": "<span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px;'>ASYMMETRIC TELECOM ARCHITECTURE</span>"}),
            make_heading("Carrier-Grade Telecom<br><span style='color:#F26522;'>Engineered for Scale.</span>", header_size="h1", font_size=48),
            make_text("Wholesale SMS termination, direct voice routing, and developer-first APIs delivering sub-second speed across 200+ countries with active-active redundant clusters.", font_size=17),
            make_container(
                elements=[
                    make_button("Start Interconnect", "#contact", bg_color="#F26522"),
                    make_button("Test Capacity", "#calculator", is_outline=True)
                ],
                settings={"flex_direction": "row", "gap": {"unit": "px", "size": 14}},
                is_inner=True
            )
        ],
        settings={"width": {"unit": "%", "size": 58}, "flex_direction": "column", "gap": {"unit": "px", "size": 16}},
        is_inner=True
    )
    hero_bento_right = make_container(
        elements=[
            make_widget("html", {
                "html": """<div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:18px; padding:28px; box-shadow:0 8px 24px rgba(26,26,46,0.06); text-align:center;'>
                  <div style='font-family:monospace; font-size:13px; font-weight:700; color:#F26522; margin-bottom:8px;'>DUBAI HQ &bull; EQUINIX DX1</div>
                  <div style='font-size:32px; font-weight:800; color:#1A1A2E; margin-bottom:6px;'>12,500 TPS</div>
                  <div style='font-size:13px; color:#5A6370;'>Multi-Bind Burst Capacity</div>
                </div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 38}},
        is_inner=True
    )
    hero_bento_row = make_container(elements=[hero_bento_left, hero_bento_right], settings={"flex_direction": "row", "justify_content": "space-between", "align_items": "center", "flex_wrap": "wrap"}, is_inner=True)
    content.append(make_section([hero_bento_row], bg_color="#FFFDFB", padding_top="80", padding_bottom="60"))

    # Section 2: Overlapping Bento Stat Cards
    stat_bento_cards = []
    bento_stats = [("200+", "Connected Countries"), ("12,500+", "Peak TPS Throughput"), ("99.99%", "Network Uptime SLA")]
    for val, lbl in bento_stats:
        bc = make_container(
            elements=[
                make_widget("heading", {"title": val, "title_color": "#1A1A2E", "typography_font_size": {"unit": "px", "size": 28}, "typography_font_weight": "800"}),
                make_widget("text-editor", {"editor": f"<p style='color:#5A6370; font-size:13px; font-weight:600; margin:0;'>{lbl}</p>"})
            ],
            settings={"background_background": "classic", "background_color": "#FFFFFF", "border_border": "solid", "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1", "isLinked": True}, "border_color": "#E5E7EB", "border_radius": {"unit": "px", "top": "14", "right": "14", "bottom": "14", "left": "14", "isLinked": True}, "padding": {"unit": "px", "top": "20", "right": "24", "bottom": "20", "left": "24", "isLinked": False}, "width": {"unit": "%", "size": 31}, "box_shadow": {"horizontal": 0, "vertical": 4, "blur": 16, "spread": 0, "color": "rgba(26,26,46,0.06)"}},
            is_inner=True
        )
        stat_bento_cards.append(bc)
    bento_stats_row = make_container(elements=stat_bento_cards, settings={"flex_direction": "row", "justify_content": "space-between", "gap": {"unit": "px", "size": 20}}, is_inner=True)
    content.append(make_section([bento_stats_row], bg_color="#F8F9FB", padding_top="20", padding_bottom="40"))

    # Section 3: Asymmetric Bento Mosaic Services Grid
    b_header = make_container(elements=[
        make_widget("html", {"html": "<div style='text-align:center;'><span style='background:#FFF3EB; color:#A8420E; font-family:monospace; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px;'>MODULAR CAPABILITIES</span></div>"}),
        make_heading("Telecom Services Bento Grid", align="center", font_size=36),
        make_text("<div style='text-align:center;'>A balanced mosaic of wholesale termination, enterprise messaging, and carrier infrastructure.</div>", font_size=16)
    ], is_inner=True)

    bento_grid_html = """<div style='display:grid; grid-template-columns:1.3fr 0.7fr 1fr; gap:20px;'>
      <div style='grid-column:1 / span 2; background:#FFFFFF; border:1px solid #E5E7EB; border-top:4px solid #F26522; border-radius:16px; padding:28px; box-shadow:0 2px 8px rgba(26,26,46,0.04);'>
        <span style='font-family:monospace; font-size:11px; font-weight:700; color:#A8420E; background:#FFF3EB; padding:2px 8px; border-radius:4px;'>01 / A2P TERMINATION</span>
        <h3 style='font-size:22px; margin:8px 0;'>Wholesale SMS Termination</h3>
        <p style='color:#5A6370; font-size:14px;'>Direct operator routes across 200+ countries with dynamic LCR, CLI preservation, and real-time handset SS7 delivery receipts.</p>
      </div>
      <div style='grid-column:3; grid-row:1 / span 2; background:#FEFCFA; border:1px solid #E5E7EB; border-top:4px solid #F26522; border-radius:16px; padding:28px; box-shadow:0 2px 8px rgba(26,26,46,0.04);'>
        <span style='font-family:monospace; font-size:11px; font-weight:700; color:#A8420E; background:#FFF3EB; padding:2px 8px; border-radius:4px;'>02 / SIP VOICE</span>
        <h3 style='font-size:22px; margin:8px 0;'>Wholesale Voice Termination</h3>
        <p style='color:#5A6370; font-size:14px;'>Crystal-clear voice routes with guaranteed CLI pass-through, low Post-Dial Delay (PDD &lt; 1.5s), and global SBCs.</p>
        <div style='margin-top:20px; background:#FFF; border:1px solid #E5E7EB; padding:12px; border-radius:8px; font-size:12px; color:#5A6370;'><strong>Codecs:</strong> G.711a, G.711u, G.729, Opus HD</div>
      </div>
      <div style='grid-column:1; background:#FFFFFF; border:1px solid #E5E7EB; border-top:4px solid #F26522; border-radius:16px; padding:24px;'>
        <span style='font-family:monospace; font-size:11px; font-weight:700; color:#A8420E;'>03 / OTP</span>
        <h4 style='font-size:18px; margin:6px 0;'>A2P Messaging & OTP</h4>
        <p style='color:#5A6370; font-size:13.5px;'>High-priority queues for 2FA verification codes.</p>
      </div>
      <div style='grid-column:2; background:#FFFFFF; border:1px solid #E5E7EB; border-top:4px solid #F26522; border-radius:16px; padding:24px;'>
        <span style='font-family:monospace; font-size:11px; font-weight:700; color:#A8420E;'>04 / PROTOCOL</span>
        <h4 style='font-size:18px; margin:6px 0;'>SMPP 3.4 Binds</h4>
        <p style='color:#5A6370; font-size:13.5px;'>High-throughput binary SMPP transceiver sessions.</p>
      </div>
    </div>"""
    content.append(make_section([b_header, make_widget("html", {"html": bento_grid_html})], bg_color="#FFFFFF", padding_top="70", padding_bottom="70"))

    # Section 4: Volume & TPS Calculator Widget
    calc_html = """<div style='max-width:800px; margin:0 auto; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:18px; padding:36px; box-shadow:0 8px 24px rgba(26,26,46,0.06); text-align:center;'>
      <h3 style='font-size:24px; margin-bottom:8px;'>Telecom Capacity & SLA Calculator</h3>
      <p style='font-size:14px; color:#5A6370; margin-bottom:24px;'>Projected Monthly Volume: <strong style='color:#F26522;'>2,500,000 Messages / Minutes</strong></p>
      <div style='display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; border-top:1px solid #E5E7EB; padding-top:20px;'>
        <div style='background:#F8F9FB; padding:16px; border-radius:10px;'><div style='font-size:22px; font-weight:800; color:#F26522;'>350 TPS</div><div style='font-size:12px; color:#5A6370;'>Bandwidth</div></div>
        <div style='background:#F8F9FB; padding:16px; border-radius:10px;'><div style='font-size:22px; font-weight:800; color:#F26522;'>&lt; 1.1s</div><div style='font-size:12px; color:#5A6370;'>Delivery Speed</div></div>
        <div style='background:#F8F9FB; padding:16px; border-radius:10px;'><div style='font-size:22px; font-weight:800; color:#F26522;'>99.99%</div><div style='font-size:12px; color:#5A6370;'>SLA Tier</div></div>
      </div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": calc_html})], bg_color="#F8F9FB", padding_top="60", padding_bottom="60"))

    # Section 5: Contact Bento
    c_bento_html = """<div style='display:grid; grid-template-columns:1.3fr 0.7fr; gap:24px; max-width:900px; margin:0 auto;'>
      <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:16px; padding:32px;'>
        <h3 style='font-size:20px; margin-bottom:16px;'>Request Wholesale Interconnect</h3>
        <form onsubmit='event.preventDefault(); alert("Request submitted!");' style='display:flex; flex-direction:column; gap:12px;'>
          <input type='text' placeholder='Full Name' required style='padding:11px; border:1px solid #E5E7EB; border-radius:8px;'>
          <input type='email' placeholder='Corporate Email' required style='padding:11px; border:1px solid #E5E7EB; border-radius:8px;'>
          <textarea placeholder='Target Destinations & Volume...' rows='3' style='padding:11px; border:1px solid #E5E7EB; border-radius:8px;'></textarea>
          <button type='submit' style='background:#F26522; color:#FFF; padding:12px; border:none; border-radius:999px; font-weight:700; cursor:pointer;'>Submit</button>
        </form>
      </div>
      <div style='display:flex; flex-direction:column; gap:14px;'>
        <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:18px;'><strong>Sales:</strong><br><span style='color:#F26522;'>sales@kimoshatelco.com</span></div>
        <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:18px;'><strong>24/7 NOC:</strong><br><span style='color:#F26522;'>noc@kimoshatelco.com</span></div>
        <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:18px;'><strong>HQ:</strong><br>Dubai Internet City, UAE</div>
      </div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": c_bento_html})], bg_color="#F8F9FB", padding_top="60", padding_bottom="60"))

    # Section 6: Single-Row Compact Footer
    f_bento_html = """<div style='display:flex; justify-content:space-between; align-items:center; font-size:13.5px; color:#5A6370;'>
      <strong style='color:#1A1A2E;'>kimosha<span style='color:#F26522;'>telco</span></strong>
      <div style='display:flex; gap:20px;'><a href='#services'>Services</a><a href='#calculator'>Calculator</a><a href='#contact'>Contact</a></div>
      <div>&copy; 2026 Kimosha Telecom FZ-LLC.</div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": f_bento_html})], bg_color="#FFFFFF", padding_top="24", padding_bottom="24"))

    return {"version": "0.4", "title": "Kimosha-Telecom-Option-4-Bento-Grid-Modern", "type": "page", "content": content, "page_settings": {"hide_title": "yes"}}


# ==============================================================================
# OPTION 5: Routing Studio & Telemetry Deck (Artisanal Engineering Studio)
# ==============================================================================
def create_template_5():
    content = []

    # Section 0: Master Ticker
    ticker_html = """<div style='display:flex; justify-content:space-between; font-family:monospace; font-size:12px; color:#4A5160; background:#FFF; border-bottom:1px solid #E8E5DD; padding:8px 0;'>
      <span>● Core SS7 & SIP Engine: <strong style='color:#059669;'>Operational</strong> &bull; Throughput: <strong style='color:#F26522;'>12,556 TPS</strong></span>
      <span>DXB 04:22 &bull; LON 00:22 &bull; NYC 19:22 &bull; SGP 08:22</span>
    </div>"""
    content.append(make_section([make_widget("html", {"html": ticker_html})], bg_color="#FFFFFF", padding_top="4", padding_bottom="4"))

    # Section 1: Hero Section (55/45 Split Editorial Studio)
    hero_s_left = make_container(
        elements=[
            make_widget("html", {"html": "<span style='background:#FFF; border:1px solid #D5D0C3; color:#4A5160; font-family:monospace; font-size:11px; font-weight:700; padding:4px 12px; border-radius:999px;'>STUDIO v2.6 // NEXT-GEN ROUTING CORE</span>"}),
            make_heading("Routing Intelligence for<br><span style='color:#F26522;'>Global Operators.</span>", header_size="h1", font_size=46),
            make_text("Bespoke telecommunication pathways across 200+ territories. Sub-50ms SS7 packet delivery, crystal-clear SIP trunking, and algorithmic Least-Cost Routing tailored to carrier volume.", font_size=17),
            make_container(
                elements=[
                    make_button("Open Carrier Account", "#desk", bg_color="#F26522"),
                    make_button("Explore Pipeline Specs", "#pipeline", is_outline=True)
                ],
                settings={"flex_direction": "row", "gap": {"unit": "px", "size": 14}},
                is_inner=True
            )
        ],
        settings={"width": {"unit": "%", "size": 52}, "flex_direction": "column", "gap": {"unit": "px", "size": 16}},
        is_inner=True
    )
    hero_s_right = make_container(
        elements=[
            make_widget("html", {
                "html": """<div style='background:#FFFFFF; border:1px solid #D5D0C3; border-radius:18px; padding:24px; box-shadow:0 16px 36px rgba(242,101,34,0.08); font-size:13px;'>
                  <div style='display:flex; justify-content:space-between; border-bottom:1px solid #E8E5DD; padding-bottom:10px; margin-bottom:12px; font-family:monospace; font-weight:700;'>
                    <span style='color:#8C3105;'>⚡ LIVE ROUTE INSPECTOR</span>
                    <span style='color:#065F46;'>● Active Stream</span>
                  </div>
                  <div style='background:#FAF9F6; border:1px solid #E8E5DD; border-radius:10px; padding:14px; font-family:monospace; margin-bottom:14px;'>
                    <div style='display:flex; justify-content:space-between; margin-bottom:6px;'><span>Destination:</span><strong style='color:#14161B;'>Etisalat / du Direct Tier-1</strong></div>
                    <div style='display:flex; justify-content:space-between; margin-bottom:6px;'><span>Protocol:</span><strong>Direct 1-Hop SS7 / SIGTRAN</strong></div>
                    <div style='display:flex; justify-content:space-between; margin-bottom:6px;'><span>Latency:</span><strong style='color:#059669;'>0.62 seconds</strong></div>
                    <div style='display:flex; justify-content:space-between;'><span>CLI Pass:</span><strong style='color:#F26522;'>100% True CLI</strong></div>
                  </div>
                  <div style='text-align:center;'><a href='#desk' style='display:block; background:#F26522; color:#FFF; padding:10px; border-radius:8px; font-weight:700; text-decoration:none;'>Test This Route &rarr;</a></div>
                </div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 44}},
        is_inner=True
    )
    hero_s_row = make_container(elements=[hero_s_left, hero_s_right], settings={"flex_direction": "row", "justify_content": "space-between", "align_items": "center", "flex_wrap": "wrap"}, is_inner=True)
    content.append(make_section([hero_s_row], bg_color="#FAF9F6", padding_top="70", padding_bottom="60"))

    # Section 2: Carrier Route Physics Mosaic (3 Cards)
    physics_html = """<div style='display:grid; grid-template-columns:repeat(3, 1fr); gap:20px;'>
      <div style='background:#FFFFFF; border:1px solid #D5D0C3; border-radius:14px; padding:24px;'>
        <span style='background:#FFF1E8; color:#8C3105; font-family:monospace; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:4px;'>SS7 CORE</span>
        <h4 style='font-size:18px; margin:10px 0 8px 0;'>Sub-Second Ingestion</h4>
        <p style='color:#4A5160; font-size:13.5px; line-height:1.55;'>Direct signaling layers circumvent transit hops for instant DLR callbacks.</p>
        <div style='margin-top:14px; font-weight:700; color:#F26522; font-size:18px;'>&lt; 700ms</div>
      </div>
      <div style='background:#FFFFFF; border:1px solid #D5D0C3; border-radius:14px; padding:24px;'>
        <span style='background:#FFF1E8; color:#8C3105; font-family:monospace; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:4px;'>SIP 2.0 TRUNKS</span>
        <h4 style='font-size:18px; margin:10px 0 8px 0;'>True CLI Preservation</h4>
        <p style='color:#4A5160; font-size:13.5px; line-height:1.55;'>100% Calling Line Identification fidelity ensures caller trust & minimal PDD.</p>
        <div style='margin-top:14px; font-weight:700; color:#F26522; font-size:18px;'>&lt; 1.4s PDD</div>
      </div>
      <div style='background:#FFFFFF; border:1px solid #D5D0C3; border-radius:14px; padding:24px;'>
        <span style='background:#FFF1E8; color:#8C3105; font-family:monospace; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:4px;'>ALGORITHMIC LCR</span>
        <h4 style='font-size:18px; margin:10px 0 8px 0;'>Dynamic Path Re-Routing</h4>
        <p style='color:#4A5160; font-size:13.5px; line-height:1.55;'>Automated telemetry shifts traffic to backup Tier-1 paths in under 120ms.</p>
        <div style='margin-top:14px; font-weight:700; color:#F26522; font-size:18px;'>120ms Failover</div>
      </div>
    </div>"""
    content.append(make_section([make_heading("Carrier Route Physics", align="center", font_size=32), make_widget("html", {"html": physics_html})], bg_color="#FFFFFF", padding_top="70", padding_bottom="70"))

    # Section 3: Telemetry Pipeline Panels
    pipe_html = """<div style='display:grid; grid-template-columns:1fr 1fr; gap:24px;'>
      <div style='background:#FAF9F6; border:1px solid #D5D0C3; border-radius:16px; padding:28px;'>
        <div style='font-family:monospace; font-size:12px; font-weight:700; color:#F26522; margin-bottom:8px;'>VOICE ENGINE</div>
        <h3 style='font-size:22px; margin-bottom:10px;'>Carrier-Grade SIP Trunking</h3>
        <p style='color:#4A5160; font-size:13.5px;'>Geo-distributed Session Border Controllers in Frankfurt, London, and Dubai.</p>
        <div style='background:#FFF; border:1px solid #E8E5DD; border-radius:8px; padding:14px; margin-top:14px; font-size:13px;'>
          <div style='display:flex; justify-content:space-between; margin-bottom:6px;'><span>Opus HD / G.711a</span><strong>MOS 4.4 / 5.0</strong></div>
          <div style='display:flex; justify-content:space-between;'><span>Jitter Buffer</span><strong style='color:#F26522;'>&lt; 18ms</strong></div>
        </div>
      </div>
      <div style='background:#FAF9F6; border:1px solid #D5D0C3; border-radius:16px; padding:28px;'>
        <div style='font-family:monospace; font-size:12px; font-weight:700; color:#F26522; margin-bottom:8px;'>MESSAGING ENGINE</div>
        <h3 style='font-size:22px; margin-bottom:10px;'>SMPP 3.4 & REST Platform</h3>
        <p style='color:#4A5160; font-size:13.5px;'>Binary transceivers and high-capacity webhook emitters for OTP delivery.</p>
        <div style='background:#FFF; border:1px solid #E8E5DD; border-radius:8px; padding:14px; margin-top:14px; font-size:13px;'>
          <div style='display:flex; justify-content:space-between; margin-bottom:6px;'><span>Bind Modes</span><strong>TRX / TX / RX</strong></div>
          <div style='display:flex; justify-content:space-between;'><span>Window Size</span><strong style='color:#F26522;'>Up to 100 PDUs</strong></div>
        </div>
      </div>
    </div>"""
    content.append(make_section([make_heading("The Telecommunications Pipeline", align="center", font_size=32), make_widget("html", {"html": pipe_html})], bg_color="#FAF9F6", padding_top="70", padding_bottom="70"))

    # Section 4: Carrier Interconnect Desk Form
    form_html = """<div style='max-width:700px; margin:0 auto; background:#FFFFFF; border:1px solid #D5D0C3; border-radius:18px; padding:36px; box-shadow:0 12px 32px rgba(20,22,27,0.06);'>
      <h3 style='font-size:22px; text-align:center; margin-bottom:18px;'>Establish Interconnect Bilateral</h3>
      <form onsubmit='event.preventDefault(); alert("Carrier application submitted!");' style='display:flex; flex-direction:column; gap:12px;'>
        <div style='display:grid; grid-template-columns:1fr 1fr; gap:12px;'>
          <input type='text' placeholder='Operator Rep Name' required style='padding:11px; border:1px solid #D5D0C3; border-radius:8px;'>
          <input type='email' placeholder='Carrier Email' required style='padding:11px; border:1px solid #D5D0C3; border-radius:8px;'>
        </div>
        <input type='text' placeholder='Carrier Entity / Enterprise' required style='padding:11px; border:1px solid #D5D0C3; border-radius:8px;'>
        <textarea placeholder='Target Markets & Monthly Volumes...' rows='3' style='padding:11px; border:1px solid #D5D0C3; border-radius:8px;'></textarea>
        <button type='submit' style='background:#F26522; color:#FFF; padding:13px; border:none; border-radius:8px; font-weight:700; cursor:pointer;'>Submit Interconnect Application &rarr;</button>
      </form>
    </div>"""
    content.append(make_section([make_widget("html", {"html": form_html})], bg_color="#FFFFFF", padding_top="70", padding_bottom="70"))

    # Section 5: Editorial Studio Footer
    f_studio_html = """<div style='display:flex; justify-content:space-between; align-items:center; font-size:13.5px; color:#4A5160;'>
      <div><strong style='color:#14161B; font-size:16px;'>kimosha<span style='color:#F26522;'>telco</span></strong> <span style='font-family:monospace; font-size:11px;'>STUDIO v2.6</span></div>
      <div>Dubai Core (DX1) &bull; Frankfurt (FR2) &bull; London (LD4) &bull; Singapore (SG1)</div>
      <div>&copy; 2026 Kimosha Telecom FZ-LLC.</div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": f_studio_html})], bg_color="#FAF9F6", padding_top="30", padding_bottom="30"))

    return {"version": "0.4", "title": "Kimosha-Telecom-Option-5-Routing-Studio", "type": "page", "content": content, "page_settings": {"hide_title": "yes"}}


# ==============================================================================
# OPTION 6: Liquid Spatial CPaaS (iOS 26 / One UI 9 / Spatial Glassmorphism)
# ==============================================================================
def create_template_6():
    content = []

    # Section 0: Dynamic Island Bar
    island_html = """<div style='display:flex; justify-content:center; padding:6px 0;'>
      <span style='background:rgba(255,255,255,0.85); border:1px solid rgba(229,231,235,0.8); border-radius:999px; padding:6px 20px; font-size:12px; font-weight:600; box-shadow:0 8px 24px rgba(242,101,34,0.08);'>
        ● Core SS7 Gateway: <strong style='color:#059669;'>Live</strong> &bull; Dubai DX1: <strong style='color:#F26522;'>12,556 TPS</strong>
      </span>
    </div>"""
    content.append(make_section([make_widget("html", {"html": island_html})], bg_color="#F9F9FB", padding_top="10", padding_bottom="6"))

    # Section 1: Hero Section (Spatial Glass 55/45 Split)
    hero_sp_left = make_container(
        elements=[
            make_widget("html", {"html": "<span style='background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.9); color:#F26522; font-family:monospace; font-size:11.5px; font-weight:700; padding:4px 14px; border-radius:999px;'>⚡ NEXT-GEN LIQUID CPaaS</span>"}),
            make_heading("The Spatial Era of Global<br><span style='color:#F26522;'>Messaging & Voice.</span>", header_size="h1", font_size=46),
            make_text("Experience hyper-responsive telecommunication infrastructure. Sub-second wholesale SMS termination and crystal-clear voice routing built on frosted liquid-glass telemetry.", font_size=17),
            make_container(
                elements=[
                    make_button("Open Carrier Session", "#interconnect", bg_color="#F26522"),
                    make_button("Inspect API Stack", "#protocols", is_outline=True)
                ],
                settings={"flex_direction": "row", "gap": {"unit": "px", "size": 14}},
                is_inner=True
            )
        ],
        settings={"width": {"unit": "%", "size": 52}, "flex_direction": "column", "gap": {"unit": "px", "size": 16}},
        is_inner=True
    )
    hero_sp_right = make_container(
        elements=[
            make_widget("html", {
                "html": """<div style='background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.9); border-radius:24px; padding:24px; box-shadow:0 20px 50px rgba(242,101,34,0.1); font-size:13px;'>
                  <div style='display:flex; justify-content:space-between; margin-bottom:14px; font-weight:800;'>
                    <span>Spatial Telemetry Hub</span>
                    <span style='color:#059669; font-family:monospace;'>● 99.99% UPTIME</span>
                  </div>
                  <div style='display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;'>
                    <div style='background:rgba(255,255,255,0.85); border:1px solid #E5E7EB; border-radius:12px; padding:12px;'><strong>SMS Turbo Lane</strong><div style='font-size:11px; color:#586072;'>Sub-700ms Priority</div></div>
                    <div style='background:rgba(255,255,255,0.85); border:1px solid #E5E7EB; border-radius:12px; padding:12px;'><strong>True CLI Pass</strong><div style='font-size:11px; color:#586072;'>100% Identification</div></div>
                  </div>
                  <div style='background:rgba(255,255,255,0.9); border:1px solid #E5E7EB; border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;'>
                    <div><div style='font-size:11px; color:#586072;'>ACTIVE THROUGHPUT</div><strong>Dubai DX1 Core</strong></div>
                    <strong style='font-size:18px; color:#F26522;'>12,556 TPS</strong>
                  </div>
                </div>"""
            })
        ],
        settings={"width": {"unit": "%", "size": 44}},
        is_inner=True
    )
    hero_sp_row = make_container(elements=[hero_sp_left, hero_sp_right], settings={"flex_direction": "row", "justify_content": "space-between", "align_items": "center", "flex_wrap": "wrap"}, is_inner=True)
    content.append(make_section([hero_sp_row], bg_color="#F9F9FB", padding_top="70", padding_bottom="60"))

    # Section 2: Spatial Capabilities Tiles (4 Columns)
    tiles_html = """<div style='display:grid; grid-template-columns:repeat(4, 1fr); gap:18px;'>
      <div style='background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.9); border-radius:18px; padding:22px; box-shadow:0 12px 30px rgba(0,0,0,0.03);'>
        <span style='background:#FFF2EA; color:#F26522; font-family:monospace; font-size:11px; font-weight:700; padding:2px 8px; border-radius:999px;'>01 / A2P</span>
        <h4 style='font-size:17px; margin:10px 0 6px 0;'>Wholesale SMS</h4>
        <p style='color:#586072; font-size:13px;'>Tier-1 SS7 binds across 200+ countries with dynamic LCR.</p>
      </div>
      <div style='background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.9); border-radius:18px; padding:22px; box-shadow:0 12px 30px rgba(0,0,0,0.03);'>
        <span style='background:#FFF2EA; color:#F26522; font-family:monospace; font-size:11px; font-weight:700; padding:2px 8px; border-radius:999px;'>02 / VOICE</span>
        <h4 style='font-size:17px; margin:10px 0 6px 0;'>SIP Trunking</h4>
        <p style='color:#586072; font-size:13px;'>Carrier-grade VoIP with True CLI and geo-redundant SBCs.</p>
      </div>
      <div style='background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.9); border-radius:18px; padding:22px; box-shadow:0 12px 30px rgba(0,0,0,0.03);'>
        <span style='background:#FFF2EA; color:#F26522; font-family:monospace; font-size:11px; font-weight:700; padding:2px 8px; border-radius:999px;'>03 / OTP</span>
        <h4 style='font-size:17px; margin:10px 0 6px 0;'>A2P Engine</h4>
        <p style='color:#586072; font-size:13px;'>Transactional messaging for 2FA with 99.9% delivery SLA.</p>
      </div>
      <div style='background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.9); border-radius:18px; padding:22px; box-shadow:0 12px 30px rgba(0,0,0,0.03);'>
        <span style='background:#FFF2EA; color:#F26522; font-family:monospace; font-size:11px; font-weight:700; padding:2px 8px; border-radius:999px;'>04 / SMPP</span>
        <h4 style='font-size:17px; margin:10px 0 6px 0;'>SMPP 3.4 Binds</h4>
        <p style='color:#586072; font-size:13px;'>Transceiver sessions supporting up to 500 TPS per bind.</p>
      </div>
    </div>"""
    content.append(make_section([make_heading("Liquid CPaaS Capabilities", align="center", font_size=32), make_widget("html", {"html": tiles_html})], bg_color="#FFFFFF", padding_top="70", padding_bottom="70"))

    # Section 3: Protocol Gateway Configurator
    proto_html = """<div style='max-width:760px; margin:0 auto; background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.9); border-radius:24px; padding:32px; box-shadow:0 20px 50px rgba(242,101,34,0.08);'>
      <div style='background:#FFFFFF; border:1px solid #E5E7EB; border-radius:14px; padding:20px; font-family:monospace; font-size:13px; line-height:1.6;'>
        <div style='color:#F26522; font-weight:700;'># SMPP v3.4 Transceiver Specification</div>
        Host: smpp.kimoshatelco.com:2775 (TLS: 3775)<br>
        SystemID: kimosha_spatial_01<br>
        BindMode: TRX (Transceiver) &bull; WindowSize: 50 PDUs<br>
        Throughput: Up to 500 TPS / Bind Session
      </div>
    </div>"""
    content.append(make_section([make_heading("Fluid Protocol Gateway", align="center", font_size=32), make_widget("html", {"html": proto_html})], bg_color="#F9F9FB", padding_top="70", padding_bottom="70"))

    # Section 4: Carrier Interconnect Modal Card
    interconnect_html = """<div style='max-width:680px; margin:0 auto; background:rgba(255,255,255,0.75); border:1px solid rgba(255,255,255,0.95); border-radius:24px; padding:36px; box-shadow:0 20px 50px rgba(242,101,34,0.08);'>
      <h3 style='font-size:22px; text-align:center; margin-bottom:18px;'>Open Your Carrier Channel</h3>
      <form onsubmit='event.preventDefault(); alert("Interconnect session initialized!");' style='display:flex; flex-direction:column; gap:12px;'>
        <div style='display:grid; grid-template-columns:1fr 1fr; gap:12px;'>
          <input type='text' placeholder='Full Name' required style='padding:11px; border:1px solid #E5E7EB; border-radius:10px;'>
          <input type='email' placeholder='Corporate Email' required style='padding:11px; border:1px solid #E5E7EB; border-radius:10px;'>
        </div>
        <input type='text' placeholder='Carrier / Operator Entity' required style='padding:11px; border:1px solid #E5E7EB; border-radius:10px;'>
        <textarea placeholder='Destination Routing & TPS Needs...' rows='3' style='padding:11px; border:1px solid #E5E7EB; border-radius:10px;'></textarea>
        <button type='submit' style='background:#F26522; color:#FFF; padding:13px; border:none; border-radius:999px; font-weight:700; cursor:pointer;'>Initialize Interconnect Channel &rarr;</button>
      </form>
    </div>"""
    content.append(make_section([make_widget("html", {"html": interconnect_html})], bg_color="#FFFFFF", padding_top="70", padding_bottom="70"))

    # Section 5: Floating Liquid Glass Footer
    f_spatial_html = """<div style='background:rgba(255,255,255,0.8); border:1px solid rgba(255,255,255,0.9); border-radius:20px; padding:24px 32px; display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#586072;'>
      <strong style='color:#14161F; font-size:16px;'>kimosha<span style='color:#F26522;'>telco</span> <span style='font-size:10px; background:#FFF2EA; color:#F26522; padding:2px 6px; border-radius:999px;'>SPATIAL</span></strong>
      <div>Dubai Internet City &bull; Frankfurt FR2 &bull; London LD4 &bull; Singapore SG1</div>
      <div>&copy; 2026 Kimosha Telecom FZ-LLC.</div>
    </div>"""
    content.append(make_section([make_widget("html", {"html": f_spatial_html})], bg_color="#F9F9FB", padding_top="30", padding_bottom="30"))

    return {"version": "0.4", "title": "Kimosha-Telecom-Option-6-Liquid-Spatial", "type": "page", "content": content, "page_settings": {"hide_title": "yes"}}


def main():
    templates = {
        1: {"name": "Enterprise-CPaaS", "fn": create_template_1},
        2: {"name": "Global-Carrier-Hub", "fn": create_template_2},
        3: {"name": "Minimal-Voice-SMS", "fn": create_template_3},
        4: {"name": "Bento-Grid-Modern", "fn": create_template_4},
        5: {"name": "Routing-Studio", "fn": create_template_5},
        6: {"name": "Liquid-Spatial", "fn": create_template_6},
    }

    print("=== Generating 6 Unique Elementor JSON Templates ===")
    for num, info in templates.items():
        template = info["fn"]()
        filename = f"Kimosha-Telecom-Option-{num}-{info['name']}.json"
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(template, f, indent=2)
        size_kb = os.path.getsize(filepath) / 1024
        print(f"Generated [{num}/6]: {filename} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
