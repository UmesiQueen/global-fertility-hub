import {
  ArrowLeft,
  ExternalLink,
  GraduationCap,
  Globe,
  Languages,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/cards/event-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EntityImage } from "@/components/shared/entity-image";
import { JsonLd } from "@/components/shared/json-ld";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pill } from "@/components/shared/pill";
import { RelatedGrid } from "@/components/shared/related-grid";
import { countryFlag, titleCase } from "@/lib/format";
import {
  getAllClinicSlugs,
  getClinicBySlug,
  getRelatedEventsForClinic,
  getRelatedResourcesForClinic,
} from "@/lib/repositories/clinics";
import { breadcrumbJsonLd, clinicJsonLd } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllClinicSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);

  if (!clinic) return { title: "Partner not found" };

  return {
    title: `${clinic.name} — Educational Partner`,
    description: clinic.intro,
    alternates: { canonical: `/educational-partners/${clinic.slug}` },
    openGraph: { title: clinic.name, description: clinic.intro },
  };
}

/**
 * An Educational Clinic Partner profile.
 *
 * The page presents information the partner supplies — services, team,
 * languages, what they contribute educationally. It carries no rating, no
 * review section and no comparison against other partners, and the disclaimer
 * at the foot states the relationship explicitly.
 */
export default async function ClinicProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);

  if (!clinic) notFound();

  const [relatedResources, relatedEvents] = await Promise.all([
    getRelatedResourcesForClinic(clinic, 3),
    getRelatedEventsForClinic(clinic, 3),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Educational Partners", href: "/educational-partners" },
    { label: clinic.name },
  ];

  const flag = countryFlag(clinic.countryCode);

  return (
    <>
      <JsonLd data={[clinicJsonLd(clinic), breadcrumbJsonLd(crumbs)]} />

      <Container className="pt-8 pb-4">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <Container className="pb-10">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl">
          <EntityImage
            image={clinic.coverImage}
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
          />
        </div>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <Pill icon={GraduationCap}>Educational Partner</Pill>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {clinic.name}
            </h1>

            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {clinic.city}, {clinic.country}
              {flag ? <span aria-hidden="true">{flag}</span> : null}
            </p>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {clinic.intro}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col">
            <ButtonLink href={clinic.website} external size="lg">
              <Globe aria-hidden="true" className="size-4" />
              Visit Website
              <ExternalLink aria-hidden="true" className="size-3.5" />
            </ButtonLink>
            {clinic.contactEmail ? (
              <ButtonLink
                href={`mailto:${clinic.contactEmail}`}
                variant="outline"
                size="lg"
                external
              >
                <Mail aria-hidden="true" className="size-4" />
                Contact
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="flex flex-col gap-10">
            <section aria-labelledby="clinic-services">
              <h2
                id="clinic-services"
                className="font-heading text-xl font-bold text-foreground"
              >
                Services
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {clinic.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card px-3.5 py-3 text-sm text-muted-foreground"
                  >
                    <Stethoscope
                      aria-hidden="true"
                      className="size-4 shrink-0 text-primary"
                    />
                    {service}
                  </li>
                ))}
              </ul>
            </section>

            {clinic.team.length ? (
              <section aria-labelledby="clinic-team">
                <h2
                  id="clinic-team"
                  className="font-heading text-xl font-bold text-foreground"
                >
                  Team
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {clinic.team.map((member) => (
                    <li
                      key={member.name}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-sm font-semibold text-primary"
                      >
                        {member.name.slice(0, 1)}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          {member.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {member.role}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {clinic.partnerBenefits.length ? (
              <section aria-labelledby="clinic-benefits">
                <h2
                  id="clinic-benefits"
                  className="font-heading text-xl font-bold text-foreground"
                >
                  What They Contribute
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  How this partner supports education for our community.
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {clinic.partnerBenefits.map((benefit) => (
                    <li
                      key={benefit.title}
                      className="rounded-xl bg-surface p-4"
                    >
                      <h3 className="font-heading text-sm font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {benefit.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Treatments
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {clinic.treatments.map((treatment) => (
                  <li key={treatment}>
                    <Pill tone="muted">{titleCase(treatment)}</Pill>
                  </li>
                ))}
              </ul>

              <h2 className="mt-6 font-heading text-sm font-semibold text-foreground">
                Specialities
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {clinic.specialties.map((specialty) => (
                  <li key={specialty}>
                    <Pill tone="muted">{specialty}</Pill>
                  </li>
                ))}
              </ul>

              <h2 className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-foreground">
                <Languages aria-hidden="true" className="size-4" />
                Languages
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {clinic.languages.join(" · ")}
              </p>

              {clinic.contactPhone ? (
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone aria-hidden="true" className="size-4" />
                  {clinic.contactPhone}
                </p>
              ) : null}
            </div>

            <MedicalDisclaimer variant="card">
              This is an educational partnership. Global Fertility Hub does not
              rank, rate or recommend clinics, and does not receive a fee for
              referrals. Choosing where to have treatment is a decision for you
              and your healthcare team.
            </MedicalDisclaimer>
          </aside>
        </div>

        <Link
          href="/educational-partners"
          className="mt-12 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Educational Partners
        </Link>
      </Container>

      <div className="bg-surface">
        <RelatedGrid
          headingId="clinic-related-resources"
          title="Related Resources"
          count={relatedResources.length}
          action={{ label: "View All Resources", href: "/resources" }}
        >
          {relatedResources.map((item) => (
            <li key={item.id} className="flex">
              <ResourceCard resource={item} className="w-full" />
            </li>
          ))}
        </RelatedGrid>
      </div>

      <RelatedGrid
        headingId="clinic-related-events"
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
    </>
  );
}
