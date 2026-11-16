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
 * The date readers see. `publishDate` is set by the editor and stays put;
 * Hygraph's system `publishedAt` moves on every republish, so it's only a
 * fallback for entries that haven't been backfilled yet.
 * TODO: drop the fallback once every entry has a `publishDate`.
 */
export const publishDate = (r: {
  publishDate?: string | null;
  publishedAt?: string | null;
}) => date(r.publishDate ?? r.publishedAt ?? null);
