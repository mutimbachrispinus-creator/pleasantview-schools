import Link from 'next/link';
import Slider from '@/components/Slider';
import VideoShowcase from '@/components/VideoShowcase';
import BackButton from '@/components/BackButton';
import { q, S, getSchool, getSchoolMapsUrl, getLeadershipMessages, getVideos } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SchoolHome({ params }) {
  const s = await getSchool((await params).school);
  if (!s) return null;
  const st = await S();
  const b = '/s/' + s.slug;
  const schoolLocation = s.location || st.location || 'Githunguri, Komothai Subcounty, Kiambu County';
  const schoolMapUrl = getSchoolMapsUrl(s, st.maps_url);

  const [hero, news, pics, leaders, vids] = await Promise.all([
    q('SELECT * FROM hero WHERE school_id=? OR school_id=0 ORDER BY CASE WHEN school_id=? THEN 0 ELSE 1 END, id DESC', [s.id, s.id]),
    q('SELECT * FROM posts WHERE school_id=? OR school_id=0 ORDER BY id DESC LIMIT 6', [s.id]),
    q('SELECT * FROM photos WHERE school_id=? OR school_id=0 ORDER BY id DESC', [s.id]),
    getLeadershipMessages(s.id).catch(() => []),
    getVideos(s.id).catch(() => [])
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

      {/* STATS BAR FOR THIS SCHOOL */}
      <section className="stats-bar-section" style={{ backgroundColor: 'var(--dark-navy)' }}>
        <div className="wrapper">
          <div className="stats-grid">
            <div className="stat-item">
              <b className="stat-num">{s.learners || '280 Students'}</b>
              <span>Total Enrolled</span>
            </div>
            <div className="stat-item">
              <b className="stat-num">{s.boarders || '220 Boarders'}</b>
              <span>Boarding Scholars</span>
            </div>
            <div className="stat-item">
              <b className="stat-num">{s.day_scholars || '60 Day Scholars'}</b>
              <span>Day Scholars</span>
            </div>
            <div className="stat-item">
              <b className="stat-num">{s.ratio || '1:20'}</b>
              <span>Learner : Teacher Ratio</span>
            </div>
            <div className="stat-item">
              <b className="stat-num">{s.founded || 'Established'}</b>
              <span>Established Year</span>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME / ABOUT SCHOOL */}
      <section className="subpage-body">
        <div className="wrapper">
          <BackButton fallback="/#schools" label="All Schools" current={s.name.replace(/Pleasantview/gi, 'Pleasant View')} />
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <span className="lead-badge reveal-on-scroll">WELCOME TO {s.category || 'OUR SCHOOL'}</span>
            <h2 className="reveal-on-scroll">Nurturing Distinction at {s.name.replace(/Pleasantview/gi, 'Pleasant View')}</h2>
            <div className="gold-divider reveal-on-scroll" style={{ marginLeft: 0 }} />

            <p className="scroll-word-reveal" style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '25px', color: '#333' }}>
              {s.about || s.welcome}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', margin: '35px 0' }}>
              <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '4px', borderLeft: `4px solid ${s.color || '#8B1E2D'}` }}>
                <h4 style={{ marginBottom: '10px' }}>School Vision</h4>
                <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6 }}>{s.vision || 'Cultivating intellectual curiosity and moral character.'}</p>
              </div>
              <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '4px', borderLeft: '4px solid var(--gold-accent)' }}>
                <h4 style={{ marginBottom: '10px' }}>School Mission</h4>
                <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6 }}>{s.mission || 'To prepare learners for future challenges with sound competencies and faith.'}</p>
              </div>
            </div>

            {leader && (
              <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderLeft: '4px solid var(--primary-navy)', borderRadius: '8px', padding: '24px', margin: '30px 0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <img
                    src={leader.image || '/images/banner_3_a.webp'}
                    alt={leader.name}
                    style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-accent)', flexShrink: 0 }}
                  />
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--primary-navy)', color: '#fff', padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                      {leader.role || 'Campus Leadership'}
                    </span>
                    <h4 style={{ margin: '6px 0 2px', color: 'var(--primary-navy)', fontSize: '17px' }}>{leader.name}</h4>
                    <small style={{ color: '#666', fontSize: '12.5px' }}>{leader.title}</small>
                  </div>
                </div>
                {leader.quote && (
                  <blockquote style={{ margin: '0 0 10px', padding: '10px 12px', background: 'var(--soft-bg)', borderLeft: '3px solid var(--gold-accent)', fontStyle: 'italic', fontSize: '13.5px', color: '#333' }}>
                    &ldquo;{leader.quote}&rdquo;
                  </blockquote>
                )}
                <p style={{ fontSize: '14.5px', color: '#444', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                  {leader.message}
                </p>
              </div>
            )}

            <div className="cta-button-group" style={{ marginTop: '40px' }}>
              <Link href={b + '/visit'} className="button button-secondary">
                Book a Visit to {s.name}
              </Link>
              <Link href={b + '/contact'} className="button button-gold">
                Contact Admissions Desk
              </Link>
              {(s.fees_url || st.fees_url) && (
                <a
                  href={s.fees_url || st.fees_url}
                  target={(s.fees_url || st.fees_url).startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="button"
                  style={{ background: 'var(--primary-navy)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="fa-solid fa-file-invoice-dollar" style={{ color: 'var(--gold-accent)' }} /> School Fees Schedule
                </a>
              )}
              <a
                href={schoolMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <i className="fa-solid fa-location-dot" /> Directions: {schoolLocation}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS VIDEO SHOWCASE */}
      {Array.isArray(vids) && vids.length > 0 && <VideoShowcase videos={vids} />}

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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
              {pics.map(p => (
                <div key={p.id} style={{ borderRadius: '8px', overflow: 'hidden', background: '#ffffff', border: '1px solid #dde2ec', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: '190px', overflow: 'hidden' }}>
                    <img src={p.image} alt={p.title || p.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  {(p.title || p.caption) && (
                    <div style={{ padding: '12px 14px' }}>
                      {p.title && <h4 style={{ margin: '0 0 4px', fontSize: '14.5px', color: 'var(--primary-navy)' }}>{p.title}</h4>}
                      {p.caption && <p style={{ margin: 0, fontSize: '12.5px', color: '#555', lineHeight: 1.45 }}>{p.caption}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
