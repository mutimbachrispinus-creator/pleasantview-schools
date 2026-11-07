import Link from 'next/link';
import BackButton from '@/components/BackButton';
import WebmailClient from '@/components/WebmailClient';
import AdminPasswordChange from '@/components/AdminPasswordChange';
import DeleteButton from '@/components/DeleteButton';
import AdminSyncNotice from '@/components/AdminSyncNotice';
import FormSubmitButton from '@/components/FormSubmitButton';
import MediaFileInput from '@/components/MediaFileInput';
import InlineActionButton from '@/components/InlineActionButton';
import SignOutButton from '@/components/SignOutButton';
import TelecomGatewayTester from '@/components/TelecomGatewayTester';
import {
  q,
  S,
  schools,
  CATS,
  PICTORIAL_CATEGORIES,
  PICTORIAL_CATEGORY_META,
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

const LONG = ['welcome', 'about', 'mission', 'vision'];

const Del = ({ t, id }) => (
  <form action="/api/admin/action?action=del" method="POST" data-admin-action="del" style={{ display: 'inline', marginLeft: '6px' }}>
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
        <label>Select Target School</label>
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
          <div className="admin-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
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
              <SignOutButton label="Lock & Sign Out" style={{ padding: '8px 16px', fontSize: '13px' }} />
            </div>
          </div>

          {/* QUICK NAV / JUMP BAR */}
          <div className="admin-jump-bar" style={{ background: '#ffffff', padding: '12px 18px', borderRadius: '6px', border: '1px solid #dde2ec', marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 600 }}>
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
            <a href="#gallery" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>📸 Pictorial ({schoolLifePhotos.length})</a>
            <a href="#editor" style={{ color: 'var(--primary-navy)' }}>📝 Profile</a>
            <a href="#leadership" style={{ color: 'var(--primary-navy)' }}>🎙️ Leadership</a>
            <a href="#quicklinks" style={{ color: 'var(--primary-navy)' }}>⚡ Quick Links</a>
            <a href="#videos" style={{ color: 'var(--primary-navy)' }}>🎥 Videos</a>
            <a href="#careers" style={{ color: 'var(--primary-navy)' }}>💼 Careers ({appsList.length})</a>
            <a href="#hero" style={{ color: 'var(--primary-navy)' }}>🖼️ Hero Sliders ({hero.length})</a>
            <a href="#news" style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>📰 News &amp; Stories ({posts.length})</a>
            <a href="#visits" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>📅 Tours ({vis.length})</a>
            <a href="#enquiries" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>📩 Enquiries ({enqs.length})</a>
            <a href="#inbound" style={{ color: 'var(--primary-navy)' }}>✉️ SMS Hub</a>
          </div>

          {/* 1. CAMPUSES & CATEGORIES DATA (POPULATION, RATIOS, LEVELS, LOCATION, BRANCH ADMIN) */}
          {!scope && (
            <section id="campuses" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                    <i className="fa-solid fa-school" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                    Schools, Campuses &amp; Branches
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
                          <form action="/api/admin/action?action=setSchoolAdmin" method="POST" data-admin-action="setSchoolAdmin" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                            <InlineActionButton
                              label="Save"
                              pendingLabel="Saving..."
                              successLabel="✓ Saved!"
                              style={{ padding: '5px 8px', fontSize: '11px', background: '#05286B', color: '#fff', border: 0, borderRadius: '3px' }}
                            />
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

              {/* ADD NEW SCHOOL */}
              <div style={{ marginTop: '25px', background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New School / Branch</h4>
                <form action="/api/admin/action?action=addSchool" method="POST" data-admin-action="addSchool" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
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
                    <label>School Color Theme</label>
                    <input name="color" type="color" defaultValue="#8B1E2D" style={{ height: '44px', width: '100%' }} />
                  </div>
                  <MediaFileInput
                    name="image"
                    accept="image/*"
                    type="image"
                    maxSizeMB={50}
                    label="School Cover Photo"
                    helpText="Supports JPG, PNG, WEBP with automatic cloud optimization"
                  />
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
            <section id="admins" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                          <form action="/api/admin/action?action=deleteAdminAccount" method="POST" data-admin-action="deleteAdminAccount" style={{ display: 'inline' }}>
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
                <form action="/api/admin/action?action=createAdminAccount" method="POST" data-admin-action="createAdminAccount" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
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
                          {s.name} ({s.category || 'School'})
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
          <section id="security" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
          <section id="exams" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                    <th>School</th>
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
                        <form action="/api/admin/action?action=deleteExamResult" method="POST" data-admin-action="deleteExamResult" style={{ display: 'inline' }}>
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
              <form action="/api/admin/action?action=saveExamResult" method="POST" data-admin-action="saveExamResult" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Assessment Category *</label>
                  <select name="exam_category" required>
                    <option value="national">National External Exam (KPSEA / KJSEA / KCSE / KSSEA)</option>
                    <option value="internal">In-School Internal Exam (Continuous / Mocks / STEM)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target School *</label>
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
          <section id="parent-reviews" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                            <form action="/api/admin/action?action=approveTestimonial" method="POST" data-admin-action="approveTestimonial" style={{ display: 'inline' }}>
                              <input type="hidden" name="id" value={t.id} />
                              <InlineActionButton
                                label="✓ Approve"
                                pendingLabel="Approving..."
                                successLabel="✓ Approved!"
                                style={{ background: '#28a745', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}
                              />
                            </form>
                          )}
                          {t.status !== 'rejected' && (
                            <form action="/api/admin/action?action=rejectTestimonial" method="POST" data-admin-action="rejectTestimonial" style={{ display: 'inline' }}>
                              <input type="hidden" name="id" value={t.id} />
                              <InlineActionButton
                                label="Reject"
                                pendingLabel="Rejecting..."
                                successLabel="✓ Rejected"
                                style={{ background: '#495057', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}
                              />
                            </form>
                          )}
                          <form action="/api/admin/action?action=deleteTestimonial" method="POST" data-admin-action="deleteTestimonial" style={{ display: 'inline' }}>
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

            {/* ADD PARENT TESTIMONIAL FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px', marginTop: '20px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Publish Parent / Guardian Testimonial Directly</h4>
              <form action="/api/admin/action?action=addParentTestimonial" method="POST" data-admin-action="addParentTestimonial" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Parent / Guardian Name *</label>
                  <input name="parent_name" placeholder="e.g. Eng. David Mwangi" required />
                </div>
                <div className="form-group">
                  <label>Learner Name</label>
                  <input name="learner_name" placeholder="e.g. Grace Mwangi" />
                </div>
                <div className="form-group">
                  <label>Grade / School *</label>
                  <input name="grade_or_division" placeholder="e.g. Grade 8 JSS / Form 2 Senior School" required />
                </div>
                <div className="form-group">
                  <label>Star Rating</label>
                  <select name="rating" defaultValue="5">
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Parent Review / Comment *</label>
                  <textarea name="comment" rows={3} placeholder="Share the parent or guardian's testimonial..." required />
                </div>
                <FormSubmitButton
                  label="+ Publish Approved Parent Review"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ Parent Review Published & Synced Live!"
                  variant="gold"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
              </form>
            </div>
          </section>

          {/* 1C-3. EXISTING LEARNERS / STUDENT BODY VOICES & PHOTOS */}
          <section id="learner-voices" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                    <form action="/api/admin/action?action=deleteLearnerTestimonial" method="POST" data-admin-action="deleteLearnerTestimonial" style={{ display: 'inline' }}>
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
              <form action="/api/admin/action?action=saveLearnerTestimonial" method="POST" data-admin-action="saveLearnerTestimonial" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Learner Full Name *</label>
                  <input name="name" placeholder="e.g. Brenda Cherono" required />
                </div>
                <div className="form-group">
                  <label>Grade / Class *</label>
                  <input name="grade_or_class" placeholder="e.g. Form 3 Senior Girls or Grade 8 JSS" required />
                </div>
                <div className="form-group">
                  <label>School *</label>
                  <select name="school_name">
                    <option value="All Campuses">All Campuses</option>
                    {list.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <MediaFileInput
                  name="image_file"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  label="Upload Scholar Photo"
                  helpText="Supports JPG, PNG, WEBP, AVIF with instant cloud upload"
                />
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

          {/* 1C-4. ALUMNI SUCCESS STORIES (PHOTOS & VIDEOS) */}
          <section id="alumni" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-trophy" style={{ color: 'var(--gold-dark)', marginRight: '8px' }} />
                  Alumni Success Stories &amp; Videos
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Highlight alumni who have graduated from Pleasant View, their university/career milestones, photos, and direct video testimonials.
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
                      <form action="/api/admin/action?action=deleteAlumniStory" method="POST" data-admin-action="deleteAlumniStory" style={{ display: 'inline' }}>
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
              <form action="/api/admin/action?action=saveAlumniStory" method="POST" data-admin-action="saveAlumniStory" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Alumnus Full Name *</label>
                  <input name="name" placeholder="e.g. Dr. Kevin Njoroge" required />
                </div>
                <div className="form-group">
                  <label>Graduation Year / Class *</label>
                  <input name="grad_year" placeholder="e.g. Class of 2017" required />
                </div>
                <div className="form-group">
                  <label>School Attended</label>
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
                <MediaFileInput
                  name="image_file"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  label="Upload Alumni Photo"
                  helpText="Supports JPG, PNG, WEBP, AVIF with instant cloud upload"
                />
                <MediaFileInput
                  name="video_file"
                  accept="video/*,.mp4,.webm,.ogg,.mov,.m4v"
                  type="video"
                  maxSizeMB={100}
                  label="Or Direct Alumni Video Upload (Up to 100MB)"
                  helpText="Supports MP4, WebM, MOV, OGG with chunked cloud upload & instant streaming"
                />
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
          <section id="events" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                    <th>School / Branch</th>
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
                        <form action="/api/admin/action?action=toggleEvent" method="POST" data-admin-action="toggleEvent" style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={ev.id} />
                          <input type="hidden" name="is_active" value={ev.is_active} />
                          <InlineActionButton
                            label={ev.is_active ? 'Active (Live)' : 'Hidden'}
                            pendingLabel="Updating..."
                            successLabel="✓ Updated!"
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
                          />
                        </form>
                      </td>
                      <td>
                        <form action="/api/admin/action?action=deleteEvent" method="POST" data-admin-action="deleteEvent" style={{ display: 'inline' }}>
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
              <form action="/api/admin/action?action=saveEvent" method="POST" data-admin-action="saveEvent" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
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
                  <label>Target School *</label>
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
            <section id="metrics" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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

              <form action="/api/admin/action?action=saveGlanceMetrics" method="POST" data-admin-action="saveGlanceMetrics">
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

          {/* 1D. SCHOOL PICTORIAL & PHOTO GALLERY MANAGER */}
          <section id="gallery" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ maxWidth: '780px' }}>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-images" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  School Pictorial &amp; Photo Gallery Manager ({schoolLifePhotos.length})
                </h2>
                <p style={{ color: '#666', fontSize: '13.5px', margin: '6px 0 0', lineHeight: 1.55 }}>
                  Every photo uploaded anywhere in the Staff Portal (News, Hero Banners, Student Voices, Alumni, Leadership, Campuses, or directly below) is <strong>automatically included in the School Pictorial</strong> and smart-categorized into <em>Science &amp; Labs</em>, <em>Sports &amp; Athletics</em>, <em>Academics &amp; Classroom</em>, <em>Boarding &amp; Pastoral</em>, <em>Clubs, Music &amp; Arts</em>, <em>Events &amp; Chapel</em>, <em>Campus &amp; Facilities</em>, or <em>Community &amp; Leadership</em>. You can also adjust any photo&apos;s category below.
                </p>
              </div>
              <Link
                href="/pictorial"
                target="_blank"
                className="button button-tertiary"
                style={{ padding: '7px 14px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
              >
                <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: '6px' }} />
                Open Live Pictorial
              </Link>
            </div>

            {/* CATEGORY BREAKDOWN PILLS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {PICTORIAL_CATEGORIES.map(cat => {
                const count = schoolLifePhotos.filter(p => p.category === cat).length;
                return (
                  <span
                    key={cat}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: count > 0 ? '#f1f5f9' : '#f8fafc',
                      color: count > 0 ? 'var(--primary-navy)' : '#94a3b8',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <i className={PICTORIAL_CATEGORY_META[cat]?.icon || 'fa-solid fa-tag'} style={{ color: 'var(--primary-red)' }} />
                    {cat}: <strong>{count}</strong>
                  </span>
                );
              })}
            </div>

            {/* CURRENT PHOTOS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '18px', marginBottom: '30px' }}>
              {schoolLifePhotos.map(p => {
                const catMeta = PICTORIAL_CATEGORY_META[p.category];
                return (
                  <div key={p.id} style={{ border: '1px solid #e1e6ef', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '165px', backgroundImage: `url('${p.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', backgroundColor: '#0f1d3a' }}>
                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: catMeta?.badgeBg || 'rgba(5,40,107,0.88)', color: '#fff', padding: '3px 9px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800 }}>
                        {p.category || 'Campus & Facilities'}
                      </span>
                      {p.source_section && p.source_section !== 'gallery' && (
                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(15,23,42,0.8)', color: '#e2e8f0', padding: '2px 7px', borderRadius: '3px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                          from {p.source_section}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '13.5px', display: 'block', color: 'var(--primary-navy)', marginBottom: '4px' }}>
                          {p.title || p.category}
                        </strong>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.45 }}>
                          {p.caption || (p.school_name ? `Campus: ${p.school_name}` : 'Auto-synced pictorial photo')}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #eef2f7', paddingTop: '9px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        <form
                          action="/api/admin/action?action=updatePhotoCategory"
                          method="POST"
                          data-admin-action="updatePhotoCategory"
                          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                        >
                          <input type="hidden" name="id" value={p.id} />
                          <select
                            name="category"
                            defaultValue={PICTORIAL_CATEGORIES.includes(p.category) ? p.category : PICTORIAL_CATEGORIES[0]}
                            aria-label="Photo category"
                            style={{ flex: 1, padding: '5px 7px', fontSize: '11.5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          >
                            {PICTORIAL_CATEGORIES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                            <option value="auto">✨ Auto-Detect Again</option>
                          </select>
                          <InlineActionButton
                            label="Set"
                            pendingLabel="..."
                            successLabel="✓"
                            className="button button-primary"
                            style={{ padding: '5px 10px', fontSize: '11px' }}
                          />
                        </form>

                        <form action="/api/admin/action?action=delPhoto" method="POST" data-admin-action="delPhoto" style={{ textAlign: 'right' }}>
                          <input type="hidden" name="id" value={p.id} />
                          <DeleteButton
                            confirmMessage="Are you sure you want to remove this photo from the School Pictorial?"
                            style={{ background: '#d9534f', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Remove from Pictorial
                          </DeleteButton>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ADD NEW PHOTO FORM */}
            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Upload / Add New Picture to School Pictorial</h4>
              <form action="/api/admin/action?action=addSchoolLifePhoto" method="POST" data-admin-action="addSchoolLifePhoto" data-reset-on-save="true" data-pictorial-section="gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Category (Auto or Manual)</label>
                  <select name="category" defaultValue="auto">
                    <option value="auto">✨ Auto-Categorize (Smart Detect: Labs, Sports, Boarding, etc.)</option>
                    {PICTORIAL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Photo Title (Optional)</label>
                  <input name="title" placeholder="e.g. Chemistry Lab Titration Practical (auto-filled if blank)" />
                </div>
                <div className="form-group">
                  <label>Caption / Short Description</label>
                  <input name="caption" placeholder="e.g. Scholars conducting physics and chemistry investigations" />
                </div>
                {scope ? (
                  <input type="hidden" name="school_id" value={scope} />
                ) : (
                  <div className="form-group">
                    <label>Target School Branch</label>
                    <select name="school_id">
                      <option value="0">All Campuses</option>
                      {list.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <MediaFileInput
                  name="image_file"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  sectionHint="gallery"
                  label="Upload Image File"
                  helpText="Supports JPG, PNG, WEBP, GIF, AVIF up to 50MB — auto-categorized immediately on upload"
                />
                <div className="form-group">
                  <label>Or Paste Image URL</label>
                  <input name="image_url" placeholder="e.g. /images/hero_science_lab.jpg" />
                </div>
                <FormSubmitButton
                  label="+ Publish Picture to School Pictorial"
                  pendingLabel="Publishing & Categorizing..."
                  successLabel="✓ Picture Published to School Pictorial!"
                  variant="gold"
                  style={{ gridColumn: '1 / -1', marginTop: '5px' }}
                />
              </form>
            </div>
          </section>

          {/* 2. EDIT DETAILS (GROUP OR SPECIFIC SCHOOL) */}
          <section id="editor" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                Editing Details: {es ? `${es.name} (${es.category || 'School'})` : 'Main Group Institution (PLEASANT VIEW SCHOOLS)'}
              </h2>
              {!scope && es && (
                <Link href="?" style={{ color: 'var(--medium-blue)', fontWeight: 700 }}>
                  &larr; Switch to Group Overview
                </Link>
              )}
            </div>

            <form action="/api/admin/action?action=saveSchool" method="POST" data-admin-action="saveSchool" key={es?.id || 0} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              <input type="hidden" name="school_id" value={es ? es.id : 0} />
              {es && (
                <MediaFileInput
                  name="image_file"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  label="Upload New School Cover Photo"
                  helpText="Upload a photo up to 50MB to update this school's cover image"
                />
              )}
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
          <section id="leadership" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                    <form action="/api/admin/action?action=delLeadershipMessage" method="POST" data-admin-action="delLeadershipMessage">
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
              <form action="/api/admin/action?action=addLeadershipMessage" method="POST" data-admin-action="addLeadershipMessage" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
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
                <MediaFileInput
                  name="image_file"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  label="Leader Photo Upload"
                  helpText="Supports JPG, PNG, WEBP, AVIF up to 50MB with instant cloud upload"
                />
                <div className="form-group">
                  <label>Or Preset / Photo URL</label>
                  <input name="image_url" placeholder="/images/banner_3_a.webp" defaultValue="/images/banner_3_a.webp" />
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
          <section id="quicklinks" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                        <form action="/api/admin/action?action=delQuickLink" method="POST" data-admin-action="delQuickLink" style={{ display: 'inline' }}>
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
              <form action="/api/admin/action?action=addQuickLink" method="POST" data-admin-action="addQuickLink" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
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
          <section id="videos" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                    {v.youtube_url && (v.youtube_url.startsWith('/img/') || /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(v.youtube_url)) ? (
                      <video
                        src={v.youtube_url}
                        poster={v.thumbnail || '/images/hero_science_lab.jpg'}
                        controls
                        playsInline
                        preload="metadata"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img src={v.thumbnail || '/images/hero_science_lab.jpg'} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    )}
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--gold-accent)', color: '#000', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 800, pointerEvents: 'none' }}>
                      {v.category || 'Video'}
                    </span>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>{v.title}</h4>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px' }}><code>{v.youtube_url}</code></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <small style={{ color: '#888' }}>{v.sname || 'All Campuses'}</small>
                      <form action="/api/admin/action?action=delVideo" method="POST" data-admin-action="delVideo">
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
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Add New Video Link or Upload</h4>
              <form action="/api/admin/action?action=addVideo" method="POST" data-admin-action="addVideo" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <Pick />
                <div className="form-group">
                  <label>Video Title *</label>
                  <input name="title" placeholder="e.g. Science Fair & Robotics Innovations" required />
                </div>
                <div className="form-group">
                  <label>YouTube Link or URL</label>
                  <input name="youtube_url" placeholder="https://www.youtube.com/watch?v=... (or upload file below)" />
                </div>
                <MediaFileInput
                  name="video_file"
                  accept="video/*,.mp4,.webm,.ogg,.mov,.m4v"
                  type="video"
                  maxSizeMB={100}
                  label="Or Direct Video Upload (Up to 100MB)"
                  helpText="⚡ Supports MP4, WebM, MOV, OGG up to 100MB via chunked cloud upload & instant range streaming."
                />
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
                <MediaFileInput
                  name="thumbnail_file"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  label="Video Thumbnail Upload"
                  helpText="Custom cover image up to 50MB for the video player"
                />
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
          <section id="careers" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                        <form action="/api/admin/action?action=delJob" method="POST" data-admin-action="delJob" style={{ display: 'inline' }}>
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
              <form action="/api/admin/action?action=addJob" method="POST" data-admin-action="addJob" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
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
                          <form action="/api/admin/action?action=delApplication" method="POST" data-admin-action="delApplication" style={{ display: 'inline' }}>
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
          <section id="hero" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
              <form action="/api/admin/action?action=addHero" method="POST" data-admin-action="addHero" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <Pick />
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Slide Headline *</label>
                  <input name="headline" placeholder="e.g. 24 YEARS OF ACADEMIC EXCELLENCE" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Slide Subtext *</label>
                  <input name="sub" placeholder="e.g. Outstanding KPSEA (EE) and KJSEA (ME1) distinction, with maiden KCSE B+ university transition" required />
                </div>
                <MediaFileInput
                  name="image"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  label="Slide Photo Upload"
                  helpText="High-resolution banner photo up to 50MB with instant cloud upload"
                />
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

          {/* 7B. NEWS & CAMPUS STORIES MANAGER */}
          <section id="news" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-solid fa-newspaper" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  News &amp; Campus Stories ({posts.length})
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>
                  Publish official news updates, academic announcements, and campus stories displayed on the homepage and <code>/news</code>.
                </p>
              </div>
            </div>

            {posts.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                {posts.map(p => (
                  <div key={p.id} style={{ border: '1px solid #dde2ec', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                    {p.image && (
                      <div style={{ height: '140px', position: 'relative' }}>
                        <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(139,30,45,0.9)', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                          {p.category || 'School News'}
                        </span>
                      </div>
                    )}
                    <div style={{ padding: '14px' }}>
                      <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: 'var(--primary-navy)' }}>{p.title}</h4>
                      {p.body && <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px' }}>{p.body.slice(0, 120)}{p.body.length > 120 ? '...' : ''}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small style={{ color: '#888' }}>{p.sname || 'All Campuses'}</small>
                        <Del t="posts" id={p.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'var(--soft-bg)', padding: '20px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-navy)' }}>+ Publish New News Story / Announcement</h4>
              <form action="/api/admin/action?action=addPost" method="POST" data-admin-action="addPost" data-reset-on-save="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <Pick />
                <div className="form-group">
                  <label>Story Headline *</label>
                  <input name="title" placeholder="e.g. 2026 Science & Robotics Distinction Awards" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" defaultValue="Academic Distinction">
                    <option value="Academic Distinction">Academic Distinction</option>
                    <option value="Admissions Notice">Admissions Notice</option>
                    <option value="Innovation & STEM">Innovation &amp; STEM</option>
                    <option value="Sports & Athletics">Sports &amp; Athletics</option>
                    <option value="School News">School News</option>
                  </select>
                </div>
                <MediaFileInput
                  name="image_file"
                  accept="image/*"
                  type="image"
                  maxSizeMB={50}
                  label="Story Photo Upload"
                  helpText="Upload a cover image up to 50MB for this news story"
                />
                <div className="form-group">
                  <label>Or Preset / Photo URL</label>
                  <input name="image_url" placeholder="/images/banner_2_a.webp" defaultValue="/images/banner_2_a.webp" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Article Content / Story Body *</label>
                  <textarea name="body" rows={4} placeholder="Write the full news article or announcement..." required />
                </div>
                <FormSubmitButton
                  label="+ Publish News Story"
                  pendingLabel="Publishing & Syncing Live..."
                  successLabel="✓ News Story Published & Synced Live!"
                  variant="gold"
                  style={{ gridColumn: '1 / -1', marginTop: '6px' }}
                />
              </form>
            </div>
          </section>

          {/* 8. CAMPUS VISITS & PARENT ENQUIRIES */}
          <section id="visits" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '15px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-regular fa-calendar-check" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Campus Visit Bookings ({vis.length})
                </h2>
                <p style={{ color: '#666', fontSize: '13.5px', margin: '4px 0 0' }}>
                  Live campus tour &amp; interview requests submitted via the website, email, SMS, or admissions desk.
                </p>
              </div>
              <details style={{ position: 'relative' }}>
                <summary style={{
                  cursor: 'pointer',
                  background: 'var(--primary-navy)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  listStyle: 'none'
                }}>
                  <i className="fa-solid fa-plus" style={{ marginRight: '6px', color: 'var(--gold-accent)' }} />
                  Log Walk-In / Phone Visit
                </summary>
                <div style={{
                  marginTop: '10px',
                  padding: '18px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  minWidth: '300px'
                }}>
                  <form action="/api/admin/action?action=addVisitBooking" method="POST" data-admin-action="addVisitBooking" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <Pick />
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Parent / Visitor Name *</label>
                      <input name="name" placeholder="Full Name" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Phone Number *</label>
                      <input name="phone" placeholder="+254 7..." required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Email (Optional)</label>
                      <input name="email" type="email" placeholder="parent@..." />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Visit Date *</label>
                      <input name="visit_date" type="date" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Guests</label>
                      <input name="guests" type="number" min="1" max="20" defaultValue="2" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Grade Interested</label>
                      <input name="grade" placeholder="e.g. Grade 7 JSS, Form 1" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                      <label>Notes (Optional)</label>
                      <input name="notes" placeholder="Any tour preferences or remarks..." />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <label style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input type="checkbox" name="notify_parent" value="1" /> Send confirmation SMS/email to parent
                      </label>
                      <FormSubmitButton
                        label="Save Visit Booking"
                        pendingLabel="Saving..."
                        successLabel="Booking Logged!"
                        className="button button-gold"
                        style={{ padding: '8px 18px', fontSize: '12.5px' }}
                      />
                    </div>
                  </form>
                </div>
              </details>
            </div>

            {!vis.length ? (
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '30px' }}>No campus visit requests yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: '38px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Parent / Visitor</th>
                      <th>Contact</th>
                      <th>Campus &amp; Grade</th>
                      <th>Preferred Date</th>
                      <th>Guests</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vis.map(v => {
                      const cleanTel = String(v.phone || '').replace(/[^\d+]/g, '');
                      const waNum = cleanTel.replace(/^\+/, '').replace(/^0/, '254');
                      const isConfirmed = v.status === 'confirmed' || v.status === 'completed';
                      return (
                        <tr key={v.id}>
                          <td>
                            <strong>{v.name}</strong>
                            {v.created && (
                              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                Logged: {String(v.created).slice(0, 16)}
                              </div>
                            )}
                          </td>
                          <td>
                            {v.phone ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <a href={`tel:${cleanTel}`} style={{ fontWeight: 600 }}>{v.phone}</a>
                                {waNum.length >= 11 && (
                                  <a
                                    href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Hello ${v.name}, this is Pleasant View Schools Admissions confirming your campus tour request for ${v.visit_date}.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Confirm via WhatsApp"
                                    style={{ color: '#16a34a', fontSize: '13px' }}
                                  >
                                    <i className="fa-brands fa-whatsapp" />
                                  </a>
                                )}
                              </div>
                            ) : '—'}
                            {v.email && (
                              <div style={{ fontSize: '12px', marginTop: '2px' }}>
                                <a href={`mailto:${v.email}`}>{v.email}</a>
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{v.sname || 'All Campuses'}</div>
                            {v.grade && (
                              <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>
                                {v.grade}
                              </span>
                            )}
                            {v.notes && (
                              <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '4px', maxWidth: '240px' }}>
                                {v.notes}
                              </div>
                            )}
                          </td>
                          <td><strong>{v.visit_date}</strong></td>
                          <td>{v.guests || 2}</td>
                          <td>
                            <span style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 7px',
                              borderRadius: '3px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {v.source || 'website'}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              background: isConfirmed ? '#d4edda' : '#fff3cd',
                              color: isConfirmed ? '#155724' : '#856404',
                              padding: '2px 7px',
                              borderRadius: '3px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              {v.status ? v.status.toUpperCase() : 'PENDING'}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {!isConfirmed && (
                              <form action="/api/admin/action?action=updateVisitStatus" method="POST" data-admin-action="updateVisitStatus" style={{ display: 'inline', marginRight: '6px' }}>
                                <input type="hidden" name="id" value={v.id} />
                                <input type="hidden" name="status" value="confirmed" />
                                <InlineActionButton
                                  label="Confirm"
                                  pendingLabel="..."
                                  style={{ background: '#16a34a', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}
                                />
                              </form>
                            )}
                            <form action="/api/admin/action?action=delVisit" method="POST" data-admin-action="delVisit" style={{ display: 'inline' }}>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div id="enquiries" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '15px', paddingTop: '10px', borderTop: '1px solid #edf2f7' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--primary-navy)' }}>
                  <i className="fa-regular fa-envelope" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} />
                  Admissions Enquiries ({enqs.length})
                </h2>
                <p style={{ color: '#666', fontSize: '13.5px', margin: '4px 0 0' }}>
                  All parent admissions questions received via the website, email inbox, SMS gateway, or walk-in desk.
                </p>
              </div>
              <details style={{ position: 'relative' }}>
                <summary style={{
                  cursor: 'pointer',
                  background: 'var(--primary-navy)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  listStyle: 'none'
                }}>
                  <i className="fa-solid fa-plus" style={{ marginRight: '6px', color: 'var(--gold-accent)' }} />
                  Log Walk-In / Phone Enquiry
                </summary>
                <div style={{
                  marginTop: '10px',
                  padding: '18px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  minWidth: '300px'
                }}>
                  <form action="/api/admin/action?action=addAdmissionsEnquiry" method="POST" data-admin-action="addAdmissionsEnquiry" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <Pick />
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Parent / Enquirer Name *</label>
                      <input name="name" placeholder="Full Name" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Phone Number *</label>
                      <input name="phone" placeholder="+254 7..." required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Email (Optional)</label>
                      <input name="email" type="email" placeholder="parent@..." />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Grade Interested</label>
                      <input name="grade" placeholder="e.g. PP2, Grade 4, Form 1" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                      <label>Enquiry Details *</label>
                      <textarea name="message" rows="3" placeholder="Summary of parent's enquiry..." required />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <label style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input type="checkbox" name="notify_parent" value="1" /> Send acknowledgement SMS/email to parent
                      </label>
                      <FormSubmitButton
                        label="Save Enquiry"
                        pendingLabel="Saving..."
                        successLabel="Enquiry Logged!"
                        className="button button-primary"
                        style={{ padding: '8px 18px', fontSize: '12.5px' }}
                      />
                    </div>
                  </form>
                </div>
              </details>
            </div>

            {!enqs.length ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>No enquiries yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Parent Name</th>
                      <th>Contact</th>
                      <th>Campus &amp; Grade</th>
                      <th>Enquiry Message</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enqs.map(e => {
                      const cleanTel = String(e.phone || '').replace(/[^\d+]/g, '');
                      const waNum = cleanTel.replace(/^\+/, '').replace(/^0/, '254');
                      const isReplied = e.status === 'replied' || e.status === 'resolved';
                      return (
                        <tr key={e.id}>
                          <td><strong>{e.name}</strong></td>
                          <td>
                            {e.phone ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <a href={`tel:${cleanTel}`} style={{ fontWeight: 600 }}>{e.phone}</a>
                                {waNum.length >= 11 && (
                                  <a
                                    href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Hello ${e.name}, thank you for contacting Pleasant View Schools Admissions regarding your inquiry.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Reply via WhatsApp"
                                    style={{ color: '#16a34a', fontSize: '13px' }}
                                  >
                                    <i className="fa-brands fa-whatsapp" />
                                  </a>
                                )}
                              </div>
                            ) : '—'}
                            {e.email && (
                              <div style={{ fontSize: '12px', marginTop: '2px' }}>
                                <a href={`mailto:${e.email}?subject=${encodeURIComponent('Re: Pleasant View Schools Admissions Enquiry')}`}>{e.email}</a>
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{e.sname || 'All Campuses'}</div>
                            {e.grade && (
                              <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>
                                {e.grade}
                              </span>
                            )}
                          </td>
                          <td style={{ maxWidth: '340px', fontSize: '12.5px', lineHeight: 1.45 }}>{e.message}</td>
                          <td>
                            <span style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 7px',
                              borderRadius: '3px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {e.source || 'website'}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              background: isReplied ? '#d4edda' : '#fff3cd',
                              color: isReplied ? '#155724' : '#856404',
                              padding: '2px 7px',
                              borderRadius: '3px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              {e.status ? e.status.toUpperCase() : 'PENDING'}
                            </span>
                          </td>
                          <td style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>{e.created ? String(e.created).slice(0, 10) : '—'}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {!isReplied && (
                              <form action="/api/admin/action?action=updateEnquiryStatus" method="POST" data-admin-action="updateEnquiryStatus" style={{ display: 'inline', marginRight: '6px' }}>
                                <input type="hidden" name="id" value={e.id} />
                                <input type="hidden" name="status" value="replied" />
                                <InlineActionButton
                                  label="Mark Replied"
                                  pendingLabel="..."
                                  style={{ background: '#0284c7', color: '#fff', border: 0, padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}
                                />
                              </form>
                            )}
                            <form action="/api/admin/action?action=delEnquiry" method="POST" data-admin-action="delEnquiry" style={{ display: 'inline' }}>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 9. NOTIFICATION GATEWAYS & INBOUND COMMUNICATIONS HUB */}
          <section id="webmail" className="admin-section-panel" style={{ marginBottom: '45px', background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px' }}>
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
                <form action="/api/admin/action?action=testResend" method="POST" data-admin-action="testResend" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input name="email" type="email" defaultValue="info@pleasantviewschools.co.ke" style={{ padding: '8px', fontSize: '13px', flex: 1 }} required />
                  <InlineActionButton
                    label="Send Test"
                    pendingLabel="Sending..."
                    successLabel="✓ Test Sent!"
                    className="button button-primary"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  />
                </form>
              </div>
            </div>

            {/* TELECOM GATEWAY SETTINGS & INTERACTIVE TESTER */}
            <TelecomGatewayTester
              initialSettings={{
                at_api_key: vals.at_api_key || '',
                at_username: vals.at_username || '',
                at_sender_id: vals.at_sender_id || '',
                admin_sms_phone: vals.admin_sms_phone || '+254 711 689 913'
              }}
              hasEnvAtKey={Boolean(process.env.AT_API_KEY || process.env.AFRICASTALKING_API_KEY)}
              hasEnvAtUser={Boolean(process.env.AT_USERNAME || process.env.AFRICASTALKING_USERNAME)}
            />

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
                            <form action="/api/admin/action?action=replySMS" method="POST" data-admin-action="replySMS" data-reset-on-save="true" style={{ marginTop: '6px', display: 'grid', gap: '6px', background: 'var(--soft-bg)', padding: '10px', borderRadius: '4px' }}>
                              <input type="hidden" name="to" value={m.sender} />
                              <input type="hidden" name="sms_id" value={m.id} />
                              <input name="message" placeholder="Type SMS reply..." required style={{ padding: '6px', fontSize: '12px' }} />
                              <InlineActionButton
                                label="Send SMS"
                                pendingLabel="Sending..."
                                successLabel="✓ SMS Sent!"
                                className="button button-gold"
                                style={{ padding: '5px 10px', fontSize: '11px', width: 'fit-content' }}
                              />
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
