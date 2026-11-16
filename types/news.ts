import type { Author, Entity, ImageAsset } from "./shared";

/**
 * News: outside fertility news summarised in our own words, plus Hub
 * updates, on one page. Every post has its own page — we never send the
 * card straight to the source.
 */

export const NEWS_TYPES = [
  "research",
  "policy",
  "field-news",
  "hub-update",
] as const;

export type NewsType = (typeof NEWS_TYPES)[number];

/** Badge and filter-chip labels. Keep in sync with NEWS_TYPES. */
export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  research: "Research",
  policy: "Policy & Law",
  "field-news": "Fertility News",
  "hub-update": "Hub Update",
};

/** Where an outside news item came from. */
export interface NewsSource {
  publisher: string;
  title: string;
  /** Clean URL (no tracking params); DOI link for papers. */
  url: string;
  /** When the original was published. */
  publishedAt?: string; // ISO 8601
}

export interface NewsPost extends Entity {
  title: string;
  type: NewsType;
  /** 1–2 sentences for cards and the meta description. */
  excerpt: string;
  /** Short summary in our own words. Markdown from Hygraph rich text. */
  body: string;
  /** Free text, e.g. "Australia", "UK", "Global". */
  region?: string;
  /** Required for every type except "hub-update"; empty array when none. */
  sources: NewsSource[];
  author: Author;
  /** Editor-set date (Hygraph `publishDate`), not the system publish time. */
  publishedAt: string; // ISO 8601
  readingTime?: number; // minutes
  coverImage: ImageAsset;
  /** Attribution for a cover image that isn't ours. */
  coverImageCredit?: string;
  /** Pins the post to the top of the News page. */
  isFeatured?: boolean;
}
