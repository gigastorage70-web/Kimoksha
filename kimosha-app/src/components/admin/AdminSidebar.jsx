'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  ClipboardList,
  UserCheck,
  FolderOpen,
  BarChart3,
  Cpu,
  ShieldCheck,
  Settings,
  Globe,
  LogOut,
  Radio,
  X,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

const OPERATIONS_NAV = [
  {
    label: 'Overview & Live NOC',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    badge: 'Live',
  },
  {
    label: 'Inbound Leads CRM',
    href: '/admin/leads',
    icon: Users,
    badge: null,
  },
  {
    label: 'Wholesale Rate Decks',
    href: '/admin/rate-decks',
    icon: FileSpreadsheet,
    badge: null,
  },
  {
    label: 'Forms & Submissions',
    href: '/admin/forms',
    icon: ClipboardList,
    badge: null,
  },
];

const PLATFORM_NAV = [
  {
    label: 'Operator Users',
    href: '/admin/users',
    icon: UserCheck,
    badge: null,
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    icon: FolderOpen,
    badge: null,
  },
  {
    label: 'Telemetry Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    badge: null,
  },
];

const SYSTEM_NAV = [
  {
    label: 'Integrations',
    href: '/admin/integrations',
    icon: Cpu,
    badge: null,
  },
  {
    label: 'Settings & Theme',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
  },
  {
    label: 'Security & Audit Logs',
    href: '/admin/security',
    icon: ShieldCheck,
    badge: null,
  },
];

export default function AdminSidebar({ operator }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileOpen, setIsMobileOpen } = useAdminTheme();

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      router.push('/admin/login');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <Link href="/admin/dashboard" className="sidebar-brand" onClick={() => setIsMobileOpen(false)}>
              <Image
                src="/kimoksha-logo-clean.png"
                alt="Kimoksha Telecom"
                width={140}
                height={32}
                style={{ objectFit: 'contain', width: 'auto', height: '28px' }}
                priority
              />
            </Link>
            <button
              type="button"
              className="btn-close-sidebar"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close Navigation"
            >
              <X size={18} />
            </button>
          </div>
          <div className="telecom-console-tag">
            <Radio size={10} className="tag-ping" />
            <span>NOC CONSOLE</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">CORE OPERATIONS</div>
          {OPERATIONS_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={17} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '1rem' }}>
            PLATFORM & ASSETS
          </div>
          {PLATFORM_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={17} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '1rem' }}>
            SYSTEM CONFIG
          </div>
          {SYSTEM_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={17} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '1rem' }}>
            EXTERNAL & SYSTEM
          </div>
          <Link href="/" target="_blank" className="nav-item">
            <Globe size={17} className="nav-icon" />
            <span className="nav-label">View Live Website</span>
          </Link>
        </nav>

        {/* Operator Profile Footer */}
        <div className="sidebar-footer">
          <div className="operator-card">
            <div className="operator-avatar">
              {operator?.username ? operator.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="operator-info">
              <div className="operator-name">{operator?.username || 'Operator'}</div>
              <div className="operator-role">{operator?.role || 'Super Admin'}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="btn-logout" title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
