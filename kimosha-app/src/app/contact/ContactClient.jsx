'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactClient() {
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
          <h1 className="page-title">Connect with Kimosha Telecom</h1>
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
              <div className="panel-badge">BILATERAL CARRIER ONBOARDING</div>
              <h2>Interconnect Request Form</h2>
              <p className="panel-desc">
                Submit your carrier traffic profile below. Our routing engineering team typically provisions test binds and responds with rate decks within 4 business hours.
              </p>

              {submitted && (
                <div className="form-alert-success" role="alert">
                  <strong>Interconnect Request Received.</strong>
                  <p>
                    A technical onboarding manager has been assigned to your ticket. Test SMPP/SIP credentials and our latest rate matrix will be dispatched shortly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="onboarding-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Alexander Wright"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="title">Job Title</label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Head of Wholesale Routing"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="email">Corporate Email *</label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="name@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company / Operator Name *</label>
                    <input
                      id="company"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Global Telco Services Ltd"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="serviceInterest">Service Interest *</label>
                    <select
                      id="serviceInterest"
                      className="form-control"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    >
                      <option>Wholesale SMS Termination (A-Z)</option>
                      <option>SIP Voice & VoIP Termination</option>
                      <option>A2P High-Priority OTP Messaging</option>
                      <option>SMPP v3.4 Direct Bind / API</option>
                      <option>Global SMS Hubbing & Swap Agreement</option>
                      <option>High-Capacity Voice Broadcasting</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="protocol">Technical Interconnect Protocol *</label>
                    <select
                      id="protocol"
                      className="form-control"
                      value={formData.protocol}
                      onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                    >
                      <option>SMPP v3.4 Transceiver</option>
                      <option>SIP RFC 3261 Trunking</option>
                      <option>RESTful HTTPS CPaaS API</option>
                      <option>SS7 / SIGTRAN (Carrier Level)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="destinations">Target Traffic Corridors</label>
                    <input
                      id="destinations"
                      type="text"
                      className="form-control"
                      placeholder="e.g. GCC, Western Europe, North America"
                      value={formData.destinations}
                      onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="expectedTps">Estimated Peak Volume (TPS / Monthly Minutes)</label>
                    <input
                      id="expectedTps"
                      type="text"
                      className="form-control"
                      placeholder="e.g. 250 TPS or 2.5M Minutes / month"
                      value={formData.expectedTps}
                      onChange={(e) => setFormData({ ...formData, expectedTps: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  Submit Bilateral Interconnect Request &rarr;
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
