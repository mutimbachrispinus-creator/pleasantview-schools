import Page from '@/components/Page';
import { q, getSchool } from '@/lib/db';
export default async function Cat({ params }) {
  const { school, cat } = await params, s = await getSchool(school), c = decodeURIComponent(cat);
  const p = await q('SELECT * FROM photos WHERE school_id=? AND category=? ORDER BY id DESC', [s.id, c]);
  return <Page title={c}><div className="grid">{p.map(x => <a key={x.id} href={x.image} target="_blank"><img src={x.image} alt={x.caption || ''} /></a>)}</div>{!p.length && <p>No photos yet.</p>}</Page>;
}
