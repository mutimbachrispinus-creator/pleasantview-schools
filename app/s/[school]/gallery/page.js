import Link from 'next/link';
import { notFound } from 'next/navigation';
import Page from '@/components/Page';
import PictorialGallery from '@/components/PictorialGallery';
import { getSchool, getPhotos } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Gallery({ params }) {
  const s = await getSchool((await params).school);
  if (!s) notFound();
  const photos = await getPhotos(null, s.id).catch(() => []);

  return (
    <Page
      title={`${s.name} — Pictorial & Gallery`}
      subtitle={`${s.category || 'CAMPUS'} VISUAL SHOWCASE`}
      image={s.image || '/images/hero_science_lab.jpg'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
        <p style={{ margin: 0, fontSize: '15.5px', color: '#475569', maxWidth: '720px', lineHeight: 1.7 }}>
          Explore photographs across science laboratories, classrooms, sports pitches, boarding, and student life at {s.name}.
        </p>
        <Link href="/pictorial" className="button button-tertiary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          All Campuses Pictorial &rarr;
        </Link>
      </div>

      <PictorialGallery photos={photos} showSearch={true} />
    </Page>
  );
}
