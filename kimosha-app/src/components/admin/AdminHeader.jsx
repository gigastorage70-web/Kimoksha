'use client';

import { Menu, Activity, Shield, Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export default function AdminHeader({ title, subtitle, setIsMobileOpen: propSetIsMobileOpen }) {
  const { theme, setTheme, toggleMobileMenu } = useAdminTheme();
  const handleOpenMobile = propSetIsMobileOpen ? () => propSetIsMobileOpen(true) : toggleMobileMenu;

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          type="button"
          onClick={handleOpenMobile}
          className="btn-mobile-toggle"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {/* 2-way Theme Selector (Light / Dark) */}
        <div className="theme-toggle-pill" role="group" aria-label="Theme selector">
          <button
            type="button"
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Switch to Light Theme"
          >
            <Sun size={13} />
            <span className="theme-name">Light</span>
          </button>
          <button
            type="button"
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Switch to Dark Theme"
          >
            <Moon size={13} />
            <span className="theme-name">Dark</span>
          </button>
        </div>

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

