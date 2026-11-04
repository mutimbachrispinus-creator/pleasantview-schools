import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/notify';
import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const isConfigured = Boolean(process.env.RESEND_API_KEY);
  const { searchParams } = new URL(req.url);

  if (searchParams.get('inbound') === '1') {
    const inbound = await q('SELECT * FROM inbound_emails ORDER BY id DESC LIMIT 50');
    return NextResponse.json({ success: true, count: inbound.length, emails: inbound });
  }

  const [countRow] = await q('SELECT COUNT(*) as c FROM inbound_emails');

  return NextResponse.json({
    service: 'Resend Email Service',
    status: isConfigured ? 'configured' : 'missing_api_key',
    configured: isConfigured,
    from: process.env.MAIL_FROM || 'Pleasant View Schools <info@pleasantviewschools.co.ke>',
    defaultTo: process.env.SCHOOL_EMAIL || 'info@pleasantviewschools.co.ke',
    inboundEmailCount: countRow ? Number(countRow.c) : 0,
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

    // 1. Detect and handle INBOUND EMAIL webhook from Resend or admissions
    if (
      body.type === 'email.received' ||
      body.event === 'email.received' ||
      body.direction === 'inbound' ||
      (body.from && body.subject && !body.to)
    ) {
      const sender = typeof body.from === 'object' ? (body.from.email || JSON.stringify(body.from)) : String(body.from || '');
      const senderName = body.name || (typeof body.from === 'object' ? body.from.name : '') || sender.split('@')[0];
      const recipient = body.to || body.recipient || process.env.SCHOOL_EMAIL || 'info@pleasantviewschools.co.ke';
      const subject = body.subject || 'Inbound Inquiry';
      const text = body.text || body.body || '';
      const html = body.html || '';

      const recipientStr = Array.isArray(recipient) ? recipient.join(', ') : String(recipient);

      await q(
        'INSERT INTO inbound_emails(sender_name, sender_email, recipient, subject, body, html, status) VALUES(?,?,?,?,?,?,?)',
        [senderName, sender, recipientStr, subject, text, html, 'received']
      );
      await q(
        'INSERT INTO comm_logs(type, direction, sender, recipient, subject, content, status) VALUES(?,?,?,?,?,?,?)',
        ['email', 'inbound', sender, recipientStr, subject, text, 'received']
      );

      // Check for automated routing, auto-responder, and forwarding
      try {
        const [acc] = await q('SELECT * FROM email_accounts WHERE lower(email)=? AND is_active=1', [recipientStr.toLowerCase().trim()]);
        if (acc) {
          if (acc.auto_reply && sender) {
            await sendEmail({
              to: sender,
              from: `Pleasant View ${acc.department || 'Schools'} <${acc.email}>`,
              subject: `Re: ${subject}`,
              text: acc.auto_reply
            });
          }
          if (acc.forward_to) {
            await sendEmail({
              to: acc.forward_to,
              subject: `[FWD to ${acc.email}] ${subject}`,
              text: `Forwarded inbound message from ${senderName} <${sender}> to ${acc.email}:\n\n${text}`
            });
          }
        }
      } catch (routingErr) {
        console.warn('[Resend Routing] Auto-responder/forwarding note:', routingErr.message);
      }

      return NextResponse.json({
        success: true,
        service: 'Resend',
        event: 'inbound_email_received',
        sender,
        subject,
        message: 'Inbound email logged successfully to Central Admin inbox'
      });
    }

    // 2. Outbound email dispatch
    const { to, subject, text, html, name } = body;

    const result = await sendEmail({
      to: to || process.env.SCHOOL_EMAIL,
      subject: subject || 'Pleasant View Schools Test Email',
      text: text || `Hello ${name || 'Parent'}, this is a verified email from Pleasant View Schools via Resend.`,
      html: html || undefined,
      name
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          service: 'Resend',
          error: result.error,
          hint: !process.env.RESEND_API_KEY ? 'Please set RESEND_API_KEY in .env.local or production environment' : undefined
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      service: 'Resend',
      message: 'Email dispatched successfully',
      data: result.data
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, service: 'Resend', error: err.message },
      { status: 500 }
    );
  }
}
