import Page from '@/components/Page';
import Link from 'next/link';
import { S, getExamResults } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Our Heritage, Mission, Academic Results & Policies' };

export default async function About() {
  const [s, examResults] = await Promise.all([
    S(),
    getExamResults()
  ]);

  const nationalExams = examResults.filter(e => e.exam_category === 'national');
  const internalExams = examResults.filter(e => e.exam_category === 'internal');

  return (
    <Page
      title="About Pleasant View Schools"
      subtitle="OUR HERITAGE & VISION"
      image="/images/banner_3_a.webp"
    >
      <span className="lead-badge" id="why-pleasantview">OUR FOUNDATION</span>
      <h2>A Legacy of Educational Eminence</h2>
      <div className="gold-divider" style={{ marginLeft: 0 }} />

      <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '25px', color: '#333' }}>
        Founded in 1998, Pleasant View Schools has grown from a visionary primary institution into one of the most respected private Christian-ethos day and boarding school networks in Kenya. Situated amidst the scenic, peaceful highlands of Githunguri, Komothai Subcounty, Kiambu County, our campuses provide a serene sanctuary where learners thrive intellectually, spiritually, and socially.
      </p>

      <div style={{ background: 'var(--soft-bg)', padding: '30px', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)', margin: '30px 0' }}>
        <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#444', margin: 0 }}>
          {s.about}
        </p>
      </div>

      {/* VISION, MISSION & VALUES */}
      <h3 id="vision" style={{ marginTop: '45px', marginBottom: '15px' }}>Vision, Mission &amp; Core Values</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '20px 0 35px' }}>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)' }}>
          <h4 style={{ color: 'var(--primary-navy)', marginBottom: '8px' }}>Our Vision</h4>
          <p style={{ fontSize: '15px', color: '#555', margin: 0 }}>{s.vision}</p>
        </div>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '6px', borderLeft: '4px solid var(--medium-blue)' }}>
          <h4 style={{ color: 'var(--medium-blue)', marginBottom: '8px' }}>Our Mission</h4>
          <p style={{ fontSize: '15px', color: '#555', margin: 0 }}>{s.mission}</p>
        </div>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
          <h4 style={{ color: 'var(--gold-dark)', marginBottom: '8px' }}>Core Values &amp; Motto</h4>
          <p style={{ fontSize: '15px', color: '#555', margin: 0 }}>{s.values} &mdash; <em>&ldquo;{s.motto || 'Our Aim is Victory'}&rdquo;</em></p>
        </div>
      </div>

      {/* 24 YEARS OF ACADEMIC EMINENCE */}
      <h3 id="legacy" style={{ marginTop: '45px', marginBottom: '15px' }}>24 Years of Academic Eminence</h3>
      <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
        Across our 24-year academic journey, Pleasant View has consistently maintained distinguished scholastic performance, achieving an institutional average of <strong>EE (Exceeding Expectations)</strong> in KPSEA and <strong>ME1 (Meeting Expectations &ndash; Top Tier)</strong> in KJSEA, positioning our scholars permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic maiden mean grade of <strong>B+</strong> in KCSE examinations. As the 8-4-4 system concludes at the end of next year, our Senior School is dynamically transitioning into the <strong>Kenya Senior School Education Assessment (KSSEA)</strong>.
      </p>

      {/* CBC / CBE TRANSITION & STEM */}
      <h3 id="cbc" style={{ marginTop: '45px', marginBottom: '15px' }}>Transition to Competency Based Curriculum (CBC / CBE)</h3>
      <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
        Pleasant View has seamlessly pioneered Kenya’s Competency Based Education framework across Early Years, Primary, and Junior Secondary (JSS) levels. With fully equipped Pre-Technical, Integrated Science, Agriculture, and Digital STEM hubs, our learners transition from theoretical rote memorization into real-world innovation, scientific inquiry, and ethical problem solving.
      </p>

      {/* CHRISTIAN ETHOS */}
      <h3 id="christian" style={{ marginTop: '45px', marginBottom: '15px' }}>Christian Ethos &amp; Spiritual Life</h3>
      <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
        We are firmly grounded in Christian principles. Morning devotions, weekly pastoral mentoring, and Sunday chapel services cultivate spiritual maturity, compassion, humility, and servant leadership. We welcome pupils of diverse backgrounds, instilling biblical values that guide their moral compass throughout life.
      </p>

      {/* GROUNDS & ACCOMMODATION */}
      <h3 id="grounds-accommodation" style={{ marginTop: '45px', marginBottom: '15px' }}>Grounds, Boarding &amp; Modern Accommodation</h3>
      <div id="boarding">
        <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
          Spread across scenic, serene acreage in Githunguri, Pleasant View offers modern boarding dormitories from Grade 4 upwards. Resident houseparents, dedicated matrons, 24/7 security, hot water showers, and nutritious dining ensure every child feels secure, comfortable, and cherished in a home-away-from-home setting.
        </p>
      </div>

      {/* POLICIES & INSPECTION REPORTS */}
      <h3 id="policies" style={{ marginTop: '45px', marginBottom: '15px' }}>School Policies, Inspection Reports &amp; Safeguarding</h3>
      <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '24px', margin: '20px 0 35px' }}>
        <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.7, margin: '0 0 15px' }}>
          Pleasant View maintains strict adherence to Ministry of Education guidelines and international best practices for child safeguarding, health, sanitation, and data protection.
        </p>
        <ul style={{ lineHeight: 2, color: '#444', paddingLeft: '20px' }}>
          <li><i className="fa-solid fa-file-pdf" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} /> <strong>Ministry Quality Assurance &amp; Standards Report:</strong> Rated Exemplary</li>
          <li><i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary-navy)', marginRight: '8px' }} /> <strong>Child Safeguarding &amp; Anti-Bullying Charter:</strong> Zero tolerance policy</li>
          <li><i className="fa-solid fa-notes-medical" style={{ color: '#28a745', marginRight: '8px' }} /> <strong>Health &amp; Sanatorium Protocol:</strong> Resident nurse and certified clinic</li>
        </ul>
      </div>

      {/* DYNAMIC ACADEMIC EXAM RESULTS (NATIONAL & IN-SCHOOL) */}
      <div id="academics" style={{ marginTop: '50px', marginBottom: '40px' }}>
        <span className="lead-badge">EXCELLENCE IN ASSESSMENTS</span>
        <h3 style={{ fontSize: '26px', margin: '8px 0 16px', color: 'var(--primary-navy)' }}>
          Academic Assessment &amp; Examination Distinctions
        </h3>
        <p style={{ lineHeight: 1.8, fontSize: '15.5px', color: '#555', marginBottom: '24px' }}>
          Pleasant View Schools maintains exemplary assessment benchmarks managed directly by our academic administration. Below are the verified results for both external national examinations (KPSEA, KJSEA, Senior KCSE) and our continuous in-school formative evaluations.
        </p>

        {/* NATIONAL EXTERNAL EXAMS */}
        <h4 style={{ fontSize: '19px', color: 'var(--primary-red)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-award" /> National External Examination Distinctions
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          {nationalExams.map(ex => (
            <div
              key={ex.id}
              style={{
                background: '#ffffff',
                borderRadius: '8px',
                padding: '24px',
                border: '1px solid #dde2ec',
                borderTop: '4px solid var(--primary-red)',
                boxShadow: '0 4px 18px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', background: 'rgba(139,30,45,0.08)', color: 'var(--primary-red)', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {ex.school_name}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#777' }}>
                  {ex.academic_year}
                </span>
              </div>
              <h4 style={{ fontSize: '18px', color: 'var(--primary-navy)', margin: '0 0 10px' }}>{ex.exam_name}</h4>
              <div style={{ background: 'var(--soft-bg)', padding: '12px 14px', borderRadius: '6px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13.5px', color: '#555' }}>Mean Score / Grade:</span>
                <strong style={{ fontSize: '16px', color: 'var(--primary-red)' }}>{ex.mean_grade}</strong>
              </div>
              {ex.cohort_size && (
                <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px' }}>
                  <i className="fa-solid fa-users" style={{ marginRight: '6px', color: 'var(--medium-blue)' }} />
                  <strong>Cohort:</strong> {ex.cohort_size}
                </p>
              )}
              {ex.performance_breakdown && (
                <p style={{ fontSize: '13.5px', color: '#444', lineHeight: 1.5, margin: '0 0 8px' }}>
                  <strong>Performance:</strong> {ex.performance_breakdown}
                </p>
              )}
              {ex.top_subjects && (
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 8px' }}>
                  <strong>Subject Distinctions:</strong> {ex.top_subjects}
                </p>
              )}
              {ex.summary_notes && (
                <p style={{ fontSize: '12.5px', color: '#777', fontStyle: 'italic', margin: '10px 0 0', paddingTop: '8px', borderTop: '1px dashed #e1e7f0' }}>
                  {ex.summary_notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* IN-SCHOOL INTERNAL ASSESSMENTS */}
        {internalExams.length > 0 && (
          <>
            <h4 style={{ fontSize: '19px', color: 'var(--primary-navy)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-square-check" /> Internal Continuous Assessments &amp; Mock Series
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '35px' }}>
              {internalExams.map(ex => (
                <div
                  key={ex.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #dde2ec',
                    borderTop: '4px solid var(--primary-navy)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(5,40,107,0.08)', color: 'var(--primary-navy)', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {ex.school_name}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#777' }}>
                      {ex.academic_year}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '18px', color: 'var(--primary-navy)', margin: '0 0 10px' }}>{ex.exam_name}</h4>
                  <div style={{ background: 'var(--soft-bg)', padding: '12px 14px', borderRadius: '6px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', color: '#555' }}>Internal Benchmark:</span>
                    <strong style={{ fontSize: '15px', color: 'var(--primary-navy)' }}>{ex.mean_grade}</strong>
                  </div>
                  {ex.performance_breakdown && (
                    <p style={{ fontSize: '13.5px', color: '#444', lineHeight: 1.5, margin: '0 0 8px' }}>
                      <strong>Evaluation:</strong> {ex.performance_breakdown}
                    </p>
                  )}
                  {ex.top_subjects && (
                    <p style={{ fontSize: '13px', color: '#555', margin: '0 0 8px' }}>
                      <strong>Key Competencies:</strong> {ex.top_subjects}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* PRIVACY POLICY (KDPA 2019 / ODPC COMPLIANT) */}
      <section id="privacy" style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '35px', margin: '40px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <i className="fa-solid fa-user-shield" style={{ fontSize: '24px', color: 'var(--primary-navy)' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
            LEGAL &amp; COMPLIANCE
          </span>
        </div>
        <h3 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '16px' }}>
          Privacy Policy (Kenya Data Protection Act 2019)
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
          Pleasant View Schools (&ldquo;the Institution&rdquo;) is committed to protecting the privacy, dignity, and rights of our learners, parents, guardians, faculty, and website visitors. This Privacy Policy details how we collect, process, safeguard, and manage personal data in strict compliance with the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and guidelines established by the <strong>Office of the Data Protection Commissioner (ODPC)</strong>.
        </p>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>1. Personal Data We Collect</h4>
        <ul style={{ lineHeight: 1.8, color: '#555', paddingLeft: '22px', fontSize: '14.5px' }}>
          <li><strong>Pupil Information:</strong> Full name, date of birth, birth certificate number, National Education Management Information System (NEMIS) / Unique Personal Identifier (UPI), medical notes, academic evaluations, and attendance records.</li>
          <li><strong>Parent / Guardian Data:</strong> Names, national identification/passport numbers, telephone contacts, email addresses, residential locations, and billing details.</li>
          <li><strong>Digital Platform Interactions:</strong> IP addresses, browser cookies, and inquiry messages submitted through our digital admissions portals.</li>
        </ul>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>2. Purpose &amp; Lawful Basis of Processing</h4>
        <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555', margin: '0 0 10px' }}>
          Data is processed solely for lawful educational purposes, including administering admissions, delivering curriculum assessments, tracking child health/sanatorium care, statutory reporting to the Ministry of Education and KNEC, dispatching emergency parent alerts, and ensuring campus security.
        </p>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>3. Data Sharing &amp; Third Parties</h4>
        <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555', margin: '0 0 10px' }}>
          We never sell, rent, or lease learner or family personal information. Data is disclosed only to authorized educational authorities (Ministry of Education, KNEC, KICD), emergency medical facilities, and secure institutional communication gateways (e.g. telecom SMS providers for parent alerts) under strict data protection covenants.
        </p>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>4. Parental &amp; Data Subject Rights</h4>
        <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555', margin: '0 0 10px' }}>
          Under the KDPA 2019, parents and guardians hold the right to inspect personal data held by the school, request corrections of inaccuracies, withdraw photographic consent, or lodge inquiries with our designated Data Protection Officer via <a href="mailto:privacy@pleasantview.sc.ke" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>privacy@pleasantview.sc.ke</a>.
        </p>
      </section>

      {/* DATA PROTECTION POLICY & TERMS OF SERVICE */}
      <section id="terms" style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '35px', margin: '40px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <i className="fa-solid fa-file-contract" style={{ fontSize: '24px', color: 'var(--primary-red)' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--primary-red)' }}>
            INSTITUTIONAL GOVERNANCE
          </span>
        </div>
        <h3 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '16px' }}>
          Data Protection Policy &amp; Terms of Service
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
          By accessing Pleasant View Schools&apos; website, digital portals, or submitting campus inquiry forms, you agree to abide by these institutional terms and our child-first safeguarding protocols.
        </p>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>1. Child Safeguarding &amp; Media Consent</h4>
        <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555', margin: '0 0 10px' }}>
          In accordance with the Children Act (Kenya) and global safeguarding standards, photography and video documentation of school events, sports galas, and classroom achievements are strictly regulated. Photographs of enrolled scholars are published solely with explicit parental consent obtained during admission, with learners identifiable only by first name and academic grade.
        </p>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>2. Portal Security &amp; Acceptable Use</h4>
        <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555', margin: '0 0 10px' }}>
          Staff, faculty, and parents accessing school administrative accounts must maintain credential confidentiality. Automated scraping, malicious probing, or unauthorized modification of school database systems is strictly prohibited and subject to legal prosecution under the Computer Misuse and Cybercrimes Act, 2018.
        </p>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>3. Academic &amp; Fee Policy Notices</h4>
        <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555', margin: '0 0 10px' }}>
          Published term dates, fee structures, and curriculum notices represent official institutional policy approved by the Board of Directors. Admission confirmations remain conditional upon verification of legitimate primary academic transcripts and medical clearance certificates.
        </p>
      </section>

      {/* COOKIE POLICY */}
      <section id="cookies" style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '35px', margin: '40px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <i className="fa-solid fa-cookie-bite" style={{ fontSize: '24px', color: 'var(--gold-dark)' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
            DIGITAL TRANSPARENCY
          </span>
        </div>
        <h3 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '16px' }}>
          Cookie Policy &amp; Tracking Consent
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
          Pleasant View Schools uses small text files called cookies to guarantee secure authentication, remember your interface preferences, and optimize system speed for thousands of simultaneous campus visitors.
        </p>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>Types of Cookies We Deploy</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '15px 0 20px' }}>
          <div style={{ padding: '18px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)' }}>
            <strong style={{ display: 'block', color: 'var(--primary-navy)', marginBottom: '6px', fontSize: '15px' }}>1. Strictly Essential Cookies</strong>
            <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
              Required for the administrative portal session validation, CSRF protection, and secure form submissions. These cannot be disabled.
            </p>
          </div>
          <div style={{ padding: '18px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
            <strong style={{ display: 'block', color: 'var(--gold-dark)', marginBottom: '6px', fontSize: '15px' }}>2. Preference &amp; Consent Cookies</strong>
            <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
              Stores your cookie consent preferences and accessibility settings (contrast, text size) across browsing sessions.
            </p>
          </div>
          <div style={{ padding: '18px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '4px solid var(--primary-red)' }}>
            <strong style={{ display: 'block', color: 'var(--primary-red)', marginBottom: '6px', fontSize: '15px' }}>3. Anonymous Performance Metrics</strong>
            <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
              Aggregated, privacy-respecting page load metrics to help our technical staff maintain server stability and fast page rendering during peak admission cycles.
            </p>
          </div>
        </div>

        <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '20px 0 10px' }}>Managing Your Cookie Preferences</h4>
        <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555', margin: 0 }}>
          You can modify or withdraw your cookie consent at any time by clearing your browser cache or choosing &ldquo;Essential Only&rdquo; on our interactive consent banner. For inquiries regarding cookie protocols, contact <a href="mailto:it@pleasantview.sc.ke" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>it@pleasantview.sc.ke</a>.
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link href="/contact#visit" className="button button-secondary">
          Book a Guided Campus Tour
        </Link>
        <Link href="/contact" className="button button-gold" style={{ marginLeft: '15px' }}>
          Contact Admissions Desk
        </Link>
      </div>
    </Page>
  );
}
