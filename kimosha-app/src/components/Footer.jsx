export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid-3">
          <div>
            <div className="brand-logo" style={{ fontSize: '20px', marginBottom: '12px' }}>
              <span>kimosha</span>
              <span className="dot">telco</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: '1.6' }}>
              Global wholesale SMS termination, voice routing hub, and high-capacity CPaaS infrastructure serving 500+ carrier interconnects worldwide.
            </p>
          </div>

          <div className="footer-col">
            <h4>Carrier Services</h4>
            <ul>
              <li><a href="#services">Wholesale SMS</a></li>
              <li><a href="#services">SIP Voice Termination</a></li>
              <li><a href="#services">A2P OTP Messaging</a></li>
              <li><a href="#services">SMS Hubbing & Aggregation</a></li>
              <li><a href="#specs">Carrier Standards</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Interconnect NOC</h4>
            <ul>
              <li><a href="mailto:noc@kimoshatelco.com">noc@kimoshatelco.com</a></li>
              <li><a href="mailto:sales@kimoshatelco.com">sales@kimoshatelco.com</a></li>
              <li><a href="#network">Network Coverage Map</a></li>
              <li><a href="#contact">Request Rate Deck</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} Kimosha Telecom FZ-LLC. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#">Carrier Agreement</a>
            <a href="#">Privacy Policy</a>
            <a href="#">NOC Escalation Matrix</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
