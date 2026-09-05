export default function TechnicalSpecs() {
  const specs = [
    {
      title: 'Route Optimization',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      items: [
        'Dynamic Least Cost Routing (LCR)',
        'Automatic Quality Fallback Paths',
        'Real-Time Handset DLR Feedback',
      ],
    },
    {
      title: 'Protocol & Ingestion',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      ),
      items: [
        'SMPP v3.4 (TX, RX, TRX Binds)',
        'SIP 2.0 (RFC 3261) Trunking',
        'REST JSON API & Webhooks',
      ],
    },
    {
      title: 'Carrier Security & NOC',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      items: [
        '24/7/365 Tier-3 NOC Desk',
        'Anti-Spam & FAS Fraud Detection',
        'ISO 27001 & GDPR Certified',
      ],
    },
  ];

  return (
    <section id="specs">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-pill">Technical Excellence</span>
          <h2 className="section-title">Built to Telecom Carrier Standards</h2>
          <p className="section-subtitle">
            Full compliance with ITU-T, GSMA, and 3GPP telecommunication standards.
          </p>
        </div>

        <div className="specs-grid-3">
          {specs.map((spec, index) => (
            <div key={index} className="spec-card">
              <div className="spec-icon">{spec.icon}</div>
              <h3>{spec.title}</h3>
              <ul className="spec-list">
                {spec.items.map((item, iIndex) => (
                  <li key={iIndex}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
