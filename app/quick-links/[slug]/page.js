import Page from '@/components/Page';
import Link from 'next/link';
import { getQuickLinks } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const titles = {
    'term-dates': 'Term Dates & VISOs',
    'sports-fixtures': 'Sports Fixtures & Co-Curricular',
    'policies': 'Policies & Inspection Reports'
  };
  return {
    title: titles[slug] || 'Quick Links & Resources'
  };
}

export default async function QuickLinkPage({ params }) {
  const { slug } = await params;
  const quickLinks = await getQuickLinks();

  if (slug === 'term-dates') {
    return (
      <Page
        title="Term Dates & VISOs"
        subtitle="2026 ACADEMIC CALENDAR & VISITING SUNDAYS"
        image="/images/banner_2_a.webp"
      >
        <div className="quick-link-content">
          <span className="lead-badge">ACADEMIC SCHEDULE</span>
          <h2>2026 Academic Term Dates &amp; Visiting Days (VISOs)</h2>
          <div className="gold-divider" style={{ marginLeft: 0 }} />

          <p className="lead" style={{ fontSize: '17px', color: '#444', lineHeight: 1.7, marginBottom: '25px' }}>
            Pleasant View Schools operates a structured Christian-ethos calendar balancing rigorous Competency Based Curriculum (CBC) delivery, formative assessments, co-curricular adventures, and designated parent visiting days (VISOs).
          </p>

          <div style={{ display: 'grid', gap: '25px', margin: '30px 0' }}>
            {/* TERM 1 */}
            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '25px', borderLeft: '5px solid var(--primary-navy)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-navy)' }}>Term I (Opening — Easter Break)</h3>
                <span style={{ background: 'var(--soft-bg)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--primary-navy)' }}>
                  13 Weeks Duration
                </span>
              </div>
              <ul style={{ lineHeight: 2, color: '#555', paddingLeft: '20px' }}>
                <li><strong>Boarders Reporting:</strong> Monday, 6th January 2026 (9:00 AM &ndash; 4:00 PM)</li>
                <li><strong>Day Scholars Resumption:</strong> Tuesday, 7th January 2026 (7:30 AM)</li>
                <li><strong>Mid-Term Break &amp; VISO:</strong> 19th &ndash; 23rd February 2026</li>
                <li><strong>Parent Visiting Sunday (VISO):</strong> Sunday, 22nd February 2026 (1:00 PM &ndash; 5:00 PM)</li>
                <li><strong>Term I Closing Date:</strong> Friday, 3rd April 2026</li>
              </ul>
            </div>

            {/* TERM 2 */}
            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '25px', borderLeft: '5px solid var(--gold-accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--gold-dark)' }}>Term II (Winter &amp; Music/Drama Festivals)</h3>
                <span style={{ background: 'var(--soft-bg)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--gold-dark)' }}>
                  14 Weeks Duration
                </span>
              </div>
              <ul style={{ lineHeight: 2, color: '#555', paddingLeft: '20px' }}>
                <li><strong>Term Opening:</strong> Monday, 4th May 2026</li>
                <li><strong>Mid-Term Break &amp; VISO:</strong> 18th &ndash; 22nd June 2026</li>
                <li><strong>Annual Inter-House Sports Gala:</strong> Saturday, 11th July 2026</li>
                <li><strong>Parent Visiting Sunday (VISO):</strong> Sunday, 21st June 2026</li>
                <li><strong>Term II Closing Date:</strong> Friday, 7th August 2026</li>
              </ul>
            </div>

            {/* TERM 3 */}
            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '25px', borderLeft: '5px solid #28a745' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#155724' }}>Term III (National Examinations &amp; Valedictory)</h3>
                <span style={{ background: '#d4edda', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', color: '#155724' }}>
                  9 Weeks Duration
                </span>
              </div>
              <ul style={{ lineHeight: 2, color: '#555', paddingLeft: '20px' }}>
                <li><strong>Term Opening:</strong> Monday, 24th August 2026</li>
                <li><strong>KPSEA &amp; KJSEA Rehearsals:</strong> October 2026</li>
                <li><strong>KCSE Maiden Candidate Preparation:</strong> October &ndash; November 2026</li>
                <li><strong>School Closing / Graduation:</strong> Friday, 23rd October 2026</li>
              </ul>
            </div>
          </div>

          <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '8px', borderLeft: '4px solid var(--gold-accent)', margin: '30px 0' }}>
            <h4 style={{ marginBottom: '8px' }}><i className="fa-solid fa-clock" style={{ color: 'var(--gold-dark)', marginRight: '8px' }} /> Daily Reporting Routine</h4>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#555', lineHeight: 1.6 }}>
              Day scholar buses pick up from 6:00 AM across monitored Githunguri, Ruiru, and Kiambu routes. Morning devotion starts promptly at 7:45 AM. Afternoon departures begin at 3:45 PM (Early Learning) and 4:45 PM (Primary, JSS &amp; High School).
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/contact#visit" className="button button-secondary">
              Book a Campus Visit
            </Link>
            <Link href="/contact" className="button button-gold" style={{ marginLeft: '15px' }}>
              Contact Admissions
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  if (slug === 'sports-fixtures') {
    return (
      <Page
        title="Sports Fixtures & Co-Curricular"
        subtitle="ATHLETICS, TEAM SPORTS & ADVENTURE"
        image="/images/hero_sports_field.jpg"
      >
        <div className="quick-link-content">
          <span className="lead-badge">PILLAR III: BODIES</span>
          <h2>Athletic Fixtures, Tournaments &amp; Outdoor Adventure</h2>
          <div className="gold-divider" style={{ marginLeft: 0 }} />

          <p className="lead" style={{ fontSize: '17px', color: '#444', lineHeight: 1.7, marginBottom: '25px' }}>
            At Pleasant View Schools, sportsmanship and physical resilience are integral to whole-child development. Our students train on standard football grounds, basketball and volleyball courts, track fields, and participate in Kiambu County and East African inter-school tournaments.
          </p>

          <div style={{ display: 'grid', gap: '20px', margin: '30px 0' }}>
            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '22px', borderLeft: '4px solid var(--primary-navy)' }}>
              <h4 style={{ color: 'var(--primary-navy)', marginBottom: '8px' }}>⚽ Pleasant View Invitational Football Derby</h4>
              <p style={{ margin: '0 0 10px', color: '#555', fontSize: '14.5px' }}>Under-13 &amp; Under-16 Boys and Girls tournament hosting schools from across Kiambu and Nairobi.</p>
              <span style={{ fontSize: '13px', color: '#888' }}><i className="fa-regular fa-calendar" /> Bi-annual Tournament &bull; Main Sports Grounds</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '22px', borderLeft: '4px solid var(--gold-accent)' }}>
              <h4 style={{ color: 'var(--gold-dark)', marginBottom: '8px' }}>🏀 Basketball &amp; Volleyball League</h4>
              <p style={{ margin: '0 0 10px', color: '#555', fontSize: '14.5px' }}>Weekly inter-school matches for Junior Secondary and Senior School squads.</p>
              <span style={{ fontSize: '13px', color: '#888' }}><i className="fa-regular fa-calendar" /> Saturdays 9:00 AM &bull; Pleasant View Sports Pavilion</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '8px', padding: '22px', borderLeft: '4px solid #28a745' }}>
              <h4 style={{ color: '#155724', marginBottom: '8px' }}>🏃 Cross-Country &amp; Track Athletics Meet</h4>
              <p style={{ margin: '0 0 10px', color: '#555', fontSize: '14.5px' }}>Endurance running through scenic Githunguri trails fostering cardiovascular health, discipline, and grit.</p>
              <span style={{ fontSize: '13px', color: '#888' }}><i className="fa-regular fa-calendar" /> Annual Term I Event &bull; Highlands Trail Course</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/about#sports" className="button button-secondary">
              Explore All Sports &amp; Clubs
            </Link>
            <Link href="/contact#visit" className="button button-gold" style={{ marginLeft: '15px' }}>
              Visit Our Sports Facilities
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  // Fallback for general quick links
  return (
    <Page
      title="Quick Links Hub"
      subtitle="PLEASANT VIEW PORTAL GATEWAYS"
      image="/images/banner_1_a.webp"
    >
      <div className="quick-link-content">
        <span className="lead-badge">ESSENTIAL RESOURCES</span>
        <h2>Pleasant View Schools &ndash; Quick Links</h2>
        <div className="gold-divider" style={{ marginLeft: 0 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '30px 0' }}>
          {quickLinks.map(l => (
            <Link
              key={l.id}
              href={l.url}
              style={{
                display: 'block',
                background: '#ffffff',
                border: '1px solid #dde2ec',
                borderRadius: '8px',
                padding: '24px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.25s ease'
              }}
              className="quick-link-card"
            >
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--gold-dark)', background: 'var(--soft-bg)', padding: '3px 8px', borderRadius: '3px' }}>
                {l.category || 'Quick Link'}
              </span>
              <h3 style={{ fontSize: '18px', margin: '12px 0 8px', color: 'var(--primary-navy)' }}>
                {l.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#666', margin: 0, lineHeight: 1.5 }}>
                {l.description || 'Access essential resource and information.'}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '13px', fontWeight: 700, color: 'var(--medium-blue)' }}>
                Open Link <i className="fa-solid fa-arrow-right-long" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Page>
  );
}
