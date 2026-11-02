import Link from 'next/link';
import Slider from '@/components/Slider';
import VmvSlideshow from '@/components/VmvSlideshow';
import VideoShowcase from '@/components/VideoShowcase';
import { q, S, schools, getVideos, getLeadershipMessages, getQuickLinks, getSeniorAssessmentInfo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const seniorInfo = getSeniorAssessmentInfo();
  const [hero, news, sch, st, vids, leadMessages, quickLinks] = await Promise.all([
    q('SELECT * FROM hero WHERE school_id=0 ORDER BY sort ASC, id ASC'),
    q('SELECT p.*, s.name sname FROM posts p LEFT JOIN schools s ON s.id=p.school_id ORDER BY p.id DESC LIMIT 3'),
    schools(),
    S(),
    getVideos(0),
    getLeadershipMessages(0),
    getQuickLinks()
  ]);

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
          image: '/images/hero_science_lab.jpg',
          headline: 'PLEASANT VIEW SCHOOLS',
          sub: 'Our Aim is Victory — Transforming Hearts, Minds, Bodies and Souls of Tomorrow’s Leaders',
          button_text: 'Discover More',
          button_link: '/#pillars',
          button_alt_text: 'Book A Visit',
          button_alt_link: '/contact#visit'
        },
        {
          image: '/images/hero_sports_field.jpg',
          headline: 'HOLISTIC CHARACTER & ADVENTURE',
          sub: 'Cultivating sportsmanship, physical resilience, teamwork, and Christian leadership on expansive green grounds',
          button_text: 'Sports & Co-Curricular',
          button_link: '/quick-links/sports-fixtures',
          button_alt_text: 'Our Campuses',
          button_alt_link: '/#schools'
        },
        {
          image: '/images/hero_library_learning.jpg',
          headline: '24 YEARS OF ACADEMIC DISTINCTION',
          sub: 'Outstanding KPSEA (EE — Exceeding Expectations) and KJSEA (ME1) distinction, with maiden Senior School B+ university transition',
          button_text: 'Academic Curriculum',
          button_link: '/about#academics',
          button_alt_text: 'Apply Now',
          button_alt_link: '/contact'
        }
      ];

  const primaryLeader = leadMessages[0] || {
    name: 'Board of Directors & Executive Principal',
    title: 'Pleasantview Schools Group',
    role: 'Director',
    quote: 'Our aim is victory — not merely in examinations, but in shaping disciplined, visionary young people who lead with wisdom, faith, and purpose.',
    message: 'Welcome to Pleasantview Schools. For over two decades, our community has stood as a beacon of academic excellence and character development in Kiambu County. We believe that true education nurtures the mind while fortifying the soul. Whether in our early learning centre, thriving primary school, modern Junior Secondary (JSS), or distinguished Senior School, we provide state-of-the-art science laboratories, extensive transport coverage, and world-class pastoral boarding.',
    image: '/images/banner_3_a.webp'
  };

  const testimonials = [
    {
      name: 'Caroline Mburu',
      role: 'Lawyer & Pleasantview Parent',
      quote: 'This school is good and I am very happy with it. They have all the modern facilities that pupils need and demonstrate deep pastoral responsibility for every child’s growth.'
    },
    {
      name: 'Wilson Solonka',
      role: 'Civil Engineer & Parent',
      quote: 'The final processed product from Pleasantview Schools is Pretty Pleasant. My niece and nephew are already there and their academic confidence and discipline are outstanding.'
    },
    {
      name: 'Samuel Karonjo',
      role: 'Businessman & Parent',
      quote: 'My son went through Pleasantview from early primary all the way through, and I am immensely proud of the institution. I highly recommend it to any parent seeking true excellence.'
    }
  ];

  return (
    <>
      <Slider slides={slides} base="" />

      {/* QUICK OVERVIEW GATEWAY BAR (St Andrew's Turi Match) */}
      <section className="quick-overview-bar" aria-label="Key Gateways">
        <div className="wrapper" style={{ padding: 0 }}>
          <div className="overview-grid">
            <Link href="/#schools" className="overview-card">
              <div className="overview-icon-box">
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <div className="overview-meta">
                <h4>Academic Stages</h4>
                <p>Early Years &bull; Primary &bull; JSS &bull; High School</p>
              </div>
            </Link>

            <Link href="/about#boarding" className="overview-card">
              <div className="overview-icon-box">
                <i className="fa-solid fa-house-chimney-window" />
              </div>
              <div className="overview-meta">
                <h4>Boarding Life</h4>
                <p>Nurturing home-away-from-home from Grade 4</p>
              </div>
            </Link>

            <Link href="/about#transport" className="overview-card">
              <div className="overview-icon-box">
                <i className="fa-solid fa-bus-simple" />
              </div>
              <div className="overview-meta">
                <h4>School Transport</h4>
                <p>Safe monitored routes across Kiambu &amp; Nairobi</p>
              </div>
            </Link>

            <Link href="/contact#visit" className="overview-card">
              <div className="overview-icon-box">
                <i className="fa-regular fa-calendar-check" />
              </div>
              <div className="overview-meta">
                <h4>Book Campus Visit</h4>
                <p>Personalized walking tour &amp; admissions consult</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PLEASANTVIEW AT A GLANCE (The Dunham School & The Walker School Signature Metrics) */}
      <section className="at-a-glance-section" aria-label="Pleasantview at a Glance">
        <div className="wrapper">
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <span style={{ color: 'var(--gold-accent)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              DISTINCTION BY NUMBERS
            </span>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(26px, 2.8vw, 36px)', fontFamily: 'Cinzel, serif', margin: '6px 0 0' }}>
              Pleasantview at a Glance
            </h2>
            <div className="gold-divider" style={{ margin: '12px auto' }} />
          </div>

          <div className="at-a-glance-grid">
            <div className="at-a-glance-card">
              <div className="stat-num">24+</div>
              <div className="stat-label">Years of Excellence</div>
              <div className="stat-desc">Est. 1998 in Githunguri, Kiambu</div>
            </div>

            <div className="at-a-glance-card">
              <div className="stat-num">EE &amp; ME1</div>
              <div className="stat-label">KPSEA &amp; KJSEA Average</div>
              <div className="stat-desc">Exceeding Expectations &amp; Level 1 Distinction</div>
            </div>

            <div className="at-a-glance-card">
              <div className="stat-num">{seniorInfo.exam} B+</div>
              <div className="stat-label">Senior School Transition</div>
              <div className="stat-desc">{seniorInfo.subtext}</div>
            </div>

            <div className="at-a-glance-card">
              <div className="stat-num">1:20</div>
              <div className="stat-label">Teacher-Student Ratio</div>
              <div className="stat-desc">Personalized CBC Competency Coaching</div>
            </div>

            <div className="at-a-glance-card">
              <div className="stat-num">600+</div>
              <div className="stat-label">Boarding Scholars</div>
              <div className="stat-desc">Loving Pastoral Care from Grade 4+</div>
            </div>

            <div className="at-a-glance-card">
              <div className="stat-num">100%</div>
              <div className="stat-label">TSC Certified Faculty</div>
              <div className="stat-desc">Trained CBC Facilitators &amp; Mentors</div>
            </div>
          </div>
        </div>
      </section>

      {/* TEXT INTRODUCTION (PLEASANT VIEW SCHOOLS – OUR AIM IS VICTORY) */}
      <section className="text-component">
        <div className="wrapper">
          <span className="lead-badge">24 YEARS OF ACADEMIC EMINENCE</span>
          <h2>PLEASANT VIEW SCHOOLS &ndash; OUR AIM IS VICTORY</h2>
          <div className="gold-divider" />
          <p className="lead">
            Founded in 1998, Pleasant View Schools has grown from a visionary primary institution into one of Kenya&apos;s most celebrated Christian-ethos day and boarding academic institutions, situated amidst the peaceful green highlands of Githunguri, Komothai Subcounty, Kiambu County.
          </p>
          <p className="body-text" style={{ fontSize: '16.5px', lineHeight: 1.85, color: '#444' }}>
            Across our 24-year academic journey, Pleasant View has consistently maintained distinguished performance, achieving an institutional average of <strong>EE (Exceeding Expectations)</strong> in KPSEA and <strong>ME1 (Meeting Expectations &ndash; Top Tier)</strong> in KJSEA, positioning our scholars permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic maiden mean grade of <strong>B+</strong> in KCSE examinations. As the 8-4-4 system concludes at the end of next year, our Senior School is dynamically transitioning into the <strong>Kenya Senior School Education Assessment (KSSEA)</strong>, supported by state-of-the-art Pre-Technical, Integrated Science, Agriculture, and Digital STEM hubs designed to nurture each child&apos;s pathway into top university distinction and ethical global leadership.
          </p>
        </div>
      </section>

      {/* THE FOUR PILLARS SECTION (Hearts, Minds, Bodies and Souls - St Andrew's Turi Match) */}
      <section className="four-pillars-section" id="pillars">
        <div className="wrapper">
          <div className="pillars-header">
            <h5>HOLISTIC CHRISTIAN EDUCATION</h5>
            <h2>Transforming Hearts, Minds, Bodies &amp; Souls</h2>
            <div className="gold-divider" />
            <p className="lead" style={{ fontSize: '17px', color: '#555', margin: 0 }}>
              Guided by our motto &ldquo;Our Aim is Victory&rdquo;, we educate the whole child through four foundational pillars that equip every learner to thrive academically, spiritually, and socially.
            </p>
          </div>

          <div className="pillars-grid">
            {/* PILLAR 1: MINDS */}
            <div className="pillar-card">
              <div className="pillar-header-img" style={{ backgroundImage: `url('/images/banner_2_a.webp')` }}>
                <div className="overlay" />
                <span className="pillar-tag">Pillar I</span>
                <div className="pillar-icon-badge">
                  <i className="fa-solid fa-brain" />
                </div>
              </div>
              <div className="pillar-body">
                <h4>Minds &ndash; Academic Eminence</h4>
                <p>
                  Distinction averaging EE (Exceeding Expectations) in KPSEA and ME1 in KJSEA, with maiden Senior School B+ university transition and STEM mastery.
                </p>
                <Link href="/about#academics" className="pillar-link">
                  Academic Curriculum <i className="fa-solid fa-arrow-right-long" />
                </Link>
              </div>
            </div>

            {/* PILLAR 2: HEARTS */}
            <div className="pillar-card">
              <div className="pillar-header-img" style={{ backgroundImage: `url('/images/gallery_2.webp')` }}>
                <div className="overlay" />
                <span className="pillar-tag">Pillar II</span>
                <div className="pillar-icon-badge">
                  <i className="fa-solid fa-heart" />
                </div>
              </div>
              <div className="pillar-body">
                <h4>Hearts &ndash; Pastoral Care</h4>
                <p>
                  Family-style boarding from Grade 4 upwards with resident houseparents, dedicated mentors, and individualized emotional support ensuring every child feels valued.
                </p>
                <Link href="/about#boarding" className="pillar-link">
                  Pastoral Boarding <i className="fa-solid fa-arrow-right-long" />
                </Link>
              </div>
            </div>

            {/* PILLAR 3: BODIES */}
            <div className="pillar-card">
              <div className="pillar-header-img" style={{ backgroundImage: `url('/images/hero_sports_field.jpg')` }}>
                <div className="overlay" />
                <span className="pillar-tag">Pillar III</span>
                <div className="pillar-icon-badge">
                  <i className="fa-solid fa-person-running" />
                </div>
              </div>
              <div className="pillar-body">
                <h4>Bodies &ndash; Sports &amp; Adventure</h4>
                <p>
                  Competitive athletics, football, basketball, volleyball, and co-curricular outdoor exploration cultivating physical stamina, grit, and teamwork.
                </p>
                <Link href="/quick-links/sports-fixtures" className="pillar-link">
                  Sports Fixtures &amp; Clubs <i className="fa-solid fa-arrow-right-long" />
                </Link>
              </div>
            </div>

            {/* PILLAR 4: SOULS */}
            <div className="pillar-card">
              <div className="pillar-header-img" style={{ backgroundImage: `url('/images/gallery_8.webp')` }}>
                <div className="overlay" />
                <span className="pillar-tag">Pillar IV</span>
                <div className="pillar-icon-badge">
                  <i className="fa-solid fa-cross" />
                </div>
              </div>
              <div className="pillar-body">
                <h4>Souls &ndash; Christian Character</h4>
                <p>
                  Rooted in Christian faith and ethics, instilling unwavering courage, integrity, compassion, and servant leadership so pupils impact society with moral purpose.
                </p>
                <Link href="/about#christian" className="pillar-link">
                  Christian Ethos <i className="fa-solid fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE WALKER SCHOOL INSPIRED PROGRAM FINDER */}
      <section className="program-finder-section" id="programs">
        <div className="wrapper">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
            <span style={{ color: 'var(--gold-dark)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              CHOOSE YOUR CHILD&apos;S PATHWAY
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 2.6vw, 36px)', fontFamily: 'Cinzel, serif', color: 'var(--primary-navy)', margin: '6px 0' }}>
              Explore Programs by Academic Division
            </h2>
            <div className="gold-divider" style={{ margin: '12px auto' }} />
            <p style={{ color: '#666', fontSize: '15px' }}>
              From early childhood playgroup through senior high school graduation, discover our age-tailored CBC and 8.4.4 academic programs.
            </p>
          </div>

          <div className="program-finder-grid">
            {sch.map(s => (
              <div key={s.id} className="program-card">
                <div
                  className="program-card-img"
                  style={{ backgroundImage: `url('${s.image || '/images/banner_1_a.webp'}')` }}
                >
                  <span className="program-card-badge">{s.category || 'Division'}</span>
                </div>
                <div className="program-card-body">
                  <h4>{s.name}</h4>
                  <div className="program-level">{s.level}</div>
                  <p>{s.tagline || s.about?.slice(0, 110) + '...' || 'Distinctive academic program tailored for holistic excellence.'}</p>
                  <div className="program-card-meta">
                    <span>Enrolled: <strong>{s.learners || 'Enrolled'}</strong></span>
                    <span>Boarding: <strong>{s.boarders || 'Day & Boarding'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/s/${s.slug}`} className="button button-primary" style={{ flex: 1, padding: '8px', fontSize: '12.5px', textAlign: 'center' }}>
                      Explore Campus
                    </Link>
                    <Link href={`/s/${s.slug}/contact`} className="button button-gold" style={{ padding: '8px 12px', fontSize: '12.5px' }}>
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SHOWCASE SECTION (Admins upload / update video links) */}
      <VideoShowcase videos={vids} />

      {/* EXECUTIVE & LEADERSHIP MESSAGE (DIRECTOR / HOI) */}
      <section className="director-welcome-section" id="leadership">
        <div className="wrapper">
          <div className="director-container">
            <div className="director-image-wrapper">
              <img
                src={primaryLeader.image || '/images/banner_3_a.webp'}
                alt={primaryLeader.name}
                className="director-portrait"
              />
              <div className="director-frame-badge">
                <i className="fa-solid fa-award" style={{ marginRight: '8px', color: 'var(--gold-accent)' }} />
                24 Years of Leadership
              </div>
            </div>

            <div className="director-content">
              <h5>{primaryLeader.role ? primaryLeader.role.toUpperCase() : "EXECUTIVE LEADERSHIP MESSAGE"}</h5>
              <h2>A Tradition of Victory &amp; Academic Eminence</h2>
              <div className="gold-divider" style={{ margin: '0 0 25px 0' }} />
              {primaryLeader.quote && (
                <div className="director-quote">
                  &ldquo;{primaryLeader.quote}&rdquo;
                </div>
              )}
              <p style={{ whiteSpace: 'pre-line' }}>
                {primaryLeader.message}
              </p>
              <div className="director-signature">
                {primaryLeader.name}
              </div>
              <span className="director-title">{primaryLeader.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS HUB RIBBON */}
      <section style={{ background: '#ffffff', padding: '50px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <span style={{ color: 'var(--gold-dark)', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>FAST DIRECTORY</span>
              <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: 'var(--primary-navy)', fontSize: '24px' }}>Essential Quick Links</h3>
            </div>
            <Link href="/quick-links" className="button button-tertiary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              View All Portals &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
            {quickLinks.slice(0, 6).map(l => (
              <Link
                key={l.id}
                href={l.url}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'var(--soft-bg)',
                  border: '1px solid #dde2ec',
                  borderRadius: '6px',
                  padding: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.25s ease'
                }}
                className="quick-gateway-card"
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary-navy)' }}>{l.title}</h4>
                  <small style={{ color: '#777', fontSize: '12px' }}>{l.category}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDESHOW (VISION, MISSION, VALUES) */}
      <VmvSlideshow
        vision={st.vision}
        mission={st.mission}
        values={st.values}
        motto={st.motto}
      />

      {/* NEWS POSTS (TURI SPLIT SLIDER LAYOUT) */}
      <section className="news-posts-section">
        <div className="wrapper">
          <div className="news-split-container">
            <div className="news-static-box">
              <h5>WHAT&apos;S HAPPENING</h5>
              <h3>Latest News &amp; Stories</h3>
              <div className="line" />
              <p>Stay informed with updates on examinations, co-curricular highlights, academic symposiums, and admissions across all Pleasantview campuses.</p>
              <Link className="button button-secondary" href="/news">
                All News &amp; Updates
              </Link>
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
                    <h6>{p.category || p.sname || 'School News'}</h6>
                    <h4>
                      <Link href={`/news/${p.slug}`}>{p.title}</Link>
                    </h4>
                    <p className="excerpt">
                      {p.body ? p.body.slice(0, 130) + '...' : 'Read the latest updates and announcements.'}
                    </p>
                    <span className="news-date">
                      <i className="fa-regular fa-calendar" style={{ marginRight: '6px' }} />
                      {p.created ? p.created.slice(0, 10) : '2026-11-01'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="wrapper">
          <div className="testimonials-header">
            <h5>TESTIMONIALS &amp; TRUST</h5>
            <h3>What Parents Say About Pleasantview</h3>
            <div className="gold-divider" />
          </div>

          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.name} className="testimonial-card">
                <div>
                  <div className="quote-icon"><i className="fa-solid fa-quote-left" /></div>
                  <p className="testimonial-text">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name.charAt(0)}</div>
                  <div className="author-info">
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUS LIFE: TRANSPORT & BOARDING */}
      <section className="facilities-spotlight">
        <div className="wrapper">
          <div className="spotlight-grid">
            <div className="spotlight-box" style={{ backgroundImage: `url('/images/gallery_7.webp')` }}>
              <div className="overlay" />
              <div className="spotlight-box-content">
                <h5>SAFE &amp; RELIABLE COMMUTE</h5>
                <h3>Taking School Transport?</h3>
                <p>Our comprehensive fleet of modern, monitored school buses serves Githunguri, Ruiru, Kiambu, and nearby areas, ensuring timely, safe transit under caring staff supervision.</p>
                <Link href="/contact" className="button button-gold">
                  Enquire Transport Routes
                </Link>
              </div>
            </div>

            <div className="spotlight-box" style={{ backgroundImage: `url('/images/gallery_2.webp')` }}>
              <div className="overlay" />
              <div className="spotlight-box-content">
                <h5>PASTORAL CARE &amp; COMMUNITY</h5>
                <h3>Boarding Life from Grade 4</h3>
                <p>A warm, secure home-away-from-home fostering independent study, Christian discipleship, healthy nutrition, and lifelong peer friendships in modern dormitories.</p>
                <Link href="/contact#visit" className="button button-primary">
                  Tour Our Boarding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
