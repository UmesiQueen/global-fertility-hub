"use client";

import { StoryCard } from "@/components/cards/story-card";
import { FilterChips } from "@/components/filters/filter-chips";
import { SearchBar } from "@/components/filters/search-bar";
import { Container } from "@/components/layout/container";
import { JoinCommunityCTA } from "@/components/sections/join-community-cta";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { queryStories } from "@/lib/listing/stories";
import { type RawSearchParams, readPage, readParam } from "@/lib/search-params";
import { useRawSearchParams } from "@/lib/use-raw-search-params";
import type { Story } from "@/types";

const PATHNAME = "/stories";
const PAGE_SIZE = 12;

export interface StoriesListingData {
  /** Approved stories only — the repository applies that filter. */
  stories: Story[];
  categories: readonly string[];
  counts: Record<string, number>;
}

/**
 * Filtered in the browser from the full list, so the page itself can be
 * prerendered and served from the CDN. Filters still live in the URL; they're
 * applied here instead of by a server render per query string. See
 * app/store/store-listing.tsx for the reasoning.
 */
export function StoriesListing(data: StoriesListingData) {
  const params = useRawSearchParams();
  return <StoriesResults {...data} params={params} />;
}

/** The listing for a given set of params — empty params is the prerendered fallback. */
export function StoriesResults({
  stories,
  categories,
  counts,
  params,
}: StoriesListingData & { params: RawSearchParams }) {
  const search = readParam(params, "search");
  const category = readParam(params, "category");
  const page = readPage(params);

  const results = queryStories(stories, {
    search,
    category,
    page,
    pageSize: PAGE_SIZE,
  });

  const from = (results.page - 1) * results.pageSize + 1;
  const to = Math.min(results.page * results.pageSize, results.total);

  return (
    <div>
      <Container className="py-10 md:py-14">
        <FilterChips
          label="Filter stories by category"
          paramKey="category"
          allLabel="All Stories"
          active={category}
          pathname={PATHNAME}
          searchParams={params}
          options={categories.map((value) => ({
            value,
            label: value,
            count: counts[value] ?? 0,
          }))}
        />
        <SearchBar
          label="Search stories"
          placeholder="Search stories by title, topic or keyword…"
          className="mt-5 max-w-md"
        />
        <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
          {results.total > 0
            ? `Showing ${from}–${to} of ${results.total} stories`
            : "No stories found"}
        </p>
        {results.items.length ? (
          <>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.items.map((story) => (
                <li key={story.id} className="flex">
                  <StoryCard story={story} className="w-full" />
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
            title="No stories match that yet"
            description="Try another category, or clear your search to see every story."
            action={
              <ButtonLink href={PATHNAME} variant="outline">
                View all stories
              </ButtonLink>
            }
          />
        )}
      </Container>
      <JoinCommunityCTA
        title="Your Story Could Be the Hope Someone Needs Today"
        description=" Sharing is entirely your choice, and you can stay anonymous. Every story is read and reviewed with care before it's published."
        ctaButton={{ href: "/contact?topic=story", label: "Share Your Story" }}
      />
    </div>
  );
}
