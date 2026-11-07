'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getYearsOfExistence } from '@/lib/heritage';

export default function MobileBottomBar({
  phone = '+254 711 689 913',
  mapsUrl = 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5',
  whatsappUrl = 'https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20would%20like%20to%20inquire%20about%20admissions.',
  schools = [],
  quickLinks = [],
  settings = {}
}) {
  const [openDrawer, setOpenDrawer] = useState(null); // 'quick' | 'schools' | null
  const [years, setYears] = useState(() => getYearsOfExistence());

  useEffect(() => {
    const t = setInterval(() => setYears(getYearsOfExistence()), 60000);
    return () => clearInterval(t);
  }, []);

  const toggleDrawer = (name) => {
    setOpenDrawer(prev => (prev === name ? null : name));
  };

  const closeDrawer = () => setOpenDrawer(null);

  return (
    <>
      {/* DRAWER BACKDROP */}
      {openDrawer && (
        <div
          className="mobile-drawer-backdrop"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* QUICK LINKS BOTTOM DRAWER */}
      <div className={`mobile-bottom-drawer ${openDrawer === 'quick' ? 'open' : ''}`}>
        <div className="drawer-handle" />
        <div className="drawer-header">
          <h4><i className="fa-solid fa-bolt" style={{ color: 'var(--gold-accent)' }} /> Quick Links &amp; Portals</h4>
          <button type="button" onClick={closeDrawer} className="drawer-close-btn">&times;</button>
        </div>
        <div className="drawer-grid">
          {/* DIRECT WHATSAPP ACTION IN DRAWER */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeDrawer}
            className="drawer-item"
            style={{ borderLeftColor: '#25D366', background: '#f0fdf4' }}
          >
            <div className="drawer-item-title" style={{ color: '#15803d' }}>
              <i className="fa-brands fa-whatsapp" style={{ marginRight: '6px' }} /> Chat on WhatsApp (0711 689 913)
            </div>
            <small>Direct Instant Response from Admissions</small>
          </a>

          {/* DIRECT SMS TO ADMIN IN DRAWER */}
          <Link
            href="/contact#admin-sms"
            onClick={closeDrawer}
            className="drawer-item"
            style={{ borderLeftColor: 'var(--gold-accent)' }}
          >
            <div className="drawer-item-title">
              <i className="fa-solid fa-comment-sms" style={{ marginRight: '6px', color: 'var(--gold-dark)' }} /> Send Direct SMS to Admin
            </div>
            <small>Dispatched straight to admin mobile phone</small>
          </Link>

          {!quickLinks.some(l => l.url === '/pictorial') && (
            <Link
              href="/pictorial"
              onClick={closeDrawer}
              className="drawer-item"
              style={{ borderLeftColor: 'var(--primary-red)' }}
            >
              <div className="drawer-item-title">School Pictorial &amp; Gallery</div>
              <small>Science Labs, Sports, Boarding &amp; Campus Life</small>
            </Link>
          )}

          {quickLinks.map(l => (
            <Link
              key={l.id}
              href={l.url}
              onClick={closeDrawer}
              className="drawer-item"
            >
              <div className="drawer-item-title">{l.title}</div>
              <small>{l.category || 'Portal'}</small>
            </Link>
          ))}
          <Link
            href="/careers#tenders"
            onClick={closeDrawer}
            className="drawer-item"
          >
            <div className="drawer-item-title">Tenders and Bids</div>
            <small>Procurement</small>
          </Link>
          <Link
            href="/careers"
            onClick={closeDrawer}
            className="drawer-item"
          >
            <div className="drawer-item-title">Working at Pleasant View</div>
            <small>Careers &amp; Opportunities</small>
          </Link>
          <Link
            href="/staff-portal"
            onClick={closeDrawer}
            className="drawer-item"
            style={{ borderLeftColor: 'var(--gold-accent)' }}
          >
            <div className="drawer-item-title">Staff Portal</div>
            <small>Admin Management Console</small>
          </Link>
        </div>

        {/* SOCIAL MEDIA CHANNELS IN MOBILE QUICK DRAWER */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
            Follow Pleasant View Schools
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href={settings.social_facebook || 'https://www.facebook.com/PleasantViewSchools98'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', textDecoration: 'none' }} title="Facebook">
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a href={settings.social_instagram || 'https://www.instagram.com/pleasant_view_schools?mdxt=MWM2eDZvZGxhOTBlZA=='} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', textDecoration: 'none' }} title="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href={settings.social_youtube || 'https://youtube.com/@pleasantviewschools?si=ot3wZjmIo517hyZm'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', textDecoration: 'none' }} title="YouTube">
              <i className="fa-brands fa-youtube" />
            </a>
            <a href={settings.social_twitter || 'https://x.com/pleasantview_ke'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', textDecoration: 'none' }} title="X / Twitter">
              <i className="fa-brands fa-x-twitter" />
            </a>
            <a href={settings.social_tiktok || 'https://tiktok.com/@pleasantviewschools'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', textDecoration: 'none' }} title="TikTok">
              <i className="fa-brands fa-tiktok" />
            </a>
            <a href={settings.social_linkedin || 'https://linkedin.com/company/pleasantview-schools'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', textDecoration: 'none' }} title="LinkedIn">
              <i className="fa-brands fa-linkedin-in" />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', textDecoration: 'none' }} title="WhatsApp">
              <i className="fa-brands fa-whatsapp" />
            </a>
          </div>
        </div>
      </div>

      {/* SCHOOLS BOTTOM DRAWER */}
      <div className={`mobile-bottom-drawer ${openDrawer === 'schools' ? 'open' : ''}`}>
        <div className="drawer-handle" />
        <div className="drawer-header">
          <h4><i className="fa-solid fa-graduation-cap" style={{ color: 'var(--gold-accent)' }} /> Schools</h4>
          <button type="button" onClick={closeDrawer} className="drawer-close-btn">&times;</button>
        </div>
        <div className="drawer-grid">
          {schools.map(s => (
            <Link
              key={s.id}
              href={`/s/${s.slug}`}
              onClick={closeDrawer}
              className="drawer-item"
              style={{ borderLeftColor: s.color || 'var(--primary-navy)' }}
            >
              <div className="drawer-item-title">{s.name}</div>
              <small>{s.category} &bull; {s.level}</small>
              {s.location && (
                <small style={{ display: 'block', color: 'var(--primary-red)', marginTop: '2px', fontWeight: 600 }}>
                  <i className="fa-solid fa-location-dot" style={{ marginRight: '4px' }} />
                  {s.location}
                </small>
              )}
            </Link>
          ))}
          <Link
            href="/about"
            onClick={closeDrawer}
            className="drawer-item"
          >
            <div className="drawer-item-title">Why Pleasant View Schools</div>
            <small>{years} Years of Existence, KPSEA, KJSEA &amp; CBE</small>
          </Link>
        </div>
      </div>

      {/* FIXED MOBILE BOTTOM BAR */}
      <nav className="mobile-bottom-bar" aria-label="Quick mobile navigation">
        <Link href="/" className="m-bar-btn" title="Home">
          <i className="fa-solid fa-house" />
          <span>Home</span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="m-bar-btn"
          title="Chat on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }} />
          <span>WhatsApp</span>
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="m-bar-btn"
          title="Google Maps Campus Directions"
        >
          <i className="fa-solid fa-location-dot" style={{ color: '#fda4af' }} />
          <span>Visit/Map</span>
        </a>

        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="m-bar-btn" title="Call Pleasant View Desk">
          <i className="fa-solid fa-phone" />
          <span>Call</span>
        </a>

        <button
          type="button"
          onClick={() => toggleDrawer('quick')}
          className={`m-bar-btn ${openDrawer === 'quick' ? 'active' : ''}`}
          title="Open Quick Links"
        >
          <i className="fa-solid fa-bolt" />
          <span>Quick Links</span>
        </button>

        <button
          type="button"
          onClick={() => toggleDrawer('schools')}
          className={`m-bar-btn ${openDrawer === 'schools' ? 'active' : ''}`}
          title="Browse Schools"
        >
          <i className="fa-solid fa-graduation-cap" />
          <span>Schools</span>
        </button>
      </nav>
    </>
  );
}
