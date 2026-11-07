import { createClient } from '@libsql/client';
import {
  PICTORIAL_CATEGORIES,
  PICTORIAL_CATEGORY_META,
  categorizePhoto,
  normalizePictorialCategory,
  derivePhotoTitle,
  isValidPictorialImageUrl
} from './pictorial.js';
import {
  parseInboundEmailRecord,
  parseInboundSmsRecord,
  nowSqlTimestamp
} from './admissionsParser.js';
import {
  FOUNDING_YEAR,
  getYearsOfExistence,
  syncHeritageYearsText,
  normalizeGlanceMetricRow
} from './heritage.js';

export {
  PICTORIAL_CATEGORIES,
  PICTORIAL_CATEGORY_META,
  categorizePhoto,
  normalizePictorialCategory,
  derivePhotoTitle,
  isValidPictorialImageUrl,
  FOUNDING_YEAR,
  getYearsOfExistence,
  syncHeritageYearsText,
  normalizeGlanceMetricRow
};

let dbClient;
export function getDb() {
  if (dbClient) return dbClient;
  const rawUrl = process.env.TURSO_URL || process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_TOKEN || process.env.TURSO_AUTH_TOKEN;

  try {
    if (rawUrl && (rawUrl.startsWith('libsql:') || rawUrl.startsWith('https:') || rawUrl.startsWith('http:') || rawUrl.startsWith('wss:') || rawUrl.startsWith('ws:'))) {
      dbClient = createClient({ url: rawUrl, ...(token ? { authToken: token } : {}) });
    } else {
      dbClient = createClient({ url: rawUrl || 'file:pleasantview.db', ...(token ? { authToken: token } : {}) });
    }
  } catch (err) {
    console.warn('[DB Client Initialization Notice]:', err?.message);
    dbClient = {
      execute: async () => ({ rows: [] }),
      batch: async () => []
    };
  }
  return dbClient;
}

export const db = new Proxy({}, {
  get(_, prop) {
    const target = getDb();
    const val = target[prop];
    return typeof val === 'function' ? val.bind(target) : val;
  }
});

export function getSeniorAssessmentInfo() {
  const year = new Date().getFullYear();
  // KCSE ends at the end of next year (2027) as Kenya's final 8-4-4 cohort completes, transitioning to KSSEA
  if (year <= 2027) {
    return {
      exam: 'KCSE',
      fullName: 'Kenya Certificate of Secondary Education (KCSE)',
      performance: 'Historic Maiden B+ Mean Grade',
      subtext: 'Senior 8-4-4 concluding at end of next year, transitioning to KSSEA',
      isTransitioning: true
    };
  } else {
    return {
      exam: 'KSSEA',
      fullName: 'Kenya Senior School Education Assessment (KSSEA)',
      performance: 'Exceeding Expectations (EE) Distinction',
      subtext: 'Senior School CBE Final Pathway Assessment',
      isTransitioning: false
    };
  }
}

export function getSchoolEmailFromName(name) {
  if (!name) return 'admin@pleasantviewschools.co.ke';
  let clean = String(name)
    .replace(/^pleasant\s*view\s+/i, '')
    .replace(/^pleasantview\s+/i, '')
    .replace(/^pvs\s+/i, '')
    .trim();
  if (!clean) clean = String(name).trim();
  const firstWord = clean.split(/[\s_\-]+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!firstWord) return 'admin@pleasantviewschools.co.ke';
  return `${firstWord}@pleasantviewschools.co.ke`;
}

export function getSchoolMapsUrl(school, fallbackMapsUrl = 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5') {
  const customUrl = String(school?.maps_url || '').trim();
  if (customUrl) return customUrl;
  const loc = String(school?.location || '').trim();
  if (loc && !/githunguri/i.test(loc)) {
    const queryStr = [school?.name, loc].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr)}`;
  }
  return fallbackMapsUrl || 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5';
}

export const CATS = PICTORIAL_CATEGORIES;

export const D = {
  name: 'PLEASANT VIEW SCHOOLS',
  motto: 'Our Aim is Victory',
  founded: `${FOUNDING_YEAR} (${getYearsOfExistence()} Years of Existence)`,
  learners: '1,700+',
  boarders: '600+',
  teachers: '100% TSC Certified',
  ratio: '1:20',
  kpsea_perf: 'EE (Exceeding Expectations)',
  kjsea_perf: 'ME1 (Meeting Expectations 1)',
  admin_sms_phone: '+254 711 689 913',
  phone: '+254 711 689 913',
  email: 'info@pleasantviewschools.co.ke',
  location: 'Githunguri, Komothai Subcounty, Kiambu County',
  welcome: 'Welcome to Pleasant View Schools, an exceptional Christian-ethos family of day and boarding institutions dedicated to nurturing holistic, confident, and visionary global leaders through Kenya’s Competency Based Education (CBE).',
  about: 'Founded in 1998, Pleasant View Schools has grown from a visionary primary academy into a nationally acclaimed multi-campus group of schools in Githunguri, Kiambu County. Across our academic journey, Pleasant View has consistently maintained distinguished performance with an average of EE (Exceeding Expectations) in KPSEA and ME1 in KJSEA, positioning us permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic mean grade of B+ in their maiden KCSE examinations and dynamically transitions into the Kenya Senior School Education Assessment (KSSEA). Pioneering Kenya\'s Competency Based Education (CBE), our campuses feature state-of-the-art Pre-Technical, Integrated Science, and Digital STEM hubs designed to nurture each child\'s unique pathway.',
  mission: 'Equip learners with relevant skills and attitudes that will enable them face future challenges.',
  vision: 'Develop and fully exploit the academic potential of learners.',
  values: 'Respect, Integrity, Empathy, Excellence, Accountability, Co-operation, Critical thinking, Appreciation.',
  maps_url: 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5',
  social_facebook: 'https://www.facebook.com/PleasantViewSchools98',
  social_instagram: 'https://www.instagram.com/pleasant_view_schools?mdxt=MWM2eDZvZGxhOTBlZA==',
  social_youtube: 'https://youtube.com/@pleasantviewschools?si=ot3wZjmIo517hyZm',
  whatsapp_phone: '254711689913',
  whatsapp_url: 'https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20would%20like%20to%20inquire%20about%20admissions.',
  social_twitter: 'https://x.com/pleasantview_ke',
  social_linkedin: 'https://linkedin.com/company/pleasantview-schools',
  social_tiktok: 'https://tiktok.com/@pleasantviewschools'
};

const TABLE_SCHEMAS = [
  'CREATE TABLE IF NOT EXISTS schools(id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, category TEXT DEFAULT "SENIOR SCHOOL", tagline TEXT DEFAULT "", level TEXT DEFAULT "", color TEXT DEFAULT "#8B1E2D", image TEXT DEFAULT "", phone TEXT DEFAULT "", email TEXT DEFAULT "", welcome TEXT DEFAULT "", about TEXT DEFAULT "", mission TEXT DEFAULT "", vision TEXT DEFAULT "", founded TEXT DEFAULT "", learners TEXT DEFAULT "", boarders TEXT DEFAULT "", ratio TEXT DEFAULT "", sort INTEGER DEFAULT 0, admin_key TEXT, admin_email TEXT DEFAULT "", admin_hash TEXT DEFAULT "", location TEXT DEFAULT "Githunguri, Komothai Subcounty, Kiambu County", maps_url TEXT DEFAULT "", admin_name TEXT DEFAULT "Campus Administrator")',
  'CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, slug TEXT UNIQUE, title TEXT, body TEXT, image TEXT, category TEXT DEFAULT "School News", created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS hero(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, image TEXT, headline TEXT, sub TEXT, button_text TEXT DEFAULT "Explore Our Schools", button_link TEXT DEFAULT "/#schools", button_alt_text TEXT DEFAULT "Book a Campus Tour", button_alt_link TEXT DEFAULT "/contact#visit", sort INTEGER DEFAULT 0)',
  'CREATE TABLE IF NOT EXISTS photos(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, category TEXT, image TEXT, caption TEXT, title TEXT DEFAULT "", source_section TEXT DEFAULT "gallery", created_at TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT, mime TEXT, data BLOB, is_chunked INTEGER DEFAULT 0, total_size INTEGER DEFAULT 0, chunk_size INTEGER DEFAULT 0, total_chunks INTEGER DEFAULT 0, filename TEXT DEFAULT "", visual_hint TEXT DEFAULT "")',
  'CREATE TABLE IF NOT EXISTS media_chunks(media_id INTEGER NOT NULL, chunk_index INTEGER NOT NULL, data BLOB NOT NULL, PRIMARY KEY(media_id, chunk_index))',
  'CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT)',
  'CREATE TABLE IF NOT EXISTS visits(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, visit_date TEXT, guests INTEGER, grade TEXT DEFAULT "", notes TEXT DEFAULT "", source TEXT DEFAULT "website", source_ref TEXT DEFAULT "", status TEXT DEFAULT "pending", created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS enquiries(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, message TEXT, grade TEXT DEFAULT "", source TEXT DEFAULT "website", source_ref TEXT DEFAULT "", status TEXT DEFAULT "pending", created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS inbound_sms(id INTEGER PRIMARY KEY, sender TEXT, receiver TEXT, text TEXT, raw_id TEXT DEFAULT "", status TEXT DEFAULT "received", created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS inbound_emails(id INTEGER PRIMARY KEY, sender_name TEXT, sender_email TEXT, recipient TEXT, subject TEXT, body TEXT, html TEXT DEFAULT "", status TEXT DEFAULT "received", is_starred INTEGER DEFAULT 0, is_read INTEGER DEFAULT 0, created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS comm_logs(id INTEGER PRIMARY KEY, type TEXT, direction TEXT, sender TEXT, recipient TEXT, subject TEXT DEFAULT "", content TEXT, status TEXT, is_starred INTEGER DEFAULT 0, is_read INTEGER DEFAULT 0, created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS email_accounts(id INTEGER PRIMARY KEY, email TEXT UNIQUE, display_name TEXT, department TEXT, password TEXT DEFAULT "pleasantview2026", forward_to TEXT DEFAULT "", auto_reply TEXT DEFAULT "", can_login INTEGER DEFAULT 1, role TEXT DEFAULT "Staff", is_active INTEGER DEFAULT 1, created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS videos(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, title TEXT, youtube_url TEXT, category TEXT DEFAULT "Campus Tour", description TEXT DEFAULT "", thumbnail TEXT DEFAULT "", featured INTEGER DEFAULT 1, sort INTEGER DEFAULT 0, created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS jobs(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, title TEXT, department TEXT DEFAULT "Academic", category TEXT DEFAULT "Teaching", contract_type TEXT DEFAULT "Full-Time", location TEXT DEFAULT "Githunguri, Kiambu", description TEXT, requirements TEXT, deadline TEXT, status TEXT DEFAULT "open", created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS job_applications(id INTEGER PRIMARY KEY, job_id INTEGER DEFAULT 0, job_title TEXT DEFAULT "", applicant_name TEXT, email TEXT, phone TEXT, experience TEXT, cover_letter TEXT, resume_url TEXT DEFAULT "", status TEXT DEFAULT "new", created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS leadership_messages(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, role TEXT DEFAULT "Director", name TEXT, title TEXT, quote TEXT, message TEXT, image TEXT DEFAULT "", sort INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS quick_links(id INTEGER PRIMARY KEY, title TEXT, url TEXT, category TEXT DEFAULT "General", description TEXT DEFAULT "", sort INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS admins(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT "Super Administrator", school_id INTEGER DEFAULT 0, school_name TEXT DEFAULT "All Campuses", phone TEXT DEFAULT "", is_active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS glance_metrics(id INTEGER PRIMARY KEY AUTOINCREMENT, stat_value TEXT NOT NULL, stat_label TEXT NOT NULL, stat_desc TEXT NOT NULL, sort INTEGER DEFAULT 0)',
  'CREATE TABLE IF NOT EXISTS exam_results(id INTEGER PRIMARY KEY AUTOINCREMENT, exam_category TEXT NOT NULL DEFAULT "national", school_id INTEGER DEFAULT 0, school_name TEXT DEFAULT "All Campuses", exam_name TEXT NOT NULL, academic_year TEXT DEFAULT "2026", cohort_size TEXT DEFAULT "", mean_grade TEXT DEFAULT "", performance_breakdown TEXT DEFAULT "", top_subjects TEXT DEFAULT "", summary_notes TEXT DEFAULT "", is_published INTEGER DEFAULT 1, sort INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS parent_testimonials(id INTEGER PRIMARY KEY AUTOINCREMENT, parent_name TEXT NOT NULL, learner_name TEXT DEFAULT "", grade_or_division TEXT NOT NULL, relationship TEXT DEFAULT "Parent", rating INTEGER DEFAULT 5, comment TEXT NOT NULL, phone TEXT DEFAULT "", email TEXT DEFAULT "", status TEXT DEFAULT "pending", created_at TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS alumni_stories(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, grad_year TEXT NOT NULL, campus_division TEXT DEFAULT "Senior School", current_role TEXT NOT NULL, university_or_company TEXT DEFAULT "", quote TEXT DEFAULT "", story TEXT NOT NULL, image_url TEXT DEFAULT "", video_url TEXT DEFAULT "", is_featured INTEGER DEFAULT 1, sort INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS learner_testimonials(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, grade_or_class TEXT NOT NULL, school_id INTEGER DEFAULT 0, school_name TEXT DEFAULT "All Campuses", comment TEXT NOT NULL, photo_url TEXT DEFAULT "", favorite_subject TEXT DEFAULT "", future_aspiration TEXT DEFAULT "", sort INTEGER DEFAULT 0, is_published INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, event_date TEXT NOT NULL, event_time TEXT DEFAULT "9:00 AM - 1:00 PM", category TEXT DEFAULT "Academic", location TEXT DEFAULT "Main Campus Pavilion, Githunguri", school_id INTEGER DEFAULT 0, school_name TEXT DEFAULT "All Campuses", description TEXT DEFAULT "", is_featured INTEGER DEFAULT 1, is_active INTEGER DEFAULT 1, sort INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS login_otps(identity TEXT PRIMARY KEY, otp TEXT, scope INTEGER, target_email TEXT, target_phone TEXT, expires_at INTEGER, created TEXT DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS password_otps(identity TEXT PRIMARY KEY, otp TEXT, new_password TEXT, expires_at INTEGER, target_email TEXT, target_phone TEXT, admin_type TEXT, created TEXT DEFAULT CURRENT_TIMESTAMP)'
];

const COLUMN_MIGRATIONS = {
  schools: [
    ['category', 'TEXT DEFAULT "SENIOR SCHOOL"'],
    ['tagline', 'TEXT DEFAULT ""'],
    ['level', 'TEXT DEFAULT ""'],
    ['color', 'TEXT DEFAULT "#8B1E2D"'],
    ['image', 'TEXT DEFAULT ""'],
    ['phone', 'TEXT DEFAULT ""'],
    ['email', 'TEXT DEFAULT ""'],
    ['welcome', 'TEXT DEFAULT ""'],
    ['about', 'TEXT DEFAULT ""'],
    ['mission', 'TEXT DEFAULT ""'],
    ['vision', 'TEXT DEFAULT ""'],
    ['founded', 'TEXT DEFAULT ""'],
    ['learners', 'TEXT DEFAULT ""'],
    ['boarders', 'TEXT DEFAULT ""'],
    ['ratio', 'TEXT DEFAULT ""'],
    ['sort', 'INTEGER DEFAULT 0'],
    ['admin_key', 'TEXT'],
    ['admin_email', 'TEXT DEFAULT ""'],
    ['admin_hash', 'TEXT DEFAULT ""'],
    ['location', 'TEXT DEFAULT "Githunguri, Komothai Subcounty, Kiambu County"'],
    ['maps_url', 'TEXT DEFAULT ""'],
    ['admin_name', 'TEXT DEFAULT "Campus Administrator"']
  ],
  posts: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['image', 'TEXT DEFAULT ""'],
    ['category', 'TEXT DEFAULT "School News"'],
    ['created', 'TEXT DEFAULT CURRENT_TIMESTAMP']
  ],
  hero: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['image', 'TEXT DEFAULT ""'],
    ['headline', 'TEXT DEFAULT ""'],
    ['sub', 'TEXT DEFAULT ""'],
    ['button_text', 'TEXT DEFAULT "Explore Our Schools"'],
    ['button_link', 'TEXT DEFAULT "/#schools"'],
    ['button_alt_text', 'TEXT DEFAULT "Book a Campus Tour"'],
    ['button_alt_link', 'TEXT DEFAULT "/contact#visit"'],
    ['sort', 'INTEGER DEFAULT 0']
  ],
  photos: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['category', 'TEXT DEFAULT "Science & Labs"'],
    ['image', 'TEXT DEFAULT ""'],
    ['caption', 'TEXT DEFAULT ""'],
    ['title', 'TEXT DEFAULT ""'],
    ['source_section', 'TEXT DEFAULT "gallery"'],
    ['created_at', 'TEXT DEFAULT ""']
  ],
  images: [
    ['is_chunked', 'INTEGER DEFAULT 0'],
    ['total_size', 'INTEGER DEFAULT 0'],
    ['chunk_size', 'INTEGER DEFAULT 0'],
    ['total_chunks', 'INTEGER DEFAULT 0'],
    ['filename', 'TEXT DEFAULT ""'],
    ['visual_hint', 'TEXT DEFAULT ""']
  ],
  visits: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['grade', 'TEXT DEFAULT ""'],
    ['notes', 'TEXT DEFAULT ""'],
    ['source', 'TEXT DEFAULT "website"'],
    ['source_ref', 'TEXT DEFAULT ""'],
    ['status', 'TEXT DEFAULT "pending"'],
    ['created', 'TEXT DEFAULT ""']
  ],
  enquiries: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['grade', 'TEXT DEFAULT ""'],
    ['source', 'TEXT DEFAULT "website"'],
    ['source_ref', 'TEXT DEFAULT ""'],
    ['status', 'TEXT DEFAULT "pending"'],
    ['created', 'TEXT DEFAULT ""']
  ],
  inbound_sms: [
    ['raw_id', 'TEXT DEFAULT ""'],
    ['status', 'TEXT DEFAULT "received"'],
    ['created', 'TEXT DEFAULT CURRENT_TIMESTAMP']
  ],
  inbound_emails: [
    ['html', 'TEXT DEFAULT ""'],
    ['status', 'TEXT DEFAULT "received"'],
    ['is_starred', 'INTEGER DEFAULT 0'],
    ['is_read', 'INTEGER DEFAULT 0'],
    ['created', 'TEXT DEFAULT CURRENT_TIMESTAMP']
  ],
  comm_logs: [
    ['subject', 'TEXT DEFAULT ""'],
    ['status', 'TEXT DEFAULT "received"'],
    ['is_starred', 'INTEGER DEFAULT 0'],
    ['is_read', 'INTEGER DEFAULT 0'],
    ['created', 'TEXT DEFAULT CURRENT_TIMESTAMP']
  ],
  email_accounts: [
    ['display_name', 'TEXT DEFAULT ""'],
    ['department', 'TEXT DEFAULT "General Desk"'],
    ['password', 'TEXT DEFAULT "pleasantview2026"'],
    ['forward_to', 'TEXT DEFAULT ""'],
    ['auto_reply', 'TEXT DEFAULT ""'],
    ['can_login', 'INTEGER DEFAULT 1'],
    ['role', 'TEXT DEFAULT "Staff"'],
    ['is_active', 'INTEGER DEFAULT 1']
  ],
  videos: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['category', 'TEXT DEFAULT "Campus Tour"'],
    ['description', 'TEXT DEFAULT ""'],
    ['thumbnail', 'TEXT DEFAULT ""'],
    ['featured', 'INTEGER DEFAULT 1'],
    ['sort', 'INTEGER DEFAULT 0']
  ],
  leadership_messages: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['role', 'TEXT DEFAULT "Director"'],
    ['title', 'TEXT DEFAULT ""'],
    ['quote', 'TEXT DEFAULT ""'],
    ['image', 'TEXT DEFAULT ""'],
    ['sort', 'INTEGER DEFAULT 0'],
    ['is_active', 'INTEGER DEFAULT 1']
  ],
  alumni_stories: [
    ['campus_division', 'TEXT DEFAULT "Senior School"'],
    ['university_or_company', 'TEXT DEFAULT ""'],
    ['quote', 'TEXT DEFAULT ""'],
    ['image_url', 'TEXT DEFAULT ""'],
    ['video_url', 'TEXT DEFAULT ""'],
    ['is_featured', 'INTEGER DEFAULT 1'],
    ['sort', 'INTEGER DEFAULT 0']
  ],
  learner_testimonials: [
    ['school_id', 'INTEGER DEFAULT 0'],
    ['school_name', 'TEXT DEFAULT "All Campuses"'],
    ['photo_url', 'TEXT DEFAULT ""'],
    ['favorite_subject', 'TEXT DEFAULT ""'],
    ['future_aspiration', 'TEXT DEFAULT ""'],
    ['sort', 'INTEGER DEFAULT 0'],
    ['is_published', 'INTEGER DEFAULT 1']
  ]
};

const INDEX_SCHEMAS = [
  'CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools(slug)',
  'CREATE INDEX IF NOT EXISTS idx_schools_sort ON schools(sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_schools_admin_key ON schools(admin_key)',
  'CREATE INDEX IF NOT EXISTS idx_posts_school_id ON posts(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)',
  'CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)',
  'CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created DESC)',
  'CREATE INDEX IF NOT EXISTS idx_posts_school_cat ON posts(school_id, category)',
  'CREATE INDEX IF NOT EXISTS idx_hero_school_id ON hero(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_hero_school_sort ON hero(school_id, sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_photos_school_id ON photos(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category)',
  'CREATE INDEX IF NOT EXISTS idx_photos_school_cat ON photos(school_id, category)',
  'CREATE INDEX IF NOT EXISTS idx_visits_school_id ON visits(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status)',
  'CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created DESC)',
  'CREATE INDEX IF NOT EXISTS idx_visits_source_ref ON visits(source_ref)',
  'CREATE INDEX IF NOT EXISTS idx_enquiries_school_id ON enquiries(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status)',
  'CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created DESC)',
  'CREATE INDEX IF NOT EXISTS idx_enquiries_source_ref ON enquiries(source_ref)',
  'CREATE INDEX IF NOT EXISTS idx_inbound_sms_sender ON inbound_sms(sender)',
  'CREATE INDEX IF NOT EXISTS idx_inbound_sms_status ON inbound_sms(status)',
  'CREATE INDEX IF NOT EXISTS idx_inbound_sms_created ON inbound_sms(created DESC)',
  'CREATE INDEX IF NOT EXISTS idx_inbound_emails_recipient ON inbound_emails(recipient)',
  'CREATE INDEX IF NOT EXISTS idx_inbound_emails_status ON inbound_emails(status)',
  'CREATE INDEX IF NOT EXISTS idx_inbound_emails_created ON inbound_emails(created DESC)',
  'CREATE INDEX IF NOT EXISTS idx_inbound_emails_is_read ON inbound_emails(is_read)',
  'CREATE INDEX IF NOT EXISTS idx_comm_logs_type ON comm_logs(type)',
  'CREATE INDEX IF NOT EXISTS idx_comm_logs_direction ON comm_logs(direction)',
  'CREATE INDEX IF NOT EXISTS idx_comm_logs_status ON comm_logs(status)',
  'CREATE INDEX IF NOT EXISTS idx_comm_logs_created ON comm_logs(created DESC)',
  'CREATE INDEX IF NOT EXISTS idx_email_accounts_email ON email_accounts(email)',
  'CREATE INDEX IF NOT EXISTS idx_email_accounts_active ON email_accounts(is_active, can_login)',
  'CREATE INDEX IF NOT EXISTS idx_videos_school_id ON videos(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured)',
  'CREATE INDEX IF NOT EXISTS idx_videos_sort ON videos(sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_jobs_school_id ON jobs(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)',
  'CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id)',
  'CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status)',
  'CREATE INDEX IF NOT EXISTS idx_job_applications_created ON job_applications(created DESC)',
  'CREATE INDEX IF NOT EXISTS idx_leadership_school_id ON leadership_messages(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_leadership_active_sort ON leadership_messages(is_active, sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_quick_links_active_sort ON quick_links(is_active, sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)',
  'CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active)',
  'CREATE INDEX IF NOT EXISTS idx_admins_school_id ON admins(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_glance_metrics_sort ON glance_metrics(sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_exam_results_school_id ON exam_results(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_exam_results_published ON exam_results(is_published, sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_parent_testimonials_status ON parent_testimonials(status)',
  'CREATE INDEX IF NOT EXISTS idx_parent_testimonials_created ON parent_testimonials(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_alumni_stories_featured_sort ON alumni_stories(is_featured, sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_learner_testimonials_school ON learner_testimonials(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_learner_testimonials_pub_sort ON learner_testimonials(is_published, sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_events_school_id ON events(school_id)',
  'CREATE INDEX IF NOT EXISTS idx_events_active_date ON events(is_active, event_date ASC)',
  'CREATE INDEX IF NOT EXISTS idx_events_sort ON events(sort ASC)',
  'CREATE INDEX IF NOT EXISTS idx_login_otps_expires ON login_otps(expires_at)',
  'CREATE INDEX IF NOT EXISTS idx_password_otps_expires ON password_otps(expires_at)',
  'CREATE INDEX IF NOT EXISTS idx_media_chunks_media ON media_chunks(media_id, chunk_index ASC)'
];

let ready;
export const init = (force = false) => {
  if (force) ready = null;
  return (ready ??= (async () => {
    try {
      if (!force) {
        try {
          const chk = await db.execute({ sql: "SELECT v FROM settings WHERE k='schema_v7_admissions_ready'", args: [] });
          if (chk?.rows?.[0]?.v === '1') return;
        } catch {}
      }

      // Step 1: Create all tables in one atomic batch (CREATE TABLE IF NOT EXISTS never fails on older schemas)
      await db.batch(TABLE_SCHEMAS);

      // Step 2: Inspect existing table columns and table row counts in a single batch
      const tableNames = Object.keys(COLUMN_MIGRATIONS);
      const pragmaQueries = tableNames.map(t => `PRAGMA table_info(${t})`);
      pragmaQueries.push(
        `SELECT
          (SELECT COUNT(*) FROM schools) AS schools_c,
          (SELECT COUNT(*) FROM videos) AS videos_c,
          (SELECT COUNT(*) FROM leadership_messages) AS lead_c,
          (SELECT COUNT(*) FROM quick_links) AS ql_c,
          (SELECT COUNT(*) FROM glance_metrics) AS gm_c,
          (SELECT COUNT(*) FROM exam_results) AS exam_c,
          (SELECT COUNT(*) FROM parent_testimonials) AS pt_c,
          (SELECT COUNT(*) FROM alumni_stories) AS alumni_c,
          (SELECT COUNT(*) FROM learner_testimonials) AS lt_c,
          (SELECT COUNT(*) FROM events) AS events_c,
          (SELECT COUNT(*) FROM jobs) AS jobs_c,
          (SELECT COUNT(*) FROM photos) AS photos_c,
          (SELECT COUNT(*) FROM images WHERE id=1) AS img1_c`
      );
      const infoRes = await db.batch(pragmaQueries);

      // Step 3: Add any missing columns on existing tables (SQLite ALTER TABLE requires constant defaults)
      const alterStmts = [];
      tableNames.forEach((t, idx) => {
        const existingCols = new Set((infoRes[idx]?.rows || []).map(r => String(r.name || '').toLowerCase()));
        for (const [colName, colDef] of COLUMN_MIGRATIONS[t]) {
          if (!existingCols.has(colName.toLowerCase())) {
            const safeDef = String(colDef).replace(/DEFAULT\s+CURRENT_TIMESTAMP/gi, 'DEFAULT ""');
            alterStmts.push(`ALTER TABLE ${t} ADD COLUMN ${colName} ${safeDef}`);
          }
        }
      });
      if (alterStmts.length > 0) {
        await db.batch(alterStmts);
      }

      // Step 4: Create all indexes safely now that all columns exist
      try {
        await db.batch(INDEX_SCHEMAS);
      } catch (idxErr) {
        console.warn('[DB Index Notice]:', idxErr?.message);
      }

      // Step 5: Seed initial default rows into any empty tables so admin additions append to defaults instead of replacing them
      const counts = infoRes[tableNames.length]?.rows?.[0] || {};
      const seedStmts = [];

      if (Number(counts.schools_c || 0) === 0) {
        for (const s of DEFAULT_SCHOOLS) {
          seedStmts.push({
            sql: 'INSERT OR IGNORE INTO schools(id, slug, name, category, tagline, level, color, image, phone, email, welcome, about, mission, vision, founded, learners, boarders, ratio, sort, location, maps_url, admin_name) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            args: [s.id, s.slug, s.name, s.category, s.tagline, s.level, s.color, s.image, s.phone, s.email, s.welcome, s.about, s.mission, s.vision, s.founded, s.learners, s.boarders, s.ratio, s.sort, s.location, s.maps_url || '', s.admin_name]
          });
        }
      }

      if (Number(counts.videos_c || 0) === 0) {
        for (const v of DEFAULT_VIDEOS) {
          seedStmts.push({
            sql: 'INSERT INTO videos(school_id, title, youtube_url, category, description, thumbnail, featured, sort) VALUES(?,?,?,?,?,?,?,?)',
            args: [v.school_id, v.title, v.youtube_url, v.category, v.description, v.thumbnail, v.featured, v.sort]
          });
        }
      }

      if (Number(counts.lead_c || 0) === 0) {
        for (const l of DEFAULT_LEADERSHIP) {
          seedStmts.push({
            sql: 'INSERT INTO leadership_messages(school_id, role, name, title, quote, message, image, sort, is_active) VALUES(?,?,?,?,?,?,?,?,1)',
            args: [l.school_id, l.role, l.name, l.title, l.quote, l.message, l.image, l.sort]
          });
        }
      }

      if (Number(counts.ql_c || 0) === 0) {
        for (const ql of DEFAULT_QUICK_LINKS) {
          seedStmts.push({
            sql: 'INSERT INTO quick_links(title, url, category, description, sort, is_active) VALUES(?,?,?,?,?,1)',
            args: [ql.title, ql.url, ql.category, ql.description, ql.sort]
          });
        }
      }

      if (Number(counts.gm_c || 0) === 0) {
        const yrsNow = String(getYearsOfExistence());
        for (const gm of [
          { id: 1, stat_value: yrsNow, stat_label: 'Years of Existence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
          { id: 2, stat_value: 'EE & ME1', stat_label: 'KPSEA & KJSEA Average', stat_desc: 'Exceeding Expectations & Level 1 Distinction', sort: 2 },
          { id: 3, stat_value: 'KCSE B+', stat_label: 'Senior School Transition', stat_desc: 'Senior 8-4-4 concluding at end of next year, transitioning to KSSEA', sort: 3 },
          { id: 4, stat_value: '1:20', stat_label: 'Teacher-Student Ratio', stat_desc: 'Personalized CBE Competency Coaching', sort: 4 },
          { id: 5, stat_value: '600+', stat_label: 'Boarding Scholars', stat_desc: 'Loving Pastoral Care from Grade 4+', sort: 5 },
          { id: 6, stat_value: '100%', stat_label: 'TSC Certified Faculty', stat_desc: 'Trained CBE Facilitators & Mentors', sort: 6 }
        ]) {
          seedStmts.push({
            sql: 'INSERT OR IGNORE INTO glance_metrics(id, stat_value, stat_label, stat_desc, sort) VALUES(?,?,?,?,?)',
            args: [gm.id, gm.stat_value, gm.stat_label, gm.stat_desc, gm.sort]
          });
        }
      }

      if (Number(counts.exam_c || 0) === 0) {
        for (const r of DEFAULT_EXAM_RESULTS) {
          seedStmts.push({
            sql: 'INSERT INTO exam_results(exam_category, school_id, school_name, exam_name, academic_year, cohort_size, mean_grade, performance_breakdown, top_subjects, summary_notes, is_published, sort) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
            args: [r.exam_category, r.school_id, r.school_name, r.exam_name, r.academic_year, r.cohort_size, r.mean_grade, r.performance_breakdown, r.top_subjects, r.summary_notes, r.is_published, r.sort]
          });
        }
      }

      if (Number(counts.pt_c || 0) === 0) {
        for (const pt of DEFAULT_PARENT_TESTIMONIALS) {
          seedStmts.push({
            sql: 'INSERT INTO parent_testimonials(parent_name, learner_name, grade_or_division, relationship, rating, comment, status, created_at) VALUES(?,?,?,?,?,?,?,?)',
            args: [pt.parent_name, pt.learner_name, pt.grade_or_division, pt.relationship, pt.rating, pt.comment, pt.status, pt.created_at]
          });
        }
      }

      if (Number(counts.alumni_c || 0) === 0) {
        for (const a of DEFAULT_ALUMNI_STORIES) {
          seedStmts.push({
            sql: 'INSERT INTO alumni_stories(name, grad_year, campus_division, current_role, university_or_company, quote, story, image_url, video_url, is_featured, sort) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
            args: [a.name, a.grad_year, a.campus_division, a.current_role, a.university_or_company, a.quote, a.story, a.image_url, a.video_url, a.is_featured, a.sort]
          });
        }
      }

      if (Number(counts.lt_c || 0) === 0) {
        for (const lt of DEFAULT_LEARNER_TESTIMONIALS) {
          seedStmts.push({
            sql: 'INSERT INTO learner_testimonials(name, grade_or_class, school_id, school_name, comment, photo_url, favorite_subject, future_aspiration, sort, is_published) VALUES(?,?,?,?,?,?,?,?,?,?)',
            args: [lt.name, lt.grade_or_class, lt.school_id, lt.school_name, lt.comment, lt.photo_url, lt.favorite_subject, lt.future_aspiration, lt.sort, lt.is_published]
          });
        }
      }

      if (Number(counts.events_c || 0) === 0) {
        for (const ev of DEFAULT_EVENTS) {
          seedStmts.push({
            sql: 'INSERT INTO events(title, event_date, event_time, category, location, school_id, school_name, description, is_featured, is_active, sort) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
            args: [ev.title, ev.event_date, ev.event_time, ev.category, ev.location, ev.school_id, ev.school_name, ev.description, ev.is_featured, ev.is_active, ev.sort]
          });
        }
      }

      if (Number(counts.jobs_c || 0) === 0) {
        for (const j of DEFAULT_JOBS) {
          seedStmts.push({
            sql: 'INSERT INTO jobs(school_id, title, department, category, contract_type, location, description, requirements, deadline, status) VALUES(?,?,?,?,?,?,?,?,?,?)',
            args: [j.school_id, j.title, j.department, j.category, j.contract_type, j.location, j.description, j.requirements, j.deadline, j.status]
          });
        }
      }

      // Seed default pictorial photos if photos table is completely empty
      if (Number(counts.photos_c || 0) === 0) {
        for (const dp of [
          { school_id: 0, category: 'Science & Labs', image: '/images/hero_science_lab.jpg', title: 'Modern Integrated Science & Robotics Laboratory', caption: 'Senior and JSS scholars engaged in hands-on practical experiments under CBE', source_section: 'gallery' },
          { school_id: 0, category: 'Academics & Classroom', image: '/images/hero_library_learning.jpg', title: 'Digital Resource Centre & Library', caption: 'Quiet study and research hubs equipped with modern computers and literature', source_section: 'gallery' },
          { school_id: 0, category: 'Sports & Athletics', image: '/images/hero_sports_field.jpg', title: 'Athletics & Football Pitch', caption: 'Expansive lush green sports complex for track, football, basketball and volleyball', source_section: 'gallery' },
          { school_id: 0, category: 'Boarding & Pastoral', image: '/images/gallery_2.webp', title: 'Pastoral Boarding Houses', caption: 'Safe, hygienic, and nurturing home-away-from-home dormitories with resident houseparents', source_section: 'gallery' },
          { school_id: 0, category: 'Clubs, Music & Arts', image: '/images/gallery_10.webp', title: 'Music & Creative Arts Studio', caption: 'Fostering dramatic arts, musical instruments, and choir excellence', source_section: 'gallery' },
          { school_id: 0, category: 'Events & Chapel', image: '/images/banner_3_a.webp', title: 'Christian Fellowship & Chapel', caption: 'Weekly Sunday worship, pastoral mentorship, and moral fortitude', source_section: 'gallery' },
          { school_id: 0, category: 'Campus & Facilities', image: '/images/primary_school_1.webp', title: 'Lush Githunguri Grounds', caption: 'Serene, secure environment surrounded by fresh highland greenery', source_section: 'gallery' }
        ]) {
          seedStmts.push({
            sql: 'INSERT INTO photos(school_id, category, image, title, caption, source_section) VALUES(?,?,?,?,?,?)',
            args: [dp.school_id, dp.category, dp.image, dp.title, dp.caption, dp.source_section]
          });
        }
      }

      if (seedStmts.length > 0) {
        await db.batch(seedStmts, 'write');
      }

      // Sync any stored legacy 24-year strings to live years of existence (rolls over automatically every Dec 31)
      try {
        const yrsNow = String(getYearsOfExistence());
        await db.batch([
          {
            sql: "UPDATE glance_metrics SET stat_value=?, stat_label='Years of Existence' WHERE stat_value='24+' OR lower(stat_label) IN ('years of excellence', 'years of existence')",
            args: [yrsNow]
          },
          {
            sql: "UPDATE settings SET v=? WHERE k='founded' AND (v LIKE '%24+%Years%' OR v LIKE '1998 (%Years of %')",
            args: [`1998 (${yrsNow} Years of Existence)`]
          },
          {
            sql: "UPDATE hero SET headline=REPLACE(headline, '24 YEARS', ? || ' YEARS') WHERE headline LIKE '%24 YEARS%'",
            args: [yrsNow]
          },
          {
            sql: "UPDATE videos SET description=REPLACE(description, '24-year', ? || '-year') WHERE description LIKE '%24-year%'",
            args: [yrsNow]
          }
        ], 'write');
      } catch {}

      // Step 6: Ensure all existing photos are smartly categorized & backfill photos uploaded in other sections into Pictorial
      try {
        const [
          existingPhotosRes,
          imagesMetaRes,
          heroRowsRes,
          postRowsRes,
          leadRowsRes,
          alumniRowsRes,
          learnerRowsRes,
          schoolRowsRes,
          videoRowsRes,
          pictorialLinkRes,
          existingVisitsRes,
          existingEnquiriesRes,
          inboundEmailsRes,
          inboundSmsRes
        ] = await db.batch([
          'SELECT id, school_id, category, image, title, caption, source_section FROM photos',
          'SELECT id, mime, filename, visual_hint, total_size, COALESCE(LENGTH(data), 0) AS data_len FROM images',
          'SELECT school_id, image, headline, sub, button_link FROM hero',
          'SELECT school_id, image, title, body, category FROM posts',
          'SELECT school_id, image, role, name, title, quote, message FROM leadership_messages',
          'SELECT image_url, name, grad_year, current_role, university_or_company, quote, story FROM alumni_stories',
          'SELECT school_id, photo_url, name, grade_or_class, comment, favorite_subject, future_aspiration FROM learner_testimonials',
          'SELECT id, slug, image, name, category, tagline, about FROM schools',
          'SELECT school_id, thumbnail, title, category, description FROM videos',
          "SELECT COUNT(*) AS cnt FROM quick_links WHERE url='/pictorial'",
          'SELECT id, school_id, name, phone, email, visit_date, source_ref FROM visits',
          'SELECT id, school_id, name, phone, email, message, source_ref FROM enquiries',
          'SELECT id, sender_name, sender_email, recipient, subject, body, status, created FROM inbound_emails ORDER BY id ASC',
          'SELECT id, sender, receiver, text, status, created FROM inbound_sms ORDER BY id ASC'
        ]);

        const migStmts = [];
        const imgMap = new Map();
        for (const im of (imagesMetaRes?.rows || [])) {
          imgMap.set(Number(im.id), im);
        }

        const isUsableImg = (url) => {
          if (!isValidPictorialImageUrl(url)) return false;
          const m = String(url).trim().match(/^\/img\/(\d+)(?:\?.*)?$/);
          if (!m) return true;
          const meta = imgMap.get(Number(m[1]));
          if (!meta) return false;
          const mime = String(meta.mime || '').toLowerCase();
          if (mime && !mime.startsWith('image/')) return false;
          const sz = Math.max(Number(meta.total_size || 0), Number(meta.data_len || 0));
          return sz >= 32;
        };

        const seenImages = new Set();
        for (const p of (existingPhotosRes?.rows || [])) {
          const u = String(p.image || '').trim();
          if (u) seenImages.add(u);
          const ctx = `${p.title || ''} ${p.caption || ''} ${u}`;
          const normCat = normalizePictorialCategory(p.category || '', ctx) || categorizePhoto({
            imageUrl: u,
            title: p.title || '',
            caption: p.caption || ''
          });
          if (normCat && normCat !== p.category) {
            migStmts.push({
              sql: 'UPDATE photos SET category=? WHERE id=?',
              args: [normCat, p.id]
            });
          }
        }

        const queueCandidate = (cand) => {
          const url = String(cand.image || '').trim();
          if (!url || seenImages.has(url) || !isUsableImg(url)) return;
          seenImages.add(url);
          const m = url.match(/^\/img\/(\d+)(?:\?.*)?$/);
          const meta = m ? imgMap.get(Number(m[1])) : null;
          const fileName = meta?.filename || '';
          const visualHint = meta?.visual_hint || '';
          const cat = categorizePhoto({
            fileName,
            imageUrl: url,
            title: cand.title || '',
            caption: cand.caption || '',
            body: cand.body || '',
            sourceCategory: cand.sourceCategory || '',
            buttonLink: cand.buttonLink || '',
            sectionHint: cand.sectionHint || '',
            visualHint
          });
          const finalTitle = derivePhotoTitle({
            title: cand.title || '',
            fileName,
            imageUrl: url,
            sectionHint: cand.sectionHint || '',
            category: cat
          });
          migStmts.push({
            sql: 'INSERT INTO photos(school_id, category, image, title, caption, source_section) VALUES(?,?,?,?,?,?)',
            args: [Number(cand.schoolId) || 0, cat, url, finalTitle, String(cand.caption || '').slice(0, 220), cand.sectionHint || 'gallery']
          });
        };

        for (const h of (heroRowsRes?.rows || [])) {
          queueCandidate({ image: h.image, schoolId: h.school_id, title: h.headline, caption: h.sub, buttonLink: h.button_link, sectionHint: 'hero' });
        }
        for (const p of (postRowsRes?.rows || [])) {
          queueCandidate({ image: p.image, schoolId: p.school_id, title: p.title, caption: String(p.body || '').slice(0, 180), body: p.body, sourceCategory: p.category, sectionHint: 'news' });
        }
        for (const l of (leadRowsRes?.rows || [])) {
          queueCandidate({ image: l.image, schoolId: l.school_id, title: `${l.name || 'Leadership'}${l.role ? ' — ' + l.role : ''}`, caption: l.quote || l.title, body: l.message, sectionHint: 'leadership' });
        }
        for (const a of (alumniRowsRes?.rows || [])) {
          queueCandidate({ image: a.image_url, schoolId: 0, title: `${a.name || 'Alumnus'}${a.grad_year ? ' (' + a.grad_year + ')' : ''}`, caption: `${a.current_role || ''}${a.university_or_company ? ' — ' + a.university_or_company : ''}`, body: `${a.quote || ''} ${a.story || ''}`, sectionHint: 'alumni' });
        }
        for (const lt of (learnerRowsRes?.rows || [])) {
          queueCandidate({ image: lt.photo_url, schoolId: lt.school_id, title: `${lt.name || 'Scholar'}${lt.grade_or_class ? ' — ' + lt.grade_or_class : ''}`, caption: String(lt.comment || '').slice(0, 180), body: `${lt.favorite_subject || ''} ${lt.future_aspiration || ''}`, sectionHint: 'learner' });
        }
        for (const s of (schoolRowsRes?.rows || [])) {
          queueCandidate({ image: s.image, schoolId: s.id, title: s.name, caption: s.tagline, body: s.about, sectionHint: 'school' });
        }
        for (const v of (videoRowsRes?.rows || [])) {
          queueCandidate({ image: v.thumbnail, schoolId: v.school_id, title: v.title, caption: v.description, sourceCategory: v.category, sectionHint: 'video' });
        }

        // Also include any standalone uploaded images in images table not yet linked
        for (const [id, im] of imgMap.entries()) {
          const url = `/img/${id}`;
          if (!seenImages.has(url) && isUsableImg(url)) {
            queueCandidate({ image: url, schoolId: 0, title: '', caption: '', sectionHint: 'upload' });
          }
        }

        if (Number(pictorialLinkRes?.rows?.[0]?.cnt || 0) === 0) {
          migStmts.push({
            sql: 'INSERT INTO quick_links(title, url, category, description, sort, is_active) VALUES(?,?,?,?,?,1)',
            args: ['School Pictorial & Gallery', '/pictorial', 'Media', 'Categorized photo gallery of science labs, sports, boarding, arts, and campus life', 2]
          });
        }

        // Step 7: Reconcile any genuine campus visit bookings & admissions enquiries logged in inbound_emails / inbound_sms
        const schoolsForMatch = (schoolRowsRes?.rows && schoolRowsRes.rows.length > 0) ? schoolRowsRes.rows : DEFAULT_SCHOOLS;
        const visitRefs = new Set();
        const visitSigs = new Set();
        for (const v of (existingVisitsRes?.rows || [])) {
          if (v.source_ref) visitRefs.add(String(v.source_ref));
          visitSigs.add(`${String(v.name || '').toLowerCase().trim()}|${String(v.phone || v.email || '').toLowerCase().trim()}|${String(v.visit_date || '').toLowerCase().trim()}`);
        }

        const enquiryRefs = new Set();
        const enquirySigs = new Set();
        for (const e of (existingEnquiriesRes?.rows || [])) {
          if (e.source_ref) enquiryRefs.add(String(e.source_ref));
          enquirySigs.add(`${String(e.phone || e.email || e.name || '').toLowerCase().trim()}|${String(e.message || '').toLowerCase().trim().slice(0, 80)}`);
        }

        const queueParsedCandidate = (parsed) => {
          if (!parsed) return;
          if (parsed.visit) {
            const v = parsed.visit;
            const sig = `${String(v.name || '').toLowerCase().trim()}|${String(v.phone || v.email || '').toLowerCase().trim()}|${String(v.visit_date || '').toLowerCase().trim()}`;
            if ((!v.source_ref || !visitRefs.has(v.source_ref)) && !visitSigs.has(sig)) {
              if (v.source_ref) visitRefs.add(v.source_ref);
              visitSigs.add(sig);
              migStmts.push({
                sql: 'INSERT INTO visits(school_id, name, phone, email, visit_date, guests, grade, notes, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
                args: [
                  Number(v.school_id) || 0,
                  v.name || 'Campus Visitor',
                  v.phone || '',
                  v.email || '',
                  v.visit_date || 'To Confirm',
                  Number(v.guests) || 2,
                  v.grade || '',
                  v.notes || '',
                  v.source || 'website',
                  v.source_ref || '',
                  v.status || 'pending',
                  v.created || nowSqlTimestamp()
                ]
              });
            }
          }
          if (parsed.enquiry) {
            const e = parsed.enquiry;
            const sig = `${String(e.phone || e.email || e.name || '').toLowerCase().trim()}|${String(e.message || '').toLowerCase().trim().slice(0, 80)}`;
            if ((!e.source_ref || !enquiryRefs.has(e.source_ref)) && !enquirySigs.has(sig)) {
              if (e.source_ref) enquiryRefs.add(e.source_ref);
              enquirySigs.add(sig);
              migStmts.push({
                sql: 'INSERT INTO enquiries(school_id, name, phone, email, message, grade, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?)',
                args: [
                  Number(e.school_id) || 0,
                  e.name || 'Prospective Parent',
                  e.phone || '',
                  e.email || '',
                  e.message || '',
                  e.grade || '',
                  e.source || 'website',
                  e.source_ref || '',
                  e.status || 'pending',
                  e.created || nowSqlTimestamp()
                ]
              });
            }
          }
        };

        for (const em of (inboundEmailsRes?.rows || [])) {
          queueParsedCandidate(parseInboundEmailRecord(em, schoolsForMatch));
        }
        for (const sm of (inboundSmsRes?.rows || [])) {
          queueParsedCandidate(parseInboundSmsRecord(sm, schoolsForMatch));
        }

        migStmts.push({
          sql: "INSERT INTO settings(k, v) VALUES('schema_v7_admissions_ready', '1') ON CONFLICT(k) DO UPDATE SET v='1'",
          args: []
        });

        await db.batch(migStmts, 'write');
      } catch (migErr) {
        console.warn('[DB Pictorial Sync Notice]:', migErr?.message);
      }
    } catch (outerErr) {
      ready = null;
      console.warn('[DB Init] Schema migration notice:', outerErr?.message);
    }
  })());
};

export const q = async (sql, args = []) => {
  await init();
  try {
    const res = await db.execute({ sql, args });
    return res?.rows || [];
  } catch (err) {
    const msg = String(err?.message || '');
    if (msg.includes('no such table') || msg.includes('no such column') || msg.includes('has no column')) {
      try {
        await init(true);
        const retryRes = await db.execute({ sql, args });
        return retryRes?.rows || [];
      } catch (retryErr) {
        console.warn('[DB Retry Notice]:', retryErr?.message);
      }
    } else {
      console.warn('[DB Query Notice]:', msg);
    }
    return [];
  }
};

export const qWrite = async (sql, args = []) => {
  await init();
  try {
    return await db.execute({ sql, args });
  } catch (err) {
    const msg = String(err?.message || '');
    if (msg.includes('no such table') || msg.includes('no such column') || msg.includes('has no column')) {
      await init(true);
      return await db.execute({ sql, args });
    }
    throw err;
  }
};

export const S = async () => {
  const dynamicDefaults = {
    ...D,
    founded: `${FOUNDING_YEAR} (${getYearsOfExistence()} Years of Existence)`
  };
  try {
    const settings = await q('SELECT k,v FROM settings');
    const merged = {
      ...dynamicDefaults,
      ...Object.fromEntries(settings.map(r => [r.k, r.v]))
    };
    if (merged.founded) merged.founded = syncHeritageYearsText(merged.founded);
    if (merged.about) merged.about = syncHeritageYearsText(merged.about);
    return merged;
  } catch {
    return dynamicDefaults;
  }
};

export const normalizeMediaMime = (rawMime = '', rawName = '') => {
  const name = String(rawName || '').toLowerCase().trim();
  let mime = String(rawMime || '').toLowerCase().trim();

  if (!mime || mime === 'application/octet-stream') {
    if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.jfif')) mime = 'image/jpeg';
    else if (name.endsWith('.png')) mime = 'image/png';
    else if (name.endsWith('.webp')) mime = 'image/webp';
    else if (name.endsWith('.gif')) mime = 'image/gif';
    else if (name.endsWith('.svg')) mime = 'image/svg+xml';
    else if (name.endsWith('.avif')) mime = 'image/avif';
    else if (name.endsWith('.bmp')) mime = 'image/bmp';
    else if (name.endsWith('.ico')) mime = 'image/x-icon';
    else if (name.endsWith('.heic') || name.endsWith('.heif')) mime = 'image/heic';
    else if (name.endsWith('.mp4') || name.endsWith('.m4v')) mime = 'video/mp4';
    else if (name.endsWith('.webm')) mime = 'video/webm';
    else if (name.endsWith('.ogg') || name.endsWith('.ogv')) mime = 'video/ogg';
    else if (name.endsWith('.mov')) mime = 'video/quicktime';
    else if (name.endsWith('.3gp')) mime = 'video/3gpp';
    else if (name.endsWith('.mkv')) mime = 'video/x-matroska';
    else if (name.endsWith('.avi')) mime = 'video/x-msvideo';
  }

  if (mime === 'image/jpg' || mime === 'image/pjpeg') mime = 'image/jpeg';
  if (mime === 'image/x-png') mime = 'image/png';
  return mime;
};

const MEDIA_CHUNK_BYTES = 512 * 1024; // 512 KB per chunk

const storeMediaBytes = async (mime, uint8, { fileName = '', visualHint = '' } = {}) => {
  await init();
  const totalSize = uint8.byteLength;
  const cleanName = String(fileName || '').trim();
  const cleanHint = String(visualHint || '').trim();
  if (totalSize <= MEDIA_CHUNK_BYTES) {
    const r = await qWrite(
      'INSERT INTO images(mime, data, is_chunked, total_size, chunk_size, total_chunks, filename, visual_hint) VALUES(?, ?, 0, ?, ?, 1, ?, ?)',
      [mime, uint8, totalSize, totalSize, cleanName, cleanHint]
    );
    let id = r?.lastInsertRowid;
    if (id == null) {
      const [maxRow] = await q('SELECT MAX(id) AS id FROM images');
      id = maxRow?.id;
    }
    return id != null ? '/img/' + String(id) : null;
  }

  const totalChunks = Math.ceil(totalSize / MEDIA_CHUNK_BYTES);
  const r = await qWrite(
    'INSERT INTO images(mime, data, is_chunked, total_size, chunk_size, total_chunks, filename, visual_hint) VALUES(?, NULL, 1, ?, ?, ?, ?, ?)',
    [mime, totalSize, MEDIA_CHUNK_BYTES, totalChunks, cleanName, cleanHint]
  );
  let id = r?.lastInsertRowid;
  if (id == null) {
    const [maxRow] = await q('SELECT MAX(id) AS id FROM images');
    id = maxRow?.id;
  }
  if (id == null) return null;
  const mediaId = Number(id);
  for (let i = 0; i < totalChunks; i++) {
    const slice = uint8.subarray(i * MEDIA_CHUNK_BYTES, Math.min(totalSize, (i + 1) * MEDIA_CHUNK_BYTES));
    await qWrite(
      'INSERT OR REPLACE INTO media_chunks(media_id, chunk_index, data) VALUES(?, ?, ?)',
      [mediaId, i, slice]
    );
  }
  return '/img/' + String(mediaId);
};

export const syncPhotoToPictorial = async ({
  image,
  schoolId = 0,
  explicitCategory = '',
  fileName = '',
  title = '',
  caption = '',
  body = '',
  sourceCategory = '',
  buttonLink = '',
  sectionHint = 'gallery',
  visualHint = '',
  isInitialUpload = false,
  forceNewRow = false
} = {}) => {
  if (!isValidPictorialImageUrl(image)) return null;
  const imgUrl = String(image).trim();
  await init();

  let resolvedFileName = String(fileName || '').trim();
  let resolvedVisualHint = String(visualHint || '').trim();

  const imgMatch = imgUrl.match(/^\/img\/(\d+)(?:\?.*)?$/);
  if (imgMatch) {
    const imgId = Number(imgMatch[1]);
    const [imgMeta] = await q(
      'SELECT id, mime, filename, visual_hint, total_size, COALESCE(LENGTH(data), 0) AS data_len FROM images WHERE id=?',
      [imgId]
    );
    if (!imgMeta) return null;
    const mime = String(imgMeta.mime || '').toLowerCase();
    if (mime && !mime.startsWith('image/')) return null;
    const byteSize = Math.max(Number(imgMeta.total_size || 0), Number(imgMeta.data_len || 0));
    if (byteSize > 0 && byteSize < 32) return null;
    if (!resolvedFileName && imgMeta.filename) resolvedFileName = String(imgMeta.filename);
    if (!resolvedVisualHint && imgMeta.visual_hint) resolvedVisualHint = String(imgMeta.visual_hint);
  }

  const category = categorizePhoto({
    explicitCategory,
    fileName: resolvedFileName,
    imageUrl: imgUrl,
    title,
    caption,
    body,
    sourceCategory,
    buttonLink,
    sectionHint,
    visualHint: resolvedVisualHint
  });

  const finalTitle = derivePhotoTitle({
    title,
    fileName: resolvedFileName,
    imageUrl: imgUrl,
    sectionHint,
    category
  });
  const finalCaption = String(caption || '').trim().slice(0, 260);
  const cleanSchoolId = Number(schoolId) || 0;

  const existingRows = await q('SELECT * FROM photos WHERE image=? ORDER BY id DESC LIMIT 1', [imgUrl]);
  const existing = existingRows?.[0];

  if (existing && !forceNewRow) {
    if (isInitialUpload) return { id: existing.id, category: existing.category };

    const wasRawUpload = existing.source_section === 'upload' || !existing.source_section;
    const nextTitle = String(title || '').trim() ? finalTitle : (existing.title || finalTitle);
    const nextCaption = finalCaption || existing.caption || '';
    const nextSchoolId = cleanSchoolId || Number(existing.school_id) || 0;
    const hasExplicitCat = explicitCategory && String(explicitCategory).toLowerCase() !== 'auto';
    const nextCategory = (hasExplicitCat || wasRawUpload) ? category : (existing.category || category);
    const nextSource = sectionHint && sectionHint !== 'upload' ? sectionHint : (existing.source_section || 'gallery');

    await qWrite(
      'UPDATE photos SET school_id=?, category=?, title=?, caption=?, source_section=? WHERE id=?',
      [nextSchoolId, nextCategory, nextTitle, nextCaption, nextSource, existing.id]
    );
    return { id: existing.id, category: nextCategory };
  }

  if (existing && forceNewRow && existing.source_section === 'upload') {
    await qWrite(
      'UPDATE photos SET school_id=?, category=?, title=?, caption=?, source_section=? WHERE id=?',
      [cleanSchoolId, category, finalTitle, finalCaption, 'gallery', existing.id]
    );
    return { id: existing.id, category };
  }

  const ins = await qWrite(
    'INSERT INTO photos(school_id, category, image, title, caption, source_section) VALUES(?, ?, ?, ?, ?, ?)',
    [cleanSchoolId, category, imgUrl, finalTitle, finalCaption, sectionHint || 'gallery']
  );
  return { id: ins?.lastInsertRowid ? Number(ins.lastInsertRowid) : null, category };
};

export const saveImg = async (f, meta = {}) => {
  if (!f || typeof f !== 'object' || !f.size) return null;
  const mime = normalizeMediaMime(f.type, f.name);
  if (!mime.startsWith('image/')) {
    console.warn('[saveImg] Unsupported image type:', f.type, 'filename:', f.name);
    return null;
  }
  const MAX_IMG_SIZE = 50 * 1024 * 1024; // 50MB
  if (f.size > MAX_IMG_SIZE) {
    console.warn(`[saveImg] Image file size (${(f.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit.`);
    return null;
  }
  try {
    const uint8 = new Uint8Array(await f.arrayBuffer());
    const url = await storeMediaBytes(mime, uint8, {
      fileName: f.name || meta.fileName || '',
      visualHint: meta.visualHint || ''
    });
    if (url && meta.skipPictorialSync !== true) {
      try {
        await syncPhotoToPictorial({
          image: url,
          fileName: f.name || meta.fileName || '',
          schoolId: meta.schoolId || 0,
          title: meta.title || '',
          caption: meta.caption || '',
          body: meta.body || '',
          sourceCategory: meta.sourceCategory || '',
          sectionHint: meta.sectionHint || 'upload',
          isInitialUpload: !meta.title && !meta.caption
        });
      } catch (syncErr) {
        console.warn('[saveImg Pictorial Sync Notice]:', syncErr?.message);
      }
    }
    return url;
  } catch (err) {
    console.error('[saveImg Storage Notice]:', err?.message);
    return null;
  }
};

export const saveVideo = async f => {
  if (!f || typeof f !== 'object' || !f.size) return null;
  const mime = normalizeMediaMime(f.type, f.name);
  if (!mime.startsWith('video/')) {
    console.warn('[saveVideo] Unsupported video format:', f.type, 'filename:', f.name);
    return null;
  }
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB limit
  if (f.size > MAX_VIDEO_SIZE) {
    console.warn(`[saveVideo] Video file size (${(f.size / (1024 * 1024)).toFixed(1)}MB) exceeds 100MB limit.`);
    return null;
  }
  try {
    const uint8 = new Uint8Array(await f.arrayBuffer());
    return await storeMediaBytes(mime, uint8);
  } catch (err) {
    console.error('[saveVideo Storage Notice]:', err?.message);
    return null;
  }
};

export const DEFAULT_SCHOOLS = [
  {
    id: 1,
    slug: 'pleasantview-senior',
    name: 'Pleasant View Senior School',
    category: 'SENIOR SCHOOL',
    level: 'Grades 10 – 12 (Form 1 – 4)',
    tagline: 'Pathways to a purposeful future',
    color: '#8B1E2D',
    image: '/images/girls_high_school3.webp',
    phone: '+254 711 689 913',
    email: 'senior@pleasantviewschools.co.ke',
    welcome: 'Welcome to Pleasant View Senior School. Fostering university readiness, scientific research, and ethical leadership.',
    about: 'Solidifying values and attitudes formed at primary school alongside advanced knowledge and skills acquisition. Our Senior School offers STEM, Social Sciences, and Arts & Sports Science pathways with a sterling record of achieving top university entry grades (mean grade B+ in KCSE).',
    mission: 'To prepare future-ready leaders equipped with academic distinction, technical problem-solving acumen, and sound ethical character.',
    vision: 'A premier national benchmark in holistic senior secondary excellence.',
    founded: '2016',
    learners: '450 Students',
    boarders: '450 Boarders',
    ratio: '1:15',
    location: 'Githunguri, Komothai Subcounty, Kiambu County',
    maps_url: '',
    admin_name: 'Senior School Principal',
    sort: 1
  },
  {
    id: 2,
    slug: 'pleasantview-jss',
    name: 'Pleasant View Junior Secondary',
    category: 'JUNIOR SECONDARY (JSS)',
    level: 'Grades 7 – 9',
    tagline: 'Discovering talents and academic pathways',
    color: '#2B303A',
    image: '/images/banner_1_a.webp',
    phone: '+254 711 689 913',
    email: 'junior@pleasantviewschools.co.ke',
    welcome: 'Welcome to Pleasant View Junior Secondary School. Discovering talents, character, and innovative learning pathways.',
    about: 'Pioneering Kenya’s Competency Based Education (CBE) with state-of-the-art Pre-Technical, Integrated Science, Computer Science, and Agriculture laboratories, preparing learners seamlessly for senior pathways and national KJSEA assessments.',
    mission: 'To ignite inquiry, technological literacy, and moral courage during the formative adolescent years.',
    vision: 'A hub of innovative discovery and talent cultivation.',
    founded: '2023',
    learners: '500 Students',
    boarders: '200 Boarders',
    ratio: '1:20',
    location: 'Githunguri, Komothai Subcounty, Kiambu County',
    maps_url: '',
    admin_name: 'JSS Academic Head',
    sort: 2
  },
  {
    id: 3,
    slug: 'pleasantview-primary',
    name: 'Pleasant View Primary School',
    category: 'PRIMARY SCHOOL',
    level: 'Grades 1 – 6 (CBE)',
    tagline: 'Holistic foundational excellence since 1998',
    color: '#8B1E2D',
    image: '/images/primary_school_1.webp',
    phone: '+254 711 689 913',
    email: 'primary@pleasantviewschools.co.ke',
    welcome: 'Welcome to Pleasant View Primary School, nurturing disciplined, confident and all-round high achievers.',
    about: 'Our flagship foundational academy established in 1998. Consistently recognized in Kiambu County with KPSEA performance averaging EE (Exceeding Expectations) and top-tier CBE competency mastery in foundational literacy, numeracy, and digital learning.',
    mission: 'To build a rock-solid scholastic and moral foundation rooted in Christian discipline and intellectual inquiry.',
    vision: 'Excellence in foundational primary learning across East Africa.',
    founded: '1998',
    learners: '600 Pupils',
    boarders: '300 Boarders',
    ratio: '1:22',
    location: 'Githunguri, Komothai Subcounty, Kiambu County',
    maps_url: '',
    admin_name: 'Primary School Headteacher',
    sort: 3
  },
  {
    id: 4,
    slug: 'pleasantview-early-learning',
    name: 'Pleasant View Early Learning Centre',
    category: 'EARLY LEARNING',
    level: 'Playgroup, PP1, PP2',
    tagline: 'Where bright scholastic journeys begin',
    color: '#8B1E2D',
    image: '/images/early_learning_1.webp',
    phone: '+254 711 689 913',
    email: 'early@pleasantviewschools.co.ke',
    welcome: 'Welcome to Pleasant View Early Learning Centre. A warm, joyful, and creative early childhood haven.',
    about: 'Play-based and Montessori-inspired experiential early learning that nurtures curiosity, motor development, phonics, socialization, and foundational faith in a safe, vibrant setting.',
    mission: 'To foster early wonder, joyful expression, and foundational competence in every child.',
    vision: 'The happiest, most stimulating beginning for young minds.',
    founded: '2005',
    learners: '250 Children',
    boarders: 'Day School Only',
    ratio: '1:12',
    location: 'Githunguri, Komothai Subcounty, Kiambu County',
    maps_url: '',
    admin_name: 'Early Childhood Coordinator',
    sort: 4
  }
];

export const schools = async () => {
  const rows = await q('SELECT id, slug, name, category, tagline, level, color, image, phone, email, welcome, about, mission, vision, founded, learners, boarders, ratio, sort, admin_name, location, maps_url FROM schools ORDER BY sort,id');
  return rows && rows.length > 0 ? rows : DEFAULT_SCHOOLS;
};

export const emailAccounts = () => q('SELECT id, email, display_name, department, forward_to, auto_reply, can_login, role, is_active, created FROM email_accounts ORDER BY id ASC');

export const getSchool = async slug => {
  const key = String(slug || '').trim();
  if (!key || key === '0' || key === 'all') return null;
  if (/^\d+$/.test(key)) {
    const idNum = Number(key);
    const [byId] = await q('SELECT id, slug, name, category, tagline, level, color, image, phone, email, welcome, about, mission, vision, founded, learners, boarders, ratio, sort, admin_name, location, maps_url FROM schools WHERE id=?', [idNum]);
    return byId || DEFAULT_SCHOOLS.find(x => x.id === idNum) || null;
  }
  const [s] = await q('SELECT id, slug, name, category, tagline, level, color, image, phone, email, welcome, about, mission, vision, founded, learners, boarders, ratio, sort, admin_name, location, maps_url FROM schools WHERE slug=?', [key]);
  return s || DEFAULT_SCHOOLS.find(x => x.slug === key) || null;
};

export const SF = [
  'name', 'category', 'tagline', 'level', 'location', 'maps_url', 'color', 'image', 'phone', 'email',
  'welcome', 'about', 'mission', 'vision', 'founded', 'learners', 'boarders', 'ratio',
  'admin_name'
];

export const getGlanceMetrics = async () => {
  const yrsNow = String(getYearsOfExistence());
  try {
    const rows = await q('SELECT * FROM glance_metrics ORDER BY sort ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(r => normalizeGlanceMetricRow(r));
  } catch {}
  return [
    { id: 1, stat_value: yrsNow, stat_label: 'Years of Existence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
    { id: 2, stat_value: 'EE & ME1', stat_label: 'KPSEA & KJSEA Average', stat_desc: 'Exceeding Expectations & Level 1 Distinction', sort: 2 },
    { id: 3, stat_value: 'KCSE B+', stat_label: 'Senior School Transition', stat_desc: 'Senior 8-4-4 concluding at end of next year, transitioning to KSSEA', sort: 3 },
    { id: 4, stat_value: '1:20', stat_label: 'Teacher-Student Ratio', stat_desc: 'Personalized CBE Competency Coaching', sort: 4 },
    { id: 5, stat_value: '600+', stat_label: 'Boarding Scholars', stat_desc: 'Loving Pastoral Care from Grade 4+', sort: 5 },
    { id: 6, stat_value: '100%', stat_label: 'TSC Certified Faculty', stat_desc: 'Trained CBE Facilitators & Mentors', sort: 6 }
  ];
};

export const getAdmins = async () => {
  try {
    return await q('SELECT id, name, email, role, school_id, school_name, phone, is_active, created_at FROM admins ORDER BY id ASC');
  } catch {
    return [];
  }
};

export const getPhotos = async (category = null, school_id = 0) => {
  try {
    let sql = 'SELECT p.*, s.name AS school_name, s.slug AS school_slug FROM photos p LEFT JOIN schools s ON s.id = p.school_id';
    const args = [];
    const conds = [];
    if (category && category !== 'All') {
      conds.push('p.category = ?');
      args.push(category);
    }
    if (school_id) {
      conds.push('(p.school_id = 0 OR p.school_id = ?)');
      args.push(Number(school_id));
    }
    if (conds.length > 0) {
      sql += ' WHERE ' + conds.join(' AND ');
    }
    sql += ' ORDER BY p.id DESC';
    return await q(sql, args);
  } catch {
    return [];
  }
};

export const stats = o => [
  ['Learners', o.learners],
  ['Boarders', o.boarders],
  ['Teachers', o.teachers],
  ['Ratio', o.ratio],
  ['KPSEA Level', o.kpsea_perf || 'EE (Exceeding)'],
  ['KJSEA Level', o.kjsea_perf || 'ME1 (Top Tier)'],
  ['Senior Exams', getSeniorAssessmentInfo().performance],
  ['Founded', o.founded]
].filter(x => x[1]);

export const DEFAULT_VIDEOS = [
  {
    id: 1,
    school_id: 0,
    title: 'Pleasant View Schools — Campus Tour & Modern Science Laboratories',
    youtube_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    category: 'Campus Tour',
    description: `Experience our state-of-the-art physics, chemistry, biology, and digital robotics laboratories across our ${getYearsOfExistence()}-year Githunguri campus.`,
    thumbnail: '/images/hero_science_lab.jpg',
    featured: 1,
    sort: 1
  },
  {
    id: 2,
    school_id: 0,
    title: 'Pastoral Care & Boarding Life from Grade 4',
    youtube_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    category: 'Boarding Life',
    description: 'A peek inside our modern dormitories, dining halls, and Christian discipleship mentorship program.',
    thumbnail: '/images/gallery_2.webp',
    featured: 1,
    sort: 2
  },
  {
    id: 3,
    school_id: 0,
    title: 'Highland Sports, Rugby & Athletics Showcase',
    youtube_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    category: 'Sports & Athletics',
    description: 'Cultivating physical stamina, teamwork, and championship sportsmanship on our manicured green pitches.',
    thumbnail: '/images/hero_sports_field.jpg',
    featured: 1,
    sort: 3
  }
];

export const DEFAULT_JOBS = [
  {
    id: 1,
    school_id: 1,
    title: 'Senior School Chemistry & STEM Teacher (TSC Certified)',
    department: 'Academic — High School',
    category: 'Teaching',
    contract_type: 'Full-Time',
    location: 'Pleasant View Senior School, Githunguri',
    description: 'Pleasant View Senior School invites applications from energetic, TSC-registered teachers of Chemistry and Biology or Mathematics. The ideal educator possesses demonstrated experience preparing learners for national examinations and practical STEM laboratory inquiries.',
    requirements: 'Bachelor of Education (Science) with Chemistry, active TSC registration, minimum 3 years teaching experience in an accredited high school, commitment to Christian ethos.',
    deadline: '2026-12-15',
    status: 'open'
  },
  {
    id: 2,
    school_id: 2,
    title: 'Junior Secondary (JSS) Pre-Technical & Computer Science Educator',
    department: 'Academic — Junior Secondary',
    category: 'Teaching',
    contract_type: 'Full-Time',
    location: 'Pleasant View JSS, Githunguri',
    description: 'We seek a dynamic educator to facilitate Pre-Technical Studies, Integrated Science, and Computer Science under Kenya\'s Competency Based Education (CBE).',
    requirements: 'Diploma or Degree in Education (Computer Science / STEM), CBE pedagogical certification, proficient in coding or robotics.',
    deadline: '2026-12-20',
    status: 'open'
  },
  {
    id: 3,
    school_id: 0,
    title: 'Boarding Houseparent / Resident Matron (Pastoral Care)',
    department: 'Pastoral & Boarding',
    category: 'Pastoral',
    contract_type: 'Full-Time (Resident)',
    location: 'Main Boarding Campus, Githunguri',
    description: 'Responsible for creating a warm, structured, and compassionate home-away-from-home for our boarders from Grade 4 upwards.',
    requirements: 'Certificate/Diploma in Counseling, Nursing, or Pastoral Studies, prior boarding school experience, strong Christian mentoring values.',
    deadline: '2026-12-30',
    status: 'open'
  },
  {
    id: 4,
    school_id: 0,
    title: 'School Fleet Driver (PSV / Kiambu & Nairobi Routes)',
    department: 'Operations & Transport',
    category: 'Transport',
    contract_type: 'Full-Time',
    location: 'Pleasant View Transport Fleet, Kiambu',
    description: 'Experienced, courteous driver to operate modern school buses serving Ruiru, Kiambu, and Githunguri commuter routes.',
    requirements: 'Valid PSV license, clean driving record with at least 5 years operating school/commercial passenger transport, valid Certificate of Good Conduct.',
    deadline: '2026-12-10',
    status: 'open'
  }
];

export const getVideos = async (school_id = 0) => {
  const rows = school_id
    ? await q('SELECT v.*, s.name as sname FROM videos v LEFT JOIN schools s ON s.id=v.school_id WHERE v.school_id=0 OR v.school_id=? ORDER BY v.id DESC', [Number(school_id)])
    : await q('SELECT v.*, s.name as sname FROM videos v LEFT JOIN schools s ON s.id=v.school_id ORDER BY v.id DESC');
  const list = rows && rows.length > 0 ? rows : DEFAULT_VIDEOS;
  return list.map(v => ({
    ...v,
    title: syncHeritageYearsText(v.title),
    description: syncHeritageYearsText(v.description)
  }));
};

export const getJobs = async () => {
  const rows = await q('SELECT * FROM jobs WHERE status="open" ORDER BY id DESC');
  return rows && rows.length > 0 ? rows : DEFAULT_JOBS;
};

export const getJobApplications = async () => {
  return await q('SELECT a.*, j.title as job_name FROM job_applications a LEFT JOIN jobs j ON j.id=a.job_id ORDER BY a.id DESC');
};

export const DEFAULT_LEADERSHIP = [
  {
    id: 1,
    school_id: 0,
    role: 'Director',
    name: 'Board of Directors & Executive Principal',
    title: 'Pleasant View Schools Group',
    quote: 'Our aim is victory — not merely in examinations, but in shaping disciplined, visionary young people who lead with wisdom, faith, and purpose.',
    message: 'Welcome to Pleasant View Schools. For over two decades, our community has stood as a beacon of academic excellence and character development in Kiambu County. We believe that true education nurtures the mind while fortifying the soul. Whether in our early learning centre, thriving primary school, modern Junior Secondary (JSS), or distinguished Senior School, we provide state-of-the-art science laboratories, extensive transport coverage, and world-class pastoral boarding.',
    image: '/images/banner_3_a.webp',
    sort: 1
  },
  {
    id: 2,
    school_id: 1,
    role: 'Head of Institution (HOI)',
    name: 'Principal, Senior School',
    title: 'Pleasant View Senior School',
    quote: 'Transforming high school scholars into university-ready leaders of intellectual competence and moral courage.',
    message: 'At Pleasant View Senior School, we answer the call for academic distinction. Building upon our historic B+ KCSE performance, we offer STEM and Arts pathways with fully equipped chemistry, biology, and computer science laboratories under dedicated TSC-certified mentors.',
    image: '/images/hero_science_lab.jpg',
    sort: 2
  },
  {
    id: 3,
    school_id: 2,
    role: 'Coordinator',
    name: 'JSS Academic Coordinator',
    title: 'Junior Secondary & CBE Lead',
    quote: 'Empowering adolescents to discover their gifts through hands-on inquiry, digital coding, and technical competencies.',
    message: 'Our Junior Secondary School pioneers Kenya\'s Competency Based Education (CBE). Our learners engage in real-world science investigations, agricultural projects, and pre-technical exploration preparing them for national KJSEA distinction.',
    image: '/images/hero_library_learning.jpg',
    sort: 3
  }
];

export const getLeadershipMessages = async (school_id = 0) => {
  const rows = school_id
    ? await q(
        'SELECT l.*, s.name as sname FROM leadership_messages l LEFT JOIN schools s ON s.id=l.school_id WHERE l.is_active=1 AND (l.school_id=0 OR l.school_id=?) ORDER BY l.id DESC',
        [Number(school_id)]
      )
    : await q('SELECT l.*, s.name as sname FROM leadership_messages l LEFT JOIN schools s ON s.id=l.school_id WHERE l.is_active=1 ORDER BY l.id DESC');
  return rows && rows.length > 0 ? rows : DEFAULT_LEADERSHIP;
};

export const DEFAULT_QUICK_LINKS = [
  { id: 1, title: 'Term Dates & VISOs', url: '/quick-links/term-dates', category: 'Calendar', description: 'Academic terms, mid-term breaks, and parent visiting Sundays (VISOs)', sort: 1 },
  { id: 8, title: 'School Pictorial & Gallery', url: '/pictorial', category: 'Media', description: 'Categorized photo gallery of science labs, sports, boarding, arts, and campus life', sort: 2 },
  { id: 2, title: 'Grounds and Accommodation', url: '/about#boarding', category: 'Campus Life', description: 'Explore modern boarding dormitories, dining halls, and sports grounds', sort: 3 },
  { id: 3, title: 'Terms & Data Protection', url: '/terms', category: 'Governance', description: 'Institutional terms of service, child safeguarding, and data protection', sort: 4 },
  { id: 4, title: 'Contact Us', url: '/contact', category: 'Contact', description: 'Direct campus lines, admissions desk, and Google Maps directions', sort: 5 },
  { id: 5, title: 'Sports Fixtures', url: '/quick-links/sports-fixtures', category: 'Sports', description: 'Upcoming inter-school athletic fixtures, soccer, and basketball tournaments', sort: 6 },
  { id: 6, title: 'News & Stories', url: '/news', category: 'Media', description: 'Latest highlights, academic triumphs, and campus life stories', sort: 7 },
  { id: 7, title: 'Tenders and Bids', url: '/careers#tenders', category: 'Procurement', description: 'Current institutional supplier tenders, pre-qualifications, and vendor bids', sort: 8 }
];

export const getQuickLinks = async () => {
  try {
    const rows = await q('SELECT * FROM quick_links WHERE is_active=1 ORDER BY id DESC');
    return rows && rows.length > 0 ? rows : DEFAULT_QUICK_LINKS;
  } catch {
    return DEFAULT_QUICK_LINKS;
  }
};

export const DEFAULT_EXAM_RESULTS = [
  {
    id: 1,
    exam_category: 'national',
    school_id: 3,
    school_name: 'Pleasant View Primary School',
    exam_name: 'KPSEA (Kenya Primary School Education Assessment)',
    academic_year: '2026',
    cohort_size: '115 Candidates',
    mean_grade: 'EE (Exceeding Expectations)',
    performance_breakdown: '78% Exceeding Expectations (EE), 22% Meeting Expectations (ME1). 100% Transition to JSS.',
    top_subjects: 'Mathematics (96%), Integrated Science (94%), English (92%), Creative Arts (91%)',
    summary_notes: 'Consistently ranks among the top 10 academic benchmark primary schools across Kiambu County.',
    is_published: 1,
    sort: 1
  },
  {
    id: 2,
    exam_category: 'national',
    school_id: 2,
    school_name: 'Pleasant View Junior Secondary',
    exam_name: 'KJSEA (Kenya Junior School Education Assessment)',
    academic_year: '2026',
    cohort_size: '140 Candidates',
    mean_grade: 'ME1 - Top Tier Distinction',
    performance_breakdown: '84% Level 1 Meeting Expectations, 16% Level 2. 100% Transition to Senior Secondary Pathways.',
    top_subjects: 'Pre-Technical Studies, Integrated Science, Agriculture, Computer Science & Digital Literacy',
    summary_notes: 'Pioneering CBE excellence across STEM, Social Sciences, and Arts & Sports Science pathways.',
    is_published: 1,
    sort: 2
  },
  {
    id: 3,
    exam_category: 'national',
    school_id: 1,
    school_name: 'Pleasant View Senior School',
    exam_name: 'KCSE (Senior Girls Secondary School)',
    academic_year: '2025/2026',
    cohort_size: '85 Candidates',
    mean_grade: 'B+ (9.42 Mean Points)',
    performance_breakdown: '92% Direct University Entry to STEM, Law, Medicine & Engineering. 100% University & College Placement.',
    top_subjects: 'Chemistry (A-), Biology (A), Kiswahili (A), Mathematics (B+), Physics (B+)',
    summary_notes: 'Senior 8-4-4 concluding at end of next year, transitioning seamlessly to KSSEA (Kenya Senior School Education Assessment).',
    is_published: 1,
    sort: 3
  },
  {
    id: 4,
    exam_category: 'internal',
    school_id: 0,
    school_name: 'All Campuses',
    exam_name: 'Term 1 Continuous Formative Assessment & Mock Series',
    academic_year: '2026',
    cohort_size: 'All Enrolled Scholars',
    mean_grade: 'Exemplary Proficiency',
    performance_breakdown: '100% curriculum completion rate with robust practical laboratory competence evaluations.',
    top_subjects: 'Robotics & Coding, Practical Agriculture, Performing Arts, Languages',
    summary_notes: 'Internal joint assessments designed in strict alignment with KNEC / KICD guidelines.',
    is_published: 1,
    sort: 4
  }
];

export const getExamResults = async (category = null, school_id = null) => {
  try {
    let sql = 'SELECT * FROM exam_results WHERE is_published=1';
    const params = [];
    if (category) {
      sql += ' AND exam_category=?';
      params.push(category);
    }
    if (school_id && Number(school_id) > 0) {
      sql += ' AND (school_id=? OR school_id=0)';
      params.push(Number(school_id));
    }
    sql += ' ORDER BY id DESC';
    const rows = await q(sql, params);
    return rows && rows.length > 0 ? rows : DEFAULT_EXAM_RESULTS.filter(r => (!category || r.exam_category === category) && (!school_id || r.school_id === Number(school_id) || r.school_id === 0));
  } catch {
    return DEFAULT_EXAM_RESULTS;
  }
};

export const getAllExamResults = async () => {
  try {
    const rows = await q('SELECT * FROM exam_results ORDER BY id DESC');
    return rows && rows.length > 0 ? rows : DEFAULT_EXAM_RESULTS;
  } catch {
    return DEFAULT_EXAM_RESULTS;
  }
};

export const DEFAULT_PARENT_TESTIMONIALS = [
  {
    id: 1,
    parent_name: 'Eng. David Mwangi',
    learner_name: 'Grace Mwangi',
    grade_or_division: 'Form 2 Senior Girls',
    relationship: 'Parent',
    rating: 5,
    comment: 'Pleasant View has transformed my daughter into a confident, God-fearing scholar. The modern science laboratories, caring housemistresses, and disciplined environment make boarding life truly feel like a home away from home.',
    status: 'approved',
    created_at: '2026-02-15'
  },
  {
    id: 2,
    parent_name: 'Dr. Beatrice Wanjohi',
    learner_name: 'Brian & Ian',
    grade_or_division: 'Grade 7 & Grade 8 JSS',
    relationship: 'Parent',
    rating: 5,
    comment: 'The CBE Junior Secondary curriculum implementation here is benchmark-grade. The teachers give personalized attention, robotics classes have sparked my sons’ creativity, and the academic progress has been exceptional.',
    status: 'approved',
    created_at: '2026-03-01'
  },
  {
    id: 3,
    parent_name: 'Pastor Joseph Kamau',
    learner_name: 'Joy Kamau',
    grade_or_division: 'Grade 5 Primary',
    relationship: 'Parent',
    rating: 5,
    comment: 'The spiritual grounding, morning devotions, and high academic discipline are what every parent prays for. Pleasant View instills moral fortitude and scholastic victory in equal measure.',
    status: 'approved',
    created_at: '2026-03-20'
  }
];

export const getParentTestimonials = async (status = 'approved') => {
  try {
    const rows = await q('SELECT * FROM parent_testimonials WHERE status=? ORDER BY id DESC', [status]);
    return rows && rows.length > 0 ? rows : (status === 'approved' ? DEFAULT_PARENT_TESTIMONIALS : []);
  } catch {
    return status === 'approved' ? DEFAULT_PARENT_TESTIMONIALS : [];
  }
};

export const getAllParentTestimonials = async () => {
  try {
    const rows = await q('SELECT * FROM parent_testimonials ORDER BY id DESC');
    return rows && rows.length > 0 ? rows : DEFAULT_PARENT_TESTIMONIALS;
  } catch {
    return DEFAULT_PARENT_TESTIMONIALS;
  }
};

export const DEFAULT_ALUMNI_STORIES = [
  {
    id: 1,
    name: "Cynthia Ndung'u",
    grad_year: 'Class of 2020',
    campus_division: 'Pleasant View Senior School',
    current_role: 'Software Engineer & FinTech Innovator',
    university_or_company: 'Safaricom PLC / Strathmore Alumna',
    quote: 'Pleasant View gave me the academic foundation, Christian values, and curiosity to pursue computer science with unshakeable confidence.',
    story: 'Cynthia graduated at the top of her senior class and earned a direct university admission in computer science. Today she builds enterprise financial payment infrastructure serving millions of East Africans.',
    image_url: '/images/girls_high_school3.webp',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_featured: 1,
    sort: 1
  },
  {
    id: 2,
    name: 'Dr. Kevin Njoroge',
    grad_year: 'Class of 2017',
    campus_division: 'Primary Flagship Alumnus',
    current_role: 'Medical Doctor & Clinical Researcher',
    university_or_company: 'University of Nairobi School of Medicine',
    quote: 'Our school motto "Our Aim is Victory" remains my guiding compass in every clinical diagnosis and community health initiative.',
    story: 'Kevin was among our celebrated primary school distinction achievers. Following completion of his Bachelor of Medicine and Surgery (MBChB), he actively practices clinical medicine while mentoring aspiring junior scholars.',
    image_url: '/images/gallery_10.webp',
    video_url: '',
    is_featured: 1,
    sort: 2
  }
];

export const getAlumniStories = async (featuredOnly = false) => {
  try {
    let sql = 'SELECT * FROM alumni_stories';
    if (featuredOnly) {
      sql += ' WHERE is_featured=1';
    }
    sql += ' ORDER BY id DESC';
    const rows = await q(sql);
    return rows && rows.length > 0 ? rows : DEFAULT_ALUMNI_STORIES;
  } catch {
    return DEFAULT_ALUMNI_STORIES;
  }
};

export const getAllAlumniStories = async () => {
  try {
    const rows = await q('SELECT * FROM alumni_stories ORDER BY id DESC');
    return rows && rows.length > 0 ? rows : DEFAULT_ALUMNI_STORIES;
  } catch {
    return DEFAULT_ALUMNI_STORIES;
  }
};

export const DEFAULT_LEARNER_TESTIMONIALS = [
  {
    id: 1,
    name: 'Brenda Cherono',
    grade_or_class: 'Form 3 Senior Girls',
    school_id: 1,
    school_name: 'Pleasant View Senior School',
    comment: 'Pleasant View Senior School has given me a launchpad for my dream of becoming an aeronautical engineer. Our physics and robotics labs give us practical confidence every single day.',
    photo_url: '/images/girls_high_school3.webp',
    favorite_subject: 'Physics & Computer Studies',
    future_aspiration: 'Aeronautical Engineer',
    sort: 1,
    is_published: 1
  },
  {
    id: 2,
    name: 'Ryan Kariuki',
    grade_or_class: 'Grade 8 JSS',
    school_id: 2,
    school_name: 'Pleasant View Junior Secondary',
    comment: 'In Junior Secondary, learning is hands-on and inspiring. The teachers guide us through coding, agriculture, and science projects that make learning exciting.',
    photo_url: '/images/gallery_4.webp',
    favorite_subject: 'Integrated Science & Pre-Tech',
    future_aspiration: 'Robotics Scientist',
    sort: 2,
    is_published: 1
  },
  {
    id: 3,
    name: 'Angel Mwangi',
    grade_or_class: 'Grade 5 Primary',
    school_id: 3,
    school_name: 'Pleasant View Primary School',
    comment: 'I love our swimming gala, music club, and the Christian guidance we get during morning devotions. Pleasant View is the best school!',
    photo_url: '/images/primary_school_1.webp',
    favorite_subject: 'Mathematics & Art',
    future_aspiration: 'Architect',
    sort: 3,
    is_published: 1
  }
];

export const getLearnerTestimonials = async (school_id = null) => {
  try {
    let sql = 'SELECT * FROM learner_testimonials WHERE is_published=1';
    const params = [];
    if (school_id && Number(school_id) > 0) {
      sql += ' AND (school_id=? OR school_id=0)';
      params.push(Number(school_id));
    }
    sql += ' ORDER BY id DESC';
    const rows = await q(sql, params);
    return rows && rows.length > 0 ? rows : DEFAULT_LEARNER_TESTIMONIALS.filter(l => !school_id || l.school_id === Number(school_id) || l.school_id === 0);
  } catch {
    return DEFAULT_LEARNER_TESTIMONIALS;
  }
};

export const getAllLearnerTestimonials = async () => {
  try {
    const rows = await q('SELECT * FROM learner_testimonials ORDER BY id DESC');
    return rows && rows.length > 0 ? rows : DEFAULT_LEARNER_TESTIMONIALS;
  } catch {
    return DEFAULT_LEARNER_TESTIMONIALS;
  }
};

export const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'Term 1 Parent-Teacher Visiting Sunday (VISO) & Academic Clinics',
    event_date: '2026-11-15',
    event_time: '1:00 PM - 5:00 PM',
    category: 'Term Dates & VISO',
    location: 'Main Campus Dining Pavilion, Githunguri',
    school_id: 0,
    school_name: 'All Campuses',
    description: 'Academic consultations with subject mentors, progress report reviews, and pastoral boarding inspections.',
    is_featured: 1,
    is_active: 1,
    sort: 1
  },
  {
    id: 2,
    title: 'Inter-Campus Science Fair & Junior Robotics Expo',
    event_date: '2026-11-22',
    event_time: '9:00 AM - 3:30 PM',
    category: 'STEM & Innovation',
    location: 'Science & Computer Laboratories',
    school_id: 0,
    school_name: 'Senior & Junior Secondary',
    description: 'Hands-on demonstrations of agricultural technology, solar prototypes, and student software coding applications.',
    is_featured: 1,
    is_active: 1,
    sort: 2
  },
  {
    id: 3,
    title: 'Annual Inter-House Cross-Country & Track Athletic Meet',
    event_date: '2026-12-05',
    event_time: '8:30 AM - 2:00 PM',
    category: 'Sports & Athletics',
    location: 'Pleasant View Sports Grounds',
    school_id: 0,
    school_name: 'All Campuses',
    description: 'Track & field competitions, relay races, and sportsmanship awards held on our green athletic grounds.',
    is_featured: 1,
    is_active: 1,
    sort: 3
  },
  {
    id: 4,
    title: 'Senior School Dedication & Thanksgiving Chapel Service',
    event_date: '2026-12-12',
    event_time: '10:00 AM - 12:30 PM',
    category: 'Spiritual Life',
    location: 'Campus Chapel Hall',
    school_id: 1,
    school_name: 'Pleasant View Senior School',
    description: 'Spiritual blessing service for candidates and thanksgiving for academic and spiritual milestones.',
    is_featured: 1,
    is_active: 1,
    sort: 4
  }
];

export const getEvents = async (school_id = null) => {
  try {
    let sql = 'SELECT * FROM events WHERE is_active=1';
    const params = [];
    if (school_id && Number(school_id) > 0) {
      sql += ' AND (school_id=? OR school_id=0)';
      params.push(Number(school_id));
    }
    sql += ' ORDER BY id DESC';
    const rows = await q(sql, params);
    return rows && rows.length > 0 ? rows : DEFAULT_EVENTS.filter(e => !school_id || e.school_id === Number(school_id) || e.school_id === 0);
  } catch {
    return DEFAULT_EVENTS;
  }
};

export const getAllEvents = async () => {
  try {
    const rows = await q('SELECT * FROM events ORDER BY id DESC');
    return rows && rows.length > 0 ? rows : DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
};

export const getAdminPanelData = async (scope = 0) => {
  await init();
  const w = scope ? ' WHERE school_id=' + Number(scope) : '';
  const client = getDb();
  const stmts = [
    { sql: `SELECT h.*, s.name sname FROM hero h LEFT JOIN schools s ON s.id=h.school_id${scope ? ' WHERE h.school_id=' + Number(scope) : ''} ORDER BY h.id DESC`, args: [] },
    { sql: `SELECT p.*, s.name sname FROM posts p LEFT JOIN schools s ON s.id=p.school_id${scope ? ' WHERE p.school_id=' + Number(scope) : ''} ORDER BY p.id DESC`, args: [] },
    { sql: `SELECT * FROM photos${w} ORDER BY id DESC`, args: [] },
    { sql: `SELECT v.*, s.name sname FROM visits v LEFT JOIN schools s ON s.id=v.school_id${scope ? ' WHERE (v.school_id=' + Number(scope) + ' OR v.school_id=0)' : ''} ORDER BY v.id DESC LIMIT 250`, args: [] },
    { sql: `SELECT e.*, s.name sname FROM enquiries e LEFT JOIN schools s ON s.id=e.school_id${scope ? ' WHERE (e.school_id=' + Number(scope) + ' OR e.school_id=0)' : ''} ORDER BY e.id DESC LIMIT 250`, args: [] },
    { sql: 'SELECT * FROM inbound_sms ORDER BY id DESC LIMIT 60', args: [] },
    { sql: 'SELECT * FROM inbound_emails ORDER BY id DESC LIMIT 60', args: [] },
    { sql: 'SELECT * FROM comm_logs ORDER BY id DESC LIMIT 60', args: [] },
    { sql: 'SELECT id, email, display_name, department, forward_to, auto_reply, can_login, role, is_active, created FROM email_accounts ORDER BY id ASC', args: [] },
    { sql: `SELECT v.*, s.name sname FROM videos v LEFT JOIN schools s ON s.id=v.school_id${scope ? ' WHERE v.school_id=' + Number(scope) : ''} ORDER BY v.id DESC`, args: [] },
    { sql: `SELECT j.*, s.name sname FROM jobs j LEFT JOIN schools s ON s.id=j.school_id${scope ? ' WHERE j.school_id=' + Number(scope) : ''} ORDER BY j.id DESC`, args: [] },
    { sql: 'SELECT a.*, j.title job_name FROM job_applications a LEFT JOIN jobs j ON j.id=a.job_id ORDER BY a.id DESC LIMIT 60', args: [] },
    { sql: `SELECT m.*, s.name sname FROM leadership_messages m LEFT JOIN schools s ON s.id=m.school_id${scope ? ' WHERE m.school_id=' + Number(scope) : ''} ORDER BY m.id DESC`, args: [] },
    { sql: 'SELECT * FROM quick_links ORDER BY id DESC', args: [] },
    { sql: 'SELECT id, name, email, role, school_id, school_name, phone, is_active, created_at FROM admins ORDER BY id ASC', args: [] },
    { sql: 'SELECT * FROM glance_metrics ORDER BY id ASC', args: [] },
    { sql: 'SELECT p.*, s.name AS sname FROM photos p LEFT JOIN schools s ON s.id=p.school_id' + (scope ? ` WHERE p.school_id=${Number(scope)} OR p.school_id=0` : '') + ' ORDER BY p.id DESC', args: [] },
    { sql: 'SELECT * FROM exam_results ORDER BY id DESC', args: [] },
    { sql: 'SELECT * FROM parent_testimonials ORDER BY id DESC', args: [] },
    { sql: 'SELECT * FROM alumni_stories ORDER BY id DESC', args: [] },
    { sql: 'SELECT * FROM learner_testimonials ORDER BY id DESC', args: [] },
    { sql: 'SELECT * FROM events ORDER BY id DESC', args: [] }
  ];

  try {
    let res;
    try {
      res = await client.batch(stmts);
    } catch (batchErr) {
      await init(true);
      res = await Promise.all(stmts.map(s => q(s.sql, s.args).then(rows => ({ rows }))));
    }
    return {
      hero: res[0]?.rows || [],
      posts: res[1]?.rows || [],
      photos: res[2]?.rows || [],
      vis: res[3]?.rows || [],
      enqs: res[4]?.rows || [],
      inboundSms: res[5]?.rows || [],
      inboundEmails: res[6]?.rows || [],
      commLogs: res[7]?.rows || [],
      emailAccountsList: res[8]?.rows || [],
      vids: (res[9]?.rows && res[9].rows.length > 0) ? res[9].rows : DEFAULT_VIDEOS,
      jobsList: (res[10]?.rows && res[10].rows.length > 0) ? res[10].rows : DEFAULT_JOBS,
      appsList: res[11]?.rows || [],
      leadMessages: (res[12]?.rows && res[12].rows.length > 0) ? res[12].rows : DEFAULT_LEADERSHIP,
      quickLinksList: (res[13]?.rows && res[13].rows.length > 0) ? res[13].rows : DEFAULT_QUICK_LINKS,
      adminsList: (res[14]?.rows && res[14].rows.length > 0) ? res[14].rows : [
        { id: 1, name: 'Central Administrator', email: 'admin@pleasantviewschools.co.ke', role: 'Super Administrator', school_name: 'All Campuses', phone: '+254 711 689 913', is_active: 1 }
      ],
      glanceMetrics: (res[15]?.rows && res[15].rows.length > 0)
        ? res[15].rows.map(r => normalizeGlanceMetricRow(r))
        : [
            { id: 1, stat_value: String(getYearsOfExistence()), stat_label: 'Years of Existence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
            { id: 2, stat_value: 'EE & ME1', stat_label: 'KPSEA & KJSEA Average', stat_desc: 'Exceeding Expectations & Level 1 Distinction', sort: 2 },
            { id: 3, stat_value: 'KCSE B+', stat_label: 'Senior School Transition', stat_desc: 'Senior 8-4-4 concluding at end of next year, transitioning to KSSEA', sort: 3 },
            { id: 4, stat_value: '1:20', stat_label: 'Teacher-Student Ratio', stat_desc: 'Personalized CBE Competency Coaching', sort: 4 },
            { id: 5, stat_value: '600+', stat_label: 'Boarding Scholars', stat_desc: 'Loving Pastoral Care from Grade 4+', sort: 5 },
            { id: 6, stat_value: '100%', stat_label: 'TSC Certified Faculty', stat_desc: 'Trained CBE Facilitators & Mentors', sort: 6 }
          ],
      schoolLifePhotos: res[16]?.rows || [],
      examResultsList: (res[17]?.rows && res[17].rows.length > 0) ? res[17].rows : DEFAULT_EXAM_RESULTS,
      parentTestimonialsList: (res[18]?.rows && res[18].rows.length > 0) ? res[18].rows : DEFAULT_PARENT_TESTIMONIALS,
      alumniList: (res[19]?.rows && res[19].rows.length > 0) ? res[19].rows : DEFAULT_ALUMNI_STORIES,
      learnersList: (res[20]?.rows && res[20].rows.length > 0) ? res[20].rows : DEFAULT_LEARNER_TESTIMONIALS,
      eventsList: (res[21]?.rows && res[21].rows.length > 0) ? res[21].rows : DEFAULT_EVENTS
    };
  } catch (err) {
    console.warn('[getAdminPanelData batch warning]:', err?.message);
    return {
      hero: [], posts: [], photos: [], vis: [], enqs: [], inboundSms: [],
      inboundEmails: [], commLogs: [], emailAccountsList: [],
      vids: DEFAULT_VIDEOS,
      jobsList: DEFAULT_JOBS,
      appsList: [],
      leadMessages: DEFAULT_LEADERSHIP,
      quickLinksList: DEFAULT_QUICK_LINKS,
      adminsList: [{ id: 1, name: 'Central Administrator', email: 'admin@pleasantviewschools.co.ke', role: 'Super Administrator', school_name: 'All Campuses', phone: '+254 711 689 913', is_active: 1 }],
      glanceMetrics: [
        { id: 1, stat_value: String(getYearsOfExistence()), stat_label: 'Years of Existence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
        { id: 2, stat_value: 'EE & ME1', stat_label: 'KPSEA & KJSEA Average', stat_desc: 'Exceeding Expectations & Level 1 Distinction', sort: 2 },
        { id: 3, stat_value: 'KCSE B+', stat_label: 'Senior School Transition', stat_desc: 'Senior 8-4-4 concluding at end of next year, transitioning to KSSEA', sort: 3 },
        { id: 4, stat_value: '1:20', stat_label: 'Teacher-Student Ratio', stat_desc: 'Personalized CBE Competency Coaching', sort: 4 },
        { id: 5, stat_value: '600+', stat_label: 'Boarding Scholars', stat_desc: 'Loving Pastoral Care from Grade 4+', sort: 5 },
        { id: 6, stat_value: '100%', stat_label: 'TSC Certified Faculty', stat_desc: 'Trained CBE Facilitators & Mentors', sort: 6 }
      ],
      schoolLifePhotos: [],
      examResultsList: DEFAULT_EXAM_RESULTS,
      parentTestimonialsList: DEFAULT_PARENT_TESTIMONIALS,
      alumniList: DEFAULT_ALUMNI_STORIES,
      learnersList: DEFAULT_LEARNER_TESTIMONIALS,
      eventsList: DEFAULT_EVENTS
    };
  }
};
