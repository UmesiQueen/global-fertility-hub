"use client";

import { CalendarDays, PlayCircle } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/cards/event-card";
import { SearchBar } from "@/components/filters/search-bar";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { Pagination } from "@/components/shared/pagination";
import {
  queryReplayLibrary,
  queryUpcomingEvents,
} from "@/lib/listing/events";
import {
  buildHref,
  type RawSearchParams,
  readPage,
  readParam,
} from "@/lib/search-params";
import { useRawSearchParams } from "@/lib/use-raw-search-params";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

const PATHNAME = "/events";
const PAGE_SIZE = 12;

const TABS = [
  { value: "upcoming", label: "Upcoming Events", icon: CalendarDays },
  { value: "replays", label: "Replay Library", icon: PlayCircle },
] as const;


export interface EventsListingData {
  events: Event[];
}

/**
 * Filtered in the browser from the full list, so the page itself can be
 * prerendered and served from the CDN. Filters still live in the URL; they're
 * applied here instead of by a server render per query string. See
 * app/store/store-listing.tsx for the reasoning.
 */
export function EventsListing(data: EventsListingData) {
  const params = useRawSearchParams();
  return <EventsResults {...data} params={params} />;
}

/** The listing for a given set of params — empty params is the prerendered fallback. */
export function EventsResults({
  events,
  params,
}: EventsListingData & { params: RawSearchParams }) {
  const tab = readParam(params, "tab") === "replays" ? "replays" : "upcoming";
  const search = readParam(params, "search");
  const page = readPage(params);

  // Split on the reader's clock, so an event moves to the Replay Library
  // when it starts, not when the page next regenerates.
  const results =
    tab === "replays"
      ? queryReplayLibrary(events, { search, page, pageSize: PAGE_SIZE })
      : queryUpcomingEvents(events, { search, page, pageSize: PAGE_SIZE });

  const from = (results.page - 1) * results.pageSize + 1;
  const to = Math.min(results.page * results.pageSize, results.total);
  const isReplays = tab === "replays";

  return (
    <Container className="py-10 md:py-14">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs are links because each is a distinct, shareable URL. */}
        <nav aria-label="Event type">
          <ul className="flex gap-1">
            {TABS.map((entry) => {
              const isActive = tab === entry.value;
              return (
                <li key={entry.value}>
                  <Link
                    href={buildHref(PATHNAME, params, {
                      tab: entry.value === "upcoming" ? null : entry.value,
                    })}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <entry.icon aria-hidden="true" className="size-4" />
                    {entry.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-4 h-0.5 rounded-full bg-primary"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <SearchBar
          label="Search events"
          placeholder="Search events…"
          className="sm:w-72"
        />
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
        {results.total > 0
          ? `Showing ${from}–${to} of ${results.total} ${
              isReplays ? "replays" : "upcoming events"
            }`
          : isReplays
            ? "No replays found"
            : "No upcoming events found"}
      </p>

      {results.items.length ? (
        <>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((event) => (
              <li key={event.id} className="flex">
                <EventCard
                  event={event}
                  variant={isReplays ? "replay" : "upcoming"}
                  className="w-full"
                />
              </li>
            ))}
          </ul>

          <Pagination
            page={results.page}
            totalPages={results.totalPages}
            pathname={PATHNAME}
            searchParams={params}
            className="mt-10"
          />
        </>
      ) : (
        <EmptyState
          className="mt-6"
          title={
            isReplays
              ? "No replays match that search"
              : "Nothing scheduled right now"
          }
          description={
            isReplays
              ? "Try a different search, or browse everything in the library."
              : "New sessions are added regularly — subscribe below and we'll let you know, or watch a past session in the meantime."
          }
          action={
            <ButtonLink
              href={
                isReplays ? PATHNAME : `${PATHNAME}?tab=replays`
              }
              variant="outline"
            >
              {isReplays ? "View upcoming events" : "Browse the Replay Library"}
            </ButtonLink>
          }
        />
      )}

      <NewsletterSignup className="mt-14" />
    </Container>
  );
}
