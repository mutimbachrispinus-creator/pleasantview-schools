import Link from 'next/link';
import Page from '@/components/Page';
import { q, getSchool, CATS } from '@/lib/db';
export default async function Gallery({ params }) {
  const s = await getSchool((await params).school), c = await q('SELECT category,COUNT(*) n,MAX(image) cover FROM photos WHERE school_id=? OR school_id=0 GROUP BY category', [s.id]);
  return <Page title={s.name + ' Gallery'}><div className="cards">{CATS.map(k => { const r = c.find(x => x.category === k); return <Link key={k} className="card" href={`/s/${s.slug}/gallery/${encodeURIComponent(k)}`}>{r && <img src={r.cover} alt="" />}<h3>{k}</h3><small>{r ? r.n : 0} photos</small></Link>; })}</div></Page>;
}
