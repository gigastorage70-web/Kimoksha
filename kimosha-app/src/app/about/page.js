import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'About Our Global Carrier Network & Infrastructure | Kimoksha Telecom',
  description:
    'Learn about Kimoksha Telecom, our Northampton, United Kingdom headquarters, global Equinix data center points of presence (LD4, FR2, DX1, SG1), and 24/7 proactive carrier Network Operations Center.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Our Global Carrier Network & Infrastructure | Kimoksha Telecom',
    description:
      'Learn about Kimoksha Telecom, our UK headquarters, global Equinix PoPs, and carrier-grade NOC operations.',
    url: 'https://www.kimokshatelco.com/about',
    images: ['/kimoksha-logo-clean.png'],
  },
};

export default function AboutPage() {
  const popLocations = [
    {
      code: 'EQUINIX LD4',
      city: 'London, United Kingdom',
      role: 'Master Signaling Hub & Executive UK Core',
      latency: '0.2ms Core Cross-Connect',
      details: 'Houses our primary global signaling engine and high-capacity bilateral carrier interconnect switches, operating from the Slough carrier campus in London.',
    },
    {
      code: 'EQUINIX FR2',
      city: 'Frankfurt, Germany',
      role: 'European Exchange Core',
      latency: '14ms Pan-European Transit',
      details: 'Directly peered with major European mobile operators, DE-CIX exchange points, and Tier-1 voice carriers.',
    },
    {
      code: 'EQUINIX DX1',
      city: 'Dubai, UAE',
      role: 'Middle East Regional Gateway',
      latency: '18ms Regional Cross-Connect',
      details: 'Strategic regional exchange switch managing bilateral Middle East operator routing and voice transit.',
    },
    {
      code: 'EQUINIX SG1',
      city: 'Singapore',
      role: 'Asia-Pacific Regional Core',
      latency: '24ms ASEAN Backbone',
      details: 'Strategic regional hub routing traffic across Southeast Asia, Australia, and East Asian telecommunication partners.',
    },
  ];

  const standards = [
    {
      title: 'ISO/IEC 27001:2022',
      desc: 'Independently audited information security controls protecting carrier routes and message confidentiality.',
    },
    {
      title: 'GSMA Guidelines',
      desc: 'Strict adherence to GSMA interoperability, SMS fraud prevention, and spam filtering recommendations.',
    },
    {
      title: 'ITU-T Recommendations',
      desc: 'Compliance with ITU-T voice quality benchmarks including P.800 MOS scoring and E.164 number formatting.',
    },
    {
      title: 'GDPR & Regional Privacy',
      desc: 'End-to-end data encryption and strict adherence to European and international subscriber privacy laws.',
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content">

      {/* Page Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </nav>
          <h1 className="page-title">
            Built on <span>Direct Telecom Infrastructure</span>
          </h1>
          <p className="page-description">
            Headquartered in Northampton, United Kingdom, Kimoksha Telecom provides wholesale carrier routing, direct operator interconnects, and mission-critical voice transmission worldwide.
          </p>
        </div>
      </section>

      {/* Narrative & Company Overview */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div className="about-narrative-box">
            <span className="service-badge-pill">COMPANY PEDIGREE</span>
            <h3>Our Transmission Philosophy</h3>
            <p>
              Telecommunication connectivity should be reliable, transparent, and direct. In an industry often clouded by multi-hop aggregators, grey routes, and uncertain delivery receipts, Kimoksha Telecom was founded on a simple premise: establish direct bilateral interconnects with licensed mobile network operators and provide carrier partners with verified, sub-second transmission.
            </p>
            <p>
              From our operational headquarters in the United Kingdom, we oversee a global signaling core that processes more than 3.5 billion messages and millions of voice minutes every month. We serve international carriers, telecommunication aggregators, financial institutions, and global enterprise platforms that cannot afford dropped packets, artificial delivery reports, or degraded call quality.
            </p>
            <p>
              Our infrastructure is active-active, fully geo-redundant, and deployed in Tier-3 Equinix data center facilities across four continents. When your traffic enters our network, our least-cost routing engine evaluates latency and operator health scores in real time, routing each message and voice call through the cleanest available path.
            </p>
          </div>

          {/* Operational Numbers */}
          <div className="about-stats-grid">
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--brand)' }}>
                200+
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '4px' }}>
                Connected Countries
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--brand)' }}>
                500+
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '4px' }}>
                Direct MNO Binds
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--brand)' }}>
                3.5B+
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '4px' }}>
                Monthly Messages
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--brand)' }}>
                99.99%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '4px' }}>
                Contractual SLA
              </div>
            </div>
          </div>

          {/* Points of Presence Breakdown */}
          <div style={{ marginBottom: '60px' }}>
            <div className="section-header-centered">
              <span className="section-pill">Global Presence</span>
              <h2 className="section-title">Carrier Data Center Backbone</h2>
              <p className="section-subtitle">
                Direct physical cross-connects and dedicated Session Border Controllers located in four premier carrier facilities worldwide.
              </p>
            </div>

            <div className="pop-grid-4">
              {popLocations.map((pop, pIndex) => (
                <div key={pIndex} className="pop-card">
                  <div className="pop-card-top">
                    <span className="pop-code">{pop.code}</span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#10B981',
                      }}
                    ></span>
                  </div>
                  <h4>{pop.city}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--brand-dark)', fontWeight: 600, marginBottom: '8px' }}>
                    {pop.role}
                  </div>
                  <p>{pop.details}</p>
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-soft)',
                    }}
                  >
                    {pop.latency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NOC & Engineering Team */}
          <div className="about-narrative-box">
            <span className="service-badge-pill">OPERATIONS</span>
            <h3>24/7/365 Network Operations Center</h3>
            <p>
              Telecommunications does not pause for weekends or holidays. Our centralized Network Operations Center operates continuously around the clock with senior telecommunication engineers monitoring traffic flows, operator latency anomalies, and route degradation across our global network hubs.
            </p>
            <p>
              Every bilateral interconnect is monitored through automated synthetic probes dispatching test packets every thirty seconds. If an operator SMSC experiences a sudden queue backup or an intermediate transit link introduces jitter, our routing core automatically reroutes traffic to our secondary Tier-1 partner in less than 50 milliseconds.
            </p>
          </div>

          {/* Industry Accreditations & Standards */}
          <div>
            <div className="section-header-centered">
              <span className="section-pill">Governance & Trust</span>
              <h2 className="section-title">Industry Accreditations & Standards</h2>
              <p className="section-subtitle">
                Operating with certified information security, rigorous data protection, and full compliance with international telecommunication frameworks.
              </p>
            </div>

            <div className="compliance-cards-grid">
              {standards.map((std, sIndex) => (
                <div key={sIndex} className="compliance-item">
                  <div className="comp-title">{std.title}</div>
                  <div className="comp-desc">{std.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #F26522 0%, #D84D0C 100%)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '44px 32px',
              textAlign: 'center',
              marginTop: '60px',
            }}
          >
            <h3 style={{ fontSize: '26px', marginBottom: '10px', color: '#FFFFFF' }}>
              Interested in Exploring a Bilateral Partnership?
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '15.5px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
              Speak directly with our carrier relations team to evaluate swap agreements, volume discounts, or private SMPP binds.
            </p>
            <Link
              href="/contact"
              className="btn btn-white"
              style={{ padding: '13px 30px', fontSize: '14.5px' }}
            >
              Open Carrier Dialogue &rarr;
            </Link>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
