import Link from 'next/link';
import Page from '@/components/Page';
import { book, enquire, sendDirectAdminSms } from '@/app/actions';
import { schools, S } from '@/lib/db';

export const metadata = {
  title: 'Book a Campus Visit & Admissions Contact | Pleasant View Schools',
  description: 'Schedule a walking campus tour, send a direct SMS to administration, or contact the Pleasant View Schools admissions desk in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function ContactPage({ searchParams }) {
  const sp = await searchParams;
  const isBooked = Boolean(sp.booked || sp.ok === 'visit');
  const isEnquirySent = Boolean(sp.ok && sp.ok !== 'visit');
  const isSmsSent = Boolean(sp.sms_sent);
  const schList = await schools();
  const st = await S();

  const phone = st.phone || '+254 711 689 913';
  const email = st.email || 'info@pleasantview.sc.ke';
  const location = st.location || 'Githunguri, Komothai Subcounty, Kiambu County';

  return (
    <Page title="Admissions &amp; Campus Tours" subtitle="CONNECT WITH PLEASANT VIEW SCHOOLS">
      <div className="wrapper" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px 60px' }}>
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
              Thank you for scheduling a visit to Pleasantview Schools. Our admissions secretary will contact you via SMS and phone to confirm your itinerary and meet you at the campus reception.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px' }}>
          {/* COLUMN 1: INTERACTIVE BOOK CAMPUS TOUR & ENQUIRY FORMS */}
          <div>
            {/* BOOK A CAMPUS TOUR CARD */}
            <div id="visit" className="custom-form" style={{
              background: '#ffffff',
              padding: '35px',
              borderRadius: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              borderTop: '4px solid var(--gold-accent)',
              marginBottom: '40px'
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

              <form action={book}>
                <div className="form-group">
                  <label>Select School Division / Campus *</label>
                  <select name="school" style={{ padding: '12px', fontSize: '14px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="all">Pleasantview Schools Main Campus (All Divisions)</option>
                    {schList.map(s => (
                      <option key={s.id} value={s.slug}>
                        {s.name} ({s.category || 'Division'})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
            <div id="enquire" className="custom-form" style={{
              background: '#ffffff',
              padding: '35px',
              borderRadius: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              borderTop: '4px solid var(--primary-navy)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <i className="fa-solid fa-envelope" style={{ color: 'var(--primary-navy)', fontSize: '22px' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--primary-navy)' }}>
                  DIRECT ADMISSIONS INQUIRY
                </span>
              </div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Have a Question? Send Us a Message</h3>
              <p style={{ fontSize: '14.5px', color: '#555', marginBottom: '25px', lineHeight: 1.6 }}>
                Have questions regarding fees, CBC curriculum requirements, boarding intake, or school transport routes? Our admissions desk is on standby.
              </p>

              <form action={enquire}>
                <div className="form-group">
                  <label>Your Full Name *</label>
                  <input name="name" placeholder="Parent / Guardian Name" required style={{ padding: '12px', fontSize: '14px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
            <div id="admin-sms" className="custom-form" style={{
              background: '#ffffff',
              padding: '35px',
              borderRadius: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              borderTop: '4px solid #28a745',
              marginTop: '40px'
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

              <form action={sendDirectAdminSms}>
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

          {/* COLUMN 2: CAMPUS DIRECTORY, ADMISSIONS OFFICE, & SOCIAL LINKS */}
          <div>
            {/* ADMISSIONS DESK DIRECTORY */}
            <div style={{
              background: 'linear-gradient(135deg, #8B1E2D, #1E232A)',
              color: '#ffffff',
              padding: '35px',
              borderRadius: '6px',
              marginBottom: '30px',
              boxShadow: '0 8px 30px rgba(139,30,45,0.2)'
            }}>
              <span style={{ color: 'var(--gold-accent)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                DIRECT ADMISSIONS DESK
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '24px', marginTop: '6px', marginBottom: '20px' }}>
                Pleasantview Schools Main Reception
              </h3>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--gold-accent)',
                    fontSize: '18px'
                  }}>
                    <i className="fa-solid fa-phone" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Telephone / Call Center:</strong>
                    <div style={{ fontSize: '17px', fontWeight: 700, marginTop: '2px' }}>
                      <a href={`tel:${phone}`} style={{ color: '#ffffff', textDecoration: 'none' }}>{phone}</a>
                    </div>
                    <small style={{ color: 'rgba(255,255,255,0.7)' }}>Open Mon &ndash; Sat 8:00 AM &ndash; 5:00 PM</small>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--gold-accent)',
                    fontSize: '18px'
                  }}>
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Official Email:</strong>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
                      <a href={`mailto:${email}`} style={{ color: '#ffffff', textDecoration: 'none' }}>{email}</a>
                    </div>
                    <small style={{ color: 'rgba(255,255,255,0.7)' }}>Admissions, Inquiries &amp; Transfers</small>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--gold-accent)',
                    fontSize: '18px'
                  }}>
                    <i className="fa-solid fa-location-dot" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Campus Location:</strong>
                    <div style={{ fontSize: '15.5px', marginTop: '2px', lineHeight: 1.5 }}>
                      {location}
                    </div>
                    <small style={{ color: 'rgba(255,255,255,0.7)' }}>Adjacent to Komothai Centre, Kiambu County</small>
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA CHANNELS */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold-accent)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>
                  Connect on Social Media
                </span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href={st.social_facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none' }} title="Facebook">
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                  <a href={st.social_twitter || 'https://x.com'} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none' }} title="X / Twitter">
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a href={st.social_instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none' }} title="Instagram">
                    <i className="fa-brands fa-instagram" />
                  </a>
                  <a href={st.social_youtube || 'https://youtube.com'} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none' }} title="YouTube">
                    <i className="fa-brands fa-youtube" />
                  </a>
                  <a href={st.social_linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none' }} title="LinkedIn">
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                </div>
              </div>
            </div>

            {/* CAMPUS SPECIFIC CONTACTS */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '6px', border: '1px solid #dde2ec' }}>
              <h4 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary-navy)' }}>
                Academic Division Desks
              </h4>
              <div style={{ display: 'grid', gap: '14px' }}>
                {schList.map(s => (
                  <div key={s.id} style={{ padding: '12px', background: 'var(--soft-bg)', borderRadius: '4px', borderLeft: `3px solid ${s.color || 'var(--primary-navy)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{s.name}</strong>
                      <span style={{ fontSize: '11px', background: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, color: s.color || 'var(--primary-navy)' }}>
                        {s.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                      <i className="fa-solid fa-phone" style={{ marginRight: '6px', color: 'var(--medium-blue)' }} />
                      <a href={`tel:${s.phone || phone}`} style={{ color: '#333', textDecoration: 'none' }}>{s.phone || phone}</a>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Link href={`/s/${s.slug}/visit`} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--medium-blue)', textDecoration: 'none' }}>
                        Book {s.name} Tour &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
