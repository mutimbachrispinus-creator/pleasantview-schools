import Link from 'next/link';
import Page from '@/components/Page';

export const metadata = {
  title: 'Sports, Arts & Co-Curricular Activities | Pleasant View Schools',
  description: 'Explore sports, championship athletics, music, drama, robotics, and leadership clubs at Pleasant View Schools in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function CoCurricularPage() {
  const sports = [
    { title: 'Football & Rugby', icon: 'fa-futbol', desc: 'Championship highland soccer and rugby teams competing in inter-school tournaments across Kiambu and national circuits.' },
    { title: 'Track & Cross-Country Athletics', icon: 'fa-person-running', desc: 'High-altitude training on green running tracks cultivating endurance, stamina, and national championship qualification.' },
    { title: 'Volleyball & Basketball', icon: 'fa-volleyball', desc: 'Dedicated hard courts and grass courts with daily training clinics, inter-house leagues, and competitive matches.' },
    { title: 'Badminton & Table Tennis', icon: 'fa-table-tennis-paddle-ball', desc: 'Indoor recreation developing quick reflexes, hand-eye coordination, and friendly sportsmanship.' }
  ];

  const artsAndClubs = [
    { title: 'Music Studio & School Choir', icon: 'fa-music', desc: 'Vocal training, brass, keyboards, traditional instruments, and award-winning performances at Kenya Music Festivals.' },
    { title: 'Drama, Elocution & Theatre', icon: 'fa-masks-theater', desc: 'Annual theatrical productions, poetry recitation, public speaking, and dramatic storytelling fostering stage confidence.' },
    { title: 'Robotics & Coding Society', icon: 'fa-robot', desc: 'Hands-on programming, micro-controller assembly, digital algorithm design, and national robotics challenges.' },
    { title: 'Kenya Scouts & St. John Ambulance', icon: 'fa-campground', desc: 'Outdoor survival camping, first-aid certification, discipline, community service, and environmental stewardship.' },
    { title: 'Debate, Model UN & Public Speaking', icon: 'fa-comments', desc: 'Sharpening persuasive rhetoric, global geopolitics awareness, and critical cross-examination skills.' },
    { title: 'Young Farmers & Environmental Club', icon: 'fa-seedling', desc: 'CBE agriculture projects, greenhouse cultivation, tree planting, and sustainable environmental conservation.' }
  ];

  return (
    <Page
      title="Sports, Arts & Co-Curricular"
      subtitle="BEYOND THE CLASSROOM"
      image="/images/hero_sports_field.jpg"
    >
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">HOLISTIC EXCELLENCE</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>
            Cultivating Passion, Grit &amp; Teamwork
          </h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }}>
            At Pleasant View Schools, co-curricular engagement is an essential pillar of character development. Through competitive athletics, musical performance, digital innovation, and outdoor exploration, our learners build resilience, teamwork, and creative expression.
          </p>
        </div>

        {/* SPORTS HIGHLIGHT */}
        <div style={{ margin: '40px 0 50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="lead-badge">HIGH-ALTITUDE TRAINING</span>
              <h3 style={{ fontSize: '24px', color: 'var(--dark-grey)', margin: '4px 0 0' }}>Sports &amp; Athletics Eminence</h3>
            </div>
            <Link href="/quick-links/sports-fixtures" className="button button-tertiary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              View Sports Fixtures &rarr;
            </Link>
          </div>

          <div className="cocurricular-grid">
            {sports.map((sp, idx) => (
              <div key={idx} className="cocurricular-card">
                <div className="cocurricular-icon">
                  <i className={`fa-solid ${sp.icon}`} />
                </div>
                <h4>{sp.title}</h4>
                <p>{sp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CREATIVE ARTS & CLUBS */}
        <div style={{ margin: '50px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="lead-badge">CREATIVITY &amp; SERVICE</span>
            <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', color: 'var(--primary-navy)', margin: '6px 0' }}>
              Creative Arts, Societies &amp; Clubs
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Over 15 active clubs and societies meet weekly under expert staff mentorship.
            </p>
          </div>

          <div className="cocurricular-grid">
            {artsAndClubs.map((club, idx) => (
              <div key={idx} className="cocurricular-card">
                <div className="cocurricular-icon">
                  <i className={`fa-solid ${club.icon}`} />
                </div>
                <h4>{club.title}</h4>
                <p>{club.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PICTORIAL SPOTLIGHT */}
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
              PHOTO MEMORIES
            </span>
            <h3 style={{ color: '#ffffff', fontSize: 'clamp(22px, 2.4vw, 32px)', margin: '8px 0 16px', fontFamily: 'var(--font-serif)' }}>
              See Pleasant View in Action
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.75, marginBottom: '22px' }}>
              From soccer trophies and music gala solos to robotics demonstrations and highland cross-country meets, browse hundreds of verified photographs of school life.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/pictorial" className="button button-gold">
                <i className="fa-solid fa-camera-retro" style={{ marginRight: '8px' }} /> Explore School Pictorial
              </Link>
              <Link href="/admissions#visit" className="button button-primary">
                Book Campus Visit
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <img src="/images/hero_sports_field.jpg" alt="Pleasant View Sports" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
            <img src="/images/gallery_10.webp" alt="Creative Arts" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
            <img src="/images/gallery_8.webp" alt="Chapel & Fellowship" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
            <img src="/images/banner_2_a.webp" alt="Academics" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    </Page>
  );
}
