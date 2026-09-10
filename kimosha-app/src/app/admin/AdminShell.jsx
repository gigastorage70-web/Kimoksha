'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SessionWarningModal from '@/components/admin/SessionWarningModal';

export default function AdminShell({ operator, children }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Don't render sidebar or shell on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell-container">
      <AdminSidebar
        operator={operator}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="admin-main-viewport">
        {children}
      </div>

      <SessionWarningModal />
    </div>
  );
}
