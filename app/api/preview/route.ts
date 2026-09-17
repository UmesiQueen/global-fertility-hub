import { timingSafeEqual } from "node:crypto";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_TYPES, previewPath } from "@/lib/preview";

/**
 * The endpoint every Hygraph preview URL points at.
 *
 *   /api/preview?secret=<HYGRAPH_PREVIEW_SECRET>&type=product&slug={slug}
 *
 * Hygraph substitutes {slug} when an editor clicks Preview. We check the
 * secret, turn on draft mode — which sets a signed, httpOnly cookie Next reads
 * on every later request — and redirect to the real page, which now reads the
 * DRAFT stage.
 */

/** Next's own draft-mode cookie. Not exported by next/headers, so it's named here. */
const DRAFT_COOKIE = "__prerender_bypass";

/** Constant-time, so the endpoint can't be used to guess the secret a byte at a time. */
function secretMatches(given: string | null, expected: string): boolean {
  if (!given) return false;

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

function problem(status: number, detail: string): Response {
  return new Response(detail, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Never let a proxy hold on to an answer about a secret.
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Next sets the draft cookie SameSite=Lax. Hygraph Studio shows the preview in
 * an iframe on hygraph.com, which makes every request to us cross-site — and a
 * Lax cookie is never sent cross-site, so the page would load with draft mode
 * silently off and 404 on anything unpublished.
 *
 * Browsers only accept SameSite=None together with Secure, so this is applied
 * on HTTPS only. Over http://localhost the Lax default stays, which still works
 * for previewing outside the iframe — setting None there would have the browser
 * reject the cookie outright and break local preview entirely.
 */
async function allowCookieInIframe(): Promise<void> {
  const store = await cookies();
  const bypass = store.get(DRAFT_COOKIE);
  if (!bypass) return;

  store.set({
    name: DRAFT_COOKIE,
    value: bypass.value,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const expected = process.env.HYGRAPH_PREVIEW_SECRET;
  if (!expected) {
    return problem(
      500,
      "Preview is not configured: HYGRAPH_PREVIEW_SECRET is not set on this deployment. Add it in Vercel -> Settings -> Environment Variables and redeploy.",
    );
  }

  if (!secretMatches(url.searchParams.get("secret"), expected)) {
    return problem(401, "Invalid preview secret.");
  }

  const type = url.searchParams.get("type");
  const slug = url.searchParams.get("slug");
  const path = previewPath(type, slug);

  if (!path) {
    return problem(
      400,
      `Could not build a preview URL from type="${type ?? ""}" slug="${slug ?? ""}". ` +
        `Expected type to be one of: ${PREVIEW_TYPES.join(", ")}, and slug to be a kebab-case slug.`,
    );
  }

  (await draftMode()).enable();

  if (url.protocol === "https:") await allowCookieInIframe();

  // Throws NEXT_REDIRECT, which Next turns into a 307 — so nothing below runs
  // and this must stay outside a try/catch.
  redirect(path);
}
