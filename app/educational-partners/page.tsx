import type { Metadata } from "next";
import { ClinicCard } from "@/components/cards/clinic-card";
import { ActiveFilters } from "@/components/filters/active-filters";
import { SearchBar } from "@/components/filters/search-bar";
import { SelectFilter } from "@/components/filters/select-filter";
import { SortSelect } from "@/components/filters/sort-select";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pagination } from "@/components/shared/pagination";
import { Pill } from "@/components/shared/pill";
import { TrustChips } from "@/components/shared/trust-chips";
import { titleCase } from "@/lib/format";
import {
  getClinicFilterOptions,
  getClinics,
} from "@/lib/repositories/clinics";
import {
  type RawSearchParams,
  readPage,
  readParam,
} from "@/lib/search-params";
import type { Treatment } from "@/types";

const PATHNAME = "/educational-partners";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Educational Clinic Partners",
  description:
    "Fertility clinics worldwide that share our commitment to education, transparency and informed decision-making. We showcase partners — we don't rank or recommend them.",
  alternates: { canonical: PATHNAME },
};

const SORT_OPTIONS = [
  { value: "recently-added", label: "Recently added" },
  { value: "name", label: "Name (A–Z)" },
];

export default async function EducationalPartnersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;

  const search = readParam(params, "search");
  const country = readParam(params, "country");
  const specialty = readParam(params, "specialty");
  const treatment = readParam(params, "treatment") as Treatment | undefined;
  const language = readParam(params, "language");
  const sort = readParam(params, "sort") as "recently-added" | "name" | undefined;
  const page = readPage(params);

  const [results, options] = await Promise.all([
    getClinics({
      search,
      country,
      specialty,
      treatment,
      language,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    getClinicFilterOptions(),
  ]);

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
    <>
      <PageHero
        eyebrow={<Pill>Trusted · Transparent · Educational</Pill>}
        title="Educational Clinic Partners"
        description="We partner with fertility clinics worldwide that share our commitment to education, transparency and informed decision-making."
        image={{
          src: "/clinic.png",
          alt: "A bright, calm fertility clinic reception with soft seating and a glowing \u2018Fertility Care\u2019 sign above the desk.",
        }}
      >
        <TrustChips
          chips={[
            {
              icon: "shield",
              title: "Educational partnerships",
              description: "Not rankings or recommendations",
            },
            {
              icon: "globe",
              title: "Information you can trust",
              description: "So you can explore with confidence",
            },
          ]}
        />
      </PageHero>

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
    </>
  );
}
