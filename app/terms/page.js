import Page from '@/components/Page';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Terms of Service & Institutional Governance',
  description: 'Official Terms of Service, Child Safeguarding Protocols, and Digital Portal Governance at Pleasant View Schools in Githunguri, Kiambu County.'
};

export default function TermsPage() {
  return (
    <Page
      title="Terms of Service"
      subtitle="INSTITUTIONAL GOVERNANCE"
      image="/images/banner_3_a.webp"
    >
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '10px 0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <i className="fa-solid fa-file-contract" style={{ fontSize: '26px', color: 'var(--primary-red)' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--primary-red)' }}>
            INSTITUTIONAL TERMS &amp; SAFEGUARDING
          </span>
        </div>

        <h2 style={{ fontSize: '32px', color: '#1E232A', marginBottom: '20px', fontFamily: 'Cinzel, serif' }}>
          Pleasant View Schools Terms of Service
        </h2>

        <div className="gold-divider" style={{ marginLeft: 0, marginBottom: '25px' }} />

        <p style={{ fontSize: '16.5px', lineHeight: 1.85, color: '#444', marginBottom: '25px' }}>
          Welcome to Pleasant View Schools (&ldquo;the Institution&rdquo;). By accessing our web portals, enrolling a child, or submitting applications and tour bookings, you agree to comply with the terms and safeguarding regulations set forth herein.
        </p>

        {/* SECTION 1 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            1. Child Safeguarding &amp; Media Protocol
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '12px' }}>
            In strict compliance with the <strong>Children Act of Kenya</strong>, Ministry of Education guidelines, and international child safeguarding standards:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li>Photographic and videographic documentation of campus activities, sports tournaments, and scholastic achievements is strictly monitored by designated school staff.</li>
            <li>Images of scholars are published solely with prior written consent obtained from parents or guardians during admission.</li>
            <li>Learners are identified strictly by first name and grade level; full home addresses, national identity details, or sensitive records are never published.</li>
            <li>Any third-party reproduction, unauthorized capture, or commercial redistribution of school media featuring learners is strictly prohibited and subject to legal action.</li>
          </ul>
        </section>

        {/* SECTION 2 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            2. Portal Security &amp; Acceptable Use
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '12px' }}>
            Authorized staff, teachers, and parents accessing school management systems must maintain strict confidentiality of administrative credentials:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li>Administrative passwords, two-factor OTP codes, and login tokens must not be shared or recorded on public workstations.</li>
            <li>Automated data scraping, vulnerability probing, denial-of-service attempts, or unauthorized access to backend databases is strictly illegal under the <strong>Computer Misuse and Cybercrimes Act, 2018</strong>.</li>
            <li>The institution maintains comprehensive access audit logs for all administrative sessions to safeguard student records.</li>
          </ul>
        </section>

        {/* SECTION 3 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            3. Admissions &amp; Official Fee Policies
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '12px' }}>
            Official notices regarding curriculum, academic calendars, and school regulations:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li>Published term dates, assessment schedules (KPSEA, KJSEA, Senior School), and fee circulars represent authorized policy approved by the Board of Directors.</li>
            <li>Student admission confirmations remain provisional until physical verification of authentic birth certificates, prior assessment transcripts, and medical clearance certificates.</li>
            <li>Fee payments must be remitted exclusively to official bank accounts or authorized M-Pesa Paybill credentials issued directly on official school letterhead.</li>
          </ul>
        </section>

        {/* SECTION 4 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            4. Intellectual Property &amp; Brand Marks
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', margin: 0 }}>
            The official 3D crest emblem, the motto &ldquo;Our Aim is Victory&rdquo;, institutional trademarks, uniform designs, and published educational curricula are the exclusive intellectual property of Pleasant View Schools. Unauthorized commercial exploitation is strictly prohibited.
          </p>
        </section>

        {/* SECTION 5 */}
        <section style={{ background: 'var(--soft-bg)', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0' }}>
          <h3 style={{ fontSize: '20px', color: '#1E232A', marginBottom: '12px' }}>
            5. Governing Law &amp; Legal Inquiries
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '15px' }}>
            These terms are governed by and construed in accordance with the laws of the Republic of Kenya. For institutional governance inquiries, contact:
          </p>
          <div style={{ fontSize: '14.5px', lineHeight: 1.8, color: '#333' }}>
            <strong>Executive Office:</strong> Legal &amp; Governance &bull; Pleasant View Schools<br />
            <strong>Official Email:</strong> <a href="mailto:admin@pleasantviewschools.co.ke" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>admin@pleasantviewschools.co.ke</a><br />
            <strong>Telephone:</strong> <a href="tel:+254711689913" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>+254 711 689 913</a>
          </div>
        </section>
      </div>
    </Page>
  );
}
