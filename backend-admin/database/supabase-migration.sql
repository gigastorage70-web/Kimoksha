-- ==============================================================================
-- KIMOKSHA TELECOM - SUPABASE POSTGRESQL PRODUCTION MIGRATION SCRIPT
-- Project: Kimoksha | Project ID: asazkpxgawnqhddnwqjc
-- Instructions: Copy and paste this script into your Supabase SQL Editor and click RUN.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE (Role-Based Access Control: Super Admin, NOC, Sales)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'sales_billing', -- 'super_admin', 'noc_engineer', 'sales_billing'
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. INBOUND LEADS TABLE ("Lets Connect" Form CRM)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    corporate_email VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NULL,
    company_name VARCHAR(150) NULL,
    target_service VARCHAR(100) DEFAULT 'General Inquiry', -- 'Wholesale SMS', 'SIP Voice', 'A2P OTP', 'SMPP 3.4', 'General Inquiry'
    status VARCHAR(50) DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'RATE_CARD_SENT', 'TEST_BIND_PROVISIONED', 'CONVERTED', 'ARCHIVED'
    assigned_to UUID NULL REFERENCES public.admin_users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45) NULL,
    geo_country VARCHAR(100) NULL,
    geo_city VARCHAR(100) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internal Notes on Leads (Team Collaboration)
CREATE TABLE IF NOT EXISTS public.lead_internal_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL DEFAULT 'Admin Operator',
    author_role VARCHAR(50) NOT NULL DEFAULT 'NOC / Sales',
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. WHOLESALE RATE DECKS TABLE (A-Z SMS & Voice Sheets)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    service_type VARCHAR(80) NOT NULL, -- 'A2P_SMS_WHOLESALE', 'VOICE_CLI_PREMIUM', 'VOICE_DIRECT_LCR', 'SMPP_TRANSCEIVER'
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    version_tag VARCHAR(50) NOT NULL, -- e.g. 'v2026.09-Q3'
    currency VARCHAR(10) DEFAULT 'EUR', -- 'USD', 'EUR', 'GBP'
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    download_token VARCHAR(64) UNIQUE NOT NULL,
    download_count INT DEFAULT 0,
    uploaded_by VARCHAR(100) DEFAULT 'Kimoksha Pricing Desk',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. NETWORK EXCHANGE NODES & POPS (Interactive Map Controller)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_pops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pop_code VARCHAR(10) UNIQUE NOT NULL, -- 'DX1', 'LD4', 'FR2', 'SG1', 'NY4'
    name VARCHAR(100) NOT NULL,
    city VARCHAR(80) NOT NULL,
    country VARCHAR(80) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    status VARCHAR(30) DEFAULT 'ONLINE', -- 'ONLINE', 'DEGRADED', 'MAINTENANCE'
    latency_ms INT DEFAULT 15,
    supported_protocols VARCHAR(200) NOT NULL DEFAULT 'SMPP 3.4, SIP 2.0 Trunking, REST API',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. DYNAMIC SITE CONTENT TABLE (CMS: Hero Stats, Service Specs, Marquee)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(80) UNIQUE NOT NULL, -- 'hero_counters', 'services_specs', 'carrier_marquee', 'testimonials', 'events'
    title VARCHAR(255) NULL,
    subtitle TEXT NULL,
    badge_label VARCHAR(100) NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. GLOBAL SITE SETTINGS TABLE (Branding, SEO, Configurable Sales Email)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(80) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- 'NOTIFICATIONS', 'BRANDING', 'SEO', 'SECURITY'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. SECURITY AUDIT LOGS (Login tracking & Operator Actions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_username VARCHAR(100) NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    action VARCHAR(100) NOT NULL, -- 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'RATE_DECK_UPLOAD', 'STATUS_CHANGE', 'SETTINGS_UPDATE'
    status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILED', 'WARNING'
    details TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. BLOCKED IPS (Automated 7-Attempt Brute-Force Lockout)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocked_ips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    reason VARCHAR(255) NOT NULL DEFAULT 'Brute-force lockout: 7 consecutive failed logins',
    failed_attempts INT DEFAULT 7,
    blocked_until TIMESTAMPTZ NULL,
    is_permanent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES FOR ULTRA-FAST LOOKUPS & QUERIES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(corporate_email);
CREATE INDEX IF NOT EXISTS idx_rate_decks_token ON public.rate_decks(download_token);
CREATE INDEX IF NOT EXISTS idx_network_pops_code ON public.network_pops(pop_code);
CREATE INDEX IF NOT EXISTS idx_security_logs_created ON public.security_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON public.blocked_ips(ip_address);

-- -----------------------------------------------------------------------------
-- DEFAULT SEED DATA INSERTION
-- -----------------------------------------------------------------------------

-- 1. Initial Super Admin Account (Username: admin, Password: Password@123!)
INSERT INTO public.admin_users (username, email, password_hash, role, is_active)
VALUES (
    'admin',
    'admin@kimokshatelco.com',
    '$2b$10$tHmXq0Lf/4Kr9w3tTUMRNOArPLSI2BFGaRX2VDD7hdGotB.j5ZsSC',
    'super_admin',
    TRUE
)
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- 2. Network Exchange PoPs (Equinix Hubs for CarrierNetworkMap)
INSERT INTO public.network_pops (pop_code, name, city, country, latitude, longitude, status, latency_ms, supported_protocols, display_order)
VALUES 
    ('DX1', 'Equinix DX1 Carrier Hub', 'Dubai', 'United Arab Emirates', 25.2048, 55.2708, 'ONLINE', 18, 'SMPP v3.4, SIP 2.0 Trunking, REST API', 1),
    ('LD4', 'Equinix LD4 Slough Exchange', 'London', 'United Kingdom', 51.5074, -0.1278, 'ONLINE', 12, 'SIP Trunking, TDM, Direct SS7 Interconnect', 2),
    ('FR2', 'Equinix FR2 Frankfurt Central', 'Frankfurt', 'Germany', 50.1109, 8.6821, 'ONLINE', 14, 'A2P SMS Gateway, Dynamic LCR Routing', 3),
    ('SG1', 'Equinix SG1 Asia-Pacific Gateway', 'Singapore', 'Singapore', 1.3521, 103.8198, 'ONLINE', 22, 'SMPP 3.4 Transceiver, High-Throughput OTP', 4),
    ('NY4', 'Equinix NY4 Secaucus Hub', 'New York', 'United States', 40.7128, -74.0060, 'ONLINE', 68, 'SIP VoIP, REST Webhooks, Diameter Signaling', 5)
ON CONFLICT (pop_code) DO UPDATE SET 
    status = EXCLUDED.status,
    latency_ms = EXCLUDED.latency_ms;

-- 3. Dynamic CMS: Hero Counters & Technical Specs
INSERT INTO public.site_content (section_key, title, subtitle, payload)
VALUES 
    ('hero_counters', 'Hero Metric Ribbons', 'Live counters rendered on Homepage', '{
        "connected_countries": "200+",
        "direct_mno_binds": "500+",
        "network_uptime_sla": "99.99%",
        "daily_sms_volume": "150M+"
    }'::jsonb),
    ('services_specs', 'Technical SLA Specifications', 'Configurable technical parameters', '{
        "smpp_tps_max": "10,000 TPS",
        "voice_codecs": "G.711a, G.711u, G.729a, OPUS",
        "post_dial_delay_max": "Sub-120ms PDD",
        "ss7_jitter_sla": "< 15ms Jitter"
    }'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- 4. Global Settings: Configurable Sales Alert Email & Branding
INSERT INTO public.site_settings (setting_key, setting_value, category)
VALUES 
    ('alert_email_primary', 'sales@kimokshatelco.com', 'NOTIFICATIONS'),
    ('alert_email_secondary', 'info@kimokshatelco.com', 'NOTIFICATIONS'),
    ('email_alerts_enabled', 'true', 'NOTIFICATIONS'),
    ('branding_company_name', 'Kimoksha Telecom', 'BRANDING'),
    ('branding_logo_url', '/kimoksha-logo-clean.png', 'BRANDING'),
    ('branding_favicon_url', '/Favicon.png', 'BRANDING'),
    ('seo_meta_title', 'Kimoksha Telecom | Global Wholesale SMS & Voice Carrier Hub', 'SEO'),
    ('seo_meta_description', 'Connecting Tier-1 telecom operators and enterprise aggregators across 200+ countries with bilateral routing agreements and 99.99% network uptime SLA.', 'SEO'),
    ('security_session_timeout_seconds', '1800', 'SECURITY'),
    ('security_max_login_attempts', '7', 'SECURITY')
ON CONFLICT (setting_key) DO NOTHING;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_pops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;

-- Allow Public Read for network_pops & site_content
DROP POLICY IF EXISTS "Public read network_pops" ON public.network_pops;
CREATE POLICY "Public read network_pops" ON public.network_pops FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (is_visible = TRUE);

-- Allow Public Insert for leads (Inbound "Lets Connect" form)
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Allow Full Access to Service Role
DROP POLICY IF EXISTS "Service role full access admin_users" ON public.admin_users;
CREATE POLICY "Service role full access admin_users" ON public.admin_users USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access leads" ON public.leads;
CREATE POLICY "Service role full access leads" ON public.leads USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access lead_notes" ON public.lead_internal_notes;
CREATE POLICY "Service role full access lead_notes" ON public.lead_internal_notes USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access rate_decks" ON public.rate_decks;
CREATE POLICY "Service role full access rate_decks" ON public.rate_decks USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access network_pops" ON public.network_pops;
CREATE POLICY "Service role full access network_pops" ON public.network_pops USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access site_content" ON public.site_content;
CREATE POLICY "Service role full access site_content" ON public.site_content USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access site_settings" ON public.site_settings;
CREATE POLICY "Service role full access site_settings" ON public.site_settings USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access security_audit_logs" ON public.security_audit_logs;
CREATE POLICY "Service role full access security_audit_logs" ON public.security_audit_logs USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access blocked_ips" ON public.blocked_ips;
CREATE POLICY "Service role full access blocked_ips" ON public.blocked_ips USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- PERMISSIONS (GRANT TO SERVICE_ROLE & PUBLIC CLIENTS)
-- -----------------------------------------------------------------------------
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON public.leads TO anon, authenticated;
GRANT SELECT ON public.network_pops TO anon, authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT SELECT ON public.rate_decks TO anon, authenticated;
