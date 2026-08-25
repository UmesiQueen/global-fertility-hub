import type { Paginated } from "@/types";

/**
 * Shared pagination for every listing repository, so page/pageSize clamping
 * behaves identically everywhere and a bad `?page=` in the URL can never
 * render an empty grid.
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

/**
 * The editor's picks, capped at `limit`.
 *
 * If nothing is flagged at all, falls back to the most recent `limit` records
 * so a homepage rail never renders as an empty band on a fresh site.
 *
 * The fallback is deliberately all-or-nothing. An earlier version topped a
 * short list up to `limit` from the unflagged remainder, to keep the
 * three-column grids from going ragged — but that meant unticking "Featured"
 * had no visible effect, and a checkbox in the CMS that does nothing is worse
 * than an uneven row. One featured record now means one card.
 */
export function featuredFirst<T extends { id: string }>(
  all: T[],
  isFeatured: (item: T) => boolean,
  compare: (a: T, b: T) => number,
  limit: number,
): T[] {
  const sorted = [...all].sort(compare);
  const featured = sorted.filter(isFeatured);

  if (featured.length) return featured.slice(0, limit);

  return sorted.slice(0, limit);
}

/** Case-insensitive contains, tolerant of undefined query values. */
export function matches(haystack: string, needle?: string): boolean {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}
