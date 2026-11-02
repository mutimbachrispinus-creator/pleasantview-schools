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
  delEmailAccount,
  addVideo,
  delVideo,
  addJob,
  toggleJobStatus,
  delJob,
  updateApplicationStatus,
  delApplication,
  addLeadershipMessage,
  delLeadershipMessage,
  addQuickLink,
  delQuickLink,
  toggleQuickLink,
  updateVisitStatus,
  delVisit,
  updateEnquiryStatus,
  delEnquiry
} from '@/app/hidden-admin/actions';

const LONG = ['welcome', 'about', 'mission', 'vision'];

const Del = ({ t, id }) => (
  <form action={del} style={{ display: 'inline', marginLeft: '6px' }}>
    <input type="hidden" name="t" value={t} />
    <input type="hidden" name="id" value={String(id)} />
    <button
      type="submit"
      style={{
        background: '#d9534f',
        color: '#fff',
        border: 0,
        padding: '4px 10px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600
      }}
    >
      Delete
    </button>
  </form>
);

export const LoginForm = ({ k = '', title = 'Staff & Admin Portal' }) => (
  <main className="subpage-body">
    <div className="wrapper">
      <div className="custom-form" style={{ margin: '40px auto', maxWidth: '480px' }}>
        <div className="admin-badge"><i className="fa-solid fa-lock" /> AUTHENTICATION</div>
        <h2>{title}</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Please authenticate with your administrative credentials or authorized staff department email (e.g. <code>admin@...</code>, <code>support@...</code>, <code>info@...</code>, <code>admissions@...</code>).
        </p>
        <form action={login}>
          <input type="hidden" name="key" value={k} />
          <div className="form-group">
            <label>Staff / Department Email Address</label>
            <input name="email" type="email" placeholder="e.g. admin@pleasantview.sc.ke, support@..." defaultValue="admin@pleasantview.sc.ke" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••••••" defaultValue="pleasantview2026" required />
          </div>
          <button type="submit" className="button button-secondary" style={{ marginTop: '10px', width: '100%' }}>
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

  const [
    hero,
    posts,
    photos,
    vis,
    enqs,
    inboundSms,
    inboundEmails,
    commLogs,
    emailAccountsList,
    vids,
    jobsList,
    appsList,
    leadMessages,
    quickLinksList
  ] = await Promise.all([
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
      } ORDER BY v.id DESC LIMIT 40`
    ),
    q(
      `SELECT e.*, s.name sname FROM enquiries e LEFT JOIN schools s ON s.id=e.school_id${
        scope ? ' WHERE e.school_id=' + Number(scope) : ''
      } ORDER BY e.id DESC LIMIT 40`
    ),
    q('SELECT * FROM inbound_sms ORDER BY id DESC LIMIT 40'),
    q('SELECT * FROM inbound_emails ORDER BY id DESC LIMIT 40'),
    q('SELECT * FROM comm_logs ORDER BY id DESC LIMIT 40'),
    q('SELECT * FROM email_accounts ORDER BY id ASC'),
    q(
      `SELECT v.*, s.name sname FROM videos v LEFT JOIN schools s ON s.id=v.school_id${
        scope ? ' WHERE v.school_id=' + Number(scope) : ''
      } ORDER BY v.sort ASC, v.id DESC`
    ),
    q(
      `SELECT j.*, s.name sname FROM jobs j LEFT JOIN schools s ON s.id=j.school_id${
        scope ? ' WHERE j.school_id=' + Number(scope) : ''
      } ORDER BY j.id DESC`
    ),
    q('SELECT a.*, j.title job_name FROM job_applications a LEFT JOIN jobs j ON j.id=a.job_id ORDER BY a.id DESC LIMIT 50'),
    q(
      `SELECT m.*, s.name sname FROM leadership_messages m LEFT JOIN schools s ON s.id=m.school_id${
        scope ? ' WHERE m.school_id=' + Number(scope) : ''
      } ORDER BY m.sort ASC, m.id DESC`
    ),
    q('SELECT * FROM quick_links ORDER BY sort ASC, id ASC')
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
    <main className="subpage-body" style={{ background: '#f4f6fa', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="wrapper">
        <div className="admin-panel-container">
          {/* HEADER BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <div className="admin-badge"><i className="fa-solid fa-shield-halved" /> ACTIVE ADMIN SESSION</div>
              <h1 style={{ fontSize: '28px', color: 'var(--primary-navy)', margin: '4px 0 0' }}>
                {scope ? `${me?.name} Staff Portal` : 'Central Management Console: PLEASANTVIEW SCHOOLS'}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link href="/" target="_blank" className="button button-gold" style={{ padding: '8px 16px', fontSize: '13px' }}>
                <i className="fa-solid fa-globe" /> View Live Website
              </Link>
              <form action={logout}>
                <button type="submit" className="button button-tertiary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {/* QUICK NAV / JUMP BAR */}
          <div style={{ background: '#ffffff', padding: '12px 18px', borderRadius: '6px', border: '1px solid #dde2ec', marginBottom: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ color: '#888', alignSelf: 'center' }}>Jump To:</span>
            <a href="#campuses" style={{ color: 'var(--primary-navy)' }}>🏫 Campuses &amp; Population</a>
            <a href="#editor" style={{ color: 'var(--primary-navy)' }}>📝 Details &amp; Profile</a>
            <a href="#leadership" style={{ color: 'var(--primary-navy)' }}>🎙️ Leadership Messages</a>
            <a href="#quicklinks" style={{ color: 'var(--primary-navy)' }}>⚡ Quick Links</a>
            <a href="#videos" style={{ color: 'var(--primary-navy)' }}>🎥 Videos Showcase</a>
            <a href="#careers" style={{ color: 'var(--primary-navy)' }}>💼 Careers &amp; Applications ({appsList.length})</a>
            <a href="#hero" style={{ color: 'var(--primary-navy)' }}>🖼️ Hero Sliders</a>
            <a href="#visits" style={{ color: 'var(--primary-navy)' }}>📅 Campus Visits ({vis.length})</a>
            <a href="#inbound" style={{ color: 'var(--primary-navy)' }}>✉️ SMS &amp; Mailbox Hub</a>
          </div>

          {/* 1. CAMPUSES & CATEGORIES DATA (POPULATION, RATIOS, LEVELS) */}
          {!scope && (
            <section id="campuses" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                    <i className="fa-solid fa-school" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                    School Divisions, Categories &amp; Population Settings
                  </h2>
                  <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                    Data updated here appears live on the website cards, division pages, statistics bar, and Admissions portal.
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>School Name</th>
                      <th>Category</th>
                      <th>Grades / Level</th>
                      <th>Learners Population</th>
                      <th>Boarding Scholars</th>
                      <th>Teacher Ratio</th>
                      <th>Portal Access</th>
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
                          <span style={{ background: 'var(--soft-bg)', color: s.color || '#8B1E2D', padding: '3px 8px', borderRadius: '3px', fontWeight: 700, fontSize: '12px' }}>
                            {s.category || 'SENIOR SCHOOL'}
                          </span>
                        </td>
                        <td>{s.level}</td>
                        <td><strong>{s.learners || '450 Students'}</strong></td>
                        <td>{s.boarders || '200 Boarders'}</td>
                        <td>{s.ratio || '1:20'}</td>
                        <td>
                          <form action={setSchoolAdmin} style={{ display: 'flex', gap: '6px' }}>
                            <input type="hidden" name="school_id" value={s.id} />
                            <input
                              name="admin_email"
                              placeholder="Admin email"
                              defaultValue={s.admin_email}
                              style={{ padding: '5px', fontSize: '12px', width: '130px' }}
                            />
                            <input
                              name="password"
                              type="password"
                              placeholder="New password"
                              style={{ padding: '5px', fontSize: '12px', width: '90px' }}
                            />
                            <button type="submit" style={{ padding: '5px 8px', fontSize: '11px' }}>
                              Save
                            </button>
                          </form>
                        </td>
                        <td>
                          <Link href={`?edit=${s.slug}#editor`} style={{ color: 'var(--medium-blue)', fontWeight: 700, marginRight: '10px' }}>
                            Edit
                          </Link>
                          <Del t="schools" id={s.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ADD NEW SCHOOL DIVISION */}
              <div style={{ marginTop: '25px', background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New School Category / Division</h4>
                <form action={addSchool} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>School Name *</label>
                    <input name="name" placeholder="e.g. Pleasantview Senior School" required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <input name="category" placeholder="e.g. SENIOR SCHOOL, JSS, PRIMARY, EARLY LEARNING" defaultValue="SENIOR SCHOOL" required />
                  </div>
                  <div className="form-group">
                    <label>Level / Grades *</label>
                    <input name="level" placeholder="e.g. Grades 10 – 12 (KCSE & Senior CBC)" required />
                  </div>
                  <div className="form-group">
                    <label>Learners Population *</label>
                    <input name="learners" placeholder="e.g. 520 Students" defaultValue="500 Students" />
                  </div>
                  <div className="form-group">
                    <label>Boarding Population</label>
                    <input name="boarders" placeholder="e.g. 260 Boarders" defaultValue="200 Boarders" />
                  </div>
                  <div className="form-group">
                    <label>Teacher Ratio</label>
                    <input name="ratio" placeholder="e.g. 1:18" defaultValue="1:20" />
                  </div>
                  <div className="form-group">
                    <label>Division Color Theme</label>
                    <input name="color" type="color" defaultValue="#8B1E2D" style={{ height: '44px', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>Division Cover Photo</label>
                    <input type="file" name="image" accept="image/*" />
                  </div>
                  <button type="submit" className="button button-secondary" style={{ gridColumn: '1 / -1', marginTop: '5px' }}>
                    + Publish New School Division
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* 2. EDIT DETAILS (GROUP OR SPECIFIC SCHOOL) */}
          <section id="editor" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                Editing Details: {es ? `${es.name} (${es.category || 'Division'})` : 'Main Group Institution (PLEASANTVIEW SCHOOLS)'}
              </h2>
              {!scope && es && (
                <Link href="?" style={{ color: 'var(--medium-blue)', fontWeight: 700 }}>
                  &larr; Switch to Group Overview
                </Link>
              )}
            </div>

            <form action={saveSchool} key={es?.id || 0} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              <input type="hidden" name="school_id" value={es ? es.id : 0} />
              {keys.map(k => (
                <div key={k} className="form-group" style={{ gridColumn: LONG.includes(k) ? '1 / -1' : 'auto' }}>
                  <label>{k.replace(/_/g, ' ').toUpperCase()}</label>
                  {k === 'color' ? (
                    <input name={k} type="color" defaultValue={vals[k] || '#8B1E2D'} style={{ height: '44px', width: '100%' }} />
                  ) : LONG.includes(k) ? (
                    <textarea name={k} defaultValue={vals[k]} rows={4} />
                  ) : (
                    <input name={k} defaultValue={vals[k]} />
                  )}
                </div>
              ))}
              <button type="submit" className="button button-gold" style={{ gridColumn: '1 / -1', marginTop: '10px', fontSize: '15px' }}>
                Save Changes to {es ? es.name : 'PLEASANTVIEW SCHOOLS'}
              </button>
            </form>
          </section>

          {/* 3. LEADERSHIP & EXECUTIVE MESSAGES (DIRECTOR, HOI, COORDINATOR) */}
          <section id="leadership" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-microphone-lines" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Executive &amp; Leadership Messages ({leadMessages.length})
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Add personalized welcome speeches, inspirational quotes, and letters from the Director, HOI, Academic Coordinators, or Principals with photos.
                </p>
              </div>
            </div>

            {/* LIST OF CURRENT LEADERSHIP MESSAGES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              {leadMessages.map(m => (
                <div key={m.id} style={{ border: '1px solid #dde2ec', borderRadius: '6px', padding: '18px', background: 'var(--soft-bg)', borderLeft: '4px solid var(--primary-navy)' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <img
                      src={m.image || '/images/banner_3_a.webp'}
                      alt={m.name}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-accent)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', background: 'var(--primary-navy)', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontWeight: 700 }}>
                        {m.role || 'Leader'}
                      </span>
                      <h4 style={{ margin: '6px 0 2px', fontSize: '16px' }}>{m.name}</h4>
                      <small style={{ color: '#666', display: 'block', marginBottom: '8px' }}>{m.title} &bull; {m.sname || 'All Schools'}</small>
                    </div>
                  </div>
                  {m.quote && (
                    <blockquote style={{ margin: '12px 0 8px', fontStyle: 'italic', fontSize: '13px', color: '#555', borderLeft: '2px solid var(--gold-accent)', paddingLeft: '8px' }}>
                      &ldquo;{m.quote}&rdquo;
                    </blockquote>
                  )}
                  <p style={{ fontSize: '12.5px', color: '#666', lineHeight: 1.5, margin: '8px 0' }}>
                    {m.message ? m.message.slice(0, 160) + '...' : ''}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <form action={delLeadershipMessage}>
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
                        Remove Message
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD LEADERSHIP MESSAGE FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Publish New Leadership Message</h4>
              <form action={addLeadershipMessage} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <Pick />
                <div className="form-group">
                  <label>Executive Role / Position *</label>
                  <select name="role" defaultValue="Director" required>
                    <option value="Director">Director / Board of Directors</option>
                    <option value="Head of Institution (HOI)">Head of Institution (HOI)</option>
                    <option value="Coordinator">Academic Coordinator / CBC Lead</option>
                    <option value="Principal">Campus Principal</option>
                    <option value="Dean of Students">Dean of Students / Pastoral Care</option>
                    <option value="Chaplain">Chaplain / Spiritual Life</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Leader Full Name *</label>
                  <input name="name" placeholder="e.g. Dr. E. M. Kariuki / Mrs. J. W. Njenga" required />
                </div>
                <div className="form-group">
                  <label>Official Title *</label>
                  <input name="title" placeholder="e.g. Managing Director & Founder / Senior School Principal" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Key Inspirational Quote</label>
                  <input name="quote" placeholder="e.g. Our aim is victory — transforming hearts, minds, bodies, and souls." />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Full Message Body *</label>
                  <textarea name="message" rows={4} placeholder="Write the leadership message, welcome statement, or academic address..." required />
                </div>
                <div className="form-group">
                  <label>Leader Photo Upload</label>
                  <input type="file" name="image_file" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Or Preset / Photo URL</label>
                  <input name="image_url" placeholder="/images/banner_3_a.webp" defaultValue="/images/banner_3_a.webp" />
                </div>
                <div className="form-group">
                  <label>Display Sort Order</label>
                  <input name="sort" type="number" defaultValue="1" style={{ width: '100px' }} />
                </div>
                <button type="submit" className="button button-secondary" style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                  + Publish Leadership Message
                </button>
              </form>
            </div>
          </section>

          {/* 4. QUICK LINKS MANAGER */}
          <section id="quicklinks" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-bolt" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Quick Links &amp; Portal Gateways ({quickLinksList.length})
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Manage fast gateway links (Term Dates, VISOs, Grounds, Policies, Sports, Tenders, Portals) displayed across the website and mobile drawer.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Destination URL</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Sort</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quickLinksList.map(l => (
                    <tr key={l.id}>
                      <td><strong>{l.title}</strong></td>
                      <td><code>{l.url}</code></td>
                      <td>
                        <span style={{ background: 'var(--soft-bg)', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                          {l.category || 'General'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: '#666' }}>{l.description}</td>
                      <td>{l.sort}</td>
                      <td>
                        <span style={{
                          background: l.is_active ? '#d4edda' : '#f8d7da',
                          color: l.is_active ? '#155724' : '#721c24',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {l.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td>
                        <form action={delQuickLink} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={l.id} />
                          <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD QUICK LINK FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New Quick Link</h4>
              <form action={addQuickLink} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Link Title *</label>
                  <input name="title" placeholder="e.g. Term Dates & VISOs / Tenders and Bids" required />
                </div>
                <div className="form-group">
                  <label>Destination URL *</label>
                  <input name="url" placeholder="e.g. /quick-links/term-dates or /about#grounds" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input name="category" placeholder="e.g. Calendar, Governance, Sports, Procurement" defaultValue="General" />
                </div>
                <div className="form-group">
                  <label>Short Description</label>
                  <input name="description" placeholder="Brief summary of what this link opens" />
                </div>
                <div className="form-group">
                  <label>Sort Order Index</label>
                  <input name="sort" type="number" defaultValue="1" style={{ width: '100px' }} />
                </div>
                <button type="submit" className="button button-secondary" style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                  + Add Quick Link
                </button>
              </form>
            </div>
          </section>

          {/* 5. VIDEOS & MEDIA SHOWCASE */}
          <section id="videos" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-video" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Videos Showcase &amp; YouTube Embeds ({vids.length})
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Add video links for campus tours, science exhibitions, sports galas, and choir performances. Displayed on the homepage video carousel.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              {vids.map(v => (
                <div key={v.id} style={{ border: '1px solid #dde2ec', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                  <div style={{ position: 'relative', height: '160px', background: '#000' }}>
                    <img src={v.thumbnail || '/images/hero_science_lab.jpg'} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--gold-accent)', color: '#000', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 800 }}>
                      {v.category || 'Video'}
                    </span>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>{v.title}</h4>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px' }}><code>{v.youtube_url}</code></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <small style={{ color: '#888' }}>{v.sname || 'All Campuses'}</small>
                      <form action={delVideo}>
                        <input type="hidden" name="id" value={v.id} />
                        <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD VIDEO FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New Video Link</h4>
              <form action={addVideo} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <Pick />
                <div className="form-group">
                  <label>Video Title *</label>
                  <input name="title" placeholder="e.g. Science Fair & Robotics Innovations" required />
                </div>
                <div className="form-group">
                  <label>YouTube Link or URL *</label>
                  <input name="youtube_url" placeholder="https://www.youtube.com/watch?v=..." required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category">
                    <option value="Campus Tour">Campus Tour</option>
                    <option value="Academics">Academics &amp; STEM</option>
                    <option value="Sports">Sports &amp; Athletics</option>
                    <option value="Christian Ethos">Christian Ethos &amp; Mentorship</option>
                    <option value="Arts & Choir">Arts &amp; Choir</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Video Thumbnail Upload</label>
                  <input type="file" name="thumbnail_file" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Or Thumbnail URL</label>
                  <input name="thumbnail_url" placeholder="/images/hero_science_lab.jpg" defaultValue="/images/hero_science_lab.jpg" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Video Description</label>
                  <textarea name="description" rows={2} placeholder="Brief summary of what this video showcases..." />
                </div>
                <button type="submit" className="button button-secondary" style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                  + Publish Video to Showcase
                </button>
              </form>
            </div>
          </section>

          {/* 6. CAREERS & JOB POSTINGS (APPLICATIONS REVIEW) */}
          <section id="careers" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-briefcase" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Careers &amp; Job Postings Hub ({jobsList.length} Vacancies &bull; {appsList.length} Applications)
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Post open educator and staff positions. Prospective applicants submit their CVs online at <code>/careers</code>.
                </p>
              </div>
            </div>

            {/* VACANCIES TABLE */}
            <h4 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '12px' }}>Active Vacancies</h4>
            <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Position Title</th>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Contract</th>
                    <th>Campus</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsList.map(j => (
                    <tr key={j.id}>
                      <td><strong>{j.title}</strong></td>
                      <td>{j.department}</td>
                      <td>{j.category}</td>
                      <td>{j.contract_type}</td>
                      <td>{j.sname || 'All Campuses'}</td>
                      <td>{j.deadline}</td>
                      <td>
                        <span style={{
                          background: j.status === 'open' ? '#d4edda' : '#f8d7da',
                          color: j.status === 'open' ? '#155724' : '#721c24',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {j.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <form action={delJob} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={j.id} />
                          <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* POST NEW JOB VACANCY FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px', marginBottom: '35px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Post New Career Opportunity</h4>
              <form action={addJob} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <Pick />
                <div className="form-group">
                  <label>Job Title *</label>
                  <input name="title" placeholder="e.g. Senior School Chemistry & Biology Teacher" required />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input name="department" placeholder="e.g. Sciences / Languages / Humanities" defaultValue="Sciences" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category">
                    <option value="Teaching">Teaching &amp; Faculty</option>
                    <option value="Administration">Administration &amp; Support</option>
                    <option value="Boarding">Boarding &amp; Pastoral</option>
                    <option value="ICT">ICT &amp; Digital Learning</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contract Type</label>
                  <select name="contract_type">
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Application Deadline</label>
                  <input name="deadline" placeholder="e.g. 15th December 2026" defaultValue="Open until filled" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Job Description</label>
                  <textarea name="description" rows={3} placeholder="Key duties, classroom responsibilities, mentorship..." />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Requirements &amp; Qualifications</label>
                  <textarea name="requirements" rows={3} placeholder="TSC Certificate, Bachelor of Education, 3+ years experience..." />
                </div>
                <button type="submit" className="button button-secondary" style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                  + Publish Job Vacancy
                </button>
              </form>
            </div>

            {/* CANDIDATE APPLICATIONS RECEIVED */}
            <h4 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '12px' }}>
              Candidate Applications Received ({appsList.length})
            </h4>
            {!appsList.length ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>No candidate applications received yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Applicant Name</th>
                      <th>Applied Position</th>
                      <th>Contact Email &amp; Phone</th>
                      <th>Experience</th>
                      <th>Cover Letter Snippet</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appsList.map(a => (
                      <tr key={a.id}>
                        <td><strong>{a.applicant_name}</strong></td>
                        <td>{a.job_title || a.job_name || 'General Application'}</td>
                        <td>
                          <a href={`mailto:${a.email}`}>{a.email}</a><br />
                          <a href={`tel:${a.phone}`}>{a.phone}</a>
                        </td>
                        <td>{a.experience}</td>
                        <td style={{ maxWidth: '280px', fontSize: '12px', color: '#555' }}>
                          {a.cover_letter ? a.cover_letter.slice(0, 140) + '...' : '—'}
                        </td>
                        <td style={{ fontSize: '12px', color: '#666' }}>{a.created ? a.created.slice(0, 10) : '—'}</td>
                        <td>
                          <span style={{
                            background: a.status === 'reviewed' ? '#e2f0fb' : '#d4edda',
                            color: a.status === 'reviewed' ? '#004085' : '#155724',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {a.status ? a.status.toUpperCase() : 'NEW'}
                          </span>
                        </td>
                        <td>
                          <form action={delApplication} style={{ display: 'inline' }}>
                            <input type="hidden" name="id" value={a.id} />
                            <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
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
          </section>

          {/* 7. HERO DYNAMIC PICTURES & SLIDERS */}
          <section id="hero" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-images" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Dynamic Hero Picture Banners ({hero.length})
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Manage the high-resolution rotating banner slides, headlines, and call-to-action buttons.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              {hero.map(h => (
                <div key={h.id} style={{ border: '1px solid #dde2ec', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                  <div style={{ height: '140px', position: 'relative' }}>
                    <img src={h.image} alt={h.headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '11px' }}>
                      Slide #{h.sort || 1}
                    </span>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: 'var(--primary-navy)' }}>{h.headline}</h4>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px' }}>{h.sub}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <small style={{ color: '#888' }}>{h.sname || 'All Campuses'}</small>
                      <Del t="hero" id={h.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD HERO SLIDE */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New Hero Slide</h4>
              <form action={addHero} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <Pick />
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Slide Headline *</label>
                  <input name="headline" placeholder="e.g. 24 YEARS OF ACADEMIC EXCELLENCE" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Slide Subtext *</label>
                  <input name="sub" placeholder="e.g. Outstanding KPSEA (EE) and KJSEA (ME1) distinction, with maiden KCSE B+ university transition" required />
                </div>
                <div className="form-group">
                  <label>Slide Photo Upload</label>
                  <input type="file" name="image" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Or Pick Campus Preset Photo</label>
                  <select name="imageUrl" defaultValue="/images/banner_1_a.webp">
                    <option value="/images/banner_1_a.webp">Campus Main Administration (banner_1_a)</option>
                    <option value="/images/banner_2_a.webp">Academic Quadrangle &amp; Classrooms (banner_2_a)</option>
                    <option value="/images/banner_3_a.webp">Learners in Assembly (banner_3_a)</option>
                    <option value="/images/hero_sports_field.jpg">Sports &amp; Athletics Grounds</option>
                    <option value="/images/hero_science_lab.jpg">Science &amp; Robotics Laboratory</option>
                    <option value="/images/hero_library_learning.jpg">Library &amp; Digital Study</option>
                    <option value="/images/girls_high_school3.webp">Girls High School Campus Block</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Primary Button Text</label>
                  <input name="button_text" defaultValue="Explore Our Schools" />
                </div>
                <div className="form-group">
                  <label>Primary Button Link</label>
                  <input name="button_link" defaultValue="/#schools" />
                </div>
                <div className="form-group">
                  <label>Secondary Button Text</label>
                  <input name="button_alt_text" defaultValue="Book a Campus Tour" />
                </div>
                <div className="form-group">
                  <label>Secondary Button Link</label>
                  <input name="button_alt_link" defaultValue="/contact#visit" />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input name="sort" type="number" defaultValue="1" style={{ width: '100px' }} />
                </div>
                <button type="submit" className="button button-secondary" style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                  + Publish Hero Banner
                </button>
              </form>
            </div>
          </section>

          {/* 8. CAMPUS VISITS & PARENT ENQUIRIES */}
          <section id="visits" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <h2 style={{ fontSize: '22px', margin: '0 0 15px', color: 'var(--primary-navy)' }}>
              <i className="fa-regular fa-calendar-check" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
              Campus Visit Bookings ({vis.length})
            </h2>
            {!vis.length ? (
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '30px' }}>No campus visit requests yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: '35px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Parent Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Campus</th>
                      <th>Date</th>
                      <th>Guests</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vis.map(v => (
                      <tr key={v.id}>
                        <td><strong>{v.name}</strong></td>
                        <td><a href={`tel:${v.phone}`}>{v.phone}</a></td>
                        <td>{v.email ? <a href={`mailto:${v.email}`}>{v.email}</a> : '—'}</td>
                        <td>{v.sname || 'All Campuses'}</td>
                        <td><strong>{v.visit_date}</strong></td>
                        <td>{v.guests || 2}</td>
                        <td>
                          <span style={{
                            background: v.status === 'confirmed' ? '#d4edda' : '#fff3cd',
                            color: v.status === 'confirmed' ? '#155724' : '#856404',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {v.status ? v.status.toUpperCase() : 'PENDING'}
                          </span>
                        </td>
                        <td>
                          <form action={delVisit} style={{ display: 'inline' }}>
                            <input type="hidden" name="id" value={v.id} />
                            <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
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

            <h2 style={{ fontSize: '22px', margin: '0 0 15px', color: 'var(--primary-navy)' }}>
              <i className="fa-regular fa-envelope" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
              Admissions Enquiries ({enqs.length})
            </h2>
            {!enqs.length ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>No enquiries yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Campus</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enqs.map(e => (
                      <tr key={e.id}>
                        <td><strong>{e.name}</strong></td>
                        <td><a href={`tel:${e.phone}`}>{e.phone}</a></td>
                        <td>{e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : '—'}</td>
                        <td>{e.sname || 'Group'}</td>
                        <td style={{ maxWidth: '320px', fontSize: '12.5px' }}>{e.message}</td>
                        <td style={{ fontSize: '12px', color: '#666' }}>{e.created ? e.created.slice(0, 10) : '—'}</td>
                        <td>
                          <form action={delEnquiry} style={{ display: 'inline' }}>
                            <input type="hidden" name="id" value={e.id} />
                            <button type="submit" style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
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
          </section>

          {/* 9. NOTIFICATION GATEWAYS & INBOUND COMMUNICATIONS HUB */}
          <section id="inbound" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <h2 style={{ fontSize: '22px', margin: '0 0 10px', color: 'var(--primary-navy)' }}>
              <i className="fa-solid fa-headset" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
              Inbound Communications, SMS &amp; Mailbox Hub
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Monitor live SMS via Africa&apos;s Talking, emails via Resend, and provision department mailboxes.
            </p>

            {/* QUICK STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div style={{ background: 'var(--soft-bg)', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #28a745' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700 }}>INBOUND SMS</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#28a745' }}>{inboundSms.length}</div>
              </div>
              <div style={{ background: 'var(--soft-bg)', padding: '16px', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700 }}>INBOUND EMAILS</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-navy)' }}>{inboundEmails.length}</div>
              </div>
              <div style={{ background: 'var(--soft-bg)', padding: '16px', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700 }}>DEPT ACCOUNTS</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gold-dark)' }}>{emailAccountsList.length}</div>
              </div>
              <div style={{ background: 'var(--soft-bg)', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #17a2b8' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700 }}>COMM LOGS</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#17a2b8' }}>{commLogs.length}</div>
              </div>
            </div>

            {/* GATEWAY TESTING BUTTONS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)' }}>
                <h4 style={{ marginBottom: '8px' }}>Resend Email Gateway</h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Verify outbound transactional email delivery.</p>
                <form action={testResend} style={{ display: 'flex', gap: '8px' }}>
                  <input name="email" type="email" defaultValue="info@pleasantview.sc.ke" style={{ padding: '8px', fontSize: '13px', flex: 1 }} required />
                  <button type="submit" className="button button-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>
                    Send Test
                  </button>
                </form>
              </div>

              <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
                <h4 style={{ marginBottom: '8px' }}>Africa&apos;s Talking SMS Gateway</h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Verify outbound SMS delivery.</p>
                <form action={testAfricasTalking} style={{ display: 'flex', gap: '8px' }}>
                  <input name="phone" type="tel" defaultValue="+254711689913" style={{ padding: '8px', fontSize: '13px', flex: 1 }} required />
                  <button type="submit" className="button button-gold" style={{ padding: '8px 14px', fontSize: '12px' }}>
                    Send Test
                  </button>
                </form>
              </div>

              <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px', borderLeft: '4px solid #28a745' }}>
                <h4 style={{ marginBottom: '8px' }}>
                  <i className="fa-solid fa-mobile-screen" style={{ color: '#28a745', marginRight: '6px' }} />
                  Admin Handset Number (Direct Visitor SMS)
                </h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                  Visitor messages sent from website are routed straight to this mobile number via SMS (with <strong>no automatic auto-reply</strong> to visitor).
                </p>
                <form action={saveSchool} style={{ display: 'flex', gap: '8px' }}>
                  <input type="hidden" name="school_id" value="0" />
                  <input name="admin_sms_phone" type="tel" defaultValue={vals.admin_sms_phone || '+254711689913'} style={{ padding: '8px', fontSize: '13px', flex: 1 }} required />
                  <button type="submit" className="button button-secondary" style={{ padding: '8px 14px', fontSize: '12px' }}>
                    Save Admin Number
                  </button>
                </form>
              </div>
            </div>

            {/* INBOUND SMS TABLE */}
            <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Recent Inbound SMS Messages</h4>
            {!inboundSms.length ? (
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '25px' }}>No inbound SMS messages yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inboundSms.map(m => (
                      <tr key={m.id}>
                        <td><strong>{m.sender}</strong></td>
                        <td><code>{m.receiver}</code></td>
                        <td>{m.text}</td>
                        <td style={{ fontSize: '12px', color: '#666' }}>{m.created ? m.created.slice(0, 16) : '—'}</td>
                        <td>
                          <span style={{
                            background: m.status === 'replied' ? '#e2f0fb' : '#d4edda',
                            color: m.status === 'replied' ? '#004085' : '#155724',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {m.status ? m.status.toUpperCase() : 'RECEIVED'}
                          </span>
                        </td>
                        <td>
                          <details style={{ display: 'inline-block' }}>
                            <summary style={{ cursor: 'pointer', color: 'var(--medium-blue)', fontWeight: 600, fontSize: '12px' }}>
                              Reply
                            </summary>
                            <form action={replySMS} style={{ marginTop: '6px', display: 'grid', gap: '6px', background: 'var(--soft-bg)', padding: '10px', borderRadius: '4px' }}>
                              <input type="hidden" name="to" value={m.sender} />
                              <input type="hidden" name="sms_id" value={m.id} />
                              <input name="message" placeholder="Type SMS reply..." required style={{ padding: '6px', fontSize: '12px' }} />
                              <button type="submit" className="button button-gold" style={{ padding: '4px 8px', fontSize: '11px' }}>
                                Send SMS
                              </button>
                            </form>
                          </details>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
