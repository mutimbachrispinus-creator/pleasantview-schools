import Link from 'next/link';
import Page from '@/components/Page';
import PictorialGallery from '@/components/PictorialGallery';
import { getPhotos, schools, init, normalizePictorialCategory } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'School Pictorial & Campus Photo Gallery',
  description: 'Explore Pleasant View Schools in pictures — Science & Robotics Laboratories, Sports & Athletics, Classrooms, Pastoral Boarding, Creative Arts, and Campus Events.'
};

export default async function PictorialPage({ searchParams }) {
  await init();
  const [photos, schList] = await Promise.all([
    getPhotos().catch(() => []),
    schools().catch(() => [])
  ]);

  const sp = (await searchParams) || {};
  const rawCat = typeof sp.category === 'string' ? sp.category.trim() : '';
  const initialCategory = rawCat
    ? normalizePictorialCategory(rawCat, rawCat) || rawCat
    : 'All';
  const initialSchool = typeof sp.school === 'string' ? sp.school.trim() : '0';

  return (
    <Page
      title="School Pictorial & Campus Gallery"
      subtitle="LIFE AT PLEASANT VIEW IN PICTURES"
      image="/images/hero_science_lab.jpg"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '26px'
        }}
      >
        <div style={{ maxWidth: '760px' }}>
          <span className="lead-badge" style={{ color: 'var(--primary-red)' }}>
            VISUAL CHRONICLE &amp; CAMPUS SHOWCASE
          </span>
          <h2 style={{ margin: '6px 0 10px', color: 'var(--primary-navy)' }}>
            Every Moment Across Our Campuses
          </h2>
          <div className="gold-divider" style={{ marginLeft: 0 }} />
          <p style={{ margin: 0, fontSize: '15.5px', lineHeight: 1.75, color: '#475569' }}>
            Browse photographs from our integrated science &amp; robotics laboratories, championship sports pitches,
            CBE classrooms, boarding houses, creative arts studios, chapel fellowships, and campus news highlights.
          </p>
        </div>

        <Link
          href="/contact#visit"
          className="button button-gold"
          style={{ padding: '10px 20px', fontSize: '13.5px' }}
        >
          <i className="fa-regular fa-calendar-check" style={{ marginRight: '6px' }} />
          Book an In-Person Campus Tour
        </Link>
      </div>

      <PictorialGallery
        photos={photos}
        schools={schList}
        initialCategory={initialCategory}
        initialSchool={initialSchool}
        showSearch={true}
        showCampusFilter={true}
      />
    </Page>
  );
}
