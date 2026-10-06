import { matches, paginate } from "@/lib/repositories/shared";
import type { Clinic, Paginated, Treatment } from "@/types";

/**
 * Pure partner filtering — shared by the repository and the
 * /educational-partners listing.
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

export function queryClinics(
  all: Clinic[],
  query: ClinicQuery = {},
): Paginated<Clinic> {
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

  let items = [...all];

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
