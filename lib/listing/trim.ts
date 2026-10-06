/**
 * Drops the long-form body before a list is handed to the browser.
 *
 * Listing pages ship every record to the client so filtering can run there,
 * and the body (full article or story text) is by far the heaviest field —
 * yet no card ever shows it. Blanking it keeps the type intact while keeping
 * the page payload close to what the cards actually render.
 */
export function withoutBody<T extends { body: string }>(items: T[]): T[] {
  return items.map((item) => ({ ...item, body: "" }));
}
