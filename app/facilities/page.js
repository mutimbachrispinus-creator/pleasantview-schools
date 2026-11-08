import Link from 'next/link';
import Page from '@/components/Page';
import { S, getYearsOfExistence } from '@/lib/db';

export const metadata = {
  title: 'Campus Facilities & Grounds | Pleasant View Schools',
  description: 'Explore the modern learning facilities, integrated science laboratories, digital library, sports grounds, boarding houses, and safe transport fleet at Pleasant View Schools in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function FacilitiesPage() {
  const years = getYearsOfExistence();
  const st = await S();
  const mapsUrl = st.maps_url || 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5';

  const facilities = [
    {
      id: 'laboratories',
      title: 'Modern Science & Digital Robotics Hub',
      tag: 'STEM & INNOVATION',
      image: '/images/hero_science_lab.jpg',
      desc: 'State-of-the-art physics, chemistry, biology, and pre-technical laboratories equipped with modern apparatus, digital microscopes, projector stations, and safety systems for interactive STEM inquiry.',
      features: [
        'Dedicated chemistry & biology wet benches',
        'Pre-technical & robotics assembly benches',
        'Strict safety protocols and emergency showers',
        'Supervised experimental research for JSS and Senior School'
      ]
    },
    {
      id: 'library',
      title: 'Digital Resource Centre & Library',
      tag: 'RESEARCH & KNOWLEDGE',
      image: '/images/hero_library_learning.jpg',
      desc: 'An inspiring, quiet intellectual sanctuary stocked with thousands of contemporary curriculum textbooks, literary classics, research journals, and high-speed internet computer terminals.',
      features: [
        'Extensive CBE curriculum and reference collections',
        'Monitored digital e-learning stations',
        'Collaborative study tables & quiet individual carrels',
        'Reading culture mentorship for all year groups'
      ]
    },
    {
      id: 'sports',
      title: 'Athletics, Football & Highland Pitches',
      tag: 'SPORTS & PHYSICAL HEALTH',
      image: '/images/hero_sports_field.jpg',
      desc: 'Expansive, manicured green sports grounds set against the scenic Githunguri highlands, featuring full-size football pitches, athletics running tracks, volleyball courts, and recreational play fields.',
      features: [
        'Championship football and rugby pitch',
        'Inter-house athletics track & cross-country trails',
        'Volleyball, basketball, and netball courts',
        'Coaching by certified physical education masters'
      ]
    },
    {
      id: 'boarding',
      title: 'Pastoral Boarding Dormitories',
      tag: 'RESIDENTIAL COMMUNITY',
      image: '/images/gallery_2.webp',
      desc: 'Spacious, well-ventilated, secure hostels for boys and girls from Grade 4 upwards, providing a loving home-away-from-home under the round-the-clock guidance of resident houseparents.',
      features: [
        'Individual comfortable beds and secure storage lockers',
        'Hot water showers and modern hygienic washrooms',
        'Supervised evening prep and morning devotions',
        'Resident sanitarium nurses and on-call medical doctors'
      ]
    },
    {
      id: 'transport',
      title: 'Safe Monitored Transport Fleet',
      tag: 'SAFE COMMUTE',
      image: '/images/gallery_7.webp',
      desc: 'A comprehensive fleet of yellow school buses and vans serving Githunguri, Komothai, Ruiru, Kiambu Town, and surrounding environs, providing punctual, safe door-to-door and zonal transit.',
      features: [
        'Vetted, professionally licensed school drivers',
        'Trained bus wardens on every single route',
        'Real-time GPS tracking and strict speed governors',
        'Comfortable safety-belted seating for all ages'
      ]
    },
    {
      id: 'dining',
      title: 'Modern Dining Hall & Nutrition',
      tag: 'NUTRITION & FELLOWSHIP',
      image: '/images/primary_school_1.webp',
      desc: 'A pristine dining complex serving 4 wholesome, nutritionally balanced meals daily prepared from fresh local highland produce under stringent hygiene and public health standards.',
      features: [
        'Balanced diet formulated by adolescent nutritionists',
        'Hot tea, cocoa, milk, fresh fruit, and whole grains daily',
        'Special dietary accommodation for allergies and medical needs',
        'Family-style dining promoting manners and table etiquette'
      ]
    }
  ];

  return (
    <Page
      title="Campus Facilities & Grounds"
      subtitle="A WORLD-CLASS LEARNING ENVIRONMENT"
      image="/images/hero_science_lab.jpg"
    >
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">MODERN INFRASTRUCTURE</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>
            Inspiring Excellence Across Every Acre
          </h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }}>
            Situated amidst the cool, pristine highlands of Githunguri in Kiambu County, Pleasant View Schools offers an idyllic campus setting where state-of-the-art educational infrastructure harmonizes with tranquil green nature.
          </p>
        </div>

        {/* FACILITIES GRID */}
        <div className="facilities-grid">
          {facilities.map(f => (
            <div key={f.id} id={f.id} className="facility-card">
              <div
                className="facility-img-box"
                style={{ backgroundImage: `url('${f.image}')` }}
              >
                <span className="facility-tag">{f.tag}</span>
              </div>
              <div className="facility-body">
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
                <ul className="facility-highlights">
                  {f.features.map((feat, idx) => (
                    <li key={idx}>
                      <i className="fa-solid fa-circle-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* MAP & LOCATION OVERVIEW */}
        <div style={{
          background: 'linear-gradient(135deg, var(--dark-grey), #111419)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          margin: '50px 0',
          borderLeft: '6px solid var(--primary-red)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fda4af' }}>
              SERENE HIGHLAND SANCTUARY
            </span>
            <h3 style={{ color: '#ffffff', fontSize: 'clamp(24px, 2.6vw, 34px)', margin: '8px 0 16px', fontFamily: 'var(--font-serif)' }}>
              Visit Our Campuses in Githunguri
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.75, marginBottom: '20px' }}>
              Pleasant View Schools is conveniently located just 40 minutes from Nairobi and 20 minutes from Kiambu Town, offering learners clean mountain air, expansive horizons, and freedom from metropolitan congestion.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-gold"
              >
                <i className="fa-solid fa-location-dot" style={{ marginRight: '8px' }} /> Open Google Maps Directions
              </a>
              <Link href="/admissions#visit" className="button button-primary">
                Book Campus Tour
              </Link>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '18px' }}>
              <i className="fa-solid fa-clock" style={{ color: '#fda4af', marginRight: '8px' }} /> Visiting Hours
            </h4>
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 14px 0' }}>
              <strong>Monday &ndash; Friday:</strong> 8:00 AM &ndash; 5:00 PM<br />
              <strong>Saturdays:</strong> 9:00 AM &ndash; 1:00 PM<br />
              <strong>Sundays:</strong> By prior appointment or scheduled VISO
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              * Security sign-in required at main campus gate. Escorted walking tours conducted by admissions officers.
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}
