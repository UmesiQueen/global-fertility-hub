import { ArrowLeft, Clock, Download, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClinicCard } from "@/components/cards/clinic-card";
import { EventCard } from "@/components/cards/event-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EntityImage } from "@/components/shared/entity-image";
import { JsonLd } from "@/components/shared/json-ld";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pill } from "@/components/shared/pill";
import { Prose } from "@/components/shared/prose";
import { RelatedGrid } from "@/components/shared/related-grid";
import { formatDate, formatReadingTime, titleCase } from "@/lib/format";
import { markdownToPlainText } from "@/lib/markdown";
import {
  getAllResourceSlugs,
  getRelatedClinicsForResource,
  getRelatedEventsForResource,
  getRelatedResources,
  getResourceBySlug,
} from "@/lib/repositories/resources";
import { breadcrumbJsonLd, resourceJsonLd } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllResourceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) return { title: "Resource not found" };

  return {
    title: resource.title,
    // Falls back to the body when there's no excerpt, so a missing field in
    // the CMS never produces a page with no meta description.
    description: resource.excerpt || markdownToPlainText(resource.body, 155),
    alternates: { canonical: `/resources/${resource.slug}` },
    openGraph: {
      type: "article",
      title: resource.title,
      description: resource.excerpt,
      publishedTime: resource.publishedAt,
      authors: [resource.author.name],
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) notFound();

  const [related, relatedClinics, relatedEvents] = await Promise.all([
    getRelatedResources(resource, 3),
    getRelatedClinicsForResource(resource, 3),
    getRelatedEventsForResource(resource, 3),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: resource.title },
  ];

  return (
    <>
      <JsonLd data={[resourceJsonLd(resource), breadcrumbJsonLd(crumbs)]} />

      <article>
        <Container className="pt-8 pb-4">
          <Breadcrumbs crumbs={crumbs} />
        </Container>

        <Container className="pb-10">
          <div className="max-w-[68ch]">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{titleCase(resource.format)}</Pill>
              <Pill tone="muted">
                {titleCase(resource.category.replace(/-/g, " "))}
              </Pill>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {resource.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {resource.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User aria-hidden="true" className="size-4" />
                {resource.author.name}
                {resource.author.role ? (
                  <span className="text-muted-foreground/70">
                    · {resource.author.role}
                  </span>
                ) : null}
              </span>
              {/* Absent on a draft — omitted rather than rendered empty. */}
              {resource.publishedAt ? (
                <time dateTime={resource.publishedAt}>
                  {formatDate(resource.publishedAt)}
                </time>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4" />
                {formatReadingTime(resource.readingTime, resource.format)}
              </span>
            </div>
          </div>

          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl">
            <EntityImage
              image={resource.coverImage}
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
            />
          </div>

          <Prose content={resource.body} className="mt-10" />

          {resource.downloadUrl ? (
            <div className="mt-10 max-w-[68ch] rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-heading text-base font-semibold text-foreground">
                Download this resource
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Print it or keep it on your phone for appointments.
              </p>
              <ButtonLink href={resource.downloadUrl} className="mt-4" external>
                <Download aria-hidden="true" className="size-4" />
                Download
              </ButtonLink>
            </div>
          ) : null}

          <MedicalDisclaimer variant="card" className="mt-10 max-w-[68ch]" />

          <Link
            href="/resources"
            className="mt-10 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Resources
          </Link>
        </Container>
      </article>

      <div className="bg-surface">
        <RelatedGrid
          headingId="related-resources"
          title="Related Resources"
          count={related.length}
          action={{ label: "View All Resources", href: "/resources" }}
        >
          {related.map((item) => (
            <li key={item.id} className="flex">
              <ResourceCard resource={item} className="w-full" />
            </li>
          ))}
        </RelatedGrid>
      </div>

      <RelatedGrid
        headingId="related-events"
        title="Related Events & Webinars"
        count={relatedEvents.length}
        action={{ label: "View All Events", href: "/events" }}
      >
        {relatedEvents.map((item) => (
          <li key={item.id} className="flex">
            <EventCard event={item} className="w-full" />
          </li>
        ))}
      </RelatedGrid>

      <div className="bg-surface">
        <RelatedGrid
          headingId="related-partners"
          title="Educational Clinic Partners"
          description="Partners whose educational focus covers this topic. We don't rank or recommend clinics."
          count={relatedClinics.length}
          action={{
            label: "Browse All Partners",
            href: "/educational-partners",
          }}
        >
          {relatedClinics.map((item) => (
            <li key={item.id} className="flex">
              <ClinicCard clinic={item} className="w-full" />
            </li>
          ))}
        </RelatedGrid>
      </div>
    </>
  );
}
