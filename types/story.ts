import type { Entity, ImageAsset } from "./shared";

/**
 * Community stories. Every story is reviewed before publication —
 * only `status: "approved"` records are ever returned by the repository.
 */

export type StoryStatus = "pending" | "approved" | "rejected";

export interface StoryAuthor {
  /** "Anonymous" is a first-class, expected value. */
  name: string;
  avatar?: ImageAsset;
  /** Optional country for context, never precise location. */
  country?: string;
}

export interface Story extends Entity {
  title: string;
  coverImage: ImageAsset;
  /** Primary category badge on the card — one of the 9 story filters. */
  category: string;
  /** 1–2 sentence teaser shown on cards. */
  preview: string;
  body: string;
  author: StoryAuthor;
  publishedAt: string; // ISO 8601
  readingTime: number; // minutes
  status: StoryStatus;
  isFeatured?: boolean;
}
