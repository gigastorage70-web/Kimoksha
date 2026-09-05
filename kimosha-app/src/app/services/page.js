import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Carrier Services & Wholesale Solutions | Kimosha Telecom',
  description:
    'Comprehensive telecommunication carrier solutions: wholesale SMS termination, SIP voice trunking, high-priority A2P OTP messaging, SMPP v3.4 binds, global SMS hubbing, and voice broadcasting with guaranteed SLAs.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Carrier Services & Wholesale Solutions | Kimosha Telecom',
    description:
      'Explore Kimosha Telecom wholesale SMS termination, SIP voice trunking, SMPP 3.4 binds, and carrier route SLA metrics.',
    url: 'https://www.kimokshatelco.com/services',
    images: ['/kimoksha-logo-clean.png'],
  },
};

export default function ServicesPage() {
  const serviceDetails = [
    {
      id: 'wholesale-sms',
      tag: '01 / MESSAGING CORE',
      title: 'Wholesale SMS Termination',
      overview:
        'Kimosha Telecom operates direct bilateral routing agreements with more than 500 mobile network operators worldwide. Our least-cost routing engine dynamically selects verified transmission paths based on real-time delivery performance, latency metrics, and operator route quality scores.',
      features: [
        'Direct SS7 and SIGTRAN carrier interconnects with binary SMPP 3.4 protocol support',
        'Dynamic Least Cost Routing with automatic fallback to high-priority Tier-1 paths',
        'Real-time handset Delivery Receipts with standardized error code reporting',
        'Full support for Unicode, concatenated multipart messages, and GSM 03.38 alphabet',
        'Dynamic sender identity registration with alphanumeric brand tag preservation',
        'Adaptive burst traffic buffering handling peak throughput beyond 15,000 TPS',
      ],
      routes: [
        { name: 'Direct 1-Hop SS7', sla: '99.5% Delivery', speed: '< 1.1s', desc: 'Direct MNO SMSC connections with guaranteed sender identity.' },
        { name: 'Standard Wholesale', sla: '96.0% Delivery', speed: '< 2.8s', desc: 'Cost-efficient volume routing for non-critical alerts and notifications.' },
      ],
    },
    {
      id: 'voice-sip',
      tag: '02 / VOICE INFRASTRUCTURE',
      title: 'Voice Termination & SIP Trunking',
      overview:
        'Carrier-grade SIP trunking infrastructure supporting G.711, G.729, and Opus HD codecs. Our geographically distributed Session Border Controllers in Frankfurt, Dubai, London, and Singapore guarantee sub-50ms jitter and high Answer Seizure Ratios for international call centers and enterprise dialers.',
      features: [
        'Guaranteed Calling Line Identification pass-through across premium routes',
        'Full compliance with SIP RFC 3261, TLS transport, and SRTP voice encryption',
        'Sub-1.5s average Post-Dial Delay with optimized network jitter buffers',
        'Proactive fraud detection and strict zero-tolerance False Answer Supervision mitigation',
        'Flexible authentication options: IP whitelisting or Digest credentials',
        'Real-time Call Detail Record generation accessible via secure API or automated SFTP',
      ],
      routes: [
        { name: 'Premium Direct CLI', sla: 'ASR > 68%', speed: '< 1.2s PDD', desc: 'Opus HD / G.711 voice paths with verified local number presentation.' },
        { name: 'Wholesale Voice', sla: 'ASR > 52%', speed: '< 2.0s PDD', desc: 'High-capacity route blend designed for high-concurrency enterprise call traffic.' },
      ],
    },
    {
      id: 'a2p-otp',
      tag: '03 / CRITICAL DELIVERY',
      title: 'A2P Enterprise Messaging & OTP Engine',
      overview:
        'Engineered specifically for verification codes, two-factor authentication, banking notices, and time-critical system alerts. Transactional traffic travels through isolated priority queues that bypass marketing queues to eliminate transit latency.',
      features: [
        'Dedicated priority queue processing delivering verification codes in under 1.2 seconds globally',
        'Automated Number Portability checks and Home Location Register lookups for carrier validation',
        'Smart retry logic that automatically diverts traffic around transient operator congestion',
        'TLS 1.3 encrypted transmission adhering to international banking privacy standards',
        'Instant webhooks for handset receipt confirmations and delivery timeline diagnostics',
        'High-volume capacity capable of sustaining flash surges during marketing flash sales and OTP spikes',
      ],
      routes: [
        { name: 'Priority OTP Lane', sla: '99.9% Delivery', speed: '< 0.9s', desc: 'Zero-queue lane with immediate handset priority and DLR acknowledgement.' },
        { name: 'Transactional Notifications', sla: '98.5% Delivery', speed: '< 1.5s', desc: 'Secure alerts for shipment updates, security logins, and appointment receipts.' },
      ],
    },
    {
      id: 'smpp-api',
      tag: '04 / INTERFACE & BINDINGS',
      title: 'SMPP 3.4 & RESTful API Platform',
      overview:
        'Connect via high-throughput binary SMPP 3.4 protocols for raw telecommunication volume or use our modern RESTful JSON APIs. Both interfaces feed directly into our core routing engine with shared rate cards and live diagnostics.',
      features: [
        'SMPP 3.4 Transceiver, Transmitter, and Receiver bind modes with multi-session support',
        'Up to 500 TPS per individual TCP bind session with configurable window sizes up to 50 PDUs',
        'RESTful JSON API with OpenAPI specifications and live sandbox request debugger',
        'Bidirectional webhooks for asynchronous status callbacks and incoming MO SMS replies',
        'Granular IP access control lists, API key rotation, and OAuth2 token authorization',
        'Thirty-second keep-alive intervals with automated session re-connection logic',
      ],
      routes: [
        { name: 'SMPP v3.4 TRX', sla: 'Sub-millisecond Bind', speed: '500 TPS/session', desc: 'Direct binary protocol for telecom carrier switches and SMS gateways.' },
        { name: 'RESTful JSON', sla: '99.99% API Uptime', speed: '10k req/min', desc: 'Modern HTTP interface with SDK libraries in Python, Node.js, and Go.' },
      ],
    },
    {
      id: 'sms-hubbing',
      tag: '05 / GLOBAL INTERCONNECT',
      title: 'SMS Hubbing & Global Aggregation',
      overview:
        'Simplify international operations through a single bilateral contract granting immediate access to over 800 mobile networks worldwide. Kimosha Telecom handles routing optimization, multi-currency settlements, and protocol conversion.',
      features: [
        'Single master agreement eliminating the administrative overhead of hundreds of separate operator contracts',
        'Built-in carrier firewall rules and automated anti-spam filters protecting partner networks',
        'Dynamic quality grading continuously auditing delivery rates across all connected destinations',
        'Multi-currency clearing supporting settlement in US Dollars, Euros, British Pounds, and UAE Dirhams',
        'Flexible interconnect options including bilateral voice swaps and net SMS balancing',
        'Dedicated carrier relations manager assisting with route planning and volume discounting',
      ],
      routes: [
        { name: 'Hub Bilateral Access', sla: '800+ MNOs', speed: 'Global Coverage', desc: 'Unified commercial structure for international telecom carriers.' },
        { name: 'Regional Aggregation', sla: 'GCC & Middle East', speed: 'Direct In-Country', desc: 'Deep regional operator ties throughout the UAE, Saudi Arabia, Qatar, and Oman.' },
      ],
    },
    {
      id: 'voice-broadcast',
      tag: '06 / HIGH-CONCURRENCY AUDIO',
      title: 'Voice Broadcasting & Automated IVR',
      overview:
        'Broadcast critical voice alerts, appointment notifications, and customer surveys to thousands of recipients simultaneously. Includes automated keypad input collection and Text-to-Speech synthesis in over 40 languages.',
      features: [
        'Outbound dialer engine supporting more than 10,000 concurrent call channels without audio distortion',
        'High-fidelity Text-to-Speech engine supporting multiple localized accents and dialects',
        'Simple WAV and MP3 file uploads with automated sample rate normalization for telephony',
        'Interactive DTMF keypad collection triggering custom webhooks and branch actions',
        'Accurate Answering Machine Detection that distinguishes human pickup from voicemail',
        'Live transfer capability redirecting responsive callers to call center queue agents',
      ],
      routes: [
        { name: 'Interactive Broadcast', sla: '10,000+ Channels', speed: 'Instant Dispatch', desc: 'Automated notification engine with keypad interaction capture.' },
        { name: 'Emergency Mass Alert', sla: 'High Priority', speed: 'Concurrent Dial', desc: 'Rapid delivery of public safety announcements and urgent corporate bulletins.' },
      ],
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
            <span>Services</span>
          </nav>
          <h1 className="page-title">
            Carrier-Grade <span>Telecommunication Solutions</span>
          </h1>
          <p className="page-description">
            Direct interconnect routes, high-throughput protocol bindings, and mission-critical voice termination engineered for international carriers, aggregators, and enterprise platforms.
          </p>
        </div>
      </section>

      {/* Detailed Services Breakdown */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div className="section-header-centered" style={{ marginBottom: '40px' }}>
            <span className="section-pill">Core Carrier Capabilities</span>
            <h2 className="section-title">Technical Service Architecture</h2>
            <p className="section-subtitle">
              Review our six transmission pillars and examine route parameters, ingestion protocols, and verified SLAs.
            </p>
          </div>

          <div>
            {serviceDetails.map((service) => (
              <article key={service.id} id={service.id} className="service-deep-card">
                <div className="service-card-header">
                  <div>
                    <span className="service-badge-pill">{service.tag}</span>
                    <h3 className="service-title-lg">{service.title}</h3>
                  </div>
                  <Link
                    href="/contact"
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '13px' }}
                  >
                    Request Route Deck
                  </Link>
                </div>

                <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', lineHeight: '1.65' }}>
                  {service.overview}
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '24px', color: 'var(--text)' }}>
                  Technical Capabilities & Protocol Features
                </h4>
                <ul className="service-feature-list">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="route-badge-box">
                  {service.routes.map((route, rIndex) => (
                    <div key={rIndex} className="route-badge-item" style={{ flex: '1 1 280px' }}>
                      <div className="label">{route.name}</div>
                      <div className="val">
                        {route.sla} &bull; <span style={{ color: 'var(--brand)' }}>{route.speed}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {route.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* SLA Comparison Matrix */}
          <div style={{ marginTop: '70px' }}>
            <div className="section-header-centered">
              <span className="section-pill">Route Transparency</span>
              <h2 className="section-title">Carrier Route SLA Comparison</h2>
              <p className="section-subtitle">
                Clear performance benchmarks across our different routing tiers to help you select the ideal balance between delivery speed, redundancy, and cost.
              </p>
            </div>

            <div className="sla-table-wrapper">
              <table className="sla-table">
                <thead>
                  <tr>
                    <th>Route Tier</th>
                    <th>Ingestion Protocols</th>
                    <th>Average Latency</th>
                    <th>Delivery SLA</th>
                    <th>Handset DLR</th>
                    <th>CLI Preservation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong style={{ color: 'var(--text)' }}>Direct 1-Hop SS7</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Bilateral MNO Interconnect</div>
                    </td>
                    <td>SMPP 3.4, REST, SIGTRAN</td>
                    <td>&lt; 1.1 seconds</td>
                    <td><span className="badge-tag-green">99.5%</span></td>
                    <td>100% Verified</td>
                    <td>Guaranteed True Alpha / CLI</td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ color: 'var(--text)' }}>Priority OTP Lane</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Zero-Queue Verification</div>
                    </td>
                    <td>RESTful JSON, SMPP TRX</td>
                    <td>&lt; 0.9 seconds</td>
                    <td><span className="badge-tag-green">99.9%</span></td>
                    <td>Real-time Webhook</td>
                    <td>Strictly Preserved</td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ color: 'var(--text)' }}>Premium SIP Voice</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Opus HD & G.711a Trunks</div>
                    </td>
                    <td>SIP 2.0 (RFC 3261), TLS</td>
                    <td>&lt; 1.2s PDD</td>
                    <td><span className="badge-tag-green">ASR &gt; 68%</span></td>
                    <td>SIP 200 OK / CDR</td>
                    <td>100% Local / National CLI</td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ color: 'var(--text)' }}>Standard Wholesale</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Least Cost Routing Blend</div>
                    </td>
                    <td>SMPP 3.4, REST API</td>
                    <td>&lt; 2.8 seconds</td>
                    <td><span className="badge-tag-green">96.0%</span></td>
                    <td>Network Acknowledged</td>
                    <td>Best Effort Alphanumeric</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ready to Test CTA */}
          <div
            style={{
              background: 'radial-gradient(circle at 50% 50%, #FFF5EE 0%, #FFFFFF 100%)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 32px',
              textAlign: 'center',
              marginTop: '50px',
            }}
          >
            <h3 style={{ fontSize: '28px', marginBottom: '12px', color: 'var(--text)' }}>
              Ready to Test Carrier Routing Parameters?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
              Our bilateral interconnect desk is available 24/7 to issue test rate sheets, SMPP sandbox credentials, and SIP IP authentications.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ padding: '14px 34px', fontSize: '15px' }}>
              Connect with Carrier Desk &rarr;
            </Link>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
