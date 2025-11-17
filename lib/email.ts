import { Resend } from 'resend';

// Initialize Resend (only if API key is provided)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface ContactNotificationEmailData {
  name: string;
  email: string;
  message: string;
  locale: string;
  submittedAt: string;
}

/**
 * Send email notification when new contact form submission arrives
 */
export async function sendContactNotification(data: ContactNotificationEmailData): Promise<boolean> {
  // Skip if Resend is not configured
  if (!resend || !process.env.NOTIFICATION_EMAIL) {
    console.log('Email notifications disabled - RESEND_API_KEY or NOTIFICATION_EMAIL not configured');
    return false;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Contact Message from ${data.name}`,
      html: generateContactNotificationHTML(data),
    });

    console.log(`Email notification sent for contact from ${data.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

/**
 * Generate HTML email template for contact notification
 */
function generateContactNotificationHTML(data: ContactNotificationEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .field {
          margin-bottom: 20px;
        }
        .label {
          font-weight: 600;
          color: #6b7280;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .value {
          background: white;
          padding: 12px 16px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          font-size: 16px;
        }
        .message-value {
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .badge {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Message</h1>
        </div>

        <div class="field">
          <div class="label">From</div>
          <div class="value">${escapeHtml(data.name)}</div>
        </div>

        <div class="field">
          <div class="label">Email</div>
          <div class="value">
            <a href="mailto:${escapeHtml(data.email)}" style="color: #3b82f6; text-decoration: none;">
              ${escapeHtml(data.email)}
            </a>
          </div>
        </div>

        <div class="field">
          <div class="label">Message</div>
          <div class="value message-value">${escapeHtml(data.message)}</div>
        </div>

        <div class="field">
          <div class="label">Details</div>
          <div class="value">
            <span class="badge">Locale: ${data.locale.toUpperCase()}</span>
            <br><br>
            <small style="color: #6b7280;">Submitted: ${data.submittedAt}</small>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from your portfolio contact form.</p>
          <p>Reply directly to <strong>${escapeHtml(data.email)}</strong> to respond to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Escape HTML to prevent XSS in emails
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Send auto-reply to contact form submitter (optional)
 */
export async function sendContactAutoReply(toEmail: string, name: string): Promise<boolean> {
  if (!resend) return false;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Thanks for reaching out!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hi ${escapeHtml(name)}! 👋</h2>
            <p>Thank you for reaching out through my portfolio. I've received your message and will get back to you as soon as possible.</p>
            <p>I typically respond within 24-48 hours.</p>
            <p>Best regards,<br><strong>M. Aldian Rizki Lamani</strong></p>
          </div>
        </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return false;
  }
}
