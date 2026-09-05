import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="cta-banner-section">
      <div className="container">
        <h2>Ready to Interconnect Your Carrier Network?</h2>
        <p>Receive our complete A-Z wholesale SMS and voice rate deck within 60 minutes.</p>
        <Link href="/contact" className="btn btn-white" style={{ padding: '14px 36px', fontSize: '15px' }}>
          Request Interconnect Rate Deck &rarr;
        </Link>
      </div>
    </section>
  );
}

