import Page from '@/components/Page';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Cookie Policy & Tracking Consent',
  description: 'Official Pleasant View Schools Cookie Policy. Technical details regarding strictly essential cookies, interface preferences, and privacy controls.'
};

export default function CookiePolicyPage() {
  return (
    <Page
      title="Cookie Policy"
      subtitle="DIGITAL TRANSPARENCY"
      image="/images/banner_3_a.webp"
    >
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '10px 0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <i className="fa-solid fa-cookie-bite" style={{ fontSize: '26px', color: 'var(--primary-red)' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--primary-red)' }}>
            DIGITAL PRIVACY &amp; TRANSPARENCY
          </span>
        </div>

        <h2 style={{ fontSize: '32px', color: '#1E232A', marginBottom: '20px', fontFamily: 'Cinzel, serif' }}>
          Cookie Policy &amp; Tracking Consent
        </h2>

        <div className="gold-divider" style={{ marginLeft: 0, marginBottom: '25px' }} />

        <p style={{ fontSize: '16.5px', lineHeight: 1.85, color: '#444', marginBottom: '25px' }}>
          Pleasant View Schools uses small text files called cookies to guarantee secure authentication, remember your interface preferences, and optimize system speed for thousands of simultaneous campus visitors.
        </p>

        {/* SECTION 1 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '14px' }}>
            Types of Cookies We Deploy
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '4px solid var(--primary-red)' }}>
              <strong style={{ display: 'block', color: 'var(--primary-red)', marginBottom: '8px', fontSize: '15px' }}>
                1. Strictly Essential Cookies
              </strong>
              <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                Required for administrative portal session validation, CSRF token verification, and secure form submissions. These cannot be disabled as the system cannot function securely without them.
              </p>
            </div>

            <div style={{ padding: '20px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '4px solid #1E232A' }}>
              <strong style={{ display: 'block', color: '#1E232A', marginBottom: '8px', fontSize: '15px' }}>
                2. Preference &amp; Accessibility Cookies
              </strong>
              <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                Stores your cookie consent choice, accessibility adjustments (such as contrast or font sizing), and user interface preferences across browser visits.
              </p>
            </div>

            <div style={{ padding: '20px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '4px solid var(--primary-red)' }}>
              <strong style={{ display: 'block', color: 'var(--primary-red)', marginBottom: '8px', fontSize: '15px' }}>
                3. Anonymous Performance Metrics
              </strong>
              <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                Aggregated, anonymized page load speed telemetry to assist our engineering team in maintaining server stability during heavy national exam result release periods.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            Managing Your Cookie Settings
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '14px' }}>
            You can modify, control, or delete cookies at any time via your browser settings:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li>Chrome: Settings &rarr; Privacy and security &rarr; Cookies and other site data.</li>
            <li>Safari: Preferences &rarr; Privacy &rarr; Manage Website Data.</li>
            <li>Firefox: Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data.</li>
          </ul>
        </section>

        {/* SECTION 3 */}
        <section style={{ background: 'var(--soft-bg)', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0' }}>
          <h3 style={{ fontSize: '20px', color: '#1E232A', marginBottom: '12px' }}>
            Technical Inquiries
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '15px' }}>
            For questions regarding cookie deployment or our data privacy policies, contact:
          </p>
          <div style={{ fontSize: '14.5px', lineHeight: 1.8, color: '#333' }}>
            <strong>Digital Services:</strong> Pleasant View Schools ICT &amp; Privacy Desk<br />
            <strong>Email:</strong> <a href="mailto:admin@pleasantviewschools.co.ke" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>admin@pleasantviewschools.co.ke</a>
          </div>
        </section>
      </div>
    </Page>
  );
}
