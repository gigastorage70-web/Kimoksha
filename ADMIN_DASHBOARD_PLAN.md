# Kimoksha Telecom - Admin Dashboard Implementation Plan & Feature Checklist

> **Status:** Architectural Plan Ready for Client Review (Development pending client feature selection & approval)

---

## 1. Executive Summary
This document outlines the architecture, foundational features, and optional modular features for the **Kimoksha Telecom Admin Dashboard**. The goal of the dashboard is to provide Kimoksha administrators and NOC/Sales teams with a unified command center to manage inbound customer inquiries, oversee site content and rate cards, track visitor traffic and route interest, and monitor operational telecom metrics.

---

## 2. Foundational Features (Core Architecture)
The foundational tier forms the bedrock of the dashboard and will be implemented upon initial rollout:

### A. Authentication & Security
- **Admin Authentication**: Secure username/password or passwordless magic link login (`/admin/login`).
- **Session Management**: Secure HTTP-only cookies with JWT session validation and automatic timeout.
- **Role-Based Access Control (RBAC)**:
  - `Super Admin`: Full system privileges, user management, and content publishing.
  - `NOC / Technical`: Interconnect requests, technical logs, route health monitoring.
  - `Sales & Billing`: Lead status management, rate deck distribution, customer outreach.

### B. "Lets Connect" Lead Management & CRM
- **Unified Lead Inbox**: Real-time table of all inquiries submitted through the Home and Contact pages.
- **Lead Details View**:
  - Full Name, Corporate Email, Subject, Message body.
  - Submission timestamp, Client IP, and approximate Geo-location.
  - Lead Status: `New` • `Contacted` • `Rate Card Dispatched` • `Test Bind Issued` • `Closed / Converted` • `Archived`.
- **Action Triggers**: Quick one-click email reply, copy contact information, and internal notes.
- **Search & Filter**: Filter leads by date range, status, or keyword search.
- **Data Export**: One-click export to CSV / Excel for backup or external CRM import.

### C. Traffic & Route Analytics
- **Visitor Volume**: Daily / weekly / monthly pageviews, unique carrier visitors, and bounce rates.
- **Top Service Interest**: Tracking views on Wholesale SMS, SIP Voice, A2P OTP, and SMPP specs.
- **Geographic Visitor Distribution**: Country and regional breakdown of traffic (Middle East, Europe, APAC, Americas).
- **Referral Sources**: Direct traffic, search engines, bilateral carrier networks, and LinkedIn referrals.

### D. Content & Rate Deck Management (CMS)
- **Hero & Metric Counters**: Edit live stats displayed on the website (e.g. Connected Countries, MNO Direct Binds, Core Uptime).
- **Service Offerings Editor**: Update technical parameters (supported codecs, TPS limits, latency SLAs).
- **Operations & NOC Escalation Directory**: Update severity SLA levels, shift phone numbers, and department contacts.

---

## 3. Optional Features Checklist (Tick to Include)
Please review the optional features below. You can tick `[x]` the features you want included in the admin dashboard:

### 3.1 Lead & Notification Enhancements
- [ ] **Instant Email Notifications**: Automated alert sent to `sales@kimokshatelco.com` immediately upon receiving a "Lets Connect" submission.
- [ ] **Team Messaging Alerts (Telegram / Slack / WhatsApp)**: Webhook notification in a designated team channel for high-priority inquiries.
- [ ] **CRM Synchronization**: Direct automatic sync with HubSpot, Zoho CRM, or Salesforce.
- [ ] **Lead Assignment & Internal Thread**: Ability to assign a lead to an individual account executive with internal discussion notes.

### 3.2 Telecom Operations & Carrier Utilities
- [ ] **Wholesale Rate Deck Uploader**: Upload latest A-Z SMS/Voice rate sheets (XLSX/CSV) with versioning and an optional gated download link for verified partners.
- [ ] **Live Infrastructure Ping Monitor**: Real-time HTTP/ICMP ping monitor tracking uptime across Equinix DX1 (Dubai), FR2 (Frankfurt), LD4 (London), and SG1 (Singapore).
- [ ] **Carrier Interconnect Test Tool (Sandbox)**: An internal diagnostic simulator for NOC staff to test number normalization (E.164) and prefix routing.
- [ ] **Carrier Partner Portal (Client Facing)**: Separate login for registered carrier partners to download bilateral settlement invoices and view traffic CDRs.

### 3.3 Security & Administration
- [ ] **Two-Factor Authentication (2FA / TOTP)**: Require Google Authenticator / Authy code upon admin login.
- [ ] **IP Whitelist Enforcement**: Restrict dashboard access exclusively to authorized office or VPN IP addresses.
- [ ] **Automated Database Snapshots**: Nightly automatic backup of lead records and system data to cloud storage.
- [ ] **Audit Trail & Activity Log**: Timestamped log recording all admin changes (content updates, lead status adjustments, logins).

### 3.4 Interface & Reporting
- [ ] **Dark Mode / Light Mode Switcher**: Native theme toggle for the admin interface.
- [ ] **Executive Monthly PDF Report**: One-click generation of a summary PDF containing monthly inquiries, top countries, and traffic performance.

---

## 4. Proposed Technical Architecture
- **Framework**: Integrated Next.js 15 App Router (`src/app/admin/...`) leveraging existing infrastructure.
- **Database**: PostgreSQL (via Supabase or Neon Serverless) or SQLite with Prisma ORM for quick zero-maintenance setup.
- **Authentication**: NextAuth.js (Auth.js) with JWT session cookies and Bcrypt password hashing.
- **Visuals**: Recharts for responsive analytics charts and geographic breakdown.
- **Design System**: Kimoksha corporate styling (Deep Navy `#0F172A`, Slate `#1E293B`, Brand Orange `#F26522`).

---

## 5. Next Steps
Once you have reviewed the features above and ticked the options you would like:
1. Save this file or reply with your chosen features.
2. Development will proceed immediately according to the approved scope.
