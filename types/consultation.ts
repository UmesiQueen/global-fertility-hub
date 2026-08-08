/**
 * Paid consultation sessions with Henry & Precious.
 *
 * These are SUPPORT AND ADVOCACY sessions, explicitly not medical advice.
 * Any copy rendered from this type must preserve that framing.
 */

export type ConsultationAudience = "one-on-one" | "couple" | "follow-up";

export interface ConsultationType {
  id: string;
  name: string;
  description: string;
  audience: ConsultationAudience;
  durationMinutes: number;
  /** Minor units avoided deliberately — mock data only, no payments yet. */
  price: number;
  currency: "AUD";
}

/**
 * A day of bookable slots.
 *
 * `starts` holds absolute instants with an offset, not wall-clock times, so a
 * slot means the same moment to everyone. Storing "09:00" plus a timezone
 * name would force every consumer to redo the offset maths, and the audience
 * is international — this is exactly where "I booked 9am and they called at
 * 2am" comes from.
 */
export interface AvailabilitySlot {
  /** Calendar date in the practitioners' timezone, e.g. "2026-08-16". */
  date: string;
  /** ISO 8601 instants, e.g. ["2026-08-16T09:00:00+08:00"]. */
  starts: string[];
}

export interface ConsultationFaq {
  question: string;
  answer: string;
}
