'use server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { q, getSchool } from '@/lib/db';
import { limited } from '@/lib/auth';
import { notify } from '@/lib/notify';
const ip = async () => (await headers()).get('x-forwarded-for') || 'x';
export async function book(fd) {
  const b = Object.fromEntries(fd), s = await getSchool(b.school), back = `/s/${b.school}/visit?ok=1`;
  if (!s || b.website || limited('v' + await ip())) redirect(back);
  await q('INSERT INTO visits(school_id,name,phone,email,visit_date,guests) VALUES(?,?,?,?,?,?)', [s.id, b.name, b.phone, b.email || '', b.visit_date, +b.guests || 1]);
  await notify({ ...b, to: s.email, subject: `[${s.name}] Visit booking: ${b.name} (${b.visit_date})`, text: `${b.name}\n${b.phone}\n${b.email}\n${b.visit_date}, ${b.guests} guests`, sms: `Hi ${b.name}, your visit to ${s.name} on ${b.visit_date} is booked. We look forward to meeting you.` });
  redirect(back);
}
export async function enquire(fd) {
  const b = Object.fromEntries(fd), s = b.school ? await getSchool(b.school) : null, back = s ? `/s/${s.slug}/contact?ok=1` : '/contact?ok=1';
  if (b.website || limited('c' + await ip())) redirect(back);
  await q('INSERT INTO enquiries(school_id,name,phone,email,message) VALUES(?,?,?,?,?)', [s?.id || 0, b.name, b.phone, b.email || '', b.message]);
  await notify({ ...b, to: s?.email, subject: `[${s?.name || 'Pleasantview Schools'}] Enquiry: ${b.name}`, text: `${b.name}\n${b.phone}\n${b.email}\n\n${b.message}`, sms: `Hi ${b.name}, we received your enquiry and will contact you shortly.` });
  redirect(back);
}
