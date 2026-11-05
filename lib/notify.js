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

export async function sendEmail({ to, from: customFrom, subject, text, html }) {
  // Check process.env first (Cloudflare Pages Environment Variables)
  let apiKey = (process.env.RESEND_API_KEY || '').trim();
  let customFromSetting = (process.env.MAIL_FROM || process.env.RESEND_FROM || '').trim();

  // Also allow fallback to database settings table so admin can configure key directly in portal
  if (!apiKey) {
    try {
      const [resendRow] = await q('SELECT v FROM settings WHERE k="resend_api_key"');
      if (resendRow?.v) apiKey = resendRow.v.trim();
      const [fromRow] = await q('SELECT v FROM settings WHERE k="resend_from"');
      if (fromRow?.v) customFromSetting = fromRow.v.trim();
    } catch {}
  }

  const targetEmail = (to || process.env.ADMIN_EMAIL || 'info@pleasantviewschools.co.ke').trim();
  const from = customFrom || customFromSetting || 'Pleasant View Schools <info@pleasantviewschools.co.ke>';

  if (!apiKey) {
    console.warn('[Resend] Warning: RESEND_API_KEY is not configured in Cloudflare Pages or Portal Settings.');
    return {
      success: false,
      error: 'RESEND_API_KEY is not configured. Please add RESEND_API_KEY in Cloudflare Pages Dashboard (Settings > Environment variables) or in Portal Security Settings.'
    };
  }

  try {
    // Native fetch for Cloudflare Worker runtime resilience
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [targetEmail],
        subject: subject || 'Pleasant View Schools Notification',
        text: text || '',
        ...(html ? { html } : {})
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[Resend API Error]:', data);
      // Graceful fallback: If custom domain pleasantviewschools.co.ke is not yet DNS-verified in Resend,
      // retry dispatch using Resend verified sandbox sender onboarding@resend.dev
      if ((data?.message?.toLowerCase().includes('domain') || data?.message?.toLowerCase().includes('verify')) && !from.includes('onboarding@resend.dev')) {
        console.warn('[Resend] Retrying with onboarding@resend.dev sandbox sender...');
        try {
          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Pleasant View Schools <onboarding@resend.dev>',
              to: [targetEmail],
              subject: subject || 'Pleasant View Schools Notification',
              text: text || '',
              ...(html ? { html } : {})
            })
          });
          const retryData = await retryRes.json().catch(() => ({}));
          if (retryRes.ok) {
            console.log('[Resend] Fallback sandbox dispatch succeeded to:', targetEmail);
            return { success: true, data: retryData };
          }
        } catch {}
      }

      return {
        success: false,
        error: data?.message || data?.error || `Resend dispatch failed with status ${res.status}.`
      };
    }

    console.log('[Resend] Email sent successfully to:', targetEmail, data);
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

    return { success: true, data };
  } catch (err) {
    console.error('[Resend Network Error]:', err?.message);
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
    return { success: false, error: err?.message || 'Network error communicating with Resend API.' };
  }
}

export async function sendSMS({ to, message }) {
  let apiKey = (process.env.AT_API_KEY || process.env.AFRICASTALKING_API_KEY || '').trim();
  let username = (process.env.AT_USERNAME || process.env.AFRICASTALKING_USERNAME || 'sandbox').trim();
  let senderId = (process.env.AT_SENDER_ID || process.env.AFRICASTALKING_SENDER_ID || '').trim();
  const formattedPhone = formatKenyanPhone(to);

  if (!apiKey) {
    try {
      const [atKeyRow] = await q('SELECT v FROM settings WHERE k="at_api_key"');
      if (atKeyRow?.v) apiKey = atKeyRow.v.trim();
      const [atUserRow] = await q('SELECT v FROM settings WHERE k="at_username"');
      if (atUserRow?.v) username = atUserRow.v.trim();
      const [senderRow] = await q('SELECT v FROM settings WHERE k="at_sender_id"');
      if (senderRow?.v) senderId = senderRow.v.trim();
    } catch {}
  }

  if (!apiKey) {
    console.warn("[Africa's Talking] Warning: AT_API_KEY is not configured.");
    return { success: false, error: 'AT_API_KEY is not configured in Cloudflare Pages or Portal Settings.' };
  }

  if (!formattedPhone) {
    return { success: false, error: 'Invalid recipient phone number.' };
  }

  const finalMessage = message.startsWith('Pleasant View') ? message : `Pleasant View Schools: ${message}`;

  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('to', formattedPhone);
    params.append('message', finalMessage);
    if (senderId) params.append('from', senderId);

    const endpoint = username === 'sandbox'
      ? 'https://api.sandbox.africastalking.com/version1/messaging'
      : 'https://api.africastalking.com/version1/messaging';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apiKey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    const data = await res.json().catch(() => ({}));
    console.log("[Africa's Talking] SMS dispatch response:", data);

    try {
      await q('INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)', [
        'sms',
        'outbound',
        senderId || 'Pleasant View',
        formattedPhone,
        finalMessage,
        res.ok ? 'sent' : 'failed'
      ]);
    } catch {}

    return { success: res.ok, data };
  } catch (err) {
    console.error("[Africa's Talking] Error sending SMS:", err?.message);
    return { success: false, error: err?.message || 'Error communicating with SMS gateway.' };
  }
}

export async function notify({ name, phone, email, subject, text, sms, to }) {
  const results = { email: null, studentEmail: null, sms: null };

  results.email = await sendEmail({
    to: to || process.env.SCHOOL_EMAIL,
    subject: subject || 'New Admissions Enquiry',
    text: text || `${name} submitted an enquiry.\nPhone: ${phone}\nEmail: ${email}`
  });

  if (email) {
    results.studentEmail = await sendEmail({
      to: email,
      subject: 'Pleasant View Schools: ' + (subject || 'Enquiry Received'),
      text: `Dear ${name || 'Parent/Guardian'},\n\n${sms || 'Thank you for reaching out to Pleasant View Schools. We have received your inquiry and our admissions team will be in touch shortly.'}\n\nWarm regards,\nAdmissions Office\nPleasant View Schools\nGithunguri, Kiambu County\nTel: +254 711 689 913`
    });
  }

  if (phone) {
    results.sms = await sendSMS({
      to: phone,
      message: sms || `Hi ${name || 'Parent'}, your message has been received by Pleasant View Schools. Admissions will contact you shortly.`
    });
  }

  return results;
}
