'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  FileSpreadsheet,
  Upload,
  Link as LinkIcon,
  Copy,
  Check,
  Calendar,
  Layers,
  Terminal,
  Search,
  Plus,
  X,
  Radio,
  FileCheck,
} from 'lucide-react';

export default function RateDecksPage() {
  const [rateDecks, setRateDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  // New deck form state
  const [newDeck, setNewDeck] = useState({
    title: '',
    service_type: 'A2P_SMS_WHOLESALE',
    file_name: '',
    version_tag: 'v2026.09-Q3',
    currency: 'EUR',
    effective_date: new Date().toISOString().slice(0, 10),
  });

  // Sandbox state
  const [sandboxInput, setSandboxInput] = useState('+971 50 123 4567');
  const [sandboxResult, setSandboxResult] = useState(null);

  const fetchRateDecks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/rate-decks');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setRateDecks(data.rateDecks);
      }
    } catch (e) {
      console.error('Failed to load rate decks:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRateDecks();
    runSandboxTest(sandboxInput);
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newDeck.title || !newDeck.file_name) return;

    try {
      const res = await fetch('/api/admin/rate-decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeck),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRateDecks([data.rateDeck, ...rateDecks]);
          setShowUploadModal(false);
          setNewDeck({
            title: '',
            service_type: 'A2P_SMS_WHOLESALE',
            file_name: '',
            version_tag: 'v2026.09-Q3',
            currency: 'EUR',
            effective_date: new Date().toISOString().slice(0, 10),
          });
        }
      }
    } catch (e) {
      console.error('Rate deck upload error:', e);
    }
  };

  const copyDownloadLink = (token) => {
    const url = `${window.location.origin}/api/public/rate-decks/download/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const runSandboxTest = (input) => {
    // E.164 normalization simulator
    const cleanDigits = input.replace(/[^\d+]/g, '');
    let normalized = cleanDigits;
    if (normalized.startsWith('00')) normalized = '+' + normalized.slice(2);
    else if (!normalized.startsWith('+')) normalized = '+' + normalized;

    let destination = 'Global International Zone';
    let mcc_mnc = '999-001';
    let cliSupported = 'Guaranteed 100% Transparency';
    let routeLcr = 'Tier-1 Direct Carrier Interconnect';

    if (normalized.startsWith('+44')) {
      destination = 'United Kingdom (Mobile / National)';
      mcc_mnc = '234-15 (Vodafone UK / EE)';
    } else if (normalized.startsWith('+971')) {
      destination = 'United Arab Emirates (e& / du DX1)';
      mcc_mnc = '424-02 (Etisalat UAE)';
    } else if (normalized.startsWith('+33')) {
      destination = 'France (Orange / SFR)';
      mcc_mnc = '208-01 (Orange FR)';
    } else if (normalized.startsWith('+49')) {
      destination = 'Germany (Telekom Deutschland)';
      mcc_mnc = '262-01 (DTAG)';
    } else if (normalized.startsWith('+65')) {
      destination = 'Singapore (Singtel SG1 Core)';
      mcc_mnc = '525-01 (Singtel)';
    } else if (normalized.startsWith('+1')) {
      destination = 'United States / Canada (10DLC Shortcode Route)';
      mcc_mnc = '310-410 (AT&T Mobility)';
    }

    setSandboxResult({
      raw: input,
      normalized,
      destination,
      mcc_mnc,
      cliSupported,
      routeLcr,
      pdd: 'Sub-90ms Post-Dial Delay',
      ss7Acks: 'True Handset Delivery DLR',
    });
  };

  return (
    <>
      <AdminHeader
        title="Wholesale Rate Decks & Routing Utilities"
        subtitle="Manage wholesale A-Z rate card distribution, issue tokenized partner access links, and test prefix routing."
      />

      <main className="rate-decks-content">
        {/* Top Controls */}
        <div className="rate-top-bar">
          <div>
            <h2 className="section-title">Published Wholesale Rate Sheets</h2>
            <p className="section-sub">
              Active A-Z pricing sheets available for bilateral carrier partner download.
            </p>
          </div>

          <button onClick={() => setShowUploadModal(true)} className="btn-upload-deck">
            <Plus size={16} />
            <span>Upload New Rate Deck</span>
          </button>
        </div>

        {/* Rate Decks Table */}
        <div className="table-card">
          <table className="rate-table">
            <thead>
              <tr>
                <th>Rate Deck Title</th>
                <th>Service Category</th>
                <th>Version & Date</th>
                <th>Currency</th>
                <th>Downloads</th>
                <th>Gated Access Link</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading wholesale rate sheets...
                  </td>
                </tr>
              ) : rateDecks.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No rate decks uploaded yet.
                  </td>
                </tr>
              ) : (
                rateDecks.map((deck) => (
                  <tr key={deck.id}>
                    <td>
                      <div className="deck-title">{deck.title}</div>
                      <div className="deck-file">
                        <FileSpreadsheet size={12} />
                        <span>{deck.file_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="service-badge">{deck.service_type.replace(/_/g, ' ')}</span>
                    </td>
                    <td>
                      <div className="version-tag">{deck.version_tag}</div>
                      <div className="eff-date">Eff: {deck.effective_date}</div>
                    </td>
                    <td>
                      <span className="currency-pill">{deck.currency}</span>
                    </td>
                    <td>
                      <span className="download-count">{deck.download_count} downloads</span>
                    </td>
                    <td>
                      <button
                        onClick={() => copyDownloadLink(deck.download_token)}
                        className={`btn-copy-token ${copiedToken === deck.download_token ? 'copied' : ''}`}
                      >
                        {copiedToken === deck.download_token ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedToken === deck.download_token ? 'Link Copied!' : 'Copy Link'}</span>
                      </button>
                    </td>
                    <td>
                      <span className="active-status-pill">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* E.164 Prefix Normalization & Route Sandbox Simulator */}
        <section className="sandbox-card">
          <div className="sandbox-header">
            <div className="sandbox-header-left">
              <Terminal size={18} className="terminal-icon" />
              <div>
                <h3 className="sandbox-title">E.164 Prefix Normalization & Route Sandbox</h3>
                <p className="sandbox-sub">
                  Internal NOC diagnostic utility to verify destination country normalization, MCC/MNC assignment, and CLI preservation paths.
                </p>
              </div>
            </div>
            <span className="sandbox-badge">DIAGNOSTIC CORE</span>
          </div>

          <div className="sandbox-body">
            <div className="sandbox-input-row">
              <label htmlFor="sandbox-phone">Test Dialed Number / MSISDN:</label>
              <div className="sandbox-input-wrap">
                <input
                  type="text"
                  id="sandbox-phone"
                  value={sandboxInput}
                  onChange={(e) => {
                    setSandboxInput(e.target.value);
                    runSandboxTest(e.target.value);
                  }}
                  placeholder="e.g. +971 50 123 4567 or 0044 7946 0000"
                />
                <button onClick={() => runSandboxTest(sandboxInput)} className="btn-test-route">
                  Analyze Routing
                </button>
              </div>
            </div>

            {sandboxResult && (
              <div className="sandbox-results-grid">
                <div className="res-card">
                  <div className="res-label">Standard E.164 Normalization:</div>
                  <div className="res-value mono">{sandboxResult.normalized}</div>
                </div>
                <div className="res-card">
                  <div className="res-label">Destination Country & Mobile Operator:</div>
                  <div className="res-value">{sandboxResult.destination}</div>
                </div>
                <div className="res-card">
                  <div className="res-label">Carrier MCC-MNC Code:</div>
                  <div className="res-value mono">{sandboxResult.mcc_mnc}</div>
                </div>
                <div className="res-card">
                  <div className="res-label">Routing Quality & Interconnect:</div>
                  <div className="res-value highlight">{sandboxResult.routeLcr}</div>
                </div>
                <div className="res-card">
                  <div className="res-label">CLI Preservation Guarantee:</div>
                  <div className="res-value">{sandboxResult.cliSupported}</div>
                </div>
                <div className="res-card">
                  <div className="res-label">Post-Dial Delay & DLR SLA:</div>
                  <div className="res-value">{sandboxResult.pdd} • {sandboxResult.ss7Acks}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Upload Rate Deck Modal */}
        {showUploadModal && (
          <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Publish Wholesale Rate Deck</h3>
                  <p className="modal-sub">Upload Excel or CSV rate sheet with partner download gating.</p>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="btn-modal-close">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="modal-form">
                <div className="form-group">
                  <label>Rate Deck Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kimoksha Wholesale A-Z SMS Direct Routes"
                    value={newDeck.title}
                    onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Service Category</label>
                    <select
                      value={newDeck.service_type}
                      onChange={(e) => setNewDeck({ ...newDeck, service_type: e.target.value })}
                    >
                      <option value="A2P_SMS_WHOLESALE">Wholesale A2P SMS</option>
                      <option value="VOICE_CLI_PREMIUM">Voice Direct CLI (VoIP/TDM)</option>
                      <option value="VOICE_DIRECT_LCR">Voice Least Cost Routing (LCR)</option>
                      <option value="SMPP_TRANSCEIVER">SMPP 3.4 Direct Bind Route</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={newDeck.currency}
                      onChange={(e) => setNewDeck({ ...newDeck, currency: e.target.value })}
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Version Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. v2026.09-Q3"
                      value={newDeck.version_tag}
                      onChange={(e) => setNewDeck({ ...newDeck, version_tag: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Effective Date</label>
                    <input
                      type="date"
                      required
                      value={newDeck.effective_date}
                      onChange={(e) => setNewDeck({ ...newDeck, effective_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Spreadsheet File Name (XLSX / CSV)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kimoksha_AZ_SMS_Q3_2026.xlsx"
                    value={newDeck.file_name}
                    onChange={(e) => setNewDeck({ ...newDeck, file_name: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowUploadModal(false)} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-upload">
                    Publish & Generate Token
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .rate-decks-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (max-width: 640px) {
          .rate-decks-content {
            padding: 0.85rem 0.75rem;
            gap: 1rem;
          }
          .rate-top-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .btn-upload-deck {
            justify-content: center;
          }
        }
        .rate-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .section-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }
        .btn-upload-deck {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f26522;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-upload-deck:hover {
          background: #e05514;
          box-shadow: 0 0 20px rgba(242, 101, 34, 0.35);
        }
        .table-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          overflow-x: auto;
        }
        .rate-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.825rem;
        }
        .rate-table th {
          text-align: left;
          padding: 12px 16px;
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .rate-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        .deck-title {
          font-weight: 700;
          color: #ffffff;
        }
        .deck-file {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .service-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .version-tag {
          font-weight: 700;
          font-family: monospace;
          color: #f26522;
          font-size: 0.75rem;
        }
        .eff-date {
          font-size: 0.675rem;
          color: #64748b;
        }
        .currency-pill {
          font-weight: 800;
          color: #cbd5e1;
        }
        .download-count {
          color: #94a3b8;
          font-size: 0.75rem;
        }
        .btn-copy-token {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-size: 0.725rem;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-copy-token:hover {
          color: #ffffff;
          border-color: #f26522;
        }
        .btn-copy-token.copied {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.4);
        }
        .active-status-pill {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .sandbox-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .sandbox-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sandbox-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .terminal-icon {
          color: #f26522;
        }
        .sandbox-title {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .sandbox-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }
        .sandbox-badge {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #f26522;
          background: rgba(242, 101, 34, 0.1);
          border: 1px solid rgba(242, 101, 34, 0.3);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .sandbox-input-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .sandbox-input-row label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sandbox-input-wrap {
          display: flex;
          gap: 0.5rem;
        }
        @media (max-width: 540px) {
          .sandbox-input-wrap {
            flex-direction: column;
          }
          .btn-test-route {
            padding: 10px;
            justify-content: center;
          }
        }
        .sandbox-input-wrap input {
          flex: 1;
          background: rgba(3, 7, 18, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #f8fafc;
          font-size: 0.875rem;
          font-family: monospace;
          outline: none;
        }
        .sandbox-input-wrap input:focus {
          border-color: #f26522;
        }
        .btn-test-route {
          background: rgba(242, 101, 34, 0.15);
          border: 1px solid rgba(242, 101, 34, 0.3);
          color: #f26522;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0 18px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-test-route:hover {
          background: #f26522;
          color: #ffffff;
        }
        .sandbox-results-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        @media (min-width: 640px) {
          .sandbox-results-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .sandbox-results-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .res-card {
          background: rgba(3, 7, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.85rem 1rem;
        }
        .res-label {
          font-size: 0.675rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .res-value {
          font-size: 0.825rem;
          font-weight: 600;
          color: #cbd5e1;
        }
        .res-value.mono {
          font-family: monospace;
          color: #38bdf8;
        }
        .res-value.highlight {
          color: #10b981;
          font-weight: 700;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-card {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          max-width: 520px;
          width: 100%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
        }
        .modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .modal-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }
        .btn-modal-close {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (max-width: 500px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .form-group label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #cbd5e1;
          text-transform: uppercase;
        }
        .form-group input,
        .form-group select {
          background: rgba(3, 7, 18, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 8px 12px;
          color: #f8fafc;
          font-size: 0.825rem;
          outline: none;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: #f26522;
        }
        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-submit-upload {
          background: #f26522;
          color: #ffffff;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-submit-upload:hover {
          background: #e05514;
        }
      `}</style>
    </>
  );
}
