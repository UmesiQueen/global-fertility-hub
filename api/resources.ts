import type { Resource } from "@/types";
import { hygraphFetch } from "./client";
import { asset, date, enumIn, md } from "./map";

const QUERY = `query Resources {
  resources(first: 100) {
    id
    slug
    title
    excerpt
    body { markdown }
    format
    category
    tags
    readingTime
    publishedAt
    isNew
    isFeatured
    downloadUrl
    videoUrl
    author { name role }
    coverImage { url altText }
  }
}`;

export async function fetchResources(): Promise<Resource[]> {
  const data = await hygraphFetch<{ resources: any[] }>(QUERY);

  return data.resources.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: md(r.body),
    format: enumIn(r.format) as Resource["format"],
    category: enumIn(r.category) as Resource["category"],
    tags: (r.tags ?? []).map(enumIn) as Resource["tags"],
    author: { name: r.author?.name ?? "", role: r.author?.role ?? undefined },
    readingTime: r.readingTime ?? 1,
    publishedAt: date(r.publishedAt),
    coverImage: asset(r.coverImage, r.title),
    isNew: r.isNew ?? undefined,
    isFeatured: r.isFeatured ?? undefined,
    downloadUrl: r.downloadUrl ?? undefined,
    videoUrl: r.videoUrl ?? undefined,
  }));
}
