import Link from 'next/link';
import Page from '@/components/Page';
import PublicFormEnhancer from '@/components/PublicFormEnhancer';
import { schools, S, getSchoolMapsUrl } from '@/lib/db';

export const metadata = {
  title: 'Admissions & Campus Visits | Pleasant View Schools',
  description: 'Apply for admission, explore curriculum requirements, review official fee guidelines, and schedule a campus walking tour across our Early Learning, Primary, Junior Secondary (JSS), and Senior High Schools in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function AdmissionsPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const isBooked = Boolean(sp.booked || sp.ok === 'visit');
  const isEnquirySent = Boolean(sp.ok && sp.ok !== 'visit');
  const submitError = sp.error ? String(sp.error) : '';
  const selectedBranch = sp.school || sp.branch || 'all';

  let schList = [];
  let st = {};
  try {
    const [sc, s] = await Promise.all([schools(), S()]);
    schList = sc || [];
    st = s || {};
  } catch (err) {
    schList = [];
    st = {};
  }

  const phone = st.phone || '+254 711 689 913';
  const email = st.email || 'info@pleasantviewschools.co.ke';
  const mapsUrl = st.maps_url || 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5';
  const whatsappUrl = st.whatsapp_url || 'https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20would%20like%20to%20inquire%20about%20admissions.';
  const feesUrl = st.fees_url || '/admissions#fees';

  const faqs = [
    {
      q: 'When do admissions open for the new academic year?',
      a: 'We admit learners continuously throughout the year subject to available capacity, with major intake cohorts joining in January (Term 1), May (Term 2), and September (Term 3). Early registration is strongly advised, especially for Playgroup, Grade 1, Junior Secondary (Grade 7), and Senior School.'
    },
    {
      q: 'What is the boarding admission policy and from what age?',
      a: 'Pleasant View Schools offers nurturing, family-style boarding facilities for boys and girls from Grade 4 through Senior School. Our residential life is supervised by dedicated resident houseparents, mentors, and registered health personnel, with daily evening prep and morning Christian devotions.'
    },
    {
      q: 'How does Pleasant View implement the Competency Based Education (CBE) curriculum?',
      a: 'Our curriculum strictly aligns with the Ministry of Education CBE framework. We emphasize practical competency mastery, digital literacy, critical thinking, values education, and STEM integration with fully equipped Integrated Science and Pre-Technical laboratories.'
    },
    {
      q: 'What areas are covered by the Pleasant View school transport fleet?',
      a: 'Our modern, monitored fleet of school buses serves routes across Githunguri, Komothai, Ruiru, Kiambu Town, and surrounding environs. Every bus is operated by a vetted professional driver accompanied by a trained bus warden.'
    },
    {
      q: 'What documentation is required upon admission?',
      a: 'Parents should bring a copy of the child’s birth certificate, 2 recent passport-sized photographs, the latest academic assessment report from the previous school, NEMIS/UPI details (where applicable), and medical records or special allergy notices.'
    }
  ];

  return (
    <Page
      title="Admissions & Campus Visits"
      subtitle="JOIN PLEASANT VIEW SCHOOLS"
      image="/images/banner_4_a.webp"
    >
      <PublicFormEnhancer />

      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* SUBMISSION NOTIFICATION TOASTS */}
        {submitError && (
          <div style={{
            background: '#fef2f2',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '30px',
            borderLeft: '6px solid #dc2626',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {submitError === 'rate_limit'
              ? 'Too many submissions in a short period. Please wait a moment and try again, or call the admissions desk at ' + phone + '.'
              : submitError}
          </div>
        )}

        {isBooked && (
          <div style={{
            background: 'linear-gradient(135deg, #8B1E2D, #1E232A)',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '32px',
            marginBottom: '40px',
            boxShadow: '0 10px 30px rgba(139,30,45,0.25)',
            borderLeft: '6px solid #8B1E2D',
            textAlign: 'center'
          }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '44px', color: '#fda4af', marginBottom: '14px' }} />
            <h3 style={{ color: '#ffffff', marginBottom: '8px', fontSize: '26px' }}>Campus Tour Booking Received!</h3>
            <p style={{ fontSize: '16px', maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.92)' }}>
              Thank you for scheduling a visit to Pleasant View Schools. Our admissions secretary will contact you via phone to confirm your itinerary and meet you at the campus reception.
            </p>
          </div>
        )}

        {isEnquirySent && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            borderRadius: '10px',
            padding: '28px',
            marginBottom: '40px',
            borderLeft: '6px solid #28a745',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
          }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '38px', color: '#28a745', marginBottom: '10px' }} />
            <h3 style={{ marginBottom: '6px' }}>Admissions Enquiry Submitted!</h3>
            <p style={{ margin: 0, fontSize: '15.5px' }}>We have logged your inquiry and our admissions team will contact you promptly.</p>
          </div>
        )}

        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">THE ADMISSIONS JOURNEY</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>Begin Your Child&apos;s Victory Journey</h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }}>
            Choosing the right school for your child is one of the most important investments you will make. At Pleasant View Schools, we welcome families into a warm Christian community committed to academic distinction, moral fortitude, and leadership excellence.
          </p>
        </div>

        {/* 4-STEP ADMISSIONS JOURNEY */}
        <div className="admissions-stepper">
          <div className="admissions-step-card">
            <div className="step-number-badge">1</div>
            <h4>Explore &amp; Enquire</h4>
            <p>
              Submit an online enquiry, chat directly with our admissions team on WhatsApp, or download our institutional prospectus to learn about our curriculum and community.
            </p>
          </div>

          <div className="admissions-step-card">
            <div className="step-number-badge">2</div>
            <h4>Visit Our Campus</h4>
            <p>
              Schedule a walking campus tour in Githunguri to inspect our modern science labs, boarding dormitories, dining halls, and expansive sports grounds firsthand.
            </p>
          </div>

          <div className="admissions-step-card">
            <div className="step-number-badge">3</div>
            <h4>Assessment &amp; Interview</h4>
            <p>
              Prospective learners attend a warm, supportive readiness assessment and informal family interview designed to understand their unique talents and learning needs.
            </p>
          </div>

          <div className="admissions-step-card">
            <div className="step-number-badge">4</div>
            <h4>Offer &amp; Enrolment</h4>
            <p>
              Upon successful evaluation, an official letter of offer and admissions pack are issued. Once fees and documentation are completed, welcome to Pleasant View!
            </p>
          </div>
        </div>

        {/* PROSPECTUS DOWNLOAD CALLOUT */}
        <div className="prospectus-banner" id="prospectus">
          <div className="prospectus-content">
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fda4af' }}>
              OFFICIAL INFORMATION PACK
            </span>
            <h3>Download Our School Prospectus</h3>
            <p>
              Get comprehensive details on our CBE curriculum pathways, boarding guidelines, sports and creative arts programs, fee structures, and campus life in one digital package.
            </p>
          </div>
          <div className="prospectus-action">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-gold"
              style={{ padding: '14px 28px', fontSize: '14px', whiteSpace: 'nowrap' }}
            >
              <i className="fa-solid fa-file-arrow-down" style={{ marginRight: '8px' }} /> Request Prospectus via WhatsApp
            </a>
          </div>
        </div>

        {/* ADMISSION REQUIREMENTS BY SCHOOL DIVISION */}
        <div id="requirements" style={{ margin: '50px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <span className="lead-badge">CRITERIA &amp; PLACEMENT</span>
            <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', color: 'var(--primary-navy)', margin: '6px 0' }}>
              Admission Requirements by Stage
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Specific documentation and placement criteria across our four educational divisions.
            </p>
          </div>

          <div className="requirements-grid">
            <div className="requirement-card">
              <h4><i className="fa-solid fa-shapes" /> Early Learning (Crèche &amp; PP1/PP2)</h4>
              <ul>
                <li><i className="fa-solid fa-check" /> Playgroup entry from age 2.5 years</li>
                <li><i className="fa-solid fa-check" /> PP1 entry from age 4 years; PP2 from age 5</li>
                <li><i className="fa-solid fa-check" /> Copy of Child&apos;s Birth Certificate</li>
                <li><i className="fa-solid fa-check" /> Immunization &amp; clinic health records</li>
                <li><i className="fa-solid fa-check" /> 2 recent passport-size photographs</li>
              </ul>
            </div>

            <div className="requirement-card">
              <h4><i className="fa-solid fa-book" /> Primary School (Grades 1 – 6 CBE)</h4>
              <ul>
                <li><i className="fa-solid fa-check" /> Completion of Pre-Primary education for Grade 1</li>
                <li><i className="fa-solid fa-check" /> Latest academic assessment report / progress report card</li>
                <li><i className="fa-solid fa-check" /> NEMIS / Learner UPI number from previous institution</li>
                <li><i className="fa-solid fa-check" /> Clearance letter &amp; birth certificate copy</li>
                <li><i className="fa-solid fa-check" /> Boarding option available from Grade 4 upwards</li>
              </ul>
            </div>

            <div className="requirement-card">
              <h4><i className="fa-solid fa-microscope" /> Junior Secondary (Grades 7 – 9 JSS)</h4>
              <ul>
                <li><i className="fa-solid fa-check" /> KPSEA assessment results transcript</li>
                <li><i className="fa-solid fa-check" /> Grade 6 clearance and transfer documentation</li>
                <li><i className="fa-solid fa-check" /> Student NEMIS / assessment assessment records</li>
                <li><i className="fa-solid fa-check" /> Both Day Scholar and Full Boarding placements</li>
                <li><i className="fa-solid fa-check" /> Pre-Technical &amp; STEM elective consultation</li>
              </ul>
            </div>

            <div className="requirement-card">
              <h4><i className="fa-solid fa-graduation-cap" /> Senior School (Grades 10 – 12 / Form 1 – 4)</h4>
              <ul>
                <li><i className="fa-solid fa-check" /> KJSEA / KCPE completion and official slip</li>
                <li><i className="fa-solid fa-check" /> Academic evaluation and school leaving certificate</li>
                <li><i className="fa-solid fa-check" /> Choice of Senior pathway: STEM, Arts &amp; Sports, Social Sciences</li>
                <li><i className="fa-solid fa-check" /> Dedicated high school boarding hostels</li>
                <li><i className="fa-solid fa-check" /> Proven record of B+ university transitions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TUITION & FEE STRUCTURE GUIDELINES */}
        <div id="fees" className="custom-form" style={{
          background: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          borderTop: '4px solid var(--primary-red)',
          padding: '36px',
          margin: '50px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <i className="fa-solid fa-file-invoice-dollar" style={{ color: 'var(--primary-red)', fontSize: '24px' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--dark-grey)' }}>
              TUITION &amp; FEE SCHEDULE
            </span>
          </div>
          <h3 style={{ fontSize: '26px', marginBottom: '12px', color: 'var(--dark-grey)' }}>Official School Fees &amp; Guidelines</h3>
          <p style={{ fontSize: '15.5px', color: '#4b5563', lineHeight: 1.7, marginBottom: '22px' }}>
            Pleasant View Schools is committed to providing outstanding, all-round international-caliber education at competitive, family-friendly rates. Our fees cover high-quality academic tuition, laboratory practicals, ICT and digital resources, co-curricular sports, and, for boarding scholars, nutritious balanced meals, secure boarding accommodation, and 24-hour pastoral care.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '26px' }}>
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-red)' }}>
              <strong style={{ display: 'block', fontSize: '16px', color: 'var(--dark-grey)', marginBottom: '4px' }}>
                Tuition &amp; Assessment
              </strong>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Structured termly tuition covering CBC/CBE curriculum, continuous assessments, and national examination preparation.
              </p>
            </div>
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--dark-grey)' }}>
              <strong style={{ display: 'block', fontSize: '16px', color: 'var(--dark-grey)', marginBottom: '4px' }}>
                Boarding &amp; Pastoral Care
              </strong>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Includes modern dormitory living, evening supervised prep, 4 balanced meals daily, and 24-hour sanitarium medical supervision.
              </p>
            </div>
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-red)' }}>
              <strong style={{ display: 'block', fontSize: '16px', color: 'var(--dark-grey)', marginBottom: '4px' }}>
                Transport Fleet (Day Scholars)
              </strong>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Zoned, door-to-door or central pickup points across Githunguri, Komothai, Ruiru, and Kiambu environs.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-gold"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <i className="fa-brands fa-whatsapp" style={{ marginRight: '6px' }} /> Inquire Current Term Fee Schedule
            </a>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="button button-tertiary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <i className="fa-solid fa-phone" style={{ marginRight: '6px' }} /> Call Admissions Desk: {phone}
            </a>
          </div>
        </div>

        {/* TWO-COLUMN APPLICATION FORMS: BOOK A CAMPUS TOUR & GENERAL ADMISSION ENQUIRY */}
        <div className="contact-layout-container" style={{ margin: '40px 0' }}>
          {/* FORM 1: BOOK A CAMPUS TOUR */}
          <div id="visit" className="custom-form contact-entry-panel" style={{
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            borderTop: '4px solid var(--primary-red)',
            padding: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <i className="fa-regular fa-calendar-check" style={{ color: 'var(--primary-red)', fontSize: '24px' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--dark-grey)' }}>
                EXPERIENCE OUR CAMPUS
              </span>
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--dark-grey)' }}>Book a Walking Campus Tour</h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>
              Walk through our science laboratories, modern classrooms, boarding houses, and athletics grounds. Tours are hosted Monday to Saturday.
            </p>

            <form action="/api/public/submit?action=book" method="POST" data-public-action="book">
              <div className="form-group">
                <label>Parent / Guardian Full Name *</label>
                <input name="name" placeholder="e.g. Dr. Jane Mwangi" required />
              </div>

              <div className="form-group">
                <label>Mobile Telephone Number *</label>
                <input name="phone" placeholder="+254 711 000 000" required />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="jane@example.com" />
              </div>

              <div className="form-group">
                <label>Preferred Date of Visit *</label>
                <input name="date" type="date" required />
              </div>

              <div className="form-group">
                <label>Campus Division of Interest *</label>
                <select name="school" defaultValue={selectedBranch !== 'all' ? selectedBranch : ''} required>
                  <option value="" disabled>-- Select School Campus --</option>
                  {schList.map(s => (
                    <option key={s.id} value={s.slug || s.name}>
                      {String(s.name || '').replace(/pleasantview/gi, 'Pleasant View')} ({s.category || 'School'})
                    </option>
                  ))}
                  <option value="All Campuses">Whole Campus Tour (All Divisions)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Learner Grade / Class Level</label>
                <input name="grade" placeholder="e.g. Grade 1, Grade 7 JSS, Form 1" />
              </div>

              <div className="form-group">
                <label>Special Requests or Areas of Focus</label>
                <textarea name="notes" rows="3" placeholder="Tell us about specific interests: boarding facilities, science labs, transport routes, sports..." />
              </div>

              <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

              <button type="submit" className="button button-gold" style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 800 }}>
                <i className="fa-regular fa-calendar-check" style={{ marginRight: '8px' }} /> Confirm Campus Visit Booking
              </button>
            </form>
          </div>

          {/* FORM 2: GENERAL ADMISSIONS ENQUIRY */}
          <div id="enquire" className="custom-form contact-entry-panel" style={{
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            borderTop: '4px solid var(--dark-grey)',
            padding: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <i className="fa-regular fa-envelope" style={{ color: 'var(--dark-grey)', fontSize: '24px' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--dark-grey)' }}>
                ADMISSIONS SECRETARIAT
              </span>
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--dark-grey)' }}>General Admissions Enquiry</h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>
              Have questions regarding seat availability, interview schedules, transfers, or scholarship guidelines? Send an inquiry directly to our registrar.
            </p>

            <form action="/api/public/submit?action=enquire" method="POST" data-public-action="enquire">
              <div className="form-group">
                <label>Parent / Guardian Name *</label>
                <input name="name" placeholder="e.g. Mr. Peter Karanja" required />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input name="phone" placeholder="+254 711 000 000" required />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="peter@example.com" />
              </div>

              <div className="form-group">
                <label>School Division *</label>
                <select name="school_id" defaultValue="" required>
                  <option value="" disabled>-- Select School Division --</option>
                  {schList.map(s => (
                    <option key={s.id} value={s.id}>
                      {String(s.name || '').replace(/pleasantview/gi, 'Pleasant View')}
                    </option>
                  ))}
                  <option value="0">General Admissions Desk</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admissions Subject / Query *</label>
                <input name="subject" placeholder="e.g. Mid-term Transfer into Grade 7 JSS" required />
              </div>

              <div className="form-group">
                <label>Message / Question Details *</label>
                <textarea name="message" rows="3" placeholder="Please describe your inquiry, current school of the learner, or specific requests..." required />
              </div>

              <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

              <button type="submit" className="button button-secondary" style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 800 }}>
                <i className="fa-regular fa-paper-plane" style={{ marginRight: '8px' }} /> Submit Admissions Enquiry
              </button>
            </form>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS (FAQS) */}
        <div id="faqs" style={{ margin: '60px 0 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span className="lead-badge">HELPFUL GUIDANCE</span>
            <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', color: 'var(--primary-navy)', margin: '6px 0' }}>
              Frequently Asked Questions
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Common questions prospective parents ask about enrolling at Pleasant View Schools.
            </p>
          </div>

          <div className="faq-container">
            {faqs.map((faq, idx) => (
              <details key={idx} className="faq-item" style={{ cursor: 'pointer' }}>
                <summary className="faq-question">
                  <span>{faq.q}</span>
                  <i className="fa-solid fa-chevron-down" style={{ fontSize: '13px', color: 'var(--primary-red)' }} />
                </summary>
                <div className="faq-answer">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ADMISSIONS CONTACT QUICK TOUCHPOINTS */}
        <div style={{
          background: 'var(--soft-bg)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <h3 style={{ fontSize: '24px', color: 'var(--dark-grey)', marginBottom: '8px' }}>
            Need Immediate Admissions Assistance?
          </h3>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            Our admissions counselors are on hand to guide you through application forms, term dates, fee payment plans, and campus itineraries.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-gold"
              style={{ padding: '12px 28px', fontSize: '14px' }}
            >
              <i className="fa-brands fa-whatsapp" style={{ marginRight: '8px' }} /> Chat on WhatsApp
            </a>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="button button-secondary"
              style={{ padding: '12px 28px', fontSize: '14px' }}
            >
              <i className="fa-solid fa-phone" style={{ marginRight: '8px' }} /> Call {phone}
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-tertiary"
              style={{ padding: '12px 28px', fontSize: '14px' }}
            >
              <i className="fa-solid fa-location-dot" style={{ marginRight: '8px' }} /> Campus Directions
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
}
