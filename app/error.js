'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('[Application Client Error]:', error);
    // If it's a chunk loading error from a new deployment, auto-reload cleanly
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('failed to fetch') ||
      error?.message?.includes('Dynamically imported module');

    if (isChunkError && typeof window !== 'undefined') {
      const lastReload = parseInt(sessionStorage.getItem('pvs_chunk_reload_time') || '0', 10);
      if (Date.now() - lastReload > 5000) {
        sessionStorage.setItem('pvs_chunk_reload_time', String(Date.now()));
        // Force refresh service worker caches
        if ('caches' in window) {
          caches.keys().then(names => names.forEach(n => caches.delete(n)));
        }
        window.location.reload();
      }
    }
  }, [error]);

  const handleHardRefresh = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('pvs_chunk_reloaded');
        sessionStorage.removeItem('pvs_chunk_reload_time');
        if ('caches' in window) {
          caches.keys().then(names => names.forEach(n => caches.delete(n)));
        }
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(regs => {
            for (const r of regs) r.unregister();
          });
        }
      } catch {}
      window.location.href = window.location.pathname + '?_v=' + Date.now();
    } else {
      reset();
    }
  };

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--soft-bg, #f4f5f7)',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '10px',
        padding: '35px',
        textAlign: 'center',
        boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
        borderTop: '5px solid #8B1E2D'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(139,30,45,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          color: '#8B1E2D',
          fontSize: '28px'
        }}>
          ⚠️
        </div>
        <h2 style={{ fontSize: '22px', color: '#1E232A', marginBottom: '8px' }}>
          Notice &bull; Updating Page
        </h2>
        <p style={{ fontSize: '14.5px', color: '#666', lineHeight: 1.6, marginBottom: '25px' }}>
          We detected an interface update. Please tap below to refresh the page or return to the main portal.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleHardRefresh}
            style={{
              background: '#8B1E2D',
              color: '#ffffff',
              border: 0,
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Refresh Now
          </button>
          <Link
            href="/"
            style={{
              background: '#1E232A',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '14px',
              display: 'inline-block'
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
