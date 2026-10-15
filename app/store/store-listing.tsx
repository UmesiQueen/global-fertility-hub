"use client";

import { Info } from "lucide-react";
import { ProductCard } from "@/components/cards/product-card";
import { ActiveFilters } from "@/components/filters/active-filters";
import { CategorySidebar } from "@/components/filters/category-sidebar";
import { FilterChips } from "@/components/filters/filter-chips";
import { SortSelect } from "@/components/filters/sort-select";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pagination } from "@/components/shared/pagination";
import { titleCase } from "@/lib/format";
import { queryProducts } from "@/lib/listing/products";
import {
  type RawSearchParams,
  readPage,
  readParam,
} from "@/lib/search-params";
import { useRawSearchParams } from "@/lib/use-raw-search-params";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type ProductSource,
} from "@/types/product";

const PATHNAME = "/store";
const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

export interface StoreListingData {
  products: Product[];
  categoryCounts: Record<string, number>;
  sourceCounts: Record<ProductSource, number>;
}

/**
 * The store grid, filtered in the browser.
 *
 * /store is prerendered once with the whole catalogue (it's small) and served
 * from the CDN. Filters still live in the URL — they're just applied here
 * instead of on a server render per query string, so a filter click, a
 * search, or a crawler walking every combination costs no server work.
 */
export function StoreListing(data: StoreListingData) {
  const params = useRawSearchParams();
  return <StoreResults {...data} params={params} />;
}

/**
 * The same grid for a given set of params. Rendered with empty params as the
 * prerendered fallback, so the static HTML is the unfiltered first page.
 */
export function StoreResults({
  products,
  categoryCounts,
  sourceCounts,
  params,
}: StoreListingData & { params: RawSearchParams }) {
  const search = readParam(params, "search");
  const category = readParam(params, "category") as ProductCategory | undefined;
  const source = readParam(params, "source") as ProductSource | undefined;
  const sort = readParam(params, "sort") as
    | "newest"
    | "price-low"
    | "price-high"
    | undefined;
  const page = readPage(params);

  const results = queryProducts(products, {
    search,
    category,
    source,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const activeFilters = [
    ...(category
      ? [{ key: "category", label: titleCase(category.replace(/-/g, " ")) }]
      : []),
    ...(source
      ? [
          {
            key: "source",
            label: source === "own" ? "By Henry & Precious" : "Recommended",
          },
        ]
      : []),
    ...(search ? [{ key: "search", label: `“${search}”` }] : []),
  ];

  const from = (results.page - 1) * results.pageSize + 1;
  const to = Math.min(results.page * results.pageSize, results.total);

  return (
    <Container className="py-10 md:py-14">
      <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CategorySidebar
            heading="Browse by Category"
            options={PRODUCT_CATEGORIES.map((value) => ({
              value,
              label: titleCase(value.replace(/-and-/g, " & ").replace(/-/g, " ")),
              count: categoryCounts[value] ?? 0,
            }))}
            active={category}
            pathname={PATHNAME}
            searchParams={params}
          />

          <div className="mt-8 rounded-2xl bg-surface p-5">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Looking for partner discounts?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Exclusive codes from brands we&apos;ve partnered with live on
              their own page.
            </p>
            <ButtonLink
              href="/discounts"
              variant="outline"
              size="sm"
              className="mt-4 w-full"
            >
              View Discounts
            </ButtonLink>
          </div>
        </aside>

        <div className="mt-10 lg:mt-0">
          {/* Who made what, as a filter — the distinction people most want. */}
          <FilterChips
            label="Filter by who made it"
            paramKey="source"
            allLabel={`Everything (${sourceCounts.own + sourceCounts.affiliate})`}
            active={source}
            pathname={PATHNAME}
            searchParams={params}
            options={[
              {
                value: "own",
                label: "By Henry & Precious",
                count: sourceCounts.own,
              },
              {
                value: "affiliate",
                label: "Recommended",
                count: sourceCounts.affiliate,
              },
            ]}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {results.total > 0
                ? `Showing ${from}–${to} of ${results.total} products`
                : "No products found"}
            </p>
            <SortSelect options={SORT_OPTIONS} />
          </div>

          <ActiveFilters
            filters={activeFilters}
            pathname={PATHNAME}
            searchParams={params}
            className="mt-4"
          />

          {/*
            Above the products, for the same reason as on the discounts
            page: a commercial relationship should be known before the
            click, not after.
          */}
          <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-surface p-4">
            <Info
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                How this store works.
              </span>{" "}
              Some of these are ours. The rest are things our community
              recommends, and we may earn a small amount if you buy through
              those links — they&apos;re marked. Everything is sold and
              shipped by whoever makes it, not by us.
            </p>
          </div>

          {results.items.length ? (
            <>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.items.map((product) => (
                  <li key={product.id} className="flex">
                    <ProductCard product={product} className="w-full" />
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
              title="Nothing matches those filters"
              description="Try a different category, or clear your filters to see everything."
              action={
                <ButtonLink href={PATHNAME} variant="outline">
                  Clear all filters
                </ButtonLink>
              }
            />
          )}

          <MedicalDisclaimer variant="card" className="mt-12">
            Nothing in this store is a treatment, and no product here is sure to
            change your chances of conceiving. These are workbooks, tools and
            comforts. Please talk to your healthcare team before starting
            anything new.
          </MedicalDisclaimer>
        </div>
      </div>
    </Container>
  );
}
