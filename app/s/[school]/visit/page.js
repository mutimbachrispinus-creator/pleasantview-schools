import Form from '@/components/Form';
import { getSchool, getSchoolMapsUrl, S } from '@/lib/db';

export const metadata = { title: 'Book a Campus Visit' };

export default async function P({ params, searchParams }) {
  const { school } = await params;
  const s = await getSchool(school);
  const st = await S();
  const loc = s?.location || st.location || 'Githunguri, Komothai Subcounty, Kiambu County';
  const mapUrl = getSchoolMapsUrl(s, st.maps_url);
  return (
    <Form
      title={`Book a Visit — ${s?.name || 'School Campus'}`}
      intro="Tour our modern facilities, interact with teachers, inspect our science & robotics labs, and explore our warm boarding community."
      actionUrl="/api/public/submit?action=book"
      actionName="book"
      school={school}
      ok={(await searchParams).ok}
      extra={
        <>
          <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '3px solid var(--primary-red)', fontSize: '13px', color: '#333' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-red)', marginRight: '6px' }} />
            <strong>Visit Location:</strong> {loc}{' '}
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--medium-blue)', fontWeight: 700, marginLeft: '8px' }}>
              Directions &rarr;
            </a>
          </div>
          <div className="form-group">
            <label>Preferred Visit Date *</label>
            <input name="visit_date" type="date" required />
          </div>
          <div className="form-group">
            <label>Number of Guests (Family Members)</label>
            <input name="guests" type="number" min="1" max="10" defaultValue="2" />
          </div>
          <div className="form-group">
            <label>Prospective Student Grade / Class</label>
            <input name="grade" placeholder="e.g. PP2, Grade 4, Grade 7, Form 1" />
          </div>
        </>
      }
    />
  );
}
