import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSchool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const s = await getSchool((await params).school);
  return {
    title: s ? `${s.name} (${s.category || 'School'}) | Pleasantview Schools` : 'School Division'
  };
}

export default async function SchoolLayout({ children, params }) {
  const s = await getSchool((await params).school);
  if (!s) notFound();
  const b = '/s/' + s.slug;

  return (
    <div>
      <div className="school-subbar" style={{ backgroundColor: s.color || '#8B1E2D' }}>
        <div className="wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>
              {s.category || 'DIVISION'}
            </span>
            <h4>{s.name}</h4>
          </div>
          <ul className="school-subbar-links">
            {[
              ['', 'Overview'],
              ['/about', 'About Division'],
              ['/academics', 'Academics (CBE)'],
              ['/news', 'Campus News'],
              ['/gallery', 'Gallery'],
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
