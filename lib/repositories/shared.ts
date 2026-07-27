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
 * Editorial picks first, then topped up to `limit` from the rest.
 *
 * Homepage rails are fixed three-column grids, so returning only the records
 * an editor happened to flag produces ragged rows — five cards in a
 * three-across grid leaves a visible hole. Featured items keep their priority
 * and ordering; the remainder just prevents the layout depending on how many
 * checkboxes someone ticked in the CMS.
 */
export function featuredFirst<T extends { id: string }>(
  all: T[],
  isFeatured: (item: T) => boolean,
  compare: (a: T, b: T) => number,
  limit: number,
): T[] {
  const sorted = [...all].sort(compare);
  const featured = sorted.filter(isFeatured);

  if (featured.length >= limit) return featured.slice(0, limit);

  const chosen = new Set(featured.map((item) => item.id));
  const filler = sorted.filter((item) => !chosen.has(item.id));

  return [...featured, ...filler].slice(0, limit);
}

/** Case-insensitive contains, tolerant of undefined query values. */
export function matches(haystack: string, needle?: string): boolean {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}
