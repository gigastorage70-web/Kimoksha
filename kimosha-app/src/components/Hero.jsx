export default function Hero() {
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
          Global Routing Core: 100% Operational &bull; 500+ Interconnects Active
        </div>
        <h1>
          Global Carrier Hub for <span>Wholesale SMS & Voice</span>
        </h1>
        <p>
          Connecting Tier-1 telecom operators, international mobile networks, and enterprise aggregators across 200+ countries with dynamic least-cost routing and sub-second delivery SLAs.
        </p>
        <div>
          <a href="#contact" className="btn btn-primary" style={{ padding: '14px 34px', fontSize: '15px' }}>
            Establish Carrier Interconnect
          </a>
        </div>

        <div className="hero-metrics-pill">
          <div className="metric-item">
            <span className="metric-val">200+</span>
            <span className="metric-desc">Countries Terminated</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">500+</span>
            <span className="metric-desc">MNO Direct Binds</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">99.99%</span>
            <span className="metric-desc">Core SLA Uptime</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">&lt; 1.2s</span>
            <span className="metric-desc">Handset DLR Latency</span>
          </div>
        </div>
      </div>
    </section>
  );
}
