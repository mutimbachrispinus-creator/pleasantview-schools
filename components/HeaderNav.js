'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderNav({
  schools = [],
  settings = {},
  quickLinks = [],
  adminPath = '/staff-portal'
}) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const phone = settings.phone || '+254 711 689 913';
  const mapsUrl = settings.maps_url || 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5';
  const whatsappUrl = settings.whatsapp_url || 'https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20would%20like%20to%20inquire%20about%20admissions.';

  // Sticky header background transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenAccordion(null);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleAccordion = (name) => {
    setOpenAccordion(prev => (prev === name ? null : name));
  };

  return (
    <>
      <nav className={`main-nav ${isScrolled ? 'scrolled' : ''}`} id="mainNav" aria-label="Main Navigation">
        <div className="wrapper">
          {/* THE OFFICIAL CREST LOGO (Occupies Proud Space like St Andrew's Turi) */}
          <Link href="/" className="brand-logo" title="Pleasant View Schools - Our Aim is Victory">
            <div className="brand-crest-container">
              <img
                src="/images/pvs_crest.png"
                alt="Pleasant View Schools Official Crest"
                className="brand-crest-img"
              />
            </div>
            {/* TEXT BRANDING FOR SCREEN READERS AND EXPANDED CONTEXT */}
            <div className="brand-text header-brand-text">
              <h1>PLEASANT VIEW SCHOOLS</h1>
              <small>OUR AIM IS VICTORY &bull; EST. 1998</small>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION COLUMN (DECONGESTED & ELEGANT) */}
          <div className="nav-column desktop-only-nav">
            {/* TOP UTILITY MICRO-BAR */}
            <div className="top-nav">
              <ul>
                <li>
                  <Link href="/about#academics" className="top-honors-chip" title="View CBE & KPSEA Distinction Reports">
                    <i className="fa-solid fa-award" />
                    <span>Academic Honors</span>
                  </Link>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-wa-link"
                    title="Admissions WhatsApp: 0711 689 913"
                  >
                    <i className="fa-brands fa-whatsapp" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-maps-link"
                    title="Google Maps Campus Directions"
                  >
                    <i className="fa-solid fa-location-dot" /> Directions
                  </a>
                </li>
                <li>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="top-phone-link">
                    <i className="fa-solid fa-phone" /> {phone}
                  </a>
                </li>
                <li>
                  <Link href={adminPath} className="top-portal-link">
                    <i className="fa-solid fa-user-shield" /> Staff Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* BOTTOM MAIN MENU (DECONGESTED 6-ITEM LUXURY NAVIGATION) */}
            <div className="bottom-nav">
              <ul>
                {/* 1. ABOUT US */}
                <li className="has-dropdown">
                  <Link href="/about">About Us <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    <li><Link href="/about">About Pleasant View</Link></li>
                    <li><Link href="/about#vision">Vision, Mission &amp; Values</Link></li>
                    <li><Link href="/about#legacy">24-Year Academic Legacy</Link></li>
                    <li><Link href="/about#academics">Curriculum &amp; Assessment Honors</Link></li>
                    <li><Link href="/about#christian">Christian Ethos &amp; Faith</Link></li>
                    <li><Link href="/about#leadership">Leadership &amp; Governance</Link></li>
                    <li><Link href="/about#policies">Policies &amp; Safeguarding</Link></li>
                  </ul>
                </li>

                {/* 2. ACADEMIC DIVISIONS */}
                <li className="has-dropdown">
                  <Link href="/#schools">Divisions <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    {schools.length > 0 ? (
                      schools.map(s => {
                        const cleanName = String(s.name || '').replace(/pleasantview/gi, 'Pleasant View');
                        const cleanLevel = String(s.level || s.category || '').replace(/CBC/g, 'CBE').replace(/pleasantview/gi, 'Pleasant View');
                        return (
                          <li key={s.id}>
                            <Link href={`/s/${s.slug}`}>
                              <strong>{cleanName}</strong>
                              <span style={{ display: 'block', fontSize: '11px', color: '#888' }}>{cleanLevel}</span>
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      <>
                        <li><Link href="/s/pleasantview-senior">Pleasant View Senior School</Link></li>
                        <li><Link href="/s/pleasantview-jss">Pleasant View Junior Secondary</Link></li>
                        <li><Link href="/s/pleasantview-primary">Pleasant View Primary School</Link></li>
                        <li><Link href="/s/pleasantview-early-learning">Pleasant View Early Learning Centre</Link></li>
                      </>
                    )}
                  </ul>
                </li>

                {/* 3. SCHOOL LIFE */}
                <li className="has-dropdown">
                  <Link href="/about#life">School Life <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    <li><Link href="/about#boarding">Pastoral Boarding Life (Grade 4+)</Link></li>
                    <li><Link href="/about#transport">Safe School Transport Fleet</Link></li>
                    <li><Link href="/quick-links/sports-fixtures">Sports Fixtures &amp; Athletics</Link></li>
                    <li><Link href="/quick-links/term-dates">Term Dates &amp; VISOs</Link></li>
                    <li><Link href="/about#sports">Co-Curricular Clubs &amp; Arts</Link></li>
                    <li><Link href="/news">Campus News &amp; Events</Link></li>
                  </ul>
                </li>

                {/* 4. ADMISSIONS */}
                <li className="has-dropdown">
                  <Link href="/contact">Admissions <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    <li><Link href="/contact">How to Apply</Link></li>
                    <li><Link href="/contact#visit">Book Campus Tour</Link></li>
                    <li><Link href="/about#academics">Curriculum &amp; Assessment Reports</Link></li>
                    <li><Link href="/quick-links/term-dates">Academic Term Dates</Link></li>
                    <li><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Campus Map &amp; Directions</a></li>
                  </ul>
                </li>

                {/* 5. QUICK LINKS */}
                <li className="has-dropdown">
                  <Link href="/quick-links">Quick Links <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    {quickLinks.slice(0, 5).map(l => (
                      <li key={l.id}><Link href={l.url}>{l.title}</Link></li>
                    ))}
                    <li><Link href="/careers">Careers &amp; Vacancies</Link></li>
                    <li><Link href="/careers#tenders">Tenders and Bids</Link></li>
                  </ul>
                </li>

                {/* 6. CONTACT */}
                <li>
                  <Link href="/contact">Contact</Link>
                </li>

                {/* PROMINENT GOLD CTA BUTTON */}
                <li className="nav-cta-item">
                  <Link href="/contact#visit" className="button button-gold nav-cta-btn">
                    <i className="fa-regular fa-calendar-check" style={{ marginRight: '6px' }} />
                    Book Campus Tour
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* MOBILE FAST ACTIONS & HAMBURGER BUTTON (MOBILE ONLY) */}
          <div className="mobile-header-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-quick-wa"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp" />
            </a>

            <button
              type="button"
              className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="bar bar-1" />
              <span className="bar bar-2" />
              <span className="bar bar-3" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE COLLAPSIBLE DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MOBILE SLIDING ANIMATED DRAWER */}
      <aside className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation Menu">
        {/* DRAWER TOP BAR */}
        <div className="drawer-top">
          <div className="drawer-brand">
            <img
              src="/images/pvs_crest.png"
              alt="Pleasant View Schools Crest"
              className="drawer-crest"
            />
            <div>
              <h3>PLEASANT VIEW</h3>
              <small>OUR AIM IS VICTORY &bull; EST. 1998</small>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-icon"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* DRAWER MENU ACCORDIONS */}
        <div className="drawer-scroll-body">
          <div className="drawer-section">
            <Link href="/" className="drawer-direct-link" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-house" /> Home
            </Link>
          </div>

          {/* ACCORDION: ACADEMIC DIVISIONS */}
          <div className="drawer-accordion">
            <button
              type="button"
              className={`accordion-trigger ${openAccordion === 'divisions' ? 'active' : ''}`}
              onClick={() => toggleAccordion('divisions')}
            >
              <span><i className="fa-solid fa-graduation-cap" style={{ color: 'var(--gold-accent)', marginRight: '10px' }} /> Academic Divisions</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'divisions' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'divisions' ? 'expanded' : ''}`}>
              {schools.map(s => (
                <Link
                  key={s.id}
                  href={`/s/${s.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="accordion-item"
                >
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>
                    {String(s.name || '').replace(/pleasantview/gi, 'Pleasant View')}
                  </div>
                  <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11.5px' }}>
                    {s.category} &bull; {String(s.level || '').replace(/CBC/g, 'CBE').replace(/pleasantview/gi, 'Pleasant View')}
                  </small>
                </Link>
              ))}
            </div>
          </div>

          {/* ACCORDION: ABOUT PLEASANT VIEW */}
          <div className="drawer-accordion">
            <button
              type="button"
              className={`accordion-trigger ${openAccordion === 'about' ? 'active' : ''}`}
              onClick={() => toggleAccordion('about')}
            >
              <span><i className="fa-solid fa-landmark" style={{ color: 'var(--gold-accent)', marginRight: '10px' }} /> About Pleasant View</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'about' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'about' ? 'expanded' : ''}`}>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                About Pleasant View Schools
              </Link>
              <Link href="/about#vision" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Vision, Mission &amp; Values
              </Link>
              <Link href="/about#legacy" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                24-Year Academic Eminence
              </Link>
              <Link href="/about#christian" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Christian Ethos &amp; Mentorship
              </Link>
              <Link href="/about#leadership" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Executive Leadership
              </Link>
              <Link href="/about#policies" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Child Safeguarding &amp; Policies
              </Link>
            </div>
          </div>

          {/* ACCORDION: SCHOOL LIFE */}
          <div className="drawer-accordion">
            <button
              type="button"
              className={`accordion-trigger ${openAccordion === 'life' ? 'active' : ''}`}
              onClick={() => toggleAccordion('life')}
            >
              <span><i className="fa-solid fa-futbol" style={{ color: 'var(--gold-accent)', marginRight: '10px' }} /> School Life</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'life' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'life' ? 'expanded' : ''}`}>
              <Link href="/about#boarding" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Pastoral Boarding Life (Grade 4+)
              </Link>
              <Link href="/about#transport" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Safe School Transport Fleet
              </Link>
              <Link href="/quick-links/sports-fixtures" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Sports Fixtures &amp; Athletics
              </Link>
              <Link href="/quick-links/term-dates" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Term Dates &amp; VISOs
              </Link>
              <Link href="/about#sports" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Co-Curricular Clubs &amp; Arts
              </Link>
            </div>
          </div>

          {/* ACCORDION: ADMISSIONS */}
          <div className="drawer-accordion">
            <button
              type="button"
              className={`accordion-trigger ${openAccordion === 'admissions' ? 'active' : ''}`}
              onClick={() => toggleAccordion('admissions')}
            >
              <span><i className="fa-solid fa-file-signature" style={{ color: 'var(--gold-accent)', marginRight: '10px' }} /> Admissions &amp; Tours</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'admissions' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'admissions' ? 'expanded' : ''}`}>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                How to Apply
              </Link>
              <Link href="/contact#visit" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Book a Walking Campus Tour
              </Link>
              <Link href="/about#academics" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Assessment Report (KPSEA, KJSEA, Senior)
              </Link>
              <Link href="/contact#fees" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Fee Guidelines &amp; Desk
              </Link>
            </div>
          </div>

          {/* ACCORDION: QUICK LINKS */}
          <div className="drawer-accordion">
            <button
              type="button"
              className={`accordion-trigger ${openAccordion === 'quick' ? 'active' : ''}`}
              onClick={() => toggleAccordion('quick')}
            >
              <span><i className="fa-solid fa-bolt" style={{ color: 'var(--gold-accent)', marginRight: '10px' }} /> Quick Links &amp; Portals</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'quick' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'quick' ? 'expanded' : ''}`}>
              {quickLinks.map(l => (
                <Link key={l.id} href={l.url} onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                  {l.title}
                </Link>
              ))}
              <Link href="/careers" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Working at Pleasant View
              </Link>
              <Link href="/careers#tenders" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Tenders and Bids
              </Link>
              <Link href={adminPath} onClick={() => setMobileMenuOpen(false)} className="accordion-item" style={{ color: 'var(--gold-accent)' }}>
                Staff &amp; Admin Portal
              </Link>
            </div>
          </div>

          {/* CONTACT DIRECT LINK */}
          <div className="drawer-section">
            <Link href="/contact" className="drawer-direct-link" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-envelope" /> Contact Admissions Desk
            </Link>
          </div>

          {/* HIGH-CONVERSION MOBILE DRAWER ACTION BUTTONS */}
          <div className="drawer-actions">
            <Link
              href="/contact#visit"
              className="button button-gold"
              onClick={() => setMobileMenuOpen(false)}
              style={{ width: '100%', padding: '13px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px' }}
            >
              <i className="fa-regular fa-calendar-check" /> Book Campus Tour
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
              style={{ width: '100%', padding: '13px', textAlign: 'center', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700 }}
            >
              <i className="fa-brands fa-whatsapp" /> Chat on WhatsApp
            </a>

            <Link
              href="/contact#admin-sms"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'block', textAlign: 'center', color: 'var(--gold-accent)', fontSize: '12.5px', marginTop: '10px', textDecoration: 'none', fontWeight: 600 }}
            >
              <i className="fa-solid fa-comment-sms" style={{ marginRight: '6px' }} />
              Send Direct SMS to Administrator
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
