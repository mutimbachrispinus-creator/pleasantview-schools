import Page from '@/components/Page';

export default function Form({ title, intro, action, school = '', extra = null, ok }) {
  return (
    <Page title={title} subtitle="ADMISSIONS & ENQUIRIES">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {ok ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--soft-bg)', borderRadius: '4px', borderLeft: '4px solid var(--primary-navy)' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '48px', color: 'var(--gold-accent)', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '10px' }}>Thank You!</h3>
            <p style={{ fontSize: '16px', color: '#444' }}>Your submission has been safely received. Our admissions staff will reply to you promptly by SMS and email.</p>
          </div>
        ) : (
          <div className="custom-form">
            <h3 style={{ marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>{intro}</p>
            <form action={action}>
              <input type="hidden" name="school" value={school} />
              <div className="form-group">
                <label>Your Full Name *</label>
                <input name="name" placeholder="Parent / Guardian Name" required />
              </div>
              <div className="form-group">
                <label>Phone Number (+254...) *</label>
                <input name="phone" placeholder="+254 711 000 000" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="name@example.com" />
              </div>
              {extra}
              <input name="website" className="hp" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />
              <button type="submit" className="button button-secondary" style={{ marginTop: '10px' }}>
                Submit Information
              </button>
            </form>
          </div>
        )}
      </div>
    </Page>
  );
}
