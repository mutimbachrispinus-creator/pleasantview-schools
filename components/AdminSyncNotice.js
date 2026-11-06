'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminSyncNotice() {
  const [notice, setNotice] = useState(null);
  const activeSubmissionRef = useRef(false);

  useEffect(() => {
    let hideTimer;

    const handleFormSubmit = (e) => {
      const form = e.target;
      if (!form || form.tagName?.toLowerCase() !== 'form') return;

      activeSubmissionRef.current = true;
      if (hideTimer) clearTimeout(hideTimer);

      setNotice({
        type: 'saving',
        text: 'Saving changes and synchronizing live with public website...'
      });
    };

    const handleError = () => {
      if (activeSubmissionRef.current) {
        activeSubmissionRef.current = false;
        setNotice({
          type: 'error',
          text: 'Upload or operation could not be completed. Please ensure media is under 15MB and try again.'
        });
        hideTimer = setTimeout(() => setNotice(null), 7000);
      }
    };

    window.addEventListener('submit', handleFormSubmit);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('submit', handleFormSubmit);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (!notice) return null;

  const isSuccess = notice.type === 'success';
  const isSaving = notice.type === 'saving';
  const isError = notice.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 99999,
      background: isSuccess ? '#166534' : isError ? '#991b1b' : '#1E232A',
      color: '#ffffff',
      padding: '14px 20px',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13.5px',
      fontWeight: 600,
      border: `1.5px solid ${isSuccess ? '#22c55e' : isError ? '#f87171' : 'var(--gold-accent, #e0a82e)'}`,
      maxWidth: '440px',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <i
        className={isSaving ? 'fa-solid fa-spinner fa-spin' : isSuccess ? 'fa-circle-check' : 'fa-triangle-exclamation'}
        style={{ fontSize: '18px', color: isSuccess ? '#4ade80' : isError ? '#fca5a5' : '#fbbf24' }}
      />
      <div style={{ flex: 1, lineHeight: 1.4 }}>{notice.text}</div>
      <button
        type="button"
        onClick={() => setNotice(null)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '2px 4px',
          marginLeft: '8px',
          fontSize: '16px'
        }}
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
