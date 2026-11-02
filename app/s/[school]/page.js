import Link from 'next/link';
import Slider from '@/components/Slider';
import BackButton from '@/components/BackButton';
import { q, getSchool, getLeadershipMessages } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SchoolHome({ params }) {
  const s = await getSchool((await params).school);
  if (!s) return null;
  const b = '/s/' + s.slug;

  const [hero, news, pics, leaders] = await Promise.all([
    q('SELECT * FROM hero WHERE school_id=? ORDER BY sort ASC, id ASC', [s.id]),
    q('SELECT * FROM posts WHERE school_id=? ORDER BY id DESC LIMIT 3', [s.id]),
    q('SELECT * FROM photos WHERE school_id=? ORDER BY id DESC LIMIT 8', [s.id]),
    getLeadershipMessages(s.id)
  ]);

  const leader = leaders.find(l => l.school_id === s.id) || leaders[0];

  const slides = hero.length
    ? hero.map(h => ({
        id: h.id,
        image: h.image,
        headline: h.headline,
        sub: h.sub,
        button_text: h.button_text,
        button_link: h.button_link,
        button_alt_text: h.button_alt_text,
        button_alt_link: h.button_alt_link
      }))
    : [
        {
          image: s.image || '/images/banner_1_a.webp',
          headline: s.name.toUpperCase(),
          sub: s.tagline || `${s.category} — ${s.level}`,
          button_text: 'Apply to ' + s.name,
          button_link: b + '/contact',
          button_alt_text: 'Book a Campus Visit',
          button_alt_link: b + '/visit'
        }
      ];

  return (
    <>
      <Slider slides={slides} base={b} />

      {/* STATS BAR FOR THIS DIVISION */}
      <section className="stats-bar-section" style={{ backgroundColor: 'var(--dark-navy)' }}>
        <div className="wrapper">
          <div className="stats-grid">
            <div className="stat-item">
              <b>{s.learners || '500+'}</b>
              <span>Enrolled Learners</span>
            </div>
            <div className="stat-item">
              <b>{s.boarders || '200+'}</b>
              <span>Boarding Capacity</span>
            </div>
            <div className="stat-item">
              <b>{s.ratio || '1:20'}</b>
              <span>Learner : Teacher Ratio</span>
            </div>
            <div className="stat-item">
              <b>{s.founded || 'Established'}</b>
              <span>Established Year</span>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME / ABOUT DIVISION */}
      <section className="subpage-body">
        <div className="wrapper">
          <BackButton fallback="/#schools" label="All Schools" />
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <span className="lead-badge">WELCOME TO {s.category || 'OUR DIVISION'}</span>
            <h2>Nurturing Distinction at {s.name}</h2>
            <div className="gold-divider" style={{ marginLeft: 0 }} />

            <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '25px', color: '#333' }}>
              {s.about || s.welcome}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', margin: '35px 0' }}>
              <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '4px', borderLeft: `4px solid ${s.color || '#8B1E2D'}` }}>
                <h4 style={{ marginBottom: '10px' }}>Division Vision</h4>
                <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6 }}>{s.vision || 'Cultivating intellectual curiosity and moral character.'}</p>
              </div>
              <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '4px', borderLeft: '4px solid var(--gold-accent)' }}>
                <h4 style={{ marginBottom: '10px' }}>Division Mission</h4>
                <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6 }}>{s.mission || 'To prepare learners for future challenges with sound competencies and faith.'}</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href={b + '/visit'} className="button button-secondary">
                Book a Visit to {s.name}
              </Link>
              <Link href={b + '/contact'} className="button button-gold" style={{ marginLeft: '15px' }}>
                Contact Admissions Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST NEWS FOR THIS SCHOOL */}
      {news.length > 0 && (
        <section className="news-posts-section" style={{ background: 'var(--soft-bg)' }}>
          <div className="wrapper">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h5>CAMPUS UPDATES</h5>
              <h3>Latest from {s.name}</h3>
              <div className="gold-divider" />
            </div>

            <div className="news-grid">
              {news.map(p => (
                <div key={p.id} className="single-news-item">
                  <Link className="single-news-image" href={`/news/${p.slug}`}>
                    <img src={p.image || '/images/banner_2_a.webp'} alt={p.title} />
                    <div className="news-arrow-badge">
                      <i className="fa-solid fa-arrow-right-long" />
                    </div>
                  </Link>
                  <div className="single-news-content">
                    <h6>{s.name}</h6>
                    <h4><Link href={`/news/${p.slug}`}>{p.title}</Link></h4>
                    <span className="news-date">
                      <i className="fa-regular fa-calendar" style={{ marginRight: '6px' }} />
                      {p.created.slice(0, 10)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIFE AT CAMPUS GALLERY */}
      {pics.length > 0 && (
        <section className="subpage-body">
          <div className="wrapper">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h5>CAMPUS MOMENTS</h5>
              <h3>Life at {s.name}</h3>
              <div className="gold-divider" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
              {pics.map(p => (
                <div key={p.id} style={{ borderRadius: '4px', overflow: 'hidden', height: '180px' }}>
                  <img src={p.image} alt={p.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
