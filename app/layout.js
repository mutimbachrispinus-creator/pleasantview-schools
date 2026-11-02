import './globals.css';
import Link from 'next/link';
import { schools, S, getQuickLinks } from '@/lib/db';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import MobileBottomBar from '@/components/MobileBottomBar';

export const metadata = {
  title: {
    default: 'PLEASANT VIEW SCHOOLS | OUR AIM IS VICTORY',
    template: '%s | PLEASANT VIEW SCHOOLS'
  },
  description: 'Pleasant View Schools — Our Aim is Victory. Leading Christian Day and Boarding Schools in Githunguri, Kiambu County.',
  manifest: '/manifest.json',
  themeColor: '#8B1E2D'
};

export default async function RootLayout({ children }) {
  let schList = [];
  let settings = {};
  let quickLinks = [];

  try {
    const [sc, st, ql] = await Promise.all([schools(), S(), getQuickLinks()]);
    schList = sc || [];
    settings = st || {};
    quickLinks = ql || [];
  } catch (e) {
    schList = [];
    settings = {};
    quickLinks = [];
  }

  const phone = settings.phone || process.env.SCHOOL_PHONE || '+254 711 689 913';
  const email = settings.email || process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke';
  const mapsUrl = settings.maps_url || 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5';
  const whatsappUrl = settings.whatsapp_url || 'https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20would%20like%20to%20inquire%20about%20admissions.';
  const adminPath = '/staff-portal';

  const socials = [
    { icon: 'fa-brands fa-whatsapp', url: whatsappUrl, label: 'WhatsApp (+254 711 689 913)' },
    { icon: 'fa-brands fa-facebook-f', url: settings.social_facebook || 'https://www.facebook.com/PleasantViewSchools98', label: 'Facebook' },
    { icon: 'fa-brands fa-instagram', url: settings.social_instagram || 'https://www.instagram.com/pleasant_view_schools?mdxt=MWM2eDZvZGxhOTBlZA==', label: 'Instagram' },
    { icon: 'fa-brands fa-youtube', url: settings.social_youtube || 'https://youtube.com/@pleasantviewschools?si=ot3wZjmIo517hyZm', label: 'YouTube' },
    { icon: 'fa-brands fa-x-twitter', url: settings.social_twitter || 'https://x.com/pleasantview_ke', label: 'Twitter/X' },
    { icon: 'fa-brands fa-linkedin-in', url: settings.social_linkedin || 'https://linkedin.com/company/pleasantview-schools', label: 'LinkedIn' },
    { icon: 'fa-brands fa-tiktok', url: settings.social_tiktok || 'https://tiktok.com/@pleasantviewschools', label: 'TikTok' }
  ].filter(s => Boolean(s.url));

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8B1E2D" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/images/pwa_icon_192.png" />
      </head>
      <body>
        {/* MAIN NAVIGATION (Exact St Andrew's Turi Match with Rich Dropdowns) */}
        <nav className="main-nav" id="mainNav">
          <div className="wrapper">
            <Link href="/" className="brand-logo" title="Pleasant View Schools - Return to Homepage">
              <div className="brand-crest-container">
                <img
                  src="/images/pvs_crest.png"
                  alt="Pleasant View Schools Official Crest"
                  className="brand-crest-img"
                />
              </div>
              <div className="brand-text">
                <h1>PLEASANT VIEW SCHOOLS</h1>
                <small>OUR AIM IS VICTORY &bull; Est. 1998</small>
              </div>
            </Link>

            <div className="nav-column">
              <div className="top-nav">
                <ul>
                  <li>
                    <Link href="/" style={{ color: '#ffffff', fontWeight: 600 }}>
                      <i className="fa-solid fa-house" style={{ marginRight: '6px' }} /> Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about#academics" style={{ color: 'var(--gold-accent)', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Assessment Report (KPSEA, KJSEA, Senior)
                    </Link>
                  </li>
                  <li>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#25D366', fontWeight: 700 }}
                      title="Chat with Admissions on WhatsApp (0711 689 913)"
                    >
                      <i className="fa-brands fa-whatsapp" style={{ marginRight: '6px', fontSize: '15px' }} /> WhatsApp
                    </a>
                  </li>
                  <li>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#ffffff', fontWeight: 600 }}
                      title="Google Maps Campus Directions"
                    >
                      <i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: 'var(--gold-accent)' }} /> Directions &amp; Map
                    </a>
                  </li>
                  <li>
                    <Link href="/news" style={{ color: '#ffffff', fontWeight: 600 }}>
                      <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '6px' }} /> Search
                    </Link>
                  </li>
                  <li>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`}>
                      <i className="fa-solid fa-phone" /> {phone}
                    </a>
                  </li>
                  <li>
                    <Link href={adminPath} style={{ color: 'var(--gold-accent)', fontWeight: 700 }}>
                      <i className="fa-solid fa-user-shield" /> Staff Portal
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bottom-nav">
                <ul>
                  {/* ABOUT */}
                  <li className="has-dropdown">
                    <Link href="/about">About</Link>
                    <ul className="sub-menu">
                      <li><Link href="/about">About Pleasantview</Link></li>
                      <li><Link href="/about#vision">Vision, Mission &amp; Values</Link></li>
                      <li><Link href="/about#legacy">24-Year Academic Legacy</Link></li>
                      <li><Link href="/about#christian">Christian Ethos &amp; Faith</Link></li>
                      <li><Link href="/about#leadership">Leadership &amp; Governance</Link></li>
                      <li><Link href="/about#policies">Policies &amp; Safeguarding</Link></li>
                    </ul>
                  </li>

                  {/* WHY PLEASANTVIEW */}
                  <li className="has-dropdown">
                    <Link href="/about#why-pleasantview">Why Pleasantview</Link>
                    <ul className="sub-menu">
                      <li><Link href="/about#why-pleasantview">Why Choose Pleasantview</Link></li>
                      <li><Link href="/about#legacy">Academic Eminence (390+ Mean)</Link></li>
                      <li><Link href="/about#cbc">CBC / CBE Practical Pathways</Link></li>
                      <li><Link href="/about#stem">Modern Science &amp; STEM Labs</Link></li>
                      <li><Link href="/about#boarding">Pastoral Boarding Care</Link></li>
                      <li><Link href="/about#transport">Safe School Transport Fleet</Link></li>
                    </ul>
                  </li>

                  {/* EARLY LEARNING */}
                  <li className="has-dropdown">
                    <Link href="/s/pleasantview-early-learning">Early Learning</Link>
                    <ul className="sub-menu">
                      <li><Link href="/s/pleasantview-early-learning">Early Learning Overview</Link></li>
                      <li><Link href="/s/pleasantview-early-learning/about">Playgroup &amp; Day Care</Link></li>
                      <li><Link href="/s/pleasantview-early-learning/academics">PP1 &amp; PP2 Foundation</Link></li>
                      <li><Link href="/s/pleasantview-early-learning/gallery">Playgrounds &amp; Facilities</Link></li>
                      <li><Link href="/s/pleasantview-early-learning/contact">Apply for Early Learning</Link></li>
                    </ul>
                  </li>

                  {/* PRIMARY SCHOOL */}
                  <li className="has-dropdown">
                    <Link href="/s/pleasantview-primary">Primary School</Link>
                    <ul className="sub-menu">
                      <li><Link href="/s/pleasantview-primary">Primary School Overview</Link></li>
                      <li><Link href="/s/pleasantview-primary/academics">CBC Grades 1 &ndash; 6 Curriculum</Link></li>
                      <li><Link href="/s/pleasantview-primary/about">Boarding Life (Grade 4+)</Link></li>
                      <li><Link href="/s/pleasantview-primary/gallery">Co-Curricular &amp; Sports</Link></li>
                      <li><Link href="/s/pleasantview-primary/contact">Apply for Primary School</Link></li>
                    </ul>
                  </li>

                  {/* JUNIOR SECONDARY */}
                  <li className="has-dropdown">
                    <Link href="/s/pleasantview-jss">Junior Secondary</Link>
                    <ul className="sub-menu">
                      <li><Link href="/s/pleasantview-jss">Junior Secondary Overview</Link></li>
                      <li><Link href="/s/pleasantview-jss/academics">Grades 7 &ndash; 9 (KJSEA Ready)</Link></li>
                      <li><Link href="/s/pleasantview-jss/about">Pre-Technical &amp; Science Labs</Link></li>
                      <li><Link href="/s/pleasantview-jss/gallery">Talent &amp; Digital Innovation</Link></li>
                      <li><Link href="/s/pleasantview-jss/contact">Apply for Junior Secondary</Link></li>
                    </ul>
                  </li>

                  {/* SENIOR SCHOOL */}
                  <li className="has-dropdown">
                    <Link href="/s/pleasantview-senior">Senior School</Link>
                    <ul className="sub-menu">
                      <li><Link href="/s/pleasantview-senior">Senior School Overview</Link></li>
                      <li><Link href="/s/pleasantview-senior/academics">Grades 10 &ndash; 12 (KCSE &amp; Senior CBC)</Link></li>
                      <li><Link href="/s/pleasantview-senior/about">Maiden KCSE B+ University Feats</Link></li>
                      <li><Link href="/s/pleasantview-senior/gallery">Advanced Science Laboratories</Link></li>
                      <li><Link href="/s/pleasantview-senior/contact">Apply for Senior School</Link></li>
                    </ul>
                  </li>

                  {/* SCHOOL LIFE */}
                  <li className="has-dropdown">
                    <Link href="/about#life">School Life</Link>
                    <ul className="sub-menu">
                      <li><Link href="/about#boarding">Boarding Life (Grade 4+)</Link></li>
                      <li><Link href="/about#transport">School Transport Fleet</Link></li>
                      <li><Link href="/quick-links/sports-fixtures">Sports Fixtures &amp; Athletics</Link></li>
                      <li><Link href="/quick-links/term-dates">Term Dates &amp; VISOs</Link></li>
                      <li><Link href="/about#sports">Co-Curricular Clubs &amp; Arts</Link></li>
                    </ul>
                  </li>

                  {/* ADMISSIONS */}
                  <li className="has-dropdown">
                    <Link href="/contact">Admissions</Link>
                    <ul className="sub-menu">
                      <li><Link href="/contact">How to Apply</Link></li>
                      <li><Link href="/contact#visit">Book Campus Tour</Link></li>
                      <li><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Campus Map &amp; Directions</a></li>
                      <li><Link href="/quick-links/term-dates">Academic Term Dates</Link></li>
                      <li><Link href="/contact#fees">Fee Guidelines &amp; Desk</Link></li>
                    </ul>
                  </li>

                  {/* QUICK LINKS */}
                  <li className="has-dropdown">
                    <Link href="/quick-links">Quick Links</Link>
                    <ul className="sub-menu">
                      {quickLinks.map(l => (
                        <li key={l.id}><Link href={l.url}>{l.title}</Link></li>
                      ))}
                      <li><Link href="/careers#tenders">Tenders and Bids</Link></li>
                    </ul>
                  </li>

                  {/* CAREERS */}
                  <li className="has-dropdown">
                    <Link href="/careers">Careers</Link>
                    <ul className="sub-menu">
                      <li><Link href="/careers">Working at Pleasantview</Link></li>
                      <li><Link href="/careers#vacancies">Open Teaching Vacancies</Link></li>
                      <li><Link href="/careers#apply">Submit CV / Job Application</Link></li>
                      <li><Link href="/careers#tenders">Tenders and Bids</Link></li>
                    </ul>
                  </li>

                  {/* CONTACT */}
                  <li className="has-dropdown">
                    <Link href="/contact">Contact</Link>
                    <ul className="sub-menu">
                      <li><Link href="/contact">Contact Main Campus</Link></li>
                      <li><Link href="/contact#visit">Book Walking Tour</Link></li>
                      <li><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps Directions</a></li>
                      <li><Link href="/staff-portal">Staff &amp; Admin Portal</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* ROTATED HERO SIDE BUTTONS (ST ANDREW'S TURI SIGNATURE - School Red & Grey) */}
        <div className="hero-buttons">
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

        {/* FLOATING ACCESSIBILITY BUTTON */}
        <button
          type="button"
          className="accessibility-floating-btn"
          aria-label="Accessibility options"
          title="Accessibility options"
        >
          <i className="fa-solid fa-universal-access" />
        </button>

        {/* FLOATING WHATSAPP BUTTON */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp-btn"
          aria-label="Chat with Pleasant View Schools on WhatsApp"
          title="Chat on WhatsApp (0711 689 913)"
        >
          <i className="fa-brands fa-whatsapp" />
        </a>

        {children}

        {/* FOOTER (Exact St Andrew's Turi Styling & Pleasant View Branding) */}
        <footer>
          <div className="wrapper">
            <div className="footer-col logo">
              <Link href="/" className="brand-logo" style={{ color: 'var(--primary-navy)' }}>
                <div className="brand-crest-container">
                  <img
                    src="/images/pvs_crest.png"
                    alt="Pleasant View Schools Official Crest"
                    className="brand-crest-img"
                  />
                </div>
                <div className="brand-text">
                  <h1 style={{ color: 'var(--primary-navy)' }}>PLEASANT VIEW SCHOOLS</h1>
                  <small style={{ color: 'var(--gold-accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>OUR AIM IS VICTORY &bull; Est. 1998</small>
                </div>
              </Link>
              <p style={{ marginTop: '18px' }}>
                A leading Christian-ethos group of day and boarding schools offering Competency Based Curriculum (CBC) and 8.4.4. Founded in 1998 in Githunguri, Komothai Subcounty, Kiambu County.
              </p>
              <div className="footer-socials">
                {socials.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    aria-label={s.label}
                  >
                    <i className={s.icon} />
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col contact">
              <h5 className="column-title">Contact Us</h5>
              <p>
                <strong>Pleasantview Schools Main Campus</strong><br />
                Githunguri, Komothai Subcounty<br />
                Kiambu County, Kenya<br /><br />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gold-accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}
                >
                  <i className="fa-solid fa-location-dot" /> Open Google Maps Directions
                </a>
                <br /><br />
                <strong>Admissions Desk:</strong><br />
                <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a><br /><br />
                <strong>Email:</strong><br />
                <a href={`mailto:${email}`}>{email}</a>
              </p>
            </div>

            <div className="footer-col links">
              <h5 className="column-title">Quick Links</h5>
              <ul>
                {quickLinks.map(l => (
                  <li key={l.id}><Link href={l.url}>{l.title}</Link></li>
                ))}
                <li><Link href="/careers#tenders">Tenders and Bids</Link></li>
                <li><Link href="/careers">Working at Pleasantview</Link></li>
                <li><Link href={adminPath}>Staff Portal</Link></li>
              </ul>
            </div>

            <div className="footer-col links">
              <h5 className="column-title">Our Campuses</h5>
              <ul>
                {schList.map(s => (
                  <li key={s.id}><Link href={`/s/${s.slug}`}>{s.name} ({s.category || 'School'})</Link></li>
                ))}
                <li><Link href="/about#legacy">24-Year Academic Legacy</Link></li>
                <li><Link href="/news">Latest News &amp; Notices</Link></li>
                <li><Link href="/contact#visit">Book Campus Visit</Link></li>
              </ul>
            </div>

            <div className="footer-col top">
              <a href="#" className="top-scroll-btn" title="Back to top of page">
                <i className="fa-solid fa-arrow-up-long" />
                <span>Top</span>
              </a>
            </div>
          </div>
        </footer>

        {/* COPYRIGHT */}
        <div className="copyright-bar">
          <div className="wrapper">
            <div className="copy">
              &copy; {new Date().getFullYear()} Pleasantview Schools. All Rights Reserved. &ldquo;Our Aim is Victory&rdquo;
            </div>
            <ul className="copyright-links">
              <li><Link href="/about#privacy">Privacy Policy</Link></li>
              <li><Link href="/about#terms">Data Protection Policy</Link></li>
              <li><Link href="/quick-links/term-dates">Term Dates &amp; VISOs</Link></li>
              <li><Link href={adminPath}>Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* PWA INSTALL PROMPT BANNER */}
        <PwaInstallPrompt />

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <MobileBottomBar
          phone={phone}
          mapsUrl={mapsUrl}
          whatsappUrl={whatsappUrl}
          schools={schList}
          quickLinks={quickLinks}
        />
      </body>
    </html>
  );
}
