'use client';

import { Menu, Activity, Shield } from 'lucide-react';

export default function AdminHeader({ title, subtitle, setIsMobileOpen }) {
  return (
    <header className="admin-header">
      <div className="header-left">
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(true)}
            className="btn-mobile-toggle"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <div className="status-pill status-healthy">
          <Activity size={12} className="pulse-icon" />
          <span>NETWORK CORE ACTIVE</span>
        </div>
        <div className="status-pill status-security">
          <Shield size={12} />
          <span>RBAC ENFORCED</span>
        </div>
      </div>
    </header>
  );
}
