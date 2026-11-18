/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ImageAsset } from "@/types";

/** Hygraph enum IDs use underscores; our types use hyphens. */
export const enumIn = (v: string) => v?.replace(/_/g, "-") ?? "";

export const asset = (a: any, alt = ""): ImageAsset => ({
  src: a?.url ?? "",
  alt: a?.altText ?? alt,
});

/** Rich text fields are queried as `{ markdown }` so <Prose> renders them. */
export const md = (f: any) => f?.markdown ?? "";

export const date = (v: string | null) => v?.slice(0, 10) ?? "";

/** Raw Hygraph record carrying the editor-set `publishDate`. */
export type WithPublishDate<T> = T & { publishDate?: string | null };

/**
 * The moment readers see as the publish date, as a full UTC timestamp.
 *
 * `publishDate` is the editor's date, filled in automatically on first publish
 * by /api/publish-date and left alone after that. Hygraph's system
 * `publishedAt` moves on every republish, so it only stands in for the few
 * seconds before that fills in, or if the webhook ever fails.
 *
 * Kept as a timestamp rather than cut to a day: the time orders same-day
 * posts, and lib/format.ts shows it in the site's timezone so the day is the
 * one the editor picked.
 */
export const publishDate = (r: {
  publishDate?: string | null;
  publishedAt?: string | null;
}) => r.publishDate ?? r.publishedAt ?? "";
