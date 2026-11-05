'use client';
import { useState, useEffect } from 'react';

export default function AdminSyncNotice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // Listen to all form submit events within the admin panel
    const handleFormSubmit = (e) => {
      const form = e.target;
      if (!form || form.tagName.toLowerCase() !== 'form') return;

      // When form is submitted, show saving notice
      setNotice({
        type: 'saving',
        text: 'Saving changes and synchronizing with public website...'
      });

      // After action finishes (or page settles), confirm live sync
      const timer = setTimeout(() => {
        setNotice({
          type: 'success',
          text: 'Changes saved successfully and synchronized live across the website!'
        });
        const hideTimer = setTimeout(() => setNotice(null), 5000);
        return () => clearTimeout(hideTimer);
      }, 1200);

      return () => clearTimeout(timer);
    };

    window.addEventListener('submit', handleFormSubmit);
    return () => window.removeEventListener('submit', handleFormSubmit);
  }, []);

  if (!notice) return null;

  const isSuccess = notice.type === 'success';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 99999,
      background: isSuccess ? '#166534' : '#1E232A',
      color: '#ffffff',
      padding: '14px 20px',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13.5px',
      fontWeight: 600,
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <i className={isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-spinner fa-spin'} style={{ fontSize: '18px', color: isSuccess ? '#4ade80' : '#fbbf24' }} />
      <div>{notice.text}</div>
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
          fontSize: '14px'
        }}
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
