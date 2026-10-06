import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Hygraph publish webhook.
 *
 *   POST /api/revalidate
 *   x-revalidate-secret: <HYGRAPH_REVALIDATE_SECRET>
 *
 * Every published Hygraph query is tagged "hygraph" (see api/client.ts), and
 * the listing and detail pages are static, regenerated hourly. Without this,
 * a publish takes up to an hour to appear. With it, Hygraph calls here on
 * publish or unpublish and the next visit to any page regenerates it once
 * with fresh content.
 *
 * The secret travels in a header rather than the query string so it never
 * ends up in request logs.
 */

function secretMatches(given: string | null, expected: string): boolean {
  if (!given) return false;

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

function reply(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request): Promise<Response> {
  const expected = process.env.HYGRAPH_REVALIDATE_SECRET;
  if (!expected) {
    return reply(500, {
      error:
        "HYGRAPH_REVALIDATE_SECRET is not set on this deployment. Add it in Vercel -> Settings -> Environment Variables and redeploy.",
    });
  }

  if (!secretMatches(request.headers.get("x-revalidate-secret"), expected)) {
    return reply(401, { error: "Invalid revalidate secret." });
  }

  // Expire now rather than stale-while-revalidate: an editor who just pressed
  // Publish expects to see it on the next refresh, not the one after.
  revalidateTag("hygraph", { expire: 0 });

  return reply(200, { revalidated: true, now: Date.now() });
}
