import Form from '@/components/Form';
import { getSchool, getSchoolMapsUrl, S } from '@/lib/db';

export const metadata = { title: 'Contact School Desk' };

export default async function P({ params, searchParams }) {
  const { school } = await params;
  const s = await getSchool(school);
  const st = await S();
  const loc = s?.location || st.location || 'Githunguri, Komothai Subcounty, Kiambu County';
  const mapUrl = getSchoolMapsUrl(s, st.maps_url);
  return (
    <Form
      title={`Contact ${s?.name || 'School'} Desk`}
      intro={`Send your admission or curriculum enquiry directly to ${s?.name || 'this school'} (${loc}). We will reply swiftly by SMS and email.`}
      actionUrl="/api/public/submit?action=enquire"
      actionName="enquire"
      school={school}
      ok={(await searchParams).ok}
      extra={
        <>
          <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '3px solid var(--primary-red)', fontSize: '13px', color: '#333' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-red)', marginRight: '6px' }} />
            <strong>Location:</strong> {loc}{' '}
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--medium-blue)', fontWeight: 700, marginLeft: '8px' }}>
              View Map &rarr;
            </a>
          </div>
          <div className="form-group">
            <label>Prospective Student Grade / Class (Optional)</label>
            <input name="grade" placeholder="e.g. PP2, Grade 4, Grade 7, Form 1" />
          </div>
          <div className="form-group">
            <label>Your Message / Enquiry *</label>
            <textarea name="message" rows="5" placeholder="How can our admissions team assist you?" required />
          </div>
        </>
      }
    />
  );
}
