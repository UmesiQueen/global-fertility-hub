import { fetchClinics } from "@/api/clinics";
import { fetchEvents } from "@/api/events";
import { fetchResources } from "@/api/resources";
import {
  byNewestResource as byNewest,
  queryResources,
  type ResourceQuery,
} from "@/lib/listing/resources";
import { findRelated } from "@/lib/relations";
import type {
  Clinic,
  Event,
  Paginated,
  Resource,
  ResourceFormat,
} from "@/types";
import { featuredFirst } from "./shared";

/** The only supported way for a page to read resources. */

export type { ResourceQuery };

export async function getResources(
  query: ResourceQuery = {},
): Promise<Paginated<Resource>> {
  return queryResources(await fetchResources(), query);
}

/** Every resource, for listings that filter in the browser. */
export async function getAllResources(): Promise<Resource[]> {
  return fetchResources();
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
