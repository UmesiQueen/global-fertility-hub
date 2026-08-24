# Global Fertility Hub — Working Conventions

Read `PROJECT_PLAN.md` for scope, routes and phases. This file is the *how*.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 (CSS-first) · shadcn v4 on `@base-ui/react` (style: `base-luma`) · lucide-react · Biome + ESLint · Bun.

Commands: `bun dev` · `bun run build` · `bun run lint`

## Hard rules

1. **Pages never import `api/*` directly.** Always go through `lib/repositories/*`. The repositories own filtering, sorting, pagination, relatedness and the guardrails below — a page that queries Hygraph itself bypasses all of them.
2. **Repository functions are `async`**, even when returning static data.
3. **Server Components by default.** `"use client"` only for interactivity — filters, calendars, carousels, sheets, forms. Push the boundary as far down the tree as possible.
4. **Filter and search state lives in the URL**, not `useState`. Shareable, back-button friendly, SEO-safe.
5. **No hardcoded colors.** Only theme tokens (`bg-primary`, `text-muted-foreground`). If a color isn't in `globals.css`, add it there first.
6. **Mobile-first.** Write the base styles for 375px, then layer `md:` / `lg:`.
7. **Every image needs meaningful `alt`.** Use `next/image` everywhere.
8. **Every detail route** exports `generateMetadata` + `generateStaticParams`.

## Content & tone guardrails

These come from the client brief and are not stylistic preferences — they're the product's legal and ethical posture.

- Clinics are **"Educational Clinic Partners"**. Never rank, score, rate, or recommend them. No "best", "top", "recommended". The badge reads *Educational Partner*.
- **Nothing on this site is medical advice.** Consultations with Henry & Precious are *support and advocacy*. Copy must never imply diagnosis or treatment guidance.
- Stories are **reviewed before publication**; authors may be `Anonymous`.
- Voice: warm, calm, hopeful, plain-English. Avoid clinical jargon where a normal word exists. The reader may be in a painful place — never breezy, never alarmist.
- Design language: white space, soft colours, high-quality photography, simple navigation. Premium but not sterile.

## Commits

Conventional Commits, scoped to the area of the app. One commit per meaningful chunk of work — not one per file, not one per phase.

```
feat(header): add sticky site header with mobile drawer

Desktop nav with active underline, Base UI drawer on mobile,
search trigger and Join Community CTA.
```

- Subject: `type(scope): imperative summary`, lower case, no trailing period, ≤ 72 chars.
- Body: 1–3 lines on *what* and *why*. Skip it if the subject says everything.
- Types: `feat` · `fix` · `refactor` · `style` · `docs` · `chore` · `perf` · `test`
- Scopes follow the structure: `header` `footer` `home` `resources` `partners` `stories` `events` `about` `consultations` `theme` `types` `data` `seo` `a11y` `deps`

At the end of every phase or large chunk, propose the commit message(s) alongside the work.

## Naming

- Routes: kebab-case (`/educational-partners`)
- Components: PascalCase files in `components/<group>/`
- Types: singular (`Resource`, `Clinic`), in `types/`
- Repository fns: `getX()`, `getXBySlug()`, `getFeaturedX()`, `getRelatedX()`

## Structure

```
api/            Hygraph — one query per model, mapped to our own types
  client.ts     the whole transport: POST, bearer token, 1h revalidate
  map.ts        enumIn / asset / md / date
app/            routes only — thin, composed of section/card components
components/
  ui/           shadcn primitives (don't hand-edit; re-run the CLI)
  layout/       header, footer, nav, container, page hero
  cards/        one card component per entity
  filters/      search, sidebar, chips, sort
  sections/     homepage + page-level composed sections
  shared/       cross-cutting: RelatedGrid, TrustChips, ScriptAccent, MedicalDisclaimer
lib/
  repositories/ the ONLY way pages read content
  relations.ts  tag-overlap relatedness for all entities
  availability.ts  bookable slots — booking state, not CMS content
  legal.ts      privacy / terms / disclaimer — authored in code, not the CMS
  utils.ts      cn()
types/          shared TS types
```

`api/` fetches whole collections; the repositories filter, sort and paginate
in memory. That's deliberate — the corpus is small, Next caches each query for
an hour, and it keeps the query layer to one plain `fetch` per model.

## Verification

- `bun run verify:code` — offline. URL helpers, markdown, formatters, zod
  schemas, timezone maths, legal docs, the disclosure guardrails that live in
  page source. Runs in about a second, needs no credentials.
- `bun run verify:hygraph` — live. Every query, plus the invariants that must
  hold whatever editors publish: unique kebab-case slugs, tags in the
  controlled vocabulary, alt text everywhere, no ranking field on a clinic,
  approved stories only, no product claiming to affect fertility.

Counts are reported, never asserted — "8 products" was a fact about mock data.

## Typography

- `font-heading` → Space Grotesk
- `font-sans` → Inter
- `font-script` → accent lines **only** (the pink handwritten phrases). Never for body or UI text.

## Accessibility

Target WCAG 2.1 AA. Visible focus rings, 4.5:1 text contrast, 44px touch targets, real landmarks (`header`/`nav`/`main`/`footer`), skip-to-content link. Health content is read by people under stress and often on phones — accessibility is a functional requirement here, not a checkbox.

## Definition of done for a page

Responsive at 375/768/1024/1440 · keyboard navigable · `generateMetadata` present · loading + empty states handled · no hardcoded colors · `bun run build` clean · matches the mockup.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
