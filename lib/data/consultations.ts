import type {
  AvailabilitySlot,
  ConsultationFaq,
  ConsultationType,
} from "@/types";

/**
 * Consultation sessions with Henry & Precious — TEMPORARY mock data.
 *
 * These sessions are SUPPORT AND ADVOCACY, not medical advice. Every piece of
 * copy here is written to hold that line, and it must survive client review
 * intact — this is the page most at risk of drifting into implying clinical
 * guidance.
 *
 * Prices are placeholders pending client confirmation.
 *
 * Pages must never import this file — go through
 * lib/repositories/consultations.
 */

export const consultationTypes: ConsultationType[] = [
  {
    id: "con-one-on-one",
    name: "One-on-One Session",
    description:
      "A private conversation with either Henry or Precious about wherever you are in your journey.",
    audience: "one-on-one",
    durationMinutes: 60,
    price: 150,
    currency: "AUD",
  },
  {
    id: "con-couple",
    name: "Couple Session",
    description:
      "A session with both of us, for couples who want to talk things through together.",
    audience: "couple",
    durationMinutes: 60,
    price: 200,
    currency: "AUD",
  },
  {
    id: "con-follow-up",
    name: "Follow-Up Session",
    description:
      "A shorter session for people we've already spoken with, to pick up where we left off.",
    audience: "follow-up",
    durationMinutes: 45,
    price: 120,
    currency: "AUD",
  },
];

/**
 * Mock availability. Real scheduling will come from a booking provider —
 * the shape here is intentionally simple so it can be replaced wholesale.
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

export const consultationFaqs: ConsultationFaq[] = [
  {
    question: "Are you doctors?",
    answer:
      "No. We're not doctors and we don't give medical advice. We're here as advocates and companions — people who've been through this and can help you feel informed, supported and less alone. Anything clinical belongs with your healthcare team.",
  },
  {
    question: "What can a session actually help with?",
    answer:
      "Understanding the options that have been put in front of you, preparing questions for an appointment, thinking through a decision, or simply talking to someone who understands. Many people book because they want to feel less overwhelmed before a consultation.",
  },
  {
    question: "Will you tell me which treatment to choose?",
    answer:
      "No — that decision belongs to you and your clinical team. What we can do is help you work out what matters to you, and make sure you leave your next appointment having asked the things you meant to ask.",
  },
  {
    question: "Is what I say confidential?",
    answer:
      "Yes. What you share with us stays between us. Nothing from a session is published, shared with clinics, or used anywhere on this site.",
  },
  {
    question: "Can my partner join?",
    answer:
      "Absolutely. The Couple Session is designed for exactly that, with both Henry and Precious present. You're also welcome to bring a partner to a One-on-One Session.",
  },
  {
    question: "What if I need to reschedule?",
    answer:
      "Life with fertility treatment rarely runs to plan. Get in touch and we'll move things without fuss.",
  },
  {
    question: "Which session should I book?",
    answer:
      "If you're not sure, send us a message first and we'll help you work it out. There's no obligation to book anything.",
  },
];
