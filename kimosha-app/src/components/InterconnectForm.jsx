'use client';

import { useState } from 'react';

export default function InterconnectForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 8000);
      } else {
        setErrorMessage(data.error || 'Unable to submit inquiry. Please try again.');
      }
    } catch (err) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
      <div className="container">
        <div className="contact-split-card">
          {/* Left Column: Contact Information */}
          <div className="contact-info-col">
            <div className="contact-info-header">
              <h2 className="lets-connect-title">Contact Information</h2>
              <p className="lets-connect-subtitle" style={{ marginBottom: 0 }}>
                Reach out to our office. We&apos;re here to help you succeed.
              </p>
            </div>

            {/* Main Office Card */}
            <div className="contact-card-item">
              <div className="contact-card-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <line x1="8" y1="6" x2="8.01" y2="6"></line>
                  <line x1="16" y1="6" x2="16.01" y2="6"></line>
                  <line x1="8" y1="10" x2="8.01" y2="10"></line>
                  <line x1="16" y1="10" x2="16.01" y2="10"></line>
                  <line x1="8" y1="14" x2="8.01" y2="14"></line>
                  <line x1="16" y1="14" x2="16.01" y2="14"></line>
                </svg>
              </div>
              <div className="contact-card-text">
                <h3>Main Office</h3>
                <p>90 West Street, Upton Northampton, UK NN54XL</p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="contact-card-item">
              <div className="contact-card-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-card-text">
                <h3>Contact</h3>
                <a href="mailto:info@kimokshatelco.com">info@kimokshatelco.com</a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="contact-map-frame">
              <iframe
                title="Kimoksha Telecom Office Location Map"
                src="https://maps.google.com/maps?q=90%20West%20Street,%20Upton,%20Northampton,%20UK%20NN54XL&t=&z=15&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Lets Connect Form */}
          <div>
            <h2 className="lets-connect-title">Lets Connect</h2>
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
                <label htmlFor="home-name">Your name</label>
                <input
                  type="text"
                  id="home-name"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="home-email">Your email</label>
                <input
                  type="email"
                  id="home-email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="home-subject">Subject</label>
                <input
                  type="text"
                  id="home-subject"
                  className="form-control"
                  placeholder="Enter subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="home-message">Your message (optional)</label>
                <textarea
                  id="home-message"
                  className="form-control"
                  rows={4}
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {errorMessage && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }} role="alert">
                  {errorMessage}
                </div>
              )}

              <button type="submit" className="lets-connect-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Transmitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
