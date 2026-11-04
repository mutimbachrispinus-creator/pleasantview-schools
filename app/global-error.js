'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[Global App Error]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#1E232A', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#ffffff', color: '#1E232A', padding: '35px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderTop: '5px solid #8B1E2D' }}>
          <h2 style={{ color: '#8B1E2D', margin: '0 0 10px' }}>Pleasant View Schools</h2>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6, marginBottom: '25px' }}>
            A temporary display error occurred. Please click below to refresh and load the latest version.
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
              else reset();
            }}
            style={{
              background: '#8B1E2D',
              color: '#ffffff',
              border: 0,
              padding: '12px 26px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Reload Website
          </button>
        </div>
      </body>
    </html>
  );
}
