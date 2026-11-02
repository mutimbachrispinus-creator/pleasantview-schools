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
        bottom: '80px',
        right: '20px',
        zIndex: 99998,
        background: 'linear-gradient(135deg, #8B1E2D, #1E232A)',
        color: '#ffffff',
        padding: '14px 18px',
        borderRadius: '8px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
        border: '1px solid var(--gold-accent)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        maxWidth: '380px',
        animation: 'slideUpPrompt 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'var(--gold-accent)',
        color: 'var(--primary-navy)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '16px',
        flexShrink: 0
      }}>
        PV
      </div>

      <div style={{ flex: 1, fontSize: '13px' }}>
        <strong style={{ display: 'block', fontSize: '14px', color: 'var(--gold-accent)' }}>
          Install Pleasantview App
        </strong>
        <span>Add to home screen for instant portal access &amp; campus tours.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={handleInstallClick}
          style={{
            background: 'var(--gold-accent)',
            color: 'var(--dark-navy)',
            border: 'none',
            fontWeight: 800,
            fontSize: '12px',
            padding: '8px 12px',
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
