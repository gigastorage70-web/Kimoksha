'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  ClipboardList,
  FileCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Send,
  X,
  Code,
  ArrowUpRight,
} from 'lucide-react';

const FORMS_METRICS = [
  {
    id: 'form-connect',
    name: "Let's Connect / Wholesale Lead",
    endpoint: '/api/public/inquiries',
    submissions_count: 28,
    status: 'ACTIVE',
    last_submission: '12 mins ago',
  },
  {
    id: 'form-rates',
    name: 'Wholesale Rate Deck Gated Request',
    endpoint: '/api/public/rate-decks/download',
    submissions_count: 42,
    status: 'ACTIVE',
    last_submission: '1 hour ago',
  },
  {
    id: 'form-interconnect',
    name: 'Carrier Direct Interconnect Proposal',
    endpoint: '/api/public/interconnect',
    submissions_count: 9,
    status: 'ACTIVE',
    last_submission: 'Yesterday',
  },
];

export default function FormsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState('ALL');
  const [inspectItem, setInspectItem] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.leads || []);
        }
      }
    } catch (e) {
      console.error('Failed to load submissions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <>
      <AdminHeader
        title="Form Endpoints & Public Ingestion Logs"
        subtitle="Inspect incoming form payloads, track conversion rates, and verify public submission webhooks."
      />

      <div className="forms-page">
        {/* Active Ingestion Endpoints Cards */}
        <div className="forms-grid">
          {FORMS_METRICS.map((f) => (
            <div key={f.id} className="form-card">
              <div className="form-card-top">
                <span className="form-badge">INGESTION ENDPOINT</span>
                <span className="form-status-active">
                  <CheckCircle2 size={11} />
                  <span>ONLINE</span>
                </span>
              </div>
              <h3 className="form-name">{f.name}</h3>
              <div className="form-endpoint">
                <code>{f.endpoint}</code>
              </div>
              <div className="form-stats-row">
                <div>
                  <div className="stat-num">{f.submissions_count}</div>
                  <div className="stat-desc">Total Submissions</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="stat-time">{f.last_submission}</div>
                  <div className="stat-desc">Last Received</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submissions Feed Header */}
        <div className="feed-header">
          <div>
            <h2 className="section-title">Ingested Submissions Stream</h2>
            <p className="section-sub">Real-time incoming payloads from website contact points.</p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="table-card">
          <table className="forms-table">
            <thead>
              <tr>
                <th>Contact Name</th>
                <th>Corporate Email</th>
                <th>Service Type</th>
                <th>Origin Country</th>
                <th>Received At</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Inspect Payload</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    Loading form submissions...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    No form submissions recorded yet.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div className="contact-name">{sub.full_name}</div>
                      <div className="contact-company">{sub.company_name || 'Enterprise'}</div>
                    </td>
                    <td>
                      <span className="contact-email">{sub.corporate_email}</span>
                    </td>
                    <td>
                      <span className="service-tag">{sub.target_service}</span>
                    </td>
                    <td>
                      <span className="geo-pill">{sub.geo_country || 'Global'}</span>
                    </td>
                    <td>
                      <span className="time-text">
                        {new Date(sub.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${(sub.status || 'new').toLowerCase()}`}>
                        {sub.status || 'NEW'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setInspectItem(sub)}
                        className="btn-inspect"
                        title="View Raw Payload"
                      >
                        <Code size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Inspector Modal */}
      {inspectItem && (
        <div className="modal-backdrop" onClick={() => setInspectItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Form Payload Data Inspector</h3>
                <p className="modal-sub">Raw structured payload received by Next.js API route.</p>
              </div>
              <button onClick={() => setInspectItem(null)} className="btn-close">
                <X size={18} />
              </button>
            </div>

            <div className="payload-meta">
              <div>
                <span className="meta-lbl">Submission ID:</span>
                <span className="meta-val">{inspectItem.id}</span>
              </div>
              <div>
                <span className="meta-lbl">Sender IP:</span>
                <span className="meta-val">{inspectItem.ip_address || '127.0.0.1'}</span>
              </div>
            </div>

            <div className="json-container">
              <pre>{JSON.stringify(inspectItem, null, 2)}</pre>
            </div>

            <div className="modal-actions">
              <button onClick={() => setInspectItem(null)} className="btn-cancel">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .forms-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .forms-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .forms-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .form-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .form-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .form-badge {
          font-size: 9px;
          font-weight: 800;
          color: var(--admin-accent);
          background: var(--admin-accent-subtle);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }
        .form-status-active {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 9px;
          font-weight: 800;
          color: #10b981;
        }
        .form-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--admin-text);
          margin: 0;
        }
        .form-endpoint code {
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          font-family: monospace;
          font-size: 0.725rem;
          padding: 3px 6px;
          border-radius: 4px;
          display: inline-block;
        }
        .form-stats-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid var(--admin-border-subtle);
        }
        .stat-num {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--admin-text);
        }
        .stat-time {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--admin-accent);
        }
        .stat-desc {
          font-size: 0.7rem;
          color: var(--admin-text-dim);
        }
        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--admin-text);
          margin: 0;
        }
        .section-sub {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          margin: 2px 0 0 0;
        }
        .table-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          overflow-x: auto;
        }
        .forms-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.825rem;
        }
        .forms-table th {
          text-align: left;
          padding: 12px 16px;
          color: var(--admin-text-dim);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--admin-border);
        }
        .forms-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--admin-border-subtle);
          vertical-align: middle;
        }
        .contact-name {
          font-weight: 700;
          color: var(--admin-text);
        }
        .contact-company {
          font-size: 0.7rem;
          color: var(--admin-text-dim);
        }
        .contact-email {
          color: var(--admin-text-secondary);
          font-size: 0.8rem;
        }
        .service-tag {
          font-weight: 600;
          color: var(--admin-accent);
          font-size: 0.75rem;
        }
        .geo-pill {
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          color: var(--admin-text-secondary);
        }
        .time-text {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
        }
        .status-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .status-new {
          background: rgba(242, 101, 34, 0.15);
          color: var(--admin-accent);
        }
        .status-contacted {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }
        .status-qualified {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .btn-inspect {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-inspect:hover {
          border-color: var(--admin-accent);
          color: var(--admin-accent);
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 14px;
          max-width: 580px;
          width: 100%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: var(--admin-shadow);
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--admin-border);
          padding-bottom: 0.75rem;
        }
        .modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--admin-text);
          margin: 0;
        }
        .modal-sub {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          margin: 2px 0 0 0;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: var(--admin-text-dim);
          cursor: pointer;
        }
        .payload-meta {
          display: flex;
          gap: 1.5rem;
          font-size: 0.75rem;
        }
        .meta-lbl {
          color: var(--admin-text-dim);
          margin-right: 4px;
        }
        .meta-val {
          color: var(--admin-text);
          font-weight: 600;
          font-family: monospace;
        }
        .json-container {
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 1rem;
          max-height: 300px;
          overflow-y: auto;
        }
        .json-container pre {
          margin: 0;
          font-family: monospace;
          font-size: 0.75rem;
          color: #38bdf8;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--admin-border);
          padding-top: 0.75rem;
        }
        .btn-cancel {
          background: var(--admin-accent);
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
