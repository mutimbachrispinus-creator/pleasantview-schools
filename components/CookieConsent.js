'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pvs_cookie_consent');
      if (!stored) {
        // Small delay so page renders gracefully first
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  const handleChoice = type => {
    try {
      localStorage.setItem('pvs_cookie_consent', type);
      localStorage.setItem('pvs_cookie_consent_date', new Date().toISOString());
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '580px',
        margin: '0 auto',
        background: '#071c3d',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '22px 26px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(212, 160, 23, 0.3)',
        zIndex: 99999,
        animation: 'slideUp 0.35s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(212, 160, 23, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#d4a017',
            fontSize: '20px'
          }}
        >
          <i className="fa-solid fa-cookie-bite" />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: '#ffffff', fontWeight: 700 }}>
            Cookie &amp; Privacy Consent
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.55 }}>
            Pleasant View Schools uses essential cookies to ensure safe portal logins and anonymous analytics to improve our campus web services in accordance with Kenya&apos;s Data Protection Act 2019.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => handleChoice('all')}
              style={{
                background: '#d4a017',
                color: '#071c3d',
                border: 'none',
                borderRadius: '4px',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px'
              }}
            >
              Accept All Cookies
            </button>

            <button
              type="button"
              onClick={() => handleChoice('essential')}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Essential Only
            </button>

            <Link
              href="/about#cookies"
              onClick={() => setVisible(false)}
              style={{
                color: '#d4a017',
                fontSize: '12.5px',
                textDecoration: 'underline',
                marginLeft: 'auto',
                fontWeight: 600
              }}
            >
              Read Cookie Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
