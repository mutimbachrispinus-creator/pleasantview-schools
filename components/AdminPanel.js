import Link from 'next/link';
import { q, S, schools, CATS, D, SF } from '@/lib/db';
import {
  login,
  logout,
  addSchool,
  setSchoolAdmin,
  saveSchool,
  addPost,
  addHero,
  updateHero,
  addPhotos,
  del,
  testResend,
  testAfricasTalking,
  replySMS,
  replyEmail,
  simulateInboundSMS,
  simulateInboundEmail,
  delInbound,
  addEmailAccount,
  updateEmailAccount,
  delEmailAccount
} from '@/app/hidden-admin/actions';

const LONG = ['welcome', 'about', 'mission', 'vision'];

const Del = ({ t, id }) => (
  <form action={del} style={{ display: 'inline', marginLeft: '8px' }}>
    <input type="hidden" name="t" value={t} />
    <input type="hidden" name="id" value={String(id)} />
    <button
      type="submit"
      style={{
        background: '#d9534f',
        color: '#fff',
        border: 0,
        padding: '5px 10px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
      Delete
    </button>
  </form>
);

export const LoginForm = ({ k = '', title = 'Staff & Admin Portal' }) => (
  <main className="subpage-body">
    <div className="wrapper">
      <div className="custom-form" style={{ margin: '40px auto' }}>
        <div className="admin-badge"><i className="fa-solid fa-lock" /> AUTHENTICATION</div>
        <h2>{title}</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Please authenticate with your administrative credentials or authorized staff department email (e.g. <code>admin@...</code>, <code>support@...</code>, <code>info@...</code>, <code>admissions@...</code>).
        </p>
        <form action={login}>
          <input type="hidden" name="key" value={k} />
          <div className="form-group">
            <label>Staff / Department Email Address</label>
            <input name="email" type="email" placeholder="e.g. support@pleasantview.sc.ke, info@..., admin@..." required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••••••" required />
          </div>
          <button type="submit" className="button button-secondary" style={{ marginTop: '10px' }}>
            Sign In to Console
          </button>
        </form>
      </div>
    </div>
  </main>
);

export default async function Panel({ scope, edit }) {
  const list = await schools();
  const me = list.find(s => s.id === scope);
  const es = scope ? me : list.find(s => s.slug === edit);

  const keys = es ? SF : Object.keys(D);
  const vals = es || (await S());

  const w = scope ? ' WHERE school_id=' + Number(scope) : '';
  const [hero, posts, photos, vis, enqs, inboundSms, inboundEmails, commLogs, emailAccountsList] = await Promise.all([
    q(
      `SELECT h.*, s.name sname FROM hero h LEFT JOIN schools s ON s.id=h.school_id${
        scope ? ' WHERE h.school_id=' + Number(scope) : ''
      } ORDER BY h.school_id ASC, h.sort ASC, h.id ASC`
    ),
    q(`SELECT id, title, category FROM posts${w} ORDER BY id DESC`),
    q(`SELECT * FROM photos${w} ORDER BY id DESC LIMIT 30`),
    q(
      `SELECT v.*, s.name sname FROM visits v LEFT JOIN schools s ON s.id=v.school_id${
        scope ? ' WHERE v.school_id=' + Number(scope) : ''
      } ORDER BY v.id DESC LIMIT 30`
    ),
    q(
      `SELECT e.*, s.name sname FROM enquiries e LEFT JOIN schools s ON s.id=e.school_id${
        scope ? ' WHERE e.school_id=' + Number(scope) : ''
      } ORDER BY e.id DESC LIMIT 30`
    ),
    q('SELECT * FROM inbound_sms ORDER BY id DESC LIMIT 50'),
    q('SELECT * FROM inbound_emails ORDER BY id DESC LIMIT 50'),
    q('SELECT * FROM comm_logs ORDER BY id DESC LIMIT 50'),
    q('SELECT * FROM email_accounts ORDER BY id ASC')
  ]);

  const Pick = () =>
    scope ? (
      <input type="hidden" name="school_id" value={scope} />
    ) : (
      <div className="form-group">
        <label>Select Target School Division</label>
        <select name="school_id">
          <option value="0">All Schools (Group Main)</option>
          {list.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.category || 'School'})
            </option>
          ))}
        </select>
      </div>
    );

  return (
    <main className="subpage-body" style={{ background: '#f4f6fa' }}>
      <div className="wrapper">
        <div className="admin-panel-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <div className="admin-badge"><i className="fa-solid fa-shield-halved" /> ACTIVE SESSION</div>
              <h1 style={{ fontSize: '28px' }}>{scope ? `${me?.name} Staff Portal` : 'Central Admin: Pleasantview Schools'}</h1>
            </div>
            <form action={logout}>
              <button type="submit" className="button button-tertiary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                Sign Out
              </button>
            </form>
          </div>

          {!scope && (
            <section style={{ marginBottom: '45px', borderBottom: '2px solid var(--soft-bg)', paddingBottom: '35px' }}>
              <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Our Schools &amp; Divisions</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Manage school divisions, categories (e.g. SENIOR SCHOOL, PRIMARY, JSS, EARLY LEARNING), and population counts.
              </p>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>School Name</th>
                    <th>Category</th>
                    <th>Grades / Level</th>
                    <th>Learners</th>
                    <th>Portal Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(s => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.name}</strong>
                        <br />
                        <small style={{ color: '#888' }}>/s/{s.slug}</small>
                      </td>
                      <td>
                        <span style={{ background: 'var(--soft-bg)', color: s.color || '#05286b', padding: '3px 8px', borderRadius: '3px', fontWeight: 700, fontSize: '12px' }}>
                          {s.category || 'SENIOR SCHOOL'}
                        </span>
                      </td>
                      <td>{s.level}</td>
                      <td>{s.learners}</td>
                      <td>
                        <form action={setSchoolAdmin} style={{ display: 'flex', gap: '6px' }}>
                          <input type="hidden" name="school_id" value={s.id} />
                          <input
                            name="admin_email"
                            placeholder="Admin email"
                            defaultValue={s.admin_email}
                            style={{ padding: '6px', fontSize: '12px', width: '130px' }}
                          />
                          <input
                            name="password"
                            type="password"
                            placeholder="New password"
                            style={{ padding: '6px', fontSize: '12px', width: '100px' }}
                          />
                          <button type="submit" style={{ padding: '6px 10px', fontSize: '12px' }}>
                            Save
                          </button>
                        </form>
                      </td>
                      <td>
                        <Link href={`?edit=${s.slug}`} style={{ color: 'var(--medium-blue)', fontWeight: 700, marginRight: '10px' }}>
                          Edit
                        </Link>
                        <Del t="schools" id={s.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '30px', background: 'var(--soft-bg)', padding: '25px', borderRadius: '4px' }}>
                <h4 style={{ marginBottom: '15px' }}>Add New School or Division</h4>
                <form action={addSchool} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>School Name *</label>
                    <input name="name" placeholder="e.g. Pleasantview Senior School" required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <input name="category" placeholder="e.g. SENIOR SCHOOL, JSS, PRIMARY" defaultValue="SENIOR SCHOOL" required />
                  </div>
                  <div className="form-group">
                    <label>Level / Grades *</label>
                    <input name="level" placeholder="e.g. Grades 10 – 12" required />
                  </div>
                  <div className="form-group">
                    <label>Learners Population *</label>
                    <input name="learners" placeholder="e.g. 450 Students" defaultValue="450 Students" />
                  </div>
                  <div className="form-group">
                    <label>Boarding Population</label>
                    <input name="boarders" placeholder="e.g. 200 Boarders" defaultValue="200 Boarders" />
                  </div>
                  <div className="form-group">
                    <label>Teacher Ratio</label>
                    <input name="ratio" placeholder="e.g. 1:18" defaultValue="1:20" />
                  </div>
                  <div className="form-group">
                    <label>Division Color</label>
                    <input name="color" type="color" defaultValue="#05286b" style={{ height: '44px', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>Division Cover Photo</label>
                    <input type="file" name="image" accept="image/*" />
                  </div>
                  <button type="submit" className="button button-secondary" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    + Add New School Division
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* EDIT INSTITUTION OR SCHOOL DETAILS */}
          <section style={{ marginBottom: '45px', borderBottom: '2px solid var(--soft-bg)', paddingBottom: '35px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '22px' }}>
                Editing: {es ? `${es.name} (${es.category || 'Division'})` : 'Group Institution (Pleasantview Schools)'}
              </h2>
              {!scope && es && (
                <Link href="?" style={{ color: 'var(--medium-blue)', fontWeight: 700 }}>
                  &larr; Switch to Group Overview
                </Link>
              )}
            </div>

            <form action={saveSchool} key={es?.id || 0} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <input type="hidden" name="school_id" value={es ? es.id : 0} />
              {keys.map(k => (
                <div key={k} className="form-group" style={{ gridColumn: LONG.includes(k) ? '1 / -1' : 'auto' }}>
                  <label>{k.toUpperCase()}</label>
                  {k === 'color' ? (
                    <input name={k} type="color" defaultValue={vals[k] || '#05286b'} style={{ height: '44px', width: '100%' }} />
                  ) : LONG.includes(k) ? (
                    <textarea name={k} defaultValue={vals[k]} rows={4} />
                  ) : (
                    <input name={k} defaultValue={vals[k]} />
                  )}
                </div>
              ))}
              <button type="submit" className="button button-gold" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                Save Changes to {es ? es.name : 'Group'}
              </button>
            </form>
          </section>

          {/* GATEWAY VERIFICATION (RESEND & AFRICA'S TALKING) */}
          <section style={{ marginBottom: '45px', borderBottom: '2px solid var(--soft-bg)', paddingBottom: '35px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Notification Gateways (Africa&apos;s Talking &amp; Resend)</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Verify and test routes for live SMS delivery via Africa&apos;s Talking and transactional email delivery via Resend.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
              {/* Resend Card */}
              <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '4px', borderLeft: '4px solid var(--primary-navy)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <i className="fa-solid fa-envelope" style={{ fontSize: '20px', color: 'var(--primary-navy)' }} />
                  <h4>Resend Email Gateway</h4>
                </div>
                <p style={{ fontSize: '13.5px', color: '#555', marginBottom: '15px' }}>
                  API Endpoint: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>/api/resend</code>
                </p>
                <form action={testResend} style={{ display: 'grid', gap: '10px' }}>
                  <input name="email" type="email" placeholder="Test recipient email" defaultValue="info@pleasantview.sc.ke" style={{ padding: '10px', fontSize: '14px' }} required />
                  <button type="submit" className="button button-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                    Send Test Email (Resend)
                  </button>
                </form>
              </div>

              {/* Africa's Talking Card */}
              <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '4px', borderLeft: '4px solid var(--gold-accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <i className="fa-solid fa-comment-sms" style={{ fontSize: '20px', color: 'var(--gold-dark)' }} />
                  <h4>Africa&apos;s Talking SMS Gateway</h4>
                </div>
                <p style={{ fontSize: '13.5px', color: '#555', marginBottom: '15px' }}>
                  API Endpoint: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>/api/africastalking</code>
                </p>
                <form action={testAfricasTalking} style={{ display: 'grid', gap: '10px' }}>
                  <input name="phone" type="tel" placeholder="Test phone (+254...)" defaultValue="+254711689913" style={{ padding: '10px', fontSize: '14px' }} required />
                  <button type="submit" className="button button-gold" style={{ padding: '10px 20px', fontSize: '13px' }}>
                    Send Test SMS (Africa&apos;s Talking)
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* INSTITUTIONAL DEPARTMENT EMAIL ACCOUNTS & MAILBOXES (CENTRAL ADMIN) */}
          {!scope && (
            <section style={{ marginBottom: '45px', borderBottom: '2px solid var(--soft-bg)', paddingBottom: '35px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-at" style={{ color: 'var(--gold-accent)' }} />
                    Institutional Email Accounts &amp; Department Mailboxes
                    <span style={{ fontSize: '13px', background: 'var(--primary-navy)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, marginLeft: '8px' }}>Central Admin</span>
                  </h2>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
                    Configure authorized institutional mailboxes (<code>support@pleasantview.sc.ke</code>, <code>info@pleasantview.sc.ke</code>, <code>admissions@...</code>, etc.). Staff assigned to these mailboxes can sign in to the portal with their own credentials, send/receive department messages, and configure automated replies.
                  </p>
                </div>
              </div>

              {/* LIST OF CONFIGURED ACCOUNTS */}
              <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '22px', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-users-gear" style={{ color: 'var(--primary-navy)' }} />
                  Active Department Accounts ({emailAccountsList.length})
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Email Address</th>
                        <th>Department / Unit</th>
                        <th>Display Name</th>
                        <th>Role</th>
                        <th>Login Password</th>
                        <th>Auto-Reply / Forwarding</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailAccountsList.map(acc => (
                        <tr key={acc.id}>
                          <td>
                            <strong><code>{acc.email}</code></strong>
                          </td>
                          <td>{acc.department || 'General Desk'}</td>
                          <td>{acc.display_name}</td>
                          <td>
                            <span style={{ background: 'var(--soft-bg)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                              {acc.role || 'Staff'}
                            </span>
                          </td>
                          <td>
                            <code style={{ background: '#f8f9fa', padding: '2px 6px', borderRadius: '3px', fontSize: '11px' }}>
                              {acc.password || '••••••••'}
                            </code>
                          </td>
                          <td style={{ fontSize: '12px' }}>
                            {acc.auto_reply && <div><i className="fa-solid fa-reply-all" style={{ color: '#28a745', marginRight: '4px' }} /> Auto-Reply: <em>{acc.auto_reply.slice(0, 30)}...</em></div>}
                            {acc.forward_to && <div><i className="fa-solid fa-share" style={{ color: 'var(--medium-blue)', marginRight: '4px' }} /> Fwd: <code>{acc.forward_to}</code></div>}
                            {!acc.auto_reply && !acc.forward_to && <span style={{ color: '#aaa' }}>Standard Inbox</span>}
                          </td>
                          <td>
                            <span style={{
                              background: acc.is_active ? '#d4edda' : '#f8d7da',
                              color: acc.is_active ? '#155724' : '#721c24',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              {acc.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td>
                            <details style={{ display: 'inline-block' }}>
                              <summary style={{ cursor: 'pointer', color: 'var(--medium-blue)', fontWeight: 600, fontSize: '12px' }}>
                                Edit
                              </summary>
                              <form action={updateEmailAccount} style={{ marginTop: '8px', display: 'grid', gap: '8px', minWidth: '280px', background: 'var(--soft-bg)', padding: '12px', borderRadius: '4px' }}>
                                <input type="hidden" name="id" value={acc.id} />
                                <div className="form-group" style={{ marginBottom: '6px' }}>
                                  <label style={{ fontSize: '11px' }}>Display Name</label>
                                  <input name="display_name" defaultValue={acc.display_name} style={{ padding: '6px', fontSize: '12px' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '6px' }}>
                                  <label style={{ fontSize: '11px' }}>Department</label>
                                  <input name="department" defaultValue={acc.department} style={{ padding: '6px', fontSize: '12px' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '6px' }}>
                                  <label style={{ fontSize: '11px' }}>New Password (Leave blank to keep)</label>
                                  <input name="password" type="text" placeholder="New password" style={{ padding: '6px', fontSize: '12px' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '6px' }}>
                                  <label style={{ fontSize: '11px' }}>Forward To (Optional)</label>
                                  <input name="forward_to" type="email" defaultValue={acc.forward_to} placeholder="staff.personal@gmail.com" style={{ padding: '6px', fontSize: '12px' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '6px' }}>
                                  <label style={{ fontSize: '11px' }}>Auto-Reply Template</label>
                                  <textarea name="auto_reply" defaultValue={acc.auto_reply} rows={2} style={{ padding: '6px', fontSize: '12px' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                                  <label><input type="checkbox" name="can_login" value="1" defaultChecked={Boolean(acc.can_login)} /> Allow Portal Login</label>
                                  <label><input type="checkbox" name="is_active" value="1" defaultChecked={Boolean(acc.is_active)} /> Active</label>
                                </div>
                                <button type="submit" className="button button-primary" style={{ padding: '6px 12px', fontSize: '11px', marginTop: '6px' }}>
                                  Save Account
                                </button>
                              </form>
                            </details>
                            <form action={delEmailAccount} style={{ display: 'inline', marginLeft: '8px' }}>
                              <input type="hidden" name="id" value={acc.id} />
                              <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>
                                Del
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CREATE NEW DEPARTMENT EMAIL FORM */}
              <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '22px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-plus-circle" style={{ color: 'var(--gold-accent)' }} />
                  Create New Department Email Account
                </h3>
                <form action={addEmailAccount} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>Department Email Address <span style={{ color: 'red' }}>*</span></label>
                    <input name="email" type="email" placeholder="e.g. support@pleasantview.sc.ke" required style={{ padding: '10px' }} />
                    <small style={{ color: '#666' }}>e.g. <code>support@pleasantview.sc.ke</code>, <code>info@...</code>, <code>accounts@...</code></small>
                  </div>
                  <div className="form-group">
                    <label>Department / Unit Name</label>
                    <input name="department" type="text" placeholder="e.g. ICT &amp; Parent Support Helpdesk" required style={{ padding: '10px' }} />
                  </div>
                  <div className="form-group">
                    <label>Staff Display Name</label>
                    <input name="display_name" type="text" placeholder="e.g. Pleasantview Support Desk" required style={{ padding: '10px' }} />
                  </div>
                  <div className="form-group">
                    <label>Portal Login Password</label>
                    <input name="password" type="text" defaultValue="pleasantview2026" required style={{ padding: '10px' }} />
                    <small style={{ color: '#666' }}>Password used by this staff/department to log in at <code>/hidden-admin</code></small>
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select name="role" style={{ padding: '10px' }}>
                      <option value="Staff">Staff</option>
                      <option value="Executive">Executive</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Accounts">Accounts</option>
                      <option value="Helpdesk">Helpdesk</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>External Forwarding Address (Optional)</label>
                    <input name="forward_to" type="email" placeholder="e.g. onduty.staff@gmail.com" style={{ padding: '10px' }} />
                    <small style={{ color: '#666' }}>Automatically forwards a copy of inbound messages to this email</small>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Automatic Responder Template (Optional)</label>
                    <textarea name="auto_reply" rows={2} placeholder="e.g. Thank you for contacting Pleasantview Support. We have received your inquiry and our team will get back to you within 2 hours." style={{ padding: '10px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <input type="checkbox" name="can_login" value="1" defaultChecked />
                      <strong>Allow this department account to log into the Staff Portal</strong>
                    </label>
                    <button type="submit" className="button button-gold" style={{ padding: '12px 24px', fontSize: '14px' }}>
                      <i className="fa-solid fa-plus" /> Provision Department Account
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* INBOUND COMMUNICATIONS & MESSAGES HUB (CENTRAL ADMIN) */}
          <section style={{ marginBottom: '45px', borderBottom: '2px solid var(--soft-bg)', paddingBottom: '35px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
              <div>
                <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-inbox" style={{ color: 'var(--gold-accent)' }} />
                  Inbound Communications &amp; Messages Hub
                  {!scope && <span style={{ fontSize: '13px', background: 'var(--primary-navy)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, marginLeft: '8px' }}>Central Admin</span>}
                </h2>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
                  Centralized inbox for monitoring incoming SMS from Africa&apos;s Talking, inbound emails via Resend, admissions enquiries, and real-time communication logs.
                </p>
              </div>
            </div>

            {/* QUICK STAT COUNTERS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '16px', borderLeft: '4px solid #28a745' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Inbound SMS</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#28a745', marginTop: '4px' }}>{inboundSms.length}</div>
                <small style={{ color: '#888' }}>Via Africa&apos;s Talking</small>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '16px', borderLeft: '4px solid var(--primary-navy)' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Inbound Emails</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-navy)', marginTop: '4px' }}>{inboundEmails.length}</div>
                <small style={{ color: '#888' }}>Via Resend &amp; Web</small>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '16px', borderLeft: '4px solid var(--gold-accent)' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Parent Enquiries</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gold-dark)', marginTop: '4px' }}>{enqs.length}</div>
                <small style={{ color: '#888' }}>Admissions Desk</small>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '16px', borderLeft: '4px solid #17a2b8' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Total Activity Logs</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#17a2b8', marginTop: '4px' }}>{commLogs.length}</div>
                <small style={{ color: '#888' }}>Inbound + Outbound</small>
              </div>
            </div>

            {/* TAB 1: INBOUND SMS INBOX */}
            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '22px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-comment-sms" style={{ color: '#28a745' }} />
                  Inbound SMS Messages ({inboundSms.length})
                </h3>
                <span style={{ fontSize: '12px', background: 'var(--soft-bg)', padding: '4px 10px', borderRadius: '4px', color: '#555' }}>
                  Webhook: <code>/api/africastalking</code>
                </span>
              </div>

              {!inboundSms.length ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No incoming SMS messages yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sender Phone</th>
                        <th>Shortcode / Number</th>
                        <th>Message Content</th>
                        <th>Received Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inboundSms.map(m => (
                        <tr key={m.id}>
                          <td><strong>{m.sender}</strong></td>
                          <td><code>{m.receiver}</code></td>
                          <td style={{ maxWidth: '340px' }}>{m.text}</td>
                          <td style={{ fontSize: '12px', color: '#666' }}>{m.created ? m.created.slice(0, 16) : '—'}</td>
                          <td>
                            <span style={{
                              background: m.status === 'replied' ? '#e2f0fb' : '#d4edda',
                              color: m.status === 'replied' ? '#004085' : '#155724',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {m.status || 'received'}
                            </span>
                          </td>
                          <td>
                            <details style={{ display: 'inline-block' }}>
                              <summary style={{ cursor: 'pointer', color: 'var(--medium-blue)', fontWeight: 600, fontSize: '12px' }}>
                                Reply
                              </summary>
                              <form action={replySMS} style={{ marginTop: '8px', display: 'grid', gap: '6px', minWidth: '240px', background: 'var(--soft-bg)', padding: '10px', borderRadius: '4px' }}>
                                <input type="hidden" name="to" value={m.sender} />
                                <input type="hidden" name="sms_id" value={m.id} />
                                <input name="message" placeholder="Type SMS reply..." required style={{ padding: '6px', fontSize: '12px' }} />
                                <button type="submit" className="button button-gold" style={{ padding: '5px 10px', fontSize: '11px' }}>
                                  Send SMS Reply
                                </button>
                              </form>
                            </details>
                            <form action={delInbound} style={{ display: 'inline', marginLeft: '8px' }}>
                              <input type="hidden" name="t" value="inbound_sms" />
                              <input type="hidden" name="id" value={m.id} />
                              <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>
                                Del
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* TAB 2: INBOUND EMAILS INBOX */}
            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '22px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-envelope-open-text" style={{ color: 'var(--primary-navy)' }} />
                  Inbound Emails ({inboundEmails.length})
                </h3>
                <span style={{ fontSize: '12px', background: 'var(--soft-bg)', padding: '4px 10px', borderRadius: '4px', color: '#555' }}>
                  Webhook: <code>/api/resend</code>
                </span>
              </div>

              {!inboundEmails.length ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No incoming emails yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sender</th>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Message Content</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inboundEmails.map(e => (
                        <tr key={e.id}>
                          <td>
                            <strong>{e.sender_name || 'Parent'}</strong>
                            <br />
                            <small style={{ color: '#666' }}>{e.sender_email}</small>
                          </td>
                          <td><code>{e.recipient}</code></td>
                          <td><strong>{e.subject}</strong></td>
                          <td style={{ maxWidth: '320px', whiteSpace: 'pre-wrap', fontSize: '12.5px' }}>{e.body}</td>
                          <td style={{ fontSize: '12px', color: '#666' }}>{e.created ? e.created.slice(0, 16) : '—'}</td>
                          <td>
                            <span style={{
                              background: e.status === 'replied' ? '#e2f0fb' : '#d4edda',
                              color: e.status === 'replied' ? '#004085' : '#155724',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {e.status || 'received'}
                            </span>
                          </td>
                          <td>
                            <details style={{ display: 'inline-block' }}>
                              <summary style={{ cursor: 'pointer', color: 'var(--medium-blue)', fontWeight: 600, fontSize: '12px' }}>
                                Reply
                              </summary>
                              <form action={replyEmail} style={{ marginTop: '8px', display: 'grid', gap: '6px', minWidth: '260px', background: 'var(--soft-bg)', padding: '10px', borderRadius: '4px' }}>
                                <input type="hidden" name="to" value={e.sender_email} />
                                <input type="hidden" name="email_id" value={e.id} />
                                <select name="from_account" style={{ padding: '6px', fontSize: '12px' }}>
                                  <option value="">Send From: Default ({e.recipient || 'info@pleasantview.sc.ke'})</option>
                                  {emailAccountsList.map(acc => (
                                    <option key={acc.id} value={acc.email}>
                                      Send From: {acc.email} ({acc.department || acc.display_name})
                                    </option>
                                  ))}
                                </select>
                                <input name="subject" defaultValue={`Re: ${e.subject || 'Pleasantview Inquiry'}`} style={{ padding: '6px', fontSize: '12px' }} />
                                <textarea name="message" placeholder="Type email reply..." rows={3} required style={{ padding: '6px', fontSize: '12px' }} />
                                <button type="submit" className="button button-primary" style={{ padding: '5px 10px', fontSize: '11px' }}>
                                  Send Email Reply
                                </button>
                              </form>
                            </details>
                            <form action={delInbound} style={{ display: 'inline', marginLeft: '8px' }}>
                              <input type="hidden" name="t" value="inbound_emails" />
                              <input type="hidden" name="id" value={e.id} />
                              <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>
                                Del
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* UNIFIED REAL-TIME COMMUNICATIONS LOG */}
            <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '22px', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-list-check" style={{ color: 'var(--medium-blue)' }} />
                Unified Real-Time Communications Log ({commLogs.length})
              </h3>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Direction</th>
                      <th>Type</th>
                      <th>Sender</th>
                      <th>Recipient</th>
                      <th>Subject / Content</th>
                      <th>Status</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commLogs.map(l => (
                      <tr key={l.id}>
                        <td>
                          <span style={{
                            background: l.direction === 'inbound' ? '#d4edda' : '#cce5ff',
                            color: l.direction === 'inbound' ? '#155724' : '#004085',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {l.direction}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            background: l.type === 'sms' ? '#fff3cd' : '#e2e3e5',
                            color: l.type === 'sms' ? '#856404' : '#383d41',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {l.type}
                          </span>
                        </td>
                        <td><small>{l.sender}</small></td>
                        <td><small>{l.recipient}</small></td>
                        <td style={{ maxWidth: '300px', fontSize: '12.5px' }}>
                          {l.subject ? <strong>{l.subject}: </strong> : null}
                          {l.content}
                        </td>
                        <td><small>{l.status}</small></td>
                        <td><small style={{ color: '#888' }}>{l.created ? l.created.slice(0, 16) : '—'}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIMULATE & TEST INBOUND GATEWAY */}
            <div style={{ background: 'var(--soft-bg)', padding: '22px', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
              <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-flask" style={{ color: 'var(--gold-dark)' }} />
                Simulate &amp; Test Inbound Webhooks
              </h4>
              <p style={{ color: '#666', fontSize: '13.5px', marginBottom: '15px' }}>
                Simulate incoming parent SMS or email to verify that the Central Admin inbox receives, displays, and stores them in real-time.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Simulate SMS */}
                <form action={simulateInboundSMS} style={{ display: 'grid', gap: '8px', background: '#fff', padding: '16px', borderRadius: '4px' }}>
                  <strong style={{ fontSize: '13px', color: '#28a745' }}>+ Simulate Inbound SMS (Africa&apos;s Talking)</strong>
                  <input name="sender" placeholder="Sender Phone (+254...)" defaultValue="+254722112233" style={{ padding: '8px', fontSize: '13px' }} required />
                  <textarea name="text" placeholder="SMS message text..." defaultValue="Hello, how can I apply for Form 1 admission?" rows={2} style={{ padding: '8px', fontSize: '13px' }} required />
                  <button type="submit" className="button button-gold" style={{ padding: '8px', fontSize: '12px' }}>
                    Simulate Inbound SMS
                  </button>
                </form>

                {/* Simulate Email */}
                <form action={simulateInboundEmail} style={{ display: 'grid', gap: '8px', background: '#fff', padding: '16px', borderRadius: '4px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--primary-navy)' }}>+ Simulate Inbound Email (Resend)</strong>
                  <input name="name" placeholder="Sender Name" defaultValue="Mercy Mwangi" style={{ padding: '8px', fontSize: '13px' }} required />
                  <input name="email" type="email" placeholder="Sender Email" defaultValue="mercy.mwangi@example.com" style={{ padding: '8px', fontSize: '13px' }} required />
                  <select name="recipient" style={{ padding: '8px', fontSize: '13px' }}>
                    <option value="info@pleasantview.sc.ke">To: info@pleasantview.sc.ke (General Inquiries)</option>
                    <option value="support@pleasantview.sc.ke">To: support@pleasantview.sc.ke (Support Desk)</option>
                    <option value="admissions@pleasantview.sc.ke">To: admissions@pleasantview.sc.ke (Admissions)</option>
                    <option value="accounts@pleasantview.sc.ke">To: accounts@pleasantview.sc.ke (Accounts)</option>
                    {emailAccountsList.filter(a => !['info@pleasantview.sc.ke', 'support@pleasantview.sc.ke', 'admissions@pleasantview.sc.ke', 'accounts@pleasantview.sc.ke'].includes(a.email)).map(a => (
                      <option key={a.id} value={a.email}>To: {a.email} ({a.department})</option>
                    ))}
                  </select>
                  <input name="subject" placeholder="Email Subject" defaultValue="Fee structure inquiry for JSS" style={{ padding: '8px', fontSize: '13px' }} required />
                  <textarea name="body" placeholder="Email body..." defaultValue="Please send me the term 1 fee structure for Grade 7." rows={2} style={{ padding: '8px', fontSize: '13px' }} required />
                  <button type="submit" className="button button-primary" style={{ padding: '8px', fontSize: '12px' }}>
                    Simulate Inbound Email
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* PUBLISH NEWS POST */}
          <section style={{ marginBottom: '45px', borderBottom: '2px solid var(--soft-bg)', paddingBottom: '35px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Publish News &amp; Updates</h2>
            <form action={addPost} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
              <Pick />
              <div className="form-group">
                <label>Article Title *</label>
                <input name="title" placeholder="e.g. 2026 Examination Results & Distinctions" required />
              </div>
              <div className="form-group">
                <label>Category Tag</label>
                <input name="category" placeholder="e.g. Academic Distinction, Admissions, STEM" defaultValue="School News" />
              </div>
              <div className="form-group">
                <label>Article Content / Body *</label>
                <textarea name="body" rows={6} required placeholder="Full news story text..." />
              </div>
              <div className="form-group">
                <label>Featured Image</label>
                <input type="file" name="image" accept="image/*" />
              </div>
              <button type="submit" className="button button-secondary">
                Publish Story
              </button>
            </form>

            <div style={{ marginTop: '25px' }}>
              <h4>Published Articles ({posts.length})</h4>
              <ul style={{ listStyle: 'none', marginTop: '10px' }}>
                {posts.map(p => (
                  <li key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{p.title} <small style={{ color: '#888' }}>({p.category || 'News'})</small></span>
                    <Del t="posts" id={p.id} />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* HERO DYNAMIC PICTURES MANAGER (CENTRAL ADMIN) */}
          <section style={{ marginBottom: '45px', borderBottom: '2px solid var(--soft-bg)', paddingBottom: '35px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-images" style={{ color: 'var(--gold-accent)' }} />
                  Hero Dynamic Pictures Manager {!scope && <span style={{ fontSize: '13px', background: 'var(--primary-navy)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>Central Admin</span>}
                </h2>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
                  Manage the high-impact hero carousel pictures, headlines, sub-taglines, primary CTA buttons, and slide ordering for the group site and campus divisions.
                </p>
              </div>
            </div>

            {/* Current Active Hero Slides Grid */}
            <h4 style={{ marginTop: '25px', marginBottom: '12px' }}>Active Hero Slides ({hero.length})</h4>
            {hero.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '25px' }}>No dynamic hero slides configured yet. Use the form below to add your first slide.</p>
            ) : (
              <div className="admin-hero-grid" style={{ marginBottom: '35px' }}>
                {hero.map(h => (
                  <div key={h.id} className="admin-hero-card">
                    <div
                      className="admin-hero-thumb"
                      style={{ backgroundImage: `url('${h.image || '/images/banner_1_a.webp'}')` }}
                    >
                      <span className="admin-hero-badge">
                        {h.school_id === 0 ? 'Group Homepage' : (h.sname || `Division #${h.school_id}`)}
                      </span>
                      <span className="admin-hero-sort-badge">
                        Order #{h.sort || 0}
                      </span>
                    </div>

                    <div className="admin-hero-body">
                      <div className="admin-hero-headline">{h.headline || 'PLEASANTVIEW SCHOOLS'}</div>
                      <div className="admin-hero-sub">{h.sub || '—'}</div>

                      <div className="admin-hero-ctas">
                        <div>
                          <strong>Primary CTA:</strong> {h.button_text || 'Explore Our Schools'} &rarr; <code style={{ fontSize: '11px' }}>{h.button_link || '/#schools'}</code>
                        </div>
                        <div>
                          <strong>Alt CTA:</strong> {h.button_alt_text || 'Book a Campus Tour'} &rarr; <code style={{ fontSize: '11px' }}>{h.button_alt_link || '/contact#visit'}</code>
                        </div>
                      </div>

                      {/* IN-PLACE EDIT ACCORDION */}
                      <details style={{ marginTop: '8px', fontSize: '13px', background: '#fcfcfc', border: '1px solid #e5e8ef', borderRadius: '4px', padding: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--medium-blue)' }}>
                          <i className="fa-solid fa-pen-to-square" style={{ marginRight: '6px' }} /> Edit Slide Details
                        </summary>

                        <form action={updateHero} style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                          <input type="hidden" name="id" value={h.id} />
                          <div className="form-group">
                            <label>Slide Headline</label>
                            <input name="headline" defaultValue={h.headline} required style={{ padding: '8px', fontSize: '13px' }} />
                          </div>
                          <div className="form-group">
                            <label>Subtext</label>
                            <input name="sub" defaultValue={h.sub} required style={{ padding: '8px', fontSize: '13px' }} />
                          </div>
                          <div className="form-group">
                            <label>New Image File (Optional)</label>
                            <input type="file" name="image" accept="image/*" style={{ fontSize: '12px' }} />
                          </div>
                          <div className="form-group">
                            <label>Or Image URL / Preset Path</label>
                            <input name="imageUrl" defaultValue={h.image} style={{ padding: '8px', fontSize: '13px' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div className="form-group">
                              <label>Primary Button Text</label>
                              <input name="button_text" defaultValue={h.button_text || 'Explore Our Schools'} style={{ padding: '8px', fontSize: '13px' }} />
                            </div>
                            <div className="form-group">
                              <label>Primary Button Link</label>
                              <input name="button_link" defaultValue={h.button_link || '/#schools'} style={{ padding: '8px', fontSize: '13px' }} />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div className="form-group">
                              <label>Alt Button Text</label>
                              <input name="button_alt_text" defaultValue={h.button_alt_text || 'Book a Campus Tour'} style={{ padding: '8px', fontSize: '13px' }} />
                            </div>
                            <div className="form-group">
                              <label>Alt Button Link</label>
                              <input name="button_alt_link" defaultValue={h.button_alt_link || '/contact#visit'} style={{ padding: '8px', fontSize: '13px' }} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Sort Order Index</label>
                            <input name="sort" type="number" defaultValue={h.sort || 0} style={{ padding: '8px', fontSize: '13px', width: '100px' }} />
                          </div>
                          <button type="submit" className="button button-gold" style={{ padding: '8px 16px', fontSize: '13px' }}>
                            Save Slide Updates
                          </button>
                        </form>
                      </details>

                      <div className="admin-hero-actions">
                        <small style={{ color: '#888' }}>ID: #{h.id}</small>
                        <Del t="hero" id={h.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD NEW HERO SLIDE FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '25px', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
              <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-circle-plus" style={{ color: 'var(--gold-dark)' }} />
                Add New Hero Dynamic Picture
              </h4>
              <p style={{ color: '#666', fontSize: '13.5px', marginBottom: '20px' }}>
                Set up a new dynamic slide with custom photography, headline, and calls to action.
              </p>

              <form action={addHero} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <Pick />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Slide Headline *</label>
                  <input name="headline" placeholder="e.g. 24 YEARS OF ACADEMIC EXCELLENCE" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Slide Subtext / Tagline *</label>
                  <input name="sub" placeholder="e.g. Consistently exceeding 390/500 KCPE mean scores and B+ KCSE performance" required />
                </div>

                <div className="form-group">
                  <label>Slide Photo Upload</label>
                  <input type="file" name="image" accept="image/*" />
                  <small style={{ color: '#777', fontSize: '11.5px' }}>Upload local JPG/PNG/WebP (stored directly in DB)</small>
                </div>

                <div className="form-group">
                  <label>Or Pick Campus Preset Photo</label>
                  <select name="imageUrl" defaultValue="/images/banner_1_a.webp">
                    <option value="">-- Choose Preset or Enter Below --</option>
                    <option value="/images/banner_1_a.webp">Campus Main Administration (banner_1_a)</option>
                    <option value="/images/banner_2_a.webp">Academic Quadrangle &amp; Classrooms (banner_2_a)</option>
                    <option value="/images/banner_3_a.webp">Learners in Mentorship Assembly (banner_3_a)</option>
                    <option value="/images/banner_4_a.webp">Sports &amp; Extracurricular Fields (banner_4_a)</option>
                    <option value="/images/girls_high_school3.webp">Girls High School Campus Block (girls_high_school3)</option>
                    <option value="/images/primary_school_1.webp">Primary Flagship Campus (primary_school_1)</option>
                    <option value="/images/early_learning_1.webp">Early Learning Centre Playground (early_learning_1)</option>
                    <option value="/images/gallery_10.webp">Science &amp; Robotics Laboratory (gallery_10)</option>
                    <option value="/images/gallery_12.webp">Library &amp; Digital Learning (gallery_12)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Primary Button Text</label>
                  <input name="button_text" placeholder="e.g. Explore Our Schools" defaultValue="Explore Our Schools" />
                </div>
                <div className="form-group">
                  <label>Primary Button Link</label>
                  <input name="button_link" placeholder="e.g. /#schools" defaultValue="/#schools" />
                </div>

                <div className="form-group">
                  <label>Secondary Button Text</label>
                  <input name="button_alt_text" placeholder="e.g. Book a Campus Tour" defaultValue="Book a Campus Tour" />
                </div>
                <div className="form-group">
                  <label>Secondary Button Link</label>
                  <input name="button_alt_link" placeholder="e.g. /contact#visit" defaultValue="/contact#visit" />
                </div>

                <div className="form-group">
                  <label>Display Order / Sequence Index</label>
                  <input name="sort" type="number" placeholder="1" defaultValue="1" style={{ width: '120px' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button type="submit" className="button button-secondary" style={{ padding: '12px 28px' }}>
                    + Publish Dynamic Hero Picture
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* VISIT BOOKINGS & ENQUIRIES */}
          <section>
            <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Recent Visit Bookings ({vis.length})</h2>
            {!vis.length ? (
              <p style={{ color: '#888', marginBottom: '30px' }}>No campus visit requests yet.</p>
            ) : (
              <table className="admin-table" style={{ marginBottom: '35px' }}>
                <thead>
                  <tr>
                    <th>Parent Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Campus</th>
                    <th>Date</th>
                    <th>Guests</th>
                  </tr>
                </thead>
                <tbody>
                  {vis.map(v => (
                    <tr key={v.id}>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.phone}</td>
                      <td>{v.email || '—'}</td>
                      <td>{v.sname || 'All Campuses'}</td>
                      <td>{v.visit_date}</td>
                      <td>{v.guests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Contact &amp; Admissions Enquiries ({enqs.length})</h2>
            {!enqs.length ? (
              <p style={{ color: '#888' }}>No messages yet.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Campus</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enqs.map(e => (
                    <tr key={e.id}>
                      <td><strong>{e.name}</strong></td>
                      <td>{e.phone}</td>
                      <td>{e.sname || 'Group'}</td>
                      <td>{e.message}</td>
                      <td>{e.created ? e.created.slice(0, 10) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
