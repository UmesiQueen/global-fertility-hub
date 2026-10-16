import { paginate } from "@/lib/repositories/shared";
import type {
  Paginated,
  Resource,
  ResourceCategory,
  ResourceFormat,
} from "@/types";

/** Pure resource filtering — shared by the repository and the /collections listing. */

export interface ResourceQuery {
  search?: string;
  category?: ResourceCategory;
  formats?: ResourceFormat[];
  tag?: string;
  sort?: "newest" | "oldest" | "reading-time";
  page?: number;
  pageSize?: number;
}

export const byNewestResource = (a: Resource, b: Resource) =>
  b.publishedAt.localeCompare(a.publishedAt);

export function queryResources(
  all: Resource[],
  query: ResourceQuery = {},
): Paginated<Resource> {
  const {
    search,
    category,
    formats,
    tag,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = query;

  let items = [...all];

  if (category) items = items.filter((item) => item.category === category);
  if (formats?.length) {
    items = items.filter((item) => formats.includes(item.format));
  }
  if (tag) items = items.filter((item) => item.tags.includes(tag as never));

  if (search) {
    // Title and excerpt only — matching body surfaces results whose relevance
    // the reader can't see from the card.
    const term = search.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.excerpt.toLowerCase().includes(term) ||
        item.tags.some((t) => t.includes(term)),
    );
  }

  switch (sort) {
    case "oldest":
      items.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
      break;
    case "reading-time":
      items.sort((a, b) => a.readingTime - b.readingTime);
      break;
    default:
      items.sort(byNewestResource);
  }

  return paginate(items, page, pageSize);
}
