import './globals.css';
import Link from 'next/link';
import { schools } from '@/lib/db';

export const metadata = {
  title: {
    default: 'Pleasantview Schools | Seeking the Highest',
    template: '%s | Pleasantview Schools'
  },
  description: 'Pleasantview Schools - A premier Christian-ethos family of day and boarding schools offering Competency Based Curriculum (CBC) and 8.4.4 in Githunguri, Kiambu County.',
};

export default async function RootLayout({ children }) {
  let schList = [];
  try {
    schList = await schools();
  } catch (e) {
    schList = [];
  }

  const phone = process.env.SCHOOL_PHONE || '+254 711 689 913';
  const email = process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke';
  const adminPath = process.env.ADMIN_PATH ? `/${process.env.ADMIN_PATH}` : '/hidden-admin';

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
      </head>
      <body>
        {/* MAIN NAVIGATION (Exact St Andrew's Turi Match) */}
        <nav className="main-nav" id="mainNav">
          <div className="wrapper">
            <Link href="/" className="brand-logo">
              <div className="brand-crest">PV</div>
              <div className="brand-text">
                <h1>PLEASANTVIEW</h1>
                <small>Seeking the Highest &bull; Est. 1998</small>
              </div>
            </Link>

            <div className="nav-column">
              <div className="top-nav">
                <ul>
                  <li>
                    <Link href="/about#academics" style={{ color: 'var(--gold-accent)', fontWeight: 700, letterSpacing: '0.5px' }}>
                      KCSE &amp; CBC Inspection Report
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" style={{ color: '#ffffff', fontWeight: 600 }}>
                      <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '6px' }}></i> Search
                    </Link>
                  </li>
                  <li><a href={`tel:${phone}`}><i className="fa-solid fa-phone"></i> {phone}</a></li>
                  <li><Link href={adminPath} style={{ color: 'var(--gold-accent)' }}><i className="fa-solid fa-user-shield"></i> Staff Portal</Link></li>
                </ul>
              </div>

              <div className="bottom-nav">
                <ul>
                  <li>
                    <Link href="/about">About</Link>
                    <ul className="sub-menu">
                      <li><Link href="/about">About Pleasantview</Link></li>
                      <li><Link href="/about#vision">Vision, Mission & Values</Link></li>
                      <li><Link href="/about#legacy">24-Year Academic Legacy</Link></li>
                      <li><Link href="/about#christian">Christian Ethos</Link></li>
                    </ul>
                  </li>
                  <li><Link href="/about#why-pleasantview">Why Pleasantview</Link></li>
                  <li><Link href="/s/pleasantview-early-learning">Early Learning</Link></li>
                  <li><Link href="/s/pleasantview-primary">Primary School</Link></li>
                  <li><Link href="/s/pleasantview-jss">Junior Secondary</Link></li>
                  <li><Link href="/s/pleasantview-senior">Senior School</Link></li>
                  <li>
                    <Link href="/about#life">School Life</Link>
                    <ul className="sub-menu">
                      <li><Link href="/about#boarding">Boarding Life (Grade 4+)</Link></li>
                      <li><Link href="/about#transport">School Transport Fleet</Link></li>
                      <li><Link href="/about#sports">Sports & Co-Curricular</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/contact">Admissions</Link>
                    <ul className="sub-menu">
                      <li><Link href="/contact">Apply for Admission</Link></li>
                      <li><Link href="/contact#visit">Book Campus Tour</Link></li>
                    </ul>
                  </li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* ROTATED HERO SIDE BUTTONS (ST ANDREW'S TURI SIGNATURE - Exact Order & Styling) */}
        <div className="hero-buttons">
          <Link className="hero-button dark-blue" href="/contact#visit" title="Book a Campus Visit">
            <i className="fa-solid fa-location-dot"></i> VISIT
          </Link>
          <Link className="hero-button light-blue" href="/contact" title="Contact Us">
            <i className="fa-regular fa-envelope"></i> CONTACT
          </Link>
        </div>

        {/* FLOATING ACCESSIBILITY BUTTON (Exact St Andrew's Turi) */}
        <button
          type="button"
          className="accessibility-floating-btn"
          aria-label="Accessibility options"
          title="Accessibility options"
        >
          <i className="fa-solid fa-universal-access"></i>
        </button>

        {children}

        {/* FOOTER (Exact St Andrew's Turi Styling) */}
        <footer>
          <div className="wrapper">
            <div className="footer-col logo">
              <Link href="/" className="brand-logo" style={{ color: 'var(--primary-navy)' }}>
                <div className="brand-crest">PV</div>
                <div className="brand-text">
                  <h1 style={{ color: 'var(--primary-navy)' }}>PLEASANTVIEW</h1>
                  <small style={{ color: 'var(--gold-dark)' }}>A Tradition of Excellence</small>
                </div>
              </Link>
              <p style={{ marginTop: '18px' }}>
                A leading Christian-ethos group of day and boarding schools offering Competency Based Curriculum (CBC) and 8.4.4. Founded in 1998 in Githunguri, Komothai Subcounty, Kiambu County.
              </p>
              <div className="footer-socials">
                <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
              </div>
            </div>

            <div className="footer-col contact">
              <h5 className="column-title">Contact Us</h5>
              <p>
                Pleasantview Schools Main Campus<br />
                Githunguri, Komothai Subcounty<br />
                P.O. Box, Kiambu County, Kenya<br /><br />
                <strong>Admissions Desk:</strong><br />
                {phone}<br /><br />
                <strong>Email:</strong><br />
                {email}
              </p>
            </div>

            <div className="footer-col links">
              <h5 className="column-title">Our Schools</h5>
              <ul>
                {schList.map(s => (
                  <li key={s.id}><Link href={`/s/${s.slug}`}>{s.name} ({s.category || 'School'})</Link></li>
                ))}
                <li><Link href="/about">About Our 24-Year History</Link></li>
                <li><Link href="/news">Latest News & Notices</Link></li>
                <li><Link href={adminPath}>Staff Portal</Link></li>
              </ul>
            </div>

            <div className="footer-col top">
              <a href="#" className="top-scroll-btn">
                <i className="fa-solid fa-arrow-up-long"></i>
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
              <li><Link href={adminPath}>Staff Portal</Link></li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}
