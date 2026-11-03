import { notFound } from 'next/navigation';
import Link from 'next/link';
import Page from '@/components/Page';
import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const [p] = await q('SELECT title FROM posts WHERE slug=?', [(await params).slug]);
  return { title: p ? p.title : 'Campus News Article' };
}

export default async function Post({ params }) {
  const [p] = await q('SELECT * FROM posts WHERE slug=?', [(await params).slug]);
  if (!p) notFound();

  return (
    <Page title={p.title} subtitle={p.category || 'CAMPUS NEWS'} image={p.image || '/images/banner_2_a.webp'}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-regular fa-calendar" /> Published: {p.created ? p.created.slice(0, 10) : '2026-11-01'}
        </p>
        <div style={{ fontSize: '18px', lineHeight: 1.8, color: '#333' }}>
          {p.body.split(/\n+/).map((t, i) => (
            <p key={i} style={{ marginBottom: '20px' }}>{t}</p>
          ))}
        </div>
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
          <Link href="/news" className="button button-tertiary">
            &larr; Back to All News
          </Link>
        </div>
      </div>
    </Page>
  );
}
