'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Users,
  Search,
  Download,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  FileSpreadsheet,
  X,
  MessageSquare,
  Globe,
  Radio,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Inquiries' },
  { id: 'NEW', label: 'New / Unread' },
  { id: 'CONTACTED', label: 'Contacted' },
  { id: 'RATE_CARD_SENT', label: 'Rate Card Sent' },
  { id: 'TEST_BIND_PROVISIONED', label: 'Test Bind Live' },
  { id: 'CONVERTED', label: 'Converted' },
  { id: 'ARCHIVED', label: 'Archived' },
];

export default function LeadsCrmPage() {
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/leads?status=${activeTab}&search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setLeads(data.leads);
      }
    } catch (e) {
      console.error('Leads fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [activeTab, searchQuery]);

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {}
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedLead) return;
    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_text: newNoteText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotes((prev) => [data.note, ...prev]);
          setNewNoteText('');
        }
      }
    } catch (e) {
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const openLeadDetails = async (lead) => {
    setSelectedLead(lead);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notes) && data.notes.length > 0) {
          setNotes(data.notes);
          return;
        }
      }
    } catch (e) {}

    // Initial audit trace if no manual notes yet
    setNotes([
      {
        id: 'note-init',
        author_name: 'Lead Intake Pipeline',
        author_role: 'NOC CRM Core',
        note_text: `Inquiry submitted via carrier portal from IP: ${lead.ip_address || '127.0.0.1'} (${lead.geo_country || 'International'}). Service requested: ${lead.target_service || 'General Interconnect'}.`,
        created_at: lead.created_at,
      },
    ]);
  };

  return (
    <>
      <AdminHeader
        title="Inbound Leads & Carrier Interconnect CRM"
        subtitle="Manage prospective carrier partners, triage rate card requests, and track conversion pipeline."
      />

      <main className="crm-container">
        {/* Actions Bar: Search, Status Tabs, CSV Export */}
        <div className="crm-toolbar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by carrier name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <a href="/api/admin/leads/export" className="btn-export-csv" download>
            <Download size={14} />
            <span>Export CSV</span>
          </a>
        </div>

        {/* Status Pipeline Tabs */}
        <div className="status-tabs-row">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`status-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="crm-table-box">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Carrier / Lead</th>
                <th>Service Requested</th>
                <th>Location / IP</th>
                <th>Submitted</th>
                <th>Pipeline Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading carrier leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No carrier inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="clickable-row" onClick={() => openLeadDetails(lead)}>
                    <td>
                      <div className="lead-primary-name">{lead.full_name}</div>
                      <div className="lead-primary-email">{lead.corporate_email}</div>
                      {lead.company_name && <div className="lead-company">{lead.company_name}</div>}
                    </td>
                    <td>
                      <div className="lead-service-tag">{lead.target_service || 'General Inquiry'}</div>
                      <div className="lead-subject-preview">{lead.subject}</div>
                    </td>
                    <td>
                      <div className="geo-badge">
                        <MapPin size={10} />
                        <span>{lead.geo_country || 'Global'}</span>
                      </div>
                      <div className="ip-text">{lead.ip_address || '127.0.0.1'}</div>
                    </td>
                    <td>
                      <div className="time-text">
                        <Calendar size={11} />
                        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="time-sub">
                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill pill-${lead.status.toLowerCase()}`}>
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeadDetails(lead);
                        }}
                        className="btn-inspect-lead"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Lead Profile Inspector Drawer / Modal */}
        {selectedLead && (
          <div className="modal-backdrop" onClick={() => setSelectedLead(null)}>
            <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <div>
                  <div className="drawer-badge">LEAD INSPECTOR</div>
                  <h2 className="drawer-title">{selectedLead.full_name}</h2>
                  <p className="drawer-sub">{selectedLead.corporate_email}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="btn-close">
                  <X size={18} />
                </button>
              </div>

              <div className="drawer-body">
                {/* Status Pipeline Controller */}
                <div className="pipeline-control-box">
                  <label className="drawer-label">Update Pipeline Stage:</label>
                  <div className="pipeline-btns">
                    {[
                      { id: 'NEW', label: 'New' },
                      { id: 'CONTACTED', label: 'Contacted' },
                      { id: 'RATE_CARD_SENT', label: 'Rate Card Sent' },
                      { id: 'TEST_BIND_PROVISIONED', label: 'Test Bind' },
                      { id: 'CONVERTED', label: 'Converted' },
                      { id: 'ARCHIVED', label: 'Archived' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleUpdateStatus(selectedLead.id, st.id)}
                        className={`pipe-btn ${selectedLead.status === st.id ? 'active' : ''}`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lead Message Card */}
                <div className="details-card">
                  <div className="details-row">
                    <span className="details-label">Subject:</span>
                    <span className="details-value">{selectedLead.subject}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Service:</span>
                    <span className="details-value highlight">{selectedLead.target_service}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Location:</span>
                    <span className="details-value">
                      {selectedLead.geo_country} • IP: {selectedLead.ip_address}
                    </span>
                  </div>
                  <div className="message-box">
                    <div className="message-label">Raw Inbound Inquiry Message:</div>
                    <div className="message-content">{selectedLead.message || 'No additional message provided.'}</div>
                  </div>
                  <a
                    href={`mailto:${selectedLead.corporate_email}?subject=RE: ${encodeURIComponent(selectedLead.subject)} - Kimoksha Telecom Interconnect`}
                    className="btn-mailto-reply"
                  >
                    <Mail size={14} />
                    <span>Launch Direct Email Reply</span>
                  </a>
                </div>

                {/* Internal Team Discussion Thread */}
                <div className="notes-section">
                  <h4 className="notes-title">
                    <MessageSquare size={14} />
                    <span>Internal Team Notes & Audit History</span>
                  </h4>

                  <form onSubmit={handleAddNote} className="note-form">
                    <textarea
                      rows={2}
                      placeholder="Add an internal note or update for NOC/Sales team..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                    />
                    <button type="submit" disabled={isSubmittingNote || !newNoteText.trim()}>
                      <Send size={12} />
                      <span>{isSubmittingNote ? 'Saving...' : 'Post Note'}</span>
                    </button>
                  </form>

                  <div className="notes-list">
                    {notes.map((n) => (
                      <div key={n.id} className="note-card">
                        <div className="note-header">
                          <span className="note-author">{n.author_name}</span>
                          <span className="note-time">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="note-body">{n.note_text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .crm-container {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .crm-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .search-box {
          position: relative;
          max-width: 400px;
          width: 100%;
        }
        .search-box :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }
        .search-box input {
          width: 100%;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 9px 12px 9px 36px;
          color: #f8fafc;
          font-size: 0.825rem;
          outline: none;
        }
        .search-box input:focus {
          border-color: #f26522;
        }
        .btn-export-csv {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-export-csv:hover {
          background: rgba(242, 101, 34, 0.15);
          border-color: rgba(242, 101, 34, 0.3);
          color: #f26522;
        }
        .status-tabs-row {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .status-tab {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .status-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }
        .status-tab.active {
          background: #f26522;
          color: #ffffff;
          border-color: #f26522;
          font-weight: 700;
        }
        .crm-table-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          overflow-x: auto;
        }
        .crm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.825rem;
        }
        .crm-table th {
          text-align: left;
          padding: 12px 16px;
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .crm-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        .clickable-row {
          cursor: pointer;
          transition: background 0.15s;
        }
        .clickable-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .lead-primary-name {
          font-weight: 700;
          color: #ffffff;
        }
        .lead-primary-email {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .lead-company {
          font-size: 0.7rem;
          color: #f26522;
        }
        .lead-service-tag {
          font-weight: 600;
          color: #38bdf8;
          font-size: 0.75rem;
        }
        .lead-subject-preview {
          font-size: 0.725rem;
          color: #64748b;
          max-width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .geo-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.725rem;
          color: #cbd5e1;
        }
        .ip-text {
          font-size: 0.675rem;
          color: #64748b;
          font-family: monospace;
          margin-top: 2px;
        }
        .time-text {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #cbd5e1;
        }
        .time-sub {
          font-size: 0.675rem;
          color: #64748b;
        }
        .status-pill {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .pill-new {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .pill-contacted {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }
        .pill-rate_card_sent {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }
        .pill-test_bind_provisioned {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }
        .pill-converted {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        .pill-archived {
          background: rgba(100, 116, 139, 0.15);
          color: #94a3b8;
        }
        .btn-inspect-lead {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-size: 0.725rem;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-inspect-lead:hover {
          color: #ffffff;
          border-color: #f26522;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .drawer-panel {
          width: 540px;
          max-width: 100%;
          background: #0f172a;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .drawer-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .drawer-badge {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #f26522;
          margin-bottom: 4px;
        }
        .drawer-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .drawer-sub {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }
        .drawer-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .pipeline-control-box {
          background: rgba(3, 7, 18, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 1rem;
        }
        .drawer-label {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          display: block;
          margin-bottom: 8px;
        }
        .pipeline-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .pipe-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }
        .pipe-btn.active {
          background: #f26522;
          color: #ffffff;
          border-color: #f26522;
        }
        .details-card {
          background: rgba(3, 7, 18, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .details-row {
          display: flex;
          font-size: 0.8rem;
        }
        .details-label {
          width: 80px;
          color: #64748b;
          font-weight: 600;
        }
        .details-value {
          color: #cbd5e1;
          flex: 1;
        }
        .details-value.highlight {
          color: #f26522;
          font-weight: 700;
        }
        .message-box {
          margin-top: 0.5rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.85rem;
        }
        .message-label {
          font-size: 0.675rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .message-content {
          font-size: 0.825rem;
          color: #f8fafc;
          line-height: 1.5;
        }
        .btn-mailto-reply {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(242, 101, 34, 0.15);
          border: 1px solid rgba(242, 101, 34, 0.3);
          color: #f26522;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 10px;
          border-radius: 8px;
          text-decoration: none;
          margin-top: 0.5rem;
        }
        .btn-mailto-reply:hover {
          background: #f26522;
          color: #ffffff;
        }
        .notes-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .notes-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #cbd5e1;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .note-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .note-form textarea {
          width: 100%;
          background: rgba(3, 7, 18, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px 12px;
          color: #f8fafc;
          font-size: 0.8rem;
          outline: none;
        }
        .note-form button {
          align-self: flex-end;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f26522;
          color: #ffffff;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
        }
        .notes-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .note-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 8px 12px;
        }
        .note-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          margin-bottom: 2px;
        }
        .note-author {
          font-weight: 700;
          color: #f26522;
        }
        .note-time {
          color: #64748b;
        }
        .note-body {
          font-size: 0.775rem;
          color: #cbd5e1;
          line-height: 1.4;
        }
      `}</style>
    </>
  );
}
