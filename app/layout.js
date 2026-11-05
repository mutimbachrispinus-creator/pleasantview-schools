import './globals.css';
import Link from 'next/link';
import { schools, S, getQuickLinks } from '@/lib/db';
import HeaderNav from '@/components/HeaderNav';
import HeroButtons from '@/components/HeroButtons';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import MobileBottomBar from '@/components/MobileBottomBar';
import CookieConsent from '@/components/CookieConsent';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: {
    default: 'PLEASANT VIEW SCHOOLS | OUR AIM IS VICTORY',
    template: '%s | PLEASANT VIEW SCHOOLS'
  },
  description: 'Pleasant View Schools — Our Aim is Victory. Leading Christian Day and Boarding Schools in Githunguri, Kiambu County.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico?v=20261105', sizes: 'any' },
      { url: '/icon.png?v=20261105', sizes: '192x192', type: 'image/png' },
      { url: '/images/pwa_icon_512.png?v=20261105', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=20261105', sizes: '180x180', type: 'image/png' }
    ]
  }
};

export const viewport = {
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
  const email = settings.email || process.env.SCHOOL_EMAIL || 'info@pleasantviewschools.co.ke';
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
        <link rel="manifest" href="/manifest.json" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico?v=20261105" sizes="any" />
        <link rel="icon" href="/icon.png?v=20261105" type="image/png" sizes="192x192" />
        <link rel="icon" href="/images/pwa_icon_512.png?v=20261105" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20261105" sizes="180x180" />
        <link rel="apple-touch-icon" href="/images/pwa_icon_192.png?v=20261105" />
        <meta name="theme-color" content="#8B1E2D" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {/* MAIN NAVIGATION (St Andrew's Turi Styling with Dynamic Animated Hamburger Drawer) */}
        <HeaderNav
          schools={schList}
          settings={settings}
          quickLinks={quickLinks}
          adminPath={adminPath}
        />

        {/* ROTATED HERO SIDE BUTTONS (ST ANDREW'S TURI SIGNATURE - School Red & Grey) */}
        <HeroButtons mapsUrl={mapsUrl} />

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
                    src="/images/pvs_crest.png?v=20261105"
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
                A leading Christian-ethos group of day and boarding schools offering Competency Based Education (CBE) and senior academic pathways. Founded in 1998 in Githunguri, Komothai Subcounty, Kiambu County.
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
                <strong>Pleasant View Schools Main Campus</strong><br />
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
                <li><Link href="/careers">Working at Pleasant View</Link></li>
                <li><Link href={adminPath}>Staff Portal</Link></li>
              </ul>
            </div>

            <div className="footer-col links">
              <h5 className="column-title">Our Campuses</h5>
              <ul>
                {schList.map(s => {
                  const cleanName = String(s.name || '').replace(/pleasantview/gi, 'Pleasant View');
                  const cleanCat = String(s.category || 'School').replace(/CBC/g, 'CBE');
                  return (
                    <li key={s.id}>
                      <Link href={`/s/${s.slug}`}>{cleanName} ({cleanCat})</Link>
                    </li>
                  );
                })}
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
              &copy; {new Date().getFullYear()} Pleasant View Schools. All Rights Reserved. &ldquo;Our Aim is Victory&rdquo;
            </div>
            <ul className="copyright-links">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Data Protection</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
              <li><Link href="/quick-links/term-dates">Term Dates &amp; VISOs</Link></li>
              <li><Link href={adminPath}>Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* PWA INSTALL PROMPT BANNER */}
        <PwaInstallPrompt />

        {/* COOKIE CONSENT BANNER */}
        <CookieConsent />

        {/* TURI-STYLE WORDS SCROLL REVEAL */}
        <ScrollReveal />

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <MobileBottomBar
          phone={phone}
          mapsUrl={mapsUrl}
          whatsappUrl={whatsappUrl}
          schools={schList}
          quickLinks={quickLinks}
          settings={settings}
        />
      </body>
    </html>
  );
}
