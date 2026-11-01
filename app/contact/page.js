import Form from '@/components/Form';
import { enquire } from '@/app/actions';

export const metadata = { title: 'Contact Us | Pleasantview Schools' };

export default async function P({ searchParams }) {
  return (
    <Form
      title="Contact Pleasantview Schools"
      intro="Send us a message and our Central Admissions office will reply by phone, SMS, and email."
      action={enquire}
      ok={(await searchParams).ok}
      extra={
        <div className="form-group">
          <label>Your Message *</label>
          <textarea name="message" rows="5" placeholder="Inquire about admissions, CBC curriculum, school transport, or boarding..." required />
        </div>
      }
    />
  );
}
