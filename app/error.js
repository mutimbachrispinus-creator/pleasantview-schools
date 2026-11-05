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

  const handleHardRefresh = async () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('pvs_chunk_reloaded');
        sessionStorage.removeItem('pvs_chunk_reload_time');
        if ('caches' in window) {
          const names = await caches.keys();
          await Promise.all(names.map(n => caches.delete(n)));
        }
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        }
        // Keep session intact - do not wipe authentication cookies
      } catch {}
      window.location.href = window.location.pathname.split('?')[0] + '?_nocache=' + Date.now();
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
        <p style={{ fontSize: '14.5px', color: '#666', lineHeight: 1.6, marginBottom: '15px' }}>
          We detected an interface update. Please tap below to refresh the page or return to the main portal.
        </p>
        {error?.message && (
          <div style={{
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            marginBottom: '20px',
            wordBreak: 'break-word',
            textAlign: 'left'
          }}>
            {error.message}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleHardRefresh}
            style={{
              background: '#8B1E2D',
              color: '#ffffff',
              border: 0,
              padding: '12px 22px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer'
            }}
          >
            Refresh Now
          </button>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: '#ffffff',
              color: '#1E232A',
              border: '1px solid #d1d5db',
              padding: '12px 22px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              background: '#1E232A',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '12px 22px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13.5px',
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
