import { matches, paginate } from "@/lib/repositories/shared";
import type { Paginated, Story } from "@/types";

/**
 * Pure story filtering — shared by the repository and the /stories listing.
 *
 * Takes stories that are already approved. The approval filter stays in the
 * repository, so nothing unreviewed can reach this function from a page.
 */

export interface StoryQuery {
  search?: string;
  category?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export function queryStories(
  all: Story[],
  query: StoryQuery = {},
): Paginated<Story> {
  const { search, category, sort = "newest", page = 1, pageSize = 12 } = query;

  let items = [...all];

  if (category) items = items.filter((item) => item.category === category);

  if (search) {
    items = items.filter(
      (item) =>
        matches(item.title, search) ||
        matches(item.preview, search) ||
        matches(item.category, search),
    );
  }

  items.sort((a, b) =>
    sort === "oldest"
      ? a.publishedAt.localeCompare(b.publishedAt)
      : b.publishedAt.localeCompare(a.publishedAt),
  );

  return paginate(items, page, pageSize);
}
