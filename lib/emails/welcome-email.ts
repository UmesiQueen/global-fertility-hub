import { siteConfig } from "@/lib/site-config";

/**
 * Welcome email for new community members.
 *
 * Written as an HTML string rather than with React Email — email clients need
 * table layouts and inline styles, so a component library buys little here and
 * adds a dependency plus a render step to the request path.
 *
 * Two things this template gets right, and must keep getting right:
 *
 * 1. The mailing-list paragraph only appears if the member actually ticked the
 *    consent box. Telling someone they've been subscribed when they declined
 *    is both a compliance failure and a trust failure.
 * 2. The tone stays warm and plain. The reader may be having a hard time; this
 *    is not the place for exclamation marks and marketing energy.
 */

export interface WelcomeEmailInput {
  fullName: string;
  memberId: string;
  marketingConsent: boolean;
  alreadyMember: boolean;
  communityUrl: string;
}

/** First name only — "Hi Sarah" reads warmer than "Hi Sarah Whitfield". */
function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

/** Email clients are an injection surface; escape anything user-supplied. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function welcomeEmailSubject(input: WelcomeEmailInput): string {
  return input.alreadyMember
    ? `You're already part of the community — here's your member ID`
    : `Welcome to ${siteConfig.name}`;
}

export function welcomeEmailText(input: WelcomeEmailInput): string {
  const name = firstName(input.fullName);

  return [
    `Hi ${name},`,
    "",
    input.alreadyMember
      ? "It looks like you'd already joined us — so rather than sign you up twice, here's your member ID again."
      : "Thank you for joining the Global Fertility Hub community. We're really glad you're here.",
    "",
    `Your member ID is ${input.memberId}`,
    "",
    "Keep this somewhere safe. If you ever book a consultation or use one of our services, quoting it helps us find you quickly.",
    "",
    "Join the conversation on Instagram:",
    input.communityUrl,
    "",
    input.marketingConsent
      ? "You've also opted into our mailing list, so you'll hear from us with updates, story times and exclusive partner discounts. You can unsubscribe from any email."
      : "You haven't opted into our mailing list, so we'll only email you when it's about something you've asked for. You can opt in any time by replying to this email.",
    "",
    "Whatever stage you're at, you're not doing this alone.",
    "",
    "Henry & Precious",
    siteConfig.name,
    "",
    "---",
    `${siteConfig.name} is an educational platform, not a clinic. Nothing we send is medical advice.`,
  ].join("\n");
}

export function welcomeEmailHtml(input: WelcomeEmailInput): string {
  const name = escapeHtml(firstName(input.fullName));
  const memberId = escapeHtml(input.memberId);
  const communityUrl = escapeHtml(input.communityUrl);

  const opening = input.alreadyMember
    ? "It looks like you&rsquo;d already joined us &mdash; so rather than sign you up twice, here&rsquo;s your member ID again."
    : `Thank you for joining the ${escapeHtml(siteConfig.name)} community. We&rsquo;re really glad you&rsquo;re here.`;

  const mailingListParagraph = input.marketingConsent
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a4459;">
         You&rsquo;ve also opted into our mailing list, so you&rsquo;ll hear from us with updates,
         story times and exclusive partner discounts. You can unsubscribe from any email.
       </p>`
    : `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a4459;">
         You haven&rsquo;t opted into our mailing list, so we&rsquo;ll only email you about things
         you&rsquo;ve asked for. If you change your mind, just reply to this email.
       </p>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Welcome to ${escapeHtml(siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background:#faf7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <!-- Preview text: what shows in the inbox list before opening. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your member ID is ${memberId} &mdash; and here&rsquo;s the link to our Instagram community.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:36px 32px;">
          <tr><td>
            <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#2c1d63;">
              ${escapeHtml(siteConfig.name)}
            </p>

            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1c1730;">
              ${input.alreadyMember ? "You&rsquo;re already with us" : `Welcome, ${name}`}
            </h1>

            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a4459;">${opening}</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#f4f1fa;border-radius:12px;">
              <tr><td style="padding:20px;text-align:center;">
                <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b6580;">
                  Your member ID
                </p>
                <p style="margin:0;font-family:'SF Mono',Consolas,monospace;font-size:24px;font-weight:bold;letter-spacing:.06em;color:#2c1d63;">
                  ${memberId}
                </p>
              </td></tr>
            </table>

            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a4459;">
              Keep this somewhere safe. If you ever book a consultation or use one of our
              services, quoting it helps us find you quickly.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr><td style="background:#2c1d63;border-radius:10px;">
                <a href="${communityUrl}"
                   style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                  Join our Instagram community
                </a>
              </td></tr>
            </table>

            <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#6b6580;">
              If the button doesn&rsquo;t work, use this link:<br>
              <a href="${communityUrl}" style="color:#2c1d63;">${communityUrl}</a>
            </p>

            ${mailingListParagraph}

            <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#4a4459;">
              Whatever stage you&rsquo;re at, you&rsquo;re not doing this alone.
            </p>

            <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#1c1730;">
              Henry &amp; Precious
            </p>
          </td></tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;padding:20px 32px;">
          <tr><td style="text-align:center;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#8b8599;">
              ${escapeHtml(siteConfig.name)} is an educational platform, not a clinic.
              Nothing we send is medical advice &mdash; please talk to your healthcare
              team about your care.
            </p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
