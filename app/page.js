import Link from 'next/link';
import Slider from '@/components/Slider';
import VmvSlideshow from '@/components/VmvSlideshow';
import { q, S, schools } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [hero, news, sch, st] = await Promise.all([
    q('SELECT * FROM hero WHERE school_id=0 ORDER BY sort ASC, id ASC'),
    q('SELECT p.*, s.name sname FROM posts p LEFT JOIN schools s ON s.id=p.school_id ORDER BY p.id DESC LIMIT 3'),
    schools(),
    S()
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
          headline: 'WELCOME TO PLEASANTVIEW SCHOOLS',
          sub: 'Seeking the Highest — Transforming Hearts, Minds, Bodies and Souls of Tomorrow’s Leaders',
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
          button_link: '/about#sports',
          button_alt_text: 'Our Campuses',
          button_alt_link: '/#schools'
        },
        {
          image: '/images/hero_library_learning.jpg',
          headline: '24 YEARS OF ACADEMIC DISTINCTION',
          sub: 'A sterling track record exceeding 390/500 KCPE mean scores and B+ KCSE university transition feats',
          button_text: 'Academic Curriculum',
          button_link: '/about#academics',
          button_alt_text: 'Apply Now',
          button_alt_link: '/contact'
        }
      ];

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

      {/* QUICK OVERVIEW GATEWAY BAR (St Andrew's Turi Exact) */}
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
                <h4>Admissions &amp; Visits</h4>
                <p>Book a personalized walking campus tour</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* TEXT INTRODUCTION (PLEASANTVIEW – SEEKING THE HIGHEST) */}
      <section className="text-component">
        <div className="wrapper">
          <span className="lead-badge">24 YEARS OF ACADEMIC DISTINCTION</span>
          <h2>PLEASANTVIEW SCHOOLS &ndash; SEEKING THE HIGHEST</h2>
          <div className="gold-divider" />
          <p className="lead">
            {st.about || 'Pleasant View Schools is a premier Christian-ethos private academic institution based in Githunguri, Komothai Subcounty, Kiambu County.'}
          </p>
          <p className="body-text">
            Since inception in 1998, our KCPE classes have consistently maintained a distinguished mean score exceeding 390/500, ranking proudly among the top 10 schools in Kiambu County. Following this extraordinary record, our Girls’ High School and modern Junior Secondary School (JSS) continue to set benchmarks in academic competence, technical innovation, and moral integrity.
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
                <h4>Minds &ndash; Academic Rigor</h4>
                <p>
                  A 24-year heritage exceeding 390/500 KCPE mean scores and B+ university transition feats, delivering progressive Competency Based Curriculum (CBC) and STEM mastery.
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
                  Pastoral Care <i className="fa-solid fa-arrow-right-long" />
                </Link>
              </div>
            </div>

            {/* PILLAR 3: BODIES */}
            <div className="pillar-card">
              <div className="pillar-header-img" style={{ backgroundImage: `url('/images/gallery_9.webp')` }}>
                <div className="overlay" />
                <span className="pillar-tag">Pillar III</span>
                <div className="pillar-icon-badge">
                  <i className="fa-solid fa-person-running" />
                </div>
              </div>
              <div className="pillar-body">
                <h4>Bodies &ndash; Sports &amp; Adventure</h4>
                <p>
                  Competitive athletics, football, basketball, swimming, and co-curricular outdoor exploration that cultivate physical resilience, teamwork, and sportsmanship.
                </p>
                <Link href="/about#sports" className="pillar-link">
                  Sports &amp; Co-Curricular <i className="fa-solid fa-arrow-right-long" />
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

      {/* DIRECTOR'S WELCOME & INSTITUTIONAL OVERVIEW */}
      <section className="director-welcome-section">
        <div className="wrapper">
          <div className="director-container">
            <div className="director-image-wrapper">
              <img
                src="/images/banner_3_a.webp"
                alt="Pleasantview Leadership"
                className="director-portrait"
              />
              <div className="director-frame-badge">
                <i className="fa-solid fa-award" style={{ marginRight: '8px', color: 'var(--gold-accent)' }} />
                24 Years of Leadership
              </div>
            </div>

            <div className="director-content">
              <h5>DIRECTOR&apos;S WELCOME</h5>
              <h2>A Tradition of Victory &amp; Academic Distinction</h2>
              <div className="gold-divider" style={{ margin: '0 0 25px 0' }} />
              <div className="director-quote">
                &ldquo;Our aim is victory &mdash; not merely in examinations, but in shaping disciplined, visionary young people who lead with wisdom, faith, and purpose.&rdquo;
              </div>
              <p>
                Welcome to Pleasantview Schools. For over two decades, our community has stood as a beacon of academic excellence and character development in Kiambu County. We believe that true education nurtures the mind while fortifying the soul.
              </p>
              <p>
                Whether in our early learning centre, thriving primary school, modern Junior Secondary (JSS), or distinguished Girls’ High School, we provide state-of-the-art science laboratories, extensive transport coverage, and world-class pastoral boarding. We warmly invite you to visit our campus and experience the Pleasantview difference firsthand.
              </p>
              <div className="director-signature">
                Board of Directors &amp; Executive Principal
              </div>
              <span className="director-title">Pleasantview Schools Group</span>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNPOSTING (CHOOSE YOUR SCHOOL - EXACT TURI CARDS) */}
      <section className="signposting" id="schools">
        <div className="wrapper">
          <div className="section-header">
            <h5>OUR ACADEMIC DIVISIONS</h5>
            <h3>Choose Your School</h3>
            <div className="gold-divider" />
          </div>

          <div className="signposts-grid">
            {sch.map(s => (
              <Link
                key={s.id}
                className="signpost-card"
                href={`/s/${s.slug}`}
                style={{ backgroundImage: `url('${s.image || '/images/banner_1_a.webp'}')` }}
              >
                <div className="signpost-overlay" />
                <span className="signpost-category">{s.category || 'Division'}</span>
                <div className="signpost-title">{s.name}</div>
                <div className="signpost-level">{s.level}</div>
                <div className="signpost-stats-pill">
                  <i className="fa-solid fa-users" style={{ marginRight: '6px' }} /> {s.learners || 'Enrolled'}
                </div>
                <div className="signpost-link-text">
                  Explore Campus <i className="fa-solid fa-arrow-right-long" />
                </div>
              </Link>
            ))}
          </div>

          <div className="signposting-bottom-link">
            <Link href="/about" className="button button-tertiary">
              Why Pleasantview Schools
            </Link>
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

      {/* REALISTIC POPULATION & INSTITUTIONAL STATISTICS */}
      <section className="stats-bar-section">
        <div className="wrapper">
          <div className="stats-grid">
            <div className="stat-item">
              <b>{st.learners || '1,700+'}</b>
              <span>Registered Learners</span>
            </div>
            <div className="stat-item">
              <b>{st.boarders || '600+'}</b>
              <span>Boarding Scholars (Gr. 4+)</span>
            </div>
            <div className="stat-item">
              <b>{st.teachers || '100%'}</b>
              <span>TSC Certified Faculty</span>
            </div>
            <div className="stat-item">
              <b>{st.ratio || '1:20'}</b>
              <span>Learner : Teacher Ratio</span>
            </div>
            <div className="stat-item">
              <b>{st.kcpe_mean || '390+'}</b>
              <span>Historic KCPE Mean Score</span>
            </div>
            <div className="stat-item">
              <b>24+</b>
              <span>Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS POSTS (TURI SPLIT SLIDER LAYOUT) */}
      <section className="news-posts-section">
        <div className="wrapper">
          <div className="news-split-container">
            <div className="news-static-box">
              <h5>WHAT&apos;S HAPPENING</h5>
              <h3>Latest News</h3>
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

      {/* TESTIMONIALS (FROM NETLIFY CONTENT) */}
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
