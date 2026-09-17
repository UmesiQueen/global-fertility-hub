import { isDraftEnabled } from "@/lib/preview";

/** Server-only. No env var here is NEXT_PUBLIC_, so none can reach the browser. */

export async function hygraphFetch<T>(query: string): Promise<T> {
  const endpoint = process.env.NEXT_HYGRAPH_ENDPOINT;
  if (!endpoint) throw new Error("NEXT_HYGRAPH_ENDPOINT is not set");

  // Set by /api/preview, which checks HYGRAPH_PREVIEW_SECRET first. Off for
  // every ordinary visitor and for everything rendered at build time.
  const draft = await isDraftEnabled();

  // The published token is scoped to the PUBLISHED stage, so it cannot read a
  // draft even if asked. Previewing needs its own token; falling back to the
  // published one keeps the site working (published content only) rather than
  // erroring out when the draft token hasn't been added yet.
  const token = draft
    ? (process.env.HYGRAPH_DRAFT_TOKEN ?? process.env.HYGRAPH_AUTH_TOKEN)
    : process.env.HYGRAPH_AUTH_TOKEN;

  // Every query declares `$stage: Stage!`, so the stage is chosen per request
  // rather than baked into the query strings.
  const stage = draft ? "DRAFT" : "PUBLISHED";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Only sent when we actually have one. `Bearer undefined` is a malformed
      // token, which Hygraph rejects outright — worse than no header at all,
      // since a public-read endpoint would have answered fine without it.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables: { stage } }),
    ...(draft
      ? // A preview that can be served from a cache is not a preview. The
        // point of the link is to show the editor what they just typed.
        { cache: "no-store" as const }
      : {
          next: {
            // Dev reads through every time. Next's Data Cache lives on the
            // server, so a cached response survives browser refreshes,
            // incognito windows and dev-server restarts alike — which makes an
            // editor's change look like it simply didn't save. Not a trade
            // worth making while authoring content.
            revalidate: process.env.NODE_ENV === "production" ? 3600 : 0,
            // Lets a Hygraph publish webhook call revalidateTag("hygraph")
            // later and drop every query at once, instead of waiting out the
            // hour.
            tags: ["hygraph"],
          },
        }),
  });

  const json = await response.json();

  // GraphQL answers 200 even when the query failed, so this has to be checked.
  if (json.errors) {
    const message = json.errors
      .map((e: { message: string }) => e.message)
      .join("; ");

    // "not allowed" is always permissions, never the query. Say which of the
    // two causes it is rather than making someone guess.
    if (/not allowed|permission/i.test(message)) {
      if (draft) {
        throw new Error(
          `Hygraph: ${message} — this was a DRAFT read. Add a Permanent Auth Token with Read on the DRAFT stage for every model and set it as HYGRAPH_DRAFT_TOKEN (Project settings -> API Access -> Permanent Auth Tokens).`,
        );
      }

      throw new Error(
        token
          ? `Hygraph: ${message} — HYGRAPH_AUTH_TOKEN was sent, so grant it Read on this model in the PUBLISHED stage (Project settings -> API Access -> Permanent Auth Tokens).`
          : `Hygraph: ${message} — no HYGRAPH_AUTH_TOKEN is set. Either add one to .env.local or enable public read (Project settings -> API Access -> Public Content API).`,
      );
    }

    throw new Error(`Hygraph: ${message}`);
  }

  return json.data;
}
