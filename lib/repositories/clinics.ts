import { fetchClinics } from "@/api/clinics";
import { fetchEvents } from "@/api/events";
import { fetchResources } from "@/api/resources";
import { type ClinicQuery, queryClinics } from "@/lib/listing/clinics";
import { findRelated } from "@/lib/relations";
import type { Clinic, Event, Paginated, Resource, Treatment } from "@/types";
import { featuredFirst } from "./shared";

/**
 * The only supported way for a page to read Educational Clinic Partners.
 *
 * Note the absence of any `sort: "rating"` or "recommended" option. Partners
 * are ordered by name or by when they joined — never ranked. That constraint
 * comes from the client brief and lives here so no page can bypass it.
 */

export type { ClinicQuery };

export async function getClinics(
  query: ClinicQuery = {},
): Promise<Paginated<Clinic>> {
  return queryClinics(await fetchClinics(), query);
}

/** Every partner, for listings that filter in the browser. */
export async function getAllClinics(): Promise<Clinic[]> {
  return fetchClinics();
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
