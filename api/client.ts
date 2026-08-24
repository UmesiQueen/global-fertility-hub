/** Server-only. Neither env var is NEXT_PUBLIC_, so this can't reach the browser. */

export async function hygraphFetch<T>(query: string): Promise<T> {
  const endpoint = process.env.NEXT_HYGRAPH_ENDPOINT;
  if (!endpoint) throw new Error("NEXT_HYGRAPH_ENDPOINT is not set");

  const token = process.env.HYGRAPH_AUTH_TOKEN;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Only sent when we actually have one. `Bearer undefined` is a malformed
      // token, which Hygraph rejects outright — worse than no header at all,
      // since a public-read endpoint would have answered fine without it.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
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
