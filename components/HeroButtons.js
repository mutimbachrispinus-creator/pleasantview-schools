'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function HeroButtons({ mapsUrl = 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5' }) {
  const pathname = usePathname() || '';

  // Never render floating side tabs on contact, tour booking, or administrative portal pages
  // to ensure panels and forms are 100% visible and NEVER overlaid!
  if (
    pathname.startsWith('/contact') ||
    pathname.startsWith('/staff-portal') ||
    pathname.startsWith('/hidden-admin')
  ) {
    return null;
  }

  return (
    <div className="hero-buttons" aria-label="Quick Navigation Tabs">
      <a
        className="hero-button dark-blue"
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Directions to Campus on Google Maps"
        style={{ background: 'var(--dark-grey)', borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <i className="fa-solid fa-location-dot" /> VISIT
      </a>
      <Link
        className="hero-button light-blue"
        href="/contact"
        title="Contact Us"
        style={{ background: 'var(--primary-red)', borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <i className="fa-regular fa-envelope" /> CONTACT
      </Link>
    </div>
  );
}
