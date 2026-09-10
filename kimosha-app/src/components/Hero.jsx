'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [metrics, setMetrics] = useState({
    connected_countries: '200+',
    direct_mno_binds: '500+',
    network_uptime_sla: '99.99%',
    daily_sms_volume: '150M+',
  });

  useEffect(() => {
    fetch('/api/public/content?section=hero_counters')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.hero_counters) {
          setMetrics((prev) => ({ ...prev, ...data.hero_counters }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="hero-centered">
      <svg
        className="hero-bg-network"
        viewBox="0 0 1000 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="500" cy="250" r="220" stroke="#F26522" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="500" cy="250" r="140" stroke="#E5E7EB" strokeWidth="1.5" />
        <circle cx="500" cy="250" r="320" stroke="#F9C9A6" strokeWidth="1" />
        <line x1="150" y1="250" x2="850" y2="250" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="500" y1="50" x2="500" y2="450" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>

      <div className="container hero-content-centered">
        <div className="hero-eyebrow">
          <div className="status-dot"></div>
          Global Routing Core: 100% Operational &bull; {metrics.direct_mno_binds} Interconnects Active
        </div>
        <h1>
          Global Carrier Hub for <span>Wholesale SMS & Voice</span>
        </h1>
        <p>
          Connecting Tier-1 telecom operators, international mobile networks, and enterprise aggregators across 200+ countries with dynamic least-cost routing and sub-second delivery SLAs.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn btn-primary" style={{ padding: '14px 34px', fontSize: '15px' }}>
            Establish Carrier Interconnect
          </Link>
          <Link
            href="/services"
            className="btn"
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              background: '#FFFFFF',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            Explore Services &rarr;
          </Link>
        </div>

        <div className="hero-metrics-pill">
          <div className="metric-item">
            <span className="metric-val">{metrics.connected_countries}</span>
            <span className="metric-desc">Countries Terminated</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">{metrics.direct_mno_binds}</span>
            <span className="metric-desc">MNO Direct Binds</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">{metrics.network_uptime_sla}</span>
            <span className="metric-desc">Core SLA Uptime</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">{metrics.daily_sms_volume}</span>
            <span className="metric-desc">Daily SMS Volume</span>
          </div>
        </div>
      </div>
    </section>
  );
}
