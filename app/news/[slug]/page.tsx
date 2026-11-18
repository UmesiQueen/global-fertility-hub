import { ArrowLeft, Clock, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/cards/news-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { EntityImage } from "@/components/shared/entity-image";
import { JsonLd } from "@/components/shared/json-ld";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pill } from "@/components/shared/pill";
import { Prose } from "@/components/shared/prose";
import { RelatedGrid } from "@/components/shared/related-grid";
import { formatDate, formatReadingTime } from "@/lib/format";
import { markdownToPlainText } from "@/lib/markdown";
import {
  getAllNewsSlugs,
  getMoreNews,
  getNewsPostBySlug,
  getRelatedResourcesForNews,
} from "@/lib/repositories/news";
import { breadcrumbJsonLd, newsJsonLd } from "@/lib/seo";
import { NEWS_TYPE_LABELS } from "@/types";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) return { title: "News not found" };

  const description = post.excerpt || markdownToPlainText(post.body, 155);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.publishedAt || undefined,
      authors: [post.author.name],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) notFound();

  const [moreNews, relatedResources] = await Promise.all([
    getMoreNews(post, 3),
    getRelatedResourcesForNews(post, 3),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: post.title },
  ];

  return (
    <>
      <JsonLd data={[newsJsonLd(post), breadcrumbJsonLd(crumbs)]} />

      <article>
        <Container className="pt-8 pb-4">
          <Breadcrumbs crumbs={crumbs} />
        </Container>

        <Container className="pb-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{NEWS_TYPE_LABELS[post.type] ?? "News"}</Pill>
              {post.region ? <Pill tone="muted">{post.region}</Pill> : null}
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {post.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-5 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                By {post.author.name}
              </span>
              {/* A draft has no publish date until it is first published.
                  Omitted with its separator rather than rendered empty. */}
              {post.publishedAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </>
              ) : null}
              {post.readingTime ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" className="size-3.5" />
                    {formatReadingTime(post.readingTime)}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <figure className="mt-8 max-w-4xl">
            <div className="relative aspect-content w-full overflow-hidden rounded-3xl border border-border bg-muted">
              <EntityImage
                image={post.coverImage}
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
            {post.coverImageCredit ? (
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {post.coverImageCredit}
              </figcaption>
            ) : null}
          </figure>

          <Prose content={post.body} className="mt-10" />

          {post.sources.length ? (
            <section
              aria-labelledby="news-sources"
              className="mt-10 max-w-[68ch] rounded-2xl border border-border bg-card p-5 md:p-6"
            >
              <h2
                id="news-sources"
                className="font-heading text-lg font-semibold text-foreground"
              >
                Sources
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Summarised in our own words. Read the originals for the full
                details.
              </p>
              <ol className="mt-4 space-y-4">
                {post.sources.map((source) => (
                  <li key={source.url} className="text-sm">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 rounded-sm font-medium text-primary hover:underline"
                    >
                      {source.title}
                      <ExternalLink
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <p className="mt-0.5 text-muted-foreground">
                      {source.publisher}
                      {source.publishedAt
                        ? ` · ${formatDate(source.publishedAt)}`
                        : null}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <MedicalDisclaimer variant="card" className="mt-10 max-w-[68ch]">
            This is a summary of news and research for general information.
            It isn&apos;t medical advice, and every situation is different —
            please talk to your own healthcare team about your care.
          </MedicalDisclaimer>

          <div className="mt-10 max-w-4xl">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to News
            </Link>
          </div>
        </Container>
      </article>

      <div className="bg-surface">
        <RelatedGrid
          headingId="more-news"
          title="More News"
          count={moreNews.length}
          action={{ label: "View All News", href: "/news" }}
        >
          {moreNews.map((item) => (
            <li key={item.id} className="flex">
              <NewsCard post={item} className="w-full" />
            </li>
          ))}
        </RelatedGrid>
      </div>

      <RelatedGrid
        headingId="news-related-resources"
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
    </>
  );
}
