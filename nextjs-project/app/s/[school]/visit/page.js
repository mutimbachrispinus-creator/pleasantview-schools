import Form from '@/components/Form';
import { book } from '@/app/actions';

export const metadata = { title: 'Book a Campus Visit | Pleasantview Schools' };

export default async function P({ params, searchParams }) {
  const { school } = await params;
  return (
    <Form
      title="Book a Campus Visit"
      intro="Tour our modern facilities, interact with teachers, inspect our science & robotics labs, and explore our warm boarding community."
      action={book}
      school={school}
      ok={(await searchParams).ok}
      extra={
        <>
          <div className="form-group">
            <label>Preferred Visit Date *</label>
            <input name="visit_date" type="date" required />
          </div>
          <div className="form-group">
            <label>Number of Guests (Family Members)</label>
            <input name="guests" type="number" min="1" max="10" defaultValue="2" />
          </div>
        </>
      }
    />
  );
}
