'use client';
import { useState } from 'react';
import { callAdminAction } from '@/lib/adminClient';

export default function SignOutButton({ label = 'Lock & Sign Out', className = 'button button-tertiary', style = {} }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async (e) => {
    e.preventDefault();
    setSigningOut(true);
    try {
      document.cookie = 'pv=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0; SameSite=Lax';
      document.cookie = 'pv=; Path=/staff-portal; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0; SameSite=Lax';
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
      }
      await callAdminAction('logout', {});
    } catch {}
    window.location.replace('/staff-portal?logout=1');
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={signingOut}
      className={className}
      style={{
        ...style,
        opacity: signingOut ? 0.7 : 1,
        cursor: signingOut ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}
      title="End active session and return to password login screen"
    >
      <i className={signingOut ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-lock'} />
      <span>{signingOut ? 'Locking...' : label}</span>
    </button>
  );
}
