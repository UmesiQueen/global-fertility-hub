import { draftMode } from "next/headers";

/**
 * Hygraph draft preview.
 *
 * Hygraph is configured with one preview URL per model, all pointing at
 * `/api/preview`. That route checks a shared secret, turns on Next's draft
 * mode, and redirects to the real page — which then reads the DRAFT stage
 * instead of PUBLISHED, because `hygraphFetch` asks this module which stage
 * the current request wants.
 *
 * Both stages come from the same endpoint. The High Performance Content API in
 * NEXT_HYGRAPH_ENDPOINT serves draft and published alike, caching them
 * independently — the stage is chosen by the `stage` argument and the token,
 * not by which host you call.
 *
 * Everything here is server-only: `next/headers` cannot be imported from a
 * Client Component, and the secret and draft token never leave the server.
 */

/**
 * The routes a preview link is allowed to land on, keyed by the `type` the
 * Hygraph preview URL sends.
 *
 * A whitelist rather than a free-form `?path=`: the preview route redirects to
 * whatever it is handed, and an endpoint that redirects anywhere is an open
 * redirect waiting to be pasted into a phishing email.
 */
const PREVIEW_ROUTES = {
  product: "/store",
  story: "/stories",
  resource: "/resources",
  clinic: "/educational-partners",
  event: "/events",
} as const;

export type PreviewType = keyof typeof PREVIEW_ROUTES;

export const PREVIEW_TYPES = Object.keys(PREVIEW_ROUTES) as PreviewType[];

/**
 * `/store/the-fertility-journey-handbook` for `("product", "…handbook")`.
 * `null` for an unknown model or an empty slug, which the route turns into a
 * 400 rather than a redirect to nowhere.
 */
export function previewPath(
  type: string | null,
  slug: string | null,
): string | null {
  if (!type || !slug) return null;

  const base = PREVIEW_ROUTES[type as PreviewType];
  if (!base) return null;

  // Hygraph substitutes {slug} verbatim, so a slug with a slash or a `..` in
  // it would otherwise escape the section it belongs to.
  const clean = slug.trim();
  if (!clean || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(clean)) return null;

  return `${base}/${clean}`;
}

/**
 * Whether this request is a draft preview.
 *
 * `draftMode()` needs a request to read, and there isn't one during
 * `generateStaticParams` or `generateMetadata` at build time — so a throw here
 * means "no request", which means "not a preview". Static generation keeps
 * reading the published stage, exactly as before.
 */
export async function isDraftEnabled(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}
