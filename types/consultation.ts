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

/** A bookable slot. Phase 1 is UI-only against mock availability. */
export interface AvailabilitySlot {
  /** ISO 8601 date, e.g. "2026-08-16" */
  date: string;
  /** Local start times, e.g. ["09:00", "11:00"] */
  times: string[];
}

export interface ConsultationFaq {
  question: string;
  answer: string;
}
