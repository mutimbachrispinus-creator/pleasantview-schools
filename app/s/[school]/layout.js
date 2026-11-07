import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSchool, getSchoolMapsUrl, S } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const s = await getSchool((await params).school);
  return {
    title: s ? `${s.name} (${s.category || 'School'})` : 'School'
  };
}

export default async function SchoolLayout({ children, params }) {
  const s = await getSchool((await params).school);
  if (!s) notFound();
  const st = await S();
  const b = '/s/' + s.slug;
  const schoolMapUrl = getSchoolMapsUrl(s, st.maps_url);
  const schoolLocation = s.location || st.location || 'Githunguri, Komothai Subcounty, Kiambu County';

  return (
    <div>
      <div className="school-subbar" style={{ backgroundColor: '#8B1E2D' }}>
        <div className="wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.22)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: '#fff' }}>
              {s.category || 'SCHOOL'}
            </span>
            <h4 style={{ margin: 0, color: '#ffffff', fontSize: '17px', fontWeight: 700 }}>{s.name}</h4>
            <a
              href={schoolMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open school location in Google Maps"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(0,0,0,0.22)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--gold-accent)' }} />
              <span>{schoolLocation}</span>
            </a>
          </div>
          <ul className="school-subbar-links">
            {[
              ['', 'Overview'],
              ['/about', 'About School'],
              ['/academics', 'Academics (CBE)'],
              ['/news', 'Campus News'],
              ['/gallery', 'Pictorial & Gallery'],
              ['/visit', 'Book a Visit'],
              ['/contact', 'Contact Desk']
            ].map(([h, t]) => (
              <li key={h}>
                <Link href={b + h}>{t}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}
