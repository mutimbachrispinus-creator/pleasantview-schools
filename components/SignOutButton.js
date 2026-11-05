'use client';
import { useState } from 'react';
import { logout } from '@/app/hidden-admin/actions';

export default function SignOutButton({ className = 'button button-tertiary', style = {} }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async (e) => {
    e.preventDefault();
    setSigningOut(true);
    try {
      // Clear cookie immediately in the browser
      document.cookie = 'pv=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0; SameSite=Lax';
      // Server-side session end
      await logout();
    } catch {}
    // Force browser to reload at staff-portal with logout query to guarantee fresh login form
    window.location.href = '/staff-portal?logout=1';
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
      <i className={signingOut ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-right-from-bracket'} />
      <span>{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}
