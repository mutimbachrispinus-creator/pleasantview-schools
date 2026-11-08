import { q, qWrite } from './db.js';
import { sendEmail } from './notify.js';

/**
 * Extracts a clean email address from string formats like:
 * "Dr. Elizabeth <elizabeth@gmail.com>" -> "elizabeth@gmail.com"
 * "<parent@yahoo.com>" -> "parent@yahoo.com"
 */
export function extractCleanEmail(raw) {
  if (!raw) return '';
  const str = Array.isArray(raw) ? raw[0] : String(raw);
  const match = str.match(/<([^>]+)>/);
  if (match && match[1]) {
    return match[1].trim().toLowerCase();
  }
  return str.replace(/["']/g, '').trim().toLowerCase();
}

/**
 * Checks whether an incoming sender should be excluded from auto-replies
 * to prevent automated loops, mailer-daemon bounces, or spam floods.
 */
export function shouldSkipAutoReply({ senderEmail, subject = '' }) {
  if (!senderEmail || !senderEmail.includes('@')) return true;

  const emailLower = senderEmail.toLowerCase().trim();
  const subjectLower = subject.toLowerCase().trim();

  // 1. Never auto-reply to own domain (prevents internal loops)
  if (emailLower.endsWith('@pleasantviewschools.co.ke')) {
    return true;
  }

  // 2. Automated daemon / bounce / noreply headers
  const blockedPatterns = [
    'no-reply',
    'noreply',
    'mailer-daemon',
    'mail-daemon',
    'postmaster',
    'bounce',
    'notification',
    'notifications@',
    'resend.dev',
    'onboarding@resend.dev',
    'daemon@',
    'system@',
    'automated@'
  ];

  if (blockedPatterns.some(pattern => emailLower.includes(pattern))) {
    return true;
  }

  // 3. Skip if subject indicates an auto-responder loop
  if (
    subjectLower.startsWith('auto-reply:') ||
    subjectLower.startsWith('automatic reply:') ||
    subjectLower.startsWith('out of office') ||
    subjectLower.startsWith('undelivered mail') ||
    subjectLower.startsWith('delivery status notification')
  ) {
    return true;
  }

  return false;
}

/**
 * Department-specific auto-reply templates tailored to each mailbox
 */
export const DEPARTMENT_AUTO_REPLIES = {
  admissions: {
    department: 'Admissions Office & Enrollment Registrar',
    title: 'Admissions & Enrollment Desk',
    subject: 'Acknowledgment: Admissions Inquiry Received — Pleasant View Schools',
    badge: 'ADMISSIONS & STUDENT ENROLLMENT',
    defaultMessage: `Thank you for your interest in enrolling your child at Pleasant View Schools. We have received your inquiry and our admissions team is currently reviewing your message.

Our admissions desk coordinates intake across all educational levels:
• Early Learning Centre (Playgroup, PP1, and PP2)
• Primary School (Grade 1 through Grade 6)
• Junior Secondary School (JSS Grade 7, 8, and 9 CBE Curriculum)
• Senior Girls' High School (Form 1 through Form 4 KCSE & University Prep)

An admissions advisor will contact you within 24 business hours to guide you through interview scheduling, entrance assessments, and fee schedules.

If you wish to visit our campus in Githunguri, Kiambu County, you are warmly invited to book a personalized tour at:
https://pleasantviewschools.co.ke/contact#visit`
  },

  info: {
    department: 'Information & General Helpdesk',
    title: 'School Reception & Information Desk',
    subject: 'Acknowledgment: Inquiry Received — Pleasant View Schools',
    badge: 'CENTRAL INFORMATION DESK',
    defaultMessage: `Thank you for contacting Pleasant View Schools. This automated acknowledgment confirms that your message has been received at our central reception.

Our administrative office is in session Monday through Friday from 8:00 AM to 5:00 PM and Saturday from 9:00 AM to 1:00 PM EAT. A member of our team will attend to your request and reply shortly.

For urgent matters or immediate telephone assistance, please reach our administrative desk at +254 711 689 913 or message our official WhatsApp hotline.`
  },

  accounts: {
    department: 'Finance & Bursar Desk',
    title: 'Accounts & Bursar Department',
    subject: 'Acknowledgment: Financial Inquiry Received — Pleasant View Accounts',
    badge: 'FINANCE & BURSAR DESK',
    defaultMessage: `Thank you for contacting the Pleasant View Schools Accounts & Finance Department.

Your inquiry regarding school fees, billing, or financial verification has been logged. To ensure swift reconciliation, please ensure you have provided:
• Student's Full Official Name
• Student Admission Number
• Campus Branch / Class / Form

Our finance officers will review your transaction records and respond with official confirmation within one business day.`
  },

  finance: {
    department: 'Finance & Bursar Desk',
    title: 'Accounts & Bursar Department',
    subject: 'Acknowledgment: Financial Inquiry Received — Pleasant View Accounts',
    badge: 'FINANCE & BURSAR DESK',
    defaultMessage: `Thank you for contacting the Pleasant View Schools Accounts & Finance Department.

Your inquiry regarding school fees, billing, or financial verification has been logged. To ensure swift reconciliation, please ensure you have provided:
• Student's Full Official Name
• Student Admission Number
• Campus Branch / Class / Form

Our finance officers will review your transaction records and respond with official confirmation within one business day.`
  },

  support: {
    department: 'Technical, Systems & Parent Portal Helpdesk',
    title: 'ICT & Parent Support Desk',
    subject: 'Acknowledgment: Support Ticket Opened — Pleasant View Helpdesk',
    badge: 'TECHNICAL & PORTAL SUPPORT',
    defaultMessage: `Thank you for reaching out to the Pleasant View Schools Technical Support & ICT Helpdesk.

We have received your support request regarding portal access, student credentials, or system inquiries. Our technical team is actively reviewing your request and will provide guidance shortly.

If you are experiencing difficulty signing into your portal, you can reset your credentials directly using the OTP verification feature on the portal login page.`
  },

  principal: {
    department: 'Office of the Executive Principal & Board of Directors',
    title: 'Office of the Principal',
    subject: 'Acknowledgment: Correspondence to Office of the Principal — Pleasant View Schools',
    badge: 'EXECUTIVE GOVERNANCE & PRINCIPAL',
    defaultMessage: `You have contacted the Office of the Executive Principal & Board of Directors, Pleasant View Schools.

Your correspondence has been securely received by executive leadership. All communications directed to the Principal are treated with the highest degree of diligence, confidentiality, and institutional care.

The Principal's administrative secretary will review your correspondence and arrange appropriate follow-up.`
  },

  senior: {
    department: 'Pleasant View Senior School (Girls\' High School)',
    title: 'Senior School Academic Administration',
    subject: 'Acknowledgment: Senior School Inquiry — Pleasant View Senior School',
    badge: 'SENIOR GIRLS\' HIGH SCHOOL',
    defaultMessage: `Thank you for contacting Pleasant View Senior School (distinguished Girls' High School).

We have received your inquiry regarding our senior academic programs, historic KCSE performance, modern boarding accommodations, and university-readiness pathways in STEM and the Arts.

Our Senior School academic director and pastoral team will respond with full details shortly.`
  },

  junior: {
    department: 'Pleasant View Junior Secondary School (JSS)',
    title: 'Junior Secondary Administration',
    subject: 'Acknowledgment: Junior Secondary Inquiry — Pleasant View JSS',
    badge: 'JUNIOR SECONDARY SCHOOL (JSS)',
    defaultMessage: `Thank you for contacting Pleasant View Junior Secondary School.

We have received your message regarding Grade 7, 8, and 9 CBE curriculum pathways, state-of-the-art laboratory facilities, continuous assessment series, and boarding accommodations.

Our JSS academic coordinator will be in touch with you shortly.`
  },

  primary: {
    department: 'Pleasant View Primary School',
    title: 'Primary School Administration',
    subject: 'Acknowledgment: Primary School Inquiry — Pleasant View Primary',
    badge: 'PRIMARY SCHOOL (GRADES 1–6)',
    defaultMessage: `Thank you for reaching out to Pleasant View Primary School.

We have received your inquiry concerning our primary school learners (Grade 1 through Grade 6), curriculum activities, pastoral care, and co-curricular programs.

Our primary school head teacher will review your request and reply promptly.`
  },

  early: {
    department: 'Pleasant View Early Learning Centre',
    title: 'Early Learning Administration',
    subject: 'Acknowledgment: Early Learning Inquiry — Pleasant View Early Learning',
    badge: 'EARLY LEARNING CENTRE (ECD)',
    defaultMessage: `Thank you for contacting the Pleasant View Early Learning Centre.

We cherish every opportunity to partner with parents in giving our youngest learners (Playgroup, PP1, and PP2) a nurturing, joyful, and foundational start to their educational journey.

Our early childhood educators will reach out to welcome you and answer your questions.`
  },

  admin: {
    department: 'Central Administration',
    title: 'Central Administrative Desk',
    subject: 'Acknowledgment: Correspondence Received — Pleasant View Central Administration',
    badge: 'CENTRAL ADMINISTRATION',
    defaultMessage: `Thank you for contacting Pleasant View Schools Central Administration.

Your message has been logged into our central administrative registry and assigned to the relevant department head for immediate attention. A staff member will respond to you within one business day.`
  }
};

/**
 * Resolves the relevant departmental profile and auto-reply message for any target email address.
 */
export async function resolveAutoReplyConfig(rawRecipient) {
  const cleanRecipient = extractCleanEmail(rawRecipient);
  const prefix = cleanRecipient.split('@')[0].toLowerCase().trim();

  // 1. Check if a customized record exists in email_accounts table
  let dbAccount = null;
  try {
    const rows = await q("SELECT * FROM email_accounts WHERE lower(email) = ? AND is_active = 1", [cleanRecipient]);
    if (rows && rows.length > 0) {
      dbAccount = rows[0];
    }
  } catch (err) {
    console.warn('[AutoReply DB Check Warning]:', err?.message);
  }

  // 2. Match department template
  const matchedKey = Object.keys(DEPARTMENT_AUTO_REPLIES).find(k => prefix.includes(k)) || 'admin';
  const template = DEPARTMENT_AUTO_REPLIES[matchedKey] || DEPARTMENT_AUTO_REPLIES.admin;

  const departmentName = dbAccount?.department || template.department;
  const displayName = dbAccount?.display_name || template.title;
  const badge = template.badge;
  const forwardTo = dbAccount?.forward_to || '';

  // Use custom auto-reply if configured, otherwise use department template
  const customReply = dbAccount?.auto_reply?.trim();
  const autoReplyText = (customReply && customReply.length > 5) ? customReply : template.defaultMessage;
  const subjectPrefix = template.subject;

  return {
    email: dbAccount?.email || cleanRecipient,
    department: departmentName,
    displayName,
    badge,
    forwardTo,
    autoReplyText,
    subjectPrefix
  };
}

/**
 * Builds responsive, branded HTML email for the auto-reply
 */
export function buildAutoReplyHtml({
  senderName = 'Parent / Guardian',
  recipientEmail,
  departmentName,
  badge,
  originalSubject = 'Inquiry',
  messageText
}) {
  const paragraphs = String(messageText || '')
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      // Format bullet lines nicely
      if (p.includes('\n•') || p.startsWith('•')) {
        const items = p.split('\n').filter(Boolean).map(li => `<li style="margin-bottom: 6px;">${li.replace(/^[•\-\*]\s*/, '')}</li>`).join('');
        return `<ul style="margin: 12px 0 16px 20px; padding: 0; color: #334155; font-size: 14px; line-height: 1.6;">${items}</ul>`;
      }
      return `<p style="margin: 0 0 14px 0; color: #334155; font-size: 14.5px; line-height: 1.65;">${p.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pleasant View Schools Official Acknowledgment</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- MAIN CONTAINER -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E232A 0%, #0d1117 100%); padding: 26px 30px; text-align: center; border-bottom: 3px solid #8B1E2D;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <img src="https://pleasantviewschools.co.ke/images/pvs_crest.png" alt="Pleasant View Schools Crest" width="60" height="74" style="display: block; margin-bottom: 12px; max-width: 60px; height: auto;" />
                    <h1 style="margin: 0; color: #ffffff; font-size: 19px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">
                      PLEASANT VIEW SCHOOLS
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #D4AF37; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                      OUR AIM IS VICTORY &bull; EST. 1998
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DEPARTMENT SUB-BAR -->
          <tr>
            <td style="background-color: #8B1E2D; padding: 8px 30px; text-align: center;">
              <span style="color: #ffffff; font-size: 11.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">
                ${badge}
              </span>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 32px 30px 24px 30px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #1E232A;">
                Dear ${senderName || 'Parent / Guardian'},
              </p>

              ${paragraphs}

              <!-- CALLOUT BOX: CONTACT CARDS -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0 20px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px 20px;">
                <tr>
                  <td>
                    <h4 style="margin: 0 0 10px 0; color: #1E232A; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                      Direct Departmental Contacts:
                    </h4>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 12.5px; color: #475569; line-height: 1.8;">
                      <tr>
                        <td width="30" valign="top">&#128222;</td>
                        <td><strong>Main Telephone:</strong> <a href="tel:+254711689913" style="color: #8B1E2D; text-decoration: none; font-weight: 600;">+254 711 689 913</a></td>
                      </tr>
                      <tr>
                        <td width="30" valign="top">&#128172;</td>
                        <td><strong>Official WhatsApp:</strong> <a href="https://wa.me/254711689913" style="color: #15803d; text-decoration: none; font-weight: 600;">Message +254 711 689 913</a></td>
                      </tr>
                      <tr>
                        <td width="30" valign="top">&#128205;</td>
                        <td><strong>Campus Location:</strong> Githunguri, Kiambu County, Kenya</td>
                      </tr>
                      <tr>
                        <td width="30" valign="top">&#127979;</td>
                        <td><strong>Official Website:</strong> <a href="https://pleasantviewschools.co.ke" style="color: #05286B; text-decoration: underline; font-weight: 600;">pleasantviewschools.co.ke</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- SIGN-OFF -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 18px;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13.5px; font-weight: 700; color: #1E232A;">
                      Warm regards,
                    </p>
                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #475569;">
                      <strong>${departmentName}</strong><br/>
                      Pleasant View Schools Group
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11.5px; color: #94a3b8; line-height: 1.5;">
                This automated confirmation was generated in response to your email regarding <em>"${originalSubject}"</em>.<br/>
                &copy; ${new Date().getFullYear()} Pleasant View Schools. All rights reserved. Githunguri, Kiambu County.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Dispatches an automated, relevant departmental response to an inbound email.
 * Handles auto-reply, loop prevention, and forwarding.
 */
export async function triggerDepartmentalAutoReply({
  senderName,
  senderEmail,
  recipientEmail,
  subject = 'Inquiry',
  body = ''
}) {
  const cleanSender = extractCleanEmail(senderEmail);
  const cleanRecipient = extractCleanEmail(recipientEmail);

  if (shouldSkipAutoReply({ senderEmail: cleanSender, subject })) {
    console.log(`[AutoReply Skipped]: Skipping automated response to ${cleanSender} (${subject})`);
    return { skipped: true, reason: 'Anti-loop or automated sender check' };
  }

  // Resolve department profile & message
  const config = await resolveAutoReplyConfig(cleanRecipient);

  const replySubject = subject.startsWith('Re:')
    ? subject
    : `Re: ${subject} — ${config.displayName}`;

  const html = buildAutoReplyHtml({
    senderName: senderName || 'Parent / Guardian',
    recipientEmail: config.email,
    departmentName: config.department,
    badge: config.badge,
    originalSubject: subject,
    messageText: config.autoReplyText
  });

  const fromSender = `Pleasant View ${config.department} <${config.email}>`;

  try {
    const sendRes = await sendEmail({
      to: cleanSender,
      from: fromSender,
      subject: replySubject,
      text: config.autoReplyText,
      html
    });

    console.log(`[AutoReply Dispatched]: Sent ${config.badge} response from ${config.email} to ${cleanSender}`);

    // If department has a forward_to address, forward the original message
    if (config.forwardTo && config.forwardTo.includes('@') && extractCleanEmail(config.forwardTo) !== cleanSender) {
      try {
        await sendEmail({
          to: config.forwardTo,
          from: fromSender,
          subject: `[FWD to ${config.email}] ${subject}`,
          text: `Forwarded inbound message from ${senderName || 'Sender'} <${cleanSender}> to ${config.email}:\n\n${body}`
        });
      } catch (fwdErr) {
        console.warn('[AutoReply Forwarding Warning]:', fwdErr?.message);
      }
    }

    return {
      success: true,
      autoReplied: true,
      sender: cleanSender,
      recipient: config.email,
      department: config.department,
      forwarded: Boolean(config.forwardTo)
    };
  } catch (err) {
    console.error('[AutoReply Dispatch Error]:', err?.message);
    return { success: false, error: err?.message };
  }
}
