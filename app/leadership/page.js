import Link from 'next/link';
import Page from '@/components/Page';
import { getLeadershipMessages, getYearsOfExistence } from '@/lib/db';

export const metadata = {
  title: 'Leadership & Governance | Pleasant View Schools',
  description: 'Meet the Board of Directors, Executive Principal, Heads of Institutions, and academic leadership team guiding Pleasant View Schools in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function LeadershipPage() {
  const years = getYearsOfExistence();
  const leaders = await getLeadershipMessages(0).catch(() => []);

  return (
    <Page
      title="Leadership & Governance"
      subtitle="STEWARDSHIP & VISION"
      image="/images/banner_3_a.webp"
    >
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">EXECUTIVE STEWARDSHIP</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>
            Guided by Wisdom, Integrity &amp; Faith
          </h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }}>
            At Pleasant View Schools, leadership is servant leadership. Our Board of Directors, Executive Principal, and Heads of Institutions bring decades of educational expertise and an unwavering commitment to the academic and spiritual flourishing of every scholar.
          </p>
        </div>

        {/* LEADERSHIP ROSTER */}
        <div className="leadership-roster-grid">
          {leaders.map((lm, idx) => (
            <div key={lm.id || idx} className="leadership-profile-card">
              <div
                className="profile-img-header"
                style={{ backgroundImage: `url('${lm.image || '/images/banner_3_a.webp'}')` }}
              >
                <span className="profile-role-badge">
                  {lm.role || 'Leadership'}
                </span>
              </div>
              <div className="profile-body">
                <div>
                  <h3>{lm.name}</h3>
                  <span className="profile-title">{lm.title}</span>
                  <p>{lm.message}</p>
                </div>
                {lm.quote && (
                  <div className="profile-quote">
                    &ldquo;{lm.quote}&rdquo;
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* GOVERNANCE PRINCIPLES */}
        <div style={{
          background: 'var(--soft-bg)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          margin: '40px 0'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              OUR ETHICAL FOUNDATION
            </span>
            <h3 style={{ fontSize: '24px', color: 'var(--dark-grey)', margin: '4px 0' }}>
              Governance &amp; Quality Assurance Pillars
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-red)' }}>
              <strong style={{ display: 'block', fontSize: '16px', color: 'var(--dark-grey)', marginBottom: '4px' }}>
                100% TSC Certified Faculty
              </strong>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                Every teacher is registered by the Teachers Service Commission (TSC) and undergoes continuous CBE curriculum development.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-red)' }}>
              <strong style={{ display: 'block', fontSize: '16px', color: 'var(--dark-grey)', marginBottom: '4px' }}>
                Child Protection &amp; Safety
              </strong>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                Strict child safeguarding policies, 24/7 security perimeter controls, monitored transport, and health protocols.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-red)' }}>
              <strong style={{ display: 'block', fontSize: '16px', color: 'var(--dark-grey)', marginBottom: '4px' }}>
                Parent Advisory &amp; Partnership
              </strong>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                Termly Visiting Sundays (VISOs), academic clinics, and open communication channels between school leadership and families.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/admissions#visit" className="button button-gold" style={{ marginRight: '14px' }}>
            <i className="fa-regular fa-calendar-check" style={{ marginRight: '8px' }} /> Meet Us on Campus Tour
          </Link>
          <Link href="/contact" className="button button-tertiary">
            Contact Administration
          </Link>
        </div>
      </div>
    </Page>
  );
}
