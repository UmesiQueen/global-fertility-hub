import type { Product } from "@/types";

/**
 * Store products — TEMPORARY mock data. Replaced by the CMS.
 *
 * Brands, prices and URLs below are invented. Publishing a real brand name
 * against an unsigned affiliate arrangement is a legal problem, and a wrong
 * price is a consumer-law one.
 *
 * NOTHING HERE MAY CLAIM TO IMPROVE FERTILITY. Describe what a product is and
 * who it's for — never what it will do to someone's chances. The verification
 * script scans this file for claim language and fails if it finds any.
 *
 * Pages must never import this file — go through lib/repositories/products.
 */

const img = (alt: string) => ({ src: "", alt });

export const products: Product[] = [
  /* --------------------------------------------------------- own products */
  {
    id: "prd-001",
    slug: "the-fertility-journey-handbook",
    name: "The Fertility Journey Handbook",
    excerpt:
      "Our own guide to understanding the process, the language and the decisions ahead of you.",
    source: "own",
    format: "ebook",
    category: "guides-and-books",
    tags: ["ivf", "mental-health"],
    price: 24,
    currency: "AUD",
    externalUrl: "https://example.com/store/handbook",
    vendor: "Global Fertility Hub",
    coverImage: img("The Fertility Journey Handbook cover."),
    includes: [
      "180-page PDF and EPUB",
      "Printable appointment questions",
      "Glossary of terms and acronyms",
      "Free updates for life",
    ],
    publishedAt: "2026-06-20",
    isFeatured: true,
    isNew: true,
    body: `We wrote the book we needed when we started.

It walks through the shape of a fertility journey in plain English: what the tests measure, what the acronyms mean, what the steps of a treatment cycle actually involve, and what questions are worth asking at each point.

## What's inside

The first half explains the process. The second half is practical — the questions we wish we'd asked, the things nobody told us, and a set of printable pages you can take to appointments.

## What it isn't

It isn't medical advice, and it won't tell you what to do. It's here to help you follow the conversation and feel less lost in it. Your clinical decisions belong with your healthcare team.`,
  },
  {
    id: "prd-002",
    slug: "appointment-companion-workbook",
    name: "The Appointment Companion",
    excerpt:
      "A printable workbook for keeping track of appointments, questions and answers.",
    source: "own",
    format: "workbook",
    category: "planning-and-tracking",
    tags: ["ivf", "iui"],
    price: 12,
    currency: "AUD",
    externalUrl: "https://example.com/store/companion",
    vendor: "Global Fertility Hub",
    coverImage: img("The Appointment Companion workbook cover."),
    includes: [
      "42-page printable PDF",
      "Appointment log and question prompts",
      "Medication and cycle tracker",
    ],
    publishedAt: "2026-05-30",
    isFeatured: true,
    body: `Appointments move quickly, and it is genuinely hard to remember what was said afterwards.

This is the workbook we made for ourselves: somewhere to write the questions before you go in, the answers while you're there, and what happens next before you forget it.

Print it, or fill it in on a tablet. It's yours once you buy it.`,
  },
  {
    id: "prd-003",
    slug: "the-two-week-wait-audio-sessions",
    name: "The Two-Week Wait: Audio Sessions",
    excerpt:
      "Six short recordings for the hardest fortnight, made with a counsellor.",
    source: "own",
    format: "audio",
    category: "emotional-wellbeing",
    tags: ["mental-health", "ivf"],
    price: 18,
    currency: "AUD",
    externalUrl: "https://example.com/store/two-week-wait",
    vendor: "Global Fertility Hub",
    coverImage: img("Audio session artwork."),
    includes: [
      "6 sessions, 8–14 minutes each",
      "Downloadable MP3s",
      "Written transcripts",
    ],
    publishedAt: "2026-05-10",
    body: `The two-week wait is the part of a cycle with the least to do and the most to feel.

We made these with Tomas Lindqvist, a counsellor who works with people going through fertility treatment. Six short sessions, one for each of the moments people told us they found hardest.

They aren't therapy, and they aren't a substitute for talking to someone. They're company for a fortnight that can feel very long.`,
  },
  {
    id: "prd-004",
    slug: "questions-to-ask-your-clinic-guide",
    name: "Questions to Ask Your Clinic",
    excerpt:
      "Our free printable list of questions worth asking before you commit to treatment.",
    source: "own",
    format: "guide",
    category: "guides-and-books",
    tags: ["ivf"],
    isFree: true,
    currency: "AUD",
    externalUrl: "https://example.com/store/questions-guide",
    vendor: "Global Fertility Hub",
    coverImage: img("Printable question list."),
    includes: ["8-page printable PDF", "Free, no email required"],
    publishedAt: "2026-04-18",
    isFeatured: true,
    body: `First consultations move fast, and it's easy to leave realising you asked none of what you meant to.

This covers success rates and how they're calculated, what a quoted price does and doesn't include, protocol options, and what happens if a cycle doesn't work.

It's free. Take it, print it, share it with anyone who needs it.`,
  },
  {
    id: "prd-005",
    slug: "for-partners-a-short-guide",
    name: "For Partners: A Short Guide",
    excerpt:
      "Written for the person who isn't having the treatment, and often gets forgotten.",
    source: "own",
    format: "ebook",
    category: "for-partners",
    tags: ["male-fertility", "mental-health"],
    price: 14,
    currency: "AUD",
    externalUrl: "https://example.com/store/for-partners",
    vendor: "Global Fertility Hub",
    coverImage: img("For Partners guide cover."),
    includes: ["64-page PDF and EPUB", "Written with input from our community"],
    publishedAt: "2026-03-28",
    body: `Fertility treatment falls unevenly. One person carries the appointments, the injections and the physical recovery. The other carries something quieter that rarely gets named.

Henry wrote most of this one. It's about what actually helps, what doesn't, and why "it'll be fine" so often lands badly — plus a chapter on looking after yourself while you're the one holding everything together.`,
  },

  /* --------------------------------------------------- affiliate products */
  {
    id: "prd-006",
    slug: "lumen-cycle-tracking-app",
    name: "Lumen Cycle",
    excerpt:
      "A cycle tracking app several people in our community use day to day.",
    source: "affiliate",
    format: "physical",
    category: "planning-and-tracking",
    tags: ["ivf", "pcos"],
    externalUrl: "https://example.com/lumen-cycle",
    vendor: "Lumen Cycle",
    coverImage: img("Lumen Cycle app on a phone screen."),
    publishedAt: "2026-06-01",
    body: `An app for tracking cycles, appointments and medication in one place.

We list it because members kept telling us they used it, not because it does anything to your fertility. It's a record-keeping tool.

Check whether it suits you before paying for anything — the free tier covers most of what people describe using.`,
  },
  {
    id: "prd-007",
    slug: "steady-ground-journal",
    name: "The Steady Ground Journal",
    excerpt:
      "A guided journal made for people going through treatment, by a fertility coach.",
    source: "affiliate",
    format: "physical",
    category: "emotional-wellbeing",
    tags: ["mental-health"],
    externalUrl: "https://example.com/steady-ground-journal",
    vendor: "Steady Ground",
    coverImage: img("A guided journal on a bedside table."),
    publishedAt: "2026-05-16",
    body: `A physical journal with prompts written for the specific weeks of a treatment cycle.

Some people find writing helps and some don't. If you've never got on with journalling, this probably won't change that — but if you have, the prompts are better targeted than a general one.`,
  },
  {
    id: "prd-008",
    slug: "warmth-comfort-set",
    name: "The Warmth Set",
    excerpt:
      "A blanket, mug and card set — the thing people most often send a friend.",
    source: "affiliate",
    format: "physical",
    category: "gifts-and-comfort",
    tags: ["mental-health", "pregnancy-loss"],
    externalUrl: "https://example.com/warmth-set",
    vendor: "Nestle & Bloom",
    coverImage: img("A folded blanket, mug and card."),
    publishedAt: "2026-04-25",
    body: `We get asked constantly what to send someone going through this, or after a loss.

This is the set our community keeps recommending to each other. It doesn't fix anything. It's a way of saying you're thinking of them when there's nothing useful to say.`,
  },
];
