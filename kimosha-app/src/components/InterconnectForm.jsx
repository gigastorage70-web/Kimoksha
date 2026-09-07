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

  return (
    <section id="contact" style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
      <div className="container">
        <div className="lets-connect-card" style={{ maxWidth: '580px', margin: '0 auto' }}>
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
      </div>
    </section>
  );
}
