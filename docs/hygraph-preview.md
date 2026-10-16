# Hygraph draft preview

Lets an editor click **Preview** in Hygraph and see an unpublished entry
rendered by the real site, without that entry being reachable by anyone else.

Follows Hygraph's own guide:
<https://hygraph.com/docs/developer-guides/schema/live-preview-frontend>

## The preview URL

One per model, set in Hygraph under **Project settings → Content → Preview URLs**
(or per-model, **Schema → <Model> → Preview URL**):

```
https://global-fertility-hub.vercel.app/api/preview?secret=YOUR_SECRET&type=product&slug={slug}
```

`YOUR_SECRET` is `HYGRAPH_PREVIEW_SECRET`. `{slug}` is substituted by Hygraph.
`type` picks the section to land in:

| `type`     | Model    | Lands on                     |
| ---------- | -------- | ---------------------------- |
| `product`  | Product  | `/store/{slug}`              |
| `story`    | Story    | `/stories/{slug}`            |
| `resource` | Resource | `/collections/{slug}`          |
| `clinic`   | Clinic   | `/educational-partners/{slug}` |
| `event`    | Event    | `/events/{slug}`             |

The doc's template is `?secret=…&slug={slug}` because its example site has one
model. `type` is our addition — five models at five different paths — and it is
checked against a whitelist rather than taking a free-form `?path=`, which would
make the endpoint an open redirect on our own domain.

The URL deliberately does **not** point straight at `/store/{slug}`. Next has
no way to know that request wants unpublished content — `/api/preview` checks
the secret and sets the draft-mode cookie first, then redirects.

## What has to be configured

1. **`HYGRAPH_PREVIEW_SECRET`** — any strong random string
   (`openssl rand -hex 32`). Must be set in **Vercel**, not only `.env.local`;
   `.env.local` is never deployed. Missing on the deployment → 500 with a
   message saying exactly that.
2. **`HYGRAPH_DRAFT_TOKEN`** — a Permanent Auth Token with Read on the **DRAFT**
   stage for every model, and DRAFT as its default stage
   (Project settings → API Access → Permanent Auth Tokens). Without it, preview
   links resolve but show published content only.
3. Nothing else. `NEXT_HYGRAPH_ENDPOINT` serves both stages — the High
   Performance Content API returns draft and published alike and caches them
   independently. The stage comes from the `stage` argument and the token, not
   from which host you call.

## The iframe cookie

Hygraph Studio renders the preview in an iframe on `hygraph.com`, so every
request to us is cross-site. Next sets the draft cookie `SameSite=Lax`, and a
Lax cookie is not sent cross-site — the page would load with draft mode
silently off and 404 on anything unpublished.

`/api/preview` therefore rewrites the cookie to `SameSite=None; Secure` after
enabling draft mode. This is the workaround the Hygraph doc calls for, and
without it preview appears broken for no visible reason.

Two consequences:

- Browsers only accept `SameSite=None` with `Secure`, so it is applied on HTTPS
  only. On `http://localhost` the Lax default stays — fine for previewing
  outside the iframe, and setting None there would have the browser drop the
  cookie and break local preview entirely.
- `SameSite=None` means the cookie travels on cross-site requests generally. It
  stays httpOnly and signed by Next, and the iframe is the point, but this is a
  real loosening rather than a formality — which is the other reason
  `/api/exit-preview` exists.

## How it works

- `app/api/preview/route.ts` — constant-time secret check, model → path
  whitelist, `draftMode().enable()`, the SameSite rewrite, then a redirect.
- `lib/preview.ts` — the whitelist and `isDraftEnabled()`.
- `api/client.ts` — asks `isDraftEnabled()` per request and sends
  `stage: DRAFT` with the draft token and `cache: "no-store"`, or
  `stage: PUBLISHED` with the published token and the usual 1h revalidate.
  Every query in `api/*.ts` declares `$stage: Stage!` for this.

  The doc reads `draftMode()` in the page component and passes the stage down.
  Doing it here instead keeps the "no page imports `@/api` directly" rule — the
  alternative is threading a flag through every page and repository.
- `components/layout/preview-banner.tsx` — the bar saying this is unpublished,
  with an Exit link.
- `app/api/exit-preview/route.ts` — clears the cookie and returns the editor to
  the page they were on. Worth using: the cookie otherwise lasts the whole
  browser session.

## The one guardrail this relaxes

`lib/repositories/stories.ts` normally drops any story that isn't `approved`.
In draft mode it doesn't — otherwise previewing a story for review would 404
for the reviewer. It is gated on the secret, `no-store`, and banner-labelled.
If that trade isn't wanted, delete the `isDraftEnabled()` early return in
`published()` and story previews will only work post-approval.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| 404 on the preview link | The URL points at a content path instead of `/api/preview`, or the deployment predates this route. |
| Works in a new tab, 404 inside Studio's iframe | The SameSite rewrite isn't reaching the browser — check the deployment is HTTPS and current. |
| 500 "Preview is not configured" | `HYGRAPH_PREVIEW_SECRET` missing on the deployment. |
| 401 "Invalid preview secret" | Secret in the Hygraph URL ≠ the deployed env var. |
| 400 with the type list | `type` missing or misspelled in the preview URL. |
| Preview loads but shows the published version | `HYGRAPH_DRAFT_TOKEN` missing, or lacks DRAFT read on that model. |
| Preview never persists on localhost | Expected over http — `Secure` cookies need HTTPS. Test on the Vercel URL. |
| Hygraph error mentioning permissions | The message names which token and stage to fix. |
