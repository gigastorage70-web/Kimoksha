'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setTimeout(() => {
      setSubmitted(false);
    }, 7000);
  };

  const departments = [
    {
      title: 'Interconnect & Wholesale Sales',
      email: 'sales@kimokshatelco.com',
      desc: 'Bilateral trading agreements, rate card requests, and enterprise volume pricing.',
    },
    {
      title: '24/7 Network Operations Center',
      email: 'noc@kimokshatelco.com',
      desc: 'Live route diagnostics, SMPP session monitoring, and emergency technical troubleshooting.',
    },
    {
      title: 'Carrier Bilateral Relations',
      email: 'interconnect@kimokshatelco.com',
      desc: 'Direct mobile network operator tie-ups, voice swap terms, and regulatory compliance.',
    },
    {
      title: 'Customer & Technical Support',
      email: 'support@kimokshatelco.com',
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
      level: 'Severity 2 (High Degradation)',
      impact: 'Quality degradation, route flapping, or latency spike',
      sla: 'Under 45 Minutes',
      contact: 'Senior Routing Engineer',
    },
    {
      level: 'Severity 3 (Standard / Non-Outage)',
      impact: 'Configuration questions, rate inquiries, or testing binds',
      sla: 'Under 4 Hours',
      contact: 'Carrier Account Support Desk',
    },
  ];

  const regionalFacilities = [
    {
      location: 'Dubai HQ Core (DX1)',
      address: 'Building 14, Dubai Internet City, Dubai, United Arab Emirates',
      contact: '+971 4 000 0000',
      type: 'Executive Headquarters & Primary Signalling Core',
    },
    {
      location: 'London Operations (LD4)',
      address: 'Slough Data Campus, Buckinghamshire, United Kingdom',
      contact: '+44 20 7946 0000',
      type: 'Western Europe Carrier Exchange & Voice Peering Center',
    },
    {
      location: 'Frankfurt Node (FR2)',
      address: 'Kleyerstrasse 90, Frankfurt am Main, Germany',
      contact: '+49 69 0000 0000',
      type: 'Central European Core Transit & DE-CIX Peering',
    },
    {
      location: 'Singapore Gateway (SG1)',
      address: 'Ayer Rajah Crescent, One-North, Singapore',
      contact: '+65 6789 0000',
      type: 'Asia-Pacific Subsea Landing & ASEAN Traffic Core',
    },
  ];

  return (
    <div className="contact-page-wrap">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">Contact Us</span>
          </div>
          <span className="section-pill">Interconnect & NOC Desk</span>
          <h1 className="page-title">Connect with Kimoksha Telecom</h1>
          <p className="page-subtitle">
            Initiate bilateral carrier onboarding, request custom rate cards, or engage our 24/7 Network Operations Center directly.
          </p>
        </div>
      </section>

      {/* Main Form & Direct Desk Section */}
      <section className="section-block">
        <div className="container">
          <div className="contact-grid-2">
            {/* Form Column */}
            <div className="contact-form-panel">
              <h2 className="lets-connect-title" style={{ fontSize: '26px' }}>Lets Connect</h2>
              <p className="lets-connect-subtitle">
                Ready to enhance your telecom capabilities?Let&apos;s discuss your needs
              </p>

              {submitted && (
                <div className="lets-connect-alert" role="alert">
                  ✓ Thank you! Your message has been received. Our telecom specialists will connect with you shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="lets-connect-form">
                <div className="form-group">
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Your email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    className="form-control"
                    placeholder="Enter subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Your message (optional)</label>
                  <textarea
                    id="contact-message"
                    className="form-control"
                    rows={5}
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="lets-connect-submit">
                  Submit
                </button>
              </form>
            </div>

            {/* Direct Departments Column */}
            <div className="contact-info-panel">
              <div className="panel-badge">DIRECT ROUTING DESKS</div>
              <h2>Operational Desks</h2>
              <p className="panel-desc">
                Direct points of contact for ongoing bilateral partners, billing settlement, and live routing requests.
              </p>

              <div className="dept-list">
                {departments.map((dept) => (
                  <div key={dept.title} className="dept-card">
                    <div className="dept-title">{dept.title}</div>
                    <div className="dept-desc">{dept.desc}</div>
                    <a href={`mailto:${dept.email}`} className="dept-link">
                      {dept.email} &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOC Escalation Matrix Table */}
      <section className="section-block bg-alt">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-pill">Carrier SLA</span>
            <h2 className="section-title">24/7/365 NOC Severity Escalation Matrix</h2>
            <p className="section-subtitle">
              Structured technical resolution guidelines for interconnected carriers, guaranteeing immediate remediation during incidents.
            </p>
          </div>

          <div className="escalation-table-wrap">
            <table className="escalation-table">
              <thead>
                <tr>
                  <th>Severity Level</th>
                  <th>Impact Scope</th>
                  <th>First Response SLA</th>
                  <th>Escalation Path</th>
                </tr>
              </thead>
              <tbody>
                {escalationMatrix.map((row) => (
                  <tr key={row.level}>
                    <td>
                      <strong>{row.level}</strong>
                    </td>
                    <td>{row.impact}</td>
                    <td>
                      <span className="sla-badge">{row.sla}</span>
                    </td>
                    <td>{row.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Global Facilities & Data Centers */}
      <section className="section-block">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-pill">Physical Infrastructure</span>
            <h2 className="section-title">Global Carrier Facilities</h2>
            <p className="section-subtitle">
              Corporate offices and carrier-neutral Equinix data center points of presence worldwide.
            </p>
          </div>

          <div className="facilities-grid">
            {regionalFacilities.map((fac) => (
              <div key={fac.location} className="facility-card">
                <div className="fac-type">{fac.type}</div>
                <h3 className="fac-title">{fac.location}</h3>
                <p className="fac-addr">{fac.address}</p>
                <div className="fac-contact">{fac.contact}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
