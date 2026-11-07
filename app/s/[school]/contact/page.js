import Form from '@/components/Form';

export const metadata = { title: 'Contact Division Desk' };

export default async function P({ params, searchParams }) {
  const { school } = await params;
  return (
    <Form
      title="Contact & Admissions Desk"
      intro="Send your admission or curriculum enquiry directly to this campus administration. We will reply swiftly by SMS and email."
      actionUrl="/api/public/submit?action=enquire"
      actionName="enquire"
      school={school}
      ok={(await searchParams).ok}
      extra={
        <>
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
