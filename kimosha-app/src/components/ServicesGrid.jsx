import Link from 'next/link';

export default function ServicesGrid() {
  const services = [
    {
      tag: '01 / A2P TERMINATION',
      title: 'Wholesale SMS Termination',
      description: 'Direct 1-hop routes with dynamic least-cost routing, CLI preservation, and true handset SS7 acknowledgments.',
      pills: ['Direct SS7', 'LCR Engine', 'Handset DLR'],
    },
    {
      tag: '02 / SIP TRUNKING',
      title: 'Voice Termination (VoIP/TDM)',
      description: 'Wholesale voice minutes with guaranteed CLI transparency, sub-50ms jitter, and low Post-Dial Delay via global SBCs.',
      pills: ['SIP RFC 3261', 'G.711 / G.729', 'True CLI'],
    },
    {
      tag: '03 / VERIFICATION',
      title: 'A2P Enterprise Messaging',
      description: 'Dedicated priority lanes for OTPs, two-factor authentication, and transaction alerts with zero queue delay.',
      pills: ['OTP Priority', '99.9% Delivery', '< 1.2s Latency'],
    },
    {
      tag: '04 / PROTOCOL',
      title: 'SMPP 3.4 & API Platform',
      description: 'High-throughput binary SMPP transceiver binds and RESTful JSON APIs for seamless switch and gateway integration.',
      pills: ['SMPP v3.4', 'REST JSON', 'TLS 1.3'],
    },
    {
      tag: '05 / AGGREGATION',
      title: 'SMS Hubbing & Interconnect',
      description: 'Single commercial agreement giving instant access to 800+ mobile networks with real-time billing and anti-fraud filters.',
      pills: ['Hub-to-Hub', 'Anti-Spam Filter', 'Multi-Currency'],
    },
    {
      tag: '06 / BROADCAST',
      title: 'Voice Broadcasting & IVR',
      description: 'Automated outbound voice campaigns with interactive DTMF key capture, Text-to-Speech in 40+ languages, and AMD detection.',
      pills: ['10k+ Channels', 'DTMF Capture', 'Multilingual TTS'],
    },
  ];

  return (
    <section id="services">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-pill">Carrier Service Portfolio</span>
          <h2 className="section-title">Wholesale Telecommunication Solutions</h2>
          <p className="section-subtitle">
            Carrier-to-carrier interconnect solutions optimized for high-volume message delivery and premium voice call routing.
          </p>
        </div>

        <div className="services-grid-3x2">
          {services.map((item, index) => (
            <div key={index} className="service-card-hub">
              <div>
                <div className="card-top-tag">{item.tag}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="card-pills-row">
                {item.pills.map((pill, pIndex) => (
                  <span key={pIndex} className="card-pill-item">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            href="/services"
            className="btn"
            style={{
              padding: '12px 28px',
              fontSize: '14.5px',
              background: '#FFFFFF',
              color: 'var(--brand-dark)',
              border: '1px solid var(--brand-border)',
              fontWeight: 700,
            }}
          >
            Explore Detailed Service Specifications &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
