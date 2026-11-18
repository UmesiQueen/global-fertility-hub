import { fetchNewsPosts } from "@/cms/news";
import { fetchResources } from "@/cms/resources";
import { pickLead, queryNews, type NewsQuery } from "@/lib/listing/news";
import { findRelated, findRelatedWithFallback } from "@/lib/relations";
import type { NewsPost, Resource } from "@/types";
import { byNewest } from "./shared";

/**
 * The only supported way for a page to read news posts.
 *
 * News has no review status of its own: publishing in Hygraph is the review,
 * as with resources.
 */

export type { NewsQuery };

export async function getNews(query: NewsQuery = {}) {
  return queryNews(await fetchNewsPosts(), query);
}

/** Every published post, for the listing that filters in the browser. */
export async function getAllNewsPosts(): Promise<NewsPost[]> {
  return fetchNewsPosts();
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  return (await fetchNewsPosts()).find((post) => post.slug === slug) ?? null;
}

export async function getAllNewsSlugs(): Promise<string[]> {
  return (await fetchNewsPosts()).map((post) => post.slug);
}

/** The "news of the day": the pinned post, or the newest one. */
export async function getLeadNewsPost(): Promise<NewsPost | null> {
  return pickLead([...(await fetchNewsPosts())].sort(byNewest));
}

export async function getLatestNews(limit = 3): Promise<NewsPost[]> {
  return [...(await fetchNewsPosts())].sort(byNewest).slice(0, limit);
}

/** Fills the row from the newest posts when too few share a tag. */
export async function getMoreNews(
  post: NewsPost,
  limit = 3,
): Promise<NewsPost[]> {
  const pool = [...(await fetchNewsPosts())].sort(byNewest);
  return findRelatedWithFallback(post, pool, limit);
}

export async function getRelatedResourcesForNews(
  post: NewsPost,
  limit = 3,
): Promise<Resource[]> {
  return findRelated(post, await fetchResources(), limit);
}
