'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Users,
  FileSpreadsheet,
  Activity,
  Server,
  ArrowUpRight,
  Clock,
  MapPin,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setData(json);
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Optimistic UI update
        setData((prev) => ({
          ...prev,
          recentLeads: prev.recentLeads.map((l) =>
            l.id === leadId ? { ...l, status: newStatus } : l
          ),
        }));
      }
    } catch (e) {}
  };

  const handlePoPToggle = async (popCode, currentStatus) => {
    const nextStatus = currentStatus === 'ONLINE' ? 'MAINTENANCE' : 'ONLINE';
    try {
      const res = await fetch(`/api/admin/cms/network-pops/${popCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          pops: prev.pops.map((p) =>
            p.pop_code === popCode ? { ...p, status: nextStatus } : p
          ),
        }));
      }
    } catch (e) {}
  };

  return (
    <>
      <AdminHeader
        title="Operations Command Center"
        subtitle="Real-time telecommunications telemetry, carrier leads pipeline, and routing core."
      />

      <main className="dashboard-content">
        {/* Top Controls Bar */}
        <div className="top-bar">
          <div>
            <span className="live-indicator">
              <Radio size={12} className="pulse-ping" />
              <span>CARRIER TELEMETRY LIVE</span>
            </span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="btn-refresh"
            disabled={isRefreshing}
            title="Refresh Metrics"
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* KPI Metric Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Inbound Carrier Leads</span>
              <div className="kpi-icon-wrap icon-orange">
                <Users size={18} />
              </div>
            </div>
            <div className="kpi-value">{data?.telemetry?.totalLeads || '14'}</div>
            <div className="kpi-footer">
              <span className="kpi-highlight">{data?.telemetry?.newLeads || '5'} New Inquiries</span>
              <span className="kpi-subtext"> requiring triage</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Active Rate Decks</span>
              <div className="kpi-icon-wrap icon-blue">
                <FileSpreadsheet size={18} />
              </div>
            </div>
            <div className="kpi-value">{data?.telemetry?.activeRateDecks || '8'}</div>
            <div className="kpi-footer">
              <span className="kpi-highlight">A-Z SMS & Voice</span>
              <span className="kpi-subtext"> versions live</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Network Uptime SLA</span>
              <div className="kpi-icon-wrap icon-green">
                <Activity size={18} />
              </div>
            </div>
            <div className="kpi-value">{data?.telemetry?.uptimeSla || '99.99%'}</div>
            <div className="kpi-footer">
              <span className="kpi-highlight">Sub-Second SLA</span>
              <span className="kpi-subtext"> zero route drop</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Direct MNO Binds</span>
              <div className="kpi-icon-wrap icon-purple">
                <Server size={18} />
              </div>
            </div>
            <div className="kpi-value">{data?.telemetry?.bilateralMnoBinds || '500+'}</div>
            <div className="kpi-footer">
              <span className="kpi-highlight">200+ Countries</span>
              <span className="kpi-subtext"> bilateral reach</span>
            </div>
          </div>
        </div>

        {/* Live PoP Latency Monitor Strip */}
        <section className="dashboard-section">
          <div className="section-title-wrap">
            <div className="section-title-left">
              <Server size={18} className="section-icon" />
              <div>
                <h2 className="section-title">Live Carrier Exchange PoPs (Equinix Hubs)</h2>
                <p className="section-subtitle">
                  Real-time latency metrics and operational status for global routing nodes. Click status to toggle maintenance.
                </p>
              </div>
            </div>
            <Link href="/admin/rate-decks" className="section-link">
              <span>Wholesale Rate Decks</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="pop-grid">
            {(data?.pops || []).map((pop) => {
              const isOnline = pop.status === 'ONLINE';
              return (
                <div key={pop.pop_code} className={`pop-card ${isOnline ? 'online' : 'maint'}`}>
                  <div className="pop-top">
                    <span className="pop-code">{pop.pop_code}</span>
                    <button
                      onClick={() => handlePoPToggle(pop.pop_code, pop.status)}
                      className={`pop-status-btn ${isOnline ? 'btn-online' : 'btn-maint'}`}
                      title="Click to toggle status"
                    >
                      {isOnline ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      <span>{pop.status}</span>
                    </button>
                  </div>
                  <div className="pop-name">{pop.name}</div>
                  <div className="pop-city">
                    <MapPin size={12} />
                    <span>{pop.city}, {pop.country}</span>
                  </div>
                  <div className="pop-latency-row">
                    <span className="pop-latency-label">Backbone Latency:</span>
                    <span className="pop-latency-val">{pop.latency_ms}ms</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Split Grid: Recent Leads CRM & Service Traffic Interest */}
        <div className="dual-grid">
          {/* Left: Recent Inbound Leads */}
          <div className="panel-box">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Recent Inbound Carrier Inquiries</h3>
                <p className="panel-subtitle">&quot;Lets Connect&quot; form submissions requiring operator attention</p>
              </div>
              <Link href="/admin/leads" className="btn-view-all">
                <span>All Leads</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="leads-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Carrier / Contact</th>
                    <th>Target Service</th>
                    <th>Country</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentLeads || []).map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className="lead-name">{lead.full_name}</div>
                        <div className="lead-email">{lead.corporate_email}</div>
                      </td>
                      <td>
                        <div className="lead-service">{lead.target_service}</div>
                        <div className="lead-subject">{lead.subject}</div>
                      </td>
                      <td>
                        <span className="country-pill">{lead.geo_country || 'Global'}</span>
                      </td>
                      <td>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`status-select status-${lead.status.toLowerCase()}`}
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="RATE_CARD_SENT">Rate Card Sent</option>
                          <option value="TEST_BIND_PROVISIONED">Test Bind</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Route Traffic Analytics Breakdown */}
          <div className="panel-box">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Service Traffic & Route Inquiries</h3>
                <p className="panel-subtitle">Monthly breakdown by telecom service category</p>
              </div>
            </div>

            <div className="analytics-list">
              {(data?.serviceInterestDistribution || []).map((item) => (
                <div key={item.service} className="analytics-item">
                  <div className="analytics-meta">
                    <span className="service-name">{item.service}</span>
                    <span className="service-count">{item.count} Inquiries ({item.percentage}%)</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="quick-actions-box">
              <h4 className="quick-actions-title">NOC Rapid Shortcuts</h4>
              <div className="shortcuts-grid">
                <Link href="/admin/rate-decks" className="shortcut-btn">
                  <FileSpreadsheet size={14} />
                  <span>Upload Rate Deck</span>
                </Link>
                <Link href="/admin/settings" className="shortcut-btn">
                  <Server size={14} />
                  <span>Config & Theme</span>
                </Link>
                <Link href="/admin/leads" className="shortcut-btn">
                  <Users size={14} />
                  <span>Export CSV</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #f26522;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .btn-refresh {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-refresh:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1200px) {
          .kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .kpi-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }
        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .kpi-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .kpi-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-orange {
          background: rgba(242, 101, 34, 0.15);
          color: #f26522;
        }
        .icon-blue {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }
        .icon-green {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .icon-purple {
          background: rgba(168, 85, 247, 0.15);
          color: #a855f7;
        }
        .kpi-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.35rem;
          letter-spacing: -0.02em;
        }
        .kpi-footer {
          font-size: 0.75rem;
        }
        .kpi-highlight {
          color: #f26522;
          font-weight: 700;
        }
        .kpi-subtext {
          color: #64748b;
        }
        .dashboard-section {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
        }
        .section-title-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .section-title-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .section-icon {
          color: #f26522;
        }
        .section-title {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .section-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }
        .section-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f26522;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
        }
        .pop-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .pop-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .pop-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .pop-card {
          background: rgba(3, 7, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          transition: all 0.2s;
        }
        .pop-card.online {
          border-left: 3px solid #10b981;
        }
        .pop-card.maint {
          border-left: 3px solid #f59e0b;
        }
        .pop-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pop-code {
          font-size: 0.9rem;
          font-weight: 800;
          color: #ffffff;
          font-family: monospace;
        }
        .pop-status-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
        }
        .btn-online {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .btn-maint {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }
        .pop-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
        }
        .pop-city {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #64748b;
        }
        .pop-latency-row {
          margin-top: 0.4rem;
          padding-top: 0.4rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
        }
        .pop-latency-label {
          color: #94a3b8;
        }
        .pop-latency-val {
          color: #10b981;
          font-weight: 800;
          font-family: monospace;
        }
        .dual-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1100px) {
          .dual-grid {
            grid-template-columns: 1.4fr 1fr;
          }
        }
        .panel-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .panel-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .panel-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }
        .btn-view-all {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #f26522;
          text-decoration: none;
        }
        .leads-table-container {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }
        .admin-table th {
          text-align: left;
          padding: 8px 10px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .admin-table td {
          padding: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #cbd5e1;
        }
        .lead-name {
          font-weight: 700;
          color: #ffffff;
        }
        .lead-email {
          font-size: 0.7rem;
          color: #94a3b8;
        }
        .lead-service {
          font-weight: 600;
          color: #f26522;
          font-size: 0.75rem;
        }
        .lead-subject {
          font-size: 0.7rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }
        .country-pill {
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
        }
        .status-select {
          background: rgba(3, 7, 18, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f8fafc;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 6px;
          border-radius: 6px;
          outline: none;
        }
        .analytics-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .analytics-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-bottom: 4px;
        }
        .service-name {
          color: #ffffff;
          font-weight: 600;
        }
        .service-count {
          color: #94a3b8;
        }
        .progress-bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f26522, #f59e0b);
          border-radius: 9999px;
        }
        .quick-actions-box {
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .quick-actions-title {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 0.75rem;
        }
        .shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .shortcut-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: rgba(3, 7, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 6px;
          border-radius: 8px;
          text-decoration: none;
          color: #cbd5e1;
          font-size: 0.7rem;
          font-weight: 600;
          text-align: center;
          transition: all 0.2s;
        }
        .shortcut-btn:hover {
          background: rgba(242, 101, 34, 0.15);
          border-color: rgba(242, 101, 34, 0.3);
          color: #ffffff;
        }
      `}</style>
    </>
  );
}
