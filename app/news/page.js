import Link from 'next/link';
import Page from '@/components/Page';
import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'News & Updates | Pleasantview Schools' };

export default async function News() {
  const posts = await q('SELECT p.*, s.name sname FROM posts p LEFT JOIN schools s ON s.id=p.school_id ORDER BY p.id DESC');

  return (
    <Page title="News & Updates" subtitle="CAMPUS HAPPENINGS" image="/images/banner_3_a.webp">
      <div className="news-grid">
        {posts.map(p => (
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
                {p.body ? p.body.slice(0, 130) + '...' : 'Read more about this story.'}
              </p>
              <span className="news-date">
                <i className="fa-regular fa-calendar" style={{ marginRight: '6px' }} />
                {p.created ? p.created.slice(0, 10) : '2026-11-01'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
