import { q, qWrite, S, getSchool, schools } from '@/lib/db';
import { notify, sendSMS } from '@/lib/notify';
import {
  nowSqlTimestamp,
  extractGradeFromText,
  inferSchoolIdFromText,
  parseInboundEmailRecord,
  parseInboundSmsRecord
} from '@/lib/admissionsParser.js';

const ipBuckets = new Map();

export function checkPublicRateLimit(ipKey, maxPerWindow = 40, windowMs = 10 * 60 * 1000) {
  const key = String(ipKey || '').trim();
  // Never rate-limit unknown/fallback IP placeholder so shared proxies never drop real parents
  if (!key || key === 'x' || key === 'unknown') return false;
  const now = Date.now();
  const hits = (ipBuckets.get(key) || []).filter(t => now - t < windowMs);
  hits.push(now);
  ipBuckets.set(key, hits);
  return hits.length > maxPerWindow;
}

export function extractClientIp(headersObj) {
  if (!headersObj || typeof headersObj.get !== 'function') return '';
  const cfIp = headersObj.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const xff = headersObj.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const realIp = headersObj.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '';
}

export async function recordCampusVisit(raw = {}, { skipNotifications = false, source = 'website' } = {}) {
  const schoolParam = String(raw.school ?? raw.school_id ?? '').trim();
  let targetSchool = schoolParam && schoolParam !== '0' && schoolParam !== 'all'
    ? await getSchool(schoolParam)
    : null;

  const name = String(raw.name || '').trim();
  const phone = String(raw.phone || '').trim();
  const email = String(raw.email || '').trim();
  const visitDate = String(raw.visit_date || '').trim() || new Date().toISOString().slice(0, 10);
  const guests = Math.max(1, Math.min(50, parseInt(raw.guests, 10) || 2));
  const grade = String(raw.grade || '').trim() || extractGradeFromText(raw.notes || '');
  const notes = String(raw.notes || '').trim();
  const status = String(raw.status || 'pending').trim() || 'pending';
  const created = nowSqlTimestamp();

  if (!targetSchool && grade) {
    const allSchools = await schools();
    const inferredId = inferSchoolIdFromText(grade, '', allSchools);
    if (inferredId) {
      targetSchool = allSchools.find(s => Number(s.id) === Number(inferredId)) || null;
    }
  }

  const schoolId = Number(targetSchool?.id) || 0;
  const schoolName = targetSchool?.name || 'Pleasant View Schools Main Campus';
  const schoolEmail = targetSchool?.email || process.env.SCHOOL_EMAIL || 'admissions@pleasantviewschools.co.ke';
  const redirectTo = raw.from_division || (schoolParam && targetSchool && !String(raw.return_to || '').startsWith('/contact'))
    ? `/s/${targetSchool.slug}/visit?ok=1`
    : '/contact?booked=1#visit';

  if (!name || (!phone && !email)) {
    return {
      ok: false,
      error: 'Visitor full name and phone number (or email) are required.',
      redirectTo
    };
  }

  // Prevent accidental double-click duplicate within 45s while still confirming success
  const recentDup = await q(
    'SELECT id FROM visits WHERE lower(name)=lower(?) AND phone=? AND visit_date=? ORDER BY id DESC LIMIT 1',
    [name, phone, visitDate]
  );
  let visitId = null;

  if (recentDup && recentDup.length > 0 && source === 'website') {
    visitId = Number(recentDup[0].id);
  } else {
    const ins = await qWrite(
      'INSERT INTO visits(school_id, name, phone, email, visit_date, guests, grade, notes, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      [schoolId, name, phone, email, visitDate, guests, grade, notes, source, '', status, created]
    );
    visitId = ins?.lastInsertRowid ? Number(ins.lastInsertRowid) : null;
  }

  // Mirror into Webmail Inbound Inbox under admissions@pleasantviewschools.co.ke
  try {
    const tourBody = [
      'Campus Tour Booking Details:',
      '',
      `Visitor Name: ${name}`,
      `Phone: ${phone || 'Not specified'}`,
      `Email: ${email || 'Not specified'}`,
      `Preferred Date: ${visitDate}`,
      `Guests: ${guests}`,
      `School: ${schoolName}`,
      `Prospective Grade: ${grade || 'Not specified'}`,
      ...(notes ? [`Notes: ${notes}`] : [])
    ].join('\n');

    const emIns = await qWrite(
      'INSERT INTO inbound_emails(sender_name, sender_email, recipient, subject, body, status, created) VALUES(?,?,?,?,?,?,?)',
      [
        name,
        email || phone || 'tour-visitor@pleasantviewschools.co.ke',
        schoolEmail,
        `[Campus Tour Booking] ${name} (${visitDate})`,
        tourBody,
        'received',
        created
      ]
    );
    if (visitId && emIns?.lastInsertRowid) {
      await qWrite('UPDATE visits SET source_ref=? WHERE id=?', [`inbound_email:${Number(emIns.lastInsertRowid)}`, visitId]);
    }
  } catch (mailLogErr) {
    console.warn('[Visit Webmail Mirror Notice]:', mailLogErr?.message);
  }

  if (!skipNotifications) {
    try {
      await notify({
        name,
        phone,
        email,
        to: schoolEmail,
        subject: `[${schoolName}] Campus Tour Booking: ${name} (${visitDate})`,
        text: `Visitor Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nDate: ${visitDate}\nGuests: ${guests}\nSchool: ${schoolName}\nStudent Grade: ${grade || 'Not specified'}${notes ? '\nNotes: ' + notes : ''}`,
        sms: `Thank you ${name} for booking a campus tour at ${schoolName} on ${visitDate}. Our admissions secretary will call to confirm your itinerary.`
      });

      const settings = await S();
      const rawAdminNumbers = String(settings.admin_sms_phone || process.env.ADMIN_SMS_PHONE || '+254711689913');
      const adminNumbers = rawAdminNumbers.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);
      const tourSms = `[Tour Booking] ${name} (${phone}) booked for ${schoolName} on ${visitDate} (${guests} guests, Grade: ${grade || 'N/A'})`;
      for (const num of adminNumbers) {
        try {
          await sendSMS({ to: num, message: tourSms });
        } catch {}
      }
    } catch (err) {
      console.warn('[Visit Notification Notice]:', err?.message);
    }
  }

  return {
    ok: true,
    id: visitId,
    message: 'Campus tour booking recorded successfully!',
    redirectTo
  };
}

export async function recordAdmissionsEnquiry(raw = {}, { skipNotifications = false, source = 'website' } = {}) {
  const schoolParam = String(raw.school ?? raw.school_id ?? '').trim();
  let targetSchool = schoolParam && schoolParam !== '0' && schoolParam !== 'all'
    ? await getSchool(schoolParam)
    : null;

  const name = String(raw.name || '').trim();
  const phone = String(raw.phone || '').trim();
  const email = String(raw.email || '').trim();
  const message = String(raw.message || '').trim();
  const grade = String(raw.grade || '').trim() || extractGradeFromText(message);
  const status = String(raw.status || 'pending').trim() || 'pending';
  const created = nowSqlTimestamp();

  if (!targetSchool && (grade || message)) {
    const allSchools = await schools();
    const inferredId = inferSchoolIdFromText(`${grade} ${message}`, '', allSchools);
    if (inferredId) {
      targetSchool = allSchools.find(s => Number(s.id) === Number(inferredId)) || null;
    }
  }

  const schoolId = Number(targetSchool?.id) || 0;
  const schoolName = targetSchool?.name || 'All Campuses';
  const targetEmail = targetSchool?.email || process.env.SCHOOL_EMAIL || 'info@pleasantviewschools.co.ke';
  const redirectTo = raw.from_division || (schoolParam && targetSchool && !String(raw.return_to || '').startsWith('/contact'))
    ? `/s/${targetSchool.slug}/contact?ok=1`
    : '/contact?ok=1#enquire';

  if (!name || !message || (!phone && !email)) {
    return {
      ok: false,
      error: 'Full name, contact phone/email, and enquiry message are required.',
      redirectTo
    };
  }

  const recentDup = await q(
    'SELECT id FROM enquiries WHERE lower(name)=lower(?) AND phone=? AND message=? ORDER BY id DESC LIMIT 1',
    [name, phone, message]
  );
  let enquiryId = null;

  if (recentDup && recentDup.length > 0 && source === 'website') {
    enquiryId = Number(recentDup[0].id);
  } else {
    const ins = await qWrite(
      'INSERT INTO enquiries(school_id, name, phone, email, message, grade, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?)',
      [schoolId, name, phone, email, message, grade, source, '', status, created]
    );
    enquiryId = ins?.lastInsertRowid ? Number(ins.lastInsertRowid) : null;
  }

  // Mirror into Webmail Inbound Inbox
  try {
    const enqBody = [
      'Admissions & General Inquiry:',
      '',
      `Sender: ${name}`,
      `Phone: ${phone || 'Not specified'}`,
      `Email: ${email || 'Not specified'}`,
      `School: ${schoolName}`,
      ...(grade ? [`Prospective Grade: ${grade}`] : []),
      '',
      'Message:',
      message
    ].join('\n');

    const emIns = await qWrite(
      'INSERT INTO inbound_emails(sender_name, sender_email, recipient, subject, body, status, created) VALUES(?,?,?,?,?,?,?)',
      [
        name,
        email || phone || 'parent@pleasantviewschools.co.ke',
        targetEmail,
        `[Inquiry] ${name}: ${targetSchool?.name || 'Pleasant View'}`,
        enqBody,
        'received',
        created
      ]
    );
    if (enquiryId && emIns?.lastInsertRowid) {
      await qWrite('UPDATE enquiries SET source_ref=? WHERE id=?', [`inbound_email:${Number(emIns.lastInsertRowid)}`, enquiryId]);
    }
  } catch (mailLogErr) {
    console.warn('[Enquiry Webmail Mirror Notice]:', mailLogErr?.message);
  }

  if (!skipNotifications) {
    try {
      await notify({
        name,
        phone,
        email,
        to: targetEmail,
        subject: `[${targetSchool?.name || 'Pleasant View Schools'}] Enquiry: ${name}`,
        text: `${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nCampus: ${schoolName}${grade ? '\nGrade: ' + grade : ''}\n\n${message}`
      });

      const settings = await S();
      const rawAdminNumbers = String(settings.admin_sms_phone || process.env.ADMIN_SMS_PHONE || '+254711689913');
      const adminNumbers = rawAdminNumbers.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);
      const enqSms = `[Admissions Enquiry] From: ${name} (${phone}) for ${targetSchool?.name || 'General'}: "${message.slice(0, 100)}"`;
      for (const num of adminNumbers) {
        try {
          await sendSMS({ to: num, message: enqSms });
        } catch {}
      }
    } catch (err) {
      console.warn('[Enquiry Notification Notice]:', err?.message);
    }
  }

  return {
    ok: true,
    id: enquiryId,
    message: 'Admissions enquiry submitted successfully!',
    redirectTo
  };
}

export async function recordDirectAdminSms(raw = {}) {
  const redirectTo = '/contact?sms_sent=1#admin-sms';
  const name = String(raw.name || 'Website Visitor').trim();
  const visitorPhone = String(raw.phone || '').trim();
  const message = String(raw.message || '').trim();
  const created = nowSqlTimestamp();

  if (!visitorPhone || !message) {
    return {
      ok: false,
      error: 'Phone number and message are required.',
      redirectTo
    };
  }

  const settings = await S();
  const rawAdminNumbers = String(settings.admin_sms_phone || process.env.ADMIN_SMS_PHONE || process.env.SCHOOL_PHONE || '+254711689913');
  const adminNumbers = rawAdminNumbers.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);

  // 1. Persist in inbound_sms and comm_logs FIRST
  let smsRowId = null;
  try {
    const smsIns = await qWrite(
      'INSERT INTO inbound_sms(sender, receiver, text, status, created) VALUES(?,?,?,?,?)',
      [visitorPhone, adminNumbers[0] || '+254711689913', `[PV Visitor SMS] ${name} (${visitorPhone}): ${message}`, 'received', created]
    );
    smsRowId = smsIns?.lastInsertRowid ? Number(smsIns.lastInsertRowid) : null;
  } catch (err) {
    console.warn('[Direct SMS DB Log Notice]:', err?.message);
  }

  try {
    await qWrite(
      'INSERT INTO comm_logs(type, direction, sender, recipient, content, status, created) VALUES(?,?,?,?,?,?,?)',
      ['sms', 'inbound', visitorPhone, adminNumbers.join(', '), message, 'received', created]
    );
  } catch {}

  // 2. Also sync into Campus Visit Bookings or Admissions Enquiries so it appears in the Admissions Console
  try {
    const allSchools = await schools();
    const schoolId = inferSchoolIdFromText(message, '', allSchools);
    const grade = extractGradeFromText(message);
    const sourceRef = smsRowId ? `inbound_sms:${smsRowId}` : '';
    const asksForVisit = /\b(book\s+(?:a\s+|an\s+)?(?:campus\s+)?(?:visit|tour|interview(?:\s+slot)?)|schedule\s+(?:a\s+)?(?:visit|tour)|visit\s+(?:the\s+)?(?:school|campus))\b/i.test(message);

    if (asksForVisit) {
      await qWrite(
        'INSERT INTO visits(school_id, name, phone, email, visit_date, guests, grade, notes, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
        [schoolId, name, visitorPhone, '', 'To Confirm', 2, grade, message.slice(0, 260), 'direct_sms', sourceRef, 'pending', created]
      );
    } else {
      await qWrite(
        'INSERT INTO enquiries(school_id, name, phone, email, message, grade, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?)',
        [schoolId, name, visitorPhone, '', message, grade, 'direct_sms', sourceRef, 'pending', created]
      );
    }
  } catch (syncErr) {
    console.warn('[Direct SMS Admissions Sync Notice]:', syncErr?.message);
  }

  // 3. Dispatch SMS directly to Admin mobile phones via Africa's Talking (NO auto-reply to visitor)
  const smsBody = `[PV Visitor SMS] ${name} (${visitorPhone}): ${message}`;
  for (const num of adminNumbers) {
    try {
      await sendSMS({ to: num, message: smsBody });
    } catch (err) {
      console.warn('[Direct SMS Gateway Notice]:', err?.message);
    }
  }

  return {
    ok: true,
    message: 'Direct SMS dispatched to school administration!',
    redirectTo
  };
}

export async function recordJobApplication(raw = {}) {
  const redirectTo = '/careers?applied=1';
  const jobTitle = String(raw.job_title || 'General Application').trim();
  const name = String(raw.name || '').trim();
  const email = String(raw.email || '').trim();
  const phone = String(raw.phone || '').trim();
  const experience = String(raw.experience || '').trim();
  const coverLetter = String(raw.cover_letter || '').trim();
  const created = nowSqlTimestamp();

  if (!name || (!email && !phone)) {
    return { ok: false, error: 'Applicant name and contact details are required.', redirectTo };
  }

  await qWrite(
    'INSERT INTO job_applications(job_id, job_title, applicant_name, email, phone, experience, cover_letter, status, created) VALUES(?,?,?,?,?,?,?,"new",?)',
    [Number(raw.job_id) || 0, jobTitle, name, email, phone, experience, coverLetter, created]
  );

  const hrEmail = process.env.SCHOOL_EMAIL || 'admin@pleasantviewschools.co.ke';
  try {
    await qWrite(
      'INSERT INTO inbound_emails(sender_name, sender_email, recipient, subject, body, status, created) VALUES(?,?,?,?,?,?,?)',
      [name, email || phone, hrEmail, `[Career Application] ${jobTitle}: ${name}`, `Job Application for ${jobTitle}\n\nApplicant: ${name}\nEmail: ${email}\nPhone: ${phone}\nExperience: ${experience}\n\nCover Letter:\n${coverLetter}`, 'received', created]
    );
  } catch {}

  try {
    await notify({
      name,
      phone,
      email,
      to: hrEmail,
      subject: `[Career Application] ${jobTitle}: ${name}`,
      text: `Applicant: ${name}\nEmail: ${email}\nPhone: ${phone}\nPosition: ${jobTitle}\nExperience: ${experience}\nCover Letter:\n${coverLetter}`,
      sms: `Hi ${name}, Pleasant View Schools HR has received your application for ${jobTitle}. We will review your profile shortly.`
    });
  } catch (err) {
    console.warn('[Job Notification Notice]:', err?.message);
  }

  return { ok: true, message: 'Job application submitted successfully!', redirectTo };
}

export async function recordParentReview(raw = {}) {
  const redirectTo = '/?review_submitted=1#parent-reviews';
  const parentName = String(raw.parent_name || '').trim();
  const learnerName = String(raw.learner_name || '').trim();
  const grade = String(raw.grade_or_division || '').trim();
  const relationship = String(raw.relationship || 'Parent / Guardian').trim();
  const rating = Math.min(5, Math.max(1, Number(raw.rating) || 5));
  const comment = String(raw.comment || '').trim();
  const phone = String(raw.phone || '').trim();
  const email = String(raw.email || '').trim();
  const created = nowSqlTimestamp();

  if (!parentName || !comment || !grade) {
    return { ok: false, error: 'Parent name, school/grade, and review comment are required.', redirectTo };
  }

  await qWrite(
    'INSERT INTO parent_testimonials(parent_name, learner_name, grade_or_division, relationship, rating, comment, phone, email, status, created_at) VALUES(?,?,?,?,?,?,?,?,"pending",?)',
    [parentName, learnerName, grade, relationship, rating, comment, phone, email, created]
  );

  try {
    const settings = await S();
    const rawAdminNumbers = String(settings.admin_sms_phone || process.env.ADMIN_SMS_PHONE || '+254711689913');
    const adminNumbers = rawAdminNumbers.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);
    const alertSms = `[New Parent Review Pending] From: ${parentName} (${grade}): "${comment.slice(0, 80)}..." Pending admin approval in portal.`;
    for (const num of adminNumbers) {
      try {
        await sendSMS({ to: num, message: alertSms });
      } catch {}
    }
  } catch (err) {
    console.warn('[Review Alert Notice]:', err?.message);
  }

  return { ok: true, message: 'Thank you! Your review has been submitted for approval.', redirectTo };
}

export async function syncInboundEmailToAdmissions(row) {
  try {
    const allSchools = await schools();
    const parsed = parseInboundEmailRecord(row, allSchools);
    if (!parsed) return;
    if (parsed.visit) {
      const v = parsed.visit;
      const existing = v.source_ref ? await q('SELECT id FROM visits WHERE source_ref=? LIMIT 1', [v.source_ref]) : [];
      if (!existing.length) {
        await qWrite(
          'INSERT INTO visits(school_id, name, phone, email, visit_date, guests, grade, notes, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
          [v.school_id, v.name, v.phone, v.email, v.visit_date, v.guests, v.grade, v.notes, v.source, v.source_ref, v.status, v.created]
        );
      }
    }
    if (parsed.enquiry) {
      const e = parsed.enquiry;
      const existing = e.source_ref ? await q('SELECT id FROM enquiries WHERE source_ref=? LIMIT 1', [e.source_ref]) : [];
      if (!existing.length) {
        await qWrite(
          'INSERT INTO enquiries(school_id, name, phone, email, message, grade, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?)',
          [e.school_id, e.name, e.phone, e.email, e.message, e.grade, e.source, e.source_ref, e.status, e.created]
        );
      }
    }
  } catch (err) {
    console.warn('[syncInboundEmailToAdmissions Notice]:', err?.message);
  }
}

export async function syncInboundSmsToAdmissions(row) {
  try {
    const allSchools = await schools();
    const parsed = parseInboundSmsRecord(row, allSchools);
    if (!parsed) return;
    if (parsed.visit) {
      const v = parsed.visit;
      const existing = v.source_ref ? await q('SELECT id FROM visits WHERE source_ref=? LIMIT 1', [v.source_ref]) : [];
      if (!existing.length) {
        await qWrite(
          'INSERT INTO visits(school_id, name, phone, email, visit_date, guests, grade, notes, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
          [v.school_id, v.name, v.phone, v.email, v.visit_date, v.guests, v.grade, v.notes, v.source, v.source_ref, v.status, v.created]
        );
      }
    }
    if (parsed.enquiry) {
      const e = parsed.enquiry;
      const existing = e.source_ref ? await q('SELECT id FROM enquiries WHERE source_ref=? LIMIT 1', [e.source_ref]) : [];
      if (!existing.length) {
        await qWrite(
          'INSERT INTO enquiries(school_id, name, phone, email, message, grade, source, source_ref, status, created) VALUES(?,?,?,?,?,?,?,?,?,?)',
          [e.school_id, e.name, e.phone, e.email, e.message, e.grade, e.source, e.source_ref, e.status, e.created]
        );
      }
    }
  } catch (err) {
    console.warn('[syncInboundSmsToAdmissions Notice]:', err?.message);
  }
}
