import { NextResponse } from 'next/server';
import * as adminActions from '@/app/hidden-admin/actions';

export const dynamic = 'force-dynamic';

const ALLOWED_ACTIONS = new Set([
  'login',
  'verifyLoginOTP',
  'logout',
  'addSchool',
  'setSchoolAdmin',
  'setSchoolLocation',
  'saveSchool',
  'addVideo',
  'delVideo',
  'addJob',
  'toggleJobStatus',
  'delJob',
  'updateApplicationStatus',
  'delApplication',
  'addVisitBooking',
  'updateVisitStatus',
  'delVisit',
  'addAdmissionsEnquiry',
  'updateEnquiryStatus',
  'delEnquiry',
  'addLeadershipMessage',
  'delLeadershipMessage',
  'addPost',
  'addHero',
  'updateHero',
  'addPhotos',
  'del',
  'testResend',
  'testAfricasTalking',
  'replySMS',
  'replyEmail',
  'addEmailAccount',
  'updateEmailAccount',
  'delEmailAccount',
  'simulateInboundSMS',
  'simulateInboundEmail',
  'delInbound',
  'addQuickLink',
  'delQuickLink',
  'toggleQuickLink',
  'createAdminAccount',
  'deleteAdminAccount',
  'saveGlanceMetrics',
  'addSchoolLifePhoto',
  'delPhoto',
  'updatePhotoCategory',
  'discardUnlinkedUpload',
  'saveAdminSmsSettings',
  'saveExamResult',
  'deleteExamResult',
  'addParentTestimonial',
  'approveTestimonial',
  'rejectTestimonial',
  'deleteTestimonial',
  'saveAlumniStory',
  'deleteAlumniStory',
  'saveLearnerTestimonial',
  'deleteLearnerTestimonial',
  'saveEvent',
  'deleteEvent',
  'toggleEvent',
  'sendWebmail',
  'saveAdminRecoveryProfile',
  'requestPasswordChangeOTP',
  'saveApiIntegrations',
  'verifyPasswordChangeOTP'
]);

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const contentType = String(req.headers.get('content-type') || '').toLowerCase();
  const acceptsJson = String(req.headers.get('accept') || '').toLowerCase().includes('application/json');

  let actionName = searchParams.get('action') || '';
  let fd = new FormData();

  try {
    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body?.action) actionName = String(body.action);
      const fields = body?.fields || {};
      for (const [k, v] of Object.entries(fields)) {
        if (Array.isArray(v)) {
          for (const item of v) {
            if (item != null) fd.append(k, String(item));
          }
        } else if (v != null) {
          fd.append(k, String(v));
        }
      }
    } else {
      fd = await req.formData();
      if (!actionName) {
        actionName = String(fd.get('__action') || '');
      }
    }

    if (!actionName || !ALLOWED_ACTIONS.has(actionName) || typeof adminActions[actionName] !== 'function') {
      return NextResponse.json(
        { ok: false, error: `Unsupported portal action: ${actionName || 'missing'}` },
        { status: 400 }
      );
    }

    const result = await adminActions[actionName](fd);
    const payload = result && typeof result === 'object' ? result : { ok: true };

    if (!acceptsJson && !contentType.includes('application/json')) {
      const dest = new URL(payload.redirectTo || '/staff-portal', req.url);
      return NextResponse.redirect(dest, 303);
    }

    return NextResponse.json(payload, { status: payload.ok === false ? 400 : 200 });
  } catch (err) {
    console.error(`[Admin Action API Error: ${actionName}]:`, err);
    const status = err?.statusCode || 500;
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || 'Portal operation could not be completed. Please try again.'
      },
      { status }
    );
  }
}
