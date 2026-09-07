import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid-3">
          <div>
            <Link href="/" aria-label="Kimoksha Telco Home" style={{ display: 'inline-block', marginBottom: '14px' }}>
              <Image
                src="/kimoksha-logo-clean.png"
                alt="Kimoksha Telco"
                width={150}
                height={45}
                style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }}
              />
            </Link>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: '1.6' }}>
              Global wholesale SMS termination, voice routing hub, and high-capacity carrier infrastructure headquartered in Dubai Internet City, serving 500+ direct interconnects worldwide.
            </p>
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-soft)' }}>
              Equinix DX1 (Dubai) &bull; Equinix FR2 (Frankfurt) &bull; Equinix LD4 (London) &bull; Equinix SG1 (Singapore)
            </div>
          </div>

          <div className="footer-col">
            <h4>Carrier Solutions</h4>
            <ul>
              <li><Link href="/services">Wholesale SMS Termination</Link></li>
              <li><Link href="/services">SIP Voice & VoIP Minutes</Link></li>
              <li><Link href="/services">A2P Enterprise Messaging</Link></li>
              <li><Link href="/services">SMPP 3.4 & RESTful API</Link></li>
              <li><Link href="/services">SMS Hubbing & Aggregation</Link></li>
              <li><Link href="/services">Voice Broadcasting & IVR</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Operations & Desk</h4>
            <ul>
              <li><Link href="/about">About Kimoksha Telecom</Link></li>
              <li><Link href="/contact">Bilateral Interconnect Request</Link></li>
              <li><a href="mailto:sales@kimokshatelco.com">sales@kimokshatelco.com</a></li>
              <li><a href="mailto:noc@kimokshatelco.com">noc@kimokshatelco.com</a></li>
              <li><Link href="/contact">NOC Escalation Matrix</Link></li>
              <li><Link href="/contact">Request Rate Deck</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} Kimoksha Telecom FZ-LLC. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/about">Carrier Standards</Link>
            <Link href="/contact">Privacy Statement</Link>
            <Link href="/contact">Interconnect Agreement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
