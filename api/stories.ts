import { isDraftEnabled } from "@/lib/preview";
import type { Story } from "@/types";
import { hygraphFetch } from "./client";
import { asset, date, enumIn, md } from "./map";

const QUERY = `query Stories($stage: Stage!) {
  stories(stage: $stage, first: 100) {
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
  const data = await hygraphFetch<{ stories: Story[] }>(QUERY);

  // On the published stage, publishing *is* the review — nothing this token can
  // see got there without a human approving it. On the draft stage that
  // guarantee is gone, so drafts are reported as what they are: not yet
  // reviewed. The repository decides what to do with that.
  const draft = await isDraftEnabled();

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
    status: draft ? "pending" : "approved",
    isFeatured: s.isFeatured ?? undefined,
  }));
}
