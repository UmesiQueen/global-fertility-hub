import { siteConfig } from "@/lib/site-config";
import type { Clinic, Event, Resource, Story } from "@/types";

/**
 * JSON-LD builders.
 *
 * This is a content platform, so search is the main way people will arrive.
 * Structured data is built here rather than inline in pages so the shapes stay
 * consistent and the one place that needs auditing is one file.
 *
 * Note what is NOT emitted: no `AggregateRating` or `Review` on clinics. The
 * brief forbids ranking partners, and emitting rating markup would put star
 * ratings in search results — the exact impression the product is designed to
 * avoid, and outside our control once Google has it.
 */

const url = (path: string) => `${siteConfig.url}${path}`;

/**
 * A date field, or nothing at all.
 *
 * Draft entries read through preview have no `publishedAt` until they are first
 * published, and an event being drafted may not have its `startsAt` filled in.
 * Structured data that is absent is fine; structured data that is wrong is not,
 * and a Date built from "" throws on `toISOString()` — which is a 500 for the
 * page rather than a missing meta tag.
 */
const when = (iso: string | undefined): Date | null => {
  if (!iso) return null;

  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function breadcrumbJsonLd(crumbs: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: url(crumb.href) } : {}),
    })),
  };
}

export function resourceJsonLd(resource: Resource) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.excerpt,
    ...(resource.publishedAt ? { datePublished: resource.publishedAt } : {}),
    author: { "@type": "Person", name: resource.author.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: url(`/resources/${resource.slug}`),
    ...(resource.coverImage.src
      ? { image: url(resource.coverImage.src) }
      : {}),
  };
}

export function storyJsonLd(story: Story) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.preview,
    ...(story.publishedAt ? { datePublished: story.publishedAt } : {}),
    author: { "@type": "Person", name: story.author.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: url(`/stories/${story.slug}`),
    ...(story.coverImage.src ? { image: url(story.coverImage.src) } : {}),
  };
}

export function eventJsonLd(event: Event) {
  const startsAt = when(event.startsAt);
  const endsAt = startsAt
    ? new Date(startsAt.getTime() + event.durationMinutes * 60_000)
    : null;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    ...(startsAt ? { startDate: startsAt.toISOString() } : {}),
    ...(endsAt ? { endDate: endsAt.toISOString() } : {}),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: url(`/events/${event.slug}`),
    },
    organizer: { "@type": "Organization", name: siteConfig.name },
    performer: event.speakers.map((speaker) => ({
      "@type": "Person",
      name: speaker.name,
    })),
    ...(event.image.src ? { image: url(event.image.src) } : {}),
  };
}

/**
 * Clinics are described as an Organization only.
 *
 * Deliberately not `MedicalClinic` — that type invites rating and review
 * markup, and implies this site is a directory of care providers rather than
 * a list of education partners.
 */
export function clinicJsonLd(clinic: Clinic) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: clinic.name,
    description: clinic.intro,
    url: clinic.website,
    address: {
      "@type": "PostalAddress",
      addressLocality: clinic.city,
      addressCountry: clinic.countryCode,
    },
    ...(clinic.contactEmail ? { email: clinic.contactEmail } : {}),
  };
}
