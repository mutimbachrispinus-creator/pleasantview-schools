import Link from 'next/link';
import Page from '@/components/Page';
import { getAlumniStories, getYearsOfExistence } from '@/lib/db';

export const metadata = {
  title: 'Alumni Network & Success Stories | Pleasant View Schools',
  description: 'Celebrate the impact of Pleasant View Schools alumni excelling across medicine, software engineering, law, business, and public leadership across Kenya and globally.'
};

export const dynamic = 'force-dynamic';

export default async function AlumniPage() {
  const years = getYearsOfExistence();
  const alumni = await getAlumniStories(false).catch(() => []);

  return (
    <Page
      title="Alumni Network & Success Stories"
      subtitle="OUR AIM IS VICTORY &bull; THE PROOF OF EXCELLENCE"
      image="/images/banner_2_a.webp"
    >
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">THE LIVING LEGACY</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>
            Where Our Aim for Victory Leads
          </h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }}>
            Across {years} years of institutional history, Pleasant View graduates have carried the torch of academic excellence and Christian integrity into the world&apos;s leading universities and innovative corporations. Here are some of their inspiring journeys.
          </p>
        </div>

        {/* ALUMNI STORIES GRID */}
        <div className="alumni-hub-grid">
          {alumni.map((a, idx) => (
            <div key={a.id || idx} className="alumni-feature-card">
              <div
                className="alumni-card-media"
                style={{ backgroundImage: `url('${a.image_url || '/images/girls_high_school3.webp'}')` }}
              >
                <span className="alumni-badge-year">{a.grad_year}</span>
              </div>
              <div className="alumni-feature-body">
                <div>
                  <h3>{a.name}</h3>
                  <div className="alumni-role">{a.current_role}</div>
                  <span className="alumni-institution">{a.university_or_company}</span>
                  {a.quote && (
                    <blockquote style={{
                      margin: '0 0 14px',
                      padding: '12px 14px',
                      background: 'var(--soft-bg)',
                      borderLeft: '4px solid var(--primary-red)',
                      fontStyle: 'italic',
                      color: 'var(--dark-grey)',
                      fontSize: '13.5px',
                      borderRadius: '4px',
                      lineHeight: 1.55
                    }}>
                      &ldquo;{a.quote}&rdquo;
                    </blockquote>
                  )}
                  <p>{a.story}</p>
                </div>

                {a.video_url && (
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #edf1f7' }}>
                    {a.video_url.startsWith('/img/') || /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(a.video_url) ? (
                      <video
                        src={a.video_url}
                        poster={a.image_url || undefined}
                        controls
                        playsInline
                        preload="metadata"
                        style={{ width: '100%', maxHeight: '220px', borderRadius: '6px', background: '#000', display: 'block' }}
                      />
                    ) : (
                      <a
                        href={a.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button-gold"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '12.5px' }}
                      >
                        <i className="fa-solid fa-play" /> Watch Video Story &rarr;
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ALUMNI REGISTRATION & MENTORSHIP PANEL */}
        <div style={{
          background: 'linear-gradient(135deg, var(--dark-grey), #111419)',
          borderRadius: '16px',
          padding: '40px',
          color: '#ffffff',
          borderLeft: '6px solid var(--primary-red)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'center',
          margin: '50px 0'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fda4af' }}>
              STAY CONNECTED
            </span>
            <h3 style={{ color: '#ffffff', fontSize: 'clamp(22px, 2.6vw, 32px)', margin: '8px 0 14px', fontFamily: 'var(--font-serif)' }}>
              Are You a Pleasant View Alumnus?
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.7, marginBottom: '22px' }}>
              Join our global Alumni Network, mentor current scholars, speak at our annual career days, or reconnect with former classmates and teachers.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="button button-gold">
                <i className="fa-solid fa-envelope" style={{ marginRight: '8px' }} /> Update Your Details
              </Link>
              <Link href="/admissions" className="button button-primary">
                Enroll the Next Generation
              </Link>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '26px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '10px' }}>
              <i className="fa-solid fa-handshake-angle" style={{ color: '#fda4af', marginRight: '8px' }} /> Alumni Mentorship Program
            </h4>
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              Our Senior School and JSS scholars regularly benefit from career talks, internship shadowing, and university preparation clinics delivered by distinguished alumni doctors, engineers, attorneys, and tech entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}
