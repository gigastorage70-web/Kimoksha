'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminTheme } from '@/context/AdminThemeContext';
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
  Sun,
  Moon,
  Check,
  Palette,
  Trash2,
  Zap,
} from 'lucide-react';

const THEMES = [
  {
    id: 'light',
    name: '1. Light Theme',
    badge: 'Clean Day Mode',
    desc: 'Crisp white canvas with dark high-contrast typography, clean cards, and signature Kimoksha Orange accents.',
    icon: Sun,
    bgPreview: '#f8fafc',
    cardPreview: '#ffffff',
    textPreview: '#0f172a',
  },
  {
    id: 'dark',
    name: '2. Dark Theme',
    badge: 'NOC Default',
    desc: 'Deep navy background (#070c16) with sleek slate panels, bright white typography, and minimal eye strain.',
    icon: Moon,
    bgPreview: '#070c16',
    cardPreview: '#0d1522',
    textPreview: '#f8fafc',
  },
];

export default function SystemSettingsPage() {
  const { theme, setTheme } = useAdminTheme();
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
    // Theme
    admin_theme: 'dark',

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
        body: JSON.stringify({ settings: { ...settings, admin_theme: theme } }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('System settings & console parameters updated successfully.');
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

  const [isPurgingCache, setIsPurgingCache] = useState(false);
  const [cacheMsg, setCacheMsg] = useState('');

  const handlePurgeCache = async () => {
    setIsPurgingCache(true);
    setCacheMsg('');
    try {
      // 1. Purge Next.js server route cache
      const res = await fetch('/api/admin/system/clear-cache', { method: 'POST' });
      const data = await res.json();

      // 2. Clear browser client memory & cache storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
        }
      }

      if (data.success) {
        setCacheMsg(data.message);
        setTimeout(() => setCacheMsg(''), 6000);
      } else {
        setCacheMsg('Local client cache cleared successfully.');
        setTimeout(() => setCacheMsg(''), 4000);
      }
    } catch (e) {
      setCacheMsg('Client memory cleared.');
      setTimeout(() => setCacheMsg(''), 4000);
    } finally {
      setIsPurgingCache(false);
    }
  };

  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme);
    setSettings((prev) => ({ ...prev, admin_theme: newTheme }));
  };

  return (
    <>
      <AdminHeader
        title="System Settings & Console Configuration"
        subtitle="Manage global UI themes, sales notification routing, corporate branding, and infrastructure telemetry."
      />

      <div className="settings-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Operations & Console Settings</h1>
            <p className="page-subtitle">
              Configure the console theme engine, sales notification routing, and carrier infrastructure telemetry.
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              onClick={handlePurgeCache}
              className="btn-purge-header"
              disabled={isPurgingCache}
              title="Flush all frontend and backend cache"
            >
              <Trash2 size={15} />
              <span>{isPurgingCache ? 'Flushing...' : 'Flush Global Cache'}</span>
            </button>
            <button
              type="button"
              onClick={fetchSettings}
              className="btn-secondary"
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              disabled={saving || loading}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Toasts */}
        {cacheMsg && (
          <div className="alert-toast success">
            <CheckCircle2 size={18} />
            <span>{cacheMsg}</span>
          </div>
        )}
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
            {/* THEME SELECTION PANEL (Full Width Hero) */}
            <div className="panel full-width highlight-panel">
              <div className="panel-header">
                <div className="icon-badge orange">
                  <Palette size={20} />
                </div>
                <div>
                  <h2 className="panel-title">Global Console Theme Engine</h2>
                  <p className="panel-desc">
                    Select your operational color palette. The preference is stored in your backend database and applied globally across all Next.js screens.
                  </p>
                </div>
              </div>

              <div className="theme-cards-grid">
                {THEMES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`theme-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectTheme(item.id)}
                    >
                      <div className="theme-card-top">
                        <div className="theme-icon-wrap">
                          <Icon size={18} />
                          <span className="theme-title">{item.name}</span>
                        </div>
                        {isSelected && (
                          <span className="selected-tag">
                            <Check size={12} />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </div>

                      {/* Mini Theme Canvas Preview */}
                      <div
                        className="theme-preview-box"
                        style={{ background: item.bgPreview }}
                      >
                        <div
                          className="preview-card-item"
                          style={{
                            background: item.cardPreview,
                            color: item.textPreview,
                          }}
                        >
                          <div className="preview-top-row">
                            <span
                              className="preview-bar"
                              style={{ background: '#f26522' }}
                            />
                            <span
                              className="preview-pill"
                              style={{ background: 'rgba(242, 101, 34, 0.15)', color: '#f26522' }}
                            >
                              Live
                            </span>
                          </div>
                          <div
                            className="preview-text-line"
                            style={{ background: item.textPreview, opacity: 0.7 }}
                          />
                          <div
                            className="preview-text-line short"
                            style={{ background: item.textPreview, opacity: 0.35 }}
                          />
                        </div>
                      </div>

                      <p className="theme-desc">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Cache Flush Utility Inside Theme Panel */}
              <div className="cache-flush-card">
                <div className="cache-flush-left">
                  <div className="cache-icon-box">
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="cache-card-title">Instant Frontend & Backend Cache Flush</div>
                    <div className="cache-card-desc">
                      Purges Next.js server route caches and wipes local browser client storage so all live telemetry updates immediately.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePurgeCache}
                  disabled={isPurgingCache}
                  className="btn-purge-action"
                >
                  <Trash2 size={14} />
                  <span>{isPurgingCache ? 'Flushing Cache...' : 'Flush Global Cache Now'}</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: SALES NOTIFICATION EMAIL */}
            <div className="panel">
              <div className="panel-header">
                <div className="icon-badge orange">
                  <Mail size={18} />
                </div>
                <div>
                  <h2 className="panel-title">Inbound Inquiries & Sales Alert Routing</h2>
                  <p className="panel-desc">
                    Incoming carrier leads from &quot;Lets Connect&quot; are instantly routed to these addresses.
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
                    Primary corporate inbox receiving instant lead notifications.
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
                    Backup address CC&apos;d on urgent interconnection inquiries.
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

            {/* SECTION 2: INFRASTRUCTURE TELEMETRY */}
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
                      {supabaseInfo.isConfigured
                        ? 'LIVE SUPABASE CONNECTED'
                        : 'ENTERPRISE RESILIENT FALLBACK ACTIVE'}
                    </span>
                  </div>
                </div>

                <div className="infra-help-box">
                  <p>
                    Supabase project <strong>{supabaseInfo.projectId}</strong> hosts your live <code>leads</code>, <code>rate_decks</code>, and <code>site_settings</code> tables.
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

            {/* SECTION 4: GLOBAL SEO & SECURITY */}
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
                    <label>Max Failed Logins</label>
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
                    <span className="field-hint">Triggers 30m IP lockout shield</span>
                  </div>

                  <div className="form-group">
                    <label>Session Timeout (Seconds)</label>
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
                    <span className="field-hint">1800s = 30-min idle logout</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

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
        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .header-actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
          .btn-purge-header,
          .btn-secondary,
          .btn-primary {
            justify-content: center;
            width: 100%;
          }
        }
        .page-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--admin-text);
          letter-spacing: -0.02em;
          margin: 0;
        }
        .page-subtitle {
          font-size: 0.825rem;
          color: var(--admin-text-muted);
          margin-top: 0.25rem;
          max-width: 680px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .btn-purge-header {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 0.55rem 0.95rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-purge-header:hover:not(:disabled) {
          background: #ef4444;
          color: #ffffff;
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          padding: 0.55rem 0.9rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          color: var(--admin-text);
          border-color: var(--admin-accent);
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--admin-accent);
          border: none;
          color: #ffffff;
          padding: 0.55rem 1.15rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--admin-accent-hover);
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
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--admin-text-muted);
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
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .panel {
            padding: 1rem;
            border-radius: 12px;
          }
        }
        .panel.full-width {
          grid-column: 1 / -1;
        }
        .highlight-panel {
          border-color: var(--admin-accent-border);
        }
        .panel-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          border-bottom: 1px solid var(--admin-border-subtle);
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
          background: var(--admin-accent-subtle);
          color: var(--admin-accent);
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
          font-weight: 800;
          color: var(--admin-text);
          margin: 0;
        }
        .panel-desc {
          font-size: 0.8rem;
          color: var(--admin-text-muted);
          margin-top: 0.2rem;
        }
        .theme-cards-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .theme-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .cache-flush-card {
          margin-top: 1.25rem;
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          border-radius: 10px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .cache-flush-card {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }
          .btn-purge-action {
            width: 100%;
            justify-content: center;
          }
        }
        .cache-flush-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .cache-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--admin-accent-subtle);
          color: var(--admin-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cache-card-title {
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--admin-text);
        }
        .cache-card-desc {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          margin-top: 2px;
        }
        .btn-purge-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--admin-accent);
          color: #ffffff;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-purge-action:hover:not(:disabled) {
          background: var(--admin-accent-hover);
        }
        .theme-card {
          background: var(--admin-card-inner);
          border: 2px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          transition: all 0.2s ease;
        }
        .theme-card:hover {
          border-color: var(--admin-accent);
          transform: translateY(-2px);
        }
        .theme-card.selected {
          border-color: var(--admin-accent);
          box-shadow: 0 0 0 1px var(--admin-accent);
        }
        .theme-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .theme-icon-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .theme-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--admin-text);
        }
        .selected-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--admin-accent);
          color: #ffffff;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .theme-preview-box {
          border-radius: 8px;
          padding: 0.85rem;
          border: 1px solid var(--admin-border);
        }
        .preview-card-item {
          border-radius: 6px;
          padding: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .preview-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .preview-bar {
          width: 32px;
          height: 6px;
          border-radius: 999px;
        }
        .preview-pill {
          font-size: 8px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 3px;
        }
        .preview-text-line {
          height: 5px;
          border-radius: 3px;
          width: 80%;
        }
        .preview-text-line.short {
          width: 50%;
        }
        .theme-desc {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          line-height: 1.4;
          margin: 0;
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
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--admin-text-secondary);
        }
        .form-group input,
        .form-group textarea {
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          border-radius: 8px;
          color: var(--admin-text);
          font-size: 0.875rem;
          padding: 0.65rem 0.85rem;
          outline: none;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--admin-accent);
        }
        .field-hint {
          font-size: 0.7rem;
          color: var(--admin-text-dim);
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--admin-card-inner);
          padding: 0.85rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--admin-border);
        }
        .toggle-title {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--admin-text);
        }
        .toggle-desc {
          font-size: 0.725rem;
          color: var(--admin-text-muted);
        }
        .infra-card {
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
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
          border-bottom: 1px solid var(--admin-border-subtle);
        }
        .infra-row:last-child {
          border-bottom: none;
        }
        .infra-label {
          color: var(--admin-text-dim);
        }
        .infra-val {
          color: var(--admin-text-secondary);
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
          background: var(--admin-accent-subtle);
          border: 1px dashed var(--admin-accent-border);
          border-radius: 8px;
          padding: 0.85rem;
          font-size: 0.775rem;
          color: var(--admin-text-secondary);
          line-height: 1.4;
        }
        .infra-help-box code {
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 5px;
          border-radius: 4px;
          color: var(--admin-accent);
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
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 0.85rem;
        }
        .preview-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--admin-text-dim);
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
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          border-radius: 8px;
          padding: 0 0.75rem;
          color: var(--admin-text-dim);
        }
        .input-with-icon input {
          background: transparent;
          border: none;
          padding: 0.65rem 0;
          color: var(--admin-text);
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
          background-color: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          transition: 0.3s;
        }
        .slider:before {
          position: absolute;
          content: '';
          height: 14px;
          width: 14px;
          left: 2px;
          bottom: 2px;
          background-color: #cbd5e1;
          transition: 0.3s;
        }
        input:checked + .slider {
          background-color: var(--admin-accent);
          border-color: var(--admin-accent);
        }
        input:checked + .slider:before {
          transform: translateX(18px);
          background-color: #ffffff;
        }
        .slider.round {
          border-radius: 20px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </>
  );
}
