-- ==============================================================================
-- KIMOKSHA TELECOM - ENTERPRISE DATABASE SCHEMA (POSTGRESQL / SQLITE COMPATIBLE)
-- Unified Data Models for Public Frontend Touchpoints & Admin NOC Operations
-- ==============================================================================

-- 1. Admin & Operator Authentication (RBAC)
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'sales_billing', -- 'super_admin', 'noc_engineer', 'sales_billing'
    is_active BOOLEAN DEFAULT TRUE,
    two_factor_secret VARCHAR(100) NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inbound Leads & Carrier Interconnect CRM (Touchpoint: 'Lets Connect' Form)
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    corporate_email VARCHAR(120) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NULL,
    company_name VARCHAR(120) NULL,
    target_service VARCHAR(80) NULL, -- 'Wholesale SMS', 'SIP Voice', 'A2P OTP', 'SMPP 3.4', 'General'
    estimated_volume VARCHAR(50) NULL, -- '<100k/mo', '100k-1M/mo', '1M+/mo'
    status VARCHAR(40) DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'RATE_CARD_DISPATCHED', 'TEST_BIND_PROVISIONED', 'CONVERTED', 'ARCHIVED'
    assigned_to VARCHAR(36) NULL REFERENCES admin_users(id),
    ip_address VARCHAR(45) NULL,
    geo_country VARCHAR(60) NULL,
    geo_city VARCHAR(60) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internal Notes & Audit History for Leads
CREATE TABLE IF NOT EXISTS lead_internal_notes (
    id VARCHAR(36) PRIMARY KEY,
    lead_id VARCHAR(36) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    author_id VARCHAR(36) NOT NULL REFERENCES admin_users(id),
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Operations & NOC Escalation Tickets (Support & Issue Resolution)
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(36) PRIMARY KEY,
    ticket_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'NOC-2026-0042'
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(120) NOT NULL,
    department VARCHAR(50) NOT NULL, -- 'NOC Desk', 'Carrier Relations', 'Billing & Finance', 'Routing'
    severity_level VARCHAR(20) NOT NULL DEFAULT 'P3_NORMAL', -- 'P1_CRITICAL', 'P2_HIGH', 'P3_NORMAL', 'P4_LOW'
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN', -- 'OPEN', 'INVESTIGATING', 'RESOLVED', 'ARCHIVED'
    assigned_engineer_id VARCHAR(36) NULL REFERENCES admin_users(id),
    resolution_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Wholesale Rate Decks & Pricing Sheets
CREATE TABLE IF NOT EXISTS rate_decks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- 'A2P_SMS_WHOLESALE', 'VOICE_CLI_PREMIUM', 'VOICE_DIRECT_LCR', 'SMPP_TRANSCEIVER'
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    version_tag VARCHAR(30) NOT NULL, -- e.g. 'v2026.09-Q3'
    currency VARCHAR(10) DEFAULT 'EUR', -- 'USD', 'EUR', 'GBP'
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    download_token VARCHAR(64) UNIQUE NOT NULL,
    download_count INT DEFAULT 0,
    uploaded_by VARCHAR(36) REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Network Exchange Nodes & Global PoPs (Touchpoint: Interactive Network Map)
CREATE TABLE IF NOT EXISTS network_pops (
    id VARCHAR(36) PRIMARY KEY,
    pop_code VARCHAR(10) UNIQUE NOT NULL, -- 'DX1', 'LD4', 'FR2', 'SG1', 'NY4'
    name VARCHAR(100) NOT NULL,
    city VARCHAR(80) NOT NULL,
    country VARCHAR(80) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    status VARCHAR(20) DEFAULT 'ONLINE', -- 'ONLINE', 'DEGRADED', 'MAINTENANCE'
    latency_ms INT DEFAULT 18,
    supported_protocols VARCHAR(150) NOT NULL, -- 'SMPP 3.4, SIP Trunking, REST API'
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CMS: Dynamic Website Content & Hero Stats
CREATE TABLE IF NOT EXISTS site_content (
    id VARCHAR(36) PRIMARY KEY,
    section_key VARCHAR(80) UNIQUE NOT NULL, -- e.g. 'hero_metrics', 'service_cards', 'compliance_badges'
    title VARCHAR(200) NULL,
    subtitle TEXT NULL,
    badge_label VARCHAR(100) NULL,
    content_payload JSON NOT NULL, -- Flexible JSON object for counters, lists, feature pills
    is_visible BOOLEAN DEFAULT TRUE,
    updated_by VARCHAR(36) REFERENCES admin_users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Global Site Settings & Integrations
CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(36) PRIMARY KEY,
    setting_key VARCHAR(80) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    category VARCHAR(40) NOT NULL, -- 'BRANDING', 'SEO', 'SMTP', 'NOTIFICATIONS', 'SECURITY', 'TELECOM'
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Security & Audit Trail (Login tracking, Brute Force & Action Logging)
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    admin_user_id VARCHAR(36) NULL REFERENCES admin_users(id),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    action VARCHAR(80) NOT NULL, -- 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'RATE_DECK_UPLOADED', 'LEAD_ARCHIVED', etc.
    status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILED', 'WARNING'
    details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Blocked IPs & Whitelisting Rules
CREATE TABLE IF NOT EXISTS blocked_ips (
    id VARCHAR(36) PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    failed_attempts INT DEFAULT 1,
    blocked_until TIMESTAMP NULL,
    is_permanent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
