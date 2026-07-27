/**
 * URL-as-state helpers for the listing pages.
 *
 * Filters live in the query string rather than React state, so a filtered view
 * is shareable, survives the back button, and can be server-rendered. That
 * means the filter controls are mostly plain links — no client JS needed to
 * change a filter.
 */

/** Next 16 hands pages a promise of raw, possibly-repeated params. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** First value only — `?tag=a&tag=b` is a malformed single-value filter. */
export function readParam(
  params: RawSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = first?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Multi-value params, accepting both `?format=a&format=b` and `?format=a,b`.
 * The comma form keeps URLs short enough to share when several are selected.
 */
export function readParamList(
  params: RawSearchParams,
  key: string,
): string[] {
  const value = params[key];
  if (!value) return [];
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .flatMap((part) => part.split(","))
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Page numbers arrive as untrusted strings; repositories clamp the rest. */
export function readPage(params: RawSearchParams): number {
  const raw = readParam(params, "page");
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export type ParamChanges = Record<string, string | string[] | null | undefined>;

/**
 * Builds an href from the current params plus changes. `null` removes a key.
 *
 * Any change other than `page` itself resets pagination — otherwise applying a
 * filter while on page 4 lands the reader on an empty page 4 of a shorter
 * result set, which reads as "no results" rather than "wrong page".
 */
export function buildHref(
  pathname: string,
  current: RawSearchParams,
  changes: ParamChanges,
): string {
  const next = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item) next.append(key, item);
    }
  }

  const changesPagination = Object.keys(changes).some((key) => key !== "page");
  if (changesPagination) next.delete("page");

  for (const [key, value] of Object.entries(changes)) {
    next.delete(key);
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length) next.set(key, value.join(","));
    } else if (value) {
      next.set(key, value);
    }
  }

  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** Adds or removes one value from a multi-value param — for checkbox filters. */
export function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

/** True when anything other than pagination is applied — drives "Clear all". */
export function hasActiveFilters(
  params: RawSearchParams,
  keys: string[],
): boolean {
  return keys.some((key) => {
    const value = params[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });
}
