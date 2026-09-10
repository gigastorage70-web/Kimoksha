# Kimoksha Telecom - Backend & Admin Operations Engine

## 1. Architecture & Codebase Segregation
This directory (`backend-admin/`) provides a clean separation of concerns between the **public customer-facing frontend website** (`kimosha-app/`) and the **telecom operations admin engine** (`backend-admin/`).

```
KImosha/
├── kimosha-app/                  # Public Website & Admin Portal UI (Next.js 15 Serverless)
│   ├── src/
│   │   ├── app/                  # Frontend Routes + /admin Portal + /api/ Endpoints
│   │   │   ├── admin/            # Carrier NOC Console (Dashboard, Leads CRM, Rate Decks, CMS, Security, Settings)
│   │   │   └── api/              # Decoupled REST Endpoints (/api/public/* & /api/admin/*)
│   │   ├── components/           # Public UI Components + Admin Shell Components
│   │   └── lib/                  # Supabase Client, JWT Auth & 7-Attempt Brute-Force Shield
│   └── public/                   # High-res logos, favicons, rate cards
│
├── backend-admin/                # Segregated Admin Engine Specifications & DB Assets
│   ├── database/                 # Supabase PostgreSQL schema, migrations & seeds
│   │   ├── supabase-migration.sql# Production SQL Migration for Supabase (asazkpxgawnqhddnwqjc)
│   │   └── schema.sql            # Master database DDL
│   ├── controllers/              # REST Controller handlers
│   ├── middleware/               # Auth (JWT/RBAC) & security middleware
│   ├── routes/                   # API route definitions
│   └── package.json              # Standalone Node.js package
│
└── ADMIN_DASHBOARD_PLAN.md       # Comprehensive Audit & Architectural Blueprint
```

---

## 2. Cloud Infrastructure: Supabase + Vercel + GitHub

| Component | Provider | Configuration / Reference |
| :--- | :--- | :--- |
| **Database & Storage** | **Supabase PostgreSQL** | Project: **Kimoksha** \| Project ID: `asazkpxgawnqhddnwqjc` |
| **Serverless Compute** | **Vercel** | Next.js 15 Serverless API Handlers + Edge CDN |
| **Version Control** | **GitHub** | Git repository hosting |
| **Initial Admin Login** | Built-in | Username: `admin` \| Password: `Password@123!` |

---

## 3. How to Apply Supabase Database Schema

1. Open your Supabase Dashboard:
   👉 **`https://supabase.com/dashboard/project/asazkpxgawnqhddnwqjc/sql`**
2. Click **New Query**.
3. Copy the entire contents of:
   `backend-admin/database/supabase-migration.sql`
4. Paste it into the editor and click **RUN**.
5. This automatically creates:
   - `admin_users` (with pre-seeded `admin` account)
   - `leads` & `lead_internal_notes` (Inbound CRM with pipeline stages)
   - `rate_decks` (A-Z SMS and Voice rate cards with gated download tokens)
   - `network_pops` (DX1, LD4, FR2, SG1, NY4 carrier exchange hubs)
   - `site_content` (Hero metric counters, service SLA specs, partner marquee, testimonials)
   - `site_settings` (Configurable sales notification email: `sales@kimokshatelco.com`)
   - `security_audit_logs` & `blocked_ips` (7-attempt brute-force protection)
   - Indexes and Row Level Security (RLS) policies

---

## 4. Environment Variables Configuration

In `kimosha-app/.env.local` (and in your Vercel Project Settings > Environment Variables):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://asazkpxgawnqhddnwqjc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret for Carrier Admin Console
JWT_SECRET=kimoksha_telecom_jwt_production_secret_key_2026_carrier_grade

# Configurable Sales Alert Recipient
SALES_ALERT_EMAIL=sales@kimokshatelco.com
```

> **Resilient Fallback Mode**: Even before you paste your live Supabase Service Role key into `.env.local`, the application functions seamlessly in resilient fallback mode with sample carrier data, allowing instant testing and zero build failures.

---

## 5. Summary of Admin Modules Built

1. **Dashboard & Telemetry (`/admin/dashboard`)**: Live KPI metrics (Active Leads, Direct Binds, Rate Decks, Delivery Rate), Equinix PoP latency & status indicators (DX1, LD4, FR2, SG1, NY4), route interest distribution chart.
2. **Inbound Leads CRM (`/admin/leads`)**: 6-stage sales pipeline (`NEW`, `CONTACTED`, `RATE_CARD_SENT`, `TEST_BIND_PROVISIONED`, `CONVERTED`, `ARCHIVED`), corporate domain inspector drawer, internal team notes thread, one-click mailto client launcher, CSV export.
3. **Wholesale Rate Decks (`/admin/rate-decks`)**: Upload & version control for A-Z SMS and Voice sheets, token-gated client download links, download access telemetry, and built-in interactive E.164 normalization sandbox.
4. **Dynamic Site CMS (`/admin/cms`)**: Live modification of Homepage Hero metric ribbons, Carrier Network Map PoPs (status & latency), Technical SLA specifications, Carrier Partner Marquee toggles, Testimonials, and 24/7 NOC Escalation directory.
5. **Security & Audit Logs (`/admin/security`)**: Real-time audit trail of all operator actions, automated 7-attempt brute-force lockout shield, active blocked IPs management with manual blacklisting and unblocking.
6. **System Settings (`/admin/settings`)**: Configurable sales notification email routing (`sales@kimokshatelco.com`), corporate branding assets with live logo preview, global SEO meta configuration, and Supabase cloud infrastructure telemetry.
