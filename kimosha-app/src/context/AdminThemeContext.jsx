'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext({
  theme: 'dark',
  setTheme: () => {},
  isSaving: false,
  isMobileOpen: false,
  setIsMobileOpen: () => {},
  toggleMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export function AdminThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileOpen(false);

  // Initialize theme from localStorage or backend settings on mount
  useEffect(() => {
    // 1. Read localStorage for instant zero-flicker render
    const local = localStorage.getItem('kimoksha_admin_theme');
    if (local && ['light', 'dark'].includes(local)) {
      setThemeState(local);
      document.documentElement.setAttribute('data-admin-theme', local);
    } else {
      setThemeState('dark');
      document.documentElement.setAttribute('data-admin-theme', 'dark');
    }

    // 2. Fetch official setting from backend
    const fetchBackendTheme = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings?.admin_theme) {
            const serverTheme = data.settings.admin_theme;
            if (['light', 'dark'].includes(serverTheme)) {
              setThemeState(serverTheme);
              localStorage.setItem('kimoksha_admin_theme', serverTheme);
              document.documentElement.setAttribute('data-admin-theme', serverTheme);
            }
          }
        }
      } catch (err) {
        // Fallback to local
      }
    };

    fetchBackendTheme();
  }, []);

  const setTheme = async (newTheme) => {
    if (!['light', 'dark'].includes(newTheme)) return;

    // Immediate UI update
    setThemeState(newTheme);
    localStorage.setItem('kimoksha_admin_theme', newTheme);
    document.documentElement.setAttribute('data-admin-theme', newTheme);

    // Persist to backend site_settings
    setIsSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { admin_theme: newTheme } }),
      });
    } catch (e) {
      console.error('Failed to persist theme to backend:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminThemeContext.Provider
      value={{
        theme,
        setTheme,
        isSaving,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      <div data-admin-theme={theme} className="admin-theme-wrapper">
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}
