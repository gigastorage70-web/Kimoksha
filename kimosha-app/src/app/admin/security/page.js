'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Globe,
  Clock,
  Plus,
  X,
} from 'lucide-react';

export default function SecurityPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [blockedIps, setBlockedIps] = useState([]);
  const [securityShield, setSecurityShield] = useState({
    lockoutThreshold: 7,
    lockoutDurationMin: 30,
    currentBlockedCount: 0,
  });

  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'blocked'
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newReason, setNewReason] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/security');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setBlockedIps(data.blockedIps || []);
        if (data.securityShield) {
          setSecurityShield(data.securityShield);
        }
      }
    } catch (e) {
      console.error('Failed to load security logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleBlockIp = async (e) => {
    e.preventDefault();
    if (!newIp.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BLOCK_IP',
          ip_address: newIp.trim(),
          reason: newReason.trim() || 'Manual Operator Blacklist',
          is_permanent: isPermanent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setShowBlockModal(false);
        setNewIp('');
        setNewReason('');
        setIsPermanent(false);
        fetchSecurityData();
      } else {
        showToast(data.error || 'Failed to block IP', 'error');
      }
    } catch (err) {
      showToast('Error communicating with security service', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleUnblockIp = async (ip) => {
    if (!confirm(`Are you sure you want to unblock IP ${ip}?`)) return;

    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UNBLOCK_IP',
          ip_address: ip,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`IP ${ip} unblocked successfully.`, 'success');
        setBlockedIps((prev) => prev.filter((b) => b.ip_address !== ip));
      } else {
        showToast(data.error || 'Failed to unblock IP', 'error');
      }
    } catch (e) {
      showToast('Error unblocking IP', 'error');
    }
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch =
      !searchQuery ||
      (log.operator_username && log.operator_username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.ip_address && log.ip_address.includes(searchQuery)) ||
      (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  return (
    <>
      <AdminHeader
        title="Security Operations & Audit Telemetry"
        subtitle="Real-time operator action logging, automated 7-attempt brute-force protection, and perimeter IP blacklist."
      />
      <div className="security-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="title-row">
            <h1 className="page-title">Security & Audit Logs</h1>
            <div className="shield-tag">
              <ShieldCheck size={14} />
              7-ATTEMPT BRUTE-FORCE SHIELD ACTIVE
            </div>
          </div>
          <p className="page-subtitle">
            Carrier-grade security telemetry. Real-time operator audit trails, automated brute-force IP blacklists, and session tracking.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => setShowBlockModal(true)}
          >
            <Plus size={16} />
            Block Malicious IP
          </button>
          <button onClick={fetchSecurityData} className="btn-secondary" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.message && (
        <div className={`alert-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="security-kpis">
        <div className="kpi-card">
          <div className="kpi-icon-wrap green">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="kpi-val text-green">ARMED</div>
            <div className="kpi-lbl">Lockout Threshold (7 attempts)</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap orange">
            <Lock size={22} />
          </div>
          <div>
            <div className="kpi-val">{blockedIps.length}</div>
            <div className="kpi-lbl">Blocked IP Addresses</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="kpi-val">{logs.length}</div>
            <div className="kpi-lbl">Total Audit Events Recorded</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap purple">
            <Clock size={22} />
          </div>
          <div>
            <div className="kpi-val">30 Min</div>
            <div className="kpi-lbl">Session Idle Timeout</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="security-tabs">
        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <Clock size={16} />
          Audit Trail Log ({logs.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'blocked' ? 'active' : ''}`}
          onClick={() => setActiveTab('blocked')}
        >
          <Lock size={16} />
          Blocked IP Blacklist ({blockedIps.length})
        </button>
      </div>

      {/* TAB 1: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="panel">
          {/* Controls */}
          <div className="table-controls">
            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by IP, username, or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-select-wrap">
              <Filter size={14} className="filter-icon" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Actions</option>
                <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
                <option value="LOGIN_FAILED">LOGIN_FAILED</option>
                <option value="BRUTE_FORCE_LOCKOUT">BRUTE_FORCE_LOCKOUT</option>
                <option value="CMS_CONTENT_UPDATE">CMS_CONTENT_UPDATE</option>
                <option value="RATE_DECK_UPLOAD">RATE_DECK_UPLOAD</option>
                <option value="MANUAL_IP_BLOCK">MANUAL_IP_BLOCK</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Operator</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Details & Context</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      No audit events found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', color: '#94a3b8', fontSize: '0.8rem' }}>
                        {new Date(log.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td>
                        <span className="operator-badge">{log.operator_username || 'system'}</span>
                      </td>
                      <td>
                        <span className="action-code">{log.action}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${log.status?.toLowerCase() || 'success'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>
                        <span className="ip-mono">{log.ip_address}</span>
                      </td>
                      <td>
                        <span className="details-text" title={log.details || ''}>
                          {log.details ? log.details.slice(0, 70) + (log.details.length > 70 ? '...' : '') : '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BLOCKED IPS */}
      {activeTab === 'blocked' && (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Active IP Blacklist</h2>
              <p className="panel-desc">
                IP addresses locked out automatically by the 7-consecutive-failed-logins threshold or manually blocked by administrators.
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Lockout Reason</th>
                  <th>Failed Tries</th>
                  <th>Duration / Expiration</th>
                  <th>Blocked On</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blockedIps.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      No IP addresses are currently blocked. Carrier perimeter is clear.
                    </td>
                  </tr>
                ) : (
                  blockedIps.map((block) => (
                    <tr key={block.id}>
                      <td>
                        <span className="ip-mono bold">{block.ip_address}</span>
                      </td>
                      <td>
                        <span className="reason-text">{block.reason}</span>
                      </td>
                      <td>
                        <span className="tries-badge">{block.failed_attempts || 7}</span>
                      </td>
                      <td>
                        {block.is_permanent ? (
                          <span className="perm-badge">PERMANENT BLACKLIST</span>
                        ) : block.blocked_until ? (
                          <span className="exp-text">
                            Until {new Date(block.blocked_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          <span className="exp-text">30 min temporary</span>
                        )}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {new Date(block.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-unblock"
                          onClick={() => handleUnblockIp(block.ip_address)}
                          title="Unblock IP"
                        >
                          <Unlock size={14} />
                          Unblock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual IP Block Modal */}
      {showBlockModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} className="text-orange" />
                <h3 className="modal-title">Manual IP Blacklist Entry</h3>
              </div>
              <button
                className="btn-close"
                onClick={() => setShowBlockModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBlockIp}>
              <div className="modal-body">
                <div className="form-group">
                  <label>IP Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 185.220.101.5"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                  />
                  <span className="hint">IPv4 or IPv6 client address</span>
                </div>

                <div className="form-group">
                  <label>Reason for Blacklist</label>
                  <input
                    type="text"
                    placeholder="e.g. Malicious port scan / SIP scanner"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                  />
                </div>

                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="permCheck"
                    checked={isPermanent}
                    onChange={(e) => setIsPermanent(e.target.checked)}
                  />
                  <label htmlFor="permCheck">
                    Permanent Blacklist (Do not auto-expire after 30 minutes)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowBlockModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={processing || !newIp}
                >
                  {processing ? 'Blacklisting...' : 'Enforce IP Blacklist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .security-page {
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
          .btn-primary,
          .btn-secondary {
            justify-content: center;
            width: 100%;
          }
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .shield-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(242, 101, 34, 0.12);
          border: 1px solid rgba(242, 101, 34, 0.3);
          color: #f26522;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 9999px;
          letter-spacing: 0.05em;
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
        .security-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .kpi-card {
          background: #0d1522;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .kpi-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-icon-wrap.green {
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
        }
        .kpi-icon-wrap.orange {
          background: rgba(242, 101, 34, 0.12);
          color: #f26522;
        }
        .kpi-icon-wrap.blue {
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
        }
        .kpi-icon-wrap.purple {
          background: rgba(168, 85, 247, 0.12);
          color: #c084fc;
        }
        .kpi-val {
          font-size: 1.35rem;
          font-weight: 800;
          color: #f8fafc;
        }
        .text-green {
          color: #4ade80 !important;
        }
        .text-orange {
          color: #f26522 !important;
        }
        .kpi-lbl {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.15rem;
        }
        .security-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: #f1f5f9;
        }
        .tab-btn.active {
          color: #f26522;
          border-bottom-color: #f26522;
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
        .panel-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 1rem;
        }
        .panel-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
        }
        .panel-desc {
          font-size: 0.825rem;
          color: #64748b;
          margin-top: 0.2rem;
        }
        .table-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.5rem 0.8rem;
          width: 320px;
        }
        .search-icon {
          color: #64748b;
        }
        .search-bar input {
          background: transparent;
          border: none;
          color: #f8fafc;
          font-size: 0.825rem;
          outline: none;
          width: 100%;
        }
        .filter-select-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.5rem 0.8rem;
        }
        .filter-icon {
          color: #64748b;
        }
        .filter-select {
          background: transparent;
          border: none;
          color: #f8fafc;
          font-size: 0.825rem;
          outline: none;
          cursor: pointer;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .admin-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .admin-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        .operator-badge {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .action-code {
          font-family: monospace;
          font-size: 0.8rem;
          font-weight: 700;
          color: #38bdf8;
        }
        .status-pill {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .status-pill.success {
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
        }
        .status-pill.warning {
          background: rgba(251, 191, 36, 0.12);
          color: #fbbf24;
        }
        .status-pill.failed {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
        }
        .ip-mono {
          font-family: monospace;
          color: #94a3b8;
          font-size: 0.825rem;
        }
        .ip-mono.bold {
          font-weight: 700;
          color: #f8fafc;
        }
        .details-text {
          color: #64748b;
          font-size: 0.775rem;
        }
        .reason-text {
          color: #cbd5e1;
          font-size: 0.825rem;
        }
        .tries-badge {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .perm-badge {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-weight: 800;
          font-size: 10px;
          padding: 3px 6px;
          border-radius: 4px;
        }
        .exp-text {
          color: #94a3b8;
          font-size: 0.8rem;
        }
        .btn-unblock {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-unblock:hover {
          background: #22c55e;
          color: #ffffff;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 1rem;
        }
        .modal-box {
          background: #0d1522;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #f8fafc;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }
        .modal-body {
          padding: 1.5rem;
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
        .form-group input {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.9rem;
          padding: 0.65rem 0.85rem;
          outline: none;
        }
        .hint {
          font-size: 0.7rem;
          color: #64748b;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: #cbd5e1;
        }
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
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
