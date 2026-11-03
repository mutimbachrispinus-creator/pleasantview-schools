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
      subtext: 'Senior School CBC Final Pathway Assessment',
      isTransitioning: false
    };
  }
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
  email: 'info@pleasantview.sc.ke',
  location: 'Githunguri, Komothai Subcounty, Kiambu County',
  welcome: 'Welcome to Pleasantview Schools, an exceptional Christian-ethos family of day and boarding institutions dedicated to nurturing holistic, confident, and visionary global leaders through Kenya’s Competency Based Curriculum (CBC).',
  about: 'Founded in 1998, Pleasantview Schools has grown from a visionary primary academy into a nationally acclaimed multi-campus group of schools in Githunguri, Kiambu County. Across our academic journey, Pleasantview has consistently maintained distinguished performance with an average of EE (Exceeding Expectations) in KPSEA and ME1 in KJSEA, positioning us permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic mean grade of B+ in their maiden KCSE examinations and dynamically transitions into the Kenya Senior School Education Assessment (KSSEA). Pioneering Kenya\'s Competency Based Curriculum (CBC / CBE), our campuses feature state-of-the-art Pre-Technical, Integrated Science, and Digital STEM hubs designed to nurture each child\'s unique pathway.',
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
    'CREATE TABLE IF NOT EXISTS glance_metrics(id INTEGER PRIMARY KEY AUTOINCREMENT, stat_value TEXT NOT NULL, stat_label TEXT NOT NULL, stat_desc TEXT NOT NULL, sort INTEGER DEFAULT 0)'
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
      sql: 'UPDATE hero SET sub=? WHERE sub LIKE "%KCPE%"',
      args: ['Outstanding KPSEA (EE — Exceeding Expectations) and KJSEA (ME1) distinction, with maiden KCSE B+ university transition']
    });
    await db.execute({
      sql: 'UPDATE hero SET headline=? WHERE headline="PLEASANTVIEW" OR headline="PLEASANTVIEW SCHOOLS"',
      args: ['PLEASANT VIEW SCHOOLS']
    });
    for (const [k, v] of [
      ['name', 'PLEASANT VIEW SCHOOLS'],
      ['motto', 'OUR AIM IS VICTORY'],
      ['tagline', 'Our Aim is Victory'],
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
        email: 'seniorschool@pleasantview.sc.ke',
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
        email: 'jss@pleasantview.sc.ke',
        welcome: 'Welcome to Pleasant View Junior Secondary School. Discovering talents, character, and innovative learning pathways.',
        about: 'Pioneering Kenya’s Competency Based Curriculum (CBC) with state-of-the-art Pre-Technical, Integrated Science, Computer Science, and Agriculture laboratories, preparing learners seamlessly for senior pathways and national KJSEA assessments.',
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
        level: 'Grades 1 – 6 (CBC)',
        tagline: 'Building solid foundations in knowledge and character',
        color: '#8B1E2D',
        image: '/images/primary_school_1.webp',
        phone: '+254 711 689 913',
        email: 'primary@pleasantview.sc.ke',
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
        color: '#C59124',
        image: '/images/early_learning_1.webp',
        phone: '+254 711 689 913',
        email: 'earlylearning@pleasantview.sc.ke',
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
        'Fostering practical technical competencies with ultra-modern computer suites, 3D printing, and physics/chemistry research stations under CBC.',
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
          text: 'Good afternoon. I wish to book an interview slot for my daughter joining Form 1 at Pleasantview Senior School.',
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
          recipient: 'info@pleasantview.sc.ke',
          subject: 'Transfer Vacancies: Grade 8 JSS & Form 2 Girls High School',
          body: 'Dear Pleasantview Admissions Office,\n\nWe are relocating our residence from Kisumu to Kiambu County in December and would like to apply for vacancies for our two daughters in Grade 8 JSS and Form 2 respectively. Please share the prospectus, fee details, and upcoming intake evaluation dates.\n\nWarm regards,\nDr. Peter Kamau\n+254 722 345 678',
          status: 'received'
        },
        {
          sender_name: 'Mary Wanjiku',
          sender_email: 'm.wanjiku@gmail.com',
          recipient: 'seniorschool@pleasantview.sc.ke',
          subject: 'Application for STEM & Computer Science Pathway - Form 1 2027',
          body: 'Greetings,\n\nMy daughter scored 402 marks in her school mocks and has a strong interest in robotics, coding, and pure sciences. We understand Pleasantview has recently launched a new high-tech robotics and science hub. Kindly guide us on registration steps and requirements.\n\nThank you,\nMary Wanjiku',
          status: 'received'
        },
        {
          sender_name: 'David Ochieng',
          sender_email: 'dochieng@safari.co.ke',
          recipient: 'primary@pleasantview.sc.ke',
          subject: 'Early Learning PP2 & Grade 1 Intake Inquiry',
          body: 'Dear Admissions Desk,\n\nWe would like to register our son for Grade 1 CBC starting next academic year. Are guided campus tours available this Saturday morning?\n\nSincerely,\nDavid Ochieng',
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
          email: 'admin@pleasantview.sc.ke',
          display_name: 'Central Administrator',
          department: 'Executive Administration',
          role: 'SuperAdmin',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for reaching out to Pleasantview Schools Central Administration. We have logged your request.'
        },
        {
          email: 'info@pleasantview.sc.ke',
          display_name: 'General Inquiries & Admissions Reception',
          department: 'Main School Reception',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Hello! Thank you for contacting Pleasantview Schools. Our admissions and information desk will respond to your inquiry shortly.'
        },
        {
          email: 'support@pleasantview.sc.ke',
          display_name: 'Technical, Portal & Parent Helpdesk',
          department: 'ICT & Parent Support',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasantview Support. A support ticket has been opened for your inquiry.'
        },
        {
          email: 'admissions@pleasantview.sc.ke',
          display_name: 'Admissions Office & Registrar',
          department: 'Enrollment & Academic Registry',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Welcome to Pleasantview Admissions. We are thrilled you are considering our schools for your child.'
        },
        {
          email: 'accounts@pleasantview.sc.ke',
          display_name: 'Bursar & Finance Desk',
          department: 'Finance & Accounts',
          role: 'Staff',
          password: 'pleasantview2026',
          auto_reply: 'Thank you for contacting Pleasantview Accounts. For fee verification, please include your student admission number.'
        },
        {
          email: 'principal@pleasantview.sc.ke',
          display_name: 'Office of the Principal',
          department: 'Academic Leadership',
          role: 'Executive',
          password: 'pleasantview2026',
          auto_reply: 'You have contacted the Office of the Principal, Pleasantview Schools. Your correspondence has been securely received.'
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
        { stat_value: '1:20', stat_label: 'Teacher-Student Ratio', stat_desc: 'Personalized CBC Competency Coaching', sort: 4 },
        { stat_value: '600+', stat_label: 'Boarding Scholars', stat_desc: 'Loving Pastoral Care from Grade 4+', sort: 5 },
        { stat_value: '100%', stat_label: 'TSC Certified Faculty', stat_desc: 'Trained CBC Facilitators & Mentors', sort: 6 }
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
          email: 'admin@pleasantview.sc.ke',
          password: 'pleasantview2026',
          role: 'Super Administrator',
          school_id: 0,
          school_name: 'All Campuses',
          phone: '+254 711 689 913'
        },
        {
          name: 'Senior School Principal',
          email: 'seniorschool@pleasantview.sc.ke',
          password: 'pleasantview2026',
          role: 'Branch Administrator',
          school_id: 1,
          school_name: 'Pleasant View Senior School',
          phone: '+254 711 689 913'
        },
        {
          name: 'JSS Academic Head',
          email: 'jss@pleasantview.sc.ke',
          password: 'pleasantview2026',
          role: 'Branch Administrator',
          school_id: 2,
          school_name: 'Pleasant View Junior Secondary',
          phone: '+254 711 689 913'
        },
        {
          name: 'Primary School Headteacher',
          email: 'primary@pleasantview.sc.ke',
          password: 'pleasantview2026',
          role: 'Branch Administrator',
          school_id: 3,
          school_name: 'Pleasant View Primary School',
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
        { category: 'Academic & STEM', image: '/images/hero_science_lab.jpg', title: 'Modern Integrated Science & Robotics Laboratory', caption: 'Senior and JSS scholars engaged in hands-on practical experiments under CBC' },
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
  } catch (err) {
    console.warn('[DB Init] Comm seeding error:', err.message);
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
    email: 'seniorschool@pleasantview.sc.ke',
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
    email: 'jss@pleasantview.sc.ke',
    welcome: 'Welcome to Pleasant View Junior Secondary School. Discovering talents, character, and innovative learning pathways.',
    about: 'Pioneering Kenya’s Competency Based Curriculum (CBC) with state-of-the-art Pre-Technical, Integrated Science, Computer Science, and Agriculture laboratories, preparing learners seamlessly for senior pathways and national KJSEA assessments.',
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
    level: 'Grades 1 – 6',
    tagline: 'Holistic foundational excellence since 1998',
    color: '#8B1E2D',
    image: '/images/primary_school_1.webp',
    phone: '+254 711 689 913',
    email: 'primary@pleasantview.sc.ke',
    welcome: 'Welcome to Pleasant View Primary School, nurturing disciplined, confident and all-round high achievers.',
    about: 'Our flagship foundational academy established in 1998. Consistently recognized in Kiambu County with KPSEA performance averaging EE (Exceeding Expectations) and top-tier CBC competency mastery in foundational literacy, numeracy, and digital learning.',
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
    color: '#C59124',
    image: '/images/early_learning_1.webp',
    phone: '+254 711 689 913',
    email: 'earlylearning@pleasantview.sc.ke',
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
    { id: 4, stat_value: '1:20', stat_label: 'Teacher-Student Ratio', stat_desc: 'Personalized CBC Competency Coaching', sort: 4 },
    { id: 5, stat_value: '600+', stat_label: 'Boarding Scholars', stat_desc: 'Loving Pastoral Care from Grade 4+', sort: 5 },
    { id: 6, stat_value: '100%', stat_label: 'TSC Certified Faculty', stat_desc: 'Trained CBC Facilitators & Mentors', sort: 6 }
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
    title: 'Pleasantview Schools — Campus Tour & Modern Science Laboratories',
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
    location: 'Pleasantview Senior School, Githunguri',
    description: 'Pleasantview Senior School invites applications from energetic, TSC-registered teachers of Chemistry and Biology or Mathematics. The ideal educator possesses demonstrated experience preparing learners for national examinations and practical STEM laboratory inquiries.',
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
    location: 'Pleasantview JSS, Githunguri',
    description: 'We seek a dynamic educator to facilitate Pre-Technical Studies, Integrated Science, and Computer Science under Kenya\'s Competency Based Curriculum (CBC).',
    requirements: 'Diploma or Degree in Education (Computer Science / STEM), CBC pedagogical certification, proficient in coding or robotics.',
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
    location: 'Pleasantview Transport Fleet, Kiambu',
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
    message: 'Our Junior Secondary School pioneers Kenya\'s Competency Based Curriculum (CBC / CBE). Our learners engage in real-world science investigations, agricultural projects, and pre-technical exploration preparing them for national KJSEA distinction.',
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
  { id: 3, title: 'Policies & Reports', url: '/about#policies', category: 'Governance', description: 'Academic inspection reports, child safeguarding, and student welfare', sort: 3 },
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
