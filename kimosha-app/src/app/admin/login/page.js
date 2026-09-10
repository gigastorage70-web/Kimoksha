'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Shield, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage('Network error connecting to authentication endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-viewport">
      {/* Ambient Carrier Glow */}
      <div className="ambient-glow" />

      <div className="login-card-box">
        {/* Brand Header */}
        <div className="login-header">
          <div className="security-badge">
            <Shield size={12} />
            <span>ENTERPRISE NOC CONSOLE</span>
          </div>

          <div className="logo-wrap">
            <Image
              src="/kimoksha-logo-clean.png"
              alt="Kimoksha Telecom"
              width={180}
              height={40}
              style={{ objectFit: 'contain', width: 'auto', height: '36px' }}
              priority
            />
          </div>

          <h2 className="login-title">Operations Command Login</h2>
          <p className="login-subtitle">
            Authorized carrier operations & bilateral management terminal.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="error-alert" role="alert">
            <AlertCircle size={16} className="error-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Operator Username</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                id="username"
                required
                autoComplete="username"
                placeholder="Enter operator username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Security Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                id="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-login-submit" disabled={isLoading}>
            {isLoading ? (
              <span>Verifying Operator...</span>
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security & Access Notice */}
        <div className="login-security-notice">
          <p className="security-notice-text">
            Enterprise NOC access restricted to authorized carrier operations personnel.
          </p>
          <p className="security-subtext">
            All access attempts are monitored and recorded. Brute-force protection active.
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-viewport {
          min-height: 100vh;
          background: #030712;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .ambient-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(242, 101, 34, 0.12) 0%, rgba(15, 23, 42, 0) 70%);
          filter: blur(80px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .login-card-box {
          max-width: 440px;
          width: 100%;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(242, 101, 34, 0.1);
          position: relative;
          z-index: 10;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(242, 101, 34, 0.12);
          border: 1px solid rgba(242, 101, 34, 0.3);
          color: #f26522;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }
        .logo-wrap {
          margin-bottom: 1rem;
        }
        .login-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.35rem;
          letter-spacing: -0.01em;
        }
        .login-subtitle {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.4;
          margin: 0;
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.825rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #cbd5e1;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-wrapper :global(.input-icon) {
          position: absolute;
          left: 14px;
          color: #64748b;
          pointer-events: none;
        }
        .input-wrapper input {
          width: 100%;
          background: rgba(3, 7, 18, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 12px 14px 12px 42px;
          color: #f8fafc;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-wrapper input:focus {
          border-color: #f26522;
          box-shadow: 0 0 0 3px rgba(242, 101, 34, 0.2);
          background: rgba(3, 7, 18, 0.9);
        }
        .btn-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f26522;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .btn-login-submit:hover:not(:disabled) {
          background: #e05514;
          box-shadow: 0 0 20px rgba(242, 101, 34, 0.4);
          transform: translateY(-1px);
        }
        .btn-login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-security-notice {
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }
        .security-notice-text {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .security-subtext {
          font-size: 0.7rem;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
