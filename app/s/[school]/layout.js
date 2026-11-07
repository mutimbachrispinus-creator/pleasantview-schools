import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSchool } from '@/lib/db';

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
  const b = '/s/' + s.slug;

  return (
    <div>
      <div className="school-subbar" style={{ backgroundColor: '#8B1E2D' }}>
        <div className="wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.22)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: '#fff' }}>
              {s.category || 'SCHOOL'}
            </span>
            <h4 style={{ margin: 0, color: '#ffffff', fontSize: '17px', fontWeight: 700 }}>{s.name}</h4>
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
