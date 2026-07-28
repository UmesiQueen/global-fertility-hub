import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClinicCard } from "@/components/cards/clinic-card";
import { EventCard } from "@/components/cards/event-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { StoryCard } from "@/components/cards/story-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EntityImage } from "@/components/shared/entity-image";
import { JsonLd } from "@/components/shared/json-ld";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pill } from "@/components/shared/pill";
import { Prose } from "@/components/shared/prose";
import { RelatedGrid } from "@/components/shared/related-grid";
import { formatDate, formatReadingTime } from "@/lib/format";
import { markdownToPlainText } from "@/lib/markdown";
import {
  getAllStorySlugs,
  getRelatedClinicsForStory,
  getRelatedEventsForStory,
  getRelatedResourcesForStory,
  getSimilarStories,
  getStoryBySlug,
} from "@/lib/repositories/stories";
import { breadcrumbJsonLd, storyJsonLd } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) return { title: "Story not found" };

  return {
    title: story.title,
    description: story.preview || markdownToPlainText(story.body, 155),
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: {
      type: "article",
      title: story.title,
      description: story.preview,
      publishedTime: story.publishedAt,
      authors: [story.author.name],
    },
  };
}

/**
 * A community story.
 *
 * `getStoryBySlug` only returns approved stories, so an unreviewed or
 * rejected story 404s here rather than being reachable by guessing a URL.
 */
export default async function StoryDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  const [similar, relatedResources, relatedEvents, relatedClinics] =
    await Promise.all([
      getSimilarStories(story, 3),
      getRelatedResourcesForStory(story, 3),
      getRelatedEventsForStory(story, 3),
      getRelatedClinicsForStory(story, 3),
    ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Community Stories", href: "/stories" },
    { label: story.title },
  ];

  return (
    <>
      <JsonLd data={[storyJsonLd(story), breadcrumbJsonLd(crumbs)]} />

      <article>
        <Container className="pt-8 pb-4">
          <Breadcrumbs crumbs={crumbs} />
        </Container>

        <Container className="pb-10">
          <div className="max-w-[68ch]">
            <Pill>{story.category}</Pill>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {story.title}
            </h1>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-sm font-semibold text-primary"
              >
                {story.author.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  By {story.author.name}
                  {story.author.country ? (
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · {story.author.country}
                    </span>
                  ) : null}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={story.publishedAt}>
                    {formatDate(story.publishedAt)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <Clock aria-hidden="true" className="size-3" />
                  {formatReadingTime(story.readingTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl">
            <EntityImage
              image={story.coverImage}
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
            />
          </div>

          <Prose content={story.body} className="mt-10" />

          <MedicalDisclaimer variant="card" className="mt-10 max-w-[68ch]">
            This is one person&apos;s experience, shared in their own words. It
            isn&apos;t medical advice, and every journey is different — please
            talk to your own healthcare team about your care.
          </MedicalDisclaimer>

          <div className="mt-10 max-w-[68ch] rounded-2xl bg-surface p-6 text-center">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Your story could help someone feel less alone
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Sharing is entirely your choice, and you can stay anonymous. Every
              story is read and reviewed with care before it&apos;s published.
            </p>
            <ButtonLink href="/contact" className="mt-5">
              Share Your Story
            </ButtonLink>
          </div>

          <Link
            href="/stories"
            className="mt-10 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Stories
          </Link>
        </Container>
      </article>

      <div className="bg-surface">
        <RelatedGrid
          headingId="similar-stories"
          title="Similar Stories"
          count={similar.length}
          action={{ label: "Read All Stories", href: "/stories" }}
        >
          {similar.map((item) => (
            <li key={item.id} className="flex">
              <StoryCard story={item} className="w-full" />
            </li>
          ))}
        </RelatedGrid>
      </div>

      <RelatedGrid
        headingId="story-related-resources"
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
          headingId="story-related-events"
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
      </div>

      <RelatedGrid
        headingId="story-related-partners"
        title="Educational Clinic Partners"
        description="Partners whose educational focus covers these topics. We don't rank or recommend clinics."
        count={relatedClinics.length}
        action={{ label: "Browse All Partners", href: "/educational-partners" }}
      >
        {relatedClinics.map((item) => (
          <li key={item.id} className="flex">
            <ClinicCard clinic={item} className="w-full" />
          </li>
        ))}
      </RelatedGrid>
    </>
  );
}
