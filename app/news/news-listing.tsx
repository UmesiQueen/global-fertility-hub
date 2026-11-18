"use client";

import { NewsCard } from "@/components/cards/news-card";
import { FilterChips } from "@/components/filters/filter-chips";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { isNewsType, queryNews } from "@/lib/listing/news";
import { type RawSearchParams, readPage, readParam } from "@/lib/search-params";
import { useRawSearchParams } from "@/lib/use-raw-search-params";
import { cn } from "@/lib/utils";
import { NEWS_TYPE_LABELS, NEWS_TYPES, type NewsPost, type NewsType } from "@/types";

const PATHNAME = "/news";
const PAGE_SIZE = 9;

export interface NewsListingData {
  posts: NewsPost[];
  counts: Record<NewsType, number>;
}

/**
 * Filtered in the browser from the full list, so the page itself can be
 * prerendered. The type filter and page number live in the URL. See
 * app/store/store-listing.tsx for the reasoning.
 */
export function NewsListing(data: NewsListingData) {
  const params = useRawSearchParams();
  return <NewsResults {...data} params={params} />;
}

/** The listing for a given set of params — empty params is the prerendered fallback. */
export function NewsResults({
  posts,
  counts,
  params,
}: NewsListingData & { params: RawSearchParams }) {
  const rawType = readParam(params, "type");
  const type = isNewsType(rawType) ? rawType : undefined;
  const page = readPage(params);

  const { lead, latest, rest, total } = queryNews(posts, {
    type,
    page,
    pageSize: PAGE_SIZE,
  });

  // The lead and sidebar belong to the first page only; later pages are
  // just the grid.
  const showTop = rest.page === 1 && lead !== null;

  return (
    <Container className="py-10 md:py-14">
      <FilterChips
        label="Filter news by type"
        paramKey="type"
        allLabel="All News"
        active={type}
        pathname={PATHNAME}
        searchParams={params}
        options={NEWS_TYPES.map((value) => ({
          value,
          label: NEWS_TYPE_LABELS[value],
          count: counts[value] ?? 0,
        }))}
      />

      {total === 0 ? (
        <EmptyState
          className="mt-8"
          title={
            posts.length
              ? "No news in this category yet"
              : "Our first news stories are on their way"
          }
          description={
            posts.length
              ? "Try another category, or see every story."
              : "In the meantime, our free resources explain fertility care in plain English."
          }
          action={
            posts.length ? (
              <ButtonLink href={PATHNAME} variant="outline">
                View all news
              </ButtonLink>
            ) : (
              <ButtonLink href="/resources" variant="outline">
                Explore Resources
              </ButtonLink>
            )
          }
        />
      ) : null}

      {showTop && lead ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <NewsCard
            post={lead}
            variant="lead"
            priority
            className={latest.length ? "lg:col-span-2" : "lg:col-span-3"}
          />

          {latest.length ? (
            <section
              aria-labelledby="latest-news"
              className="flex flex-col rounded-3xl border border-border/70 bg-hero-background/80 p-4 md:p-5"
            >
              <h2
                id="latest-news"
                className="font-heading text-lg font-semibold text-foreground"
              >
                Latest News
              </h2>
              <ul className="mt-4 flex flex-1 flex-col gap-4">
                {latest.map((post) => (
                  <li key={post.id} className="flex lg:flex-1">
                    <NewsCard post={post} variant="compact" className="w-full" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {rest.total > 0 ? (
        <section
          aria-labelledby={type ? undefined : "more-news"}
          className={cn(showTop ? "mt-12 md:mt-16" : "mt-8")}
        >
          {type ? null : (
            <h2
              id="more-news"
              className="mb-6 font-heading text-xl font-semibold text-foreground md:text-2xl"
            >
              More News
            </h2>
          )}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.items.map((post) => (
              <li key={post.id} className="flex">
                <NewsCard post={post} className="w-full" />
              </li>
            ))}
          </ul>
          <Pagination
            page={rest.page}
            totalPages={rest.totalPages}
            pathname={PATHNAME}
            searchParams={params}
            className="mt-10"
          />
        </section>
      ) : null}
    </Container>
  );
}
