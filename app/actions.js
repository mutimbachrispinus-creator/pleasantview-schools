'use server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { q, S, getSchool } from '@/lib/db';
import { limited } from '@/lib/auth';
import { notify, sendSMS } from '@/lib/notify';

const ip = async () => (await headers()).get('x-forwarded-for') || 'x';

export async function book(fd) {
  const b = Object.fromEntries(fd);
  const targetSchool = b.school && b.school !== '0' && b.school !== 'all' ? await getSchool(b.school) : null;
  const schoolId = targetSchool?.id || 0;
  const schoolName = targetSchool?.name || 'Pleasantview Schools Main Campus';
  const schoolEmail = targetSchool?.email || process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke';
  const back = targetSchool ? `/s/${targetSchool.slug}/visit?ok=1` : '/contact?booked=1#visit';

  if (b.website || (await limited('v' + (await ip())))) redirect(back);

  await q('INSERT INTO visits(school_id,name,phone,email,visit_date,guests,status) VALUES(?,?,?,?,?,?,"pending")', [
    schoolId,
    b.name,
    b.phone,
    b.email || '',
    b.visit_date || new Date().toISOString().slice(0, 10),
    +b.guests || 1
  ]);

  try {
    await notify({
      ...b,
      to: schoolEmail,
      subject: `[${schoolName}] Campus Tour Booking: ${b.name} (${b.visit_date})`,
      text: `Visitor Name: ${b.name}\nPhone: ${b.phone}\nEmail: ${b.email}\nDate: ${b.visit_date}\nGuests: ${b.guests}\nSchool Division: ${schoolName}\nStudent Grade: ${b.grade || 'Not specified'}`,
      sms: `Hi ${b.name}, your tour booking for ${schoolName} on ${b.visit_date} is confirmed. Our admissions team looks forward to hosting you.`
    });
  } catch (err) {
    console.warn('[Notification Error]:', err.message);
  }

  redirect(back);
}

export async function enquire(fd) {
  const b = Object.fromEntries(fd);
  const s = b.school ? await getSchool(b.school) : null;
  const back = s ? `/s/${s.slug}/contact?ok=1` : '/contact?ok=1';

  if (b.website || (await limited('c' + (await ip())))) redirect(back);

  await q('INSERT INTO enquiries(school_id,name,phone,email,message,status) VALUES(?,?,?,?,?,"pending")', [
    s?.id || 0,
    b.name,
    b.phone,
    b.email || '',
    b.message
  ]);

  try {
    await notify({
      ...b,
      to: s?.email || process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke',
      subject: `[${s?.name || 'Pleasantview Schools'}] Enquiry: ${b.name}`,
      text: `${b.name}\n${b.phone}\n${b.email}\n\n${b.message}`,
      sms: `Hi ${b.name}, we received your enquiry and our admissions desk will contact you shortly.`
    });
  } catch (err) {
    console.warn('[Notification Error]:', err.message);
  }

  redirect(back);
}

export async function applyJob(fd) {
  const b = Object.fromEntries(fd);
  const back = `/careers?applied=1`;

  if (b.website || (await limited('j' + (await ip())))) redirect(back);

  const jobTitle = String(b.job_title || 'General Application').trim();
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim();
  const phone = String(b.phone || '').trim();
  const experience = String(b.experience || '').trim();
  const coverLetter = String(b.cover_letter || '').trim();

  await q(
    'INSERT INTO job_applications(job_id,job_title,applicant_name,email,phone,experience,cover_letter,status) VALUES(?,?,?,?,?,?,?,"new")',
    [+b.job_id || 0, jobTitle, name, email, phone, experience, coverLetter]
  );

  try {
    await notify({
      to: process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke',
      subject: `[Career Application] ${jobTitle}: ${name}`,
      text: `Applicant: ${name}\nEmail: ${email}\nPhone: ${phone}\nPosition: ${jobTitle}\nExperience: ${experience}\nCover Letter:\n${coverLetter}`,
      sms: `Hi ${name}, Pleasantview Schools HR has received your application for ${jobTitle}. We will review your profile shortly.`
    });
  } catch (err) {
    console.warn('[Notification Error]:', err.message);
  }

  redirect(back);
}

export async function sendDirectAdminSms(fd) {
  const b = Object.fromEntries(fd);
  const back = '/contact?sms_sent=1#admin-sms';

  if (b.website || (await limited('sms' + (await ip())))) redirect(back);

  const name = String(b.name || 'Website Visitor').trim();
  const visitorPhone = String(b.phone || '').trim();
  const message = String(b.message || '').trim();

  if (!visitorPhone || !message) redirect(back);

  const settings = await S();
  const adminPhone = settings.admin_sms_phone || process.env.ADMIN_SMS_PHONE || process.env.SCHOOL_PHONE || '+254711689913';

  // 1. Send SMS directly to Admin's mobile phone via Africa's Talking
  const smsBody = `[PV Web SMS] ${name} (${visitorPhone}): ${message}`;
  try {
    await sendSMS({
      to: adminPhone,
      message: smsBody
    });
  } catch (err) {
    console.warn('[Direct SMS Error]:', err.message);
  }

  // 2. Record in inbound_sms database table
  try {
    await q('INSERT INTO inbound_sms(sender, receiver, text, status) VALUES(?,?,?,?)', [
      visitorPhone,
      adminPhone,
      message,
      'received'
    ]);
  } catch {}

  // 3. Log in comm_logs
  try {
    await q('INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)', [
      'sms',
      'inbound',
      visitorPhone,
      adminPhone,
      message,
      'received'
    ]);
  } catch {}

  // CRITICAL REQUIREMENT: NO AUTO-REPLY TO VISITOR (As explicitly requested by user)

  redirect(back);
}
