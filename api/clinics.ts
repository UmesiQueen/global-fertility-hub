import { hygraphFetch } from "./client";
import { asset, date, enumIn } from "./map";
import type { Clinic } from "@/types";

const QUERY = `{
  clinics(first: 500, orderBy: joinedAt_DESC) {
    id
    slug
    name
    intro
    country
    countryCode
    city
    treatments
    specialties
    languages
    services
    website
    contactEmail
    contactPhone
    tags
    isFeatured
    joinedAt
    team { name role bio }
    partnerBenefits { title description }
    logo { url altText }
    coverImage { url altText }
  }
}`;

export async function fetchClinics(): Promise<Clinic[]> {
  const data = await hygraphFetch<{ clinics: any[] }>(QUERY);

  return data.clinics.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    intro: c.intro ?? "",
    country: c.country ?? "",
    countryCode: (c.countryCode ?? "").toUpperCase(),
    city: c.city ?? "",
    treatments: (c.treatments ?? []).map(enumIn) as Clinic["treatments"],
    specialties: c.specialties ?? [],
    languages: c.languages ?? [],
    services: c.services ?? [],
    team: c.team ?? [],
    partnerBenefits: c.partnerBenefits ?? [],
    website: c.website ?? "",
    contactEmail: c.contactEmail ?? undefined,
    contactPhone: c.contactPhone ?? undefined,
    tags: (c.tags ?? []).map(enumIn) as Clinic["tags"],
    logo: asset(c.logo, `${c.name} logo`),
    coverImage: asset(c.coverImage, c.name),
    isEducationalPartner: true,
    isFeatured: c.isFeatured ?? undefined,
    joinedAt: date(c.joinedAt),
  }));
}
