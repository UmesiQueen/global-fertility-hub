import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Hygraph publish webhook that fills in `publishDate` on first publish.
 *
 *   POST /api/publish-date
 *   x-publish-date-secret: <HYGRAPH_PUBLISH_DATE_SECRET>   (custom header), or
 *   gcms-signature: sign=…, env=…, t=…   (Hygraph's signature, same secret)
 *
 * The custom header is the reliable one. Hygraph's signature is known to fail
 * on large payloads (github.com/hygraph/hygraph-utils issues 5 and 8), and
 * this webhook sends whole entries, rich text included.
 *
 * Hygraph can't default a date field to "now", so this does it. When a
 * Resource, Story, Product or NewsPost is published with Publish date empty,
 * Publish date is set to the moment it was published and the entry is
 * republished. An entry that already has a date is left alone, so a date an
 * editor picks by hand always wins and the first-publish date never moves.
 *
 * Republishing fires the webhook again. That second delivery arrives with the
 * date set and does nothing, so there's no loop even if the webhook isn't
 * limited to project-member publishes.
 *
 * Runs synchronously rather than after the response: two small mutations fit
 * well inside Hygraph's 3-second timeout, and answering with an error lets
 * Hygraph retry a failed attempt. A retry repeats the same write, so it's safe.
 */

/** Models that have a `publishDate` field. */
const MODELS = new Set(["Resource", "Story", "Product", "NewsPost"]);

/** Hygraph retries failed deliveries; leave room for a late retry. */
const MAX_AGE_MS = 60 * 60 * 1000;

interface WebhookPayload {
  operation?: string;
  data?: {
    __typename?: string;
    id?: string;
    stage?: string;
    publishDate?: string | null;
    publishedAt?: string | null;
  };
}

function reply(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/** A 200 that does nothing, logged so the dev terminal shows why. */
function skip(reason: string, payload: WebhookPayload): Response {
  const { __typename, id, stage, publishDate } = payload.data ?? {};
  console.info("[publish-date] skipped:", reason, {
    operation: payload.operation,
    __typename,
    id,
    stage,
    publishDate,
  });
  return reply(200, { skipped: reason });
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

type Check = { ok: true } | { ok: false; reason: string };

/** The custom header first, then Hygraph's signature. */
function authenticate(request: Request, rawBody: string, secret: string): Check {
  const shared = request.headers.get("x-publish-date-secret");
  if (shared !== null) {
    return safeEqual(shared, secret)
      ? { ok: true }
      : { ok: false, reason: "x-publish-date-secret doesn't match" };
  }
  return verifySignature(rawBody, request.headers.get("gcms-signature"), secret);
}

/**
 * Hygraph signs `JSON.stringify({ Body, EnvironmentName, TimeStamp })` with
 * HMAC-SHA256 and sends it base64-encoded, where Body is the request body as a
 * string. The raw text and a compact re-serialisation are both tried, as is
 * the parsed object some older examples used. All of them need the secret.
 */
function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string,
): Check {
  if (!header) return { ok: false, reason: "no x-publish-date-secret or gcms-signature header" };

  const parts = Object.fromEntries(
    header.split(",").map((part) => {
      const at = part.indexOf("=");
      return [part.slice(0, at).trim(), part.slice(at + 1).trim()];
    }),
  );
  const timestamp = Number(parts.t);
  if (!parts.sign || parts.env === undefined || !Number.isFinite(timestamp)) {
    return { ok: false, reason: "malformed gcms-signature header" };
  }
  // Hygraph's docs show milliseconds, but it sends seconds. Accept either for
  // the age check; the signed string keeps the number exactly as sent.
  const sentAtMs = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const age = Math.round((Date.now() - sentAtMs) / 1000);
  if (Math.abs(age) * 1000 > MAX_AGE_MS) {
    return { ok: false, reason: `signature timestamp is ${age}s old` };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    parsed = undefined;
  }

  const bodies =
    parsed === undefined
      ? [rawBody]
      : [rawBody, JSON.stringify(parsed), parsed];
  const matched = bodies.some((body) => {
    const expected = createHmac("sha256", secret)
      .update(
        JSON.stringify({
          Body: body,
          EnvironmentName: parts.env,
          TimeStamp: timestamp,
        }),
      )
      .digest("base64");
    return safeEqual(parts.sign, expected);
  });
  return matched
    ? { ok: true }
    : { ok: false, reason: "gcms-signature doesn't match the secret" };
}

/**
 * Sets the date and republishes in one request; GraphQL runs mutations in
 * order. Publishing sends the current draft live, so a draft edit saved in
 * the second or two after pressing Publish would go live with it.
 */
async function setPublishDate(model: string, id: string, value: string) {
  const endpoint =
    process.env.HYGRAPH_MUTATION_ENDPOINT ?? process.env.NEXT_HYGRAPH_ENDPOINT;
  const token = process.env.HYGRAPH_MUTATION_TOKEN;
  if (!endpoint || !token) {
    throw new Error(
      "HYGRAPH_MUTATION_TOKEN (and an endpoint) must be set on this deployment.",
    );
  }

  const query = `mutation SetPublishDate($id: ID!, $date: DateTime!) {
    update${model}(where: { id: $id }, data: { publishDate: $date }) { id }
    publish${model}(where: { id: $id }, to: PUBLISHED) { id }
  }`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { id, date: value } }),
    cache: "no-store",
    signal: AbortSignal.timeout(2500),
  });

  const json = await response.json().catch(() => null);
  if (json?.errors) {
    // Full detail for the terminal: `path` says which step was refused
    // (update… or publish…), which the message alone doesn't.
    console.error("[publish-date] Hygraph errors:", JSON.stringify(json.errors, null, 2));
  }
  if (!response.ok || !json || json.errors) {
    const message = json?.errors
      ?.map((error: { message: string }) => error.message)
      .join("; ");
    throw new Error(`Hygraph: ${message || `HTTP ${response.status}`}`);
  }
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.HYGRAPH_PUBLISH_DATE_SECRET;
  if (!secret) {
    return reply(500, {
      error:
        "HYGRAPH_PUBLISH_DATE_SECRET is not set on this deployment. Add it in Vercel -> Settings -> Environment Variables and redeploy.",
    });
  }

  // Read as text first: the signature covers the body exactly as sent.
  const rawBody = await request.text();
  const check = authenticate(request, rawBody, secret);
  if (!check.ok) {
    console.warn("[publish-date] rejected:", check.reason);
    return reply(401, { error: `Unauthorised: ${check.reason}.` });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return reply(400, { error: "Body is not JSON." });
  }

  const data = payload.data ?? {};
  const model = data.__typename;

  if (payload.operation?.toLowerCase() !== "publish" || data.stage !== "PUBLISHED") {
    return skip("Not a publish to the PUBLISHED stage.", payload);
  }
  if (!model || !MODELS.has(model) || !data.id) {
    return skip(`No publish date on ${model ?? "this model"}.`, payload);
  }
  if (!("publishDate" in data)) {
    return reply(422, {
      error:
        "The payload has no fields. Turn on 'Include payload' for this webhook in Hygraph.",
    });
  }
  if (data.publishDate) {
    return skip("Publish date already set.", payload);
  }

  const value = data.publishedAt ?? new Date().toISOString();

  try {
    await setPublishDate(model, data.id, value);
  } catch (error) {
    console.error("[publish-date]", model, data.id, error);
    return reply(500, {
      error: error instanceof Error ? error.message : "Update failed.",
    });
  }

  // The republish also fires /api/revalidate, but this keeps the new date from
  // depending on that webhook's settings.
  revalidateTag("hygraph", { expire: 0 });

  console.info("[publish-date] set", model, data.id, value);
  return reply(200, { updated: model, id: data.id, publishDate: value });
}
