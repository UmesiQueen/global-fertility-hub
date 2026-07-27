import { clinics } from "@/lib/data/clinics";
import { events } from "@/lib/data/events";
import { resources } from "@/lib/data/resources";
import { stories } from "@/lib/data/stories";
import { findRelated } from "@/lib/relations";
import type { Clinic, Event, Paginated, Resource, Story } from "@/types";
import { featuredFirst, matches, paginate } from "./shared";

/**
 * The only supported way for a page to read community stories.
 *
 * The approval filter is applied here, once, rather than in each page. Stories
 * are reviewed before publication, and an unreviewed story reaching the site
 * because a page forgot to filter is the kind of failure this project cannot
 * afford.
 */
const published = () => stories.filter((story) => story.status === "approved");

/** The nine category chips from the brief, in display order. */
export const STORY_CATEGORIES = [
  "IVF",
  "Male Fertility",
  "Pregnancy Loss",
  "PCOS",
  "Endometriosis",
  "Success Stories",
  "LGBTQ+",
  "Donor Conception",
  "International IVF",
] as const;

export interface StoryQuery {
  search?: string;
  category?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export async function getStories(
  query: StoryQuery = {},
): Promise<Paginated<Story>> {
  const { search, category, sort = "newest", page = 1, pageSize = 12 } = query;

  let items = published();

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

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  return published().find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedStories(limit = 6): Promise<Story[]> {
  return featuredFirst(
    published(),
    (item) => Boolean(item.isFeatured),
    (a, b) => b.publishedAt.localeCompare(a.publishedAt),
    limit,
  );
}

export async function getAllStorySlugs(): Promise<string[]> {
  return published().map((item) => item.slug);
}

/** Counts per category chip, so the UI can show or dim empty filters. */
export async function getStoryCategoryCounts(): Promise<
  Record<string, number>
> {
  return published().reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, {});
}

export async function getSimilarStories(
  story: Story,
  limit = 3,
): Promise<Story[]> {
  return findRelated(story, published(), limit);
}

export async function getRelatedResourcesForStory(
  story: Story,
  limit = 3,
): Promise<Resource[]> {
  return findRelated(story, resources, limit);
}

export async function getRelatedClinicsForStory(
  story: Story,
  limit = 3,
): Promise<Clinic[]> {
  return findRelated(story, clinics, limit);
}

export async function getRelatedEventsForStory(
  story: Story,
  limit = 3,
): Promise<Event[]> {
  return findRelated(story, events, limit);
}
