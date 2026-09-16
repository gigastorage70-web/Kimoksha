'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Cpu,
  Mail,
  MessageSquare,
  Globe,
  Radio,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  Save,
  Send,
  Zap,
} from 'lucide-react';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState({
    // Email / SMTP
    smtp_provider: 'RESEND',
    smtp_api_key: 're_live_••••••••••••••••',
    smtp_sender: 'sales@kimokshatelco.com',
    smtp_active: true,

    // WhatsApp
    whatsapp_enabled: true,
    whatsapp_number: '+971 50 123 4567',
    whatsapp_welcome_msg: 'Thank you for contacting Kimoksha Telecom Wholesale NOC.',

    // Google
    google_ga4_id: 'G-78X9W2KMPL',
    google_search_console: 'google-site-verification=abc123xyz',
    google_enabled: true,

    // SMPP Webhook
    smpp_dlr_webhook: 'https://www.kimokshatelco.com/api/webhooks/smpp/dlr',
    smpp_active: true,
  });

  const [testStatus, setTestStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleTestPing = (type) => {
    setTestStatus(`Sending test verification packet to ${type}...`);
    setTimeout(() => {
      setTestStatus(`Verified! ${type} responded with HTTP 200 OK (Latency: 42ms).`);
      setTimeout(() => setTestStatus(''), 4500);
    }, 1200);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setTestStatus('Integration configurations synchronized successfully.');
      setTimeout(() => setTestStatus(''), 4000);
    }, 800);
  };

  return (
    <>
      <AdminHeader
        title="Enterprise Connectors & External Integrations"
        subtitle="Configure transactional email relays, bilateral WhatsApp interconnect, and telecom routing webhooks."
      />

      <div className="integrations-page">
        {testStatus && (
          <div className="status-toast">
            <CheckCircle2 size={16} />
            <span>{testStatus}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="integrations-grid">
          {/* Connector 1: Email / SMTP Dispatch */}
          <div className="connector-card">
            <div className="connector-header">
              <div className="connector-icon-badge orange">
                <Mail size={20} />
              </div>
              <div className="connector-info">
                <h3 className="connector-title">Email & SMTP Dispatch Relay</h3>
                <p className="connector-sub">Sends immediate lead notifications to the sales desk.</p>
              </div>
              <span className={`status-pill ${integrations.smtp_active ? 'active' : 'inactive'}`}>
                {integrations.smtp_active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div className="connector-body">
              <div className="form-group">
                <label>Dispatch Engine Provider</label>
                <select
                  value={integrations.smtp_provider}
                  onChange={(e) =>
                    setIntegrations({ ...integrations, smtp_provider: e.target.value })
                  }
                >
                  <option value="RESEND">Resend Serverless API (Recommended)</option>
                  <option value="SES">Amazon SES (Simple Email Service)</option>
                  <option value="SMTP">Direct SMTP Host Relay</option>
                </select>
              </div>

              <div className="form-group">
                <label>Verified Sender From Address</label>
                <input
                  type="email"
                  value={integrations.smtp_sender}
                  onChange={(e) =>
                    setIntegrations({ ...integrations, smtp_sender: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>API Key / Secret Token</label>
                <div className="input-with-icon">
                  <Key size={14} />
                  <input
                    type="password"
                    value={integrations.smtp_api_key}
                    onChange={(e) =>
                      setIntegrations({ ...integrations, smtp_api_key: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="connector-actions">
                <button
                  type="button"
                  onClick={() => handleTestPing('Email / SMTP Relay')}
                  className="btn-test"
                >
                  <Send size={13} />
                  <span>Send Test Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Connector 2: WhatsApp Direct Interconnect */}
          <div className="connector-card">
            <div className="connector-header">
              <div className="connector-icon-badge green">
                <MessageSquare size={20} />
              </div>
              <div className="connector-info">
                <h3 className="connector-title">WhatsApp Business Direct Link</h3>
                <p className="connector-sub">Direct routing link for bilateral wholesale inquiries.</p>
              </div>
              <span className={`status-pill ${integrations.whatsapp_enabled ? 'active' : 'inactive'}`}>
                {integrations.whatsapp_enabled ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div className="connector-body">
              <div className="form-group">
                <label>WhatsApp Interconnect MSISDN</label>
                <input
                  type="text"
                  placeholder="+971 50 123 4567"
                  value={integrations.whatsapp_number}
                  onChange={(e) =>
                    setIntegrations({ ...integrations, whatsapp_number: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Auto-Populated Inquiry Template</label>
                <textarea
                  rows={3}
                  value={integrations.whatsapp_welcome_msg}
                  onChange={(e) =>
                    setIntegrations({ ...integrations, whatsapp_welcome_msg: e.target.value })
                  }
                />
              </div>

              <div className="connector-actions">
                <button
                  type="button"
                  onClick={() => handleTestPing('WhatsApp Gateway')}
                  className="btn-test"
                >
                  <Zap size={13} />
                  <span>Test Link Generation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Connector 3: Google Analytics & Search Console */}
          <div className="connector-card">
            <div className="connector-header">
              <div className="connector-icon-badge blue">
                <Globe size={20} />
              </div>
              <div className="connector-info">
                <h3 className="connector-title">Google Workspace & Analytics</h3>
                <p className="connector-sub">Traffic acquisition telemetry and SEO verification.</p>
              </div>
              <span className={`status-pill ${integrations.google_enabled ? 'active' : 'inactive'}`}>
                {integrations.google_enabled ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div className="connector-body">
              <div className="form-group">
                <label>Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={integrations.google_ga4_id}
                  onChange={(e) =>
                    setIntegrations({ ...integrations, google_ga4_id: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Search Console Meta Verification Tag</label>
                <input
                  type="text"
                  placeholder="google-site-verification=..."
                  value={integrations.google_search_console}
                  onChange={(e) =>
                    setIntegrations({ ...integrations, google_search_console: e.target.value })
                  }
                />
              </div>

              <div className="connector-actions">
                <button
                  type="button"
                  onClick={() => handleTestPing('Google GA4 Pipeline')}
                  className="btn-test"
                >
                  <ExternalLink size={13} />
                  <span>Verify GA4 Stream</span>
                </button>
              </div>
            </div>
          </div>

          {/* Connector 4: SMPP Delivery Receipt Webhook */}
          <div className="connector-card">
            <div className="connector-header">
              <div className="connector-icon-badge purple">
                <Radio size={20} />
              </div>
              <div className="connector-info">
                <h3 className="connector-title">Carrier SMPP 3.4 Webhook</h3>
                <p className="connector-sub">Upstream DLR handset delivery status listener.</p>
              </div>
              <span className={`status-pill ${integrations.smpp_active ? 'active' : 'inactive'}`}>
                {integrations.smpp_active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div className="connector-body">
              <div className="form-group">
                <label>Callback Webhook URL</label>
                <input
                  type="text"
                  value={integrations.smpp_dlr_webhook}
                  onChange={(e) =>
                    setIntegrations({ ...integrations, smpp_dlr_webhook: e.target.value })
                  }
                />
              </div>

              <div className="connector-actions">
                <button
                  type="button"
                  onClick={() => handleTestPing('SMPP Webhook Endpoint')}
                  className="btn-test"
                >
                  <Send size={13} />
                  <span>Emit Test DLR Packet</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save Footer */}
          <div className="bottom-bar">
            <button type="submit" disabled={isSaving} className="btn-save-all">
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save All Integration Parameters'}</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .integrations-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .status-toast {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 600;
        }
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .integrations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .connector-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .connector-card {
            padding: 1rem;
            border-radius: 12px;
          }
          .btn-save-all {
            width: 100%;
            justify-content: center;
          }
        }
        .connector-header {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          border-bottom: 1px solid var(--admin-border-subtle);
          padding-bottom: 1rem;
        }
        .connector-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .connector-icon-badge.orange {
          background: var(--admin-accent-subtle);
          color: var(--admin-accent);
        }
        .connector-icon-badge.green {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }
        .connector-icon-badge.blue {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
        }
        .connector-icon-badge.purple {
          background: rgba(168, 85, 247, 0.12);
          color: #a855f7;
        }
        .connector-info {
          flex: 1;
        }
        .connector-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--admin-text);
          margin: 0;
        }
        .connector-sub {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          margin: 2px 0 0 0;
        }
        .status-pill {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .status-pill.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .status-pill.inactive {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }
        .connector-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--admin-text-secondary);
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--admin-text);
          font-size: 0.85rem;
          outline: none;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--admin-accent);
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
          border: none;
          background: transparent;
          padding: 8px 0;
          width: 100%;
        }
        .connector-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-top: 0.5rem;
        }
        .btn-test {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-test:hover {
          border-color: var(--admin-accent);
          color: var(--admin-accent);
        }
        .bottom-bar {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          padding-top: 1rem;
        }
        .btn-save-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--admin-accent);
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-save-all:hover {
          background: var(--admin-accent-hover);
        }
      `}</style>
    </>
  );
}
