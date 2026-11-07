import Link from 'next/link';
import Page from '@/components/Page';
import PublicFormEnhancer from '@/components/PublicFormEnhancer';
import { schools, S } from '@/lib/db';

export const metadata = {
  title: 'Book a Campus Visit & Admissions Contact',
  description: 'Schedule a walking campus tour, send a direct SMS to administration, or contact the Pleasant View Schools admissions desk in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function ContactPage({ searchParams }) {
  const sp = await searchParams;
  const isBooked = Boolean(sp.booked || sp.ok === 'visit');
  const isEnquirySent = Boolean(sp.ok && sp.ok !== 'visit');
  const isSmsSent = Boolean(sp.sms_sent);
  const submitError = sp.error ? String(sp.error) : '';
  const selectedBranch = sp.school || sp.branch || 'all';
  const schList = await schools();
  const st = await S();

  const phone = st.phone || '+254 711 689 913';
  const email = st.email || 'info@pleasantviewschools.co.ke';
  const location = st.location || 'Githunguri, Komothai Subcounty, Kiambu County';

  return (
    <Page title="Admissions &amp; Campus Tours" subtitle="CONNECT WITH PLEASANT VIEW SCHOOLS">
      <PublicFormEnhancer />
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {submitError && (
          <div style={{
            background: '#fef2f2',
            color: '#991b1b',
            borderRadius: '6px',
            padding: '20px 24px',
            marginBottom: '30px',
            borderLeft: '6px solid #dc2626',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {submitError === 'rate_limit'
              ? 'Too many submissions in a short period. Please wait a moment and try again, or call +254 711 689 913.'
              : submitError}
          </div>
        )}
        {/* SUCCESS NOTIFICATION TOAST */}
        {isBooked && (
          <div style={{
            background: 'linear-gradient(135deg, #8B1E2D, #1E232A)',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '30px',
            marginBottom: '40px',
            boxShadow: '0 10px 30px rgba(139,30,45,0.25)',
            borderLeft: '6px solid var(--gold-accent)',
            textAlign: 'center'
          }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '42px', color: 'var(--gold-accent)', marginBottom: '12px' }} />
            <h3 style={{ color: '#ffffff', marginBottom: '8px', fontSize: '24px' }}>Campus Tour Booking Received!</h3>
            <p style={{ fontSize: '16px', maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.92)' }}>
              Thank you for scheduling a visit to Pleasant View Schools. Our admissions secretary will contact you via phone to confirm your itinerary and meet you at the campus reception.
            </p>
          </div>
        )}

        {isEnquirySent && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            borderRadius: '6px',
            padding: '25px',
            marginBottom: '40px',
            borderLeft: '6px solid #28a745',
            textAlign: 'center'
          }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '36px', color: '#28a745', marginBottom: '10px' }} />
            <h3 style={{ marginBottom: '6px' }}>Enquiry Successfully Submitted!</h3>
            <p style={{ margin: 0 }}>We have logged your inquiry and our admissions team will respond promptly.</p>
          </div>
        )}

        {isSmsSent && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            borderRadius: '6px',
            padding: '25px',
            marginBottom: '40px',
            borderLeft: '6px solid #28a745',
            textAlign: 'center'
          }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '36px', color: '#28a745', marginBottom: '10px' }} />
            <h3 style={{ marginBottom: '6px' }}>Direct SMS Delivered!</h3>
            <p style={{ margin: 0 }}>Your message has been dispatched straight to the School Administrator&apos;s mobile phone via SMS.</p>
          </div>
        )}

        {/* TWO-COLUMN LAYOUT: FORMS ON LEFT, CONTACT DETAILS & LOCATION ON RIGHT */}
        <div className="contact-layout-container">
          {/* COLUMN 1: INTERACTIVE BOOK CAMPUS TOUR & ENQUIRY FORMS */}
          <div className="contact-main-column">
            {/* BOOK A CAMPUS TOUR CARD */}
            <div id="visit" className="custom-form contact-entry-panel" style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              borderTop: '4px solid var(--gold-accent)',
              marginBottom: '40px',
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto 40px auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <i className="fa-solid fa-calendar-check" style={{ color: 'var(--gold-accent)', fontSize: '22px' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--primary-navy)' }}>
                  SCHEDULE YOUR VISIT
                </span>
              </div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Book a Personalized Campus Tour</h3>
              <p style={{ fontSize: '14.5px', color: '#555', marginBottom: '25px', lineHeight: 1.6 }}>
                Meet our dedicated teaching faculty, tour our modern science and digital laboratories, inspect the boarding houses, and experience our peaceful green grounds in Githunguri.
              </p>

              <form action="/api/public/submit?action=book" method="POST" data-public-action="book">
                <input type="hidden" name="return_to" value="/contact" />
                <div className="form-group">
                  <label>Select School / Campus *</label>
                  <select name="school" defaultValue={selectedBranch} style={{ padding: '12px', fontSize: '14px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 600 }}>
                    <option value="all">Pleasant View Schools Main Campus (All Schools)</option>
                    {schList.map(s => (
                      <option key={s.id} value={s.slug}>
                        {s.name} ({s.category || 'School'}) &bull; {s.level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-two-col">
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input name="visit_date" type="date" required style={{ padding: '12px', fontSize: '14px', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>Number of Guests</label>
                    <input name="guests" type="number" min="1" max="10" defaultValue="2" style={{ padding: '12px', fontSize: '14px', width: '100%' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Parent / Guardian Full Name *</label>
                  <input name="name" placeholder="e.g. John Kamau" required style={{ padding: '12px', fontSize: '14px' }} />
                </div>

                <div className="form-two-col">
                  <div className="form-group">
                    <label>Phone Number (+254...) *</label>
                    <input name="phone" placeholder="+254 711 000 000" required style={{ padding: '12px', fontSize: '14px' }} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input name="email" type="email" placeholder="john.kamau@example.com" style={{ padding: '12px', fontSize: '14px' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Prospective Student Grade / Class Interested In</label>
                  <input name="grade" placeholder="e.g. Grade 1, Grade 7 JSS, Form 1 Girls Senior School" style={{ padding: '12px', fontSize: '14px' }} />
                </div>

                <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

                <button type="submit" className="button button-gold" style={{ width: '100%', padding: '15px', fontSize: '15px', marginTop: '10px' }}>
                  <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px' }} /> Confirm Campus Tour Booking
                </button>
              </form>
            </div>

            {/* GENERAL ADMISSIONS & ENQUIRIES CARD */}
            <div id="enquire" className="custom-form contact-entry-panel" style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              borderTop: '4px solid var(--primary-navy)',
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto 40px auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <i className="fa-solid fa-envelope" style={{ color: 'var(--primary-navy)', fontSize: '22px' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--primary-navy)' }}>
                  DIRECT ADMISSIONS INQUIRY
                </span>
              </div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Have a Question? Send Us a Message</h3>
              <p style={{ fontSize: '14.5px', color: '#555', marginBottom: '25px', lineHeight: 1.6 }}>
                Have questions regarding fees, CBE curriculum requirements, boarding intake, or school transport routes? Our admissions desk is on standby.
              </p>

              <form action="/api/public/submit?action=enquire" method="POST" data-public-action="enquire">
                <input type="hidden" name="return_to" value="/contact" />
                <div className="form-two-col">
                  <div className="form-group">
                    <label>School</label>
                    <select name="school" defaultValue={selectedBranch} style={{ padding: '12px', fontSize: '14px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 600 }}>
                      <option value="all">All Schools (General Admissions)</option>
                      {schList.map(s => (
                        <option key={s.id} value={s.slug}>
                          {s.name} &bull; {s.level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Prospective Grade / Class (Optional)</label>
                    <input name="grade" placeholder="e.g. PP2, Grade 4, Grade 7, Form 1" style={{ padding: '12px', fontSize: '14px' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Full Name *</label>
                  <input name="name" placeholder="Parent / Guardian Name" required style={{ padding: '12px', fontSize: '14px' }} />
                </div>

                <div className="form-two-col">
                  <div className="form-group">
                    <label>Phone Number (+254...) *</label>
                    <input name="phone" placeholder="+254 711 000 000" required style={{ padding: '12px', fontSize: '14px' }} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input name="email" type="email" placeholder="name@example.com" style={{ padding: '12px', fontSize: '14px' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Ask about admissions, fee structures, boarding facilities, transport coverage, or transfer vacancies..."
                    required
                    style={{ padding: '12px', fontSize: '14px' }}
                  />
                </div>

                <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

                <button type="submit" className="button button-primary" style={{ width: '100%', padding: '15px', fontSize: '15px', marginTop: '10px' }}>
                  <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }} /> Send Admissions Message
                </button>
              </form>
            </div>

            {/* DIRECT SMS TO ADMIN DESK (NO AUTO-REPLY) */}
            <div id="admin-sms" className="custom-form contact-entry-panel" style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              borderTop: '4px solid #28a745',
              width: '100%',
              maxWidth: '100%',
              margin: '40px auto 0 auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <i className="fa-solid fa-comment-sms" style={{ color: '#28a745', fontSize: '22px' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#155724' }}>
                  DIRECT SMS TO ADMINISTRATION
                </span>
              </div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Send Direct SMS to Admin Mobile Handset</h3>
              <p style={{ fontSize: '14.5px', color: '#555', marginBottom: '20px', lineHeight: 1.6 }}>
                Need urgent assistance or direct communication with school leadership? This form dispatches an instant SMS text message directly to the administrator&apos;s mobile phone.
                <strong style={{ display: 'block', color: '#155724', marginTop: '6px' }}>
                  <i className="fa-solid fa-shield-halved" /> Dispatched directly to admin handset with no automated auto-reply.
                </strong>
              </p>

              <form action="/api/public/submit?action=sendDirectAdminSms" method="POST" data-public-action="sendDirectAdminSms">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input name="name" placeholder="Your Full Name" required style={{ padding: '12px', fontSize: '14px' }} />
                </div>

                <div className="form-group">
                  <label>Your Phone Number (+254...) *</label>
                  <input name="phone" placeholder="+254 711 000 000" required style={{ padding: '12px', fontSize: '14px' }} />
                </div>

                <div className="form-group">
                  <label>SMS Message *</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Type the message to be delivered as an SMS to the administrator..."
                    required
                    style={{ padding: '12px', fontSize: '14px' }}
                  />
                </div>

                <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

                <button type="submit" className="button button-gold" style={{ width: '100%', padding: '15px', fontSize: '15px', marginTop: '8px' }}>
                  <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }} /> Dispatch Direct SMS to Administrator
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #edf1f7' }}>
                <a
                  href={`sms:${(st.admin_sms_phone || phone).replace(/[\s\-\(\)]/g, '')}?body=Hello%20Pleasant%20View%20Schools%20Administration,%20`}
                  style={{ fontSize: '13px', color: 'var(--medium-blue)', fontWeight: 700, textDecoration: 'none' }}
                >
                  <i className="fa-solid fa-mobile-screen" /> Or Tap to Open Phone&apos;s Native SMS App &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: MINIMIZED CAMPUS DIRECTORY & ADMISSIONS OFFICE */}
          <div className="contact-side-column">
            {/* COMPACT ADMISSIONS DESK CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #8B1E2D, #1E232A)',
              color: '#ffffff',
              padding: '24px 20px',
              borderRadius: '8px',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(139,30,45,0.18)',
              borderTop: '3px solid var(--gold-accent)'
            }}>
              <span style={{ color: '#fda4af', fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                DIRECT ADMISSIONS DESK
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '19px', marginTop: '4px', marginBottom: '16px' }}>
                Main Reception &amp; Registry
              </h3>

              <div style={{ display: 'grid', gap: '14px' }}>
                {/* TELEPHONE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff',
                    fontSize: '15px'
                  }}>
                    <i className="fa-solid fa-phone" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>
                      <a href={`tel:${phone}`} style={{ color: '#ffffff', textDecoration: 'none' }}>{phone}</a>
                    </div>
                    <small style={{ color: 'rgba(255,255,255,0.82)', fontSize: '11.5px' }}>Mon &ndash; Sat 8:00 AM &ndash; 5:00 PM</small>
                  </div>
                </div>

                {/* EMAILS */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff',
                    fontSize: '15px',
                    marginTop: '2px'
                  }}>
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                    <div>
                      <strong style={{ color: '#fda4af', fontSize: '11px' }}>ADMISSIONS:</strong><br />
                      <a href="mailto:admissions@pleasantviewschools.co.ke" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>admissions@pleasantviewschools.co.ke</a>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <strong style={{ color: '#fda4af', fontSize: '11px' }}>GENERAL INQUIRIES:</strong><br />
                      <a href="mailto:info@pleasantviewschools.co.ke" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>info@pleasantviewschools.co.ke</a>
                    </div>
                  </div>
                </div>

                {/* LOCATION */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff',
                    fontSize: '15px',
                    marginTop: '2px'
                  }}>
                    <i className="fa-solid fa-location-dot" />
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
                    <div style={{ color: '#ffffff', fontWeight: 600 }}>{location}</div>
                    <small style={{ color: 'rgba(255,255,255,0.82)', fontSize: '11.5px' }}>Adjacent to Komothai Centre, Kiambu</small>
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA CHANNELS */}
              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.18)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#fda4af', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  Social Channels
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a href={st.social_facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '13px' }} title="Facebook">
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                  <a href={st.social_twitter || 'https://x.com'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '13px' }} title="X / Twitter">
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a href={st.social_instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '13px' }} title="Instagram">
                    <i className="fa-brands fa-instagram" />
                  </a>
                  <a href={st.social_youtube || 'https://youtube.com'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '13px' }} title="YouTube">
                    <i className="fa-brands fa-youtube" />
                  </a>
                  <a href={st.social_linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '13px' }} title="LinkedIn">
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                </div>
              </div>
            </div>

            {/* CAMPUS SPECIFIC CONTACTS */}
            <div style={{ background: '#ffffff', padding: '22px 18px', borderRadius: '8px', border: '1px solid #dde2ec', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--primary-navy)', fontWeight: 800 }}>
                Schools Contact Desks
              </h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {schList.map(s => {
                  const cleanedName = s.name.replace(/Pleasantview/gi, 'Pleasant View');
                  return (
                    <div key={s.id} style={{ padding: '10px 12px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: `3px solid ${s.color || 'var(--primary-navy)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13.5px', color: 'var(--primary-navy)' }}>{cleanedName}</strong>
                        <span style={{ fontSize: '10px', background: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, color: s.color || 'var(--primary-navy)', border: '1px solid #e1e7f0' }}>
                          {s.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                        <i className="fa-solid fa-phone" style={{ marginRight: '5px', color: 'var(--medium-blue)' }} />
                        <a href={`tel:${s.phone || phone}`} style={{ color: '#333', textDecoration: 'none' }}>{s.phone || phone}</a>
                      </div>
                      <div style={{ marginTop: '6px' }}>
                        <Link href={`/s/${s.slug}/visit`} style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary-red)', textDecoration: 'none' }}>
                          Book School Tour &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
