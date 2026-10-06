import { matches, paginate } from "@/lib/repositories/shared";
import type { Event, Paginated } from "@/types";

/**
 * Pure event filtering — shared by the repository and the /events listing.
 *
 * "Upcoming" versus "Replay Library" is derived, not stored: an event is a
 * replay once it has a `replayUrl`, and upcoming while its start time is in
 * the future. Running this in the browser means the split uses the reader's
 * clock, not the time the page was last regenerated.
 *
 * `now` is injectable so this stays testable.
 */

export interface EventQuery {
  search?: string;
  type?: Event["type"];
  page?: number;
  pageSize?: number;
  now?: Date;
}

export const byStartAsc = (a: Event, b: Event) =>
  a.startsAt.localeCompare(b.startsAt);
export const byStartDesc = (a: Event, b: Event) =>
  b.startsAt.localeCompare(a.startsAt);

export function isUpcoming(event: Event, now: Date): boolean {
  return !event.replayUrl && new Date(event.startsAt).getTime() > now.getTime();
}

export function isReplay(event: Event, now: Date): boolean {
  return (
    Boolean(event.replayUrl) ||
    new Date(event.startsAt).getTime() <= now.getTime()
  );
}

function filterEvents(
  items: Event[],
  { search, type }: Pick<EventQuery, "search" | "type">,
): Event[] {
  let result = items;
  if (type) result = result.filter((item) => item.type === type);
  if (search) {
    result = result.filter(
      (item) =>
        matches(item.title, search) ||
        matches(item.description, search) ||
        item.speakers.some((s) => matches(s.name, search)),
    );
  }
  return result;
}

export function queryUpcomingEvents(
  all: Event[],
  query: EventQuery = {},
): Paginated<Event> {
  const { page = 1, pageSize = 12, now = new Date() } = query;
  const items = filterEvents(
    all.filter((event) => isUpcoming(event, now)),
    query,
  ).sort(byStartAsc);
  return paginate(items, page, pageSize);
}

export function queryReplayLibrary(
  all: Event[],
  query: EventQuery = {},
): Paginated<Event> {
  const { page = 1, pageSize = 12, now = new Date() } = query;
  const items = filterEvents(
    all.filter((event) => isReplay(event, now)),
    query,
  ).sort(byStartDesc);
  return paginate(items, page, pageSize);
}
