import { q } from './db.js';

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

export function getCloudflareEnv() {
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext?.();
    return ctx?.env || {};
  } catch {
    return {};
  }
}

export function getEnvValue(...keys) {
  const cfEnv = getCloudflareEnv();
  for (const k of keys) {
    if (process.env[k]?.trim()) return process.env[k].trim();
    if (cfEnv[k]?.trim()) return cfEnv[k].trim();
  }
  return '';
}

export async function getTelecomCredentials() {
  let apiKey = getEnvValue(
    'AT_API_KEY',
    'AFRICASTALKING_API_KEY',
    'AFRICA_TALKING_API_KEY',
    'AFRICAS_TALKING_API_KEY',
    'AT_KEY',
    'AFRICASTALKING_KEY',
    'AFRICA_TALKING_KEY',
    'AFRICAS_TALKING_KEY'
  );

  let username = getEnvValue(
    'AT_USERNAME',
    'AFRICASTALKING_USERNAME',
    'AFRICA_TALKING_USERNAME',
    'AFRICAS_TALKING_USERNAME',
    'AT_USER',
    'AFRICASTALKING_USER',
    'AFRICA_TALKING_USER'
  );

  let senderId = getEnvValue(
    'AT_SENDER_ID',
    'AFRICASTALKING_SENDER_ID',
    'AFRICA_TALKING_SENDER_ID',
    'AFRICAS_TALKING_SENDER_ID',
    'AT_SENDER'
  );

  let apiKeySource = apiKey ? 'environment' : null;
  let usernameSource = username ? 'environment' : null;

  // Fallback to database settings table (using parameterized / single-quoted SQL)
  if (!apiKey || !username || !senderId) {
    try {
      const rows = await q("SELECT k, v FROM settings WHERE k IN ('at_api_key', 'at_username', 'at_sender_id')");
      for (const row of rows) {
        if (row.k === 'at_api_key' && !apiKey && row.v?.trim()) {
          apiKey = row.v.trim();
          apiKeySource = 'database';
        }
        if (row.k === 'at_username' && !username && row.v?.trim()) {
          username = row.v.trim();
          usernameSource = 'database';
        }
        if (row.k === 'at_sender_id' && !senderId && row.v?.trim()) {
          senderId = row.v.trim();
        }
      }
    } catch (e) {
      console.warn('[Telecom Settings DB Error]:', e?.message);
    }
  }

  return { apiKey, username, senderId, apiKeySource, usernameSource };
}

export async function getResendCredentials() {
  let apiKey = getEnvValue('RESEND_API_KEY', 'RESEND_KEY');
  let customFromSetting = getEnvValue('MAIL_FROM', 'RESEND_FROM');
  let apiKeySource = apiKey ? 'environment' : null;

  if (!apiKey || !customFromSetting) {
    try {
      const [resendRow] = await q("SELECT v FROM settings WHERE k = 'resend_api_key'");
      if (resendRow?.v?.trim() && !apiKey) {
        apiKey = resendRow.v.trim();
        apiKeySource = 'database';
      }
      const [fromRow] = await q("SELECT v FROM settings WHERE k = 'resend_from'");
      if (fromRow?.v?.trim() && !customFromSetting) {
        customFromSetting = fromRow.v.trim();
      }
    } catch (e) {
      console.warn('[Resend Settings DB Error]:', e?.message);
    }
  }

  return { apiKey, customFromSetting, apiKeySource };
}

export async function sendEmail({ to, from: customFrom, subject, text, html }) {
  const { apiKey, customFromSetting } = await getResendCredentials();

  const targetEmail = (to || getEnvValue('ADMIN_EMAIL') || 'info@pleasantviewschools.co.ke').trim();
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
  // 1. Resolve credentials across Environment Variables, Cloudflare Pages, and DB settings
  const { apiKey, username, senderId } = await getTelecomCredentials();
  const formattedPhone = formatKenyanPhone(to);

  if (!apiKey) {
    console.warn("[Africa's Talking] Warning: AT_API_KEY is not configured.");
    return {
      success: false,
      error: "Africa's Talking API Key (AT_API_KEY) is missing. Please save your API key in the Staff Portal Telecom Settings or configure AT_API_KEY in Cloudflare Pages."
    };
  }

  // Africa's Talking strictly requires an account username in every request alongside the API key
  if (!username) {
    console.warn("[Africa's Talking] Warning: AT_USERNAME is missing.");
    return {
      success: false,
      error: "Africa's Talking Username (AT_USERNAME) is missing. Africa's Talking strictly requires your account username alongside your API key (found at the top right of your Africa's Talking dashboard, e.g. 'pleasantviewschools' or 'sandbox'). Please enter your username in the Telecom Settings field above and click 'Save Telecom Credentials'."
    };
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
    // Only pass 'from' if an approved custom alphanumeric sender ID is configured
    if (senderId) params.append('from', senderId);

    const isSandbox = username.toLowerCase() === 'sandbox';
    const endpoint = isSandbox
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

    const smsData = data?.SMSMessageData;
    const recipient = smsData?.Recipients?.[0];
    const recipientStatus = recipient?.status;
    const errorMessage = smsData?.Message;

    let isSuccess = res.ok && recipientStatus === 'Success';
    let detailedError = null;

    if (!res.ok) {
      detailedError = errorMessage || data?.errorMessage || `HTTP ${res.status}: Failed to reach Africa's Talking gateway.`;
    } else if (recipientStatus && recipientStatus !== 'Success') {
      isSuccess = false;
      if (recipientStatus === 'UserInSandbox') {
        detailedError = 'Africa\'s Talking account is in Sandbox mode. Sandbox mode does NOT deliver real SMS to mobile phones. Please set your live Africa\'s Talking account username (AT_USERNAME) instead of "sandbox".';
      } else if (recipientStatus === 'LowBalance' || recipientStatus === 'InsufficientBalance') {
        detailedError = 'Africa\'s Talking account balance is too low (KES 0.00). Please top up SMS airtime via M-Pesa in your Africa\'s Talking dashboard to enable delivery.';
      } else if (recipientStatus === 'InvalidSenderId') {
        detailedError = `Sender ID "${senderId}" is not approved by mobile carriers. Remove AT_SENDER_ID to use Africa's Talking default approved sender.`;
      } else {
        detailedError = `Africa's Talking status: ${recipientStatus} (${errorMessage || 'SMS was not accepted by mobile carrier'})`;
      }
    } else if (!recipient && errorMessage && errorMessage.toLowerCase().includes('invalid')) {
      isSuccess = false;
      detailedError = errorMessage;
    }

    try {
      await q('INSERT INTO comm_logs(type, direction, sender, recipient, content, status) VALUES(?,?,?,?,?,?)', [
        'sms',
        'outbound',
        senderId || 'Pleasant View',
        formattedPhone,
        finalMessage,
        isSuccess ? 'sent' : 'failed'
      ]);
    } catch {}

    if (!isSuccess) {
      return {
        success: false,
        error: detailedError || 'Africa\'s Talking did not confirm successful delivery.',
        data
      };
    }

    return {
      success: true,
      data,
      cost: recipient?.cost || 'standard',
      messageId: recipient?.messageId
    };
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
