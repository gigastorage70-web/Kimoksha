'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionWarningModal() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const router = useRouter();

  // Inactivity timeout: 30 minutes total, warning at 25 minutes
  const TIMEOUT_MS = 30 * 60 * 1000;
  const WARNING_MS = 5 * 60 * 1000;

  useEffect(() => {
    let warnTimer;
    let expireTimer;
    let countdownInterval;

    const startTimers = () => {
      clearTimeout(warnTimer);
      clearTimeout(expireTimer);
      clearInterval(countdownInterval);
      setShowWarning(false);
      setTimeLeft(300);

      // Warning at 25m
      warnTimer = setTimeout(() => {
        setShowWarning(true);
        let seconds = 300;
        countdownInterval = setInterval(() => {
          seconds -= 1;
          setTimeLeft(seconds);
          if (seconds <= 0) {
            clearInterval(countdownInterval);
            handleLogout();
          }
        }, 1000);
      }, TIMEOUT_MS - WARNING_MS);

      // Expiry at 30m
      expireTimer = setTimeout(() => {
        handleLogout();
      }, TIMEOUT_MS);
    };

    const handleLogout = async () => {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login?reason=timeout');
    };

    startTimers();

    return () => {
      clearTimeout(warnTimer);
      clearTimeout(expireTimer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  const keepSessionAlive = async () => {
    try {
      const res = await fetch('/api/admin/session/keep-alive');
      if (res.ok) {
        setShowWarning(false);
        // Refresh page or trigger reset
      } else {
        router.push('/admin/login');
      }
    } catch (e) {
      router.push('/admin/login');
    }
  };

  if (!showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="session-warning-backdrop">
      <div className="session-warning-card">
        <div className="session-warning-badge">SECURITY TIMEOUT</div>
        <h3 className="session-warning-title">Operator Session Expiring</h3>
        <p className="session-warning-desc">
          Your secure telecommunications command session will expire in{' '}
          <span className="session-warning-timer">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>{' '}
          due to inactivity.
        </p>
        <div className="session-warning-actions">
          <button onClick={keepSessionAlive} className="btn-stay-alive">
            Stay Logged In
          </button>
          <button
            onClick={async () => {
              await fetch('/api/admin/auth/logout', { method: 'POST' });
              router.push('/admin/login');
            }}
            className="btn-signout-now"
          >
            Sign Out Now
          </button>
        </div>
      </div>

      <style jsx>{`
        .session-warning-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .session-warning-card {
          background: #0f172a;
          border: 1px solid rgba(242, 101, 34, 0.4);
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(242, 101, 34, 0.2);
          border-radius: 16px;
          padding: 2rem;
          max-width: 440px;
          width: 100%;
          text-align: center;
          color: #f8fafc;
        }
        .session-warning-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #f26522;
          background: rgba(242, 101, 34, 0.15);
          border: 1px solid rgba(242, 101, 34, 0.3);
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 1rem;
        }
        .session-warning-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.75rem;
        }
        .session-warning-desc {
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 1.75rem;
        }
        .session-warning-timer {
          color: #f26522;
          font-weight: 800;
          font-family: monospace;
          font-size: 1rem;
        }
        .session-warning-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }
        .btn-stay-alive {
          background: #f26522;
          color: #ffffff;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-stay-alive:hover {
          background: #e05514;
          box-shadow: 0 0 15px rgba(242, 101, 34, 0.4);
        }
        .btn-signout-now {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-signout-now:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
