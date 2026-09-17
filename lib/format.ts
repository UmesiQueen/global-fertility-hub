import type { ConsultationType, Event } from "@/types";

/**
 * Display formatting.
 *
 * Everything here is deterministic and safe to run in a Server Component.
 * Nothing reads the viewer's locale or clock, because differing server and
 * client output is the classic source of hydration mismatches — and a date
 * that flickers on load looks broken on a site people are reading carefully.
 *
 * Every formatter returns "" rather than throwing on a date it cannot read.
 * `Intl.DateTimeFormat#format` throws `RangeError: Invalid time value` on an
 * invalid Date, and its constructor throws on an invalid IANA timezone — and a
 * throw inside a Server Component is a 500 for the whole page. Published
 * content always has its dates, because Hygraph sets `publishedAt` at publish
 * time and nobody publishes an event without a start. A draft read through
 * preview has neither guarantee: `publishedAt` is null until first publish, and
 * `startsAt` and `timezone` are whatever the editor has typed so far. An
 * unfinished draft must not be able to take a page down.
 *
 * "" is the backstop, not the design. Callers that would rather omit the
 * element than render an empty one check the source value themselves.
 */

const LOCALE = "en-AU";

/** The Date, or null if it isn't one we can format. */
function at(value: string): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats, or returns "" if either the date or the options are unusable. */
function render(
  date: Date | null,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat(LOCALE, options).format(date);
  } catch {
    // An empty or misspelled timeZone throws from the constructor rather than
    // the format call — same outcome for us, same treatment.
    return "";
  }
}

/** "12 June 2026" */
export function formatDate(iso: string): string {
  if (!iso) return "";

  return render(at(`${iso.slice(0, 10)}T00:00:00Z`), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "12 Jun 2026" — for tight card footers. */
export function formatDateShort(iso: string): string {
  if (!iso) return "";

  return render(at(`${iso.slice(0, 10)}T00:00:00Z`), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Event dates render in the event's own timezone, not the server's.
 *
 * A webinar at 6pm Perth time must read as 6pm Perth time to everyone —
 * quietly converting to the reader's zone would be more "helpful" but the
 * clinic advertised a time and the two must agree.
 */
export function formatEventDate(event: Event): string {
  return render(at(event.startsAt), {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: event.timezone,
  });
}

/** "6:00 PM AWST" */
export function formatEventTime(event: Event): string {
  return render(at(event.startsAt), {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: event.timezone,
  });
}

/** "60 min" / "1h 30m" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

/** "8 min read" — videos and webinars are watched, not read. */
export function formatReadingTime(minutes: number, format?: string): string {
  const watched = format === "video" || format === "webinar";
  return watched ? `${minutes} min watch` : `${minutes} min read`;
}

/** "AUD $150" */
export function formatPrice(consultation: ConsultationType): string {
  return `${consultation.currency} $${consultation.price}`;
}

/* ---------------------------------------------------------------------------
   Consultation slots
   -------------------------------------------------------------------------
   Slots are absolute instants, so both of these are exact conversions rather
   than string manipulation. The pair exists because the appointment happens at
   one moment that has two correct descriptions — the one Henry & Precious put
   in their diary, and the one on the visitor's clock.
--------------------------------------------------------------------------- */

/** "9:00 am" in a given zone. */
export function formatTimeInZone(iso: string, timeZone: string): string {
  return render(at(iso), {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

/** "9:00 am AWST" — includes the zone so the reader can sanity-check it. */
export function formatTimeWithZone(iso: string, timeZone: string): string {
  return render(at(iso), {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone,
  });
}

/** "Mon 3 Aug 2026" in a given zone. */
export function formatDateInZone(iso: string, timeZone: string): string {
  return render(at(iso), {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  });
}

/**
 * The viewer's IANA zone. Client-only — on the server this resolves to the
 * host's zone, which is meaningless to the reader, so callers must only use
 * it inside an effect.
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * True when two zones show the same wall clock for this instant.
 *
 * Used to suppress the "your time" line for anyone already in the
 * practitioners' zone — repeating an identical time is just noise.
 */
export function isSameWallClock(
  iso: string,
  zoneA: string,
  zoneB: string,
): boolean {
  const a = formatTimeInZone(iso, zoneA);

  // Two unformattable times are not "the same wall clock" — without this, an
  // unreadable date would suppress the second line by claiming both zones agree.
  if (!a) return false;

  return a === formatTimeInZone(iso, zoneB);
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
