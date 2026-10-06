"use client";

import { ResourceCard } from "@/components/cards/resource-card";
import { ActiveFilters } from "@/components/filters/active-filters";
import { CategorySidebar } from "@/components/filters/category-sidebar";
import { FormatFilter } from "@/components/filters/format-filter";
import { SortSelect } from "@/components/filters/sort-select";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { titleCase } from "@/lib/format";
import { queryResources } from "@/lib/listing/resources";
import {
  type RawSearchParams,
  readPage,
  readParam,
  readParamList,
} from "@/lib/search-params";
import { useRawSearchParams } from "@/lib/use-raw-search-params";
import {
  RESOURCE_CATEGORIES,
  type Resource,
  type ResourceCategory,
  type ResourceFormat,
} from "@/types";

const PATHNAME = "/resources";
const PAGE_SIZE = 12;

const FORMATS: ResourceFormat[] = [
  "article",
  "video",
  "guide",
  "download",
  "webinar",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "reading-time", label: "Shortest first" },
];


export interface ResourcesListingData {
  resources: Resource[];
  categoryCounts: Record<string, number>;
  formatCounts: Record<ResourceFormat, number>;
}

/**
 * Filtered in the browser from the full list, so the page itself can be
 * prerendered and served from the CDN. Filters still live in the URL; they're
 * applied here instead of by a server render per query string. See
 * app/store/store-listing.tsx for the reasoning.
 */
export function ResourcesListing(data: ResourcesListingData) {
  const params = useRawSearchParams();
  return <ResourcesResults {...data} params={params} />;
}

/** The listing for a given set of params — empty params is the prerendered fallback. */
export function ResourcesResults({
  resources,
  categoryCounts,
  formatCounts,
  params,
}: ResourcesListingData & { params: RawSearchParams }) {
  const search = readParam(params, "search");
  const category = readParam(params, "category") as
    ResourceCategory | undefined;
  const formats = readParamList(params, "format") as ResourceFormat[];
  const sort = readParam(params, "sort") as
    "newest" | "oldest" | "reading-time" | undefined;
  const page = readPage(params);

  const results = queryResources(resources, {
    search,
    category,
    formats,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const activeFilters = [
    ...(category
      ? [{ key: "category", label: titleCase(category.replace(/-/g, " ")) }]
      : []),
    ...formats.map((format) => ({
      key: "format",
      value: format,
      label: titleCase(format),
    })),
    ...(search ? [{ key: "search", label: `“${search}”` }] : []),
  ];

  const from = (results.page - 1) * results.pageSize + 1;
  const to = Math.min(results.page * results.pageSize, results.total);

  return (
    <Container className="py-10 md:py-14">
      <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
        {/* Filters come first in the DOM so keyboard users reach them before
            a long grid, and are sticky on desktop so they stay reachable. */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CategorySidebar
            heading="Browse by Category"
            options={RESOURCE_CATEGORIES.map((value) => ({
              value,
              label: titleCase(value.replace(/-/g, " ")),
              count: categoryCounts[value] ?? 0,
            }))}
            active={category}
            pathname={PATHNAME}
            searchParams={params}
          />

          <FormatFilter
            heading="Filter by Format"
            className="mt-8"
            options={FORMATS.map((value) => ({
              value,
              label: `${titleCase(value)}s`,
              count: formatCounts[value] ?? 0,
            }))}
            selected={formats}
            pathname={PATHNAME}
            searchParams={params}
          />

          <div className="mt-8 rounded-2xl bg-surface p-5">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Tell us what you need and we&apos;ll look into covering it.
            </p>
            <ButtonLink
              href="/contact?topic=resource"
              variant="outline"
              size="sm"
              className="mt-4 w-full"
            >
              Request a Topic
            </ButtonLink>
          </div>
        </aside>

        <div className="mt-10 lg:mt-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {results.total > 0
                ? `Showing ${from}–${to} of ${results.total} resources`
                : "No resources found"}
            </p>
            <SortSelect options={SORT_OPTIONS} />
          </div>

          <ActiveFilters
            filters={activeFilters}
            pathname={PATHNAME}
            searchParams={params}
            className="mt-4"
          />

          {results.items.length ? (
            <>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.items.map((resource) => (
                  <li key={resource.id} className="flex">
                    <ResourceCard resource={resource} className="w-full" />
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
              title="No resources match those filters"
              description="Try removing a filter or searching for something broader."
              action={
                <ButtonLink href={PATHNAME} variant="outline">
                  Clear all filters
                </ButtonLink>
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}
