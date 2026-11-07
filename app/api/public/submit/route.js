import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  extractClientIp,
  checkPublicRateLimit,
  recordCampusVisit,
  recordAdmissionsEnquiry,
  recordDirectAdminSms,
  recordJobApplication,
  recordParentReview
} from '@/lib/admissions';

export const dynamic = 'force-dynamic';

const HANDLERS = {
  book: recordCampusVisit,
  enquire: recordAdmissionsEnquiry,
  sendDirectAdminSms: recordDirectAdminSms,
  applyJob: recordJobApplication,
  submitParentReview: recordParentReview
};

export async function POST(req) {
  const url = new URL(req.url);
  const contentType = String(req.headers.get('content-type') || '').toLowerCase();
  const acceptsJson = String(req.headers.get('accept') || '').toLowerCase().includes('application/json');

  let actionName = url.searchParams.get('action') || '';
  let data = {};

  try {
    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body?.action) actionName = String(body.action);
      data = body?.fields && typeof body.fields === 'object' ? body.fields : body;
    } else {
      const fd = await req.formData();
      data = Object.fromEntries(fd.entries());
      if (!actionName && data.__action) {
        actionName = String(data.__action);
      }
    }

    const handler = HANDLERS[actionName];
    if (!handler) {
      return NextResponse.json(
        { ok: false, error: `Unsupported submission action: ${actionName || 'missing'}` },
        { status: 400 }
      );
    }

    // Honeypot bot filter
    if (data.website) {
      if (acceptsJson || contentType.includes('application/json')) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.redirect(new URL('/contact', req.url), 303);
    }

    // Anti-abuse rate limiter (never fakes ?booked=1 or ?ok=1 if triggered)
    const clientIp = extractClientIp(req.headers);
    if (checkPublicRateLimit(`${actionName}:${clientIp}`, 40, 10 * 60 * 1000)) {
      const msg = 'Too many submissions in a short period. Please wait a few minutes or call +254 711 689 913.';
      if (acceptsJson || contentType.includes('application/json')) {
        return NextResponse.json({ ok: false, error: msg }, { status: 429 });
      }
      return NextResponse.redirect(new URL('/contact?error=rate_limit', req.url), 303);
    }

    const result = await handler(data);

    try {
      revalidatePath('/staff-portal', 'page');
      revalidatePath('/hidden-admin', 'page');
      if (actionName === 'submitParentReview') {
        revalidatePath('/', 'page');
      }
    } catch {}

    if (acceptsJson || contentType.includes('application/json')) {
      return NextResponse.json(result, { status: result.ok === false ? 400 : 200 });
    }

    const target = result.ok === false
      ? `/contact?error=${encodeURIComponent(result.error || 'submission_failed')}`
      : (result.redirectTo || '/contact?ok=1');

    return NextResponse.redirect(new URL(target, req.url), 303);
  } catch (err) {
    console.error(`[Public Submit API Error: ${actionName}]:`, err);
    if (acceptsJson || contentType.includes('application/json')) {
      return NextResponse.json(
        { ok: false, error: err?.message || 'Unable to process your submission right now. Please try again.' },
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL('/contact?error=server_error', req.url), 303);
  }
}
