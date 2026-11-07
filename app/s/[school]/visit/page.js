import Form from '@/components/Form';

export const metadata = { title: 'Book a Campus Visit' };

export default async function P({ params, searchParams }) {
  const { school } = await params;
  return (
    <Form
      title="Book a Campus Visit"
      intro="Tour our modern facilities, interact with teachers, inspect our science & robotics labs, and explore our warm boarding community."
      actionUrl="/api/public/submit?action=book"
      actionName="book"
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
          <div className="form-group">
            <label>Prospective Student Grade / Class</label>
            <input name="grade" placeholder="e.g. PP2, Grade 4, Grade 7, Form 1" />
          </div>
        </>
      }
    />
  );
}
