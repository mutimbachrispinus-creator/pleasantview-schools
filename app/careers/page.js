import Link from 'next/link';
import Page from '@/components/Page';
import { getJobs } from '@/lib/db';
import { applyJob } from '@/app/actions';

export const metadata = {
  title: 'Working at Pleasant View | Careers & Vacancies',
  description: 'Join the distinguished teaching and administrative faculty at Pleasant View Schools in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function CareersPage({ searchParams }) {
  const sp = await searchParams;
  const isApplied = Boolean(sp.applied);
  const jobsList = await getJobs();

  return (
    <Page title="Working at Pleasant View" subtitle="CAREERS &amp; FACULTY EXCELLENCE">
      <div className="wrapper" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px 60px' }}>
        {/* SUCCESS NOTIFICATION */}
        {isApplied && (
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
            <h3 style={{ color: '#ffffff', marginBottom: '8px', fontSize: '24px' }}>Application Submitted Successfully!</h3>
            <p style={{ fontSize: '16px', maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.92)' }}>
              Thank you for applying to join the Pleasant View Schools team. Our Human Resources and Academic Leadership Committee will review your qualifications and contact shortlisted candidates directly.
            </p>
          </div>
        )}

        {/* HERO CULTURE BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #8B1E2D, #1E232A)',
          color: '#ffffff',
          borderRadius: '6px',
          padding: '40px',
          marginBottom: '50px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
            <span style={{ color: 'var(--gold-accent)', fontSize: '13px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              JOIN OUR CHRISTIAN ACADEMIC COMMUNITY
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '32px', marginTop: '10px', marginBottom: '16px', textTransform: 'uppercase' }}>
              Inspire the Leaders of Tomorrow
            </h2>
            <p style={{ fontSize: '16.5px', lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
              At Pleasant View Schools, we believe an exceptional education begins with exceptional people. We foster an uplifting, collegiate work culture with continuous professional development, competitive compensation, and a shared commitment to Christian character and academic victory.
            </p>
            <div style={{ display: 'flex', gap: '25px', marginTop: '25px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ fontSize: '22px', color: 'var(--gold-accent)' }}>100%</strong>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>TSC Certified Faculty</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '25px' }}>
                <strong style={{ fontSize: '22px', color: 'var(--gold-accent)' }}>24+ Years</strong>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Tradition of Excellence</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '25px' }}>
                <strong style={{ fontSize: '22px', color: 'var(--gold-accent)' }}>1:20</strong>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Teacher-to-Student Ratio</div>
              </div>
            </div>
          </div>
        </div>

        {/* CURRENT VACANCIES SECTION */}
        <div style={{ marginBottom: '50px' }}>
          <div className="section-header" style={{ marginBottom: '30px' }}>
            <h5>CURRENT OPPORTUNITIES</h5>
            <h3>Open Career Positions ({jobsList.length})</h3>
            <div className="gold-divider" style={{ marginLeft: 0 }} />
          </div>

          {jobsList.length === 0 ? (
            <div style={{ padding: '40px', background: 'var(--soft-bg)', borderRadius: '6px', textAlign: 'center' }}>
              <i className="fa-solid fa-briefcase" style={{ fontSize: '36px', color: '#888', marginBottom: '12px' }} />
              <h4>No Current Openings</h4>
              <p style={{ color: '#666' }}>
                We do not have active public vacancies at this moment. You are welcome to submit a speculative application below.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '25px' }}>
              {jobsList.map(j => (
                <div
                  key={j.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #dde2ec',
                    borderRadius: '6px',
                    padding: '30px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                    borderLeft: '5px solid var(--primary-navy)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: 'var(--soft-bg)', color: 'var(--primary-navy)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
                          {j.department || 'Academic'}
                        </span>
                        <span style={{ background: '#eaf5ea', color: '#2b7a2b', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                          {j.contract_type || 'Full-Time'}
                        </span>
                        <span style={{ background: '#fff3cd', color: '#856404', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                          <i className="fa-solid fa-location-dot" style={{ marginRight: '4px' }} /> {j.location || 'Githunguri, Kiambu'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '22px', margin: '4px 0 10px', color: 'var(--dark-navy)' }}>{j.title}</h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: '#888', display: 'block' }}>Deadline:</span>
                      <strong style={{ fontSize: '14px', color: '#d9534f' }}>
                        <i className="fa-regular fa-clock" style={{ marginRight: '5px' }} />
                        {j.deadline || 'Rolling basis'}
                      </strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7, margin: '14px 0' }}>
                    {j.description}
                  </p>

                  {j.requirements && (
                    <div style={{ background: 'var(--soft-bg)', padding: '15px 20px', borderRadius: '4px', margin: '15px 0' }}>
                      <strong style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--primary-navy)', display: 'block', marginBottom: '6px' }}>
                        Key Requirements &amp; Qualifications:
                      </strong>
                      <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: 1.6 }}>{j.requirements}</p>
                    </div>
                  )}

                  {/* INLINE APPLICATION DRAWER */}
                  <details style={{ marginTop: '20px' }}>
                    <summary style={{
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--gold-accent)',
                      color: 'var(--dark-navy)',
                      fontWeight: 800,
                      fontSize: '13px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      padding: '10px 22px',
                      borderRadius: '4px'
                    }}>
                      <i className="fa-solid fa-paper-plane" /> Apply for this Position
                    </summary>

                    <form action={applyJob} style={{
                      marginTop: '20px',
                      background: 'var(--soft-bg)',
                      padding: '25px',
                      borderRadius: '6px',
                      border: '1px solid #d4dae6'
                    }}>
                      <h4 style={{ marginBottom: '15px', color: 'var(--primary-navy)' }}>
                        Apply for: {j.title}
                      </h4>
                      <input type="hidden" name="job_id" value={j.id} />
                      <input type="hidden" name="job_title" value={j.title} />

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                        <div className="form-group">
                          <label>Full Legal Name *</label>
                          <input name="name" placeholder="e.g. Samuel Njoroge" required style={{ padding: '10px' }} />
                        </div>
                        <div className="form-group">
                          <label>Email Address *</label>
                          <input name="email" type="email" placeholder="samuel@example.com" required style={{ padding: '10px' }} />
                        </div>
                        <div className="form-group">
                          <label>Phone Number (+254...) *</label>
                          <input name="phone" placeholder="+254 711 000 000" required style={{ padding: '10px' }} />
                        </div>
                        <div className="form-group">
                          <label>Years of Relevant Experience *</label>
                          <input name="experience" placeholder="e.g. 5 Years in Senior High School" required style={{ padding: '10px' }} />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '15px' }}>
                        <label>Brief Cover Statement / Qualifications Summary *</label>
                        <textarea
                          name="cover_letter"
                          rows={4}
                          placeholder="Summarize your academic qualifications, TSC registration number (if teacher), leadership background, and why you wish to serve at Pleasant View Schools..."
                          required
                          style={{ padding: '10px' }}
                        />
                      </div>

                      <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

                      <button type="submit" className="button button-primary" style={{ marginTop: '10px', padding: '12px 24px' }}>
                        Submit Application to HR Committee
                      </button>
                    </form>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GENERAL SPECULATIVE INQUIRY CARD */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #dde2ec',
          borderRadius: '6px',
          padding: '35px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <h4 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--primary-navy)' }}>
            Can&apos;t Find Your Role? Submit a Speculative Application
          </h4>
          <p style={{ fontSize: '14.5px', color: '#555', marginBottom: '20px' }}>
            We are always eager to connect with gifted educators, sports coaches, pastoral houseparents, and operational experts. Send your details to our central human resources talent pool.
          </p>

          <form action={applyJob} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
            <input type="hidden" name="job_id" value="0" />
            <input type="hidden" name="job_title" value="General / Speculative Application" />

            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" placeholder="Your name" required style={{ padding: '10px' }} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" placeholder="your.email@example.com" required style={{ padding: '10px' }} />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" placeholder="+254..." required style={{ padding: '10px' }} />
            </div>
            <div className="form-group">
              <label>Area of Expertise</label>
              <input name="experience" placeholder="e.g. Mathematics, Sciences, Pastoral Care, Transport" required style={{ padding: '10px' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Summary Statement</label>
              <textarea name="cover_letter" rows={3} placeholder="Tell us how your skills can serve our pupils..." required style={{ padding: '10px' }} />
            </div>

            <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

            <button type="submit" className="button button-gold" style={{ gridColumn: '1 / -1', padding: '14px' }}>
              Submit Speculative Application
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}
