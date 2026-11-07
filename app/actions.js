'use server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  extractClientIp,
  checkPublicRateLimit,
  recordCampusVisit,
  recordAdmissionsEnquiry,
  recordDirectAdminSms,
  recordJobApplication,
  recordParentReview
} from '@/lib/admissions';

export async function book(fd) {
  const b = Object.fromEntries(fd);
  if (b.website) redirect('/contact');
  const ip = extractClientIp(await headers());
  if (checkPublicRateLimit(`book:${ip}`, 40, 10 * 60 * 1000)) {
    redirect('/contact?error=rate_limit#visit');
  }
  const res = await recordCampusVisit(b);
  redirect(res.redirectTo || '/contact?booked=1#visit');
}

export async function enquire(fd) {
  const b = Object.fromEntries(fd);
  if (b.website) redirect('/contact');
  const ip = extractClientIp(await headers());
  if (checkPublicRateLimit(`enquire:${ip}`, 40, 10 * 60 * 1000)) {
    redirect('/contact?error=rate_limit#enquire');
  }
  const res = await recordAdmissionsEnquiry(b);
  redirect(res.redirectTo || '/contact?ok=1#enquire');
}

export async function applyJob(fd) {
  const b = Object.fromEntries(fd);
  if (b.website) redirect('/careers');
  const ip = extractClientIp(await headers());
  if (checkPublicRateLimit(`applyJob:${ip}`, 40, 10 * 60 * 1000)) {
    redirect('/careers?error=rate_limit');
  }
  const res = await recordJobApplication(b);
  redirect(res.redirectTo || '/careers?applied=1');
}

export async function sendDirectAdminSms(fd) {
  const b = Object.fromEntries(fd);
  if (b.website) redirect('/contact');
  const ip = extractClientIp(await headers());
  if (checkPublicRateLimit(`sms:${ip}`, 40, 10 * 60 * 1000)) {
    redirect('/contact?error=rate_limit#admin-sms');
  }
  const res = await recordDirectAdminSms(b);
  redirect(res.redirectTo || '/contact?sms_sent=1#admin-sms');
}

export async function submitParentReview(fd) {
  const b = Object.fromEntries(fd);
  if (b.website) redirect('/');
  const ip = extractClientIp(await headers());
  if (checkPublicRateLimit(`rev:${ip}`, 40, 10 * 60 * 1000)) {
    redirect('/?error=rate_limit#parent-reviews');
  }
  const res = await recordParentReview(b);
  redirect(res.redirectTo || '/?review_submitted=1#parent-reviews');
}
