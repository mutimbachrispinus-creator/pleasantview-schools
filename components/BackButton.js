'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BackButton({ fallback = '/', label = 'Back' }) {
  const router = useRouter();

  const handleBack = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <div className="subpage-nav-bar">
      <button
        type="button"
        onClick={handleBack}
        className="back-btn"
        aria-label="Go back to previous page"
      >
        <i className="fa-solid fa-arrow-left-long" /> {label}
      </button>
      <div className="subpage-breadcrumbs">
        <Link href="/" className="crumb-home" title="Return to Homepage">
          <i className="fa-solid fa-house" /> Home
        </Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">Overview</span>
      </div>
    </div>
  );
}
