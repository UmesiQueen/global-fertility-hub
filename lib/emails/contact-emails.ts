import { siteConfig } from "@/lib/site-config";
import { topicLabel } from "@/lib/validation/contact";

/**
 * Contact form emails: an acknowledgement to the sender, and the message
 * itself to Henry & Precious.
 *
 * The acknowledgement is deliberately short and warm. Someone who has just
 * described a miscarriage in a text box does not want a cheerful auto-reply
 * with a support-ticket number. It confirms we got it, says a human will read
 * it, and gets out of the way.
 */

export interface ContactEmailInput {
  topic: string;
  fullName: string;
  email: string;
  subject?: string;
  message: string;
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------------------------------------ sender ack */

export function contactAckSubject(): string {
  return "We've got your message";
}

export function contactAckText(input: ContactEmailInput): string {
  return [
    `Hi ${firstName(input.fullName)},`,
    "",
    "Thank you for getting in touch. Your message has reached us and one of us will read it properly and reply.",
    "",
    "We're a small team, so it may take us a couple of days — but you will hear back.",
    "",
    "If your message was about something urgent or medical, please speak to your doctor or local health service. We're an educational platform, not a clinic, and we can't help with anything clinical or urgent.",
    "",
    "Henry & Precious",
    siteConfig.name,
  ].join("\n");
}

export function contactAckHtml(input: ContactEmailInput): string {
  const name = escapeHtml(firstName(input.fullName));

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(contactAckSubject())}</title></head>
<body style="margin:0;padding:0;background:#faf7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your message has reached us &mdash; one of us will read it and reply.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:36px 32px;">
        <tr><td>
          <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#2c1d63;">
            ${escapeHtml(siteConfig.name)}
          </p>

          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1c1730;">
            We&rsquo;ve got your message, ${name}
          </h1>

          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a4459;">
            Thank you for getting in touch. One of us will read it properly and
            reply.
          </p>

          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a4459;">
            We&rsquo;re a small team, so it may take a couple of days &mdash; but
            you will hear back.
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-left:3px solid #d9a3b0;">
            <tr><td style="padding:2px 0 2px 14px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#4a4459;">
                If your message was about something <strong style="color:#1c1730;">urgent or medical</strong>,
                please speak to your doctor or local health service. We&rsquo;re an
                educational platform, not a clinic.
              </p>
            </td></tr>
          </table>

          <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#1c1730;">
            Henry &amp; Precious
          </p>
        </td></tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;padding:20px 32px;">
        <tr><td style="text-align:center;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#8b8599;">
            ${escapeHtml(siteConfig.name)} is an educational platform, not a clinic.
            Nothing we send is medical advice.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ---------------------------------------------------------------- internal */

export function contactNotificationSubject(input: ContactEmailInput): string {
  const label = topicLabel(input.topic);
  return input.subject
    ? `[${label}] ${input.subject}`
    : `[${label}] Message from ${input.fullName}`;
}

/**
 * Plain text. Whoever reads this needs to reply from a phone, not admire it.
 * `replyTo` is set to the sender on the send, so replying just works.
 */
export function contactNotificationText(input: ContactEmailInput): string {
  return [
    `Topic:   ${topicLabel(input.topic)}`,
    `From:    ${input.fullName} <${input.email}>`,
    ...(input.subject ? [`Subject: ${input.subject}`] : []),
    "",
    "---",
    input.message,
    "---",
    "",
    "Reply to this email to answer them directly.",
  ].join("\n");
}
