import { fetchClinics } from "@/api/clinics";
import { fetchEvents } from "@/api/events";
import { fetchResources } from "@/api/resources";
import { findRelated } from "@/lib/relations";
import type { Clinic, Event, Paginated, Resource, Treatment } from "@/types";
import { featuredFirst, matches, paginate } from "./shared";

/**
 * The only supported way for a page to read Educational Clinic Partners.
 *
 * Note the absence of any `sort: "rating"` or "recommended" option. Partners
 * are ordered by name or by when they joined — never ranked. That constraint
 * comes from the client brief and lives here so no page can bypass it.
 */

export interface ClinicQuery {
  search?: string;
  country?: string;
  city?: string;
  treatment?: Treatment;
  specialty?: string;
  language?: string;
  sort?: "recently-added" | "name";
  page?: number;
  pageSize?: number;
}

export async function getClinics(
  query: ClinicQuery = {},
): Promise<Paginated<Clinic>> {
  const {
    search,
    country,
    city,
    treatment,
    specialty,
    language,
    sort = "recently-added",
    page = 1,
    pageSize = 12,
  } = query;

  let items = await fetchClinics();

  if (country) items = items.filter((item) => item.country === country);
  if (city) items = items.filter((item) => item.city === city);
  if (treatment) {
    items = items.filter((item) => item.treatments.includes(treatment));
  }
  if (specialty) {
    items = items.filter((item) => item.specialties.includes(specialty));
  }
  if (language) {
    items = items.filter((item) => item.languages.includes(language));
  }

  if (search) {
    items = items.filter(
      (item) =>
        matches(item.name, search) ||
        matches(item.city, search) ||
        matches(item.country, search) ||
        item.specialties.some((s) => matches(s, search)),
    );
  }

  if (sort === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    items.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
  }

  return paginate(items, page, pageSize);
}

export async function getClinicBySlug(slug: string): Promise<Clinic | null> {
  const clinics = await fetchClinics();
  return clinics.find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedClinics(limit = 6): Promise<Clinic[]> {
  return featuredFirst(
    await fetchClinics(),
    (item) => Boolean(item.isFeatured),
    (a, b) => b.joinedAt.localeCompare(a.joinedAt),
    limit,
  );
}

export async function getAllClinicSlugs(): Promise<string[]> {
  const clinics = await fetchClinics();
  return clinics.map((item) => item.slug);
}

/** Distinct filter values, derived from the data rather than hardcoded. */
export async function getClinicFilterOptions(): Promise<{
  countries: string[];
  cities: string[];
  treatments: Treatment[];
  specialties: string[];
  languages: string[];
}> {
  const countries = new Set<string>();
  const cities = new Set<string>();
  const treatments = new Set<Treatment>();
  const specialties = new Set<string>();
  const languages = new Set<string>();

  for (const clinic of await fetchClinics()) {
    countries.add(clinic.country);
    cities.add(clinic.city);
    for (const t of clinic.treatments) treatments.add(t);
    for (const s of clinic.specialties) specialties.add(s);
    for (const l of clinic.languages) languages.add(l);
  }

  const sorted = <T extends string>(set: Set<T>) =>
    [...set].sort((a, b) => a.localeCompare(b));

  return {
    countries: sorted(countries),
    cities: sorted(cities),
    treatments: sorted(treatments),
    specialties: sorted(specialties),
    languages: sorted(languages),
  };
}

export async function getRelatedClinics(
  clinic: Clinic,
  limit = 3,
): Promise<Clinic[]> {
  return findRelated(clinic, await fetchClinics(), limit);
}

export async function getRelatedResourcesForClinic(
  clinic: Clinic,
  limit = 3,
): Promise<Resource[]> {
  return findRelated(clinic, await fetchResources(), limit);
}

export async function getRelatedEventsForClinic(
  clinic: Clinic,
  limit = 3,
): Promise<Event[]> {
  return findRelated(clinic, await fetchEvents(), limit);
}
