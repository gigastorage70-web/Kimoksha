'use client';

import { useState } from 'react';

export default function CarrierNetworkMap() {
  const nodes = [
    {
      id: 'dubai',
      name: 'Dubai HQ',
      fullTitle: 'Dubai HQ Core (DX1)',
      desc: 'Status: Active Master Hub | Latency: 0.2ms | Routes: 500+ Direct MNOs',
      left: '58%',
      top: '48%',
      isPrimary: true,
    },
    {
      id: 'london',
      name: 'London',
      fullTitle: 'London PoP (LD4)',
      desc: 'Status: Operational | Latency: 18ms | Routes: Western Europe Tier-1',
      left: '44%',
      top: '28%',
    },
    {
      id: 'frankfurt',
      name: 'Frankfurt',
      fullTitle: 'Frankfurt PoP (FR2)',
      desc: 'Status: Operational | Latency: 16ms | Routes: Central Europe & Balkans',
      left: '48%',
      top: '30%',
    },
    {
      id: 'singapore',
      name: 'Singapore',
      fullTitle: 'Singapore PoP (SG1)',
      desc: 'Status: Operational | Latency: 24ms | Routes: APAC & ASEAN Direct',
      left: '78%',
      top: '60%',
    },
    {
      id: 'newyork',
      name: 'New York',
      fullTitle: 'New York PoP (NY4)',
      desc: 'Status: Operational | Latency: 22ms | Routes: North America 10DLC & SS7',
      left: '22%',
      top: '35%',
    },
    {
      id: 'johannesburg',
      name: 'Johannesburg',
      fullTitle: 'Johannesburg Hub',
      desc: 'Status: Operational | Latency: 32ms | Routes: Pan-Africa Wholesale SMS',
      left: '56%',
      top: '78%',
    },
    {
      id: 'saopaulo',
      name: 'Sao Paulo',
      fullTitle: 'Sao Paulo PoP',
      desc: 'Status: Operational | Latency: 28ms | Routes: LATAM Wholesale Gateway',
      left: '32%',
      top: '72%',
    },
  ];

  const [activeTooltip, setActiveTooltip] = useState({
    title: 'Dubai HQ Core (DX1)',
    desc: 'Status: Active Master Hub | Latency: 0.2ms | Routes: 500+ Direct MNOs',
  });

  return (
    <section id="network" className="network-map-section">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-pill">Carrier Reach</span>
          <h2 className="section-title">Global Carrier Network Backbone</h2>
          <p className="section-subtitle">
            Geographically distributed routing hubs ensuring sub-50ms packet transmission and 99.99% carrier SLA.
          </p>
        </div>

        <div className="map-container-card">
          <div className="map-header">
            <div>
              <h3 style={{ fontSize: '20px' }}>Interactive Point of Presence (PoP) Map</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Hover or click over any node to inspect live interconnect latency and route status.
              </p>
            </div>
            <div className="live-throughput-badge">
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--brand)',
                }}
              ></span>
              Live Core Throughput: 11,420 TPS
            </div>
          </div>

          <div className="map-svg-wrap" id="mapStage">
            {/* Background SVG World Map Graphic Simulation */}
            <svg width="100%" height="100%" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M150 120 Q 300 80 400 130 T 600 140 T 850 160" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M220 220 Q 400 240 600 220 T 800 280" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="580" y1="190" x2="480" y2="120" stroke="#F9C9A6" strokeWidth="1.5" />
              <line x1="580" y1="190" x2="440" y2="110" stroke="#F9C9A6" strokeWidth="1.5" />
              <line x1="580" y1="190" x2="780" y2="240" stroke="#F9C9A6" strokeWidth="1.5" />
              <line x1="580" y1="190" x2="220" y2="140" stroke="#F9C9A6" strokeWidth="1.5" />
              <line x1="580" y1="190" x2="560" y2="310" stroke="#F9C9A6" strokeWidth="1.5" />
            </svg>

            {/* Interactive Regional Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`map-node ${node.isPrimary ? 'hub-primary' : ''}`}
                style={{ left: node.left, top: node.top }}
                onMouseEnter={() => setActiveTooltip({ title: node.fullTitle, desc: node.desc })}
                onClick={() => setActiveTooltip({ title: node.fullTitle, desc: node.desc })}
                aria-label={node.fullTitle}
              >
                <span className="node-label">{node.name}</span>
              </div>
            ))}

            {/* Dynamic Tooltip */}
            <div className="map-tooltip" id="mapTooltip">
              <strong>{activeTooltip.title}</strong>
              <br />
              <span style={{ color: 'var(--brand)', fontSize: '12px' }}>{activeTooltip.desc}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
