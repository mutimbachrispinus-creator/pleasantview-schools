import Link from 'next/link';
import { notFound } from 'next/navigation';
import Page from '@/components/Page';
import PictorialGallery from '@/components/PictorialGallery';
import { getSchool, getPhotos, normalizePictorialCategory } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Cat({ params }) {
  const { school, cat } = await params;
  const s = await getSchool(school);
  if (!s) notFound();

  const rawCat = decodeURIComponent(cat || '');
  const resolvedCat = normalizePictorialCategory(rawCat, rawCat) || rawCat;
  const photos = await getPhotos(null, s.id).catch(() => []);

  return (
    <Page
      title={`${resolvedCat} — ${s.name}`}
      subtitle={`${s.category || 'CAMPUS'} PICTORIAL`}
      image={s.image || '/images/hero_science_lab.jpg'}
    >
      <div style={{ marginBottom: '18px' }}>
        <Link href={`/s/${s.slug}/gallery`} style={{ color: 'var(--primary-red)', fontWeight: 700, fontSize: '13.5px' }}>
          &larr; Back to {s.name} Pictorial
        </Link>
      </div>
      <PictorialGallery photos={photos} initialCategory={resolvedCat} showSearch={true} />
    </Page>
  );
}
