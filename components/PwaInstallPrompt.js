'use client';
import { useEffect, useState } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[PWA] Service Worker active:', reg.scope))
        .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
    }

    // Check if app is already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install banner after 4 seconds to avoid interrupting initial render
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div
      role="alert"
      aria-label="Install App"
      style={{
        position: 'fixed',
        bottom: '76px',
        left: '12px',
        right: '12px',
        margin: '0 auto',
        zIndex: 99998,
        background: '#1E232A',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
        border: '1.5px solid #8B1E2D',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
        animation: 'slideUpPrompt 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{
        width: '46px',
        height: '56px',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <img src="/images/pvs_crest.png?v=20261107b" alt="Pleasant View Schools Crest" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <div style={{ flex: 1, fontSize: '13px' }}>
        <strong style={{ display: 'block', fontSize: '14px', color: '#ffffff' }}>
          Install Pleasant View App
        </strong>
        <span style={{ color: 'rgba(255,255,255,0.8)' }}>Add to home screen for instant portal access &amp; campus tours.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={handleInstallClick}
          style={{
            background: '#8B1E2D',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '12px',
            padding: '8px 14px',
            borderRadius: '4px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setShowPrompt(false)}
          aria-label="Dismiss app install prompt"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
