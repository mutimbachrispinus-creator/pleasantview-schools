import { Resend } from 'resend';
import AfricasTalking from 'africastalking';
import { q } from '@/lib/db';

export function formatKenyanPhone(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.slice(1);
  }
  if (cleaned.startsWith('254')) {
    return '+' + cleaned;
  }
  return '+254' + cleaned;
}

export async function sendEmail({ to, subject, text, html, name }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || 'Pleasantview Schools <onboarding@resend.dev>';
  const targetEmail = to || process.env.SCHOOL_EMAIL || 'info@pleasantview.sc.ke';

  if (!apiKey) {
    console.warn('[Resend] Warning: RESEND_API_KEY is not set. Email not dispatched to:', targetEmail);
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const resend = new Resend(apiKey);
    const emailData = {
      from,
      to: [targetEmail],
      subject: subject || 'Pleasantview Schools Notification',
      text: text || '',
      ...(html ? { html } : {})
    };

    const res = await resend.emails.send(emailData);
    console.log('[Resend] Email sent successfully to:', targetEmail, res);
    try {
      await q('INSERT INTO comm_logs(type, direction, sender, recipient, subject, content, status) VALUES(?,?,?,?,?,?,?)', [
        'email',
        'outbound',
        from,
        targetEmail,
        subject || 'Notification',
        text || '',
        'sent'
      ]);
    } catch {}
    return { success: true, data: res };
  } catch (err) {
    console.error('[Resend] Error sending email:', err.message);
    try {
      await q('INSERT INTO comm_logs(type, direction, sender, recipient, subject, content, status) VALUES(?,?,?,?,?,?,?)', [
        'email',
        'outbound',
        from,
        targetEmail,
        subject || 'Notification',
        text || '',
        'failed'
      ]);
    } catch {}
    return { success: false, error: err.message };
  }
}

export async function sendSMS({ to, message }) {
  const apiKey = process.env.AT_API_KEY || process.env.AFRICASTALKING_API_KEY;
  const username = process.env.AT_USERNAME || process.env.AFRICASTALKING_USERNAME || 'sandbox';
  const senderId = process.env.AT_SENDER_ID || process.env.AFRICASTALKING_SENDER_ID;
  const formattedPhone = formatKenyanPhone(to);

  if (!apiKey) {
    console.warn("[Africa's Talking] Warning: AT_API_KEY is not set. SMS not dispatched to:", formattedPhone);
    return { success: false, error: 'AT_API_KEY not configured' };
  }

  if (!formattedPhone) {
    return { success: false, error: 'Invalid recipient phone number' };
  }

  try {
    const at = AfricasTalking({ apiKey, username });
    const smsOptions = {
      to: [formattedPhone],
      message: message.startsWith('Pleasantview') ? message : `Pleasantview Schools: ${message}`
    };

    if (senderId && senderId.trim()) {
      smsOptions.from = senderId.trim();
    }

    const res = await at.SMS.send(smsOptions);
    console.log("[Africa's Talking] SMS sent successfully to:", formattedPhone, res);
    try {
      await q('INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)', [
        'sms',
        'outbound',
        senderId || 'Pleasantview',
        formattedPhone,
        smsOptions.message,
        'sent'
      ]);
    } catch {}
    return { success: true, data: res };
  } catch (err) {
    console.error("[Africa's Talking] Error sending SMS:", err.message);
    try {
      await q('INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)', [
        'sms',
        'outbound',
        senderId || 'Pleasantview',
        formattedPhone,
        message,
        'failed'
      ]);
    } catch {}
    return { success: false, error: err.message };
  }
}

export async function notify({ name, phone, email, subject, text, sms, to }) {
  const results = { email: null, studentEmail: null, sms: null };

  // 1. Notify School Admissions via Resend
  results.email = await sendEmail({
    to: to || process.env.SCHOOL_EMAIL,
    subject: subject || 'New Admissions Enquiry',
    text: text || `${name} submitted an enquiry.\nPhone: ${phone}\nEmail: ${email}`
  });

  // 2. Notify Parent via Email (if email provided)
  if (email) {
    results.studentEmail = await sendEmail({
      to: email,
      subject: 'Pleasantview Schools: ' + (subject || 'Enquiry Received'),
      text: `Dear ${name || 'Parent/Guardian'},\n\n${sms || 'Thank you for reaching out to Pleasantview Schools. We have received your inquiry and our admissions team will be in touch shortly.'}\n\nWarm regards,\nAdmissions Office\nPleasantview Schools\nGithunguri, Kiambu County\nTel: +254 711 689 913`
    });
  }

  // 3. Notify Parent via SMS (Africa's Talking)
  if (phone) {
    results.sms = await sendSMS({
      to: phone,
      message: sms || `Hi ${name || 'Parent'}, your message has been received by Pleasantview Schools. Admissions will contact you shortly.`
    });
  }

  return results;
}
