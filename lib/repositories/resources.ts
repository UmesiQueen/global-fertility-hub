import { fetchClinics } from "@/api/clinics";
import { fetchEvents } from "@/api/events";
import { fetchResources } from "@/api/resources";
import { findRelated } from "@/lib/relations";
import type {
  Clinic,
  Event,
  Paginated,
  Resource,
  ResourceCategory,
  ResourceFormat,
} from "@/types";
import { featuredFirst, paginate } from "./shared";

/** The only supported way for a page to read resources. */

export interface ResourceQuery {
  search?: string;
  category?: ResourceCategory;
  formats?: ResourceFormat[];
  tag?: string;
  sort?: "newest" | "oldest" | "reading-time";
  page?: number;
  pageSize?: number;
}

const byNewest = (a: Resource, b: Resource) =>
  b.publishedAt.localeCompare(a.publishedAt);

export async function getResources(
  query: ResourceQuery = {},
): Promise<Paginated<Resource>> {
  const {
    search,
    category,
    formats,
    tag,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = query;

  let items = await fetchResources();

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
      items.sort(byNewest);
  }

  return paginate(items, page, pageSize);
}

export async function getResourceBySlug(
  slug: string,
): Promise<Resource | null> {
  const resources = await fetchResources();
  return resources.find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedResources(limit = 6): Promise<Resource[]> {
  const resources = await fetchResources();
  return featuredFirst(
    resources,
    (item) => Boolean(item.isFeatured),
    byNewest,
    limit,
  );
}

export async function getAllResourceSlugs(): Promise<string[]> {
  const resources = await fetchResources();
  return resources.map((item) => item.slug);
}

export async function getResourceCategoryCounts(): Promise<
  Record<string, number>
> {
  const resources = await fetchResources();
  return resources.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, {});
}

export async function getResourceFormatCounts(): Promise<
  Record<ResourceFormat, number>
> {
  const resources = await fetchResources();
  return resources.reduce(
    (counts, item) => {
      counts[item.format] = (counts[item.format] ?? 0) + 1;
      return counts;
    },
    {} as Record<ResourceFormat, number>,
  );
}

export async function getRelatedResources(
  resource: Resource,
  limit = 3,
): Promise<Resource[]> {
  return findRelated(resource, await fetchResources(), limit);
}

export async function getRelatedClinicsForResource(
  resource: Resource,
  limit = 3,
): Promise<Clinic[]> {
  return findRelated(resource, await fetchClinics(), limit);
}

export async function getRelatedEventsForResource(
  resource: Resource,
  limit = 3,
): Promise<Event[]> {
  return findRelated(resource, await fetchEvents(), limit);
}
