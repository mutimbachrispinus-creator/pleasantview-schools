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

export const CATS = ['Academics', 'Sports', 'Boarding', 'Clubs & Talents', 'Events', 'Facilities'];

export const D = {
  name: 'PLEASANTVIEW SCHOOLS',
  motto: 'Our Aim is Victory',
  founded: '1998 (24+ Years of Excellence)',
  learners: '1,700+',
  boarders: '600+',
  teachers: '100% TSC Certified',
  ratio: '1:20',
  kcpe_mean: '390+',
  phone: '+254 711 689 913',
  email: 'info@pleasantview.sc.ke',
  location: 'Githunguri, Komothai Subcounty, Kiambu County',
  welcome: 'Welcome to Pleasantview Schools, an exceptional Christian-ethos family of day and boarding institutions dedicated to nurturing holistic, confident, and visionary global leaders through Kenya’s Competency Based Curriculum (CBC) and 8.4.4 system.',
  about: 'Pleasant View Schools is a premier Christian-ethos private academic institution based in Githunguri, Komothai Subcounty, Kiambu County. We provide a quality lifelong education process whose aim is to build successful, disciplined, and visionary individuals inside and outside the classroom. Since inception in 1998, our KCPE classes have consistently maintained mean scores exceeding 390/500, ranking proudly among the top 10 schools in Kiambu County. Expanding on this legacy, our Girls’ High School and Junior Secondary School continue to deliver academic brilliance, technological competence, and servant leadership.',
  mission: 'Equip learners with relevant skills and attitudes that will enable them face future challenges.',
  vision: 'Develop and fully exploit the academic potential of learners.',
  values: 'Courage, Integrity, Compassion, Discipline and Academic Excellence.'
};

let ready;
const init = () => (ready ??= (async () => {
  await db.batch([
    'CREATE TABLE IF NOT EXISTS schools(id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, category TEXT DEFAULT "SENIOR SCHOOL", tagline TEXT DEFAULT "", level TEXT DEFAULT "", color TEXT DEFAULT "#05286b", image TEXT DEFAULT "", phone TEXT DEFAULT "", email TEXT DEFAULT "", welcome TEXT DEFAULT "", about TEXT DEFAULT "", mission TEXT DEFAULT "", vision TEXT DEFAULT "", founded TEXT DEFAULT "", learners TEXT DEFAULT "", boarders TEXT DEFAULT "", ratio TEXT DEFAULT "", sort INTEGER DEFAULT 0, admin_key TEXT, admin_email TEXT DEFAULT "", admin_hash TEXT DEFAULT "")',
    'CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, slug TEXT UNIQUE, title TEXT, body TEXT, image TEXT, category TEXT DEFAULT "School News", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS hero(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, image TEXT, headline TEXT, sub TEXT, button_text TEXT DEFAULT "Explore Our Schools", button_link TEXT DEFAULT "/#schools", button_alt_text TEXT DEFAULT "Book a Campus Tour", button_alt_link TEXT DEFAULT "/contact#visit", sort INTEGER DEFAULT 0)',
    'CREATE TABLE IF NOT EXISTS photos(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, category TEXT, image TEXT, caption TEXT)',
    'CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY, mime TEXT, data BLOB)',
    'CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT)',
    'CREATE TABLE IF NOT EXISTS visits(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, visit_date TEXT, guests INTEGER, created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS enquiries(id INTEGER PRIMARY KEY, school_id INTEGER DEFAULT 0, name TEXT, phone TEXT, email TEXT, message TEXT, created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS inbound_sms(id INTEGER PRIMARY KEY, sender TEXT, receiver TEXT, text TEXT, raw_id TEXT DEFAULT "", status TEXT DEFAULT "received", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS inbound_emails(id INTEGER PRIMARY KEY, sender_name TEXT, sender_email TEXT, recipient TEXT, subject TEXT, body TEXT, html TEXT DEFAULT "", status TEXT DEFAULT "received", created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS comm_logs(id INTEGER PRIMARY KEY, type TEXT, direction TEXT, sender TEXT, recipient TEXT, subject TEXT DEFAULT "", content TEXT, status TEXT, created TEXT DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS email_accounts(id INTEGER PRIMARY KEY, email TEXT UNIQUE, display_name TEXT, department TEXT, password TEXT DEFAULT "pleasantview2026", forward_to TEXT DEFAULT "", auto_reply TEXT DEFAULT "", can_login INTEGER DEFAULT 1, role TEXT DEFAULT "Staff", is_active INTEGER DEFAULT 1, created TEXT DEFAULT CURRENT_TIMESTAMP)'
  ]);

  for (const c of [
    'admin_key TEXT',
    'admin_email TEXT DEFAULT ""',
    'admin_hash TEXT DEFAULT ""',
    'category TEXT DEFAULT "SENIOR SCHOOL"',
    'image TEXT DEFAULT ""',
    'category TEXT DEFAULT "School News"'
  ]) {
    try { await db.execute('ALTER TABLE schools ADD COLUMN ' + c); } catch {}
    try { await db.execute('ALTER TABLE posts ADD COLUMN ' + c); } catch {}
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

  // Seed default schools if table is empty
  const countRow = (await db.execute('SELECT COUNT(*) as c FROM schools')).rows[0];
  if (countRow && Number(countRow.c) === 0) {
    const defaultSchools = [
      {
        slug: 'pleasantview-senior',
        name: 'Pleasantview Senior School',
        category: 'SENIOR SCHOOL',
        level: 'Grades 10 – 12 (Form 1 – 4)',
        tagline: 'Pathways to a purposeful future',
        color: '#05286b',
        image: '/images/girls_high_school3.webp',
        phone: '+254 711 689 913',
        email: 'seniorschool@pleasantview.sc.ke',
        welcome: 'Welcome to Pleasantview Senior School. Fostering university readiness, scientific research, and ethical leadership.',
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
        name: 'Pleasantview Junior Secondary',
        category: 'JUNIOR SECONDARY (JSS)',
        level: 'Grades 7 – 9',
        tagline: 'Discovering talents and academic pathways',
        color: '#335390',
        image: '/images/banner_1_a.webp',
        phone: '+254 711 689 913',
        email: 'jss@pleasantview.sc.ke',
        welcome: 'Welcome to Pleasantview Junior Secondary School. Discovering talents, character, and innovative learning pathways.',
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
        name: 'Pleasantview Primary School',
        category: 'PRIMARY SCHOOL',
        level: 'Grades 1 – 6 (CBC)',
        tagline: 'Building solid foundations in knowledge and character',
        color: '#0b5d3b',
        image: '/images/primary_school_1.webp',
        phone: '+254 711 689 913',
        email: 'primary@pleasantview.sc.ke',
        welcome: 'Welcome to Pleasantview Primary School, the historic flagship campus of academic distinction.',
        about: 'First stage of formal education that offers sound mastery in reading, writing, mathematics, science, and the arts. Our KCPE classes have historically maintained an extraordinary mean score exceeding 390/500, ranking consistently among the top 10 schools in Kiambu County.',
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
        name: 'Pleasantview Early Learning Centre',
        category: 'EARLY LEARNING',
        level: 'Playgroup, PP1 & PP2 (Crèche)',
        tagline: 'Where learning begins with joy and wonder',
        color: '#7c98b3',
        image: '/images/early_learning_1.webp',
        phone: '+254 711 689 913',
        email: 'earlylearning@pleasantview.sc.ke',
        welcome: 'Welcome to Pleasantview Early Learning Centre. Where curious young minds blossom with joy.',
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
      args: ['/images/banner_1_a.webp', 'PLEASANTVIEW SCHOOLS', 'Competent · Confident · Compassionate — Our Aim is Victory', 'Explore Our Schools', '/#schools', 'Book a Campus Tour', '/contact#visit']
    });
    await db.execute({
      sql: 'INSERT INTO hero(school_id, image, headline, sub, button_text, button_link, button_alt_text, button_alt_link, sort) VALUES(0, ?, ?, ?, ?, ?, ?, ?, 2)',
      args: ['/images/banner_2_a.webp', '24 YEARS OF ACADEMIC EXCELLENCE', 'Consistently exceeding 390/500 KCPE mean scores and B+ KCSE performance', 'Our Academics', '/about#academics', 'Admissions Desk', '/contact']
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
        'Pleasantview Schools congratulates our senior and primary scholars for continuing our 24-year tradition of scholastic excellence, recording top ranks nationally with over 90% university qualification.',
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
  } catch (err) {
    console.warn('[DB Init] Comm seeding error:', err.message);
  }
})());

export const q = async (sql, args = []) => {
  await init();
  return (await db.execute({ sql, args })).rows;
};

export const S = async () => ({
  ...D,
  ...Object.fromEntries((await q('SELECT k,v FROM settings')).map(r => [r.k, r.v]))
});

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
    name: 'Pleasantview Senior School',
    category: 'SENIOR SCHOOL',
    level: 'Grades 10 – 12 (Form 1 – 4)',
    tagline: 'Pathways to a purposeful future',
    color: '#05286b',
    image: '/images/girls_high_school3.webp',
    phone: '+254 711 689 913',
    email: 'seniorschool@pleasantview.sc.ke',
    welcome: 'Welcome to Pleasantview Senior School. Fostering university readiness, scientific research, and ethical leadership.',
    about: 'Solidifying values and attitudes formed at primary school alongside advanced knowledge and skills acquisition. Our Senior School offers STEM, Social Sciences, and Arts & Sports Science pathways with a sterling record of achieving top university entry grades (mean grade B+ in KCSE).',
    mission: 'To prepare future-ready leaders equipped with academic distinction, technical problem-solving acumen, and sound ethical character.',
    vision: 'A premier national benchmark in holistic senior secondary excellence.',
    founded: '2016',
    learners: '450 Students',
    boarders: '450 Boarders',
    ratio: '1:15',
    sort: 1
  },
  {
    id: 2,
    slug: 'pleasantview-jss',
    name: 'Pleasantview Junior Secondary',
    category: 'JUNIOR SECONDARY (JSS)',
    level: 'Grades 7 – 9',
    tagline: 'Discovering talents and academic pathways',
    color: '#335390',
    image: '/images/banner_1_a.webp',
    phone: '+254 711 689 913',
    email: 'jss@pleasantview.sc.ke',
    welcome: 'Welcome to Pleasantview Junior Secondary School. Discovering talents, character, and innovative learning pathways.',
    about: 'Pioneering Kenya’s Competency Based Curriculum (CBC) with state-of-the-art Pre-Technical, Integrated Science, Computer Science, and Agriculture laboratories, preparing learners seamlessly for senior pathways and national KJSEA assessments.',
    mission: 'To ignite inquiry, technological literacy, and moral courage during the formative adolescent years.',
    vision: 'A hub of innovative discovery and talent cultivation.',
    founded: '2023',
    learners: '500 Students',
    boarders: '200 Boarders',
    ratio: '1:20',
    sort: 2
  },
  {
    id: 3,
    slug: 'pleasantview-primary',
    name: 'Pleasantview Primary School',
    category: 'PRIMARY SCHOOL',
    level: 'Grades 1 – 6',
    tagline: 'Holistic foundational excellence since 1998',
    color: '#0a1e43',
    image: '/images/primary_school_1.webp',
    phone: '+254 711 689 913',
    email: 'primary@pleasantview.sc.ke',
    welcome: 'Welcome to Pleasantview Primary School, nurturing disciplined, confident and all-round high achievers.',
    about: 'Our flagship foundational academy established in 1998. Consistently recognized in Kiambu County with KCPE mean scores above 390/500 and top-tier CBC performance in foundational literacy, numeracy, and digital learning.',
    mission: 'To build a rock-solid scholastic and moral foundation rooted in Christian discipline and intellectual inquiry.',
    vision: 'Excellence in foundational primary learning across East Africa.',
    founded: '1998',
    learners: '600 Pupils',
    boarders: '300 Boarders',
    ratio: '1:22',
    sort: 3
  },
  {
    id: 4,
    slug: 'pleasantview-early-learning',
    name: 'Pleasantview Early Learning Centre',
    category: 'EARLY LEARNING',
    level: 'Playgroup, PP1, PP2',
    tagline: 'Where bright scholastic journeys begin',
    color: '#e0a82e',
    image: '/images/early_learning_1.webp',
    phone: '+254 711 689 913',
    email: 'earlylearning@pleasantview.sc.ke',
    welcome: 'Welcome to Pleasantview Early Learning Centre. A warm, joyful, and creative early childhood haven.',
    about: 'Play-based and Montessori-inspired experiential early learning that nurtures curiosity, motor development, phonics, socialization, and foundational faith in a safe, vibrant setting.',
    mission: 'To foster early wonder, joyful expression, and foundational competence in every child.',
    vision: 'The happiest, most stimulating beginning for young minds.',
    founded: '2005',
    learners: '250 Children',
    boarders: 'Day School Only',
    ratio: '1:12',
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
  'welcome', 'about', 'mission', 'vision', 'founded', 'learners', 'boarders', 'ratio'
];

export const stats = o => [
  ['Learners', o.learners],
  ['Boarders', o.boarders],
  ['Teachers', o.teachers],
  ['Ratio', o.ratio],
  ['KCPE Mean', o.kcpe_mean],
  ['Founded', o.founded]
].filter(x => x[1]);
