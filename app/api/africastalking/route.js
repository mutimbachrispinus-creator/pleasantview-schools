import { NextResponse } from 'next/server';
import { sendSMS, formatKenyanPhone } from '@/lib/notify';
import { q, qWrite } from '@/lib/db';
import { syncInboundSmsToAdmissions } from '@/lib/admissions';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const isConfigured = Boolean(process.env.AT_API_KEY || process.env.AFRICASTALKING_API_KEY);
  const { searchParams } = new URL(req.url);

  if (searchParams.get('inbound') === '1') {
    const inbound = await q('SELECT * FROM inbound_sms ORDER BY id DESC LIMIT 50');
    return NextResponse.json({ success: true, count: inbound.length, messages: inbound });
  }

  const [countRow] = await q('SELECT COUNT(*) as c FROM inbound_sms');

  return NextResponse.json({
    service: "Africa's Talking SMS Gateway",
    status: isConfigured ? 'configured' : 'missing_api_key',
    configured: isConfigured,
    username: process.env.AT_USERNAME || process.env.AFRICASTALKING_USERNAME || 'sandbox',
    senderId: process.env.AT_SENDER_ID || process.env.AFRICASTALKING_SENDER_ID || '(default)',
    inboundSmsCount: countRow ? Number(countRow.c) : 0,
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

    // 1. Detect and handle INBOUND SMS from Africa's Talking
    // (AT inbound webhook sends: 'from', 'to', 'text', 'date', 'id', 'linkId')
    if ((body.from && body.text) || body.direction === 'inbound') {
      const sender = formatKenyanPhone(body.from || body.phone || body.sender);
      const receiver = body.to || body.receiver || process.env.SCHOOL_PHONE || '+254711689913';
      const text = String(body.text || body.message || '').trim();
      const rawId = String(body.id || '');

      const smsIns = await qWrite(
        'INSERT INTO inbound_sms(sender, receiver, text, raw_id, status) VALUES(?,?,?,?,?)',
        [sender, receiver, text, rawId, 'received']
      );
      await qWrite(
        'INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)',
        ['sms', 'inbound', sender, receiver, text, 'received']
      );

      // Sync genuine inbound parent SMS inquiries / visit requests into Admissions Enquiries & Campus Visit Bookings
      await syncInboundSmsToAdmissions({
        id: smsIns?.lastInsertRowid ? Number(smsIns.lastInsertRowid) : Date.now(),
        sender,
        receiver,
        text,
        status: 'received'
      });

      console.log(`[Africa's Talking Inbound SMS]: From ${sender}: "${text}"`);

      // Forward inbound parent SMS directly to admin handset phone numbers
      try {
        const [phoneSetting] = await q('SELECT v FROM settings WHERE k="admin_sms_phone"');
        const rawAdminNumbers = String(phoneSetting?.v || process.env.ADMIN_SMS_PHONE || '+254711689913');
        const adminNumbers = rawAdminNumbers.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);
        const forwardMsg = `[Parent SMS] From: ${sender}: "${text.slice(0, 120)}"`;
        for (const num of adminNumbers) {
          // Avoid infinite forwarding loop if the admin himself sent the message
          if (formatKenyanPhone(num) !== sender) {
            await sendSMS({ to: num, message: forwardMsg });
          }
        }
      } catch (fwdErr) {
        console.warn('[Inbound SMS Forwarding Error]:', fwdErr?.message);
      }

      return NextResponse.json({
        success: true,
        service: "Africa's Talking",
        event: 'inbound_sms_received',
        from: sender,
        text,
        message: 'Inbound SMS logged and forwarded to administrator handset'
      });
    }

    // 2. Handle Delivery Reports from Africa's Talking
    if (body.status && (body.phoneNumber || body.id)) {
      console.log("[Africa's Talking Delivery Report]:", body);
      return NextResponse.json({ received: true, event: 'delivery_report' });
    }

    // 3. Outbound SMS dispatch
    const recipient = body.to || body.phone || body.phoneNumber;
    const message = body.message || body.text || 'Welcome to Pleasant View Schools. Your admission request has been logged.';

    if (!recipient) {
      return NextResponse.json(
        { success: false, error: 'Recipient phone number (to/phone) is required' },
        { status: 400 }
      );
    }

    const formatted = formatKenyanPhone(recipient);
    const result = await sendSMS({ to: formatted, message });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          service: "Africa's Talking",
          phone: formatted,
          error: result.error,
          hint: !process.env.AT_API_KEY ? 'Please set AT_API_KEY and AT_USERNAME in .env.local or production environment' : undefined
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      service: "Africa's Talking",
      recipient: formatted,
      message: 'SMS dispatched successfully',
      data: result.data
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, service: "Africa's Talking", error: err.message },
      { status: 500 }
    );
  }
}
