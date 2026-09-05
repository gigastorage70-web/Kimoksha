'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <Link href="/" className="brand-logo" onClick={() => setMobileOpen(false)} aria-label="Kimoksha Telco Home">
          <Image
            src="/kimoksha-logo-clean.png"
            alt="Kimoksha Telco"
            width={150}
            height={45}
            style={{ height: '38px', width: 'auto', display: 'block', objectFit: 'contain' }}
            priority
          />
          <span className="tag">GLOBAL HUB</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link-item ${isActive ? 'active-nav' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="nav-actions-desktop">
          <Link href="/contact" className="btn btn-primary">
            Connect NOC
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className={`bar ${mobileOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <ul className="mobile-nav-links">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
            <li style={{ marginTop: '16px' }}>
              <Link
                href="/contact"
                className="btn btn-primary"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={() => setMobileOpen(false)}
              >
                Connect NOC
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
