# Global Fertility Hub — Project Plan

> Source of truth: `Global Fertility Hub Overview.pdf` (client brief, 11 pages of spec + 12 design mockups).
> Last updated: 2026-07-27

---

## 1. What we're building

An **educational fertility platform** — not a clinic, not medical advice. A trusted companion that moves a visitor through five emotional stages:

```
Hope → Education → Trust → Community → Action
```

**Non-negotiables from the brief:**

- Never rank, score, or recommend clinics. They are **"Educational Clinic Partners"** — partnerships, not endorsements.
- Never present content as medical advice. Consultations are **support and advocacy**, explicitly not clinical.
- All community stories are **reviewed before publication**.
- Tone: modern, premium, trustworthy, calm, hopeful. "Less like a medical website, more like a trusted companion."

---

## 2. Current state of the repo

| Item | Status |
|---|---|
| Next.js 16.2.12 (App Router, Turbopack) | ✅ Installed |
| React 19.2.4 | ✅ |
| Tailwind v4 (CSS-first, `@theme inline`) | ✅ |
| shadcn v4 + `@base-ui/react`, style `base-luma` | ✅ Configured, only `button` added |
| Biome + ESLint | ✅ Both present |
| Fonts: Inter (sans) + Space Grotesk (heading) | ✅ Wired in `layout.tsx` |
| Theme tokens | ⚠️ Still default neutral greyscale — needs brand palette |
| Pages | ⚠️ Only placeholder `app/page.tsx` |
| Layout chrome (header/footer) | ❌ Not built |
| Data layer | ❌ Not built |

**Decision:** keep this scaffold as-is. It's a clean, current stack. We build on top.

---

## 3. Architecture decisions

### 3.1 Content strategy — mock data first, CMS later

All content lives in typed TS modules behind a thin **repository layer**:

```
lib/data/          ← mock content (resources.ts, clinics.ts, …)
lib/repositories/  ← getResources(), getResourceBySlug(), …
```

Pages **only** ever call repositories, never import `lib/data` directly. When the client is ready for a CMS (Sanity or Payload), we rewrite the repository bodies and every page keeps working. This is the single most important structural rule in the project.

All repository functions are `async` from day one, even though they return static data — so the CMS swap doesn't force a sync→async refactor across every page.

### 3.2 Rendering

Server Components by default. `"use client"` only where genuinely needed:

- Filter/search bars (Resources, Clinics, Stories)
- Mobile nav sheet, search overlay
- Booking calendar and slot picker
- Carousels (Events, Replay Library)
- Any form with local state

Filter state lives in the **URL** (`?category=ivf&format=video`) via `nuqs` or `useSearchParams` — shareable, back-button friendly, and SEO-safe.

### 3.3 SEO

Every detail route exports `generateMetadata` and `generateStaticParams`. `sitemap.ts` and `robots.ts` at the app root. JSON-LD: `Article` on resources, `Event` on events, `Organization` sitewide. This is a content platform — search is the primary acquisition channel, so it's built in, not bolted on.

---

## 4. Route map

```
app/
├── layout.tsx                        Root: fonts, header, footer, skip-link
├── page.tsx                          HOMEPAGE (9 sections — §5)
├── not-found.tsx                     404 — heart illustration, mockup 12
│
├── resources/
│   ├── page.tsx                      Library: search, category sidebar, format filter, pagination
│   └── [slug]/page.tsx               Detail: title, author, category, reading time, body,
│                                     related resources / clinics / webinars, downloads
│
├── educational-partners/
│   ├── page.tsx                      Directory: filter by country, city, treatment, specialty, language
│   └── [slug]/page.tsx               Profile: info, services, team, educational content,
│                                     partner benefits, website, contact, related resources, events
│
├── stories/
│   ├── page.tsx                      Library: 9 category filters + search
│   └── [slug]/page.tsx               Detail: full story, related resources / similar stories /
│                                     webinars / clinics, "Share Your Story" CTA
│
├── events/
│   ├── page.tsx                      Tabs: Upcoming Events | Replay Library
│   └── [slug]/page.tsx               Detail: description, registration, calendar integration;
│                                     post-event: replay, transcript, slides, downloads, discussion
│
├── about/page.tsx                    Our Story · Mission · Vision · Henry & Precious · Values
├── consultations/page.tsx            Session types, calendar, availability, payment, FAQs
├── discounts/page.tsx                Exclusive partner offers with codes
├── contact/page.tsx                  Form, social links, general enquiries
│
├── privacy/ · terms/ · disclaimer/   Legal (footer-linked)
├── sitemap.ts · robots.ts
└── api/                              (Phase 2 — newsletter, contact, story submission)
```

**Naming note:** `/educational-partners` not `/clinics`. The URL itself should carry the "educational partnership, not endorsement" framing. Mockups confirm the nav label is "Educational Partners".

---

## 5. Homepage — 9 sections

| # | Section | Key contents |
|---|---|---|
| 1 | **Hero** | Headline + pink script accent line ("Stronger Together."), supporting copy, hero image, `Explore Resources` + `Join the Community` buttons, 4 trust chips (Trusted Education · Real Stories · Global Support · Private & Safe) |
| 2 | **What You'll Find Here** | 4 feature cards overlapping the hero image — Educational Resources, Educational Clinic Partners, Community Stories, Events & Webinars. Each links to its page |
| 3 | **Featured Resources** | Curated grid (articles/videos/guides/downloads) + `View All Resources` |
| 4 | **Educational Clinic Partners** | Cards: logo, name, location, expertise, "Educational Partner" badge, `View Profile` |
| 5 | **Community Stories** | Cards: cover image, title, category, preview, author (or Anonymous), `Read Story` |
| 6 | **Upcoming Events & Webinars** | Cards: image, date, speaker, description, `Register` + `View All Events` |
| 7 | **Why Global Fertility Hub Exists** | Mission statement, supporting image, trust indicators, `Learn More` |
| 8 | **Join Community** | Final CTA: `Join Community` + `Subscribe for Updates` |
| 9 | **Footer** | Explore / About / Legal columns + social links |

---

## 6. Data model

```
types/
├── resource.ts
├── clinic.ts
├── story.ts
├── event.ts
├── consultation.ts
├── discount.ts
└── shared.ts        Category, Format, Author, Image, SEO
```

**Cross-linking is the core of this product.** The brief repeats "related resources / related clinics / related webinars / similar stories" on nearly every detail page. Every entity therefore carries a shared `tags: FertilityTopic[]` field, and relatedness is computed by tag overlap in one place (`lib/relations.ts`) rather than hand-maintained per entity.

`FertilityTopic` is the shared vocabulary, drawn from the story filters in the brief:
`ivf · iui · male-fertility · pcos · endometriosis · pregnancy-loss · donor-conception · fertility-preservation · international-ivf · nutrition · mental-health · success-stories`

**Entity sketch:**

- **Resource** — slug, title, excerpt, body, format (article/video/guide/download), category, author, readingTime, publishedAt, coverImage, tags, isNew, downloadUrl?
- **Clinic** — slug, name, logo, coverImage, country, city, treatments[], specialties[], languages[], services[], team[], partnerBenefits[], website, contact, tags, `isEducationalPartner: true`
- **Story** — slug, title, coverImage, category, preview, body, author (`{name} | "Anonymous"`), publishedAt, readingTime, tags, `status: 'approved'`
- **Event** — slug, title, image, type (webinar/live-qa/panel), startsAt, timezone, speaker, description, registrationUrl, tags + post-event: replayUrl, transcript, slides, downloads, duration
- **ConsultationType** — id, name, description, durationMinutes, priceAUD, audience (one-on-one/couple/follow-up)
- **Discount** — brand, logo, description, percentOff, code, redeemUrl

---

## 7. Design system

### 7.1 Tokens (from mockups → `app/globals.css`)

Extracted from the mockups, expressed as OKLCH:

| Token | Value | Used for |
|---|---|---|
| `--primary` | deep indigo `oklch(0.32 0.14 285)` | Buttons, active nav, headings |
| `--primary-foreground` | near-white | Button text |
| `--accent` | soft lavender `oklch(0.95 0.02 290)` | Section backgrounds, icon chips |
| `--script` | rose pink `oklch(0.70 0.13 15)` | Handwritten accent headlines only |
| `--background` | warm off-white `oklch(0.99 0.004 90)` | Page |
| `--muted` | `oklch(0.97 0.01 290)` | Cards, badges |
| `--radius` | `0.75rem` | Softer than default — warmth |

Dark mode: token structure stays in place but is **out of scope for phase 1**. The brand is built on light, airy, warm surfaces; a dark theme needs its own design pass.

### 7.2 Typography

- **Space Grotesk** — headings (already wired)
- **Inter** — body (already wired)
- **Script face** — needed for the pink accent lines ("Stronger Together.", "Our story. Our why. Our mission.", "Henry & Precious"). Mockups suggest a casual signature script. Proposal: `Caveat` or `Dancing Script` via `next/font/google`, exposed as `--font-script`, used **only** for those accent lines.

### 7.3 shadcn components to add

`badge · card · input · select · tabs · sheet · dialog · accordion · avatar · separator · checkbox · radio-group · calendar · carousel · pagination · form · textarea · label · skeleton · sonner`

### 7.4 Shared components to build

```
components/
├── layout/       SiteHeader, MobileNav, SiteFooter, SearchOverlay, Container, PageHero
├── cards/        ResourceCard, ClinicCard, StoryCard, EventCard, ReplayCard,
│                 FeatureCard, DiscountCard
├── filters/      SearchBar, CategorySidebar, FilterChips, FormatFilter, SortSelect
├── sections/     one component per homepage section
└── shared/       TrustChips, ScriptAccent, EmptyState, RelatedGrid, Pagination,
                  NewsletterSignup, MedicalDisclaimer
```

`RelatedGrid` is deliberately generic — it renders related resources, clinics, stories or events from a single implementation. It appears on all five detail page types.

---

## 8. Build phases

### Phase 0 — Foundations
1. Brand tokens into `globals.css`; add script font to `layout.tsx`
2. Install the shadcn component set
3. `SiteHeader` (desktop nav, mobile sheet, search trigger, Join Community CTA, account icon) + `SiteFooter`
4. `Container`, `PageHero`, `TrustChips`, `ScriptAccent`
5. `not-found.tsx`

### Phase 1 — Data layer
6. All types in `types/`
7. Mock data: ~18 resources, ~12 clinics, ~12 stories, ~10 events, 3 consultation types, 5 discounts
8. Repositories + `lib/relations.ts`

### Phase 2 — Homepage
9. All 9 sections, mobile-first, against mockup 1

### Phase 3 — Listing pages
10. Resources (search, sidebar, format filter, pagination)
11. Educational Partners (5 filters, country flags)
12. Stories (9 category chips, search)
13. Events (tabs, carousels, newsletter strip)

### Phase 4 — Detail pages
14. Resource / Clinic / Story / Event details + `RelatedGrid` everywhere

### Phase 5 — Secondary pages
15. About (timeline "Our Story in a Nutshell", Mission/Vision/Promise)
16. Consultations (session picker, calendar, availability — UI only, no payment)
17. Discounts, Contact, legal pages

### Phase 6 — Polish & verification
18. Responsive audit at 375 / 768 / 1024 / 1440
19. Accessibility: contrast, focus rings, keyboard nav, alt text, landmarks
20. `sitemap.ts`, `robots.ts`, per-page metadata, JSON-LD
21. Lighthouse + `next build` clean

---

## 8b. Join Community (`/join`) — decided 2026-08-06

The one part of the site that stores personal data.

**Flow:** CTA → form (name, email, country, phone*, how they heard about Henry & Precious, why they're joining*) → success screen showing their member ID and the Instagram community link → welcome email repeating both.

**Stack:** Convex for storage, Resend for the welcome email. Member IDs look like `GFH-7K2M9` — random, not sequential, using an alphabet without `0/O/1/I/L/U` so they survive being read aloud or retyped.

**Consent is separate from joining.** The brief said joining puts members on the mailing list. That isn't valid consent under GDPR or the Australian Spam Act — it has to be a freely given, affirmative act, and it can't be a condition of the thing they actually came for. So the checkbox is unticked, optional, and someone can join the community without joining the list. `consentVersion` is stored alongside the decision so a record of "they agreed" is always tied to the wording they read.

**Privacy posture.** Everyone in this table has self-identified as being on a fertility journey — close to health data by inference even though we never ask a medical question. Collect the minimum, never expose a member record through a public query, and keep `submissionIp` purgeable.

**Still needed from the client:** the real Instagram community URL, a verified Resend sending domain, and the Privacy Policy copy (the form links to `/privacy`, which doesn't exist yet).

**Admin dashboard — deferred, not forgotten.** `convex/members.ts` already exposes `list` and `stats`, and the table is indexed by `createdAt` and `referralSource` for exactly this. Both are unauthenticated today and must go behind Convex auth before any dashboard ships.

## 8c. Phase 7 — Hygraph CMS migration (decided 2026-08-12)

The migration the repository layer was built for. Rule 1 in `CLAUDE.md` — pages never import `lib/data`, only `lib/repositories` — exists so this is a contained change. **Nothing in `app/` or `components/` should need to move.**

### What Hygraph is

A GraphQL-native headless CMS. Content models are defined in their web UI, not in this repo, and Hygraph generates a GraphQL API from them. Three concepts matter here:

- **Content stages.** Every entry exists in `DRAFT` and `PUBLISHED` at once. Editing changes the draft; publishing copies it across. The API token decides which stage you see. This replaces our `status: "approved"` story gate — enforced by Hygraph rather than by a repository filter that could be forgotten.
- **Permanent Auth Tokens.** Bearer tokens scoped per model and per stage. Server-side only. Public API access is disabled by default on new projects, which is the posture we want.
- **Two endpoints.** A regular read/write one, and a read-only high-performance CDN endpoint. We read from the CDN.

### What moves

| Content | Destination | Why |
|---|---|---|
| Resources, Stories, Events, Clinics, Products | **Hygraph** | Edited constantly by the client |
| Consultation types, availability, FAQs | **Hygraph** | Prices and slots change |
| Discounts | **Hygraph** | Codes expire |
| Members, consultation requests, contact messages | **Convex — unchanged** | Personal data submitted by the *public*, not authored by editors |
| Legal pages | **Stays in code** | A privacy policy edited casually in a CMS is a real risk. Changes should go through review and a commit |
| Site config, nav, country list | **Stays in code** | Structure, not content |

The dividing line: Hygraph is where *editors write*; Convex is where *the public submits*.

### Steps

1. ✅ **Model the schema in Hygraph.** Transcribed from `docs/hygraph-schema.md`, which maps our existing `types/` one-to-one.
2. ✅ **Build the query layer** in `api/`. `client.ts` is the whole transport — one POST with the bearer token and `next: { revalidate: 3600 }`. `map.ts` holds four shared mappers. Then one file per model: a single query constant and a single `fetchX(): Promise<X[]>`.
3. ✅ **Rewrite the repository bodies.** Every exported signature stayed identical, so no page changed.
4. ✅ **Delete `lib/data`.** `legal.ts` moved to `lib/legal.ts` and availability to `lib/availability.ts`; the six mock content files are gone.
5. ✅ **Split verification** into `verify:code` (offline logic) and `verify:hygraph` (live content invariants).
6. **Content entry.** The client writes real content in Hygraph — no seed script, since every mock record was placeholder anyway.
7. **Deferred: preview mode.** Draft-stage token behind Next draft mode.
8. **Deferred: webhook revalidation.** Currently the site refreshes hourly on its own; a webhook would make publishing instant.

### Why the query layer is this small

The repositories already do filtering, sorting, pagination, counts and relatedness in memory over arrays. So `api/` only ever needs to hand them an array. One query per model, cached by Next for an hour — no `where` builders, no connection/aggregate counts, no card/full field splits, no draft stage. If the corpus grows past a few hundred records, push filtering into GraphQL then; not before.

The `status: "approved"` story gate survives as a defensive filter in the repository, but Hygraph's publish step is now the actual review.

### Content-shape decisions

- **Rich text.** Hygraph's Rich Text field returns several formats including markdown. Requesting markdown keeps our existing `Prose` renderer and its safe-link handling working unchanged. Taking the JSON AST gives more structural control but needs a new renderer. **Try markdown first.**
- **Images.** Hygraph hosts and transforms assets; add their domain to `next.config.ts` `remotePatterns`. `EntityImage`'s placeholder fallback stays useful for entries without a cover.
- **Relations at scale.** `lib/relations.ts` computes tag overlap in memory across the whole dataset. At ~50 records that's free; against an API we either fetch everything or precompute. Fine now — **the thing to revisit past a few hundred resources.**

### Consequences to handle

- Hygraph becomes a **named subprocessor** and must be added to the privacy policy's "Who else sees it" section.
- Their compliance posture (SOC 2 Type 2, ISO 27001, GDPR) should be recorded alongside Convex and Resend.
- **Verify current pricing and limits before committing** — API request allowance, editor seats (Henry, Precious, plus developer), asset storage.

### Resolved

- **Availability stays out of Hygraph.** It's booking state, not editorial content — it changes when a slot is taken, not when someone writes something. It now lives in `lib/availability.ts` until a real booking provider replaces it. Consultation *types* and *FAQs* did move to Hygraph, since prices and copy are editorial.
- **Legal pages stay in code** (`lib/legal.ts`). They need lawyer sign-off, not editor convenience, and all three are still flagged `draft`.

### Outstanding

- Add Hygraph to the privacy policy's subprocessor list (that section is currently removed — needs restoring alongside Convex and Resend).
- `bun add libphonenumber-js` — currently only a transitive dependency.

## 9. Deferred to phase 2 (post-sign-off)

Auth & user accounts · saved resources/clinics/stories · personal dashboard · event reminders · discussion forums · AI recommendations · moderated clinic reviews · multi-language · partner portal · CMS/admin dashboard · analytics · newsletter automation · story & resource submission workflows · Stripe payments for consultations · real calendar integration.

The brief lists these as "Future Features" — the phase 1 architecture (repository layer, tag-based relations, URL-driven filter state) is shaped so none of them require a rewrite.

---

## 10. Open questions for the client

1. **Assets** — logo (SVG), brand hex values, licensed photography? Mockups use stock imagery we can't ship.
2. **"Join Community"** — where does this actually go? A Facebook/WhatsApp group, an email list, or an on-platform account (which would pull auth into phase 1)?
3. **Consultation payments** — Stripe? And is the calendar Cal.com/Calendly-embedded or custom?
4. **Content volume at launch** — how many real resources/stories/clinics exist today? Drives whether pagination and search need to be server-side.
5. **Legal copy** — who supplies Privacy, Terms and the medical Disclaimer? These need real review given the health context.
6. **Story submission** — mockups show "Share Your Story" but the brief lists submission workflow as a future feature. Phase 1 = form to email, or link out?
