import { NextResponse } from 'next/server';
import { notify, formatKenyanPhone } from '@/lib/notify';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    service: 'Pleasantview Unified Notification API',
    providers: {
      resend: {
        configured: Boolean(process.env.RESEND_API_KEY),
        from: process.env.MAIL_FROM || 'Pleasantview Schools <onboarding@resend.dev>',
        schoolEmail: process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke'
      },
      africasTalking: {
        configured: Boolean(process.env.AT_API_KEY || process.env.AFRICASTALKING_API_KEY),
        username: process.env.AT_USERNAME || process.env.AFRICASTALKING_USERNAME || 'sandbox',
        senderId: process.env.AT_SENDER_ID || process.env.AFRICASTALKING_SENDER_ID || '(default)'
      }
    },
    endpoints: {
      unifiedNotify: '/api/notify (POST)',
      resendOnly: '/api/resend (POST)',
      africasTalkingOnly: '/api/africastalking (POST)'
    },
    timestamp: new Date().toISOString()
  });
}

export async function POST(req) {
  try {
    let body = {};
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData);
    }

    const { name, phone, email, subject, text, sms, to } = body;

    if (!name && !phone && !email) {
      return NextResponse.json(
        { success: false, error: 'At least name, phone, or email is required' },
        { status: 400 }
      );
    }

    const results = await notify({
      name: name || 'Parent',
      phone: phone ? formatKenyanPhone(phone) : '',
      email: email || '',
      subject: subject || 'Pleasantview Schools Admissions Notification',
      text: text || 'Thank you for contacting Pleasantview Schools.',
      sms: sms || 'Thank you for contacting Pleasantview Schools. We will reach out shortly.',
      to: to || undefined
    });

    return NextResponse.json({
      success: true,
      message: 'Notification routine executed',
      results
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
