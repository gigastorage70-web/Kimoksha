'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Settings,
  Globe,
  LogOut,
  Radio,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard & Telemetry',
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
    label: 'Dynamic Site CMS',
    href: '/admin/cms',
    icon: Layers,
    badge: null,
  },
  {
    label: 'Security & Audit Logs',
    href: '/admin/security',
    icon: ShieldCheck,
    badge: null,
  },
  {
    label: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
  },
];

export default function AdminSidebar({ operator, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();

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
          <Link href="/admin/dashboard" className="sidebar-brand">
            <Image
              src="/kimoksha-logo-clean.png"
              alt="Kimoksha Telecom"
              width={140}
              height={32}
              style={{ objectFit: 'contain', width: 'auto', height: '28px' }}
              priority
            />
          </Link>
          <div className="telecom-console-tag">
            <Radio size={10} className="tag-ping" />
            <span>NOC CONSOLE</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">CORE OPERATIONS</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '1.25rem' }}>
            EXTERNAL & SYSTEM
          </div>
          <Link href="/" target="_blank" className="nav-item">
            <Globe size={18} className="nav-icon" />
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
