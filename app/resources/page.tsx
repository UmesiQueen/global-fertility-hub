import type { Metadata } from "next";
import { ResourceCard } from "@/components/cards/resource-card";
import { ActiveFilters } from "@/components/filters/active-filters";
import { CategorySidebar } from "@/components/filters/category-sidebar";
import { FormatFilter } from "@/components/filters/format-filter";
import { SearchBar } from "@/components/filters/search-bar";
import { SortSelect } from "@/components/filters/sort-select";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { titleCase } from "@/lib/format";
import {
  getResourceCategoryCounts,
  getResourceFormatCounts,
  getResources,
} from "@/lib/repositories/resources";
import {
  type RawSearchParams,
  readPage,
  readParam,
  readParamList,
} from "@/lib/search-params";
import {
  RESOURCE_CATEGORIES,
  type ResourceCategory,
  type ResourceFormat,
} from "@/types";

const PATHNAME = "/resources";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Trusted fertility education to help you learn, understand and make informed decisions — articles, guides, videos and downloads.",
  alternates: { canonical: PATHNAME },
};

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

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;

  const search = readParam(params, "search");
  const category = readParam(params, "category") as
    ResourceCategory | undefined;
  const formats = readParamList(params, "format") as ResourceFormat[];
  const sort = readParam(params, "sort") as
    "newest" | "oldest" | "reading-time" | undefined;
  const page = readPage(params);

  const [results, categoryCounts, formatCounts] = await Promise.all([
    getResources({
      search,
      category,
      formats,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    getResourceCategoryCounts(),
    getResourceFormatCounts(),
  ]);

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
    <>
      <PageHero
        title="Resources"
        description="Trusted fertility education to help you learn, understand and make informed decisions."
      >
        <SearchBar
          label="Search resources"
          placeholder="Search resources, topics or keywords…"
          className="max-w-md"
        />
      </PageHero>

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
    </>
  );
}
