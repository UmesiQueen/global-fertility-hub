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
