import type { Event } from "@/types";

/**
 * Mock events and webinars — TEMPORARY. Replaced by the CMS.
 *
 * Dates are fixed strings rather than computed from `now` on purpose: data
 * that shifts under you makes it impossible to reproduce a bug in the
 * upcoming/replay split. The repository decides which list an event belongs
 * to by comparing `startsAt` to the current date, so seeding real dates on
 * both sides of today is what exercises that logic.
 *
 * Pages must never import this file — go through lib/repositories/events.
 */

const img = (alt: string) => ({ src: "", alt });

export const events: Event[] = [
  // ---------------------------------------------------------------- upcoming
  {
    id: "evt-001",
    slug: "ivf-101-what-to-expect-from-start-to-finish",
    title: "IVF 101: What to Expect from Start to Finish",
    type: "webinar",
    tags: ["ivf"],
    image: img("A speaker presenting to camera in a home office."),
    description:
      "A complete walkthrough of the IVF process for anyone starting their first cycle, with time for questions at the end.",
    startsAt: "2026-08-13T18:00:00+08:00",
    timezone: "Australia/Perth",
    durationMinutes: 60,
    speakers: [
      {
        name: "Dr Eleanor Whitfield",
        role: "Medical Director",
        organisation: "Harbourside Fertility Centre",
      },
    ],
    registrationUrl: "https://example.com/register/ivf-101",
    isFeatured: true,
  },
  {
    id: "evt-002",
    slug: "ask-the-embryologist-live-qa",
    title: "Ask the Embryologist: Live Q&A",
    type: "live-qa",
    tags: ["ivf"],
    image: img("A laboratory technician working with equipment."),
    description:
      "Bring your questions about grading, fertilisation rates and what happens in the lab between collection and transfer.",
    startsAt: "2026-08-27T19:00:00+10:00",
    timezone: "Australia/Sydney",
    durationMinutes: 75,
    speakers: [
      {
        name: "Sana Bhatt",
        role: "Lead Embryologist",
        organisation: "Harbourside Fertility Centre",
      },
    ],
    registrationUrl: "https://example.com/register/ask-the-embryologist",
    isFeatured: true,
  },
  {
    id: "evt-003",
    slug: "managing-anxiety-during-the-two-week-wait-webinar",
    title: "Managing Anxiety During the Two-Week Wait",
    type: "webinar",
    tags: ["mental-health", "ivf"],
    image: img("A counsellor speaking during an online session."),
    description:
      "Practical strategies for the hardest fortnight of a cycle, led by a counsellor specialising in fertility.",
    startsAt: "2026-09-10T19:00:00+01:00",
    timezone: "Europe/London",
    durationMinutes: 60,
    speakers: [{ name: "Tomas Lindqvist", role: "Counsellor" }],
    registrationUrl: "https://example.com/register/two-week-wait",
  },
  {
    id: "evt-004",
    slug: "male-fertility-what-every-couple-needs-to-know",
    title: "Male Fertility: What Every Couple Needs to Know",
    type: "panel-discussion",
    tags: ["male-fertility"],
    image: img("Three panellists seated for a discussion."),
    description:
      "A panel on why male factor is investigated late, what testing involves, and how partners can support each other.",
    startsAt: "2026-09-24T18:30:00+01:00",
    timezone: "Europe/London",
    durationMinutes: 90,
    speakers: [
      {
        name: "Dr Nathan Coulthard",
        role: "Andrologist",
        organisation: "Northern Quarter Fertility",
      },
      { name: "Dr Samuel Okonkwo", role: "Andrology Educator" },
    ],
    registrationUrl: "https://example.com/register/male-fertility-panel",
    isFeatured: true,
  },
  {
    id: "evt-005",
    slug: "considering-ivf-overseas",
    title: "Considering IVF Overseas?",
    type: "webinar",
    tags: ["international-ivf", "ivf"],
    image: img("A hot air balloon drifting over open countryside."),
    description:
      "What to check before travelling for treatment: legal differences, remote monitoring, costs and continuity of care.",
    startsAt: "2026-10-08T18:00:00+02:00",
    timezone: "Europe/Madrid",
    durationMinutes: 60,
    speakers: [
      {
        name: "Dra Núria Bosch",
        role: "Medical Director",
        organisation: "Instituto Mediterráneo de Fertilidad",
      },
    ],
    registrationUrl: "https://example.com/register/ivf-overseas",
  },
  // ------------------------------------------------------------ replay library
  {
    id: "evt-007",
    slug: "understanding-embryo-grading",
    title: "Understanding Embryo Grading",
    type: "webinar",
    tags: ["ivf"],
    image: img("A microscope view of cells on a monitor."),
    description:
      "What the numbers and letters on your embryology report actually describe — and what they don't predict.",
    startsAt: "2026-06-25T18:00:00+10:00",
    timezone: "Australia/Sydney",
    durationMinutes: 55,
    speakers: [
      {
        name: "Sana Bhatt",
        role: "Lead Embryologist",
        organisation: "Harbourside Fertility Centre",
      },
    ],
    replayUrl: "https://example.com/replay/embryo-grading",
    transcript:
      "Full transcript available. Covers grading systems, day 3 versus day 5 assessment, and why grading is a guide rather than a guarantee.",
    slidesUrl: "/downloads/embryo-grading-slides.pdf",
    downloads: [
      {
        label: "Slides",
        url: "/downloads/embryo-grading-slides.pdf",
        meta: "PDF · 2.1 MB",
      },
    ],
  },
  {
    id: "evt-008",
    slug: "the-role-of-ultrasound-in-ivf",
    title: "The Role of Ultrasound in IVF",
    type: "webinar",
    tags: ["ivf"],
    image: img("An ultrasound machine in a consulting room."),
    description:
      "How monitoring scans track a cycle, and what each measurement is telling your clinic.",
    startsAt: "2026-05-28T19:00:00+01:00",
    timezone: "Europe/London",
    durationMinutes: 50,
    speakers: [
      {
        name: "Dr Priya Anand",
        role: "Consultant",
        organisation: "Thames Reproductive Medicine",
      },
    ],
    replayUrl: "https://example.com/replay/ultrasound-in-ivf",
    transcript:
      "Full transcript available. Covers antral follicle count, follicle tracking and endometrial assessment.",
  },
  {
    id: "evt-009",
    slug: "coping-with-pregnancy-loss",
    title: "Coping with Pregnancy Loss",
    type: "webinar",
    tags: ["pregnancy-loss", "mental-health"],
    image: img("Two people sitting together in quiet conversation."),
    description:
      "A gentle session on grief, support and moving forward at your own pace.",
    startsAt: "2026-04-30T19:00:00+01:00",
    timezone: "Europe/London",
    durationMinutes: 60,
    speakers: [{ name: "Tomas Lindqvist", role: "Counsellor" }],
    replayUrl: "https://example.com/replay/pregnancy-loss",
    transcript:
      "Full transcript available. Includes signposting to support organisations by country.",
    downloads: [
      {
        label: "Support organisations by country",
        url: "/downloads/loss-support-directory.pdf",
        meta: "PDF · 0.4 MB",
      },
    ],
  },
  {
    id: "evt-010",
    slug: "supplements-and-lifestyle-for-fertility",
    title: "Supplements & Lifestyle for Fertility",
    type: "webinar",
    tags: ["nutrition"],
    image: img("Fresh produce arranged on a kitchen worktop."),
    description:
      "Separating what the evidence supports from what the marketing claims.",
    startsAt: "2026-04-02T18:00:00+08:00",
    timezone: "Australia/Perth",
    durationMinutes: 45,
    speakers: [{ name: "Marta Nowak", role: "Registered Dietitian" }],
    replayUrl: "https://example.com/replay/supplements-lifestyle",
    slidesUrl: "/downloads/supplements-lifestyle-slides.pdf",
  },
];
