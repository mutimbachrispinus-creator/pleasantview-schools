import Page from '@/components/Page';
import Link from 'next/link';
import { S, getExamResults } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Our Heritage, Mission & Academic Eminence' };

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
          <ul style={{ margin: '8px 0 12px 18px', padding: 0, fontSize: '14.5px', color: '#444', lineHeight: 1.7 }}>
            <li><strong>Respect</strong></li>
            <li><strong>Integrity</strong></li>
            <li><strong>Empathy</strong></li>
            <li><strong>Excellence</strong></li>
            <li><strong>Accountability</strong></li>
            <li><strong>Co-operation</strong></li>
            <li><strong>Critical thinking</strong></li>
            <li><strong>Appreciation</strong></li>
          </ul>
          <p style={{ fontSize: '14px', color: '#666', margin: 0, fontStyle: 'italic' }}>
            Motto: &ldquo;{s.motto || 'Our Aim is Victory'}&rdquo;
          </p>
        </div>
      </div>

      {/* 24 YEARS OF ACADEMIC EMINENCE */}
      <h3 id="legacy" style={{ marginTop: '45px', marginBottom: '15px' }}>24 Years of Academic Eminence</h3>
      <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
        Across our 24-year academic journey, Pleasant View has consistently maintained distinguished scholastic performance, achieving an institutional average of <strong>EE (Exceeding Expectations)</strong> in KPSEA and <strong>ME1 (Meeting Expectations &ndash; Top Tier)</strong> in KJSEA, positioning our scholars permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic maiden mean grade of <strong>B+</strong> in KCSE examinations. As the 8-4-4 system concludes at the end of next year, our Senior School is dynamically transitioning into the <strong>Kenya Senior School Education Assessment (KSSEA)</strong>.
      </p>

      {/* CBE TRANSITION & STEM */}
      <h3 id="cbc" style={{ marginTop: '45px', marginBottom: '15px' }}>Competency Based Education (CBE Pathways &amp; STEM)</h3>
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
