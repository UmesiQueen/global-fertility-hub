import type { AvailabilitySlot } from "@/types";

/**
 * Bookable consultation slots — TEMPORARY mock data.
 *
 * This deliberately does NOT live in Hygraph. Availability is booking state,
 * not editorial content: it changes when a slot is taken, not when someone
 * writes something. Real scheduling will come from a booking provider, and
 * the shape here is intentionally simple so it can be replaced wholesale.
 *
 * Pages must never import this file — go through
 * lib/repositories/consultations.
 */

export const availability: AvailabilitySlot[] = [
  {
    date: "2026-08-03",
    starts: [
      "2026-08-03T09:00:00+08:00",
      "2026-08-03T11:00:00+08:00",
      "2026-08-03T14:00:00+08:00",
    ],
  },
  {
    date: "2026-08-04",
    starts: [
      "2026-08-04T09:00:00+08:00",
      "2026-08-04T13:00:00+08:00",
      "2026-08-04T15:00:00+08:00",
      "2026-08-04T17:00:00+08:00",
    ],
  },
  {
    date: "2026-08-05",
    starts: [
      "2026-08-05T11:00:00+08:00",
      "2026-08-05T14:00:00+08:00",
    ],
  },
  {
    date: "2026-08-06",
    starts: [
      "2026-08-06T09:00:00+08:00",
      "2026-08-06T10:00:00+08:00",
      "2026-08-06T13:00:00+08:00",
      "2026-08-06T16:00:00+08:00",
    ],
  },
  {
    date: "2026-08-07",
    starts: [
      "2026-08-07T14:00:00+08:00",
      "2026-08-07T15:00:00+08:00",
    ],
  },
  {
    date: "2026-08-10",
    starts: [
      "2026-08-10T09:00:00+08:00",
      "2026-08-10T11:00:00+08:00",
      "2026-08-10T16:00:00+08:00",
    ],
  },
  {
    date: "2026-08-11",
    starts: [
      "2026-08-11T10:00:00+08:00",
      "2026-08-11T13:00:00+08:00",
      "2026-08-11T15:00:00+08:00",
    ],
  },
  {
    date: "2026-08-12",
    starts: [
      "2026-08-12T09:00:00+08:00",
      "2026-08-12T14:00:00+08:00",
      "2026-08-12T17:00:00+08:00",
    ],
  },
  {
    date: "2026-08-13",
    starts: [
      "2026-08-13T11:00:00+08:00",
      "2026-08-13T13:00:00+08:00",
    ],
  },
  {
    date: "2026-08-14",
    starts: [
      "2026-08-14T09:00:00+08:00",
      "2026-08-14T10:00:00+08:00",
      "2026-08-14T15:00:00+08:00",
      "2026-08-14T16:00:00+08:00",
    ],
  },
];

