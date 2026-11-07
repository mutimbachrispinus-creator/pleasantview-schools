// Pure parsing & classification helpers for Campus Visit Bookings and Admissions Enquiries.
// Kept free of DB/network imports so both lib/db.js migrations and live routes can share it cleanly.

export function nowSqlTimestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

export function normalizePhoneDisplay(raw = '') {
  const s = String(raw || '').trim();
  if (!s || s.toLowerCase() === 'not specified') return '';
  return s;
}

export function extractPhoneFromText(str = '') {
  const m = String(str || '').match(/(?:\+?254|0)\s*[17]\d(?:[\s\-]?\d){7}\b/);
  return m ? m[0].replace(/\s+/g, ' ').trim() : '';
}

export function extractGradeFromText(str = '') {
  const text = String(str || '');
  const matches = [];
  const re = /\b(?:PP\s*[12]|Playgroup|Daycare|Pre-Primary\s*[12]?|Grade\s*(?:1[0-2]|[1-9])(?:\s*JSS)?|Form\s*[1-4](?:\s*(?:Girls|Boys|Senior(?:\s*School)?))?)\b/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const clean = m[0].replace(/\s+/g, ' ').trim();
    if (!matches.some(x => x.toLowerCase() === clean.toLowerCase())) {
      matches.push(clean);
    }
  }
  return matches.slice(0, 3).join(', ');
}

export function inferSchoolIdFromText(text = '', recipient = '', schoolsList = []) {
  const hay = `${recipient || ''} ${text || ''}`.toLowerCase();

  // Match against explicit school names/slugs if provided
  for (const s of schoolsList || []) {
    const slug = String(s.slug || '').toLowerCase();
    const name = String(s.name || '').toLowerCase();
    if ((slug && hay.includes(slug)) || (name && hay.includes(name))) {
      return Number(s.id) || 0;
    }
  }

  const findId = (pred, fallbackId) => {
    const hit = (schoolsList || []).find(pred);
    return hit ? Number(hit.id) : fallbackId;
  };

  const hasSenior = /\b(senior\s*school|seniorschool|senior@|high\s*school|form\s*[1-4]|grade\s*1[0-2]|kcse|kssea)\b/i.test(hay);
  const hasJss = /\b(junior\s*secondary|junior@|\bjss\b|grade\s*[789]|kjsea)\b/i.test(hay);
  const hasPrimary = /\b(primary\s*school|primary@|grade\s*[1-6]|kpsea)\b/i.test(hay);
  const hasEarly = /\b(early\s*learning|early\s*childhood|early@|\bpp\s*[12]\b|playgroup|nursery|kindergarten)\b/i.test(hay);

  const matchedCount = [hasSenior, hasJss, hasPrimary, hasEarly].filter(Boolean).length;
  // If multiple divisions are mentioned together, treat as Group / Multi-Campus (0)
  if (matchedCount > 1) return 0;

  if (hasSenior) return findId(s => /senior/i.test(`${s.slug} ${s.name} ${s.category}`), 1);
  if (hasJss) return findId(s => /jss|junior/i.test(`${s.slug} ${s.name} ${s.category}`), 2);
  if (hasPrimary) return findId(s => /primary/i.test(`${s.slug} ${s.name} ${s.category}`), 3);
  if (hasEarly) return findId(s => /early|ecde|kindergarten/i.test(`${s.slug} ${s.name} ${s.category}`), 4);

  return 0;
}

export function isSyntheticOrSystemMessage({ senderEmail = '', senderPhone = '', subject = '', body = '' } = {}) {
  const email = String(senderEmail || '').trim().toLowerCase();
  const phone = String(senderPhone || '').trim();
  const subj = String(subject || '').trim();
  const text = String(body || '').trim();
  const combined = `${subj}\n${text}`.toLowerCase();

  if (!subj && !text) return true;
  if (email.endsWith('@example.com') || email.endsWith('@test.com') || email === 'test@pleasantviewschools.co.ke') return true;
  if (phone === '+254722000000' || phone === '0722000000') return true;
  if (/^\[career application\]/i.test(subj)) return true;
  if (
    combined.includes('simulated inquiry') ||
    combined.includes('verification code') ||
    combined.includes('one-time password') ||
    combined.includes('portal login issue') ||
    combined.includes('reset my parent portal') ||
    combined.includes('test email from pleasant view')
  ) {
    return true;
  }
  return false;
}

function readLabeledField(body, label) {
  const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, 'im');
  const m = String(body || '').match(re);
  return m ? m[1].trim() : '';
}

function extractVisitDateHint(text = '', created = '') {
  const s = String(text || '');
  const iso = s.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) return iso[1];

  const dayMatch = s.match(/\b((?:this|next)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday)|(?:monday|tuesday|wednesday|thursday|friday|saturday)(?:\s+morning|\s+afternoon)?)\b/i);
  if (dayMatch) {
    const cleanDay = dayMatch[1].replace(/\b\w/g, c => c.toUpperCase());
    const baseDate = created ? String(created).slice(0, 10) : '';
    return baseDate ? `${cleanDay} (req. ${baseDate})` : cleanDay;
  }

  return 'To Confirm';
}

export function parseInboundEmailRecord(row, schoolsList = []) {
  if (!row) return null;
  const subj = String(row.subject || '').trim();
  const body = String(row.body || '').trim();
  const senderName = String(row.sender_name || '').trim();
  const senderEmailRaw = String(row.sender_email || '').trim();
  const recipient = String(row.recipient || '').trim();
  const created = String(row.created || '').trim() || nowSqlTimestamp();
  const sourceRef = `inbound_email:${row.id}`;

  // 1. Structured [Campus Tour Booking] written by website booking flow
  if (/^\[campus tour booking\]/i.test(subj) || /^campus tour booking details:/i.test(body)) {
    const name = readLabeledField(body, 'Visitor Name') || senderName || 'Campus Visitor';
    const phone = normalizePhoneDisplay(readLabeledField(body, 'Phone')) || (!senderEmailRaw.includes('@') ? senderEmailRaw : '') || extractPhoneFromText(body);
    const rawEm = readLabeledField(body, 'Email');
    const email = rawEm && rawEm.toLowerCase() !== 'not specified'
      ? rawEm
      : (senderEmailRaw.includes('@') && !senderEmailRaw.startsWith('tour-visitor@') ? senderEmailRaw : '');
    const visitDate = readLabeledField(body, 'Preferred Date') || extractVisitDateHint(subj, created);
    const guests = Math.max(1, parseInt(readLabeledField(body, 'Guests'), 10) || 1);
    const divLabel = readLabeledField(body, 'School') || readLabeledField(body, 'Campus Division');
    const gradeRaw = readLabeledField(body, 'Prospective Grade');
    const grade = gradeRaw && gradeRaw.toLowerCase() !== 'not specified' ? gradeRaw : extractGradeFromText(body);
    const schoolId = inferSchoolIdFromText(`${divLabel} ${grade}`, recipient, schoolsList);

    return {
      visit: {
        school_id: schoolId,
        name,
        phone,
        email,
        visit_date: visitDate,
        guests,
        grade,
        notes: '',
        source: 'website',
        source_ref: sourceRef,
        status: row.status === 'replied' ? 'confirmed' : 'pending',
        created
      },
      enquiry: null
    };
  }

  // 2. Structured [Inquiry] written by website enquiry flow
  if (/^\[inquiry\]/i.test(subj) || /^admissions\s*&\s*general inquiry:/i.test(body)) {
    const name = readLabeledField(body, 'Sender') || senderName || 'Prospective Parent';
    const phone = normalizePhoneDisplay(readLabeledField(body, 'Phone')) || (!senderEmailRaw.includes('@') ? senderEmailRaw : '') || extractPhoneFromText(body);
    const rawEm = readLabeledField(body, 'Email');
    const email = rawEm && rawEm.toLowerCase() !== 'not specified'
      ? rawEm
      : (senderEmailRaw.includes('@') && !senderEmailRaw.startsWith('parent@pleasantviewschools') ? senderEmailRaw : '');
    const divLabel = readLabeledField(body, 'School') || readLabeledField(body, 'Campus Division');
    const msgIdx = body.search(/Message:\s*\n/i);
    const extractedMsg = msgIdx >= 0 ? body.slice(msgIdx).replace(/^Message:\s*\n?/i, '').trim() : body;
    const grade = extractGradeFromText(extractedMsg);
    const schoolId = inferSchoolIdFromText(`${divLabel} ${extractedMsg}`, recipient, schoolsList);

    if (isSyntheticOrSystemMessage({ senderEmail: email, senderPhone: phone, subject: subj, body: extractedMsg })) {
      return null;
    }

    return {
      visit: null,
      enquiry: {
        school_id: schoolId,
        name,
        phone,
        email,
        message: extractedMsg,
        grade,
        source: 'website',
        source_ref: sourceRef,
        status: row.status === 'replied' ? 'replied' : 'pending',
        created
      }
    };
  }

  // 3. Genuine external inbound email (e.g. Resend inbound or direct email correspondence)
  if (isSyntheticOrSystemMessage({ senderEmail: senderEmailRaw, subject: subj, body })) {
    return null;
  }

  const email = senderEmailRaw.includes('@') ? senderEmailRaw : '';
  const phone = (!senderEmailRaw.includes('@') ? senderEmailRaw : '') || extractPhoneFromText(body);
  const name = senderName || (email ? email.split('@')[0] : 'Prospective Parent');
  const fullMessage = subj && !body.startsWith(subj) ? `${subj} — ${body}` : body;
  const cleanMessage = fullMessage.replace(/\s+/g, ' ').trim();
  const grade = extractGradeFromText(`${subj} ${body}`);
  const schoolId = inferSchoolIdFromText(`${subj} ${body}`, recipient, schoolsList);

  const asksForTour = /\b(campus\s+tours?|guided\s+campus\s+tours?|book\s+(?:a\s+|an\s+)?(?:visit|tour|interview)|schedule\s+(?:a\s+)?(?:visit|tour)|visit\s+the\s+(?:school|campus))\b/i.test(`${subj} ${body}`);
  const alsoHasEnquiry = /\b(intake|register|registration|vacanc|fee|prospectus|pathway|admission|apply|application|curriculum|cbc|cbe|boarding|transport|requirements)\b/i.test(`${subj} ${body}`);

  return {
    visit: asksForTour
      ? {
          school_id: schoolId,
          name,
          phone,
          email,
          visit_date: extractVisitDateHint(`${subj} ${body}`, created),
          guests: 2,
          grade,
          notes: cleanMessage.slice(0, 260),
          source: 'email',
          source_ref: sourceRef,
          status: row.status === 'replied' ? 'confirmed' : 'pending',
          created
        }
      : null,
    enquiry: (!asksForTour || alsoHasEnquiry)
      ? {
          school_id: schoolId,
          name,
          phone,
          email,
          message: cleanMessage,
          grade,
          source: 'email',
          source_ref: sourceRef,
          status: row.status === 'replied' ? 'replied' : 'pending',
          created
        }
      : null
  };
}

export function parseInboundSmsRecord(row, schoolsList = []) {
  if (!row) return null;
  const rawText = String(row.text || '').trim();
  const sender = String(row.sender || '').trim();
  const created = String(row.created || '').trim() || nowSqlTimestamp();
  const sourceRef = `inbound_sms:${row.id}`;

  if (isSyntheticOrSystemMessage({ senderPhone: sender, body: rawText })) {
    return null;
  }

  let name = 'Parent / Guardian (SMS)';
  let phone = sender;
  let message = rawText;

  // Check if formatted as [PV Visitor SMS] Name (Phone): Message
  const pvMatch = rawText.match(/^\[PV Visitor SMS\]\s*([^()]+?)\s*\(([^)]+)\)\s*:\s*([\s\S]+)$/i);
  if (pvMatch) {
    name = pvMatch[1].trim() || name;
    phone = pvMatch[2].trim() || phone;
    message = pvMatch[3].trim();
  }

  const grade = extractGradeFromText(message);
  const schoolId = inferSchoolIdFromText(message, '', schoolsList);

  const asksForVisit = /\b(book\s+(?:a\s+|an\s+)?(?:campus\s+)?(?:visit|tour|interview(?:\s+slot)?)|schedule\s+(?:a\s+)?(?:visit|tour)|visit\s+(?:the\s+)?(?:school|campus))\b/i.test(message);

  return {
    visit: asksForVisit
      ? {
          school_id: schoolId,
          name,
          phone,
          email: '',
          visit_date: extractVisitDateHint(message, created),
          guests: 2,
          grade,
          notes: message.slice(0, 260),
          source: 'sms',
          source_ref: sourceRef,
          status: row.status === 'replied' ? 'confirmed' : 'pending',
          created
        }
      : null,
    enquiry: !asksForVisit
      ? {
          school_id: schoolId,
          name,
          phone,
          email: '',
          message,
          grade,
          source: 'sms',
          source_ref: sourceRef,
          status: row.status === 'replied' ? 'replied' : 'pending',
          created
        }
      : null
  };
}
