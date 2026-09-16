'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SessionWarningModal from '@/components/admin/SessionWarningModal';
import { AdminThemeProvider } from '@/context/AdminThemeContext';

export default function AdminShell({ operator, children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Redirect unauthenticated visitors to login page immediately
  useEffect(() => {
    if (!operator && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [operator, pathname, router]);

  // Don't render sidebar or shell on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show clean redirecting screen if unauthenticated
  if (!operator) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070c16',
          color: '#94a3b8',
          fontSize: '0.875rem',
          fontFamily: 'sans-serif',
        }}
      >
        Authenticating Console Operator...
      </div>
    );
  }

  return (
    <AdminThemeProvider>
      <div className="admin-shell-container">
        <AdminSidebar operator={operator} />

        <div className="admin-main-viewport">
          {children}
        </div>

        <SessionWarningModal />
      </div>
    </AdminThemeProvider>
  );
}

