import Link from 'next/link';
import BackButton from '@/components/BackButton';
import WebmailClient from '@/components/WebmailClient';
import AdminPasswordChange from '@/components/AdminPasswordChange';
import DeleteButton from '@/components/DeleteButton';
import AdminSyncNotice from '@/components/AdminSyncNotice';
import FormSubmitButton from '@/components/FormSubmitButton';
import {
  q,
  S,
  schools,
  CATS,
  D,
  SF,
  getAdminPanelData,
  getGlanceMetrics,
  getAdmins,
  getPhotos,
  getAllExamResults,
  getAllParentTestimonials,
  getAllAlumniStories,
  getAllLearnerTestimonials,
  getAllEvents
} from '@/lib/db';
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
  delEnquiry,
  createAdminAccount,
  deleteAdminAccount,
  saveGlanceMetrics,
  addSchoolLifePhoto,
  delPhoto,
  saveAdminSmsSettings,
  saveExamResult,
  deleteExamResult,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
  saveAlumniStory,
  deleteAlumniStory,
  saveLearnerTestimonial,
  deleteLearnerTestimonial,
  saveEvent,
  deleteEvent,
  toggleEvent
} from '@/app/hidden-admin/actions';

const LONG = ['welcome', 'about', 'mission', 'vision'];

const Del = ({ t, id }) => (
  <form action={del} style={{ display: 'inline', marginLeft: '6px' }}>
    <input type="hidden" name="t" value={t} />
    <input type="hidden" name="id" value={String(id)} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete this record?"
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
    </DeleteButton>
  </form>
);

export { default as LoginForm } from '@/components/LoginForm';

export default async function Panel({ scope, edit }) {
  const list = await schools();
  const me = list.find(s => s.id === scope);
  const es = scope ? me : list.find(s => s.slug === edit);

  const keys = es ? SF : Object.keys(D);
  const vals = es || (await S());

  const w = scope ? ' WHERE school_id=' + Number(scope) : '';

  const {
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
    quickLinksList,
    adminsList,
    glanceMetrics,
    schoolLifePhotos,
    examResultsList,
    parentTestimonialsList,
    alumniList,
    learnersList,
    eventsList
  } = await getAdminPanelData(scope);

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
          <AdminSyncNotice />
          <BackButton fallback="/" label="Back to Website" current="Staff & Admin Console" />
          {/* HEADER BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <div className="admin-badge"><i className="fa-solid fa-shield-halved" /> ACTIVE ADMIN SESSION</div>
              <h1 style={{ fontSize: '28px', color: 'var(--primary-navy)', margin: '4px 0 0' }}>
                {scope ? `${me?.name} Staff Portal` : 'Central Management Console: PLEASANT VIEW SCHOOLS'}
              </h1>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#e6f4ea',
                color: '#137333',
                border: '1px solid #b7e1cd',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                marginTop: '6px'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#137333', display: 'inline-block' }} />
                Instant Live Sync Active &bull; Published changes revalidate automatically across all devices
              </div>
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
          <div style={{ background: '#ffffff', padding: '12px 18px', borderRadius: '6px', border: '1px solid #dde2ec', marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ color: '#888', alignSelf: 'center' }}>Jump To:</span>
            <a href="#webmail" style={{ color: 'var(--primary-red)', fontWeight: 800 }}>📬 Webmail Hub</a>
            <a href="#campuses" style={{ color: 'var(--primary-navy)' }}>🏫 Campuses</a>
            <a href="#admins" style={{ color: 'var(--primary-navy)' }}>👥 Admins ({adminsList.length})</a>
            <a href="#security" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>🔒 OTP Security</a>
            <a href="#exams" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>🎓 Exam Results ({examResultsList.length})</a>
            <a href="#parent-reviews" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>
              💬 Parent Reviews {parentTestimonialsList.filter(t => t.status === 'pending').length > 0 && `(${parentTestimonialsList.filter(t => t.status === 'pending').length} Pending)`}
            </a>
            <a href="#learner-voices" style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>🌟 Student Voices ({learnersList.length})</a>
            <a href="#alumni" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>🏆 Alumni ({alumniList.length})</a>
            <a href="#events" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>📅 Events ({eventsList.length})</a>
            <a href="#metrics" style={{ color: 'var(--primary-navy)' }}>📊 Distinction Metrics</a>
            <a href="#gallery" style={{ color: 'var(--primary-navy)' }}>📸 Gallery ({schoolLifePhotos.length})</a>
            <a href="#editor" style={{ color: 'var(--primary-navy)' }}>📝 Profile</a>
            <a href="#leadership" style={{ color: 'var(--primary-navy)' }}>🎙️ Leadership</a>
            <a href="#quicklinks" style={{ color: 'var(--primary-navy)' }}>⚡ Quick Links</a>
            <a href="#videos" style={{ color: 'var(--primary-navy)' }}>🎥 Videos</a>
            <a href="#careers" style={{ color: 'var(--primary-navy)' }}>💼 Careers ({appsList.length})</a>
            <a href="#hero" style={{ color: 'var(--primary-navy)' }}>🖼️ Hero Sliders</a>
            <a href="#visits" style={{ color: 'var(--primary-navy)' }}>📅 Tours ({vis.length})</a>
            <a href="#inbound" style={{ color: 'var(--primary-navy)' }}>✉️ SMS Hub</a>
          </div>

          {/* 1. CAMPUSES & CATEGORIES DATA (POPULATION, RATIOS, LEVELS, LOCATION, BRANCH ADMIN) */}
          {!scope && (
            <section id="campuses" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                    <i className="fa-solid fa-school" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                    School Divisions, Campuses &amp; Branches
                  </h2>
                  <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                    Configure campus names, categories, education levels, physical locations, and assigned branch administrators.
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>School / Branch Name</th>
                      <th>Category</th>
                      <th>Grades / Level</th>
                      <th>Location</th>
                      <th>Branch Admin</th>
                      <th>Learners</th>
                      <th>Boarding</th>
                      <th>Ratio</th>
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
                        <td style={{ fontSize: '13px', color: '#555' }}>{s.location || 'Githunguri, Kiambu'}</td>
                        <td style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>{s.admin_name || s.admin_email || 'Assigned Head'}</td>
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
                <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New School Branch / Division</h4>
                <form action={addSchool} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>School Name *</label>
                    <input name="name" placeholder="e.g. Pleasant View Senior School" required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <input name="category" placeholder="e.g. SENIOR SCHOOL, JSS, PRIMARY, EARLY LEARNING" defaultValue="SENIOR SCHOOL" required />
                  </div>
                  <div className="form-group">
                    <label>Level / Grades *</label>
                    <input name="level" placeholder="e.g. Grades 10 – 12 (Form 1 – 4)" defaultValue="Grades 10 – 12" required />
                  </div>
                  <div className="form-group">
                    <label>Operating Admin Username / Email</label>
                    <input name="admin_email" placeholder="e.g. senior@pleasantviewschools.co.ke" />
                    <small style={{ color: '#888', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                      Auto-derived based on first name of school (e.g. senior@...) if left blank.
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Operating Admin Initial Password *</label>
                    <input name="admin_password" type="password" placeholder="Set temporary operating password" required />
                    <small style={{ color: '#888', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                      Operating admin will be prompted to change upon first OTP login.
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Campus Location *</label>
                    <input name="location" placeholder="e.g. Githunguri, Komothai Subcounty, Kiambu" defaultValue="Githunguri, Komothai Subcounty, Kiambu County" required />
                  </div>
                  <div className="form-group">
                    <label>Assigned Branch Admin Name</label>
                    <input name="admin_name" placeholder="e.g. Mrs. Grace Njeri (Principal)" defaultValue="Branch Principal" />
                  </div>
                  <div className="form-group">
                    <label>Learners Population</label>
                    <input name="learners" placeholder="e.g. 500 Students" defaultValue="500 Students" />
                  </div>
                  <div className="form-group">
                    <label>Boarding Population</label>
                    <input name="boarders" placeholder="e.g. 200 Boarders" defaultValue="200 Boarders" />
                  </div>
                  <div className="form-group">
                    <label>Teacher-Student Ratio</label>
                    <input name="ratio" placeholder="e.g. 1:20" defaultValue="1:20" />
                  </div>
                  <div className="form-group">
                    <label>Division Color Theme</label>
                    <input name="color" type="color" defaultValue="#8B1E2D" style={{ height: '44px', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>Division Cover Photo</label>
                    <input type="file" name="image" accept="image/*" />
                  </div>
                  <FormSubmitButton
                    label="+ Publish New School Branch"
                    pendingLabel="Publishing & Syncing..."
                    successLabel="✓ Branch Published & Synced Live!"
                    variant="secondary"
                    style={{ gridColumn: '1 / -1', marginTop: '5px' }}
                  />
                </form>
              </div>
            </section>
          )}

          {/* 1B. STAFF & ADMINISTRATOR ACCOUNTS (CREATE & MANAGE ADMINS) */}
          {!scope && (
            <section id="admins" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                    <i className="fa-solid fa-user-shield" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                    Staff &amp; Administrator Accounts
                  </h2>
                  <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                    Create and manage authorized administrators for specific school branches or central management.
                  </p>
                </div>
              </div>

              {/* LIST OF CURRENT ADMINS */}
              <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Administrator Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Assigned Branch / Campus</th>
                      <th>Mobile Handset (SMS Alert)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminsList.map(a => (
                      <tr key={a.id}>
                        <td>
                          <strong>{a.name}</strong>
                        </td>
                        <td>{a.email}</td>
                        <td>
                          <span style={{
                            background: a.role === 'Super Administrator' ? 'rgba(139,30,45,0.1)' : 'rgba(5,40,107,0.1)',
                            color: a.role === 'Super Administrator' ? '#8B1E2D' : 'var(--primary-navy)',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontWeight: 700,
                            fontSize: '12px'
                          }}>
                            {a.role}
                          </span>
                        </td>
                        <td>{a.school_name || 'All Campuses'}</td>
                        <td>{a.phone || '+254 711 689 913'}</td>
                        <td>
                          <form action={deleteAdminAccount} style={{ display: 'inline' }}>
                            <input type="hidden" name="id" value={a.id} />
                            <DeleteButton
                              confirmMessage="Permanently remove this administrator account?"
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
                            </DeleteButton>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CREATE ANOTHER ADMIN FORM */}
              <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Create Another Administrator</h4>
                <form action={createAdminAccount} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>Administrator Full Name *</label>
                    <input name="name" placeholder="e.g. John Mwangi" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input name="email" type="email" placeholder="jmwangi@pleasantviewschools.co.ke" required />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input name="password" type="password" placeholder="Create administrator password" required />
                  </div>
                  <div className="form-group">
                    <label>Administrator Role *</label>
                    <select name="role">
                      <option value="Branch Administrator">Branch Administrator (School Campus Head)</option>
                      <option value="Super Administrator">Super Administrator (Central Management)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assigned School Branch *</label>
                    <select name="school_name">
                      <option value="All Campuses">All Campuses (Central Executive)</option>
                      {list.map(s => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.category || 'Division'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Mobile Handset Phone (For SMS Alerts)</label>
                    <input name="phone" placeholder="+254 711 000 000" defaultValue="+254 711 689 913" />
                  </div>
                  <FormSubmitButton
                    label="+ Register Administrator Account"
                    pendingLabel="Registering & Syncing..."
                    successLabel="✓ Administrator Registered & Synced Live!"
                    variant="gold"
                    style={{ gridColumn: '1 / -1', marginTop: '5px' }}
                  />
                </form>
              </div>
            </section>
          )}

          {/* 1B-2. PASSWORD CHANGE WITH AUTO-GENERATED OTP */}
          <section id="security" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <h2 style={{ fontSize: '22px', margin: '0 0 10px', color: 'var(--primary-navy)' }}>
              <i className="fa-solid fa-key" style={{ color: 'var(--primary-red)', marginRight: '8px' }} />
              Administrator Security &amp; Password Management (OTP Verified)
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Central administrators (username: <code>admin</code>) and created school operating administrators can update their login credentials. A 6-digit One-Time Password (OTP) is automatically generated and dispatched to the administrator&apos;s verified email address to confirm the update.
            </p>
            <AdminPasswordChange
              defaultEmail={vals.admin_recovery_email || vals.admin_email || 'admin@pleasantviewschools.co.ke'}
              defaultPhone={vals.admin_recovery_phone || vals.admin_sms_phone || vals.phone || '+254 711 689 913'}
            />
          </section>

          {/* 1C-1. ACADEMIC EXAMINATION RESULTS (NATIONAL & IN-SCHOOL) */}
          <section id="exams" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-award" style={{ color: 'var(--primary-red)', marginRight: '8px' }} />
                  Academic Examination Results Manager (National &amp; In-School)
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Manage external national assessment statistics (KPSEA, KJSEA, Senior KCSE) and internal school formative exam series displayed on /about#academics.
                </p>
              </div>
            </div>

            {/* LIST OF CURRENT EXAM RESULTS */}
            <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Exam / Assessment Name</th>
                    <th>School / Division</th>
                    <th>Year</th>
                    <th>Mean Score / Band</th>
                    <th>Cohort</th>
                    <th>Highlights</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {examResultsList.map(e => (
                    <tr key={e.id}>
                      <td>
                        <span style={{
                          background: e.exam_category === 'national' ? 'rgba(139,30,45,0.1)' : 'rgba(5,40,107,0.1)',
                          color: e.exam_category === 'national' ? 'var(--primary-red)' : 'var(--primary-navy)',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {e.exam_category}
                        </span>
                      </td>
                      <td>
                        <strong>{e.exam_name}</strong>
                      </td>
                      <td>{e.school_name || 'All Campuses'}</td>
                      <td>{e.academic_year}</td>
                      <td><strong style={{ color: 'var(--primary-red)' }}>{e.mean_grade}</strong></td>
                      <td>{e.cohort_size || '—'}</td>
                      <td style={{ fontSize: '12px', maxWidth: '240px' }}>
                        <div>{e.performance_breakdown}</div>
                        {e.top_subjects && <small style={{ color: '#666' }}>Subjects: {e.top_subjects}</small>}
                      </td>
                      <td>
                        <span style={{ background: e.is_published ? '#d4edda' : '#fff3cd', color: e.is_published ? '#155724' : '#856404', padding: '2px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                          {e.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <form action={deleteExamResult} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={e.id} />
                          <DeleteButton
                            style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                            confirmMessage="Delete this exam result?"
                          >
                            Delete
                          </DeleteButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD / UPDATE EXAM RESULT FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Publish New Academic Assessment Result</h4>
              <form action={saveExamResult} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Assessment Category *</label>
                  <select name="exam_category" required>
                    <option value="national">National External Exam (KPSEA / KJSEA / KCSE / KSSEA)</option>
                    <option value="internal">In-School Internal Exam (Continuous / Mocks / STEM)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target School Division *</label>
                  <select name="school_name">
                    <option value="All Campuses">All Campuses (Group Aggregate)</option>
                    {list.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Examination / Assessment Title *</label>
                  <input name="exam_name" placeholder="e.g. KPSEA 2026 Assessment" required />
                </div>

                <div className="form-group">
                  <label>Academic Year *</label>
                  <input name="academic_year" defaultValue="2026" required />
                </div>

                <div className="form-group">
                  <label>Mean Score / Benchmark *</label>
                  <input name="mean_grade" placeholder="e.g. EE (Exceeding Expectations) or B+ (9.42 Points)" required />
                </div>

                <div className="form-group">
                  <label>Cohort Size</label>
                  <input name="cohort_size" placeholder="e.g. 115 Registered Candidates" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Performance Breakdown / Transition Metrics</label>
                  <input name="performance_breakdown" placeholder="e.g. 78% Exceeding Expectations (EE), 22% Meeting Expectations (ME1). 100% Transition to JSS." />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Top Subject Distinctions</label>
                  <input name="top_subjects" placeholder="e.g. Mathematics (96%), Integrated Science (94%), Pre-Technical (93%)" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Summary Notes / Honors Context</label>
                  <textarea name="summary_notes" rows="2" placeholder="e.g. Consistently placed in the top 10 benchmark primary institutions in Kiambu County." />
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                    <input type="checkbox" name="is_published" value="1" defaultChecked />
                    <strong>Publish immediately to public website (/about#academics)</strong>
                  </label>
                  <input type="hidden" name="sort" value="1" />
                </div>

                <FormSubmitButton
                  label="Save & Sync Exam Result"
                  pendingLabel="Saving & Syncing Live..."
                  successLabel="✓ Exam Result Saved & Synced Live!"
                  icon="fa-solid fa-floppy-disk"
                  variant="gold"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
              </form>
            </div>
          </section>

          {/* 1C-2. PARENT & GUARDIAN TESTIMONIALS (APPROVAL QUEUE) */}
          <section id="parent-reviews" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-comments" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Parent &amp; Guardian Testimonials &amp; Approval Queue
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Review comments submitted by parents and guardians. Only approved reviews appear on the public landing page.
                </p>
              </div>
              <div>
                {parentTestimonialsList.filter(t => t.status === 'pending').length > 0 ? (
                  <span style={{ background: '#fff3cd', color: '#856404', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 800 }}>
                    ⚠️ {parentTestimonialsList.filter(t => t.status === 'pending').length} Review(s) Awaiting Approval
                  </span>
                ) : (
                  <span style={{ background: '#d4edda', color: '#155724', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 800 }}>
                    ✓ All Reviews Moderated
                  </span>
                )}
              </div>
            </div>

            {/* REVIEWS TABLE */}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Parent / Guardian</th>
                    <th>Learner &amp; Grade</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Contact</th>
                    <th>Submitted</th>
                    <th>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parentTestimonialsList.map(t => (
                    <tr key={t.id} style={{ background: t.status === 'pending' ? '#fffdf5' : 'inherit' }}>
                      <td>
                        <span style={{
                          background: t.status === 'approved' ? '#d4edda' : t.status === 'pending' ? '#fff3cd' : '#f8d7da',
                          color: t.status === 'approved' ? '#155724' : t.status === 'pending' ? '#856404' : '#721c24',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {t.status}
                        </span>
                      </td>
                      <td><strong>{t.parent_name}</strong><br /><small style={{ color: '#888' }}>{t.relationship || 'Parent'}</small></td>
                      <td>
                        <strong>{t.grade_or_division}</strong>
                        {t.learner_name && <div style={{ fontSize: '12px', color: '#666' }}>Pupil: {t.learner_name}</div>}
                      </td>
                      <td>
                        <span style={{ color: 'var(--gold-accent)', fontSize: '14px' }}>
                          {'★'.repeat(t.rating || 5)}
                        </span>
                      </td>
                      <td style={{ fontSize: '13.5px', maxWidth: '320px', lineHeight: 1.5 }}>
                        &ldquo;{t.comment}&rdquo;
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {t.phone && <div>{t.phone}</div>}
                        {t.email && <small style={{ color: '#777' }}>{t.email}</small>}
                      </td>
                      <td style={{ fontSize: '12px', color: '#777' }}>{t.created_at ? t.created_at.slice(0, 10) : 'Recent'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {t.status !== 'approved' && (
                            <form action={approveTestimonial} style={{ display: 'inline' }}>
                              <input type="hidden" name="id" value={t.id} />
                              <button type="submit" style={{ background: '#28a745', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>
                                ✓ Approve
                              </button>
                            </form>
                          )}
                          {t.status !== 'rejected' && (
                            <form action={rejectTestimonial} style={{ display: 'inline' }}>
                              <input type="hidden" name="id" value={t.id} />
                              <button type="submit" style={{ background: '#495057', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
                                Reject
                              </button>
                            </form>
                          )}
                          <form action={deleteTestimonial} style={{ display: 'inline' }}>
                            <input type="hidden" name="id" value={t.id} />
                            <DeleteButton
                              style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}
                              confirmMessage="Permanently delete this review?"
                            >
                              Delete
                            </DeleteButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 1C-3. EXISTING LEARNERS / STUDENT BODY VOICES & PHOTOS */}
          <section id="learner-voices" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--primary-navy)', marginRight: '8px' }} />
                  Existing Learners / School Student Body Voices
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Upload and update perspectives and comments from our enrolled scholars alongside their photos, classes, and future ambitions.
                </p>
              </div>
            </div>

            {/* CURRENT LEARNERS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '25px' }}>
              {learnersList.map(l => (
                <div key={l.id} style={{ border: '1px solid #dde2ec', borderRadius: '8px', padding: '18px', background: 'var(--soft-bg)' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', backgroundImage: `url('${l.photo_url || '/images/girls_high_school3.webp'}')`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, border: '2px solid var(--gold-accent)' }} />
                    <div>
                      <strong style={{ fontSize: '15px', color: 'var(--primary-navy)', display: 'block' }}>{l.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--primary-red)', fontWeight: 700 }}>{l.grade_or_class}</span>
                      <small style={{ display: 'block', color: '#777', fontSize: '11px' }}>{l.school_name}</small>
                    </div>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#444', fontStyle: 'italic', lineHeight: 1.5, margin: '0 0 10px' }}>
                    &ldquo;{l.comment}&rdquo;
                  </p>
                  {(l.favorite_subject || l.future_aspiration) && (
                    <div style={{ fontSize: '12px', color: '#666', paddingTop: '8px', borderTop: '1px dashed #ccc' }}>
                      {l.favorite_subject && <div><strong>Favorite Subject:</strong> {l.favorite_subject}</div>}
                      {l.future_aspiration && <div><strong>Ambition:</strong> {l.future_aspiration}</div>}
                    </div>
                  )}
                  <div style={{ marginTop: '12px', textAlign: 'right' }}>
                    <form action={deleteLearnerTestimonial} style={{ display: 'inline' }}>
                      <input type="hidden" name="id" value={l.id} />
                      <DeleteButton
                        style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                        confirmMessage="Delete this learner comment?"
                      >
                        Delete
                      </DeleteButton>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD LEARNER VOICE FORM */}
            <div style={{ background: '#ffffff', border: '1px solid #e1e7f0', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New Student Body Comment &amp; Photo</h4>
              <form action={saveLearnerTestimonial} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Learner Full Name *</label>
                  <input name="name" placeholder="e.g. Brenda Cherono" required />
                </div>
                <div className="form-group">
                  <label>Grade / Class *</label>
                  <input name="grade_or_class" placeholder="e.g. Form 3 Senior Girls or Grade 8 JSS" required />
                </div>
                <div className="form-group">
                  <label>Campus Division *</label>
                  <select name="school_name">
                    <option value="All Campuses">All Campuses</option>
                    {list.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Upload Scholar Photo</label>
                  <input name="image_file" type="file" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Or Image URL Path</label>
                  <input name="image_url" placeholder="/images/girls_high_school3.webp" />
                </div>
                <div className="form-group">
                  <label>Favorite Subject / Interest</label>
                  <input name="favorite_subject" placeholder="e.g. Robotics, Physics, Mathematics" />
                </div>
                <div className="form-group">
                  <label>Future Career Aspiration</label>
                  <input name="future_aspiration" placeholder="e.g. Aeronautical Engineer" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Learner Comment / Perspective *</label>
                  <textarea name="comment" rows="3" placeholder="Share what the scholar enjoys about studying, laboratory experiments, or boarding at Pleasant View..." required />
                </div>
                <FormSubmitButton
                  label="Publish Student Voice"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Student Voice Published & Synced Live!"
                  icon="fa-solid fa-plus"
                  variant="primary"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
              </form>
            </div>
          </section>

          {/* 1C-4. ALUMNI SUCCESS STORIES (PHOTOS & VIDEOS <= 10MB) */}
          <section id="alumni" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-trophy" style={{ color: 'var(--gold-dark)', marginRight: '8px' }} />
                  Alumni Success Stories &amp; Videos (Max 10MB)
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Highlight alumni who have graduated from Pleasant View, their university/career milestones, photos, and video testimonials (video uploads strictly &le; 10MB).
                </p>
              </div>
            </div>

            {/* ALUMNI CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              {alumniList.map(a => (
                <div key={a.id} style={{ border: '1px solid #dde2ec', borderRadius: '8px', overflow: 'hidden', background: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: '180px', backgroundImage: `url('${a.image_url || '/images/girls_high_school3.webp'}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--primary-red)', color: '#fff', padding: '3px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 800 }}>
                      {a.grad_year}
                    </span>
                    {a.video_url && (
                      <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: 'var(--gold-accent)', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                        <i className="fa-solid fa-video" /> Video Attached
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '18px' }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '17px', color: 'var(--primary-navy)' }}>{a.name}</h4>
                    <div style={{ fontSize: '13px', color: 'var(--primary-red)', fontWeight: 700, marginBottom: '6px' }}>{a.current_role}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>{a.university_or_company}</div>
                    {a.quote && (
                      <p style={{ fontSize: '13.5px', fontStyle: 'italic', color: '#333', lineHeight: 1.5, margin: '0 0 10px', background: 'var(--soft-bg)', padding: '10px', borderRadius: '4px' }}>
                        &ldquo;{a.quote}&rdquo;
                      </p>
                    )}
                    <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, margin: 0 }}>
                      {a.story}
                    </p>
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #eee', textAlign: 'right' }}>
                      <form action={deleteAlumniStory} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={a.id} />
                        <DeleteButton
                          style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}
                          confirmMessage="Delete this alumni story?"
                        >
                          Delete Story
                        </DeleteButton>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD ALUMNI STORY FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Publish Alumni Success Story</h4>
              <form action={saveAlumniStory} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Alumnus Full Name *</label>
                  <input name="name" placeholder="e.g. Dr. Kevin Njoroge" required />
                </div>
                <div className="form-group">
                  <label>Graduation Year / Class *</label>
                  <input name="grad_year" placeholder="e.g. Class of 2017" required />
                </div>
                <div className="form-group">
                  <label>Division Attended</label>
                  <input name="campus_division" defaultValue="Pleasant View Senior School" />
                </div>
                <div className="form-group">
                  <label>Current Profession / Title *</label>
                  <input name="current_role" placeholder="e.g. Medical Doctor / Software Engineer" required />
                </div>
                <div className="form-group">
                  <label>University / Company</label>
                  <input name="university_or_company" placeholder="e.g. University of Nairobi / Safaricom" />
                </div>
                <div className="form-group">
                  <label>Photo File Upload</label>
                  <input name="image_file" type="file" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Video File Upload (Strict Max 10MB)</label>
                  <input
                    name="video_file"
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                  />
                  <small style={{ color: '#777', fontSize: '11px', display: 'block', marginTop: '3px' }}>
                    ⚡ Max file size: 10MB. For larger videos, paste a YouTube embed link below.
                  </small>
                </div>
                <div className="form-group">
                  <label>Or Video / YouTube URL</label>
                  <input name="video_url" placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Impact Quote</label>
                  <input name="quote" placeholder="e.g. Pleasant View instilled the discipline that shaped my medical career." />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Full Alumni Career &amp; Campus Story *</label>
                  <textarea name="story" rows="3" placeholder="Describe their academic journey at Pleasant View, high school achievements, and subsequent professional impact..." required />
                </div>
                <FormSubmitButton
                  label="Publish Alumni Story"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Alumni Story Published & Synced Live!"
                  icon="fa-solid fa-plus"
                  variant="gold"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
              </form>
            </div>
          </section>

          {/* 1C-5. CALENDAR EVENTS & ANNOUNCEMENTS SET BY ADMIN */}
          <section id="events" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-calendar-days" style={{ color: 'var(--primary-red)', marginRight: '8px' }} />
                  Calendar Events &amp; School Announcements ({eventsList.length})
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Schedule academic events, parent visiting Sundays (VISOs), sports galas, chapel services, and term breaks displayed on the homepage and term dates calendar.
                </p>
              </div>
            </div>

            {/* EVENTS TABLE */}
            <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event Date</th>
                    <th>Time</th>
                    <th>Event Title</th>
                    <th>Category</th>
                    <th>Division / Branch</th>
                    <th>Location</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsList.map(ev => (
                    <tr key={ev.id} style={{ opacity: ev.is_active ? 1 : 0.6 }}>
                      <td>
                        <strong style={{ color: 'var(--primary-red)' }}>{ev.event_date}</strong>
                      </td>
                      <td style={{ fontSize: '12.5px', color: '#555' }}>{ev.event_time || 'All Day'}</td>
                      <td>
                        <strong>{ev.title}</strong>
                        {ev.description && <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>{ev.description}</p>}
                      </td>
                      <td>
                        <span style={{ background: 'var(--soft-bg)', color: 'var(--primary-navy)', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                          {ev.category}
                        </span>
                      </td>
                      <td style={{ fontSize: '12.5px' }}>{ev.school_name || 'All Campuses'}</td>
                      <td style={{ fontSize: '12px', color: '#666' }}>{ev.location}</td>
                      <td>
                        <form action={toggleEvent} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={ev.id} />
                          <input type="hidden" name="is_active" value={ev.is_active} />
                          <button
                            type="submit"
                            style={{
                              background: ev.is_active ? '#d4edda' : '#f8d7da',
                              color: ev.is_active ? '#155724' : '#721c24',
                              border: 0,
                              padding: '3px 8px',
                              borderRadius: '3px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {ev.is_active ? 'Active (Live)' : 'Hidden'}
                          </button>
                        </form>
                      </td>
                      <td>
                        <form action={deleteEvent} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={ev.id} />
                          <DeleteButton
                            style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                            confirmMessage="Delete this calendar event?"
                          >
                            Delete
                          </DeleteButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD EVENT FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Publish New Calendar Event / Announcement</h4>
              <form action={saveEvent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Event Date *</label>
                  <input name="event_date" type="date" required />
                </div>
                <div className="form-group">
                  <label>Event Time</label>
                  <input name="event_time" placeholder="e.g. 9:00 AM - 1:00 PM" defaultValue="9:00 AM - 1:00 PM" />
                </div>
                <div className="form-group">
                  <label>Event Category *</label>
                  <select name="category">
                    <option value="Academic">Academic &amp; Assessments</option>
                    <option value="Term Dates & VISO">Term Dates &amp; Visiting Sunday (VISO)</option>
                    <option value="STEM & Innovation">STEM &amp; Innovation</option>
                    <option value="Sports & Athletics">Sports &amp; Athletics</option>
                    <option value="Spiritual Life">Spiritual Life &amp; Chapel</option>
                    <option value="Parent Meeting">Parent &amp; Community Meeting</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target School Division *</label>
                  <select name="school_name">
                    <option value="All Campuses">All Campuses (Entire School Group)</option>
                    {list.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Event Title / Announcement Headline *</label>
                  <input name="title" placeholder="e.g. Term 1 Inter-School Robotics & Science Exhibition" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Campus Venue / Location</label>
                  <input name="location" defaultValue="Main Campus Pavilion, Githunguri" placeholder="e.g. Main Science Complex or Sports Pavilion" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Event Description / Parent Notes</label>
                  <textarea name="description" rows="2" placeholder="Details regarding reporting hours, visitor guidelines, dress code, or exhibition schedule..." />
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                    <input type="checkbox" name="is_featured" value="1" defaultChecked />
                    <strong>Feature prominently on Homepage Calendar section</strong>
                  </label>
                  <input type="hidden" name="is_active" value="1" />
                </div>
                <FormSubmitButton
                  label="Publish Calendar Event"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Calendar Event Published & Synced Live!"
                  icon="fa-solid fa-calendar-plus"
                  variant="gold"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
              </form>
            </div>
          </section>

          {/* 1C. EDITABLE "AT A GLANCE" DISTINCTION NUMBERS (HOMEPAGE METRICS) */}
          {!scope && (
            <section id="metrics" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                    <i className="fa-solid fa-chart-line" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                    Editable &ldquo;At a Glance&rdquo; Distinction Numbers (Homepage Metrics)
                  </h2>
                  <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                    Update the 6 key distinction cards displayed in the &ldquo;Pleasant View at a Glance&rdquo; section on the landing page.
                  </p>
                </div>
              </div>

              <form action={saveGlanceMetrics}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  {glanceMetrics.map((m, idx) => (
                    <div key={m.id || idx} style={{ background: 'var(--soft-bg)', padding: '18px', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
                      <input type="hidden" name={`metric_${idx + 1}_id`} value={m.id || idx + 1} />
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-dark)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Metric Card #{idx + 1}
                      </div>
                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Stat Value (e.g. 24+, EE &amp; ME1, KCSE B+, 1:20)</label>
                        <input name={`metric_${idx + 1}_val`} defaultValue={m.stat_value} style={{ fontWeight: 800, fontSize: '16px' }} required />
                      </div>
                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Stat Label (e.g. Years of Excellence)</label>
                        <input name={`metric_${idx + 1}_label`} defaultValue={m.stat_label} required />
                      </div>
                      <div className="form-group">
                        <label>Subtext / Description</label>
                        <input name={`metric_${idx + 1}_desc`} defaultValue={m.stat_desc} required />
                      </div>
                    </div>
                  ))}
                </div>
                <FormSubmitButton
                  label="Save Distinction Metrics"
                  pendingLabel="Saving & Syncing Live..."
                  successLabel="✓ Distinction Metrics Saved & Synced Live!"
                  icon="fa-solid fa-floppy-disk"
                  variant="gold"
                  style={{ marginTop: '12px' }}
                />
              </form>
            </section>
          )}

          {/* 1D. SCHOOL LIFE PHOTO GALLERY MANAGER */}
          {!scope && (
            <section id="gallery" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                    <i className="fa-solid fa-images" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                    School Life Photo Gallery Manager
                  </h2>
                  <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                    Upload and manage pictures across various categories of school life (Academic &amp; STEM, Sports &amp; Athletics, Boarding Life, Creative Arts, Spiritual Life, Campus Environment).
                  </p>
                </div>
              </div>

              {/* CURRENT PHOTOS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '30px' }}>
                {schoolLifePhotos.map(p => (
                  <div key={p.id} style={{ border: '1px solid #e1e6ef', borderRadius: '6px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ height: '160px', backgroundImage: `url('${p.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(5,40,107,0.85)', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                        {p.category}
                      </span>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <strong style={{ fontSize: '14px', display: 'block', color: 'var(--primary-navy)', marginBottom: '4px' }}>
                        {p.title || p.category}
                      </strong>
                      <p style={{ fontSize: '12.5px', color: '#666', margin: '0 0 10px', lineHeight: 1.4 }}>
                        {p.caption || 'No caption'}
                      </p>
                      <form action={delPhoto} style={{ textAlign: 'right' }}>
                        <input type="hidden" name="id" value={p.id} />
                        <DeleteButton
                          confirmMessage="Are you sure you want to delete this photo?"
                          style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Delete Photo
                        </DeleteButton>
                      </form>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD NEW PHOTO FORM */}
              <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Upload / Add New School Life Picture</h4>
                <form action={addSchoolLifePhoto} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" required>
                      <option value="Academic & STEM">Academic &amp; STEM</option>
                      <option value="Sports & Athletics">Sports &amp; Athletics</option>
                      <option value="Boarding Life">Boarding Life</option>
                      <option value="Creative Arts">Creative Arts &amp; Music</option>
                      <option value="Spiritual Life">Spiritual Life &amp; Chapel</option>
                      <option value="Campus Environment">Campus Environment &amp; Facilities</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Photo Title *</label>
                    <input name="title" placeholder="e.g. Modern Integrated Science & Robotics Lab" required />
                  </div>
                  <div className="form-group">
                    <label>Caption / Short Description</label>
                    <input name="caption" placeholder="e.g. Scholars conducting physics and chemistry investigations" />
                  </div>
                  <div className="form-group">
                    <label>Target School Branch</label>
                    <select name="school_id">
                      <option value="0">All Campuses</option>
                      {list.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Upload Image File</label>
                    <input type="file" name="image_file" accept="image/*" />
                  </div>
                  <div className="form-group">
                    <label>Or Paste Image URL</label>
                    <input name="image_url" placeholder="e.g. /images/hero_science_lab.jpg" />
                  </div>
                  <FormSubmitButton
                    label="+ Publish Picture to School Life Gallery"
                    pendingLabel="Publishing & Syncing Live..."
                    successLabel="✓ Picture Published & Synced Live!"
                    variant="gold"
                    style={{ gridColumn: '1 / -1', marginTop: '5px' }}
                  />
                </form>
              </div>
            </section>
          )}

          {/* 2. EDIT DETAILS (GROUP OR SPECIFIC SCHOOL) */}
          <section id="editor" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                Editing Details: {es ? `${es.name} (${es.category || 'Division'})` : 'Main Group Institution (PLEASANT VIEW SCHOOLS)'}
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
              <FormSubmitButton
                label={`Save Changes to ${es ? es.name : 'PLEASANT VIEW SCHOOLS'}`}
                pendingLabel="Saving & Syncing Live..."
                successLabel={`✓ ${es ? es.name : 'School'} Details Saved & Synced Live!`}
                variant="gold"
                style={{ gridColumn: '1 / -1', marginTop: '10px' }}
              />
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
                      <DeleteButton
                        confirmMessage="Remove this leadership message?"
                        style={{ background: '#d9534f', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Remove Message
                      </DeleteButton>
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
                    <option value="Coordinator">Academic Coordinator / CBE Lead</option>
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
                <FormSubmitButton
                  label="+ Publish Leadership Message"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Leadership Message Published & Synced Live!"
                  variant="secondary"
                  style={{ gridColumn: '1 / -1', marginTop: '8px' }}
                />
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
                          <DeleteButton
                            confirmMessage="Delete this quick link?"
                            style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Delete
                          </DeleteButton>
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
                <FormSubmitButton
                  label="+ Add Quick Link"
                  pendingLabel="Adding & Syncing Live..."
                  successLabel="✓ Quick Link Added & Synced Live!"
                  variant="secondary"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
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
                        <DeleteButton
                          confirmMessage="Delete this video?"
                          style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Delete
                        </DeleteButton>
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
                  <label>YouTube Link or URL</label>
                  <input name="youtube_url" placeholder="https://www.youtube.com/watch?v=... (or upload file below)" />
                </div>
                <div className="form-group">
                  <label>Or Direct Video Upload (Strict Max 10MB)</label>
                  <input
                    type="file"
                    name="video_file"
                    accept="video/mp4,video/webm,video/ogg"
                  />
                  <small style={{ color: '#777', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                    ⚡ Strict max size: 10MB. YouTube / Vimeo links recommended for longer HD videos.
                  </small>
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
                <FormSubmitButton
                  label="+ Publish Video to Showcase"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Video Published & Synced Live!"
                  variant="secondary"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
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
                          <DeleteButton
                            confirmMessage="Delete this job vacancy?"
                            style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Delete
                          </DeleteButton>
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
                <FormSubmitButton
                  label="+ Publish Job Vacancy"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Job Vacancy Published & Synced Live!"
                  variant="secondary"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
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
                            <DeleteButton
                              confirmMessage="Delete this job application?"
                              style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                            >
                              Del
                            </DeleteButton>
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
                <FormSubmitButton
                  label="+ Publish Hero Banner"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Hero Slide Published & Synced Live!"
                  variant="gold"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
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
                            <DeleteButton
                              confirmMessage="Delete this campus visit booking?"
                              style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                            >
                              Del
                            </DeleteButton>
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
                            <DeleteButton
                              confirmMessage="Delete this parent enquiry?"
                              style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                            >
                              Del
                            </DeleteButton>
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
          <section id="webmail" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '25px' }}>
            <h2 style={{ fontSize: '22px', margin: '0 0 10px', color: 'var(--primary-navy)' }}>
              <i className="fa-solid fa-envelope-open-text" style={{ color: 'var(--primary-red)', marginRight: '8px' }} />
              Pleasant View Webmail Hub (Resend Inbound &amp; Outbound Console)
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Gmail-inspired webmail client for <code>@pleasantviewschools.co.ke</code> accounts. Receive admissions inquiries, review parent messages, and compose outbound transactional correspondence.
            </p>

            {/* EMBEDDED GMAIL-STYLE WEBMAIL CLIENT */}
            <div style={{ marginBottom: '35px' }}>
              <WebmailClient
                inboundEmails={inboundEmails}
                commLogs={commLogs}
                emailAccounts={emailAccountsList}
                schools={list}
                currentAdminEmail="admin@pleasantviewschools.co.ke"
              />
            </div>

            <div id="inbound">
              <h3 style={{ fontSize: '18px', margin: '20px 0 10px', color: 'var(--primary-navy)' }}>
                <i className="fa-solid fa-headset" style={{ color: 'var(--primary-red)', marginRight: '8px' }} />
                Telecom SMS Gateways &amp; Real-Time Telemetry
              </h3>
            </div>

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
              <div style={{ background: 'var(--soft-bg)', padding: '16px', borderRadius: '6px', borderLeft: '4px solid var(--primary-red)' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 700 }}>DEPT ACCOUNTS</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-red)' }}>{emailAccountsList.length}</div>
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
                  <input name="email" type="email" defaultValue="info@pleasantviewschools.co.ke" style={{ padding: '8px', fontSize: '13px', flex: 1 }} required />
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
                  Admin Handset Numbers (Receive Visitor SMS Alerts)
                </h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                  Visitor inquiries and tour bookings are dispatched directly to these mobile handset numbers via SMS (with <strong>strictly zero auto-reply SMS</strong> sent back to visitors). Enter multiple numbers separated by commas.
                </p>
                <form action={saveAdminSmsSettings} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input name="admin_sms_phone" type="text" defaultValue={vals.admin_sms_phone || '+254 711 689 913'} placeholder="+254711689913, +254722000000" style={{ padding: '8px', fontSize: '13px', width: '100%' }} required />
                  <FormSubmitButton
                    label="Save Recipient Numbers"
                    pendingLabel="Saving & Syncing Live..."
                    successLabel="✓ Numbers Saved & Synced Live!"
                    variant="secondary"
                    style={{ alignSelf: 'flex-start' }}
                  />
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
