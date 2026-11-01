import Form from '@/components/Form';
import { enquire } from '@/app/actions';

export const metadata = { title: 'Contact Division | Pleasantview Schools' };

export default async function P({ params, searchParams }) {
  const { school } = await params;
  return (
    <Form
      title="Contact & Admissions Desk"
      intro="Send your admission or curriculum enquiry directly to this campus administration. We will reply swiftly by SMS and email."
      action={enquire}
      school={school}
      ok={(await searchParams).ok}
      extra={
        <div className="form-group">
          <label>Your Message / Enquiry *</label>
          <textarea name="message" rows="5" placeholder="How can our admissions team assist you?" required />
        </div>
      }
    />
  );
}
