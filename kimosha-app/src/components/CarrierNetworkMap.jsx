'use client';

import { useState, useEffect } from 'react';

const NODES = [
  {
    id: 'london',
    city: 'London & UK HQ',
    tag: 'Global Master Hub & HQ',
    meta: 'Executive UK Headquarters & Primary Global Signaling Core',
    specs: 'Status: Active Master Core | Latency: 0.2ms | Peering: 500+ MNOs',
    protocols: 'SS7 / SIGTRAN / SMPP v3.4 / SIP RFC 3261 / REST CPaaS',
    x: 333.0,
    y: 83.3,
    isPrimary: true,
  },
  {
    id: 'frankfurt',
    city: 'Frankfurt (FR2)',
    tag: 'Central European Core',
    meta: 'Direct Peering with DE-CIX & Continental Voice Exchangers',
    specs: 'Status: Operational | Latency: 16ms | Capacity: 10 Gbps BGP',
    protocols: 'SS7 SIGTRAN / SMPP v3.4 / Opus / G.711',
    x: 352.0,
    y: 90.0,
  },
  {
    id: 'dubai',
    city: 'Dubai (DX1 Core)',
    tag: 'Middle East Regional Gateway',
    meta: 'Equinix DX1 Core & Bilateral Middle East Carrier Gateway',
    specs: 'Status: Operational | Latency: 18ms | Capacity: 10 Gbps BGP',
    protocols: 'SS7 / SIGTRAN / SMPP v3.4 / SIP RFC 3261',
    x: 444.0,
    y: 147.4,
  },
  {
    id: 'singapore',
    city: 'Singapore (SG1)',
    tag: 'Asia-Pacific Core',
    meta: 'High-Density APAC Hub for ASEAN Mobile Operators',
    specs: 'Status: Operational | Latency: 24ms | Capacity: 10 Gbps BGP',
    protocols: 'SMPP v3.4 / REST CPaaS / Priority OTP Queue',
    x: 540.2,
    y: 198.7,
  },
  {
    id: 'newyork',
    city: 'New York (NY4)',
    tag: 'North America Gateway',
    meta: 'Direct Peering for 10DLC, Toll-Free & Shortcode Hubbing',
    specs: 'Status: Operational | Latency: 22ms | Transatlantic Backbone',
    protocols: 'SMPP v3.4 / 10DLC Registry / SIP Trunking',
    x: 188.7,
    y: 115.4,
  },
  {
    id: 'johannesburg',
    city: 'Johannesburg',
    tag: 'Pan-Africa Core',
    meta: 'High-Capacity Southern Africa Cross-Border SMS Gateway',
    specs: 'Status: Operational | Latency: 32ms | Direct MNO Interconnect',
    protocols: 'SS7 / SMPP v3.4 / Wholesale Voice',
    x: 388.5,
    y: 256.3,
  },
  {
    id: 'saopaulo',
    city: 'Sao Paulo',
    tag: 'LATAM Regional Hub',
    meta: 'High-Security Banking & Enterprise A2P OTP Interchange',
    specs: 'Status: Operational | Latency: 28ms | Multi-Carrier Mesh',
    protocols: 'SMPP v3.4 / RESTful Webhooks',
    x: 244.2,
    y: 249.9,
  },
  {
    id: 'tokyo',
    city: 'Tokyo / Manila',
    tag: 'East Asia Gateway',
    meta: 'Subsea Cable Peering for High-Volume Messaging Delivery',
    specs: 'Status: Operational | Latency: 26ms | Low PDD Routing',
    protocols: 'SMPP v3.4 / SIP RFC 3261',
    x: 569.8,
    y: 173.0,
  },
];

const ROUTES = [
  { id: 'arc-frankfurt', target: 'frankfurt', d: 'M333.0,83.3 Q342.0,86.0 352.0,90.0', dur: '3.6s' },
  { id: 'arc-dubai', target: 'dubai', d: 'M333.0,83.3 Q388.5,87.2 444.0,147.4', dur: '5.2s' },
  { id: 'arc-newyork', target: 'newyork', d: 'M333.0,83.3 Q260.0,60.0 188.7,115.4', dur: '5.8s' },
  { id: 'arc-singapore', target: 'singapore', d: 'M333.0,83.3 Q436.6,141.0 540.2,198.7', dur: '6.4s' },
  { id: 'arc-johannesburg', target: 'johannesburg', d: 'M333.0,83.3 Q360.0,169.8 388.5,256.3', dur: '5.6s' },
  { id: 'arc-saopaulo', target: 'saopaulo', d: 'M333.0,83.3 Q288.6,166.6 244.2,249.9', dur: '6.6s' },
  { id: 'arc-tokyo', target: 'tokyo', d: 'M333.0,83.3 Q451.4,128.0 569.8,173.0', dur: '6.2s' },
  { id: 'arc-dubai-singapore', target: 'singapore', d: 'M444.0,147.4 Q492.1,149.1 540.2,198.7', dur: '5.0s' },
  { id: 'arc-frankfurt-dubai', target: 'dubai', d: 'M352.0,90.0 Q402.0,98.0 444.0,147.4', dur: '4.8s' },
];

export default function CarrierNetworkMap() {
  const [activeNode, setActiveNode] = useState(NODES[0]);
  const [liveTps, setLiveTps] = useState(12556);

  // Live fluctuating throughput telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTps((prev) => {
        const delta = Math.round((Math.random() - 0.48) * 180);
        return Math.max(11850, Math.min(14200, prev + delta));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="network" className="network-map-section" aria-label="Global Carrier Routing Matrix">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-pill">Global Backbone</span>
          <h2 className="section-title">Global Carrier Peering Matrix</h2>
          <p className="section-subtitle">
            Direct, geographically distributed Points of Presence (PoPs) connected via low-latency subsea routes and BGP Anycast routing.
          </p>
        </div>

        <div className="carrier-map-card">
          <div className="carrier-map-header">
            <div>
              <div className="carrier-map-headline">
                <span className="carrier-pulse-indicator"></span>
                <span>Interactive Carrier Network Topography</span>
              </div>
              <p className="carrier-map-sub">
                Hover or select any exchange node to inspect live interconnect status, latency metrics, and protocols.
              </p>
            </div>
            <div className="carrier-live-chip">
              <span className="chip-dot"></span>
              <span className="chip-value">{liveTps.toLocaleString('en-US')}</span>
              <span className="chip-label">TPS Core Throughput</span>
            </div>
          </div>

          <div className="carrier-map-stage">
            {/* SVG Interactive Canvas */}
            <svg
              viewBox="0 0 662 327"
              preserveAspectRatio="xMidYMid meet"
              className="carrier-map-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="carrierRouteGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F26522" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FA8C4C" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#E05A1A" stopOpacity="0.8" />
                </linearGradient>

                <radialGradient id="carrierNodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F26522" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#F26522" stopOpacity="0" />
                </radialGradient>

                <filter id="carrierPacketGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#F26522" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* Background World Dot Matrix Map */}
              <image
                href="/world-carrier-grid.svg"
                x="0"
                y="0"
                width="662"
                height="327"
                opacity="0.88"
                style={{ pointerEvents: 'none' }}
              />

              {/* Curved Carrier Routes */}
              <g className="carrier-routes-group">
                {ROUTES.map((route) => {
                  const isHighlighted = activeNode && (activeNode.id === route.target || activeNode.id === 'london');
                  const isDimmed = activeNode && !isHighlighted && activeNode.id !== 'london';
                  return (
                    <path
                      key={route.id}
                      id={route.id}
                      className={`carrier-route-line ${isHighlighted ? 'active' : ''} ${isDimmed ? 'dim' : ''}`}
                      d={route.d}
                    />
                  );
                })}
              </g>

              {/* Animated Glowing Packet Pulses */}
              <g className="carrier-packets-group">
                {ROUTES.map((route) => (
                  <circle
                    key={`packet-${route.id}`}
                    r="2.2"
                    className="carrier-packet-dot"
                    filter="url(#carrierPacketGlow)"
                  >
                    <animateMotion dur={route.dur} repeatCount="indefinite">
                      <mpath href={`#${route.id}`} />
                    </animateMotion>
                  </circle>
                ))}
              </g>

              {/* Interactive Point of Presence Nodes */}
              <g className="carrier-nodes-group">
                {NODES.map((node) => {
                  const isActive = activeNode?.id === node.id;
                  const isDimmed = activeNode && activeNode.id !== node.id && !isActive;

                  return (
                    <g
                      key={node.id}
                      className={`carrier-node-item ${node.isPrimary ? 'is-hub' : ''} ${isActive ? 'is-active' : ''} ${isDimmed ? 'is-dim' : ''}`}
                      onClick={() => setActiveNode(node)}
                      onMouseEnter={() => setActiveNode(node)}
                      tabIndex={0}
                      aria-label={`${node.city} - ${node.tag}`}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    >
                      {/* Radar Rings for UK Master HQ */}
                      {node.isPrimary && (
                        <>
                          <circle className="carrier-radar-ring r1" cx={node.x} cy={node.y} r="8" />
                          <circle className="carrier-radar-ring r2" cx={node.x} cy={node.y} r="8" />
                          <circle className="carrier-radar-ring r3" cx={node.x} cy={node.y} r="8" />
                        </>
                      )}

                      {/* Halo Glow */}
                      <circle
                        className="carrier-node-halo"
                        cx={node.x}
                        cy={node.y}
                        r={node.isPrimary ? 13 : 9}
                      />

                      {/* Solid Center Dot */}
                      <circle
                        className="carrier-node-dot"
                        cx={node.x}
                        cy={node.y}
                        r={node.isPrimary ? 6 : 4}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Floating Live Telemetry Cards */}
            <div className="carrier-stat-badge stat-countries">
              <span className="stat-value">190+</span>
              <span className="stat-caption">Countries Connected</span>
            </div>

            <div className="carrier-stat-badge stat-uptime">
              <span className="stat-value text-orange">99.99%</span>
              <span className="stat-caption">Carrier SLA Uptime</span>
            </div>

            {/* Responsive Active Node Telemetry HUD Panel */}
            {activeNode && (
              <div className="carrier-node-hud" role="region" aria-live="polite">
                <div className="hud-header">
                  <div className="hud-city-group">
                    <span className="hud-pulse-mini"></span>
                    <strong className="hud-city-name">{activeNode.city}</strong>
                  </div>
                  <span className="hud-tag-pill">{activeNode.tag}</span>
                </div>
                <div className="hud-meta">{activeNode.meta}</div>
                <div className="hud-specs-bar">
                  <span className="hud-spec-item">{activeNode.specs}</span>
                  <span className="hud-spec-divider">&bull;</span>
                  <span className="hud-spec-protocol">{activeNode.protocols}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
