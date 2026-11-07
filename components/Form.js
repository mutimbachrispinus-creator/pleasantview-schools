import Page from '@/components/Page';
import PublicFormEnhancer from '@/components/PublicFormEnhancer';

export default function Form({ title, intro, action, actionUrl = '', actionName = '', school = '', extra = null, ok }) {
  const formProps = actionUrl
    ? { action: actionUrl, method: 'POST', 'data-public-action': actionName || 'submit' }
    : { action };

  return (
    <Page title={title} subtitle="ADMISSIONS & ENQUIRIES">
      <PublicFormEnhancer />
      <div className="portal-entry-container" style={{ maxWidth: '680px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {ok ? (
          <div className="entry-panel-card" style={{ textAlign: 'center', padding: '40px', background: 'var(--soft-bg)', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)', width: '100%', boxSizing: 'border-box' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '48px', color: 'var(--gold-accent)', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '10px' }}>Thank You!</h3>
            <p style={{ fontSize: '16px', color: '#444' }}>Your submission has been safely received. Our admissions staff will reply to you promptly by SMS and email.</p>
          </div>
        ) : (
          <div className="custom-form entry-panel-card" style={{ width: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>{intro}</p>
            <form {...formProps}>
              <input type="hidden" name="school" value={school} />
              <input type="hidden" name="from_division" value="1" />
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
