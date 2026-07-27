import type { ConsultationType, Event } from "@/types";

/**
 * Display formatting.
 *
 * Everything here is deterministic and safe to run in a Server Component.
 * Nothing reads the viewer's locale or clock, because differing server and
 * client output is the classic source of hydration mismatches — and a date
 * that flickers on load looks broken on a site people are reading carefully.
 */

const LOCALE = "en-AU";

/** "12 June 2026" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
}

/** "12 Jun 2026" — for tight card footers. */
export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
}

/**
 * Event dates render in the event's own timezone, not the server's.
 *
 * A webinar at 6pm Perth time must read as 6pm Perth time to everyone —
 * quietly converting to the reader's zone would be more "helpful" but the
 * clinic advertised a time and the two must agree.
 */
export function formatEventDate(event: Event): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: event.timezone,
  }).format(new Date(event.startsAt));
}

/** "6:00 PM AWST" */
export function formatEventTime(event: Event): string {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: event.timezone,
  }).format(new Date(event.startsAt));
}

/** "60 min" / "1h 30m" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

/** "8 min read" — videos and webinars are watched, not read. */
export function formatReadingTime(
  minutes: number,
  format?: string,
): string {
  const watched = format === "video" || format === "webinar";
  return watched ? `${minutes} min watch` : `${minutes} min read`;
}

/** "AUD $150" */
export function formatPrice(consultation: ConsultationType): string {
  return `${consultation.currency} $${consultation.price}`;
}

/**
 * ISO 3166-1 alpha-2 to flag emoji, by offsetting into the regional
 * indicator block. Avoids shipping ~200 flag images for a decorative chip.
 * Windows renders these as letter pairs rather than flags, which is why the
 * country name is always shown alongside rather than replaced by the flag.
 */
export function countryFlag(countryCode: string): string {
  if (!/^[A-Za-z]{2}$/.test(countryCode)) return "";
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)),
  );
}

/** Turns a slug-ish token into a display label: "male-fertility" -> "Male Fertility" */
export function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
