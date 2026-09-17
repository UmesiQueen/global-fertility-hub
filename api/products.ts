import type { Product } from "@/types";
import { hygraphFetch } from "./client";
import { asset, date, enumIn, md } from "./map";

const QUERY = `query Products($stage: Stage!) {
  products(stage: $stage, first: 100) {
    id
    slug
    name
    excerpt
    body { markdown }
    source
    format
    category
    tags
    price
    currency
    isFree
    externalUrl
    vendor
    includes
    publishedAt
    isFeatured
    isNew
    coverImage { url altText }
  }
}`;

export async function fetchProducts(): Promise<Product[]> {
  const data = await hygraphFetch<{ products: Product[] }>(QUERY);

  return data.products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    excerpt: p.excerpt ?? "",
    body: md(p.body),
    source: enumIn(p.source) as Product["source"],
    format: enumIn(p.format) as Product["format"],
    category: enumIn(p.category) as Product["category"],
    tags: (p.tags ?? []).map(enumIn) as Product["tags"],
    // Left undefined for affiliate items — we don't control that price.
    price: p.price ?? undefined,
    currency: p.currency ?? undefined,
    isFree: p.isFree ?? undefined,
    externalUrl: p.externalUrl ?? "",
    vendor: p.vendor ?? "",
    includes: p.includes?.length ? p.includes : undefined,
    coverImage: asset(p.coverImage, p.name),
    publishedAt: date(p.publishedAt),
    isFeatured: p.isFeatured ?? undefined,
    isNew: p.isNew ?? undefined,
  }));
}
