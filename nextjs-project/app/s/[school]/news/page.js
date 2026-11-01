import Link from 'next/link';
import Page from '@/components/Page';
import { q, getSchool } from '@/lib/db';
export default async function News({ params }) {
  const s = await getSchool((await params).school), p = await q('SELECT * FROM posts WHERE school_id=? ORDER BY id DESC', [s.id]);
  return <Page title={s.name + ' News'}><div className="cards">{p.map(x => <Link key={x.id} className="card" href={`/news/${x.slug}`}>{x.image && <img src={x.image} alt="" />}<h3>{x.title}</h3><small>{x.created.slice(0, 10)}</small></Link>)}</div>{!p.length && <p>No news yet.</p>}</Page>;
}
