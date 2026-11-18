import { byNewest, paginate } from "@/lib/repositories/shared";
import { NEWS_TYPES, type NewsPost, type NewsType, type Paginated } from "@/types";

/**
 * Pure news layout — shared by the repository and the /news listing.
 *
 * With no type filter, the page leads with one big "news of the day" card, a
 * short "Latest news" sidebar beside it, and a grid of everything else. Once a
 * type is chosen it's a plain grid of that type, newest first: the lead and
 * sidebar are the front page, not part of every view.
 */

/** How many posts sit in the sidebar beside the lead card. */
export const LATEST_COUNT = 2;

export interface NewsQuery {
  type?: string;
  page?: number;
  pageSize?: number;
}

export interface NewsLayout {
  /** The pinned post, or the newest one when nothing is pinned. Null when filtered. */
  lead: NewsPost | null;
  /** Empty when filtered. */
  latest: NewsPost[];
  /** Everything after the lead and the sidebar, newest first — or, when
   * filtered, every post of that type. */
  rest: Paginated<NewsPost>;
  /** Posts matching the filter, lead and sidebar included. */
  total: number;
}

export const isNewsType = (value?: string): value is NewsType =>
  NEWS_TYPES.includes(value as NewsType);

/**
 * Editors pin a lead with "Is featured". If more than one is ticked, the
 * newest pinned post wins, so forgetting to untick an old one never buries
 * today's story.
 */
export function pickLead(sorted: NewsPost[]): NewsPost | null {
  return sorted.find((post) => post.isFeatured) ?? sorted[0] ?? null;
}

export function queryNews(
  all: NewsPost[],
  { type, page = 1, pageSize = 9 }: NewsQuery = {},
): NewsLayout {
  if (isNewsType(type)) {
    const sorted = all.filter((post) => post.type === type).sort(byNewest);
    return {
      lead: null,
      latest: [],
      rest: paginate(sorted, page, pageSize),
      total: sorted.length,
    };
  }

  const sorted = [...all].sort(byNewest);

  const lead = pickLead(sorted);
  const others = sorted.filter((post) => post !== lead);
  const latest = others.slice(0, LATEST_COUNT);

  return {
    lead,
    latest,
    rest: paginate(others.slice(LATEST_COUNT), page, pageSize),
    total: sorted.length,
  };
}

/** Posts per type, so the chips can show counts. */
export function countNewsTypes(all: NewsPost[]): Record<NewsType, number> {
  const counts = Object.fromEntries(NEWS_TYPES.map((t) => [t, 0])) as Record<
    NewsType,
    number
  >;
  for (const post of all) counts[post.type] = (counts[post.type] ?? 0) + 1;
  return counts;
}
