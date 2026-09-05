'use client';

import { useState } from 'react';

export default function InterconnectForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    carrier: '',
    serviceType: 'Wholesale SMS Termination (A-Z)',
    destinations: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contact" style={{ background: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="section-header-centered">
          <span className="section-pill">Interconnect Request</span>
          <h2 className="section-title">Open Carrier Bilateral Channel</h2>
          <p className="section-subtitle">
            Submit your technical specifications to initialize carrier testing.
          </p>
        </div>

        <div className="contact-centered-wrap">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cName">Your Name & Title</label>
              <input
                type="text"
                id="cName"
                className="form-control"
                placeholder="Jane Smith — Carrier Relations Manager"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cEmail">Corporate Carrier Email</label>
              <input
                type="email"
                id="cEmail"
                className="form-control"
                placeholder="jane@telco-global.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cCarrier">Company / Operator Name</label>
              <input
                type="text"
                id="cCarrier"
                className="form-control"
                placeholder="Global Telco Communications"
                required
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cType">Primary Interconnect Interest</label>
              <select
                id="cType"
                className="form-control"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option>Wholesale SMS Termination (A-Z)</option>
                <option>VoIP / SIP Voice Minutes</option>
                <option>A2P OTP Direct Binds</option>
                <option>SMS Hubbing Agreement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cDest">Target Destinations & Expected TPS</label>
              <textarea
                id="cDest"
                className="form-control"
                rows={3}
                placeholder="List target countries, expected TPS, and route quality requirements..."
                value={formData.destinations}
                onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', borderRadius: 'var(--radius-sm)', padding: '14px' }}
            >
              Submit Interconnect Request
            </button>

            {submitted && (
              <div className="form-feedback" style={{ display: 'block' }}>
                ✓ Carrier interconnect request logged. A dedicated NOC engineer will send test credentials shortly.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
