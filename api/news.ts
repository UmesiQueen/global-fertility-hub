import type { NewsPost, NewsSource } from "@/types";
import { hygraphFetch } from "./client";
import { asset, date, enumIn, md, publishDate, type WithPublishDate } from "./map";

const QUERY = `query NewsPosts($stage: Stage!) {
  newsPosts(stage: $stage, first: 100) {
    id
    slug
    title
    type
    excerpt
    body { markdown }
    tags
    region
    sources { publisher title url publishDate }
    author { name role }
    publishDate
    publishedAt
    readingTime
    coverImage { url altText }
    coverImageCredit
    isFeatured
  }
}`;

/** Hygraph's shape of a source: the component's date field is `publishDate`. */
type RawNewsSource = Omit<NewsSource, "publishedAt"> & {
  publishDate?: string | null;
};

type RawNewsPost = WithPublishDate<Omit<NewsPost, "sources">> & {
  sources: RawNewsSource[] | null;
};

export async function fetchNewsPosts(): Promise<NewsPost[]> {
  const data = await hygraphFetch<{ newsPosts: RawNewsPost[] }>(QUERY);

  return data.newsPosts.map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    type: enumIn(n.type) as NewsPost["type"],
    excerpt: n.excerpt ?? "",
    body: md(n.body),
    tags: (n.tags ?? []).map(enumIn) as NewsPost["tags"],
    region: n.region ?? undefined,
    // Hub updates have none; an empty list lets the page skip the block.
    sources: (n.sources ?? []).map((s) => ({
      publisher: s.publisher,
      title: s.title,
      url: s.url,
      publishedAt: s.publishDate ? date(s.publishDate) : undefined,
    })),
    author: { name: n.author?.name ?? "", role: n.author?.role ?? undefined },
    publishedAt: publishDate(n),
    readingTime: n.readingTime ?? undefined,
    coverImage: asset(n.coverImage, n.title),
    coverImageCredit: n.coverImageCredit ?? undefined,
    isFeatured: n.isFeatured ?? undefined,
  }));
}
