import Page from '@/components/Page';
import { getSchool, getSchoolMapsUrl, S } from '@/lib/db';

export default async function About({ params }) {
  const s = await getSchool((await params).school);
  const st = await S();
  const loc = s?.location || st.location || 'Githunguri, Komothai Subcounty, Kiambu County';
  const mapUrl = getSchoolMapsUrl(s, st.maps_url);
  return (
    <Page title={'About ' + s.name}>
      <p>{s.about}</p>
      <h3>Mission</h3>
      <p>{s.mission}</p>
      <h3>Vision</h3>
      <p>{s.vision}</p>
      <h3>School Location</h3>
      <p>
        <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-red)', marginRight: '6px' }} />
        <strong>{loc}</strong>{' '}
        &mdash;{' '}
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--medium-blue)', fontWeight: 700 }}>
          Open Google Maps Directions &rarr;
        </a>
      </p>
    </Page>
  );
}
