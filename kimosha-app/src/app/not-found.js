import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        background: 'radial-gradient(circle at 50% 30%, #FFF5EE 0%, #FFFFFF 70%)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 700,
          color: '#A8420E',
          background: '#FFF3EB',
          border: '1px solid #F9C9A6',
          padding: '4px 12px',
          borderRadius: '999px',
          marginBottom: '20px',
        }}
      >
        ERROR 404
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '48px',
          fontWeight: 800,
          color: '#1A1A2E',
          marginBottom: '14px',
          letterSpacing: '-0.02em',
        }}
      >
        Route Not Found
      </h1>
      <p
        style={{
          fontSize: '17px',
          color: '#5A6370',
          maxWidth: '500px',
          lineHeight: '1.6',
          marginBottom: '32px',
        }}
      >
        The carrier path you requested does not exist in our routing matrix. Please verify the address or navigate back to an active route.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 30px',
          borderRadius: '999px',
          background: '#F26522',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '15px',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(242, 101, 34, 0.25)',
          transition: 'all 0.2s',
        }}
      >
        Return to Global Hub
      </Link>
    </div>
  );
}
