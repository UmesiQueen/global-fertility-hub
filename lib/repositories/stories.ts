import { fetchClinics } from "@/api/clinics";
import { fetchEvents } from "@/api/events";
import { fetchResources } from "@/api/resources";
import { fetchStories } from "@/api/stories";
import { queryStories, type StoryQuery } from "@/lib/listing/stories";
import { isDraftEnabled } from "@/lib/preview";
import { findRelated } from "@/lib/relations";
import type { Clinic, Event, Paginated, Resource, Story } from "@/types";
import { featuredFirst } from "./shared";

/**
 * The only supported way for a page to read community stories.
 *
 * The approval filter is applied here, once, rather than in each page. Stories
 * are reviewed before publication, and an unreviewed story reaching the site
 * because a page forgot to filter is the kind of failure this project cannot
 * afford. Hygraph's publishing step is that review, so this is belt and braces.
 *
 * Draft preview is the one exception, and it has to be: a story is previewed
 * precisely so someone can review it, and a preview that filters out the
 * unreviewed story shows a 404 to the person doing the reviewing. Draft mode is
 * only ever on behind HYGRAPH_PREVIEW_SECRET, the response is `no-store`, and
 * the page carries a banner saying what it is — so nothing unreviewed is
 * reachable by a reader who wasn't handed the preview link.
 */
const published = async () => {
  const stories = await fetchStories();
  if (await isDraftEnabled()) return stories;

  return stories.filter((story) => story.status === "approved");
};

/** The nine category chips from the brief, in display order. */
export const STORY_CATEGORIES = [
  "IVF",
  "Male Fertility",
  "Pregnancy Loss",
  "PMOS",
  "Endometriosis",
  "Success Stories",
  "Donor Conception",
  "International IVF",
] as const;

export type { StoryQuery };

export async function getStories(
  query: StoryQuery = {},
): Promise<Paginated<Story>> {
  return queryStories(await published(), query);
}

/** Every approved story, for listings that filter in the browser. */
export async function getAllStories(): Promise<Story[]> {
  return published();
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  return (await published()).find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedStories(limit = 6): Promise<Story[]> {
  return featuredFirst(
    await published(),
    (item) => Boolean(item.isFeatured),
    (a, b) => b.publishedAt.localeCompare(a.publishedAt),
    limit,
  );
}

export async function getAllStorySlugs(): Promise<string[]> {
  return (await published()).map((item) => item.slug);
}

/** Counts per category chip, so the UI can show or dim empty filters. */
export async function getStoryCategoryCounts(): Promise<
  Record<string, number>
> {
  return (await published()).reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, {});
}

export async function getSimilarStories(
  story: Story,
  limit = 3,
): Promise<Story[]> {
  return findRelated(story, await published(), limit);
}

export async function getRelatedResourcesForStory(
  story: Story,
  limit = 3,
): Promise<Resource[]> {
  return findRelated(story, await fetchResources(), limit);
}

export async function getRelatedClinicsForStory(
  story: Story,
  limit = 3,
): Promise<Clinic[]> {
  return findRelated(story, await fetchClinics(), limit);
}

export async function getRelatedEventsForStory(
  story: Story,
  limit = 3,
): Promise<Event[]> {
  return findRelated(story, await fetchEvents(), limit);
}
