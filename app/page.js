import Link from 'next/link';
import Slider from '@/components/Slider';
import VmvSlideshow from '@/components/VmvSlideshow';
import VideoShowcase from '@/components/VideoShowcase';
import PictorialGallery from '@/components/PictorialGallery';
import {
  q,
  S,
  schools,
  getVideos,
  getLeadershipMessages,
  getQuickLinks,
  getSeniorAssessmentInfo,
  getGlanceMetrics,
  getParentTestimonials,
  getLearnerTestimonials,
  getAlumniStories,
  getEvents,
  getPhotos
} from '@/lib/db';
import PublicFormEnhancer from '@/components/PublicFormEnhancer';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const sp = (await searchParams) || {};
  const isReviewSubmitted = Boolean(sp?.review_submitted);
  const seniorInfo = getSeniorAssessmentInfo();

  let hero = [];
  let news = [];
  let sch = [];
  let st = {};
  let vids = [];
  let leadMessages = [];
  let quickLinks = [];
  let glanceMetrics = [];
  let approvedTestimonials = [];
  let learnerVoices = [];
  let alumniStories = [];
  let events = [];
  let schoolLifePhotos = [];

  try {
    const [
      heroRes,
      newsRes,
      schRes,
      stRes,
      vidsRes,
      leadMessagesRes,
      quickLinksRes,
      glanceMetricsRes,
      approvedTestimonialsRes,
      learnerVoicesRes,
      alumniStoriesRes,
      eventsRes,
      photosRes
    ] = await Promise.all([
      q('SELECT * FROM hero ORDER BY id DESC').catch(() => []),
      q('SELECT p.*, s.name sname FROM posts p LEFT JOIN schools s ON s.id=p.school_id ORDER BY p.id DESC LIMIT 12').catch(() => []),
      schools().catch(() => []),
      S().catch(() => ({})),
      getVideos(0).catch(() => []),
      getLeadershipMessages(0).catch(() => []),
      getQuickLinks().catch(() => []),
      getGlanceMetrics().catch(() => []),
      getParentTestimonials('approved').catch(() => []),
      getLearnerTestimonials().catch(() => []),
      getAlumniStories(false).catch(() => []),
      getEvents(0).catch(() => []),
      getPhotos().catch(() => [])
    ]);

    hero = Array.isArray(heroRes) ? heroRes : [];
    news = Array.isArray(newsRes) ? newsRes : [];
    sch = Array.isArray(schRes) ? schRes : [];
    st = stRes || {};
    vids = Array.isArray(vidsRes) ? vidsRes : [];
    leadMessages = Array.isArray(leadMessagesRes) ? leadMessagesRes : [];
    quickLinks = Array.isArray(quickLinksRes) ? quickLinksRes : [];
    glanceMetrics = Array.isArray(glanceMetricsRes) ? glanceMetricsRes : [];
    approvedTestimonials = Array.isArray(approvedTestimonialsRes) ? approvedTestimonialsRes : [];
    learnerVoices = Array.isArray(learnerVoicesRes) ? learnerVoicesRes : [];
    alumniStories = Array.isArray(alumniStoriesRes) ? alumniStoriesRes : [];
    events = Array.isArray(eventsRes) ? eventsRes : [];
    schoolLifePhotos = Array.isArray(photosRes) ? photosRes : [];
  } catch (err) {
    console.warn('[Home Data Fetch Fallback]:', err?.message);
  }

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
    title: 'Pleasant View Schools Group',
    role: 'Director',
    quote: 'Our aim is victory — not merely in examinations, but in shaping disciplined, visionary young people who lead with wisdom, faith, and purpose.',
    message: 'Welcome to Pleasant View Schools. For over two decades, our community has stood as a beacon of academic excellence and character development in Kiambu County. We believe that true education nurtures the mind while fortifying the soul. Whether in our early learning centre, thriving primary school, modern Junior Secondary (JSS), or distinguished Senior School, we provide state-of-the-art science laboratories, extensive transport coverage, and world-class pastoral boarding.',
    image: '/images/banner_3_a.webp'
  };

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

      {/* COMMUNITY VOICES & PERSPECTIVES FAST-NAV RIBBON */}
      <section className="voices-nav-ribbon" aria-label="Community Perspectives Directory" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '36px 0' }}>
        <div className="wrapper">
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <span style={{ color: 'var(--primary-red)', fontSize: '11.5px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              VOICES OF OUR SCHOOL COMMUNITY
            </span>
            <h3 style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', color: 'var(--primary-navy)', margin: '4px 0 8px', fontFamily: 'Cinzel, serif' }}>
              Comments &amp; Remarks from School Heads, Parents &amp; Alumni
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
              Direct access to reflections, endorsements, and firsthand accounts from our leadership, families, graduates, and scholars.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {/* 1. SCHOOL HEADS / DIRECTORS */}
            <Link
              href="#leadership"
              className="voice-link-card panel-reveal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                background: 'var(--soft-bg, #f4f5f7)',
                borderRadius: '8px',
                borderLeft: '4px solid var(--primary-red)',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(139, 30, 45, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-red)',
                fontSize: '18px',
                flexShrink: 0
              }}>
                <i className="fa-solid fa-user-tie" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--primary-navy)', fontWeight: 700 }}>
                  School Heads &amp; Leadership
                </strong>
                <small style={{ color: '#64748b', fontSize: '12.5px' }}>
                  Remarks from Directors &rarr;
                </small>
              </div>
            </Link>

            {/* 2. PARENT TESTIMONIALS */}
            <Link
              href="#parent-reviews"
              className="voice-link-card panel-reveal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                background: 'var(--soft-bg, #f4f5f7)',
                borderRadius: '8px',
                borderLeft: '4px solid #1E232A',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(30, 35, 42, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E232A',
                fontSize: '18px',
                flexShrink: 0
              }}>
                <i className="fa-solid fa-comments" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--primary-navy)', fontWeight: 700 }}>
                  Parent Endorsements
                </strong>
                <small style={{ color: '#64748b', fontSize: '12.5px' }}>
                  Verified Parent Reviews &rarr;
                </small>
              </div>
            </Link>

            {/* 3. ALUMNI SUCCESS STORIES */}
            <Link
              href="#alumni"
              className="voice-link-card panel-reveal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                background: 'var(--soft-bg, #f4f5f7)',
                borderRadius: '8px',
                borderLeft: '4px solid var(--primary-red)',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(139, 30, 45, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-red)',
                fontSize: '18px',
                flexShrink: 0
              }}>
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--primary-navy)', fontWeight: 700 }}>
                  Alumni Stories &amp; Impact
                </strong>
                <small style={{ color: '#64748b', fontSize: '12.5px' }}>
                  Where Our Alumni Lead &rarr;
                </small>
              </div>
            </Link>

            {/* 4. LEARNER VOICES */}
            <Link
              href="#student-voices"
              className="voice-link-card panel-reveal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                background: 'var(--soft-bg, #f4f5f7)',
                borderRadius: '8px',
                borderLeft: '4px solid #1E232A',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(30, 35, 42, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E232A',
                fontSize: '18px',
                flexShrink: 0
              }}>
                <i className="fa-solid fa-book-open-reader" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--primary-navy)', fontWeight: 700 }}>
                  Learner Perspectives
                </strong>
                <small style={{ color: '#64748b', fontSize: '12.5px' }}>
                  Student Dreams &amp; Ambitions &rarr;
                </small>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PLEASANT VIEW AT A GLANCE (The Dunham School & The Walker School Signature Metrics) */}
      <section className="at-a-glance-section" aria-label="Pleasant View at a Glance">
        <div className="wrapper">
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <span style={{ color: '#fda4af', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              DISTINCTION BY NUMBERS
            </span>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(26px, 2.8vw, 36px)', fontFamily: 'Cinzel, serif', margin: '6px 0 0', textTransform: 'uppercase' }}>
              PLEASANT VIEW AT A GLANCE
            </h2>
            <div className="gold-divider" style={{ margin: '12px auto' }} />
          </div>

          <div className="at-a-glance-grid">
            {glanceMetrics.map((m, idx) => (
              <div key={m.id || idx} className="at-a-glance-card">
                <div className="stat-num">{m.stat_value}</div>
                <div className="stat-label">{m.stat_label}</div>
                <div className="stat-desc">{m.stat_desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEXT INTRODUCTION (PLEASANT VIEW SCHOOLS – OUR AIM IS VICTORY) */}
      <section className="text-component">
        <div className="wrapper">
          <span className="lead-badge reveal-on-scroll">24 YEARS OF ACADEMIC EMINENCE</span>
          <h2 className="reveal-on-scroll">PLEASANT VIEW SCHOOLS &ndash; OUR AIM IS VICTORY</h2>
          <div className="gold-divider reveal-on-scroll" />
          <p className="lead scroll-word-reveal">
            Founded in 1998, Pleasant View Schools has grown from a visionary primary institution into one of Kenya&apos;s most celebrated Christian-ethos day and boarding academic institutions, situated amidst the peaceful green highlands of Githunguri, Komothai Subcounty, Kiambu County.
          </p>
          <p className="body-text scroll-word-reveal" style={{ fontSize: '16.5px', lineHeight: 1.85, color: '#444' }}>
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
            <p className="lead scroll-word-reveal" style={{ fontSize: '17px', color: '#555', margin: 0 }}>
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
      <section className="program-finder-section" id="schools">
        <span id="programs" style={{ display: 'block', height: 0, overflow: 'hidden' }} aria-hidden="true" />
        <div className="wrapper">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
            <span style={{ color: 'var(--gold-dark)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              CHOOSE YOUR CHILD&apos;S PATHWAY
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 2.6vw, 36px)', fontFamily: 'Cinzel, serif', color: 'var(--primary-navy)', margin: '6px 0' }}>
              Explore Our Schools
            </h2>
            <div className="gold-divider" style={{ margin: '12px auto' }} />
            <p style={{ color: '#666', fontSize: '15px' }}>
              From early childhood playgroup through senior high school graduation, discover our age-tailored CBE and senior academic pathways.
            </p>
          </div>

          <div className="program-finder-grid">
            {sch.map(s => (
              <div key={s.id} className="program-card">
                <div
                  className="program-card-img"
                  style={{ backgroundImage: `url('${s.image || '/images/banner_1_a.webp'}')` }}
                >
                  <span className="program-card-badge">{s.category || 'School'}</span>
                </div>
                <div className="program-card-body">
                  <h4>{String(s.name || '').replace(/pleasantview/gi, 'Pleasant View')}</h4>
                  <div className="program-level">{String(s.level || '').replace(/CBC/g, 'CBE').replace(/pleasantview/gi, 'Pleasant View')}</div>
                  <p>{s.tagline || s.about?.slice(0, 110) + '...' || 'Distinctive academic program tailored for holistic excellence.'}</p>
                  <div className="program-card-meta">
                    <span>
                      <i className="fa-solid fa-user-graduate" style={{ color: 'var(--primary-red)', marginRight: '5px', fontSize: '11.5px' }} />
                      Enrolled: <strong>{s.learners || 'Enrolled'}</strong>
                    </span>
                    <span>
                      <i className="fa-solid fa-bed" style={{ color: 'var(--primary-red)', marginRight: '5px', fontSize: '11.5px' }} />
                      Boarding: <strong>{s.boarders || 'Day & Boarding'}</strong>
                    </span>
                  </div>
                  <div className="program-card-actions">
                    <Link href={`/s/${s.slug}`} className="program-action-explore">
                      <span>Explore School</span>
                      <i className="fa-solid fa-arrow-right" />
                    </Link>
                    <Link href={`/contact?school=${s.slug}#visit`} className="program-action-apply">
                      <i className="fa-regular fa-calendar-check" />
                      <span>Apply / Visit</span>
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

      {/* SCHOOL PICTORIAL & CAMPUS PHOTO GALLERY (Auto-synced & Smart-Categorized) */}
      {schoolLifePhotos.length > 0 && (
        <section id="gallery" style={{ background: '#ffffff', padding: '75px 0', borderTop: '1px solid #e2e8f0' }}>
          <div className="wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '15px' }} className="reveal-on-scroll">
              <div>
                <span className="lead-badge" style={{ color: 'var(--primary-red)' }}>SCHOOL PICTORIAL &amp; CAMPUS MOMENTS</span>
                <h2 style={{ margin: '6px 0 0', color: 'var(--primary-navy)' }}>Pleasant View in Pictures</h2>
                <div className="gold-divider" style={{ marginLeft: 0 }} />
              </div>
              <Link href="/pictorial" className="button button-tertiary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                Explore Full Pictorial &rarr;
              </Link>
            </div>

            <PictorialGallery
              photos={schoolLifePhotos}
              compact={true}
              maxCompactItems={9}
              fullPictorialHref="/pictorial"
              fullPictorialLabel="Explore Full School Pictorial"
            />
          </div>
        </section>
      )}

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
                <i className="fa-solid fa-award" style={{ marginRight: '8px', color: '#fda4af' }} />
                24 Years of Leadership
              </div>
            </div>

            <div className="director-content">
              <h5>{primaryLeader.role ? primaryLeader.role.toUpperCase() : "EXECUTIVE LEADERSHIP MESSAGE"}</h5>
              <h2 className="reveal-on-scroll">A Tradition of Victory &amp; Academic Eminence</h2>
              <div className="gold-divider reveal-on-scroll" style={{ margin: '0 0 25px 0' }} />
              {primaryLeader.quote && (
                <div className="director-quote scroll-word-reveal">
                  &ldquo;{primaryLeader.quote}&rdquo;
                </div>
              )}
              <p className="scroll-word-reveal" style={{ whiteSpace: 'pre-line' }}>
                {primaryLeader.message}
              </p>
              <div className="director-signature">
                {primaryLeader.name}
              </div>
              <span className="director-title">{primaryLeader.title}</span>
            </div>
          </div>

          {leadMessages.length > 1 && (
            <div style={{ marginTop: '45px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {leadMessages.slice(1).map((lm) => (
                <div
                  key={lm.id}
                  className="leadership-card panel-reveal"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #dde2ec',
                    borderTop: '4px solid var(--primary-red)',
                    borderRadius: '10px',
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(30, 35, 42, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={lm.image || '/images/banner_3_a.webp'}
                      alt={lm.name}
                      style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-red)', flexShrink: 0 }}
                    />
                    <div>
                      <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, color: 'var(--primary-red)', background: 'rgba(139, 30, 45, 0.09)', padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                        {lm.role || 'Leadership'}
                      </span>
                      <h4 style={{ margin: '2px 0', color: '#1E232A', fontSize: '17.5px', fontWeight: 800 }}>{lm.name}</h4>
                      <small style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>{lm.title}</small>
                    </div>
                  </div>
                  {lm.quote && (
                    <blockquote style={{ margin: 0, padding: '10px 14px', background: 'var(--soft-bg)', borderLeft: '3px solid var(--primary-red)', borderRadius: '4px', fontStyle: 'italic', color: '#1E232A', fontSize: '14px', fontWeight: 600, lineHeight: 1.55 }}>
                      &ldquo;{lm.quote}&rdquo;
                    </blockquote>
                  )}
                  <p style={{ margin: 0, color: '#334155', fontSize: '14.5px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {lm.message}
                  </p>
                </div>
              ))}
            </div>
          )}
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
            {quickLinks.map(l => (
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
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary-navy)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
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
              <p>Stay informed with updates on examinations, co-curricular highlights, academic symposiums, and admissions across all Pleasant View campuses.</p>
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

      {/* UPCOMING CALENDAR EVENTS & ANNOUNCEMENTS (Set by Admin) */}
      <section className="events-calendar-section" id="events" style={{ background: '#ffffff', padding: '75px 0', borderTop: '1px solid #e2e8f0' }}>
        <div className="wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '35px', flexWrap: 'wrap', gap: '15px' }} className="reveal-on-scroll">
            <div>
              <span className="lead-badge" style={{ color: 'var(--primary-red)' }}>DATES FOR YOUR DIARY</span>
              <h2 style={{ margin: '6px 0 0', color: 'var(--primary-navy)' }}>Upcoming Events &amp; Announcements</h2>
              <div className="gold-divider" style={{ marginLeft: 0 }} />
            </div>
            <Link href="/quick-links/term-dates" className="button button-tertiary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Full Term Calendar &amp; VISOs &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
            {events.map((ev, idx) => {
              const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
              let day = '15';
              let month = 'NOV';
              try {
                const parts = String(ev?.event_date || '').split('-');
                if (parts.length >= 3) {
                  day = parts[2].slice(0, 2).padStart(2, '0');
                  const mIdx = parseInt(parts[1], 10) - 1;
                  month = monthNames[mIdx] || 'NOV';
                }
              } catch {}

              return (
                <div
                  key={ev.id || idx}
                  className={`reveal-on-scroll reveal-delay-${(idx % 4) + 1}`}
                  style={{
                    background: 'var(--soft-bg)',
                    borderRadius: '8px',
                    border: '1px solid #dde2ec',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                  }}
                >
                  <div>
                    {/* DATE BLOCK & CATEGORY */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '60px',
                        background: 'linear-gradient(135deg, var(--primary-red), var(--primary-navy))',
                        color: '#ffffff',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(139,30,45,0.22)'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>{day}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginTop: '2px' }}>{month}</span>
                      </div>
                      <div>
                        <span style={{
                          background: 'rgba(139,30,45,0.08)',
                          color: 'var(--primary-red)',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {ev.category}
                        </span>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          <i className="fa-regular fa-clock" style={{ marginRight: '4px' }} />
                          {ev.event_time}
                        </div>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '17px', color: 'var(--primary-navy)', margin: '0 0 8px', lineHeight: 1.4 }}>
                      {ev.title}
                    </h4>

                    {ev.description && (
                      <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.55, margin: '0 0 12px' }}>
                        {ev.description}
                      </p>
                    )}
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px dashed #d5dce8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#777' }}>
                    <span>
                      <i className="fa-solid fa-location-dot" style={{ marginRight: '5px', color: 'var(--primary-red)' }} />
                      {ev.location ? ev.location.slice(0, 24) + '...' : 'Main Campus'}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                      {ev.school_name || 'All Campuses'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1. TESTIMONIALS & TRUST (APPROVED PARENT REVIEWS) */}
      <section className="testimonials-section" id="parent-reviews">
        <div className="wrapper">
          {/* TOAST ON SUCCESSFUL REVIEW SUBMISSION */}
          {isReviewSubmitted && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '35px',
              borderLeft: '6px solid #28a745',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
            }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '36px', color: '#28a745', marginBottom: '8px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>Review Submitted Successfully!</h3>
              <p style={{ margin: 0, fontSize: '15px' }}>
                Thank you for your feedback! Your review has been forwarded to the General School Administrator for moderation and will appear on the landing page once approved.
              </p>
            </div>
          )}

          <div className="testimonials-header reveal-on-scroll">
            <h5>TESTIMONIALS &amp; PARENT VOICES</h5>
            <h3>What Parents Say About Pleasant View</h3>
            <div className="gold-divider" />
            <p style={{ maxWidth: '680px', margin: '10px auto 0', color: '#666', fontSize: '15px' }}>
              Real perspectives from our parent community across our Early Learning, Primary, Junior Secondary (JSS), and Senior High Schools.
            </p>
          </div>

          <div className="testimonials-grid">
            {approvedTestimonials.map((t, idx) => {
              const stars = Math.max(1, Math.min(5, Math.round(Number(t?.rating) || 5)));
              const initial = (t?.parent_name ? String(t.parent_name).trim().charAt(0) : 'P') || 'P';
              return (
                <div key={t.id || t.parent_name || idx} className={`testimonial-card reveal-on-scroll reveal-delay-${(idx % 3) + 1}`}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div className="quote-icon"><i className="fa-solid fa-quote-left" /></div>
                      <div style={{ color: 'var(--gold-accent)', fontSize: '15px' }}>
                        {'★'.repeat(stars)}
                      </div>
                    </div>
                    <p className="testimonial-text">&ldquo;{t.comment}&rdquo;</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">{initial}</div>
                    <div className="author-info">
                      <h4>{t.parent_name}</h4>
                      <span>{t.relationship || 'Parent'} &bull; {t.grade_or_division}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PARENT COMMENT SUBMISSION FORM */}
          <div className="reveal-on-scroll entry-panel-card" style={{
            marginTop: '50px',
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 6px 25px rgba(0,0,0,0.06)',
            borderTop: '4px solid var(--gold-accent)',
            maxWidth: '850px',
            width: '100%',
            boxSizing: 'border-box',
            margin: '50px auto 0'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                SHARE YOUR PERSPECTIVE
              </span>
              <h4 style={{ fontSize: '22px', color: 'var(--primary-navy)', margin: '6px 0 8px' }}>
                Are You a Pleasant View Parent or Guardian?
              </h4>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                We welcome your reflections on your child&apos;s academic progress and boarding experience. Submissions are reviewed by the general school administrator before publication.
              </p>
            </div>

            <PublicFormEnhancer />
            <form action="/api/public/submit?action=submitParentReview" method="POST" data-public-action="submitParentReview" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Parent / Guardian Full Name *</label>
                <input name="parent_name" placeholder="e.g. Mrs. Jane Kimani" required />
              </div>

              <div className="form-group">
                <label>Learner&apos;s Name (Optional)</label>
                <input name="learner_name" placeholder="e.g. Samuel Kimani" />
              </div>

              <div className="form-group">
                <label>School &amp; Grade / Class *</label>
                <input name="grade_or_division" placeholder="e.g. Grade 7 JSS or Form 2 Senior" required />
              </div>

              <div className="form-group">
                <label>Rating (1 to 5 Stars) *</label>
                <select name="rating" defaultValue="5">
                  <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                  <option value="4">★★★★☆ (4 Stars - Highly Satisfied)</option>
                  <option value="3">★★★☆☆ (3 Stars - Good)</option>
                  <option value="2">★★☆☆☆ (2 Stars - Fair)</option>
                  <option value="1">★☆☆☆☆ (1 Star - Needs Improvement)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" placeholder="+254 711 000 000" />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="jane.kimani@example.com" />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Your Comment / Review *</label>
                <textarea
                  name="comment"
                  rows="3"
                  placeholder="Tell us about the teaching, science laboratories, spiritual guidance, sports, or pastoral care..."
                  required
                />
              </div>

              <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />

              <button
                type="submit"
                className="button button-gold"
                style={{ gridColumn: '1 / -1', padding: '14px', fontSize: '15px', fontWeight: 800 }}
              >
                <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }} /> Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. EXISTING LEARNERS & STUDENT BODY VOICES (WITH PHOTOS) */}
      <section className="student-voices-section" id="student-voices" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="wrapper">
          <div className="testimonials-header reveal-on-scroll">
            <h5 style={{ color: 'var(--primary-red)' }}>SCHOLAR PERSPECTIVES &amp; DREAMS</h5>
            <h3 style={{ color: 'var(--primary-navy)' }}>Voices from Our Student Body</h3>
            <div className="gold-divider" />
            <p style={{ maxWidth: '680px', margin: '10px auto 0', color: '#666', fontSize: '15px' }}>
              Hear directly from our pupils and senior scholars about their discoveries in modern science laboratories, coding classes, and campus friendships.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '25px', marginTop: '40px' }}>
            {learnerVoices.map((l, idx) => (
              <div
                key={l.id || idx}
                className="voices-card panel-reveal"
                style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <div style={{
                  height: '220px',
                  backgroundImage: `url('${l.photo_url || '/images/girls_high_school3.webp'}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(20,24,30,0.85) 0%, transparent 60%)'
                  }} />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'var(--primary-red)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}>
                    {l.grade_or_class}
                  </span>
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                    <h4 style={{ color: '#ffffff', margin: 0, fontSize: '18px', fontWeight: 700 }}>{l.name}</h4>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12.5px', fontWeight: 600 }}>{l.school_name}</span>
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p className="voices-quote" style={{ fontSize: '14.5px', color: '#444', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 16px' }}>
                    &ldquo;{l.comment}&rdquo;
                  </p>

                  <div style={{ paddingTop: '14px', borderTop: '1px solid #edf1f7', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {l.favorite_subject && (
                      <span style={{ background: 'rgba(139,30,45,0.08)', color: 'var(--primary-red)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                        <i className="fa-solid fa-book-open" style={{ marginRight: '5px', color: 'var(--gold-accent)' }} />
                        {l.favorite_subject}
                      </span>
                    )}
                    {l.future_aspiration && (
                      <span style={{ background: 'rgba(139,30,45,0.06)', color: 'var(--primary-red)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                        <i className="fa-solid fa-compass" style={{ marginRight: '5px' }} />
                        {l.future_aspiration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ALUMNI SUCCESS STORIES & TESTIMONIALS */}
      {alumniStories.length > 0 && (
        <section className="alumni-section" id="alumni" style={{ background: '#ffffff', padding: '80px 0' }}>
          <div className="wrapper">
            <div className="testimonials-header reveal-on-scroll">
              <h5>OUR AIM IS VICTORY</h5>
              <h3>Alumni Milestones &amp; Success Stories</h3>
              <div className="gold-divider" />
              <p style={{ maxWidth: '680px', margin: '10px auto 0', color: '#666', fontSize: '15px' }}>
                Pleasant View alumni thrive across East Africa and globally in computer science, medicine, engineering, law, and entrepreneurship.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '40px' }}>
              {alumniStories.map((a, idx) => (
                <div
                  key={a.id || idx}
                  className="alumni-card panel-reveal"
                  style={{
                    background: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #dde2ec',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{
                    height: '220px',
                    backgroundImage: `url('${a.image_url || '/images/girls_high_school3.webp'}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(20,24,30,0.85) 0%, transparent 60%)'
                    }} />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'var(--primary-red)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.5px'
                    }}>
                      {a.grad_year}
                    </span>
                    <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                      <h4 style={{ color: '#ffffff', margin: 0, fontSize: '19px', fontWeight: 700 }}>{a.name}</h4>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>{a.campus_division}</span>
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--primary-red)', fontWeight: 700, marginBottom: '4px' }}>
                        {a.current_role}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#666', marginBottom: '14px' }}>
                        {a.university_or_company}
                      </div>
                      {a.quote && (
                        <blockquote className="alumni-quote" style={{
                          margin: '0 0 14px',
                          padding: '12px 14px',
                          background: 'var(--soft-bg)',
                          borderLeft: '4px solid var(--gold-accent)',
                          fontStyle: 'italic',
                          color: '#333',
                          fontSize: '13.5px',
                          lineHeight: 1.55,
                          borderRadius: '4px'
                        }}>
                          &ldquo;{a.quote}&rdquo;
                        </blockquote>
                      )}
                      <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.65, margin: 0 }}>
                        {a.story}
                      </p>
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
          </div>
        </section>
      )}

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
