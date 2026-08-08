import { formatDateInZone, formatTimeWithZone } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

/**
 * Consultation booking emails.
 *
 * Two of them: a confirmation to the person who booked, and a notification to
 * Henry & Precious so they can act on it.
 *
 * The requester's email must never say "confirmed". Nothing is confirmed
 * until Henry & Precious say so — this is a request, and the copy holds that
 * line throughout. It also restates that sessions are support and advocacy,
 * because this is the page most at risk of reading as clinical care.
 */

export interface BookingEmailInput {
  fullName: string;
  email: string;
  consultationName: string;
  durationMinutes: number;
  priceQuoted: number;
  currency: string;
  startsAt: string;
  /** The visitor's IANA zone, when we captured one. */
  requesterTimezone?: string;
  memberId?: string;
  phone?: string;
  note?: string;
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

/** Both readings of the same moment, so nobody has to do the maths. */
function times(input: BookingEmailInput) {
  const practitioner = siteConfig.practitionerTimezone;
  const local = input.requesterTimezone;

  const theirs = `${formatDateInZone(input.startsAt, practitioner)}, ${formatTimeWithZone(input.startsAt, practitioner)}`;

  const yours =
    local && local !== practitioner
      ? `${formatDateInZone(input.startsAt, local)}, ${formatTimeWithZone(input.startsAt, local)}`
      : null;

  return { theirs, yours };
}

/* -------------------------------------------------------------- requester */

export function bookingRequestSubject(): string {
  return "We've got your session request";
}

export function bookingRequestText(input: BookingEmailInput): string {
  const { theirs, yours } = times(input);

  return [
    `Hi ${firstName(input.fullName)},`,
    "",
    "Thank you for asking to book a session with us. We've received your request and we'll be in touch shortly to confirm.",
    "",
    "WHAT YOU ASKED FOR",
    `Session: ${input.consultationName} (${input.durationMinutes} minutes)`,
    `Requested time: ${theirs}`,
    ...(yours ? [`That's ${yours} where you are.`] : []),
    `Fee: ${input.currency} $${input.priceQuoted}`,
    ...(input.memberId ? [`Member ID: ${input.memberId}`] : []),
    "",
    "This isn't confirmed yet. We'll email you to confirm the time and arrange payment before anything is locked in.",
    "",
    "A reminder of what these sessions are: we're not doctors, and we don't diagnose or treat. We're here as advocates and companions, to help you feel informed and less alone. Anything clinical belongs with your healthcare team.",
    "",
    "If you need to change anything, just reply to this email.",
    "",
    "Henry & Precious",
    siteConfig.name,
  ].join("\n");
}

export function bookingRequestHtml(input: BookingEmailInput): string {
  const { theirs, yours } = times(input);
  const name = escapeHtml(firstName(input.fullName));

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#6b6580;width:110px;">${label}</td>
      <td style="padding:6px 0;font-size:14px;color:#1c1730;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(bookingRequestSubject())}</title></head>
<body style="margin:0;padding:0;background:#faf7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    We've received your request &mdash; we'll confirm the time with you shortly.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:36px 32px;">
        <tr><td>
          <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#2c1d63;">
            ${escapeHtml(siteConfig.name)}
          </p>

          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1c1730;">
            We&rsquo;ve got your request, ${name}
          </h1>

          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a4459;">
            Thank you for asking to book a session with us. We&rsquo;ll be in touch
            shortly to confirm the time and arrange payment.
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f4f1fa;border-radius:12px;">
            <tr><td style="padding:18px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Session", `${input.consultationName} (${input.durationMinutes} min)`)}
                ${row("Time", theirs)}
                ${yours ? row("Your time", yours) : ""}
                ${row("Fee", `${input.currency} $${input.priceQuoted}`)}
                ${input.memberId ? row("Member ID", input.memberId) : ""}
              </table>
            </td></tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-left:3px solid #d9a3b0;">
            <tr><td style="padding:2px 0 2px 14px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#4a4459;">
                <strong style="color:#1c1730;">This isn&rsquo;t confirmed yet.</strong>
                We&rsquo;ll email you to confirm before anything is locked in.
              </p>
            </td></tr>
          </table>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4a4459;">
            A reminder of what these sessions are: we&rsquo;re not doctors, and we
            don&rsquo;t diagnose or treat. We&rsquo;re here as advocates and
            companions &mdash; to help you feel informed and less alone. Anything
            clinical belongs with your healthcare team.
          </p>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4a4459;">
            Need to change anything? Just reply to this email.
          </p>

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

export function bookingNotificationSubject(input: BookingEmailInput): string {
  const when = formatDateInZone(
    input.startsAt,
    siteConfig.practitionerTimezone,
  );
  return `New session request — ${input.consultationName}, ${when}`;
}

/**
 * Plain text only. This one goes to Henry & Precious, who need to read it
 * quickly on a phone and reply — not admire it.
 */
export function bookingNotificationText(input: BookingEmailInput): string {
  const { theirs, yours } = times(input);

  return [
    "New consultation request.",
    "",
    `Session:  ${input.consultationName} (${input.durationMinutes} min, ${input.currency} $${input.priceQuoted})`,
    `When:     ${theirs}`,
    ...(yours ? [`Their tz: ${yours}`] : []),
    "",
    `Name:     ${input.fullName}`,
    `Email:    ${input.email}`,
    ...(input.phone ? [`Phone:    ${input.phone}`] : []),
    ...(input.memberId ? [`Member:   ${input.memberId}`] : []),
    "",
    ...(input.note ? ["What they said:", input.note, ""] : []),
    "Reply to them to confirm the time and arrange payment.",
  ].join("\n");
}
