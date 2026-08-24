import type { Story } from "@/types";
import { hygraphFetch } from "./client";
import { asset, date, enumIn, md } from "./map";

const QUERY = `{
  stories(first: 500, orderBy: publishedAt_DESC) {
    id
    slug
    title
    category
    preview
    body { markdown }
    tags
    readingTime
    publishedAt
    isFeatured
    author { name country }
    coverImage { url altText }
  }
}`;

export async function fetchStories(): Promise<Story[]> {
  const data = await hygraphFetch<{ stories: any[] }>(QUERY);

  return data.stories.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    category: enumIn(s.category),
    preview: s.preview ?? "",
    body: md(s.body),
    tags: (s.tags ?? []).map(enumIn) as Story["tags"],
    author: {
      name: s.author?.name ?? "Anonymous",
      country: s.author?.country ?? undefined,
    },
    readingTime: s.readingTime ?? 1,
    publishedAt: date(s.publishedAt),
    coverImage: asset(s.coverImage, s.title),
    // Anything this token can see is published, and publishing is the review.
    status: "approved",
    isFeatured: s.isFeatured ?? undefined,
  }));
}
