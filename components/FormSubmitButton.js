'use client';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';

export default function FormSubmitButton({
  label = 'Save Changes',
  pendingLabel = 'Saving & Syncing Live...',
  successLabel = 'Saved & Synced Live!',
  icon = 'fa-solid fa-floppy-disk',
  variant = 'gold',
  className = '',
  style = {}
}) {
  const { pending } = useFormStatus();
  const [wasPending, setWasPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timer;
    const handleError = () => {
      setShowSuccess(false);
      setWasPending(false);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    if (pending) {
      setWasPending(true);
      setShowSuccess(false);
    } else if (wasPending) {
      setWasPending(false);
      setShowSuccess(true);
      timer = setTimeout(() => setShowSuccess(false), 3500);
    }

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
      if (timer) clearTimeout(timer);
    };
  }, [pending, wasPending]);

  const isGold = variant === 'gold' || className.includes('button-gold');
  const isPrimary = variant === 'primary' || className.includes('button-primary');
  const isSecondary = variant === 'secondary' || className.includes('button-secondary');

  const defaultBg = isGold
    ? '#05286B'
    : isPrimary
    ? 'linear-gradient(135deg, #8B1E2D 0%, #6D1421 100%)'
    : isSecondary
    ? '#8B1E2D'
    : '#1E232A';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', ...style }}>
      <button
        type="submit"
        disabled={pending}
        className={className}
        style={{
          background: pending ? '#64748b' : defaultBg,
          color: '#ffffff',
          border: 'none',
          padding: '11px 20px',
          borderRadius: '6px',
          fontSize: '13.5px',
          fontWeight: 700,
          letterSpacing: '0.3px',
          cursor: pending ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: pending ? 'none' : '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'all 0.2s ease'
        }}
      >
        <i className={pending ? 'fa-solid fa-spinner fa-spin' : icon} />
        <span>{pending ? pendingLabel : label}</span>
      </button>

      {showSuccess && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#15803d',
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 800,
            boxShadow: '0 2px 6px rgba(22, 101, 52, 0.08)'
          }}
        >
          <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }} />
          <span>{successLabel}</span>
        </span>
      )}
    </div>
  );
}
