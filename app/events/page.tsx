import { CalendarDays, PlayCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/cards/event-card";
import { SearchBar } from "@/components/filters/search-bar";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { Pagination } from "@/components/shared/pagination";
import { TrustChips } from "@/components/shared/trust-chips";
import {
  getReplayLibrary,
  getUpcomingEvents,
} from "@/lib/repositories/events";
import {
  buildHref,
  type RawSearchParams,
  readPage,
  readParam,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";

const PATHNAME = "/events";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Events & Webinars",
  description:
    "Learn from fertility experts, hear inspiring stories and join educational conversations from anywhere in the world.",
  alternates: { canonical: PATHNAME },
};

const TABS = [
  { value: "upcoming", label: "Upcoming Events", icon: CalendarDays },
  { value: "replays", label: "Replay Library", icon: PlayCircle },
] as const;

/**
 * Events, split into Upcoming and Replay Library.
 *
 * The tab is a URL parameter, not component state, so a replay link is
 * shareable and lands on the right tab. The two tabs also paginate
 * independently — switching tabs resets the page, which `buildHref` handles.
 */
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;

  const tab = readParam(params, "tab") === "replays" ? "replays" : "upcoming";
  const search = readParam(params, "search");
  const page = readPage(params);

  const results =
    tab === "replays"
      ? await getReplayLibrary({ search, page, pageSize: PAGE_SIZE })
      : await getUpcomingEvents({ search, page, pageSize: PAGE_SIZE });

  const from = (results.page - 1) * results.pageSize + 1;
  const to = Math.min(results.page * results.pageSize, results.total);
  const isReplays = tab === "replays";

  return (
    <>
      <PageHero
        title="Events & Webinars"
        description="Learn from fertility experts, hear inspiring stories and join educational conversations from anywhere in the world."
      >
        <TrustChips
          chips={[
            {
              icon: "shield",
              title: "Expert-led sessions",
              description: "Fertility specialists, embryologists and more",
            },
            {
              icon: "globe",
              title: "Global access",
              description: "Join live or watch replays at your convenience",
            },
          ]}
        />
      </PageHero>

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
    </>
  );
}
