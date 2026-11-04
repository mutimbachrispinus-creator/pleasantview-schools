import Page from '@/components/Page';

export const metadata = {
  title: 'Privacy Policy (Kenya Data Protection Act 2019)',
  description: 'Official Pleasant View Schools Privacy Policy. Comprehensive data protection, pupil confidentiality, and compliance with the Kenya Data Protection Act 2019 (ODPC).'
};

export default function PrivacyPolicyPage() {
  return (
    <Page
      title="Privacy Policy"
      subtitle="LEGAL & DATA COMPLIANCE"
      image="/images/banner_3_a.webp"
    >
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '10px 0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <i className="fa-solid fa-user-shield" style={{ fontSize: '26px', color: 'var(--primary-red)' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--primary-red)' }}>
            ODPC &amp; KDPA 2019 COMPLIANT
          </span>
        </div>

        <h2 style={{ fontSize: '32px', color: '#1E232A', marginBottom: '20px', fontFamily: 'Cinzel, serif' }}>
          Pleasant View Schools Privacy Policy
        </h2>

        <div className="gold-divider" style={{ marginLeft: 0, marginBottom: '25px' }} />

        <p style={{ fontSize: '16.5px', lineHeight: 1.85, color: '#444', marginBottom: '25px' }}>
          Pleasant View Schools (&ldquo;the Institution&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is deeply committed to upholding the privacy, dignity, and constitutional rights of our pupils, parents, guardians, faculty, and website visitors. This policy explains our data processing standards in strict adherence to the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and the regulatory directives established by the <strong>Office of the Data Protection Commissioner (ODPC)</strong>.
        </p>

        {/* SECTION 1 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            1. Personal Data We Collect
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '14px' }}>
            To deliver outstanding educational, pastoral, and boarding care, the school collects information strictly necessary for legitimate institutional functions:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li><strong>Pupil Information:</strong> Full legal name, date of birth, birth certificate number, National Education Management Information System (NEMIS) / Unique Personal Identifier (UPI), passport photos, medical and dietary notes, academic evaluations, and attendance records.</li>
            <li><strong>Parent &amp; Guardian Information:</strong> Full names, national identification or passport numbers, primary phone numbers, email addresses, physical and residential locations, and student fee payment records.</li>
            <li><strong>Digital Platform Interactions:</strong> IP addresses, browser cookies, device metadata, and inquiry details submitted through our admissions portals and campus tour reservation desks.</li>
          </ul>
        </section>

        {/* SECTION 2 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            2. Purpose &amp; Lawful Basis of Processing
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '12px' }}>
            Personal information collected is processed exclusively on the following lawful grounds:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li><strong>Educational Delivery:</strong> Administering classroom learning, national assessment registrations (KPSEA, KJSEA, KCSE, KSSEA), and co-curricular enrichment.</li>
            <li><strong>Child Health &amp; Safety:</strong> Managing school sanatorium records, dietary allergies, and emergency medical response.</li>
            <li><strong>Statutory Compliance:</strong> Mandatory reporting to the Ministry of Education, Kenya National Examinations Council (KNEC), and educational regulatory authorities.</li>
            <li><strong>Institutional Communication:</strong> Dispatching urgent SMS alerts, fee statements, academic reports, and campus announcements to verified parent contacts.</li>
          </ul>
        </section>

        {/* SECTION 3 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            3. Strict Data Confidentiality &amp; Third-Party Transfers
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '12px' }}>
            <strong>We never sell, rent, lease, or monetize learner or family personal data.</strong> Information is disclosed strictly to:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li>Statutory educational bodies (Ministry of Education, KNEC, KICD) under official Kenyan legal mandate.</li>
            <li>Designated emergency medical personnel during unforeseen health events.</li>
            <li>Secure, encrypted communication gateways (licensed telecommunication SMS gateways) governed by strict data protection confidentiality agreements.</li>
          </ul>
        </section>

        {/* SECTION 4 */}
        <section style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-red)', marginBottom: '12px' }}>
            4. Parental &amp; Data Subject Rights
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '12px' }}>
            Under Section 26 of the Kenya Data Protection Act, parents, guardians, and adult learners are entitled to:
          </p>
          <ul style={{ lineHeight: 1.85, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
            <li>Request access to all educational and personal records maintained by the school.</li>
            <li>Request prompt rectification of incorrect or outdated contact, residential, or medical details.</li>
            <li>Object to or withdraw consent for non-statutory photographic publishing at any time.</li>
            <li>Lodge data protection inquiries directly with the school administration or the Office of the Data Protection Commissioner (ODPC).</li>
          </ul>
        </section>

        {/* SECTION 5 */}
        <section style={{ background: 'var(--soft-bg)', border: '1px solid #dde2ec', borderRadius: '8px', padding: '30px', margin: '25px 0' }}>
          <h3 style={{ fontSize: '20px', color: '#1E232A', marginBottom: '12px' }}>
            5. Contact the Data Protection Officer (DPO)
          </h3>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '15px' }}>
            For questions, data access requests, or privacy concerns, please contact the Pleasant View Schools Central Administration:
          </p>
          <div style={{ fontSize: '14.5px', lineHeight: 1.8, color: '#333' }}>
            <strong>Office:</strong> Data Protection Officer &bull; Pleasant View Schools<br />
            <strong>Physical Address:</strong> Githunguri, Komothai Subcounty, Kiambu County, Kenya<br />
            <strong>Official Email:</strong> <a href="mailto:admin@pleasantviewschools.co.ke" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>admin@pleasantviewschools.co.ke</a><br />
            <strong>Telephone:</strong> <a href="tel:+254711689913" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>+254 711 689 913</a>
          </div>
        </section>
      </div>
    </Page>
  );
}
