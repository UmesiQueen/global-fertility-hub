import { fetchClinics } from "@/api/clinics";
import { fetchEvents } from "@/api/events";
import { fetchResources } from "@/api/resources";
import {
  byStartAsc,
  byStartDesc,
  type EventQuery,
  isReplay,
  isUpcoming,
  queryReplayLibrary,
  queryUpcomingEvents,
} from "@/lib/listing/events";
import { findRelated } from "@/lib/relations";
import type { Clinic, Event, Paginated, Resource } from "@/types";
import { featuredFirst } from "./shared";

/**
 * The only supported way for a page to read events.
 *
 * "Upcoming" versus "Replay Library" is derived, not stored: an event is a
 * replay once it has a `replayUrl`, and upcoming while its start time is in
 * the future. Deriving it means nobody has to remember to re-flag an event
 * the morning after it runs.
 *
 * `now` is injectable so this stays testable — otherwise every test depends
 * on the machine clock.
 */

export type { EventQuery };

export async function getUpcomingEvents(
  query: EventQuery = {},
): Promise<Paginated<Event>> {
  return queryUpcomingEvents(await fetchEvents(), query);
}

export async function getReplayLibrary(
  query: EventQuery = {},
): Promise<Paginated<Event>> {
  return queryReplayLibrary(await fetchEvents(), query);
}

/** Every event, for listings that split and filter in the browser. */
export async function getAllEvents(): Promise<Event[]> {
  return fetchEvents();
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const events = await fetchEvents();
  return events.find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedEvents(
  limit = 3,
  now = new Date(),
): Promise<Event[]> {
  const events = await fetchEvents();
  const upcoming = events.filter((event) => isUpcoming(event, now));

  // If nothing is upcoming, the homepage rail falls back to recent replays
  // rather than rendering empty.
  if (!upcoming.length) {
    return events
      .filter((event) => isReplay(event, now))
      .sort(byStartDesc)
      .slice(0, limit);
  }

  return featuredFirst(
    upcoming,
    (event) => Boolean(event.isFeatured),
    byStartAsc,
    limit,
  );
}

export async function getAllEventSlugs(): Promise<string[]> {
  const events = await fetchEvents();
  return events.map((item) => item.slug);
}

/** True when the event has already happened and a recording exists. */
export async function hasReplay(event: Event): Promise<boolean> {
  return Boolean(event.replayUrl);
}

export async function getRelatedEvents(
  event: Event,
  limit = 3,
): Promise<Event[]> {
  return findRelated(event, await fetchEvents(), limit);
}

export async function getRelatedResourcesForEvent(
  event: Event,
  limit = 3,
): Promise<Resource[]> {
  return findRelated(event, await fetchResources(), limit);
}

export async function getRelatedClinicsForEvent(
  event: Event,
  limit = 3,
): Promise<Clinic[]> {
  return findRelated(event, await fetchClinics(), limit);
}
