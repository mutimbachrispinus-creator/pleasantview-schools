import Link from 'next/link';
import Page from '@/components/Page';
import { getYearsOfExistence } from '@/lib/db';

export const metadata = {
  title: 'Our 28-Year History & Heritage | Pleasant View Schools',
  description: 'The story and heritage of Pleasant View Schools from its founding in 1998 to 28 years of academic excellence and Christian leadership in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const years = getYearsOfExistence();

  const milestones = [
    {
      year: '1998',
      title: 'Founding & First Steps in Githunguri',
      desc: 'Pleasant View was founded as a visionary primary school in Githunguri, Komothai Subcounty, Kiambu County. Driven by deep Christian faith and a conviction that quality education should transform character as well as intellect, the school began with a dedicated faculty and eager pupils.'
    },
    {
      year: '2004',
      title: 'Pastoral Boarding & Campus Expansion',
      desc: 'To accommodate learners travelling from across Kiambu, Nairobi, and Central Kenya, Pleasant View introduced family-style boarding from Grade 4 upwards. Modern dormitories, dedicated houseparents, and evening prep routines established a strong tradition of pastoral care.'
    },
    {
      year: '2010',
      title: 'Transport Fleet & Modern Science Facilities',
      desc: 'The school launched its dedicated yellow school bus transport network to serve day scholars across Githunguri, Ruiru, and Kiambu environs. Construction began on specialized science laboratories to provide practical experimental training.'
    },
    {
      year: '2016',
      title: 'Establishment of Pleasant View Senior School',
      desc: 'Responding to the earnest, persistent appeals of parents whose primary pupils had excelled and desired continuous Christian high school education, Pleasant View Senior School was officially established with dedicated high school facilities.'
    },
    {
      year: '2020',
      title: 'Historic Maiden B+ Senior School KCSE Mean Grade',
      desc: 'The maiden Senior School graduating cohort made institutional history by achieving an extraordinary B+ mean grade in national examinations, securing direct degree placements in prestigious Kenyan and international universities.'
    },
    {
      year: '2023',
      title: 'Junior Secondary (JSS) & High-Tech STEM Launch',
      desc: 'Pleasant View spearheaded the national Competency Based Education (CBE) transition, unveiling dedicated Junior Secondary School (JSS) facilities, modern Integrated Science wet labs, and a Digital Robotics hub.'
    },
    {
      year: '2026',
      title: `${years} Years of Academic Eminence`,
      desc: `Celebrating ${years} years of existence, Pleasant View stands as a distinguished four-tier educational institution (Early Years, Primary, JSS, and Senior School) serving over 600 boarding scholars and hundreds of day learners with unyielding commitment to victory.`
    }
  ];

  return (
    <Page
      title="Our 28-Year History & Heritage"
      subtitle="FOUNDED 1998 &bull; OUR AIM IS VICTORY"
      image="/images/banner_3_a.webp"
    >
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">A PROUD LEGACY</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>
            Built on Faith, Vision &amp; Academic Distinction
          </h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }}>
            Since 1998, Pleasant View Schools has evolved from humble beginnings into one of the most respected private educational groups in Kenya. Here is the remarkable journey of how our aim has continually been victory.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="timeline-container">
          {milestones.map((m, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-card">
                <span className="timeline-year-tag">{m.year}</span>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ARCHIVAL SUMMARY PANEL */}
        <div style={{
          background: 'var(--soft-bg)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          margin: '40px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              OUR FOUNDING MOTTO
            </span>
            <h4 style={{ fontSize: '20px', color: 'var(--dark-grey)', margin: '6px 0 10px' }}>
              &ldquo;Our Aim is Victory&rdquo;
            </h4>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Chosen in 1998, our motto encapsulates our belief that every child is called to overcome adversity and achieve victory in their character, mind, body, and soul.
            </p>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              GEOGRAPHIC SANCTUARY
            </span>
            <h4 style={{ fontSize: '20px', color: 'var(--dark-grey)', margin: '6px 0 10px' }}>
              Githunguri, Kiambu County
            </h4>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Surrounded by lush green tea farms and refreshing mountain air, our campus provides an environment free of metropolitan distractions where young minds can focus on deep learning.
            </p>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              THE FUTURE
            </span>
            <h4 style={{ fontSize: '20px', color: 'var(--dark-grey)', margin: '6px 0 10px' }}>
              KSSEA &amp; Innovation
            </h4>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              As Kenya transitions into KSSEA, Pleasant View continues to pioneer cutting-edge STEM and digital robotics education, training future doctors, engineers, entrepreneurs, and global leaders.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/about" className="button button-tertiary" style={{ marginRight: '14px' }}>
            About Our Mission &rarr;
          </Link>
          <Link href="/admissions#visit" className="button button-gold">
            Book a Campus Tour
          </Link>
        </div>
      </div>
    </Page>
  );
}
