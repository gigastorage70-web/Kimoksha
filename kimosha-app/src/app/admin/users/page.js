'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  UserCheck,
  Shield,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  Key,
  X,
  Mail,
  Smartphone,
  Trash2,
} from 'lucide-react';

const INITIAL_USERS = [
  {
    id: 'usr-001',
    name: 'Carrier Operations Lead',
    username: 'admin',
    email: 'noc@kimokshatelco.com',
    role: 'SUPER_ADMIN',
    mfa_enabled: true,
    last_login: 'Just now',
    status: 'ACTIVE',
  },
  {
    id: 'usr-002',
    name: 'NOC Routing Engineer',
    username: 'noc_engineer_1',
    email: 'routing@kimokshatelco.com',
    role: 'NOC_OPERATOR',
    mfa_enabled: true,
    last_login: '2 hours ago',
    status: 'ACTIVE',
  },
  {
    id: 'usr-003',
    name: 'Wholesale Billing Lead',
    username: 'billing_ops',
    email: 'rates@kimokshatelco.com',
    role: 'CARRIER_MANAGER',
    mfa_enabled: false,
    last_login: 'Yesterday',
    status: 'ACTIVE',
  },
  {
    id: 'usr-004',
    name: 'Enterprise Sales Dispatch',
    username: 'sales_dispatch',
    email: 'sales@kimokshatelco.com',
    role: 'SALES_REP',
    mfa_enabled: true,
    last_login: '3 days ago',
    status: 'ACTIVE',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    role: 'NOC_OPERATOR',
    mfa_enabled: true,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email) return;

    const created = {
      id: `usr-00${users.length + 1}`,
      name: newUser.name || newUser.username,
      username: newUser.username.toLowerCase(),
      email: newUser.email,
      role: newUser.role,
      mfa_enabled: newUser.mfa_enabled,
      last_login: 'Never',
      status: 'ACTIVE',
    };

    setUsers([created, ...users]);
    setShowAddModal(false);
    setNewUser({
      name: '',
      username: '',
      email: '',
      role: 'NOC_OPERATOR',
      mfa_enabled: true,
    });
  };

  const handleDeleteUser = (id) => {
    if (id === 'usr-001') return; // Protect primary super admin
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <>
      <AdminHeader
        title="User & Operator Access Management"
        subtitle="Manage NOC operators, commercial carrier managers, role-based access control, and MFA policies."
      />

      <div className="users-page">
        {/* KPI Strip */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Console Operators</span>
            <div className="stat-val">{users.length}</div>
            <span className="stat-sub">Provisioned RBAC accounts</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Active Sessions</span>
            <div className="stat-val text-green">1 Online</div>
            <span className="stat-sub">Authenticated via Next.js Auth</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">MFA Security Policy</span>
            <div className="stat-val text-orange">75% Enforced</div>
            <span className="stat-sub">Hardware / Authenticator TOTP</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Role Distribution</span>
            <div className="stat-val">3 Roles</div>
            <span className="stat-sub">Super Admin, NOC, Sales</span>
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

          <button onClick={() => setShowAddModal(true)} className="btn-add">
            <Plus size={16} />
            <span>Add Operator</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Role & Permissions</th>
                <th>Corporate Email</th>
                <th>MFA Status</th>
                <th>Last Active</th>
                <th>Account Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    No operators found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-profile">
                        <div className="user-avatar">{u.username.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="user-name">{u.name}</div>
                          <div className="user-uname">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${u.role.toLowerCase()}`}>
                        <Shield size={11} />
                        <span>{u.role.replace(/_/g, ' ')}</span>
                      </span>
                    </td>
                    <td>
                      <div className="email-cell">
                        <Mail size={12} />
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
                      <span className="last-login">{u.last_login}</span>
                    </td>
                    <td>
                      <span className="status-pill-active">{u.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.id !== 'usr-001' && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="btn-delete"
                          title="Revoke Operator Access"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Provision New Console Operator</h3>
                <p className="modal-sub">Create credentials with role-based access rights.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label>Full Operator Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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
                  />
                </div>

                <div className="form-group">
                  <label>Role / Clearance *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="SUPER_ADMIN">Super Admin (Full Root Access)</option>
                    <option value="NOC_OPERATOR">NOC Operator (Telemetry & Rates)</option>
                    <option value="CARRIER_MANAGER">Carrier Manager (Wholesale CRM)</option>
                    <option value="SALES_REP">Sales Representative (Leads Only)</option>
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
                />
              </div>

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="mfa-toggle"
                  checked={newUser.mfa_enabled}
                  onChange={(e) => setNewUser({ ...newUser, mfa_enabled: e.target.checked })}
                />
                <label htmlFor="mfa-toggle">Require Multi-Factor Authentication (TOTP / SMS)</label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Operator
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
        @media (max-width: 640px) {
          .controls-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .search-wrap {
            max-width: 100%;
          }
          .btn-add {
            justify-content: center;
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
          padding: 12px 16px;
          color: var(--admin-text-dim);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--admin-border);
        }
        .users-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--admin-border-subtle);
          vertical-align: middle;
          color: var(--admin-text-secondary);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--admin-accent-subtle);
          color: var(--admin-accent);
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }
        .user-name {
          font-weight: 700;
          color: var(--admin-text);
        }
        .user-uname {
          font-size: 0.7rem;
          color: var(--admin-text-dim);
          font-family: monospace;
        }
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .role-super_admin {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }
        .role-noc_operator {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }
        .role-carrier_manager {
          background: rgba(168, 85, 247, 0.15);
          color: #a855f7;
        }
        .role-sales_rep {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .email-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.775rem;
          color: var(--admin-text-secondary);
        }
        .mfa-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .mfa-pill.enabled {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }
        .mfa-pill.disabled {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
        }
        .last-login {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
        }
        .status-pill-active {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .btn-delete {
          background: transparent;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-dim);
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-delete:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.1);
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
          max-width: 480px;
          width: 100%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
        .form-group select {
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--admin-text);
          font-size: 0.85rem;
          outline: none;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--admin-accent);
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--admin-text-secondary);
        }
        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
          border-top: 1px solid var(--admin-border);
          padding-top: 0.75rem;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .btn-submit {
          background: var(--admin-accent);
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-submit:hover {
          background: var(--admin-accent-hover);
        }
      `}</style>
    </>
  );
}
