import { createClient } from '@libsql/client';

let dbClient;
export function getDb() {
  if (dbClient) return dbClient;
  const rawUrl = process.env.TURSO_URL || process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_TOKEN || process.env.TURSO_AUTH_TOKEN;

  if (rawUrl && (rawUrl.startsWith('libsql:') || rawUrl.startsWith('https:') || rawUrl.startsWith('http:') || rawUrl.startsWith('wss:') || rawUrl.startsWith('ws:'))) {
    dbClient = createClient({ url: rawUrl, ...(token ? { authToken: token } : {}) });
  } else {
    try {
      dbClient = createClient({ url: rawUrl || 'file:pleasantview.db', ...(token ? { authToken: token } : {}) });
    } catch {
      dbClient = {
        execute: async () => ({ rows: [] }),
        batch: async () => []
      };
    }
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
  email: 'infor@pleasantviewschools.co.ke',
  location: 'Githunguri, Komothai Subcounty, Kiambu County',
  welcome: 'Welcome to Pleasant View Schools, an exceptional Christian-ethos family of day and boarding institutions dedicated to nurturing holistic, confident, and visionary global leaders through Kenya’s Competency Based Education (CBE).',
  about: 'Founded in 1998, Pleasant View Schools has grown from a visionary primary academy into a nationally acclaimed multi-campus group of schools in Githunguri, Kiambu County. Across our academic journey, Pleasant View has consistently maintained distinguished performance with an average of EE (Exceeding Expectations) in KPSEA and ME1 in KJSEA, positioning us permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic mean grade of B+ in their maiden KCSE examinations and dynamically transitions into the Kenya Senior School Education Assessment (KSSEA). Pioneering Kenya\'s Competency Based Education (CBE), our campuses feature state-of-the-art Pre-Technical, Integrated Science, and Digital STEM hubs designed to nurture each child\'s unique pathway.',
  mission: 'Equip learners with relevant skills and attitudes that will enable them face future challenges.',
  vision: 'Develop and fully exploit the academic potential of learners.',
  values: 'Courage, Integrity, Compassion, Discipline and Academic Excellence.',
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
    'CREATE TABLE IF NOT EXISTS schools(id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, category TEXT DEFAULT "SENIOR SCHOOL", tagline TEXT DEFAULT "", level TEXT DEFAULT "", color TEXT DEFAULT "#8B1E2D", image TEXT DEFAULT "", phone TEXT DEFAULT "", email TEXT DEFAULT "", welcome TEXT DEFAULT "", about TEXT DEFAULT "", mission TEXT DEFAULT "", vision TEXT DEFAULT "", founded TEXT DEFAULT "", learners TEXT DEFAULT "", boarders TEXT DEFAULT "", ratio TEXT DEFAULT "", sort INTEGER DEFAULT 0, admin_key TEXT, admin_email TEXT DEFAULT "", admin_hash TEXT DEFAULT "")',
    'CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, slug TEXT UNIQUE, title TEXT, body TEXT, image TEXT, category TEXT DEFAULT "School News", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS hero(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, image TEXT, headline TEXT, sub TEXT, button_text TEXT DEFAULT "Explore Our Schools", button_link TEXT DEFAULT "/#schools", button_alt_text TEXT DEFAULT "Book a Campus Tour", button_alt_link TEXT DEFAULT "/contact#visit", sort INTEGER DEFAULT 0)',
    'CREATE TABLE IF NOT EXISTS photos(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, category TEXT, image TEXT, caption TEXT)',
    'CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY, mime TEXT, data BLOB)',
    'CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT)',
    'CREATE TABLE IF NOT EXISTS visits(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, visit_date TEXT, guests INTEGER, status TEXT DEFAULT "pending", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS enquiries(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, message TEXT, status TEXT DEFAULT "pending", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS inbound_sms(id INTEGER PRIMARY KEY, sender TEXT, receiver TEXT, text TEXT, raw_id TEXT DEFAULT "", status TEXT DEFAULT "received", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS inbound_emails(id INTEGER PRIMARY KEY, sender_name TEXT, sender_email TEXT, recipient TEXT, subject TEXT, body TEXT, html TEXT DEFAULT "", status TEXT DEFAULT "received", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS comm_logs(id INTEGER PRIMARY KEY, type TEXT, direction TEXT, sender TEXT, recipient TEXT, subject TEXT DEFAULT "", content TEXT, status TEXT, created TEXT DEFAULT CURRENT_TIMESTAMP)',
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
    'CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, event_date TEXT NOT NULL, event_time TEXT DEFAULT "9:00 AM - 1:00 PM", category TEXT DEFAULT "Academic", location TEXT DEFAULT "Main Campus Pavilion, Githunguri", school_id INTEGER DEFAULT 0, school_name TEXT DEFAULT "All Campuses", description TEXT DEFAULT "", is_featured INTEGER DEFAULT 1, is_active INTEGER DEFAULT 1, sort INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP)'
  ]);

  for (const c of [
    'admin_key TEXT',
    'admin_email TEXT DEFAULT ""',
    'admin_hash TEXT DEFAULT ""',
    'category TEXT DEFAULT "SENIOR SCHOOL"',
    'image TEXT DEFAULT ""',
    'location TEXT DEFAULT "Githunguri, Komothai Subcounty, Kiambu County"',
    'admin_name TEXT DEFAULT "Campus Administrator"',
    'category TEXT DEFAULT "School News"'
  ]) {
    try { await db.execute('ALTER TABLE schools ADD COLUMN ' + c); } catch {}
    try { await db.execute('ALTER TABLE posts ADD COLUMN ' + c); } catch {}
  }

  for (const c of [
    'title TEXT DEFAULT ""'
  ]) {
    try { await db.execute('ALTER TABLE photos ADD COLUMN ' + c); } catch {}
  }

  for (const c of [
    'button_text TEXT DEFAULT "Explore Our Schools"',
    'button_link TEXT DEFAULT "/#schools"',
    'button_alt_text TEXT DEFAULT "Book a Campus Tour"',
    'button_alt_link TEXT DEFAULT "/contact#visit"',
    'sort INTEGER DEFAULT 0'
  ]) {
    try { await db.execute('ALTER TABLE hero ADD COLUMN ' + c); } catch {}
  }

  // Automatic migrations for brand name, assessments, WhatsApp, and social media updates
  try {
    await db.execute({
      sql: "UPDATE hero SET sub=? WHERE sub LIKE '%KCPE%'",
      args: ['Outstanding KPSEA (EE — Exceeding Expectations) and KJSEA (ME1) distinction, with maiden KCSE B+ university transition']
    });
    await db.execute({
      sql: "UPDATE hero SET headline=? WHERE headline='PLEASANTVIEW' OR headline='PLEASANTVIEW SCHOOLS'",
      args: ['PLEASANT VIEW SCHOOLS']
    });
    // Eradicate KCPE / 390 from schools table
    await db.execute({
      sql: "UPDATE schools SET about=? WHERE about LIKE '%KCPE%' OR about LIKE '%390%'",
      args: ['First stage of formal education that offers sound mastery in reading, writing, mathematics, science, and the arts. Our learners achieve an outstanding institutional average of EE (Exceeding Expectations) in KPSEA assessments, ranking consistently among the top 10 schools in Kiambu County.']
    });
    // Replace lingering unspaced Pleasantview across all content tables
    await db.execute("UPDATE schools SET welcome=REPLACE(welcome, 'Pleasantview', 'Pleasant View') WHERE welcome LIKE '%Pleasantview%'");
    await db.execute("UPDATE posts SET body=REPLACE(body, 'Pleasantview', 'Pleasant View') WHERE body LIKE '%Pleasantview%'");
    await db.execute("UPDATE leadership_messages SET title=REPLACE(title, 'Pleasantview', 'Pleasant View'), message=REPLACE(message, 'Pleasantview', 'Pleasant View') WHERE message LIKE '%Pleasantview%' OR title LIKE '%Pleasantview%'");
    await db.execute("UPDATE videos SET title=REPLACE(title, 'Pleasantview', 'Pleasant View') WHERE title LIKE '%Pleasantview%'");
    await db.execute("UPDATE jobs SET location=REPLACE(location, 'Pleasantview', 'Pleasant View'), description=REPLACE(description, 'Pleasantview', 'Pleasant View') WHERE description LIKE '%Pleasantview%' OR location LIKE '%Pleasantview%'");
    await db.execute("UPDATE email_accounts SET auto_reply=REPLACE(auto_reply, 'Pleasantview', 'Pleasant View') WHERE auto_reply LIKE '%Pleasantview%'");

    for (const [k, v] of [
      ['name', 'PLEASANT VIEW SCHOOLS'],
      ['motto', 'OUR AIM IS VICTORY'],
      ['tagline', 'Our Aim is Victory'],
      ['email', 'infor@pleasantviewschools.co.ke'],
      ['social_facebook', 'https://www.facebook.com/PleasantViewSchools98'],
      ['social_instagram', 'https://www.instagram.com/pleasant_view_schools?mdxt=MWM2eDZvZGxhOTBlZA=='],
      ['social_youtube', 'https://youtube.com/@pleasantviewschools?si=ot3wZjmIo517hyZm'],
      ['whatsapp_phone', '254711689913'],
      ['whatsapp_url', 'https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20would%20like%20to%20inquire%20about%20admissions.'],
      ['maps_url', 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5'],
      ['admin_sms_phone', '+254 711 689 913']
    ]) {
      await db.execute({
        sql: 'INSERT INTO settings(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v',
        args: [k, v]
      });
    }

    // Add star and read status columns to inbound_emails and comm_logs if missing
    for (const col of ['is_starred INTEGER DEFAULT 0', 'is_read INTEGER DEFAULT 0']) {
      try { await db.execute('ALTER TABLE inbound_emails ADD COLUMN ' + col); } catch {}
      try { await db.execute('ALTER TABLE comm_logs ADD COLUMN ' + col); } catch {}
    }

    // Upgrade all pleasantview.sc.ke email addresses in email_accounts and admins to @pleasantviewschools.co.ke
    try {
      await db.execute("UPDATE email_accounts SET email=REPLACE(email, '@pleasantview.sc.ke', '@pleasantviewschools.co.ke') WHERE email LIKE '%@pleasantview.sc.ke%'");
      await db.execute("UPDATE admins SET email=REPLACE(email, '@pleasantview.sc.ke', '@pleasantviewschools.co.ke') WHERE email LIKE '%@pleasantview.sc.ke%'");
    } catch {}

    // Synchronize school emails with first name of school rule: <first_word>@pleasantviewschools.co.ke
    try {
      const existingSchools = (await db.execute('SELECT id, name, email FROM schools')).rows || [];
      for (const s of existingSchools) {
        const correctEmail = getSchoolEmailFromName(s.name);
        if (s.email !== correctEmail) {
          await db.execute({
            sql: 'UPDATE schools SET email=? WHERE id=?',
            args: [correctEmail, s.id]
          });
        }
      }
    } catch {}

    // Ensure 4 Core Institutional Email Accounts and School Branch Mailboxes exist
    try {
      const coreAccounts = [
        {
          email: 'infor@pleasantviewschools.co.ke',
          display_name: 'Information & General Desk',
          department: 'Main School Reception',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Hello! Thank you for contacting Pleasant View Schools. Our information desk will respond to your inquiry shortly.'
        },
        {
          email: 'admission@pleasantviewschools.co.ke',
          display_name: 'Admissions Office & Registrar',
          department: 'Admissions & Enrollment',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for reaching out to Pleasant View Schools Admissions. We are excited to welcome your child.'
        },
        {
          email: 'finance@pleasantviewschools.co.ke',
          display_name: 'Finance & Bursar Desk',
          department: 'Finance & Accounts',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Schools Accounts. Please include your student admission number in all inquiries.'
        },
        {
          email: 'admin@pleasantviewschools.co.ke',
          display_name: 'Central Administration',
          department: 'Executive Leadership',
          role: 'SuperAdmin',
          password: 'pleasantview2026',
          auto_reply: 'You have contacted Pleasant View Schools Central Administration. We have logged your correspondence.'
        },
        {
          email: 'senior@pleasantviewschools.co.ke',
          display_name: 'Senior School Branch Admin',
          department: 'Pleasant View Senior School',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Senior School. Our academic office will respond promptly.'
        },
        {
          email: 'junior@pleasantviewschools.co.ke',
          display_name: 'Junior Secondary Branch Admin',
          department: 'Pleasant View Junior Secondary',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Junior Secondary. Our JSS administration will attend to your inquiry.'
        },
        {
          email: 'primary@pleasantviewschools.co.ke',
          display_name: 'Primary School Branch Admin',
          department: 'Pleasant View Primary School',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Primary School. We look forward to assisting you.'
        },
        {
          email: 'early@pleasantviewschools.co.ke',
          display_name: 'Early Learning Branch Admin',
          department: 'Pleasant View Early Learning Centre',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Early Learning Centre. We cherish every young learner.'
        }
      ];

      for (const a of coreAccounts) {
        await db.execute({
          sql: 'INSERT INTO email_accounts(email, display_name, department, role, password, auto_reply, can_login, is_active) VALUES(?,?,?,?,?,?,1,1) ON CONFLICT(email) DO UPDATE SET display_name=excluded.display_name, department=excluded.department',
          args: [a.email, a.display_name, a.department, a.role, a.password, a.auto_reply]
        });
      }
    } catch {}
  } catch {}

  // Seed default schools if table is empty
  const countRow = (await db.execute('SELECT COUNT(*) as c FROM schools')).rows[0];
  if (countRow && Number(countRow.c) === 0) {
    const defaultSchools = [
      {
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
        sort: 1,
        admin_key: 'senior-portal-admin'
      },
      {
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
        sort: 2,
        admin_key: 'jss-portal-admin'
      },
      {
        slug: 'pleasantview-primary',
        name: 'Pleasant View Primary School',
        category: 'PRIMARY SCHOOL',
        level: 'Grades 1 – 6 (CBE)',
        tagline: 'Building solid foundations in knowledge and character',
        color: '#8B1E2D',
        image: '/images/primary_school_1.webp',
        phone: '+254 711 689 913',
        email: 'primary@pleasantviewschools.co.ke',
        welcome: 'Welcome to Pleasant View Primary School, the historic flagship campus of academic distinction.',
        about: 'First stage of formal education that offers sound mastery in reading, writing, mathematics, science, and the arts. Our learners achieve an outstanding average of EE (Exceeding Expectations) in KPSEA assessments, ranking consistently among the top 10 schools in Kiambu County.',
        mission: 'To instill foundational literacy, critical thinking, Christian values, and lifelong love for learning.',
        vision: 'To nurture confident, well-rounded achievers.',
        founded: '1998',
        learners: '1,000 Pupils',
        boarders: '250 Boarders (From Gr. 4)',
        ratio: '1:22',
        sort: 3,
        admin_key: 'primary-portal-admin'
      },
      {
        slug: 'pleasantview-early-learning',
        name: 'Pleasant View Early Learning Centre',
        category: 'EARLY LEARNING',
        level: 'Playgroup, PP1 & PP2 (Crèche)',
        tagline: 'Where learning begins with joy and wonder',
        color: '#8B1E2D',
        image: '/images/early_learning_1.webp',
        phone: '+254 711 689 913',
        email: 'early@pleasantviewschools.co.ke',
        welcome: 'Welcome to Pleasant View Early Learning Centre. Where curious young minds blossom with joy.',
        about: 'An Early Childhood Development programme that lays solid foundations for social and intellectual literacy through purposeful play, creative arts, linguistic discovery, and affectionate Christian care.',
        mission: 'To provide a safe, joyful environment where curiosity blossoms.',
        vision: 'Inspiring young minds toward bright horizons.',
        founded: '1998',
        learners: '250 Pupils',
        boarders: 'Day Scholars',
        ratio: '1:12',
        sort: 4,
        admin_key: 'early-learning-portal-admin'
      }
    ];

    for (const s of defaultSchools) {
      await db.execute({
        sql: 'INSERT INTO schools(slug, name, category, tagline, level, color, image, phone, email, welcome, about, mission, vision, founded, learners, boarders, ratio, sort, admin_key) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        args: [s.slug, s.name, s.category, s.tagline, s.level, s.color, s.image, s.phone, s.email, s.welcome, s.about, s.mission, s.vision, s.founded, s.learners, s.boarders, s.ratio, s.sort, s.admin_key]
      });
    }

    // Seed default hero slides
    await db.execute({
      sql: 'INSERT INTO hero(school_id, image, headline, sub, button_text, button_link, button_alt_text, button_alt_link, sort) VALUES(0, ?, ?, ?, ?, ?, ?, ?, 1)',
      args: ['/images/banner_1_a.webp', 'PLEASANT VIEW SCHOOLS', 'Competent · Confident · Compassionate — Our Aim is Victory', 'Explore Our Schools', '/#schools', 'Book a Campus Tour', '/contact#visit']
    });
    await db.execute({
      sql: 'INSERT INTO hero(school_id, image, headline, sub, button_text, button_link, button_alt_text, button_alt_link, sort) VALUES(0, ?, ?, ?, ?, ?, ?, ?, 2)',
      args: ['/images/banner_2_a.webp', '24 YEARS OF ACADEMIC EXCELLENCE', 'Outstanding KPSEA (EE) and KJSEA (ME1) distinction, with maiden KCSE B+ university transition', 'Our Academics', '/about#academics', 'Admissions Desk', '/contact']
    });
    await db.execute({
      sql: 'INSERT INTO hero(school_id, image, headline, sub, button_text, button_link, button_alt_text, button_alt_link, sort) VALUES(0, ?, ?, ?, ?, ?, ?, ?, 3)',
      args: ['/images/banner_3_a.webp', 'HOLISTIC CHARACTER & MENTORSHIP', 'Nurturing innovators, athletes, and leaders guided by strong Christian values', 'Campus Life', '/about#life', 'Book a Campus Tour', '/contact#visit']
    });

    // Seed initial posts
    await db.execute({
      sql: 'INSERT INTO posts(school_id, slug, title, body, image, category) VALUES(0, ?, ?, ?, ?, ?)',
      args: [
        '2026-national-exams-results',
        '2026 National Examinations: Exceptional Performance Across All Campuses',
        'Pleasant View Schools congratulates our senior and primary scholars for continuing our 24-year tradition of scholastic excellence, recording top ranks nationally with over 90% university qualification.',
        '/images/banner_2_a.webp',
        'Academic Distinction'
      ]
    });
    await db.execute({
      sql: 'INSERT INTO posts(school_id, slug, title, body, image, category) VALUES(0, ?, ?, ?, ?, ?)',
      args: [
        'admissions-2026-2027',
        'Admissions Open: Playgroup, Grade 1, Junior Secondary (JSS) & Senior School',
        'Interviews and campus assessments are now underway for new applicants across Day and Boarding programs. Parents are warmly invited to book a campus tour.',
        '/images/banner_4_a.webp',
        'Admissions Notice'
      ]
    });
    await db.execute({
      sql: 'INSERT INTO posts(school_id, slug, title, body, image, category) VALUES(0, ?, ?, ?, ?, ?)',
      args: [
        'robotics-science-lab-launch',
        'New High-Tech Science & Digital Robotics Hub Unveiled for JSS and Senior School',
        'Fostering practical technical competencies with ultra-modern computer suites, 3D printing, and physics/chemistry research stations under CBE.',
        '/images/gallery_10.webp',
        'Innovation & STEM'
      ]
    });
  }

  // Seed sample inbound messages if empty
  try {
    const smsCount = (await db.execute('SELECT COUNT(*) as c FROM inbound_sms')).rows[0];
    if (smsCount && Number(smsCount.c) === 0) {
      const sampleSMS = [
        {
          sender: '+254722345678',
          receiver: '+254711689913',
          text: 'Habari, what are the Grade 7 JSS boarding admission requirements and fee structure for term 1 2027?',
          status: 'received'
        },
        {
          sender: '+254711998877',
          receiver: '+254711689913',
          text: 'Hello Admissions, do you have school transport coverage for learners from Ruiru, Kahawa West, and Ndenderu?',
          status: 'received'
        },
        {
          sender: '+254733556677',
          receiver: '+254711689913',
          text: 'Good afternoon. I wish to book an interview slot for my daughter joining Form 1 at Pleasant View Senior School.',
          status: 'replied'
        }
      ];
      for (const s of sampleSMS) {
        await db.execute({
          sql: 'INSERT INTO inbound_sms(sender, receiver, text, status) VALUES(?,?,?,?)',
          args: [s.sender, s.receiver, s.text, s.status]
        });
        await db.execute({
          sql: 'INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)',
          args: ['sms', 'inbound', s.sender, s.receiver, s.text, s.status]
        });
      }
    }

    const emailCount = (await db.execute('SELECT COUNT(*) as c FROM inbound_emails')).rows[0];
    if (emailCount && Number(emailCount.c) === 0) {
      const sampleEmails = [
        {
          sender_name: 'Dr. Peter Kamau',
          sender_email: 'pkamau@uonbi.ac.ke',
          recipient: 'infor@pleasantviewschools.co.ke',
          subject: 'Transfer Vacancies: Grade 8 JSS & Form 2 Girls High School',
          body: 'Dear Pleasant View Admissions Office,\n\nWe are relocating our residence from Kisumu to Kiambu County in December and would like to apply for vacancies for our two daughters in Grade 8 JSS and Form 2 respectively. Please share the prospectus, fee details, and upcoming intake evaluation dates.\n\nWarm regards,\nDr. Peter Kamau\n+254 722 345 678',
          status: 'received'
        },
        {
          sender_name: 'Mary Wanjiku',
          sender_email: 'm.wanjiku@gmail.com',
          recipient: 'senior@pleasantviewschools.co.ke',
          subject: 'Application for STEM & Computer Science Pathway - Form 1 2027',
          body: 'Greetings,\n\nMy daughter scored 402 marks in her school mocks and has a strong interest in robotics, coding, and pure sciences. We understand Pleasant View has recently launched a new high-tech robotics and science hub. Kindly guide us on registration steps and requirements.\n\nThank you,\nMary Wanjiku',
          status: 'received'
        },
        {
          sender_name: 'David Ochieng',
          sender_email: 'dochieng@safari.co.ke',
          recipient: 'primary@pleasantviewschools.co.ke',
          subject: 'Early Learning PP2 & Grade 1 Intake Inquiry',
          body: 'Dear Admissions Desk,\n\nWe would like to register our son for Grade 1 CBE starting next academic year. Are guided campus tours available this Saturday morning?\n\nSincerely,\nDavid Ochieng',
          status: 'replied'
        }
      ];
      for (const e of sampleEmails) {
        await db.execute({
          sql: 'INSERT INTO inbound_emails(sender_name, sender_email, recipient, subject, body, status) VALUES(?,?,?,?,?,?)',
          args: [e.sender_name, e.sender_email, e.recipient, e.subject, e.body, e.status]
        });
        await db.execute({
          sql: 'INSERT INTO comm_logs(type, direction, sender, recipient, subject, content, status) VALUES(?,?,?,?,?,?,?)',
          args: ['email', 'inbound', e.sender_email, e.recipient, e.subject, e.body, e.status]
        });
      }
    }

    // Seed default institutional department email accounts
    const accCount = (await db.execute('SELECT COUNT(*) as c FROM email_accounts')).rows[0];
    if (accCount && Number(accCount.c) === 0) {
      const defaultAccounts = [
        {
          email: 'admin@pleasantviewschools.co.ke',
          display_name: 'Central Administration Desk',
          department: 'Executive Administration',
          role: 'SuperAdmin',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for reaching out to Pleasant View Schools Central Administration. We have logged your request.'
        },
        {
          email: 'infor@pleasantviewschools.co.ke',
          display_name: 'Information & General Desk',
          department: 'General School Information',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Hello! Thank you for contacting Pleasant View Schools. Our information desk will respond to your inquiry shortly.'
        },
        {
          email: 'admission@pleasantviewschools.co.ke',
          display_name: 'Admissions & Campus Tours Desk',
          department: 'Admissions & Enrollment Registry',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Welcome to Pleasant View Admissions. We are thrilled you are considering our schools for your child.'
        },
        {
          email: 'finance@pleasantviewschools.co.ke',
          display_name: 'Bursar & Finance Desk',
          department: 'Finance & Student Accounts',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Accounts. For fee verification, please include your student admission number.'
        },
        {
          email: 'senior@pleasantviewschools.co.ke',
          display_name: 'Senior School Administration',
          department: 'Senior Secondary',
          role: 'Branch Admin',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Senior School.'
        },
        {
          email: 'junior@pleasantviewschools.co.ke',
          display_name: 'Junior Secondary Administration',
          department: 'Junior Secondary',
          role: 'Branch Admin',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Junior Secondary.'
        },
        {
          email: 'primary@pleasantviewschools.co.ke',
          display_name: 'Primary School Administration',
          department: 'Primary School',
          role: 'Branch Admin',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Primary School.'
        },
        {
          email: 'early@pleasantviewschools.co.ke',
          display_name: 'Early Learning Administration',
          department: 'Early Childhood',
          role: 'Branch Admin',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasant View Early Learning Centre.'
        }
      ];
      for (const a of defaultAccounts) {
        await db.execute({
          sql: 'INSERT INTO email_accounts(email, display_name, department, role, password, auto_reply, can_login, is_active) VALUES(?,?,?,?,?,?,1,1)',
          args: [a.email, a.display_name, a.department, a.role, a.password, a.auto_reply]
        });
      }
    }

    // Seed default showcase videos
    const vidCount = (await db.execute('SELECT COUNT(*) as c FROM videos')).rows[0];
    if (vidCount && Number(vidCount.c) === 0) {
      for (const v of DEFAULT_VIDEOS) {
        await db.execute({
          sql: 'INSERT INTO videos(school_id, title, youtube_url, category, description, thumbnail, featured, sort) VALUES(?,?,?,?,?,?,?,?)',
          args: [v.school_id, v.title, v.youtube_url, v.category, v.description, v.thumbnail, v.featured, v.sort]
        });
      }
    }

    // Seed default careers & job postings
    const jobCount = (await db.execute('SELECT COUNT(*) as c FROM jobs')).rows[0];
    if (jobCount && Number(jobCount.c) === 0) {
      for (const j of DEFAULT_JOBS) {
        await db.execute({
          sql: 'INSERT INTO jobs(school_id, title, department, category, contract_type, location, description, requirements, deadline, status) VALUES(?,?,?,?,?,?,?,?,?,?)',
          args: [j.school_id, j.title, j.department, j.category, j.contract_type, j.location, j.description, j.requirements, j.deadline, j.status]
        });
      }
    }

    // Seed default leadership & executive messages
    const leadCount = (await db.execute('SELECT COUNT(*) as c FROM leadership_messages')).rows[0];
    if (leadCount && Number(leadCount.c) === 0) {
      for (const l of DEFAULT_LEADERSHIP) {
        await db.execute({
          sql: 'INSERT INTO leadership_messages(school_id, role, name, title, quote, message, image, sort, is_active) VALUES(?,?,?,?,?,?,?,?,1)',
          args: [l.school_id, l.role, l.name, l.title, l.quote, l.message, l.image, l.sort]
        });
      }
    }

    // Seed default glance_metrics if empty
    const metricCount = (await db.execute('SELECT COUNT(*) as c FROM glance_metrics')).rows[0];
    if (metricCount && Number(metricCount.c) === 0) {
      const defaultMetrics = [
        { stat_value: '24+', stat_label: 'Years of Excellence', stat_desc: 'Est. 1998 in Githunguri, Kiambu', sort: 1 },
        { stat_value: 'EE & ME1', stat_label: 'KPSEA & KJSEA Average', stat_desc: 'Exceeding Expectations & Level 1 Distinction', sort: 2 },
        { stat_value: 'KCSE B+', stat_label: 'Senior School Transition', stat_desc: 'Senior 8-4-4 concluding at end of next year, transitioning to KSSEA', sort: 3 },
        { stat_value: '1:20', stat_label: 'Teacher-Student Ratio', stat_desc: 'Personalized CBE Competency Coaching', sort: 4 },
        { stat_value: '600+', stat_label: 'Boarding Scholars', stat_desc: 'Loving Pastoral Care from Grade 4+', sort: 5 },
        { stat_value: '100%', stat_label: 'TSC Certified Faculty', stat_desc: 'Trained CBE Facilitators & Mentors', sort: 6 }
      ];
      for (const m of defaultMetrics) {
        await db.execute({
          sql: 'INSERT INTO glance_metrics(stat_value, stat_label, stat_desc, sort) VALUES(?,?,?,?)',
          args: [m.stat_value, m.stat_label, m.stat_desc, m.sort]
        });
      }
    }

    // Seed default administrators if empty
    const adminCount = (await db.execute('SELECT COUNT(*) as c FROM admins')).rows[0];
    if (adminCount && Number(adminCount.c) === 0) {
      const defaultAdmins = [
        {
          name: 'Central Administrator',
          email: 'admin@pleasantviewschools.co.ke',
          password: 'pleasantview2026',
          role: 'Super Administrator',
          school_id: 0,
          school_name: 'All Campuses',
          phone: '+254 711 689 913'
        },
        {
          name: 'Senior School Principal',
          email: 'senior@pleasantviewschools.co.ke',
          password: 'pleasantview2026',
          role: 'Branch Administrator',
          school_id: 1,
          school_name: 'Pleasant View Senior School',
          phone: '+254 711 689 913'
        },
        {
          name: 'JSS Academic Head',
          email: 'junior@pleasantviewschools.co.ke',
          password: 'pleasantview2026',
          role: 'Branch Administrator',
          school_id: 2,
          school_name: 'Pleasant View Junior Secondary',
          phone: '+254 711 689 913'
        },
        {
          name: 'Primary School Headteacher',
          email: 'primary@pleasantviewschools.co.ke',
          password: 'pleasantview2026',
          role: 'Branch Administrator',
          school_id: 3,
          school_name: 'Pleasant View Primary School',
          phone: '+254 711 689 913'
        },
        {
          name: 'Early Learning Coordinator',
          email: 'early@pleasantviewschools.co.ke',
          password: 'pleasantview2026',
          role: 'Branch Administrator',
          school_id: 4,
          school_name: 'Pleasant View Early Learning Centre',
          phone: '+254 711 689 913'
        }
      ];
      for (const a of defaultAdmins) {
        await db.execute({
          sql: 'INSERT INTO admins(name, email, password, role, school_id, school_name, phone) VALUES(?,?,?,?,?,?,?)',
          args: [a.name, a.email, a.password, a.role, a.school_id, a.school_name, a.phone]
        });
      }
    }

    // Seed default school life photos across categories if empty
    const photoCount = (await db.execute('SELECT COUNT(*) as c FROM photos')).rows[0];
    if (photoCount && Number(photoCount.c) === 0) {
      const defaultPhotos = [
        { category: 'Academic & STEM', image: '/images/hero_science_lab.jpg', title: 'Modern Integrated Science & Robotics Laboratory', caption: 'Senior and JSS scholars engaged in hands-on practical experiments under CBE' },
        { category: 'Academic & STEM', image: '/images/hero_library_learning.jpg', title: 'Digital Resource Centre & Library', caption: 'Quiet study and research hubs equipped with modern computers and literature' },
        { category: 'Sports & Athletics', image: '/images/hero_sports_field.jpg', title: 'Athletics & Football Pitch', caption: 'Expansive lush green sports complex for track, football, basketball and volleyball' },
        { category: 'Boarding Life', image: '/images/gallery_2.webp', title: 'Pastoral Boarding Houses', caption: 'Safe, hygienic, and nurturing home-away-from-home dormitories with resident houseparents' },
        { category: 'Creative Arts', image: '/images/gallery_10.webp', title: 'Music & Creative Arts Studio', caption: 'Fostering dramatic arts, musical instruments, and choir excellence' },
        { category: 'Spiritual Life', image: '/images/banner_3_a.webp', title: 'Christian Fellowship & Chapel', caption: 'Weekly Sunday worship, pastoral mentorship, and moral fortitude' },
        { category: 'Campus Environment', image: '/images/primary_school_1.webp', title: 'Lush Githunguri Grounds', caption: 'Serene, secure environment surrounded by fresh highland greenery' }
      ];
      for (const p of defaultPhotos) {
        await db.execute({
          sql: 'INSERT INTO photos(school_id, category, image, title, caption) VALUES(0, ?, ?, ?, ?)',
          args: [p.category, p.image, p.title, p.caption]
        });
      }
    }

    // Seed default exam results if empty
    const examCount = (await db.execute('SELECT COUNT(*) as c FROM exam_results')).rows[0];
    if (examCount && Number(examCount.c) === 0) {
      const defaultExams = [
        {
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
          sort: 1
        },
        {
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
          sort: 2
        },
        {
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
          sort: 3
        },
        {
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
          sort: 4
        }
      ];
      for (const e of defaultExams) {
        await db.execute({
          sql: 'INSERT INTO exam_results(exam_category, school_id, school_name, exam_name, academic_year, cohort_size, mean_grade, performance_breakdown, top_subjects, summary_notes, is_published, sort) VALUES(?,?,?,?,?,?,?,?,?,?,1,?)',
          args: [e.exam_category, e.school_id, e.school_name, e.exam_name, e.academic_year, e.cohort_size, e.mean_grade, e.performance_breakdown, e.top_subjects, e.summary_notes, e.sort]
        });
      }
    }

    // Seed default approved parent testimonials if empty
    const testCount = (await db.execute('SELECT COUNT(*) as c FROM parent_testimonials')).rows[0];
    if (testCount && Number(testCount.c) === 0) {
      const defaultTestimonials = [
        {
          parent_name: 'Eng. David Mwangi',
          learner_name: 'Grace Mwangi',
          grade_or_division: 'Form 2 Senior Girls',
          relationship: 'Parent',
          rating: 5,
          comment: 'Pleasant View has transformed my daughter into a confident, God-fearing scholar. The modern science laboratories, caring housemistresses, and disciplined environment make boarding life truly feel like a home away from home.',
          phone: '+254722112233',
          email: 'david.mwangi@gmail.com',
          status: 'approved'
        },
        {
          parent_name: 'Dr. Beatrice Wanjohi',
          learner_name: 'Brian & Ian',
          grade_or_division: 'Grade 7 & Grade 8 JSS',
          relationship: 'Parent',
          rating: 5,
          comment: 'The CBE Junior Secondary curriculum implementation here is benchmark-grade. The teachers give personalized attention, robotics classes have sparked my sons’ creativity, and the academic progress has been exceptional.',
          phone: '+254733445566',
          email: 'beatrice.wanjohi@uonbi.ac.ke',
          status: 'approved'
        },
        {
          parent_name: 'Pastor Joseph Kamau',
          learner_name: 'Joy Kamau',
          grade_or_division: 'Grade 5 Primary',
          relationship: 'Parent',
          rating: 5,
          comment: 'The spiritual grounding, morning devotions, and high academic discipline are what every parent prays for. Pleasant View instills moral fortitude and scholastic victory in equal measure.',
          phone: '+254711889900',
          email: 'jkamau@church.org',
          status: 'approved'
        }
      ];
      for (const t of defaultTestimonials) {
        await db.execute({
          sql: 'INSERT INTO parent_testimonials(parent_name, learner_name, grade_or_division, relationship, rating, comment, phone, email, status) VALUES(?,?,?,?,?,?,?,?,?)',
          args: [t.parent_name, t.learner_name, t.grade_or_division, t.relationship, t.rating, t.comment, t.phone, t.email, t.status]
        });
      }
    }

    // Seed default alumni success stories if empty
    const alumCount = (await db.execute('SELECT COUNT(*) as c FROM alumni_stories')).rows[0];
    if (alumCount && Number(alumCount.c) === 0) {
      const defaultAlumni = [
        {
          name: 'Cynthia Ndung\'u',
          grad_year: 'Class of 2020',
          campus_division: 'Pleasant View Senior School',
          current_role: 'Software Engineer & FinTech Innovator',
          university_or_company: 'Safaricom PLC / Strathmore Alumna',
          quote: 'Pleasant View gave me the academic foundation, Christian values, and curiosity to pursue computer science with unshakeable confidence.',
          story: 'Cynthia graduated at the top of her senior class and earned a direct university admission in computer science. Today she builds enterprise financial payment infrastructure serving millions of East Africans.',
          image_url: '/images/alumni_1.webp',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          is_featured: 1,
          sort: 1
        },
        {
          name: 'Dr. Kevin Njoroge',
          grad_year: 'Class of 2017',
          campus_division: 'Primary Flagship Alumnus',
          current_role: 'Medical Doctor & Clinical Researcher',
          university_or_company: 'University of Nairobi School of Medicine',
          quote: 'Our school motto "Our Aim is Victory" remains my guiding compass in every clinical diagnosis and community health initiative.',
          story: 'Kevin was among our celebrated primary school distinction achievers. Following completion of his Bachelor of Medicine and Surgery (MBChB), he actively practices clinical medicine while mentoring aspiring junior scholars.',
          image_url: '/images/alumni_2.webp',
          video_url: '',
          is_featured: 1,
          sort: 2
        }
      ];
      for (const a of defaultAlumni) {
        await db.execute({
          sql: 'INSERT INTO alumni_stories(name, grad_year, campus_division, current_role, university_or_company, quote, story, image_url, video_url, is_featured, sort) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
          args: [a.name, a.grad_year, a.campus_division, a.current_role, a.university_or_company, a.quote, a.story, a.image_url, a.video_url, a.is_featured, a.sort]
        });
      }
    }

    // Seed default learner testimonials if empty
    const learnerCount = (await db.execute('SELECT COUNT(*) as c FROM learner_testimonials')).rows[0];
    if (learnerCount && Number(learnerCount.c) === 0) {
      const defaultLearners = [
        {
          name: 'Brenda Cherono',
          grade_or_class: 'Form 3 Senior Girls',
          school_id: 1,
          school_name: 'Pleasant View Senior School',
          comment: 'Pleasant View Senior School has given me a launchpad for my dream of becoming an aeronautical engineer. Our physics and robotics labs give us practical confidence every single day.',
          photo_url: '/images/girls_high_school3.webp',
          favorite_subject: 'Physics & Computer Studies',
          future_aspiration: 'Aeronautical Engineer',
          sort: 1
        },
        {
          name: 'Ryan Kariuki',
          grade_or_class: 'Grade 8 JSS',
          school_id: 2,
          school_name: 'Pleasant View Junior Secondary',
          comment: 'In Junior Secondary, learning is hands-on and inspiring. The teachers guide us through coding, agriculture, and science projects that make learning exciting.',
          photo_url: '/images/gallery_4.webp',
          favorite_subject: 'Integrated Science & Pre-Tech',
          future_aspiration: 'Robotics Scientist',
          sort: 2
        },
        {
          name: 'Angel Mwangi',
          grade_or_class: 'Grade 5 Primary',
          school_id: 3,
          school_name: 'Pleasant View Primary School',
          comment: 'I love our swimming gala, music club, and the Christian guidance we get during morning devotions. Pleasant View is the best school!',
          photo_url: '/images/primary_school_1.webp',
          favorite_subject: 'Mathematics & Art',
          future_aspiration: 'Architect',
          sort: 3
        }
      ];
      for (const l of defaultLearners) {
        await db.execute({
          sql: 'INSERT INTO learner_testimonials(name, grade_or_class, school_id, school_name, comment, photo_url, favorite_subject, future_aspiration, sort, is_published) VALUES(?,?,?,?,?,?,?,?,?,1)',
          args: [l.name, l.grade_or_class, l.school_id, l.school_name, l.comment, l.photo_url, l.favorite_subject, l.future_aspiration, l.sort]
        });
      }
    }

    // Seed default calendar events if empty
    const eventCount = (await db.execute('SELECT COUNT(*) as c FROM events')).rows[0];
    if (eventCount && Number(eventCount.c) === 0) {
      const defaultEvents = [
        {
          title: 'Term 1 Parent-Teacher Visiting Sunday (VISO) & Academic Clinics',
          event_date: '2026-11-15',
          event_time: '1:00 PM - 5:00 PM',
          category: 'Term Dates & VISO',
          location: 'Main Campus Dining Pavilion, Githunguri',
          school_id: 0,
          school_name: 'All Campuses',
          description: 'Academic consultations with subject mentors, progress report reviews, and pastoral boarding inspections.',
          is_featured: 1,
          sort: 1
        },
        {
          title: 'Inter-Campus Science Fair & Junior Robotics Expo',
          event_date: '2026-11-22',
          event_time: '9:00 AM - 3:30 PM',
          category: 'STEM & Innovation',
          location: 'Science & Computer Laboratories',
          school_id: 0,
          school_name: 'Senior & Junior Secondary',
          description: 'Hands-on demonstrations of agricultural technology, solar prototypes, and student software coding applications.',
          is_featured: 1,
          sort: 2
        },
        {
          title: 'Annual Inter-House Cross-Country & Track Athletic Meet',
          event_date: '2026-12-05',
          event_time: '8:30 AM - 2:00 PM',
          category: 'Sports & Athletics',
          location: 'Pleasant View Sports Grounds',
          school_id: 0,
          school_name: 'All Campuses',
          description: 'Track & field competitions, relay races, and sportsmanship awards held on our green athletic grounds.',
          is_featured: 1,
          sort: 3
        },
        {
          title: 'Senior School Dedication & Thanksgiving Chapel Service',
          event_date: '2026-12-12',
          event_time: '10:00 AM - 12:30 PM',
          category: 'Spiritual Life',
          location: 'Campus Chapel Hall',
          school_id: 1,
          school_name: 'Pleasant View Senior School',
          description: 'Spiritual blessing service for candidates and thanksgiving for academic and spiritual milestones.',
          is_featured: 1,
          sort: 4
        }
      ];
      for (const ev of defaultEvents) {
        await db.execute({
          sql: 'INSERT INTO events(title, event_date, event_time, category, location, school_id, school_name, description, is_featured, is_active, sort) VALUES(?,?,?,?,?,?,?,?,?,1,?)',
          args: [ev.title, ev.event_date, ev.event_time, ev.category, ev.location, ev.school_id, ev.school_name, ev.description, ev.is_featured, ev.sort]
        });
      }
    }
  } catch (err) {
    console.warn('[DB Init] Comm seeding error:', err.message);
  }

  // Automatic Migration: replace any lingering Pleasantview -> Pleasant View and CBC -> CBE
  try {
    await db.execute({
      sql: `UPDATE schools SET 
        name = REPLACE(REPLACE(name, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        level = REPLACE(REPLACE(level, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        tagline = REPLACE(REPLACE(tagline, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        about = REPLACE(REPLACE(about, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        welcome = REPLACE(REPLACE(welcome, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        admin_name = REPLACE(REPLACE(admin_name, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE')`
    });
    await db.execute({
      sql: `UPDATE hero SET 
        headline = REPLACE(REPLACE(headline, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        sub = REPLACE(REPLACE(sub, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE')`
    });
    await db.execute({
      sql: `UPDATE posts SET 
        title = REPLACE(REPLACE(title, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        body = REPLACE(REPLACE(body, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE')`
    });
    await db.execute({
      sql: `UPDATE glance_metrics SET 
        stat_desc = REPLACE(REPLACE(stat_desc, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE'),
        stat_label = REPLACE(REPLACE(stat_label, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE')`
    });
    await db.execute({
      sql: `UPDATE settings SET v = REPLACE(REPLACE(v, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE') WHERE v LIKE '%Pleasantview%' OR v LIKE '%CBC%'`
    });
    await db.execute({
      sql: `UPDATE admins SET 
        school_name = REPLACE(REPLACE(school_name, 'Pleasantview', 'Pleasant View'), 'CBC', 'CBE') WHERE school_name LIKE '%Pleasantview%' OR school_name LIKE '%CBC%'`
    });
    // Migrate legacy email addresses
    await db.execute({
      sql: `UPDATE admins SET email = 'admin@pleasantviewschools.co.ke' WHERE email IN ('admin@pleasantview.sc.ke', 'admin@pleasantview.co.ke')`
    });
    await db.execute({
      sql: `UPDATE admins SET email = 'senior@pleasantviewschools.co.ke' WHERE email IN ('seniorschool@pleasantview.sc.ke', 'seniorschool@pleasantviewschools.co.ke')`
    });
    await db.execute({
      sql: `UPDATE admins SET email = 'junior@pleasantviewschools.co.ke' WHERE email IN ('jss@pleasantview.sc.ke', 'jss@pleasantviewschools.co.ke')`
    });
    await db.execute({
      sql: `UPDATE admins SET email = 'primary@pleasantviewschools.co.ke' WHERE email IN ('primary@pleasantview.sc.ke', 'primary@pleasantviewschools.co.ke')`
    });
    await db.execute({
      sql: `UPDATE admins SET email = REPLACE(email, '@pleasantview.sc.ke', '@pleasantviewschools.co.ke') WHERE email LIKE '%@pleasantview.sc.ke'`
    });
    await db.execute({
      sql: `UPDATE schools SET email = 'senior@pleasantviewschools.co.ke' WHERE slug = 'pleasantview-senior' AND (email LIKE '%@pleasantview.sc.ke' OR email = 'seniorschool@pleasantview.sc.ke')`
    });
    await db.execute({
      sql: `UPDATE schools SET email = 'junior@pleasantviewschools.co.ke' WHERE slug = 'pleasantview-jss' AND (email LIKE '%@pleasantview.sc.ke' OR email = 'jss@pleasantview.sc.ke')`
    });
    await db.execute({
      sql: `UPDATE schools SET email = 'primary@pleasantviewschools.co.ke' WHERE slug = 'pleasantview-primary' AND (email LIKE '%@pleasantview.sc.ke' OR email = 'primary@pleasantview.sc.ke')`
    });
    await db.execute({
      sql: `UPDATE schools SET email = 'early@pleasantviewschools.co.ke' WHERE slug = 'pleasantview-early-learning' AND (email LIKE '%@pleasantview.sc.ke' OR email = 'earlylearning@pleasantview.sc.ke')`
    });
    // Ensure official email accounts exist in email_accounts
    const coreAccounts = [
      ['admin@pleasantviewschools.co.ke', 'Central Administration Desk', 'Executive Administration', 'SuperAdmin'],
      ['infor@pleasantviewschools.co.ke', 'Information & General Desk', 'General School Information', 'Staff'],
      ['admission@pleasantviewschools.co.ke', 'Admissions & Campus Tours Desk', 'Admissions & Enrollment Registry', 'Staff'],
      ['finance@pleasantviewschools.co.ke', 'Bursar & Accounts Desk', 'Finance & Student Accounts', 'Staff'],
      ['senior@pleasantviewschools.co.ke', 'Senior School Administration', 'Senior Secondary', 'Branch Admin'],
      ['junior@pleasantviewschools.co.ke', 'Junior Secondary Administration', 'Junior Secondary', 'Branch Admin'],
      ['primary@pleasantviewschools.co.ke', 'Primary School Administration', 'Primary School', 'Branch Admin'],
      ['early@pleasantviewschools.co.ke', 'Early Learning Administration', 'Early Childhood', 'Branch Admin']
    ];
    for (const [em, dName, dept, role] of coreAccounts) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO email_accounts(email, display_name, department, role, password, can_login, is_active) VALUES(?,?,?,?, 'pleasantview2026', 1, 1)`,
        args: [em, dName, dept, role]
      });
    }
    await db.execute({
      sql: `DELETE FROM email_accounts WHERE email LIKE '%@pleasantview.sc.ke'`
    });
  } catch (migErr) {
    console.warn('[DB Migration Warning]:', migErr?.message);
  }
} catch (outerErr) {
  console.warn('[DB Init] Fallback mode active:', outerErr.message);
}
})());

export const q = async (sql, args = []) => {
  try {
    await init();
    const res = await db.execute({ sql, args });
    return res?.rows || [];
  } catch (err) {
    console.warn('[DB Query Error]:', err.message);
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
  await init();
  const r = await db.execute({
    sql: 'INSERT INTO images(mime,data) VALUES(?,?)',
    args: [f.type, new Uint8Array(await f.arrayBuffer())]
  });
  return '/img/' + String(r.lastInsertRowid);
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
  await init();
  const r = await db.execute({
    sql: 'INSERT INTO images(mime,data) VALUES(?,?)',
    args: [f.type, new Uint8Array(await f.arrayBuffer())]
  });
  return '/img/' + String(r.lastInsertRowid);
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
