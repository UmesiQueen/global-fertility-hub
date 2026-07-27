import type { Author, Entity, ImageAsset } from "./shared";

/** Format filter on the Resources page. */
export type ResourceFormat = "article" | "video" | "guide" | "download" | "webinar";

/** Left-hand "Browse by Category" sidebar on the Resources page. */
export const RESOURCE_CATEGORIES = [
  "ivf-basics",
  "ovulation-hormones",
  "treatments-procedures",
  "tests-diagnosis",
  "fertility-conditions",
  "male-fertility",
  "pregnancy-after-ivf",
  "emotional-wellbeing",
  "lifestyle-nutrition",
  "finances-insurance",
  "donor-surrogacy",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export interface Resource extends Entity {
  title: string;
  excerpt: string;
  /** Markdown/MDX body. Replaced by CMS rich text later. */
  body: string;
  format: ResourceFormat;
  category: ResourceCategory;
  author: Author;
  /** Minutes. Rendered as "8 min read" / video duration. */
  readingTime: number;
  publishedAt: string; // ISO 8601
  coverImage: ImageAsset;
  /** Shows the "New" pill on cards. */
  isNew?: boolean;
  /** Surfaced in the homepage Featured Resources grid. */
  isFeatured?: boolean;
  /** Present when format is "download" or the resource has an attachment. */
  downloadUrl?: string;
  /** Present when format is "video" or "webinar". */
  videoUrl?: string;
}
