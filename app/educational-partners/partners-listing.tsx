"use client";

import { ClinicCard } from "@/components/cards/clinic-card";
import { ActiveFilters } from "@/components/filters/active-filters";
import { SearchBar } from "@/components/filters/search-bar";
import { SelectFilter } from "@/components/filters/select-filter";
import { SortSelect } from "@/components/filters/sort-select";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pagination } from "@/components/shared/pagination";
import { titleCase } from "@/lib/format";
import { queryClinics } from "@/lib/listing/clinics";
import {
  type RawSearchParams,
  readPage,
  readParam,
} from "@/lib/search-params";
import { useRawSearchParams } from "@/lib/use-raw-search-params";
import type { Clinic, Treatment } from "@/types";

const PATHNAME = "/educational-partners";
const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "recently-added", label: "Recently added" },
  { value: "name", label: "Name (A–Z)" },
];


export interface PartnersListingData {
  clinics: Clinic[];
  options: {
    countries: string[];
    cities: string[];
    treatments: Treatment[];
    specialties: string[];
    languages: string[];
  };
}

/**
 * Filtered in the browser from the full list, so the page itself can be
 * prerendered and served from the CDN. Filters still live in the URL; they're
 * applied here instead of by a server render per query string. See
 * app/store/store-listing.tsx for the reasoning.
 */
export function PartnersListing(data: PartnersListingData) {
  const params = useRawSearchParams();
  return <PartnersResults {...data} params={params} />;
}

/** The listing for a given set of params — empty params is the prerendered fallback. */
export function PartnersResults({
  clinics,
  options,
  params,
}: PartnersListingData & { params: RawSearchParams }) {
  const search = readParam(params, "search");
  const country = readParam(params, "country");
  const specialty = readParam(params, "specialty");
  const treatment = readParam(params, "treatment") as Treatment | undefined;
  const language = readParam(params, "language");
  const sort = readParam(params, "sort") as "recently-added" | "name" | undefined;
  const page = readPage(params);

  const results = queryClinics(clinics, {
    search,
    country,
    specialty,
    treatment,
    language,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const activeFilters = [
    ...(country ? [{ key: "country", label: country }] : []),
    ...(specialty ? [{ key: "specialty", label: specialty }] : []),
    ...(treatment ? [{ key: "treatment", label: titleCase(treatment) }] : []),
    ...(language ? [{ key: "language", label: language }] : []),
    ...(search ? [{ key: "search", label: `“${search}”` }] : []),
  ];

  const from = (results.page - 1) * results.pageSize + 1;
  const to = Math.min(results.page * results.pageSize, results.total);

  return (
    <Container className="py-10 md:py-14">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SelectFilter
          label="Filter by country"
          paramKey="country"
          allLabel="All Countries"
          options={options.countries.map((value) => ({
            value,
            label: value,
          }))}
        />
        <SelectFilter
          label="Filter by specialty"
          paramKey="specialty"
          allLabel="All Specialities"
          options={options.specialties.map((value) => ({
            value,
            label: value,
          }))}
        />
        <SelectFilter
          label="Filter by treatment"
          paramKey="treatment"
          allLabel="All Treatments"
          options={options.treatments.map((value) => ({
            value,
            label: titleCase(value),
          }))}
        />
        <SelectFilter
          label="Filter by language"
          paramKey="language"
          allLabel="All Languages"
          options={options.languages.map((value) => ({
            value,
            label: value,
          }))}
        />
        <SearchBar
          label="Search partners"
          placeholder="Search clinics…"
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {results.total > 0
            ? `Showing ${from}–${to} of ${results.total} partners`
            : "No partners found"}
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
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((clinic) => (
              <li key={clinic.id} className="flex">
                <ClinicCard clinic={clinic} className="w-full" />
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
          title="No partners match those filters"
          description="Try widening your search — for example, removing the language or treatment filter."
          action={
            <ButtonLink href={PATHNAME} variant="outline">
              Clear all filters
            </ButtonLink>
          }
        />
      )}

      <MedicalDisclaimer variant="card" className="mt-12 max-w-3xl">
        Our partners are featured for their commitment to education. We do not
        rank, rate or recommend clinics — choosing where to have treatment is
        a decision for you and your healthcare team.
      </MedicalDisclaimer>
    </Container>
  );
}
