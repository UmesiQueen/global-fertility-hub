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

/** Case-insensitive contains, tolerant of undefined query values. */
export function matches(haystack: string, needle?: string): boolean {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}
