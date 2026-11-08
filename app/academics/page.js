import Link from 'next/link';
import Page from '@/components/Page';
import AnimatedWordPlay from '@/components/AnimatedWordPlay';
import { schools, S, getExamResults, getSeniorAssessmentInfo, getYearsOfExistence } from '@/lib/db';

export const metadata = {
  title: 'Academics & CBE Curriculum Eminence | Pleasant View Schools',
  description: 'Discover the academic pathways, Competency Based Education (CBE) curriculum, Integrated Science laboratories, KPSEA & KJSEA honors, and Senior School KSSEA/KCSE transitions at Pleasant View Schools in Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function AcademicsPage() {
  const years = getYearsOfExistence();
  const seniorInfo = getSeniorAssessmentInfo();

  let schList = [];
  let examResults = [];
  let st = {};

  try {
    const [sc, er, s] = await Promise.all([schools(), getExamResults(), S()]);
    schList = sc || [];
    examResults = er || [];
    st = s || {};
  } catch (err) {
    schList = [];
    examResults = [];
    st = {};
  }

  const nationalExams = examResults.filter(e => e.exam_category === 'national');

  return (
    <Page
      title="Academics & Curriculum Eminence"
      subtitle="ACADEMIC EXCELLENCE & SCHOLARSHIP"
      image="/images/hero_library_learning.jpg"
    >
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">THE ACADEMIC STANDARD</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>
            Nurturing Critical Thinkers, Innovators &amp;{' '}
            <AnimatedWordPlay words={['Leaders', 'Scholars', 'Champions', 'Visionaries']} />
          </h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }} className="scroll-word-reveal">
            At Pleasant View Schools, academic excellence is anchored in deep intellectual curiosity, rigorous inquiry, and Christian integrity. Across our {years} years of existence, our scholars have consistently achieved top-tier distinctions in national assessments while cultivating lifelong problem-solving skills.
          </p>
        </div>

        {/* METRICS STRIP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          margin: '35px 0 50px',
          background: 'var(--soft-bg)',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span className="stat-num" style={{ display: 'block', fontSize: '36px', fontWeight: 800, color: 'var(--primary-red)', fontFamily: 'var(--font-serif)' }}>
              EE &amp; ME1
            </span>
            <strong style={{ display: 'block', fontSize: '15px', color: 'var(--dark-grey)', marginTop: '4px' }}>
              KPSEA &amp; KJSEA Average
            </strong>
            <small style={{ color: '#64748b' }}>Exceeding Expectations &amp; Level 1 Distinction</small>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span className="stat-num" style={{ display: 'block', fontSize: '36px', fontWeight: 800, color: 'var(--primary-red)', fontFamily: 'var(--font-serif)' }}>
              B+ Mean
            </span>
            <strong style={{ display: 'block', fontSize: '15px', color: 'var(--dark-grey)', marginTop: '4px' }}>
              Senior School Transition
            </strong>
            <small style={{ color: '#64748b' }}>Direct University Admission Benchmark</small>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span className="stat-num" style={{ display: 'block', fontSize: '36px', fontWeight: 800, color: 'var(--primary-red)', fontFamily: 'var(--font-serif)' }}>
              1:20
            </span>
            <strong style={{ display: 'block', fontSize: '15px', color: 'var(--dark-grey)', marginTop: '4px' }}>
              Teacher to Scholar Ratio
            </strong>
            <small style={{ color: '#64748b' }}>Individualized Competency Mentorship</small>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span className="stat-num" style={{ display: 'block', fontSize: '36px', fontWeight: 800, color: 'var(--primary-red)', fontFamily: 'var(--font-serif)' }}>
              100%
            </span>
            <strong style={{ display: 'block', fontSize: '15px', color: 'var(--dark-grey)', marginTop: '4px' }}>
              TSC Certified Faculty
            </strong>
            <small style={{ color: '#64748b' }}>Trained CBE Facilitators &amp; Examiners</small>
          </div>
        </div>

        {/* 4 LEARNING STAGES MATRIX */}
        <div style={{ margin: '50px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <span className="lead-badge">EDUCATIONAL PATHWAYS</span>
            <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', color: 'var(--primary-navy)', margin: '6px 0' }}>
              Our Four Distinct Learning Stages
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Age-tailored curricula that nurture learners from early childhood curiosity to confident high school graduation.
            </p>
          </div>

          <div className="pathway-matrix">
            {/* STAGE 1: EARLY LEARNING */}
            <div className="pathway-card">
              <span className="pathway-stage-badge">Stage I &bull; Foundation</span>
              <h3>Early Learning Centre</h3>
              <div className="pathway-grades">Playgroup, PP1 &amp; PP2 (Ages 2.5 – 5 Years)</div>
              <p>
                A warm, safe environment fostering sensory discovery, emergent literacy, numeracy, creative art, and social-emotional development through play-based inquiry.
              </p>
              <ul className="pathway-features">
                <li><i className="fa-solid fa-check" /> Phonics &amp; early language acquisition</li>
                <li><i className="fa-solid fa-check" /> Psychomotor &amp; fine motor development</li>
                <li><i className="fa-solid fa-check" /> Caring, experienced kindergarten teachers</li>
                <li><i className="fa-solid fa-check" /> Purpose-built secure play spaces</li>
              </ul>
              <Link href="/s/pleasantview-early-learning" className="button button-tertiary" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
                Explore Early Learning &rarr;
              </Link>
            </div>

            {/* STAGE 2: PRIMARY SCHOOL */}
            <div className="pathway-card">
              <span className="pathway-stage-badge">Stage II &bull; Core Competencies</span>
              <h3>Primary School</h3>
              <div className="pathway-grades">Grades 1 – 6 (Competency Based Education)</div>
              <p>
                Developing core academic capabilities in Mathematics, Languages, Integrated Science, Agriculture, Social Studies, and Creative Arts with formative competency rubrics.
              </p>
              <ul className="pathway-features">
                <li><i className="fa-solid fa-check" /> Consistent EE (Exceeding Expectations) in KPSEA</li>
                <li><i className="fa-solid fa-check" /> Hands-on STEM science experiments</li>
                <li><i className="fa-solid fa-check" /> French, Music, Coding &amp; Robotics clubs</li>
                <li><i className="fa-solid fa-check" /> Pastoral boarding option from Grade 4 upwards</li>
              </ul>
              <Link href="/s/pleasantview-primary" className="button button-tertiary" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
                Explore Primary School &rarr;
              </Link>
            </div>

            {/* STAGE 3: JUNIOR SECONDARY SCHOOL */}
            <div className="pathway-card">
              <span className="pathway-stage-badge">Stage III &bull; STEM &amp; Exploration</span>
              <h3>Junior Secondary School (JSS)</h3>
              <div className="pathway-grades">Grades 7 – 9 (Pre-Career Pathways)</div>
              <p>
                Adolescents transition into specialized learning with dedicated subject specialists, modern science labs, pre-technical studies, computer science, and agriculture.
              </p>
              <ul className="pathway-features">
                <li><i className="fa-solid fa-check" /> KJSEA ME1 Distinction performance</li>
                <li><i className="fa-solid fa-check" /> Integrated Science &amp; Pre-Technical labs</li>
                <li><i className="fa-solid fa-check" /> Talent identification &amp; pathway counselling</li>
                <li><i className="fa-solid fa-check" /> Both Day and Full Boarding placements</li>
              </ul>
              <Link href="/s/pleasantview-jss" className="button button-tertiary" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
                Explore Junior Secondary &rarr;
              </Link>
            </div>

            {/* STAGE 4: SENIOR SCHOOL */}
            <div className="pathway-card">
              <span className="pathway-stage-badge">Stage IV &bull; University Preparation</span>
              <h3>Senior High School</h3>
              <div className="pathway-grades">Grades 10 – 12 / Form 1 – 4 (KSSEA &amp; KCSE)</div>
              <p>
                Advanced academic streams preparing scholars for top global and local universities. High standards of self-discipline, academic rigor, and moral leadership.
              </p>
              <ul className="pathway-features">
                <li><i className="fa-solid fa-check" /> Historic maiden B+ mean grade distinction</li>
                <li><i className="fa-solid fa-check" /> STEM, Social Sciences &amp; Arts pathways</li>
                <li><i className="fa-solid fa-check" /> Full university admissions mentorship</li>
                <li><i className="fa-solid fa-check" /> Expansive highland boarding hostels</li>
              </ul>
              <Link href="/s/pleasantview-senior" className="button button-tertiary" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
                Explore Senior School &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* SCIENCE LABORATORIES & STEM SHOWCASE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '35px',
          alignItems: 'center',
          margin: '60px 0',
          background: 'linear-gradient(135deg, var(--dark-grey), #111419)',
          borderRadius: '16px',
          padding: '40px',
          color: '#ffffff',
          borderLeft: '6px solid var(--primary-red)'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fda4af' }}>
              CUTTING-EDGE SCIENCE &amp; TECHNOLOGY
            </span>
            <h3 style={{ color: '#ffffff', fontSize: 'clamp(24px, 2.8vw, 36px)', margin: '8px 0 16px', fontFamily: 'var(--font-serif)' }}>
              World-Class Science &amp; Digital Hubs
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '15.5px', lineHeight: 1.8, marginBottom: '20px' }}>
              We believe in learning by doing. Our campuses house state-of-the-art physics, chemistry, biology, and pre-technical laboratories equipped with modern apparatus, digital projectors, and specialized safety systems. Learners experiment, formulate hypotheses, code robotics algorithms, and cultivate STEM mastery from early years to senior graduation.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0' }}>
              <li style={{ color: '#e2e8f0', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px' }}>
                <i className="fa-solid fa-flask-vial" style={{ color: '#fda4af' }} /> Fully equipped Chemistry &amp; Biology wet benches
              </li>
              <li style={{ color: '#e2e8f0', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px' }}>
                <i className="fa-solid fa-robot" style={{ color: '#fda4af' }} /> Coding, Robotics &amp; Computer Science suites
              </li>
              <li style={{ color: '#e2e8f0', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px' }}>
                <i className="fa-solid fa-atom" style={{ color: '#fda4af' }} /> Physics apparatus for mechanics, optics, and electronics
              </li>
            </ul>
            <Link href="/facilities#laboratories" className="button button-gold">
              Tour Our Facilities &rarr;
            </Link>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="/images/hero_science_lab.jpg"
              alt="Pleasant View Modern Science Laboratory"
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', objectFit: 'cover', maxHeight: '380px' }}
            />
          </div>
        </div>

        {/* NATIONAL EXAMINATION DISTINCTIONS (HONORS) */}
        {nationalExams.length > 0 && (
          <div id="honors" style={{ margin: '50px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <span className="lead-badge">VERIFIED DISTINCTION</span>
              <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', color: 'var(--primary-navy)', margin: '6px 0' }}>
                National Examination Performance Reports
              </h3>
              <p style={{ color: '#64748b', fontSize: '15px' }}>
                Consistently positioning our scholars among the top academic performers in Kiambu County.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {nationalExams.map(ex => (
                <div key={ex.id} style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  borderTop: '4px solid var(--primary-red)',
                  padding: '24px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(139,30,45,0.08)', color: 'var(--primary-red)', padding: '3px 8px', borderRadius: '4px' }}>
                      {ex.year} ACADEMIC YEAR
                    </span>
                    <strong style={{ color: 'var(--primary-red)', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
                      {ex.mean_score}
                    </strong>
                  </div>
                  <h4 style={{ color: 'var(--dark-grey)', fontSize: '18px', margin: '4px 0 8px' }}>{ex.exam_name}</h4>
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                    {ex.notes || 'Outstanding cohort performance across national assessment metrics.'}
                  </p>
                  <div style={{ fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    Candidates: <strong>{ex.candidates || 'Cohort'}</strong> &bull; Transition: <strong>100%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALL TO ACTION */}
        <div style={{
          background: 'var(--soft-bg)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <h3 style={{ fontSize: '24px', color: 'var(--dark-grey)', marginBottom: '8px' }}>
            Empower Your Child with Academic Distinction
          </h3>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            Schedule a personal consultation with our academic leads or book a guided tour of our modern laboratories and learning resource centres.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/admissions#visit" className="button button-gold">
              <i className="fa-regular fa-calendar-check" style={{ marginRight: '8px' }} /> Book Campus Tour
            </Link>
            <Link href="/admissions" className="button button-secondary">
              Admissions Journey &rarr;
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
