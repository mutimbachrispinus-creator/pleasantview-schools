'use server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { q, saveImg, D, CATS, SF } from '@/lib/db';
import { getAdmin, eq, checkPw, hashPw, startSession, endSession, limited } from '@/lib/auth';
import { sendEmail, sendSMS } from '@/lib/notify';

const A = async () => {
  const a = await getAdmin();
  if (!a) throw new Error('Unauthorized');
  return a.scope;
};
const C = async () => {
  if (await A()) throw new Error('Central admin only');
};
const done = () => revalidatePath('/', 'layout');
const sid = (fd, sc) => sc || +fd.get('school_id') || 0;
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const newKey = () => crypto.randomBytes(8).toString('hex');

export async function login(fd) {
  if (limited('a' + ((await headers()).get('x-forwarded-for') || 'x'))) return;
  const key = fd.get('key') || '',
    em = String(fd.get('email') || '').trim().toLowerCase(),
    pw = String(fd.get('password') || '').trim();
  if (!key) {
    const masterEmail = (process.env.ADMIN_EMAIL || 'admin@pleasantview.sc.ke').trim().toLowerCase();
    const masterPassword = (process.env.ADMIN_PASSWORD || 'pleasantview2026').trim();
    const isMaster = em === 'admin' || em === masterEmail || em.startsWith('admin@');
    if (isMaster && (pw === masterPassword || eq(pw, masterPassword))) {
      await startSession(0);
    } else {
      // Dynamic admin accounts from admins table
      const [adm] = await q('SELECT * FROM admins WHERE lower(email)=? AND is_active=1', [em]);
      if (adm && adm.password && (pw === adm.password.trim() || eq(pw, adm.password.trim()))) {
        await startSession(adm.school_id || 0);
      } else {
        // Dynamic departmental email accounts (support@, info@, etc.)
        const [acc] = await q('SELECT * FROM email_accounts WHERE lower(email)=? AND is_active=1 AND can_login=1', [em]);
        if (acc && acc.password && (pw === acc.password.trim() || eq(pw, acc.password.trim()))) {
          await startSession(0);
        }
      }
    }
  } else {
    const [s] = await q('SELECT * FROM schools WHERE admin_key=?', [key]);
    if (s && s.admin_email && eq(em, s.admin_email) && checkPw(pw, s.admin_hash)) {
      await startSession(s.id);
    }
  }
  done();
}

export async function logout() {
  await endSession();
  done();
}

export async function addSchool(fd) {
  await C();
  const name = String(fd.get('name') || '').trim();
  if (!name) return;
  const cat = String(fd.get('category') || 'SENIOR SCHOOL').trim().toUpperCase();
  const img = (await saveImg(fd.get('image'))) || '/images/banner_2_a.webp';

  await q(
    'INSERT OR IGNORE INTO schools(slug,name,category,tagline,level,color,image,learners,boarders,ratio,phone,email,admin_key) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
      slugify(name),
      name,
      cat,
      fd.get('tagline') || '',
      fd.get('level') || '',
      fd.get('color') || '#8B1E2D',
      img,
      fd.get('learners') || '450 Students',
      fd.get('boarders') || '200 Boarders',
      fd.get('ratio') || '1:20',
      fd.get('phone') || '',
      fd.get('email') || '',
      newKey()
    ]
  );
  done();
}

export async function setSchoolAdmin(fd) {
  await C();
  const pw = String(fd.get('password') || ''),
    h = pw ? hashPw(pw) : '';
  await q(
    "UPDATE schools SET admin_email=?, admin_hash=CASE WHEN ?='' THEN admin_hash ELSE ? END, admin_key=COALESCE(admin_key,?) WHERE id=?",
    [fd.get('admin_email') || '', h, h, newKey(), fd.get('school_id')]
  );
  done();
}

export async function saveSchool(fd) {
  const sc = await A(),
    id = sc || +fd.get('school_id') || 0;
  if (!id) {
    for (const k of Object.keys(D)) {
      if (fd.get(k) != null) {
        await q(
          'INSERT INTO settings(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v',
          [k, fd.get(k)]
        );
      }
    }
  } else {
    const uploadedImg = await saveImg(fd.get('image_file'));
    const imgUrl = String(fd.get('image_url') || '').trim();
    if (uploadedImg || imgUrl) {
      await q('UPDATE schools SET image=? WHERE id=?', [uploadedImg || imgUrl, id]);
    }
    for (const k of SF) {
      if (k !== 'image' && fd.get(k) != null) {
        await q(`UPDATE schools SET ${k}=? WHERE id=?`, [fd.get(k), id]);
      }
    }
  }
  done();
}

export async function addVideo(fd) {
  await A();
  const title = String(fd.get('title') || '').trim();
  const youtubeUrl = String(fd.get('youtube_url') || '').trim();
  const category = String(fd.get('category') || 'Campus Tour').trim();
  const description = String(fd.get('description') || '').trim();
  const uploadedThumb = await saveImg(fd.get('thumbnail_file'));
  const thumbUrl = String(fd.get('thumbnail_url') || '').trim();
  const thumbnail = uploadedThumb || thumbUrl || '/images/hero_science_lab.jpg';
  const schoolId = Number(fd.get('school_id')) || 0;
  const featured = fd.get('featured') === '0' ? 0 : 1;
  const sort = Number(fd.get('sort')) || 0;

  if (!title || !youtubeUrl) return;

  await q(
    'INSERT INTO videos(school_id, title, youtube_url, category, description, thumbnail, featured, sort) VALUES(?,?,?,?,?,?,?,?)',
    [schoolId, title, youtubeUrl, category, description, thumbnail, featured, sort]
  );
  done();
}

export async function delVideo(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM videos WHERE id=?', [id]);
  }
  done();
}

export async function addJob(fd) {
  await A();
  const title = String(fd.get('title') || '').trim();
  const department = String(fd.get('department') || 'Academic').trim();
  const category = String(fd.get('category') || 'Teaching').trim();
  const contractType = String(fd.get('contract_type') || 'Full-Time').trim();
  const location = String(fd.get('location') || 'Githunguri, Kiambu').trim();
  const description = String(fd.get('description') || '').trim();
  const requirements = String(fd.get('requirements') || '').trim();
  const deadline = String(fd.get('deadline') || '').trim();
  const schoolId = Number(fd.get('school_id')) || 0;

  if (!title) return;

  await q(
    'INSERT INTO jobs(school_id, title, department, category, contract_type, location, description, requirements, deadline, status) VALUES(?,?,?,?,?,?,?,?,?,"open")',
    [schoolId, title, department, category, contractType, location, description, requirements, deadline]
  );
  done();
}

export async function toggleJobStatus(fd) {
  await A();
  const id = Number(fd.get('id'));
  const newStatus = String(fd.get('status') || 'open');
  if (id) {
    await q('UPDATE jobs SET status=? WHERE id=?', [newStatus, id]);
  }
  done();
}

export async function delJob(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM jobs WHERE id=?', [id]);
  }
  done();
}

export async function updateApplicationStatus(fd) {
  await A();
  const id = Number(fd.get('id'));
  const status = String(fd.get('status') || 'reviewed');
  if (id) {
    await q('UPDATE job_applications SET status=? WHERE id=?', [status, id]);
  }
  done();
}

export async function delApplication(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM job_applications WHERE id=?', [id]);
  }
  done();
}

export async function updateVisitStatus(fd) {
  await A();
  const id = Number(fd.get('id'));
  const status = String(fd.get('status') || 'confirmed');
  if (id) {
    await q('UPDATE visits SET status=? WHERE id=?', [status, id]);
  }
  done();
}

export async function delVisit(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM visits WHERE id=?', [id]);
  }
  done();
}

export async function updateEnquiryStatus(fd) {
  await A();
  const id = Number(fd.get('id'));
  const status = String(fd.get('status') || 'replied');
  if (id) {
    await q('UPDATE enquiries SET status=? WHERE id=?', [status, id]);
  }
  done();
}

export async function addLeadershipMessage(fd) {
  await A();
  const role = String(fd.get('role') || 'Director').trim();
  const name = String(fd.get('name') || '').trim();
  const title = String(fd.get('title') || '').trim();
  const quote = String(fd.get('quote') || '').trim();
  const message = String(fd.get('message') || '').trim();
  const uploadedImg = await saveImg(fd.get('image_file'));
  const imgUrl = String(fd.get('image_url') || '').trim();
  const image = uploadedImg || imgUrl || '/images/banner_3_a.webp';
  const schoolId = Number(fd.get('school_id')) || 0;
  const sort = Number(fd.get('sort')) || 0;

  if (!name || !message) return;

  await q(
    'INSERT INTO leadership_messages(school_id, role, name, title, quote, message, image, sort, is_active) VALUES(?,?,?,?,?,?,?,?,1)',
    [schoolId, role, name, title, quote, message, image, sort]
  );
  done();
}

export async function delLeadershipMessage(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM leadership_messages WHERE id=?', [id]);
  }
  done();
}

export async function delEnquiry(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM enquiries WHERE id=?', [id]);
  }
  done();
}

export async function addPost(fd) {
  const sc = await A(),
    img = (await saveImg(fd.get('image'))) || '/images/banner_2_a.webp',
    t = String(fd.get('title'));
  const cat = fd.get('category') || 'School News';
  await q(
    'INSERT INTO posts(school_id,slug,title,body,image,category) VALUES(?,?,?,?,?,?)',
    [sid(fd, sc), slugify(t) + '-' + Date.now().toString(36), t, fd.get('body'), img, cat]
  );
  done();
}

export async function addHero(fd) {
  const sc = await A();
  const uploaded = await saveImg(fd.get('image'));
  const chosenUrl = String(fd.get('imageUrl') || '').trim();
  const img = uploaded || chosenUrl || '/images/banner_1_a.webp';

  const headline = String(fd.get('headline') || 'PLEASANTVIEW SCHOOLS').trim();
  const sub = String(fd.get('sub') || 'Competent · Confident · Compassionate').trim();
  const bText = String(fd.get('button_text') || 'Explore Our Schools').trim();
  const bLink = String(fd.get('button_link') || '/#schools').trim();
  const bAltText = String(fd.get('button_alt_text') || 'Book a Campus Tour').trim();
  const bAltLink = String(fd.get('button_alt_link') || '/contact#visit').trim();
  const sort = Number(fd.get('sort')) || 0;

  await q(
    'INSERT INTO hero(school_id, image, headline, sub, button_text, button_link, button_alt_text, button_alt_link, sort) VALUES(?,?,?,?,?,?,?,?,?)',
    [sid(fd, sc), img, headline, sub, bText, bLink, bAltText, bAltLink, sort]
  );
  done();
}

export async function updateHero(fd) {
  const sc = await A();
  const id = Number(fd.get('id'));
  if (!id) return;

  const uploaded = await saveImg(fd.get('image'));
  const chosenUrl = String(fd.get('imageUrl') || '').trim();
  const headline = String(fd.get('headline') || '').trim();
  const sub = String(fd.get('sub') || '').trim();
  const bText = String(fd.get('button_text') || 'Explore Our Schools').trim();
  const bLink = String(fd.get('button_link') || '/#schools').trim();
  const bAltText = String(fd.get('button_alt_text') || 'Book a Campus Tour').trim();
  const bAltLink = String(fd.get('button_alt_link') || '/contact#visit').trim();
  const sort = Number(fd.get('sort')) || 0;

  if (uploaded || chosenUrl) {
    const img = uploaded || chosenUrl;
    await q(
      'UPDATE hero SET image=?, headline=?, sub=?, button_text=?, button_link=?, button_alt_text=?, button_alt_link=?, sort=? WHERE id=?' + (sc ? ' AND school_id=?' : ''),
      sc ? [img, headline, sub, bText, bLink, bAltText, bAltLink, sort, id, sc] : [img, headline, sub, bText, bLink, bAltText, bAltLink, sort, id]
    );
  } else {
    await q(
      'UPDATE hero SET headline=?, sub=?, button_text=?, button_link=?, button_alt_text=?, button_alt_link=?, sort=? WHERE id=?' + (sc ? ' AND school_id=?' : ''),
      sc ? [headline, sub, bText, bLink, bAltText, bAltLink, sort, id, sc] : [headline, sub, bText, bLink, bAltText, bAltLink, sort, id]
    );
  }
  done();
}

export async function addPhotos(fd) {
  const sc = await A(),
    cat = CATS.includes(fd.get('category')) ? fd.get('category') : CATS[0];
  for (const f of fd.getAll('image')) {
    const img = await saveImg(f);
    if (img) {
      await q(
        'INSERT INTO photos(school_id,category,image,caption) VALUES(?,?,?,?)',
        [sid(fd, sc), cat, img, fd.get('caption') || '']
      );
    }
  }
  done();
}

export async function del(fd) {
  const sc = await A(),
    t = fd.get('t');
  if (t === 'schools') {
    if (sc) throw new Error('Central admin only');
    await q('DELETE FROM schools WHERE id=?', [fd.get('id')]);
  } else if (['posts', 'hero', 'photos'].includes(t)) {
    await q(
      `DELETE FROM ${t} WHERE id=?` + (sc ? ' AND school_id=?' : ''),
      sc ? [fd.get('id'), sc] : [fd.get('id')]
    );
  }
  done();
}

export async function testResend(fd) {
  await A();
  const to = String(fd.get('email') || process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke');
  const res = await sendEmail({
    to,
    subject: 'Pleasant View Schools Resend Gateway Verification',
    text: 'This is a test verification email from Pleasant View Schools via Resend. The gateway route is operational.'
  });
  done();
  return res;
}

export async function testAfricasTalking(fd) {
  await A();
  const phone = String(fd.get('phone') || process.env.SCHOOL_PHONE || '+254711689913');
  const res = await sendSMS({
    to: phone,
    message: 'Pleasant View Schools: Africa\'s Talking gateway verification message. Service operational.'
  });
  done();
  return res;
}

export async function replySMS(fd) {
  await A();
  const to = String(fd.get('to') || '').trim();
  const msg = String(fd.get('message') || '').trim();
  const smsId = Number(fd.get('sms_id'));
  if (!to || !msg) return;

  await sendSMS({ to, message: msg });
  if (smsId) {
    await q('UPDATE inbound_sms SET status="replied" WHERE id=?', [smsId]);
  }
  done();
}

export async function replyEmail(fd) {
  await A();
  const to = String(fd.get('to') || '').trim();
  const fromAccount = String(fd.get('from_account') || '').trim();
  const subject = String(fd.get('subject') || 'Re: Pleasant View Schools Admissions').trim();
  const msg = String(fd.get('message') || '').trim();
  const emailId = Number(fd.get('email_id'));
  if (!to || !msg) return;

  await sendEmail({
    to,
    subject,
    text: msg,
    ...(fromAccount ? { from: `Pleasant View Schools <${fromAccount}>` } : {})
  });
  if (emailId) {
    await q('UPDATE inbound_emails SET status="replied" WHERE id=?', [emailId]);
  }
  done();
}

export async function addEmailAccount(fd) {
  await C();
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const displayName = String(fd.get('display_name') || '').trim();
  const department = String(fd.get('department') || 'General Desk').trim();
  const role = String(fd.get('role') || 'Staff').trim();
  const password = String(fd.get('password') || 'pleasantview2026').trim();
  const forwardTo = String(fd.get('forward_to') || '').trim();
  const autoReply = String(fd.get('auto_reply') || '').trim();
  const canLogin = fd.get('can_login') === '0' ? 0 : 1;

  if (!email || !email.includes('@')) return;

  await q(
    'INSERT INTO email_accounts(email, display_name, department, role, password, forward_to, auto_reply, can_login, is_active) VALUES(?,?,?,?,?,?,?,?,1)',
    [email, displayName || email, department, role, password, forwardTo, autoReply, canLogin]
  );
  done();
}

export async function updateEmailAccount(fd) {
  await C();
  const id = Number(fd.get('id'));
  if (!id) return;
  const displayName = String(fd.get('display_name') || '').trim();
  const department = String(fd.get('department') || '').trim();
  const role = String(fd.get('role') || 'Staff').trim();
  const password = String(fd.get('password') || '').trim();
  const forwardTo = String(fd.get('forward_to') || '').trim();
  const autoReply = String(fd.get('auto_reply') || '').trim();
  const canLogin = fd.get('can_login') === '0' ? 0 : 1;
  const isActive = fd.get('is_active') === '0' ? 0 : 1;

  if (password) {
    await q(
      'UPDATE email_accounts SET display_name=?, department=?, role=?, password=?, forward_to=?, auto_reply=?, can_login=?, is_active=? WHERE id=?',
      [displayName, department, role, password, forwardTo, autoReply, canLogin, isActive, id]
    );
  } else {
    await q(
      'UPDATE email_accounts SET display_name=?, department=?, role=?, forward_to=?, auto_reply=?, can_login=?, is_active=? WHERE id=?',
      [displayName, department, role, forwardTo, autoReply, canLogin, isActive, id]
    );
  }
  done();
}

export async function delEmailAccount(fd) {
  await C();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM email_accounts WHERE id=?', [id]);
  }
  done();
}

export async function simulateInboundSMS(fd) {
  await C();
  const sender = String(fd.get('sender') || '+254722000000').trim();
  const text = String(fd.get('text') || 'Simulated inquiry from parent via SMS').trim();
  const receiver = process.env.SCHOOL_PHONE || '+254711689913';

  await q('INSERT INTO inbound_sms(sender, receiver, text, status) VALUES(?,?,?,?)', [
    sender,
    receiver,
    text,
    'received'
  ]);
  await q('INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)', [
    'sms',
    'inbound',
    sender,
    receiver,
    text,
    'received'
  ]);
  done();
}

export async function simulateInboundEmail(fd) {
  await C();
  const name = String(fd.get('name') || 'Prospective Parent').trim();
  const email = String(fd.get('email') || 'parent@example.com').trim();
  const subject = String(fd.get('subject') || 'Admission Inquiry').trim();
  const body = String(fd.get('body') || 'Hello Admissions, I would like to inquire about admission requirements.').trim();
  const recipient = String(fd.get('recipient') || process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke').trim();

  await q('INSERT INTO inbound_emails(sender_name, sender_email, recipient, subject, body, status) VALUES(?,?,?,?,?,?)', [
    name,
    email,
    recipient,
    subject,
    body,
    'received'
  ]);
  await q('INSERT INTO comm_logs(type, direction, sender, recipient, subject, content, status) VALUES(?,?,?,?,?,?,?)', [
    'email',
    'inbound',
    email,
    recipient,
    subject,
    body,
    'received'
  ]);
  done();
}

export async function delInbound(fd) {
  await C();
  const t = String(fd.get('t') || '');
  const id = Number(fd.get('id'));
  if (['inbound_sms', 'inbound_emails', 'comm_logs'].includes(t) && id) {
    await q(`DELETE FROM ${t} WHERE id=?`, [id]);
  }
  done();
}

export async function addQuickLink(fd) {
  await A();
  const title = String(fd.get('title') || '').trim();
  const url = String(fd.get('url') || '').trim();
  const category = String(fd.get('category') || 'General').trim();
  const description = String(fd.get('description') || '').trim();
  const sort = Number(fd.get('sort')) || 0;

  if (!title || !url) return;

  await q(
    'INSERT INTO quick_links(title, url, category, description, sort, is_active) VALUES(?,?,?,?,?,1)',
    [title, url, category, description, sort]
  );
  done();
}

export async function delQuickLink(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM quick_links WHERE id=?', [id]);
  }
  done();
}

export async function toggleQuickLink(fd) {
  await A();
  const id = Number(fd.get('id'));
  const isActive = Number(fd.get('is_active')) === 1 ? 1 : 0;
  if (id) {
    await q('UPDATE quick_links SET is_active=? WHERE id=?', [isActive, id]);
  }
  done();
}

export async function createAdminAccount(fd) {
  await C();
  const name = String(fd.get('name') || '').trim();
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const password = String(fd.get('password') || 'pleasantview2026').trim();
  const role = String(fd.get('role') || 'Super Administrator').trim();
  const schoolId = Number(fd.get('school_id')) || 0;
  const schoolName = String(fd.get('school_name') || 'All Campuses').trim();
  const phone = String(fd.get('phone') || '').trim();

  if (!name || !email || !password) return;

  await q(
    'INSERT INTO admins(name, email, password, role, school_id, school_name, phone, is_active) VALUES(?,?,?,?,?,?,?,1)',
    [name, email, password, role, schoolId, schoolName, phone]
  );
  done();
}

export async function deleteAdminAccount(fd) {
  await C();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM admins WHERE id=?', [id]);
  }
  done();
}

export async function saveGlanceMetrics(fd) {
  await A();
  for (let i = 1; i <= 6; i++) {
    const val = String(fd.get(`metric_${i}_val`) || '').trim();
    const label = String(fd.get(`metric_${i}_label`) || '').trim();
    const desc = String(fd.get(`metric_${i}_desc`) || '').trim();
    const id = Number(fd.get(`metric_${i}_id`)) || i;

    if (val && label) {
      await q(
        'INSERT INTO glance_metrics(id, stat_value, stat_label, stat_desc, sort) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET stat_value=excluded.stat_value, stat_label=excluded.stat_label, stat_desc=excluded.stat_desc',
        [id, val, label, desc, i]
      );
    }
  }
  done();
}

export async function addSchoolLifePhoto(fd) {
  await A();
  const sc = await A();
  const category = String(fd.get('category') || 'Academic & STEM').trim();
  const title = String(fd.get('title') || '').trim();
  const caption = String(fd.get('caption') || '').trim();
  const uploaded = await saveImg(fd.get('image_file'));
  const chosenUrl = String(fd.get('image_url') || '').trim();
  const image = uploaded || chosenUrl;
  const schoolId = sid(fd, sc);

  if (!image) return;

  await q(
    'INSERT INTO photos(school_id, category, image, title, caption) VALUES(?,?,?,?,?)',
    [schoolId, category, image, title, caption]
  );
  done();
}

export async function delPhoto(fd) {
  await A();
  const id = Number(fd.get('id'));
  if (id) {
    await q('DELETE FROM photos WHERE id=?', [id]);
  }
  done();
}

export async function saveAdminSmsSettings(fd) {
  await C();
  const numbers = String(fd.get('admin_sms_phone') || '+254 711 689 913').trim();
  await q(
    'INSERT INTO settings(k, v) VALUES(?, ?) ON CONFLICT(k) DO UPDATE SET v=excluded.v',
    ['admin_sms_phone', numbers]
  );
  done();
}
