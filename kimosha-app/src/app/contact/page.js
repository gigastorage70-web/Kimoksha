'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    company: '',
    serviceInterest: 'Wholesale SMS Termination (A-Z)',
    protocol: 'SMPP v3.4',
    destinations: '',
    expectedTps: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 7000);
  };

  const departments = [
    {
      title: 'Interconnect & Wholesale Sales',
      email: 'sales@kimoshatelco.com',
      desc: 'Bilateral trading agreements, rate card requests, and enterprise volume pricing.',
    },
    {
      title: '24/7 Network Operations Center',
      email: 'noc@kimoshatelco.com',
      desc: 'Live route diagnostics, SMPP session monitoring, and emergency technical troubleshooting.',
    },
    {
      title: 'Carrier Bilateral Relations',
      email: 'interconnect@kimoshatelco.com',
      desc: 'Direct mobile network operator tie-ups, voice swap terms, and regulatory compliance.',
    },
    {
      title: 'Customer & Technical Support',
      email: 'support@kimoshatelco.com',
      desc: 'API integration guidance, webhook debugging, and account billing inquiries.',
    },
  ];

  const escalationMatrix = [
    {
      level: 'Severity 1 (Critical)',
      impact: 'Complete service interruption or core packet drop',
      sla: 'Under 15 Minutes',
      contact: 'Immediate 24/7 NOC Bridge',
    },
    {
      level: 'Severity 2 (Major)',
      impact: 'Route latency degradation or elevated error codes',
      sla: 'Under 45 Minutes',
      contact: 'Senior Routing Engineer',
    },
    {
      level: 'Severity 3 (Minor)',
      impact: 'General technical inquiries or rate deck updates',
      sla: 'Under 4 Hours',
      contact: 'Carrier Account Representative',
    },
  ];

  const offices = [
    {
      city: 'Dubai (Global Headquarters)',
      address: 'Dubai Internet City, Building 14, Commercial District, Dubai, United Arab Emirates',
      facility: 'Primary Operations & Equinix DX1 Core Switch',
    },
    {
      city: 'Frankfurt (European Operations)',
      address: 'Hanauer Landstraße 320, 60314 Frankfurt am Main, Germany',
      facility: 'European Interconnect Hub & Equinix FR2 Peering',
    },
    {
      city: 'Singapore (Asia-Pacific Desk)',
      address: 'Marina Bay Financial Centre, Tower 1, Singapore 018981',
      facility: 'APAC Routing Desk & Equinix SG1 Gateway',
    },
  ];

  return (
    <main>
      <Navbar />

      {/* Page Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact Us</span>
          </nav>
          <h1 className="page-title">
            Connect with Our <span>Carrier Trading Desk</span>
          </h1>
          <p className="page-description">
            Submit technical requirements to initialize sandbox testing, request verified carrier rate sheets, or contact our 24/7 Network Operations Center directly.
          </p>
        </div>
      </section>

      {/* Main Form & Contacts Section */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div className="contact-split-grid">
            {/* Left Column: Bilateral Application Form */}
            <div className="contact-card-box">
              <span className="service-badge-pill">INTERCONNECT ONBOARDING</span>
              <h2 style={{ fontSize: '24px', margin: '8px 0 16px 0', color: 'var(--text)' }}>
                Open Carrier Bilateral Channel
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Complete the technical specifications below. An interconnect engineer will review your profile and dispatch sandbox credentials and target route pricing within 60 minutes.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="cName">Your Name</label>
                    <input
                      type="text"
                      id="cName"
                      className="form-control"
                      placeholder="Jane Smith"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="cTitle">Job Title</label>
                    <input
                      type="text"
                      id="cTitle"
                      className="form-control"
                      placeholder="Carrier Relations Manager"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="cEmail">Corporate Carrier Email</label>
                    <input
                      type="email"
                      id="cEmail"
                      className="form-control"
                      placeholder="jane@operator.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="cCompany">Company or Operator Name</label>
                    <input
                      type="text"
                      id="cCompany"
                      className="form-control"
                      placeholder="Global Mobile Communications"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="cInterest">Primary Service Interest</label>
                    <select
                      id="cInterest"
                      className="form-control"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    >
                      <option>Wholesale SMS Termination (A-Z)</option>
                      <option>VoIP / SIP Voice Minutes</option>
                      <option>A2P OTP Direct Binds</option>
                      <option>SMS Hubbing Agreement</option>
                      <option>Voice Broadcasting & IVR</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="cProtocol">Preferred Protocol</label>
                    <select
                      id="cProtocol"
                      className="form-control"
                      value={formData.protocol}
                      onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                    >
                      <option>SMPP v3.4 (TRX Bind)</option>
                      <option>SIP 2.0 (RFC 3261 Trunk)</option>
                      <option>RESTful JSON API</option>
                      <option>Direct SS7 / SIGTRAN</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cDest">Target Destination Markets & Countries</label>
                  <input
                    type="text"
                    id="cDest"
                    className="form-control"
                    placeholder="e.g. UAE (+971), Saudi Arabia (+966), UK (+44), USA (+1)"
                    value={formData.destinations}
                    onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cTps">Estimated Monthly Volume or Target TPS</label>
                  <input
                    type="text"
                    id="cTps"
                    className="form-control"
                    placeholder="e.g. 5M messages/month or 250 TPS peak"
                    value={formData.expectedTps}
                    onChange={(e) => setFormData({ ...formData, expectedTps: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', borderRadius: 'var(--radius-sm)', padding: '14px', fontSize: '15px' }}
                >
                  Submit Bilateral Request
                </button>

                {submitted && (
                  <div className="form-feedback" style={{ display: 'block', marginTop: '16px' }}>
                    &check; Interconnect request received. A dedicated NOC engineer will dispatch test credentials and route parameters shortly.
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: Direct Department Directory & SLA Matrix */}
            <div>
              <div className="contact-card-box" style={{ marginBottom: '28px' }}>
                <span className="service-badge-pill">DIRECT CHANNELS</span>
                <h3 style={{ fontSize: '20px', margin: '6px 0 16px 0', color: 'var(--text)' }}>
                  Department Directory
                </h3>

                <div>
                  {departments.map((dept, dIndex) => (
                    <div
                      key={dIndex}
                      style={{
                        padding: '12px 0',
                        borderBottom: dIndex < departments.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text)' }}>
                        {dept.title}
                      </div>
                      <a
                        href={`mailto:${dept.email}`}
                        style={{
                          color: 'var(--brand)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                      >
                        {dept.email}
                      </a>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                        {dept.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* NOC Escalation Table */}
              <div className="contact-card-box">
                <span className="service-badge-pill">NOC RESPONSE GUARANTEE</span>
                <h3 style={{ fontSize: '20px', margin: '6px 0 10px 0', color: 'var(--text)' }}>
                  Escalation Matrix
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Contractual incident turnaround times for active carrier partners.
                </p>

                <table className="escalation-table">
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Response SLA</th>
                      <th>Handling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escalationMatrix.map((esc, eIndex) => (
                      <tr key={eIndex}>
                        <td>
                          <strong style={{ color: 'var(--text)', fontSize: '13px' }}>{esc.level}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-soft)' }}>{esc.impact}</div>
                        </td>
                        <td>
                          <span className="badge-tag-green">{esc.sla}</span>
                        </td>
                        <td style={{ fontSize: '12px' }}>{esc.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Global Office & PoP Directory */}
          <div style={{ marginTop: '60px' }}>
            <div className="section-header-centered">
              <span className="section-pill">Physical Facilities</span>
              <h2 className="section-title">Regional Offices & Facilities</h2>
              <p className="section-subtitle">
                Visit or connect with our regional commercial desks and carrier cross-connect locations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {offices.map((office, oIndex) => (
                <div key={oIndex} className="pop-card">
                  <div className="pop-code" style={{ marginBottom: '8px' }}>
                    FACILITY 0{oIndex + 1}
                  </div>
                  <h4>{office.city}</h4>
                  <p style={{ margin: '8px 0 12px 0', fontSize: '13.5px' }}>{office.address}</p>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--brand-dark)',
                      fontWeight: 600,
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    {office.facility}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
