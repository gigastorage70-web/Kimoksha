'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  UserCheck,
  Hexagon,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  X,
  Mail,
  Trash2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'noc_operator',
    email_verified: true,
    mfa_enabled: true,
  });

  // Fetch live operators from Supabase via API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching live operators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newUser.username.trim()) {
      setFormError('Username is required.');
      return;
    }
    if (!newUser.email.trim()) {
      setFormError('Corporate email is required.');
      return;
    }
    if (!newUser.password || newUser.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to provision operator in Supabase.');
        return;
      }

      showToast(data.message || 'Operator provisioned successfully in Supabase!');
      setShowAddModal(false);
      setNewUser({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'noc_operator',
        email_verified: true,
        mfa_enabled: true,
      });
      await fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Network error while connecting to Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.username.toLowerCase() === 'admin') {
      alert('The root Super Admin account cannot be deleted.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently revoke credentials for @${user.username} (${user.name}) from Supabase?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to revoke operator.');
        return;
      }

      showToast(data.message || `Operator @${user.username} revoked from Supabase.`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      alert('Error connecting to server: ' + err.message);
    }
  };

  const formatRoleLabel = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'super_admin':
        return 'SUPER ADMIN';
      case 'noc_operator':
      case 'noc_engineer':
        return 'NOC OPERATOR';
      case 'carrier_manager':
        return 'CARRIER MANAGER';
      case 'sales_rep':
      case 'sales_billing':
        return 'SALES REP';
      default:
        return (role || 'OPERATOR').replace(/_/g, ' ').toUpperCase();
    }
  };

  const getRoleBadgeClass = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'super_admin':
        return 'role-super_admin';
      case 'noc_operator':
      case 'noc_engineer':
        return 'role-noc_operator';
      case 'carrier_manager':
        return 'role-carrier_manager';
      case 'sales_rep':
      case 'sales_billing':
        return 'role-sales_rep';
      default:
        return 'role-noc_operator';
    }
  };

  return (
    <>
      <AdminHeader
        title="User & Operator Access Management"
        subtitle="Live Supabase RBAC operator directory. Provision credentials, assign clearance, and manage security credentials."
      />

      <div className="users-page">
        {/* Toast alert */}
        {toastMessage && (
          <div className={`toast-banner ${toastMessage.type}`}>
            <CheckCircle2 size={16} />
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* KPI Strip */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Console Operators</span>
            <div className="stat-val">{loading ? '...' : users.length}</div>
            <span className="stat-sub">Live Supabase Database</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Active Operators</span>
            <div className="stat-val text-green">
              {loading ? '...' : `${users.filter((u) => u.status === 'ACTIVE').length} Active`}
            </div>
            <span className="stat-sub">Role-Based Access Control</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Security & MFA Enforced</span>
            <div className="stat-val text-orange">
              {loading
                ? '...'
                : users.length > 0
                ? `${Math.round(
                    (users.filter((u) => u.mfa_enabled).length / users.length) * 100
                  )}% Enforced`
                : '100% Enforced'}
            </div>
            <span className="stat-sub">TOTP / Hardware & Verified</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Clearance Distribution</span>
            <div className="stat-val">
              {loading ? '...' : `${new Set(users.map((u) => u.role)).size} Roles`}
            </div>
            <span className="stat-sub">Super Admin, NOC, Wholesale</span>
          </div>
        </div>

        {/* Top Controls */}
        <div className="controls-bar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search by operator name, username, role, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="controls-actions">
            <button
              onClick={fetchUsers}
              className="btn-refresh"
              title="Refresh live operators from Supabase"
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'spinning' : ''} />
              <span>Refresh</span>
            </button>

            <button onClick={() => setShowAddModal(true)} className="btn-add">
              <Plus size={16} />
              <span>Add Operator</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>OPERATOR</th>
                <th>ROLE & PERMISSIONS</th>
                <th>CORPORATE EMAIL</th>
                <th>MFA STATUS</th>
                <th>LAST ACTIVE</th>
                <th>ACCOUNT STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--admin-text-muted)' }}
                  >
                    <RefreshCw size={24} className="spinning" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div>Loading live console operators from Supabase...</div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--admin-text-muted)' }}
                  >
                    <UserCheck size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                      No console operators found
                    </div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      Click "Add Operator" above to provision live credentials.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const initial = (u.username || u.name || 'O').charAt(0).toUpperCase();
                  const isRootAdmin = u.username.toLowerCase() === 'admin';

                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-profile">
                          <div className="user-avatar">{initial}</div>
                          <div className="user-info">
                            <div className="user-name">{u.name}</div>
                            <div className="user-uname">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(u.role)}`}>
                          <Hexagon size={11} strokeWidth={2.5} />
                          <span>{formatRoleLabel(u.role)}</span>
                        </span>
                      </td>
                      <td>
                        <div className="email-cell">
                          <Mail size={13} />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td>
                        {u.mfa_enabled ? (
                          <span className="mfa-pill enabled">
                            <CheckCircle2 size={11} />
                            <span>MFA Enabled</span>
                          </span>
                        ) : (
                          <span className="mfa-pill disabled">
                            <Lock size={11} />
                            <span>Not Enforced</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="last-login">{u.last_login || 'Never'}</span>
                      </td>
                      <td>
                        <span className="status-pill-active">{u.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {!isRootAdmin ? (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="btn-delete"
                            title={`Revoke @${u.username} from Supabase`}
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <span
                            className="root-protected"
                            title="Root Super Admin account cannot be revoked"
                          >
                            <Lock size={13} />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Console Operator Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => !submitting && setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Provision New Console Operator</h3>
                <p className="modal-sub">Create credentials with role-based access rights.</p>
              </div>
              <button
                onClick={() => !submitting && setShowAddModal(false)}
                className="btn-close"
                disabled={submitting}
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="modal-error">
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label>Full Operator Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. jdoe_noc"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Role / Clearance *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    disabled={submitting}
                  >
                    <option value="super_admin">Super Admin (Full Root Access)</option>
                    <option value="noc_operator">NOC Operator (Telemetry & Rates)</option>
                    <option value="carrier_manager">Carrier Manager (Wholesale CRM)</option>
                    <option value="sales_rep">Sales Representative (Leads Only)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Corporate Email *</label>
                <input
                  type="email"
                  required
                  placeholder="operator@kimokshatelco.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Set Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter secure password (min. 6 characters)"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="checkboxes-group">
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="mfa-toggle"
                    checked={newUser.mfa_enabled}
                    onChange={(e) => setNewUser({ ...newUser, mfa_enabled: e.target.checked })}
                    disabled={submitting}
                  />
                  <label htmlFor="mfa-toggle">Require Multi-Factor Authentication (TOTP / SMS)</label>
                </div>

                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="verify-toggle"
                    checked={newUser.email_verified}
                    onChange={(e) => setNewUser({ ...newUser, email_verified: e.target.checked })}
                    disabled={submitting}
                  />
                  <label htmlFor="verify-toggle">
                    Verify Email (Mark corporate email as verified and authorized)
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-cancel"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Provisioning in Supabase...' : 'Create Operator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .users-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .toast-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 600;
        }
        .toast-banner.success {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .stats-row {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .stat-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          font-weight: 700;
          text-transform: uppercase;
        }
        .stat-val {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--admin-text);
          margin: 0.25rem 0;
        }
        .stat-val.text-green {
          color: #10b981;
        }
        .stat-val.text-orange {
          color: var(--admin-accent);
        }
        .stat-sub {
          font-size: 0.7rem;
          color: var(--admin-text-dim);
        }

        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .controls-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        @media (max-width: 640px) {
          .controls-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .controls-actions {
            justify-content: flex-end;
          }
          .search-wrap {
            max-width: 100%;
          }
        }
        .search-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 0 0.85rem;
          flex: 1;
          max-width: 480px;
        }
        .search-icon {
          color: var(--admin-text-dim);
        }
        .search-wrap input {
          background: transparent;
          border: none;
          color: var(--admin-text);
          font-size: 0.85rem;
          padding: 0.65rem 0;
          outline: none;
          width: 100%;
        }

        .btn-refresh {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          padding: 0.65rem 0.95rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-refresh:hover:not(:disabled) {
          color: var(--admin-text);
          border-color: var(--admin-border-strong);
        }
        .btn-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--admin-accent);
          color: #ffffff;
          border: none;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-add:hover {
          background: var(--admin-accent-hover);
        }

        .table-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          overflow-x: auto;
        }
        .users-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.825rem;
        }
        .users-table th {
          text-align: left;
          padding: 13px 18px;
          color: var(--admin-text-dim);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--admin-border);
          white-space: nowrap;
        }
        .users-table td {
          padding: 13px 18px;
          border-bottom: 1px solid var(--admin-border-subtle);
          vertical-align: middle;
          color: var(--admin-text-secondary);
          white-space: nowrap;
        }
        .users-table tbody tr:hover td {
          background: var(--admin-surface-hover);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 7px;
          background: rgba(234, 88, 12, 0.15);
          color: #ea580c;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          border: 1px solid rgba(234, 88, 12, 0.25);
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-weight: 700;
          color: var(--admin-text);
          font-size: 0.85rem;
        }
        .user-uname {
          font-size: 0.72rem;
          color: var(--admin-text-dim);
          font-family: monospace;
          margin-top: 1px;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }
        .role-super_admin {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.35);
        }
        .role-noc_operator {
          background: rgba(59, 130, 246, 0.12);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.35);
        }
        .role-carrier_manager {
          background: rgba(168, 85, 247, 0.12);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.35);
        }
        .role-sales_rep {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .email-cell {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.8rem;
          color: var(--admin-text-secondary);
        }

        .mfa-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 9999px;
        }
        .mfa-pill.enabled {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .mfa-pill.disabled {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .last-login {
          font-size: 0.775rem;
          color: var(--admin-text-muted);
        }

        .status-pill-active {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          letter-spacing: 0.05em;
        }

        .btn-delete {
          background: transparent;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-dim);
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-delete:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.1);
        }
        .root-protected {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--admin-text-dim);
          opacity: 0.5;
          padding: 6px 8px;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-card {
          background: #0d1527;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          max-width: 490px;
          width: 100%;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.85rem;
        }
        .modal-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .modal-sub {
          font-size: 0.78rem;
          color: #94a3b8;
          margin: 4px 0 0 0;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        .btn-close:hover {
          color: #ffffff;
        }

        .modal-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #f87171;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #e2e8f0;
        }
        .form-group input,
        .form-group select {
          background: #090e1a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 9px 12px;
          color: #ffffff;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: #ff6a00;
          box-shadow: 0 0 0 1px #ff6a00;
        }
        .form-group input::placeholder {
          color: #64748b;
        }

        .checkboxes-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 0.5rem 0;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.78rem;
          color: #cbd5e1;
        }
        .checkbox-row input[type='checkbox'] {
          accent-color: #ff6a00;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
        .checkbox-row label {
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1rem;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #cbd5e1;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }
        .btn-submit {
          background: #ff6a00;
          color: #ffffff;
          border: none;
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #ff7a1a;
        }
        .btn-submit:disabled,
        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        :global(.spinning) {
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
    </>
  );
}
