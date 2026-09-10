'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Settings,
  Mail,
  Building2,
  Globe,
  Shield,
  Database,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [supabaseInfo, setSupabaseInfo] = useState({
    projectId: 'asazkpxgawnqhddnwqjc',
    projectName: 'Kimoksha',
    isConfigured: false,
    url: 'https://asazkpxgawnqhddnwqjc.supabase.co',
  });

  const [settings, setSettings] = useState({
    // Inbound Lead Routing
    alert_email_primary: 'sales@kimokshatelco.com',
    alert_email_secondary: 'info@kimokshatelco.com',
    email_alerts_enabled: 'true',

    // Carrier Branding
    branding_company_name: 'Kimoksha Telecom',
    branding_logo_url: '/kimoksha-logo-clean.png',
    branding_favicon_url: '/Favicon.png',

    // SEO Meta
    seo_meta_title: 'Kimoksha Telecom | Global Wholesale SMS & Voice Carrier Hub',
    seo_meta_description:
      'Connecting Tier-1 telecom operators and enterprise aggregators across 200+ countries with bilateral routing agreements and 99.99% network uptime SLA.',
    canonical_url: 'https://www.kimokshatelco.com',

    // Security
    security_session_timeout_seconds: '1800',
    security_max_login_attempts: '7',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
        if (data.supabaseStatus) {
          setSupabaseInfo(data.supabaseStatus);
        }
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('System settings & sales email dispatch updated successfully.');
        setTimeout(() => setSaveSuccess(''), 4000);
      } else {
        setSaveError(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      setSaveError('Network error while saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="System Settings & Sales Dispatch Configuration"
        subtitle="Configure sales notification routing, corporate branding assets, and cloud infrastructure telemetry."
      />
      <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings & Dispatch Routing</h1>
          <p className="page-subtitle">
            Configure sales notification routing, carrier branding, SEO metadata, and cloud infrastructure telemetry.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={fetchSettings}
            className="btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            disabled={saving || loading}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {saveSuccess && (
        <div className="alert-toast success">
          <CheckCircle2 size={18} />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="alert-toast error">
          <AlertCircle size={18} />
          <span>{saveError}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin text-orange" />
          <p>Loading enterprise configuration parameters...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="settings-grid">
          {/* SECTION 1: SALES NOTIFICATION EMAIL (User's explicit requirement) */}
          <div className="panel highlight-panel">
            <div className="panel-header">
              <div className="icon-badge orange">
                <Mail size={18} />
              </div>
              <div>
                <h2 className="panel-title">Inbound Inquiries & Sales Alert Routing</h2>
                <p className="panel-desc">
                  Incoming leads from the public &quot;Lets Connect&quot; form and Rate Deck requests are instantly routed to these addresses.
                </p>
              </div>
            </div>

            <div className="panel-body">
              <div className="form-group">
                <label>Primary Sales Notification Email *</label>
                <input
                  type="email"
                  required
                  value={settings.alert_email_primary || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, alert_email_primary: e.target.value })
                  }
                  placeholder="sales@kimokshatelco.com"
                />
                <span className="field-hint">
                  Primary corporate inbox receiving instant lead notifications with wholesale service requirements.
                </span>
              </div>

              <div className="form-group">
                <label>Secondary / NOC Dispatch Email</label>
                <input
                  type="email"
                  value={settings.alert_email_secondary || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, alert_email_secondary: e.target.value })
                  }
                  placeholder="info@kimokshatelco.com"
                />
                <span className="field-hint">
                  Escrow / backup address CC&apos;d on urgent interconnection inquiries.
                </span>
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-title">Automated Email Dispatch</div>
                  <div className="toggle-desc">
                    Trigger serverless SMTP dispatch on lead submission
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.email_alerts_enabled === 'true'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email_alerts_enabled: e.target.checked ? 'true' : 'false',
                      })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 2: INFRASTRUCTURE TELEMETRY (Supabase + Vercel + GitHub) */}
          <div className="panel">
            <div className="panel-header">
              <div className="icon-badge blue">
                <Database size={18} />
              </div>
              <div>
                <h2 className="panel-title">Cloud Infrastructure Telemetry</h2>
                <p className="panel-desc">
                  Decoupled serverless stack: Supabase PostgreSQL, Vercel Edge, GitHub VCS.
                </p>
              </div>
            </div>

            <div className="panel-body">
              <div className="infra-card">
                <div className="infra-row">
                  <span className="infra-label">Supabase Project Name</span>
                  <span className="infra-val">{supabaseInfo.projectName}</span>
                </div>
                <div className="infra-row">
                  <span className="infra-label">Supabase Project ID</span>
                  <span className="infra-val code">{supabaseInfo.projectId}</span>
                </div>
                <div className="infra-row">
                  <span className="infra-label">PostgreSQL REST URL</span>
                  <span className="infra-val code">{supabaseInfo.url}</span>
                </div>
                <div className="infra-row">
                  <span className="infra-label">Application Hosting</span>
                  <span className="infra-val">Vercel (Next.js 15 Serverless)</span>
                </div>
                <div className="infra-row">
                  <span className="infra-label">Repository VCS</span>
                  <span className="infra-val">GitHub</span>
                </div>
                <div className="infra-row">
                  <span className="infra-label">Active Connection Engine</span>
                  <span className="infra-badge active">
                    <CheckCircle2 size={12} />
                    {supabaseInfo.isConfigured ? 'LIVE SUPABASE CONNECTED' : 'ENTERPRISE RESILIENT FALLBACK ACTIVE'}
                  </span>
                </div>
              </div>

              <div className="infra-help-box">
                <p>
                  To apply the live database schema to your Supabase project <strong>{supabaseInfo.projectId}</strong>, open the Supabase SQL Editor and execute the script located in <code>backend-admin/database/supabase-migration.sql</code>.
                </p>
                <a
                  href={`https://supabase.com/dashboard/project/${supabaseInfo.projectId}/sql`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-supabase-link"
                >
                  <ExternalLink size={14} />
                  Open Supabase SQL Editor ({supabaseInfo.projectId})
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 3: CARRIER BRANDING */}
          <div className="panel">
            <div className="panel-header">
              <div className="icon-badge purple">
                <Building2 size={18} />
              </div>
              <div>
                <h2 className="panel-title">Carrier Identity & Brand Assets</h2>
                <p className="panel-desc">
                  Corporate logos, favicon paths, and legal entity display.
                </p>
              </div>
            </div>

            <div className="panel-body">
              <div className="form-group">
                <label>Company Legal Display Name</label>
                <input
                  type="text"
                  value={settings.branding_company_name || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, branding_company_name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Header Logo File Path</label>
                <input
                  type="text"
                  value={settings.branding_logo_url || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, branding_logo_url: e.target.value })
                  }
                />
              </div>

              {/* Logo Preview */}
              <div className="logo-preview-box">
                <span className="preview-tag">LIVE LOGO PREVIEW</span>
                <div className="logo-img-wrap">
                  <Image
                    src={settings.branding_logo_url || '/kimoksha-logo-clean.png'}
                    alt="Logo Preview"
                    width={180}
                    height={40}
                    style={{ objectFit: 'contain', width: 'auto', height: '36px' }}
                    priority
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Favicon Icon Path</label>
                <input
                  type="text"
                  value={settings.branding_favicon_url || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, branding_favicon_url: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: GLOBAL SEO & SECURITY POLICIES */}
          <div className="panel">
            <div className="panel-header">
              <div className="icon-badge green">
                <Globe size={18} />
              </div>
              <div>
                <h2 className="panel-title">Global SEO & Perimeter Security</h2>
                <p className="panel-desc">
                  Search engine indexing tags and brute-force lockout rules.
                </p>
              </div>
            </div>

            <div className="panel-body">
              <div className="form-group">
                <label>Global SEO Meta Title</label>
                <input
                  type="text"
                  value={settings.seo_meta_title || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, seo_meta_title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Global SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={settings.seo_meta_description || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, seo_meta_description: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Canonical Site Domain</label>
                <input
                  type="text"
                  value={settings.canonical_url || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, canonical_url: e.target.value })
                  }
                />
              </div>

              <div className="security-sub-grid">
                <div className="form-group">
                  <label>Max Consecutive Failed Logins</label>
                  <div className="input-with-icon">
                    <Shield size={16} />
                    <input
                      type="number"
                      value={settings.security_max_login_attempts || '7'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security_max_login_attempts: e.target.value,
                        })
                      }
                    />
                  </div>
                  <span className="field-hint">Triggers 30m IP lockout shield (Default: 7)</span>
                </div>

                <div className="form-group">
                  <label>Session Inactivity Timeout (Seconds)</label>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      type="number"
                      value={settings.security_session_timeout_seconds || '1800'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security_session_timeout_seconds: e.target.value,
                        })
                      }
                    />
                  </div>
                  <span className="field-hint">1800s = 30-min idle auto-logout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      <style jsx>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .page-subtitle {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 0.25rem;
          max-width: 680px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          padding: 0.55rem 0.9rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f26522;
          border: 1px solid #f26522;
          color: #ffffff;
          padding: 0.55rem 1rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background: #d85416;
          box-shadow: 0 4px 12px rgba(242, 101, 34, 0.3);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .alert-toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .alert-toast.success {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }
        .alert-toast.error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }
        .loading-state {
          background: #0d1522;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #94a3b8;
        }
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
        .panel {
          background: #0d1522;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .highlight-panel {
          border-color: rgba(242, 101, 34, 0.3);
          background: linear-gradient(180deg, #101929 0%, #0d1522 100%);
        }
        .panel-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 1rem;
        }
        .icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-badge.orange {
          background: rgba(242, 101, 34, 0.15);
          color: #f26522;
        }
        .icon-badge.blue {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }
        .icon-badge.purple {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }
        .icon-badge.green {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
        }
        .panel-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #f8fafc;
        }
        .panel-desc {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.2rem;
        }
        .panel-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #cbd5e1;
        }
        .form-group input,
        .form-group textarea {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.9rem;
          padding: 0.65rem 0.85rem;
          outline: none;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #f26522;
        }
        .field-hint {
          font-size: 0.7rem;
          color: #64748b;
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #070b13;
          padding: 0.85rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .toggle-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #f8fafc;
        }
        .toggle-desc {
          font-size: 0.725rem;
          color: #64748b;
        }
        .infra-card {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .infra-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          padding: 0.25rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .infra-row:last-child {
          border-bottom: none;
        }
        .infra-label {
          color: #64748b;
        }
        .infra-val {
          color: #cbd5e1;
          font-weight: 600;
        }
        .infra-val.code {
          font-family: monospace;
          color: #38bdf8;
        }
        .infra-badge.active {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .infra-help-box {
          background: rgba(242, 101, 34, 0.06);
          border: 1px dashed rgba(242, 101, 34, 0.25);
          border-radius: 8px;
          padding: 0.85rem;
          font-size: 0.775rem;
          color: #cbd5e1;
          line-height: 1.4;
        }
        .infra-help-box code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 5px;
          border-radius: 4px;
          color: #f26522;
          font-family: monospace;
        }
        .btn-supabase-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #38bdf8;
          font-size: 0.775rem;
          font-weight: 700;
          text-decoration: none;
          margin-top: 0.5rem;
        }
        .btn-supabase-link:hover {
          text-decoration: underline;
        }
        .logo-preview-box {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.85rem;
        }
        .preview-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #64748b;
          display: block;
          margin-bottom: 0.5rem;
        }
        .logo-img-wrap {
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
        }
        .security-sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (max-width: 600px) {
          .security-sub-grid {
            grid-template-columns: 1fr;
          }
        }
        .input-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 0 0.75rem;
          color: #64748b;
        }
        .input-with-icon input {
          background: transparent;
          border: none;
          padding: 0.65rem 0;
          color: #ffffff;
          width: 100%;
        }

        /* Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 20px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #334155;
          transition: 0.3s;
        }
        .slider:before {
          position: absolute;
          content: '';
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
        }
        input:checked + .slider {
          background-color: #f26522;
        }
        input:checked + .slider:before {
          transform: translateX(18px);
        }
        .slider.round {
          border-radius: 20px;
        }
        .slider.round:before {
          border-radius: 50%;
        }

        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
    </>
  );
}
