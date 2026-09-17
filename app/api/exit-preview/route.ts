import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Turns draft mode off again and puts the editor back where they were.
 *
 * Linked from the preview banner. Without it the draft cookie survives until
 * the browser session ends, and an editor who opened one preview keeps seeing
 * unpublished content on every page they visit afterwards.
 */

/**
 * Only same-origin, single-slash paths. `redirect()` will happily send someone
 * to another site, and this endpoint takes its destination from a header.
 */
function safePath(referer: string | null, origin: string): string {
  if (!referer) return "/";

  try {
    const url = new URL(referer);
    if (url.origin !== origin) return "/";
    return `${url.pathname}${url.search}`;
  } catch {
    return "/";
  }
}

export async function GET(request: Request): Promise<Response> {
  (await draftMode()).disable();

  const { origin } = new URL(request.url);
  redirect(safePath(request.headers.get("referer"), origin));
}
