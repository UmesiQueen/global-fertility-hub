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
`ivf · iui · male-fertility · pcos · endometriosis · pregnancy-loss · donor-conception · lgbtq · fertility-preservation · international-ivf · nutrition · mental-health · success-stories`

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
