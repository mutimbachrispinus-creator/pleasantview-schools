import { createClient } from '@libsql/client';

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

export const CATS = ['Academics', 'Sports', 'Boarding', 'Clubs & Talents', 'Events', 'Facilities'];

export const D = {
  name: 'PLEASANT VIEW SCHOOLS',
  motto: 'Our Aim is Victory',
  founded: '1998 (24+ Years of Excellence)',
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

let ready;
const init = () => (ready ??= (async () => {
  try {
    await db.batch([
      'CREATE TABLE IF NOT EXISTS schools(id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, category TEXT DEFAULT "SENIOR SCHOOL", tagline TEXT DEFAULT "", level TEXT DEFAULT "", color TEXT DEFAULT "#8B1E2D", image TEXT DEFAULT "", phone TEXT DEFAULT "", email TEXT DEFAULT "", welcome TEXT DEFAULT "", about TEXT DEFAULT "", mission TEXT DEFAULT "", vision TEXT DEFAULT "", founded TEXT DEFAULT "", learners TEXT DEFAULT "", boarders TEXT DEFAULT "", ratio TEXT DEFAULT "", sort INTEGER DEFAULT 0, admin_key TEXT, admin_email TEXT DEFAULT "", admin_hash TEXT DEFAULT "", location TEXT DEFAULT "Githunguri, Komothai Subcounty, Kiambu County", admin_name TEXT DEFAULT "Campus Administrator")',
      'CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, slug TEXT UNIQUE, title TEXT, body TEXT, image TEXT, category TEXT DEFAULT "School News", created TEXT DEFAULT CURRENT_TIMESTAMP)',
      'CREATE TABLE IF NOT EXISTS hero(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, image TEXT, headline TEXT, sub TEXT, button_text TEXT DEFAULT "Explore Our Schools", button_link TEXT DEFAULT "/#schools", button_alt_text TEXT DEFAULT "Book a Campus Tour", button_alt_link TEXT DEFAULT "/contact#visit", sort INTEGER DEFAULT 0)',
      'CREATE TABLE IF NOT EXISTS photos(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, category TEXT, image TEXT, caption TEXT, title TEXT DEFAULT "")',
      'CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT, mime TEXT, data BLOB)',
      'CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT)',
      'CREATE TABLE IF NOT EXISTS visits(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, visit_date TEXT, guests INTEGER, status TEXT DEFAULT "pending", created TEXT DEFAULT CURRENT_TIMESTAMP)',
      'CREATE TABLE IF NOT EXISTS enquiries(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, message TEXT, status TEXT DEFAULT "pending", created TEXT DEFAULT CURRENT_TIMESTAMP)',
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
    ]);
  } catch (outerErr) {
    console.warn("[DB Init] Batch creation notice:", outerErr?.message);
  }
})());

export const q = async (sql, args = []) => {
  try {
    const res = await db.execute({ sql, args });
    return res?.rows || [];
  } catch (err) {
    // If the database has not yet created tables, lazily initialize schema in one batch and retry
    if (err?.message?.includes('no such table')) {
      try {
        await init();
        const retryRes = await db.execute({ sql, args });
        return retryRes?.rows || [];
      } catch (retryErr) {
        console.warn('[DB Retry Notice]:', retryErr?.message);
      }
    } else {
      console.warn('[DB Query Notice]:', err?.message);
    }
    return [];
  }
};

export const S = async () => {
  try {
    const settings = await q('SELECT k,v FROM settings');
    return {
      ...D,
      ...Object.fromEntries(settings.map(r => [r.k, r.v]))
    };
  } catch {
    return D;
  }
};

export const saveImg = async f => {
  if (!f || !f.size || !/^image\/(jpeg|png|webp|svg\+xml)$/.test(f.type) || f.size > 8e6) return null;
  const client = getDb();
  try {
    const r = await client.execute({
      sql: 'INSERT INTO images(mime,data) VALUES(?,?)',
      args: [f.type, new Uint8Array(await f.arrayBuffer())]
    });
    return '/img/' + String(r.lastInsertRowid);
  } catch (err) {
    if (String(err?.message || '').includes('no such table')) {
      await client.execute('CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT, mime TEXT, data BLOB)');
      const r = await client.execute({
        sql: 'INSERT INTO images(mime,data) VALUES(?,?)',
        args: [f.type, new Uint8Array(await f.arrayBuffer())]
      });
      return '/img/' + String(r.lastInsertRowid);
    }
    throw err;
  }
};

export const saveVideo = async f => {
  if (!f || !f.size) return null;
  // USER MANDATE: All uploaded videos must not be beyond 10MB (10 * 1024 * 1024 bytes)
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
  if (f.size > MAX_VIDEO_SIZE) {
    throw new Error(`Video file size (${(f.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed 10MB limit. Please compress or trim the video.`);
  }
  if (!/^video\/(mp4|webm|ogg|quicktime)$/.test(f.type)) {
    throw new Error('Unsupported video format. Please upload MP4, WebM, or Ogg video.');
  }
  const client = getDb();
  try {
    const r = await client.execute({
      sql: 'INSERT INTO images(mime,data) VALUES(?,?)',
      args: [f.type, new Uint8Array(await f.arrayBuffer())]
    });
    return '/img/' + String(r.lastInsertRowid);
  } catch (err) {
    if (String(err?.message || '').includes('no such table')) {
      await client.execute('CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT, mime TEXT, data BLOB)');
      const r = await client.execute({
        sql: 'INSERT INTO images(mime,data) VALUES(?,?)',
        args: [f.type, new Uint8Array(await f.arrayBuffer())]
      });
      return '/img/' + String(r.lastInsertRowid);
    }
    throw err;
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
    admin_name: 'Early Childhood Coordinator',
    sort: 4
  }
];

export const schools = async () => {
  const rows = await q('SELECT * FROM schools ORDER BY sort,id');
  return rows && rows.length > 0 ? rows : DEFAULT_SCHOOLS;
};

export const emailAccounts = () => q('SELECT * FROM email_accounts ORDER BY id ASC');

export const getSchool = async slug => {
  const [s] = await q('SELECT * FROM schools WHERE slug=?', [slug || '']);
  return s || DEFAULT_SCHOOLS.find(x => x.slug === slug);
};

export const SF = [
  'name', 'category', 'tagline', 'level', 'color', 'image', 'phone', 'email',
  'welcome', 'about', 'mission', 'vision', 'founded', 'learners', 'boarders', 'ratio',
  'location', 'admin_name'
];

export const getGlanceMetrics = async () => {
  try {
    const rows = await q('SELECT * FROM glance_metrics ORDER BY sort ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch {}
  return [
    { id: 1, stat_value: '24+', stat_label: 'Years of Excellence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
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
    let sql = 'SELECT * FROM photos';
    const args = [];
    const conds = [];
    if (category && category !== 'All') {
      conds.push('category = ?');
      args.push(category);
    }
    if (school_id) {
      conds.push('(school_id = 0 OR school_id = ?)');
      args.push(Number(school_id));
    }
    if (conds.length > 0) {
      sql += ' WHERE ' + conds.join(' AND ');
    }
    sql += ' ORDER BY id DESC';
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
    description: 'Experience our state-of-the-art physics, chemistry, biology, and digital robotics laboratories across our 24-year Githunguri campus.',
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
  const rows = await q('SELECT * FROM videos WHERE school_id=0 OR school_id=? ORDER BY featured DESC, sort ASC, id DESC', [Number(school_id)]);
  return rows && rows.length > 0 ? rows : DEFAULT_VIDEOS;
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
  const rows = await q(
    'SELECT l.*, s.name as sname FROM leadership_messages l LEFT JOIN schools s ON s.id=l.school_id WHERE l.is_active=1 AND (l.school_id=0 OR l.school_id=?) ORDER BY l.sort ASC, l.id ASC',
    [Number(school_id)]
  );
  return rows && rows.length > 0 ? rows : DEFAULT_LEADERSHIP;
};

export const DEFAULT_QUICK_LINKS = [
  { id: 1, title: 'Term Dates & VISOs', url: '/quick-links/term-dates', category: 'Calendar', description: 'Academic terms, mid-term breaks, and parent visiting Sundays (VISOs)', sort: 1 },
  { id: 2, title: 'Grounds and Accommodation', url: '/about#boarding', category: 'Campus Life', description: 'Explore modern boarding dormitories, dining halls, and sports grounds', sort: 2 },
  { id: 3, title: 'Terms & Data Protection', url: '/terms', category: 'Governance', description: 'Institutional terms of service, child safeguarding, and data protection', sort: 3 },
  { id: 4, title: 'Contact Us', url: '/contact', category: 'Contact', description: 'Direct campus lines, admissions desk, and Google Maps directions', sort: 4 },
  { id: 5, title: 'Sports Fixtures', url: '/quick-links/sports-fixtures', category: 'Sports', description: 'Upcoming inter-school athletic fixtures, soccer, and basketball tournaments', sort: 5 },
  { id: 6, title: 'News & Stories', url: '/news', category: 'Media', description: 'Latest highlights, academic triumphs, and campus life stories', sort: 6 },
  { id: 7, title: 'Tenders and Bids', url: '/careers#tenders', category: 'Procurement', description: 'Current institutional supplier tenders, pre-qualifications, and vendor bids', sort: 7 }
];

export const getQuickLinks = async () => {
  try {
    const rows = await q('SELECT * FROM quick_links WHERE is_active=1 ORDER BY sort ASC, id ASC');
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
    sql += ' ORDER BY sort ASC, id DESC';
    const rows = await q(sql, params);
    return rows && rows.length > 0 ? rows : DEFAULT_EXAM_RESULTS.filter(r => (!category || r.exam_category === category) && (!school_id || r.school_id === Number(school_id) || r.school_id === 0));
  } catch {
    return DEFAULT_EXAM_RESULTS;
  }
};

export const getAllExamResults = async () => {
  try {
    const rows = await q('SELECT * FROM exam_results ORDER BY sort ASC, id DESC');
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
    sql += ' ORDER BY sort ASC, id DESC';
    const rows = await q(sql);
    return rows && rows.length > 0 ? rows : DEFAULT_ALUMNI_STORIES;
  } catch {
    return DEFAULT_ALUMNI_STORIES;
  }
};

export const getAllAlumniStories = async () => {
  try {
    const rows = await q('SELECT * FROM alumni_stories ORDER BY sort ASC, id DESC');
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
    sql += ' ORDER BY sort ASC, id DESC';
    const rows = await q(sql, params);
    return rows && rows.length > 0 ? rows : DEFAULT_LEARNER_TESTIMONIALS.filter(l => !school_id || l.school_id === Number(school_id) || l.school_id === 0);
  } catch {
    return DEFAULT_LEARNER_TESTIMONIALS;
  }
};

export const getAllLearnerTestimonials = async () => {
  try {
    const rows = await q('SELECT * FROM learner_testimonials ORDER BY sort ASC, id DESC');
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
    sql += ' ORDER BY event_date ASC, sort ASC, id DESC';
    const rows = await q(sql, params);
    return rows && rows.length > 0 ? rows : DEFAULT_EVENTS.filter(e => !school_id || e.school_id === Number(school_id) || e.school_id === 0);
  } catch {
    return DEFAULT_EVENTS;
  }
};

export const getAllEvents = async () => {
  try {
    const rows = await q('SELECT * FROM events ORDER BY event_date ASC, sort ASC, id DESC');
    return rows && rows.length > 0 ? rows : DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
};

export const getAdminPanelData = async (scope = 0) => {
  const w = scope ? ' WHERE school_id=' + Number(scope) : '';
  const client = getDb();
  try {
    const res = await client.batch([
      { sql: `SELECT h.*, s.name sname FROM hero h LEFT JOIN schools s ON s.id=h.school_id${scope ? ' WHERE h.school_id=' + Number(scope) : ''} ORDER BY h.school_id ASC, h.sort ASC, h.id ASC`, args: [] },
      { sql: `SELECT id, title, category FROM posts${w} ORDER BY id DESC`, args: [] },
      { sql: `SELECT * FROM photos${w} ORDER BY id DESC LIMIT 30`, args: [] },
      { sql: `SELECT v.*, s.name sname FROM visits v LEFT JOIN schools s ON s.id=v.school_id${scope ? ' WHERE v.school_id=' + Number(scope) : ''} ORDER BY v.id DESC LIMIT 40`, args: [] },
      { sql: `SELECT e.*, s.name sname FROM enquiries e LEFT JOIN schools s ON s.id=e.school_id${scope ? ' WHERE e.school_id=' + Number(scope) : ''} ORDER BY e.id DESC LIMIT 40`, args: [] },
      { sql: 'SELECT * FROM inbound_sms ORDER BY id DESC LIMIT 40', args: [] },
      { sql: 'SELECT * FROM inbound_emails ORDER BY id DESC LIMIT 40', args: [] },
      { sql: 'SELECT * FROM comm_logs ORDER BY id DESC LIMIT 40', args: [] },
      { sql: 'SELECT * FROM email_accounts ORDER BY id ASC', args: [] },
      { sql: `SELECT v.*, s.name sname FROM videos v LEFT JOIN schools s ON s.id=v.school_id${scope ? ' WHERE v.school_id=' + Number(scope) : ''} ORDER BY v.sort ASC, v.id DESC`, args: [] },
      { sql: `SELECT j.*, s.name sname FROM jobs j LEFT JOIN schools s ON s.id=j.school_id${scope ? ' WHERE j.school_id=' + Number(scope) : ''} ORDER BY j.id DESC`, args: [] },
      { sql: 'SELECT a.*, j.title job_name FROM job_applications a LEFT JOIN jobs j ON j.id=a.job_id ORDER BY a.id DESC LIMIT 50', args: [] },
      { sql: `SELECT m.*, s.name sname FROM leadership_messages m LEFT JOIN schools s ON s.id=m.school_id${scope ? ' WHERE m.school_id=' + Number(scope) : ''} ORDER BY m.sort ASC, m.id DESC`, args: [] },
      { sql: 'SELECT * FROM quick_links ORDER BY sort ASC, id ASC', args: [] },
      { sql: 'SELECT id, name, email, role, school_id, school_name, phone, is_active, created_at FROM admins ORDER BY id ASC', args: [] },
      { sql: 'SELECT * FROM glance_metrics ORDER BY sort ASC, id ASC', args: [] },
      { sql: 'SELECT * FROM photos ORDER BY id DESC LIMIT 50', args: [] },
      { sql: 'SELECT * FROM exam_results ORDER BY sort ASC, id DESC', args: [] },
      { sql: 'SELECT * FROM parent_testimonials ORDER BY id DESC', args: [] },
      { sql: 'SELECT * FROM alumni_stories ORDER BY sort ASC, id DESC', args: [] },
      { sql: 'SELECT * FROM learner_testimonials ORDER BY sort ASC, id DESC', args: [] },
      { sql: 'SELECT * FROM events ORDER BY event_date ASC, id ASC', args: [] }
    ]);
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
      vids: res[9]?.rows || [],
      jobsList: res[10]?.rows || [],
      appsList: res[11]?.rows || [],
      leadMessages: res[12]?.rows || [],
      quickLinksList: res[13]?.rows || [],
      adminsList: (res[14]?.rows && res[14].rows.length > 0) ? res[14].rows : [
        { id: 1, name: 'Central Administrator', email: 'admin@pleasantviewschools.co.ke', role: 'Super Administrator', school_name: 'All Campuses', phone: '+254 711 689 913', is_active: 1 }
      ],
      glanceMetrics: (res[15]?.rows && res[15].rows.length > 0) ? res[15].rows : [
        { id: 1, stat_value: '24+', stat_label: 'Years of Excellence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
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
      inboundEmails: [], commLogs: [], emailAccountsList: [], vids: [],
      jobsList: [], appsList: [], leadMessages: [], quickLinksList: [],
      adminsList: [{ id: 1, name: 'Central Administrator', email: 'admin@pleasantviewschools.co.ke', role: 'Super Administrator', school_name: 'All Campuses', phone: '+254 711 689 913', is_active: 1 }],
      glanceMetrics: [
        { id: 1, stat_value: '24+', stat_label: 'Years of Excellence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
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
