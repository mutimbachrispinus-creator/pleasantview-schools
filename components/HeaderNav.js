'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getYearsOfExistence } from '@/lib/heritage';

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
  const [years, setYears] = useState(() => getYearsOfExistence());

  useEffect(() => {
    const t = setInterval(() => setYears(getYearsOfExistence()), 60000);
    return () => clearInterval(t);
  }, []);

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
                src="/images/pvs_crest.png?v=20261107b"
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
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-quick-search'));
                      }
                    }}
                    className="top-search-link"
                    title="Quick Search & Resource Finder (Ctrl+K / ⌘K)"
                    aria-label="Quick Search"
                  >
                    <i className="fa-solid fa-magnifying-glass" />
                    <span>Search</span>
                    <kbd className="search-kbd">⌘K</kbd>
                  </button>
                </li>
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

            {/* BOTTOM MAIN MENU (DECONGESTED 7-ITEM LUXURY NAVIGATION) */}
            <div className="bottom-nav">
              <ul>
                {/* 1. ABOUT US */}
                <li className="has-dropdown">
                  <Link href="/about">About Us <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    <li><Link href="/about"><strong>About Pleasant View</strong></Link></li>
                    <li><Link href="/history">Our 28-Year History &amp; Heritage</Link></li>
                    <li><Link href="/leadership">Leadership &amp; Governance</Link></li>
                    <li><Link href="/about#vision">Vision, Mission &amp; Values</Link></li>
                    <li><Link href="/about#christian">Christian Ethos &amp; Mentorship</Link></li>
                    <li><Link href="/student-life">Student Life &amp; Pastoral Care</Link></li>
                    <li><Link href="/facilities">Campus Facilities &amp; Grounds</Link></li>
                    <li><Link href="/#parent-reviews">Parent Reviews &amp; Testimonials</Link></li>
                  </ul>
                </li>

                {/* 2. OUR SCHOOLS */}
                <li className="has-dropdown">
                  <Link href="/#schools">Our Schools <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    {schools.length > 0 ? (
                      schools.map(s => {
                        const cleanName = String(s.name || '').replace(/pleasantview/gi, 'Pleasant View');
                        const cleanLevel = String(s.level || s.category || '').replace(/CBC/g, 'CBE').replace(/pleasantview/gi, 'Pleasant View');
                        return (
                          <li key={s.id}>
                            <Link href={`/s/${s.slug}`}>
                              <strong>{cleanName}</strong>
                              <span style={{ display: 'block', fontSize: '11px', color: '#666' }}>
                                {cleanLevel}{s.location ? ` • ${s.location}` : ''}
                              </span>
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

                {/* 3. ACADEMICS */}
                <li className="has-dropdown">
                  <Link href="/academics">Academics <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    <li><Link href="/academics"><strong>Curriculum &amp; Academic Eminence</strong></Link></li>
                    <li><Link href="/s/pleasantview-jss">Junior Secondary (JSS) &amp; STEM</Link></li>
                    <li><Link href="/s/pleasantview-senior">Senior School &amp; KSSEA / KCSE</Link></li>
                    <li><Link href="/facilities#laboratories">Science Laboratories &amp; Robotics</Link></li>
                    <li><Link href="/academics#honors">National Examination Distinctions</Link></li>
                  </ul>
                </li>

                {/* 4. SCHOOL LIFE */}
                <li className="has-dropdown">
                  <Link href="/student-life">School Life <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    <li><Link href="/student-life"><strong>Student Life &amp; Pastoral Care</strong></Link></li>
                    <li><Link href="/facilities">Campus Grounds &amp; Facilities</Link></li>
                    <li><Link href="/co-curricular">Sports, Arts &amp; Co-Curricular</Link></li>
                    <li><Link href="/pictorial">School Pictorial &amp; Gallery</Link></li>
                    <li><Link href="/facilities#transport">Monitored Transport Fleet</Link></li>
                    <li><Link href="/quick-links/term-dates">Term Dates &amp; VISOs</Link></li>
                  </ul>
                </li>

                {/* 5. ADMISSIONS */}
                <li className="has-dropdown">
                  <Link href="/admissions">Admissions <i className="fa-solid fa-angle-down nav-arrow" /></Link>
                  <ul className="sub-menu">
                    <li><Link href="/admissions"><strong>Admissions Hub &amp; How to Apply</strong></Link></li>
                    <li><Link href="/admissions#requirements">Entry Requirements by Stage</Link></li>
                    <li><Link href={settings.fees_url || '/admissions#fees'}>Tuition &amp; Fee Schedule Guidelines</Link></li>
                    <li><Link href="/admissions#visit">Book a Walking Campus Tour</Link></li>
                    <li><Link href="/admissions#prospectus">Download Information Prospectus</Link></li>
                    <li><Link href="/admissions#faqs">Frequently Asked Questions</Link></li>
                  </ul>
                </li>

                {/* 6. ALUMNI */}
                <li>
                  <Link href="/alumni">Alumni</Link>
                </li>

                {/* 7. CONTACT */}
                <li>
                  <Link href="/contact">Contact</Link>
                </li>

                {/* PROMINENT GOLD CTA BUTTON */}
                <li className="nav-cta-item">
                  <Link href="/admissions#visit" className="button button-gold nav-cta-btn">
                    <i className="fa-regular fa-calendar-check" style={{ marginRight: '6px' }} />
                    Book Campus Tour
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* MOBILE FAST ACTIONS & HAMBURGER BUTTON (MOBILE ONLY) */}
          <div className="mobile-header-actions">
            <button
              type="button"
              className="mobile-quick-search"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-quick-search'));
                }
              }}
              title="Quick Search"
              aria-label="Search Pleasant View"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>

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
              src="/images/pvs_crest.png?v=20261107b"
              alt="Pleasant View Schools Crest"
              className="drawer-crest"
            />
            <div>
              <h3>PLEASANT VIEW SCHOOLS</h3>
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

          {/* ACCORDION: SCHOOLS */}
          <div className="drawer-accordion">
            <button
              type="button"
              className={`accordion-trigger ${openAccordion === 'divisions' ? 'active' : ''}`}
              onClick={() => toggleAccordion('divisions')}
            >
              <span><i className="fa-solid fa-graduation-cap" style={{ color: '#fda4af', marginRight: '10px' }} /> Schools</span>
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
                  <small style={{ color: 'rgba(255,255,255,0.82)', fontSize: '11.5px', display: 'block' }}>
                    {s.category} &bull; {String(s.level || '').replace(/CBC/g, 'CBE').replace(/pleasantview/gi, 'Pleasant View')}
                  </small>
                  {s.location && (
                    <small style={{ color: '#fda4af', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                      <i className="fa-solid fa-location-dot" style={{ marginRight: '4px' }} />
                      {s.location}
                    </small>
                  )}
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
              <span><i className="fa-solid fa-landmark" style={{ color: '#fda4af', marginRight: '10px' }} /> About Pleasant View</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'about' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'about' ? 'expanded' : ''}`}>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                About Pleasant View Schools
              </Link>
              <Link href="/history" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Our 28-Year History &amp; Heritage
              </Link>
              <Link href="/leadership" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Leadership &amp; Governance
              </Link>
              <Link href="/about#vision" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Vision, Mission &amp; Values
              </Link>
              <Link href="/about#christian" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Christian Ethos &amp; Mentorship
              </Link>
              <Link href="/student-life" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Student Life &amp; Pastoral Care
              </Link>
              <Link href="/facilities" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Campus Grounds &amp; Facilities
              </Link>
              <Link href="/alumni" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Alumni Success Stories
              </Link>
              <Link href="/#parent-reviews" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Parent Reviews &amp; Testimonials
              </Link>
            </div>
          </div>

          {/* ACCORDION: ACADEMICS */}
          <div className="drawer-accordion">
            <button
              type="button"
              className={`accordion-trigger ${openAccordion === 'academics' ? 'active' : ''}`}
              onClick={() => toggleAccordion('academics')}
            >
              <span><i className="fa-solid fa-book-open-reader" style={{ color: '#fda4af', marginRight: '10px' }} /> Academics</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'academics' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'academics' ? 'expanded' : ''}`}>
              <Link href="/academics" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Curriculum &amp; Academic Eminence
              </Link>
              <Link href="/s/pleasantview-jss" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Junior Secondary (JSS) &amp; STEM
              </Link>
              <Link href="/s/pleasantview-senior" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Senior School &amp; KSSEA / KCSE
              </Link>
              <Link href="/facilities#laboratories" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Science &amp; Robotics Laboratories
              </Link>
              <Link href="/academics#honors" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                National Examination Distinctions
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
              <span><i className="fa-solid fa-futbol" style={{ color: '#fda4af', marginRight: '10px' }} /> School Life</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'life' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'life' ? 'expanded' : ''}`}>
              <Link href="/student-life" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Student Life &amp; Pastoral Care
              </Link>
              <Link href="/facilities" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Campus Grounds &amp; Facilities
              </Link>
              <Link href="/co-curricular" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Sports, Arts &amp; Co-Curricular
              </Link>
              <Link href="/pictorial" onClick={() => setMobileMenuOpen(false)} className="accordion-item" style={{ fontWeight: 700, color: '#fda4af' }}>
                School Pictorial &amp; Gallery
              </Link>
              <Link href="/facilities#transport" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Monitored Transport Fleet
              </Link>
              <Link href="/quick-links/term-dates" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Term Dates &amp; VISOs
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
              <span><i className="fa-solid fa-file-signature" style={{ color: '#fda4af', marginRight: '10px' }} /> Admissions &amp; Tours</span>
              <i className={`fa-solid fa-chevron-down acc-icon ${openAccordion === 'admissions' ? 'rotated' : ''}`} />
            </button>
            <div className={`accordion-panel ${openAccordion === 'admissions' ? 'expanded' : ''}`}>
              <Link href="/admissions" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Admissions Hub &amp; How to Apply
              </Link>
              <Link href="/admissions#requirements" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Entry Requirements by Stage
              </Link>
              <Link href={settings.fees_url || '/admissions#fees'} onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                <i className="fa-solid fa-file-invoice-dollar" style={{ marginRight: '6px', color: 'var(--gold-accent)' }} />
                Tuition &amp; Fee Schedule Guidelines
              </Link>
              <Link href="/admissions#visit" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Book a Walking Campus Tour
              </Link>
              <Link href="/admissions#prospectus" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Download Information Prospectus
              </Link>
              <Link href="/admissions#faqs" onClick={() => setMobileMenuOpen(false)} className="accordion-item">
                Frequently Asked Questions
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
              <span><i className="fa-solid fa-bolt" style={{ color: '#fda4af', marginRight: '10px' }} /> Quick Links &amp; Portals</span>
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
              <Link href={adminPath} onClick={() => setMobileMenuOpen(false)} className="accordion-item" style={{ color: '#fda4af', fontWeight: 700 }}>
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
              style={{ display: 'block', textAlign: 'center', color: '#fda4af', fontSize: '12.5px', marginTop: '10px', textDecoration: 'none', fontWeight: 700 }}
            >
              <i className="fa-solid fa-comment-sms" style={{ marginRight: '6px' }} />
              Send Direct SMS to Administrator
            </Link>
          </div>

          {/* SOCIAL MEDIA CHANNELS IN MOBILE NAV DRAWER */}
          <div style={{ padding: '18px 20px 30px', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#14181E' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.85)', fontWeight: 800, display: 'block', marginBottom: '12px' }}>
              Follow Pleasant View Schools
            </span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={settings.social_facebook || 'https://www.facebook.com/PleasantViewSchools98'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '15px', textDecoration: 'none' }} title="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href={settings.social_instagram || 'https://www.instagram.com/pleasant_view_schools?mdxt=MWM2eDZvZGxhOTBlZA=='} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '15px', textDecoration: 'none' }} title="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href={settings.social_youtube || 'https://youtube.com/@pleasantviewschools?si=ot3wZjmIo517hyZm'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '15px', textDecoration: 'none' }} title="YouTube">
                <i className="fa-brands fa-youtube" />
              </a>
              <a href={settings.social_twitter || 'https://x.com/pleasantview_ke'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '15px', textDecoration: 'none' }} title="Twitter / X">
                <i className="fa-brands fa-x-twitter" />
              </a>
              <a href={settings.social_tiktok || 'https://tiktok.com/@pleasantviewschools'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '15px', textDecoration: 'none' }} title="TikTok">
                <i className="fa-brands fa-tiktok" />
              </a>
              <a href={settings.social_linkedin || 'https://linkedin.com/company/pleasantview-schools'} target="_blank" rel="noopener noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '15px', textDecoration: 'none' }} title="LinkedIn">
                <i className="fa-brands fa-linkedin-in" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
