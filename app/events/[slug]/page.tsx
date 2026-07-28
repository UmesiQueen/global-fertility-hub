import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Download,
  FileText,
  Mic,
  PlayCircle,
  Presentation,
} from "lucide-react";
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
import { RelatedGrid } from "@/components/shared/related-grid";
import {
  formatDuration,
  formatEventDate,
  formatEventTime,
  titleCase,
} from "@/lib/format";
import {
  getAllEventSlugs,
  getEventBySlug,
  getRelatedClinicsForEvent,
  getRelatedEvents,
  getRelatedResourcesForEvent,
} from "@/lib/repositories/events";
import { breadcrumbJsonLd, eventJsonLd } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: { title: event.title, description: event.description },
  };
}

/**
 * Event detail, covering both states of an event's life.
 *
 * Before it runs: date, time and registration. After: the replay, transcript,
 * slides and downloads. Which one shows is derived from `replayUrl` and the
 * start time, matching how the listing tabs split — so an event never needs
 * to be manually moved from one state to the other.
 */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const [relatedEvents, relatedResources, relatedClinics] = await Promise.all([
    getRelatedEvents(event, 3),
    getRelatedResourcesForEvent(event, 3),
    getRelatedClinicsForEvent(event, 3),
  ]);

  const hasReplay = Boolean(event.replayUrl);
  const isPast = new Date(event.startsAt).getTime() <= Date.now();

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Events & Webinars", href: "/events" },
    { label: event.title },
  ];

  return (
    <>
      <JsonLd data={[eventJsonLd(event), breadcrumbJsonLd(crumbs)]} />

      <Container className="pt-8 pb-4">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <Container className="pb-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
              <EntityImage
                image={event.image}
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
              {hasReplay ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <PlayCircle className="size-16 text-background drop-shadow-lg" />
                </span>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Pill tone={hasReplay ? "muted" : "script"}>
                {hasReplay ? "Replay Available" : titleCase(event.type)}
              </Pill>
              {isPast && !hasReplay ? (
                <Pill tone="muted">Past Event</Pill>
              ) : null}
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {event.title}
            </h1>

            <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
              {event.description}
            </p>

            {event.speakers.length ? (
              <section aria-labelledby="event-speakers" className="mt-10">
                <h2
                  id="event-speakers"
                  className="font-heading text-lg font-bold text-foreground"
                >
                  {event.speakers.length > 1 ? "Speakers" : "Speaker"}
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {event.speakers.map((speaker) => (
                    <li
                      key={speaker.name}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary"
                      >
                        <Mic className="size-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          {speaker.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {speaker.role}
                          {speaker.organisation
                            ? ` · ${speaker.organisation}`
                            : ""}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {event.transcript ? (
              <section aria-labelledby="event-transcript" className="mt-10">
                <h2
                  id="event-transcript"
                  className="inline-flex items-center gap-2 font-heading text-lg font-bold text-foreground"
                >
                  <FileText aria-hidden="true" className="size-4" />
                  Transcript
                </h2>
                <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
                  {event.transcript}
                </p>
              </section>
            ) : null}

            {event.downloads?.length || event.slidesUrl ? (
              <section aria-labelledby="event-downloads" className="mt-10">
                <h2
                  id="event-downloads"
                  className="font-heading text-lg font-bold text-foreground"
                >
                  Downloads
                </h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {event.slidesUrl ? (
                    <li>
                      <a
                        href={event.slidesUrl}
                        className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40"
                      >
                        <Presentation
                          aria-hidden="true"
                          className="size-4 shrink-0 text-primary"
                        />
                        <span className="flex-1">Slides</span>
                        <Download
                          aria-hidden="true"
                          className="size-4 text-muted-foreground"
                        />
                      </a>
                    </li>
                  ) : null}

                  {event.downloads?.map((download) => (
                    <li key={download.url}>
                      <a
                        href={download.url}
                        className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40"
                      >
                        <FileText
                          aria-hidden="true"
                          className="size-4 shrink-0 text-primary"
                        />
                        <span className="flex-1">{download.label}</span>
                        {download.meta ? (
                          <span className="text-xs text-muted-foreground">
                            {download.meta}
                          </span>
                        ) : null}
                        <Download
                          aria-hidden="true"
                          className="size-4 text-muted-foreground"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <MedicalDisclaimer variant="card" className="mt-10 max-w-[68ch]" />

            <Link
              href="/events"
              className="mt-10 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to Events
            </Link>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <dl className="flex flex-col gap-4 text-sm">
                <div className="flex items-start gap-2.5">
                  <CalendarDays
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div>
                    <dt className="text-xs text-muted-foreground">Date</dt>
                    <dd className="font-medium text-foreground">
                      {formatEventDate(event)}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div>
                    <dt className="text-xs text-muted-foreground">Time</dt>
                    {/* Shown in the event's own timezone — the same time the
                        host advertised, not the reader's local conversion. */}
                    <dd className="font-medium text-foreground">
                      {formatEventTime(event)}
                    </dd>
                    <dd className="text-xs text-muted-foreground">
                      {formatDuration(event.durationMinutes)}
                    </dd>
                  </div>
                </div>
              </dl>

              {hasReplay ? (
                <ButtonLink
                  href={event.replayUrl ?? "#"}
                  external
                  size="lg"
                  className="mt-6 w-full"
                >
                  <PlayCircle aria-hidden="true" className="size-4" />
                  Watch the Replay
                </ButtonLink>
              ) : isPast ? (
                <p className="mt-6 rounded-xl bg-surface p-3.5 text-xs leading-relaxed text-muted-foreground">
                  This event has finished. The replay will appear here once
                  it&apos;s ready.
                </p>
              ) : (
                <>
                  <ButtonLink
                    href={event.registrationUrl ?? "/contact"}
                    external={Boolean(event.registrationUrl)}
                    size="lg"
                    className="mt-6 w-full"
                  >
                    Register Now
                  </ButtonLink>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Free to attend · Replay shared afterwards
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </Container>

      <div className="bg-surface">
        <RelatedGrid
          headingId="event-related-events"
          title="Related Events & Webinars"
          count={relatedEvents.length}
          action={{ label: "View All Events", href: "/events" }}
        >
          {relatedEvents.map((item) => (
            <li key={item.id} className="flex">
              <EventCard
                event={item}
                variant={item.replayUrl ? "replay" : "upcoming"}
                className="w-full"
              />
            </li>
          ))}
        </RelatedGrid>
      </div>

      <RelatedGrid
        headingId="event-related-resources"
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

      <div className="bg-surface">
        <RelatedGrid
          headingId="event-related-partners"
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
