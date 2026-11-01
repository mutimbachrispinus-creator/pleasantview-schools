import Page from '@/components/Page';
import { getSchool } from '@/lib/db';
export default async function About({ params }) { const s = await getSchool((await params).school); return <Page title={'About ' + s.name}><p>{s.about}</p><h3>Mission</h3><p>{s.mission}</p><h3>Vision</h3><p>{s.vision}</p></Page>; }
