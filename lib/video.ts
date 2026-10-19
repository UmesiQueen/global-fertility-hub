/**
 * Turns the `videoUrl` an editor pastes into Hygraph into something the
 * site can play. Only Instagram and YouTube are recognised; anything else
 * returns `null` and the page falls back to a plain "Watch" link.
 *
 * Pure and dependency-free, so it runs on the server and in the browser.
 */

export type VideoProvider = "instagram" | "youtube";

export interface ParsedVideo {
  provider: VideoProvider;
  id: string;
  /** Loaded into the iframe only after the reader presses play. */
  embedUrl: string;
  /** The video's own page, for the fallback link. */
  watchUrl: string;
  /** Reels and Shorts are portrait; ordinary YouTube videos are landscape. */
  orientation: "portrait" | "landscape";
}

const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com", "m.instagram.com"]);
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const INSTAGRAM_ID = /^[A-Za-z0-9_-]{5,40}$/;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Accepts "1m30s", "90s" or "90" — YouTube's `t` parameter formats. */
function parseStartSeconds(value: string | null): number | undefined {
  if (!value) return undefined;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match || !match[0]) return undefined;
  const [, h = "0", m = "0", s = "0"] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

function parseInstagram(url: URL): ParsedVideo | null {
  // /reel/ID, /reels/ID, /p/ID, /tv/ID — optionally after a username:
  // /henry_and_precious/reel/ID
  const parts = url.pathname.split("/").filter(Boolean);
  const at = parts.findIndex((p) => ["reel", "reels", "p", "tv"].includes(p));
  const id = at === -1 ? undefined : parts[at + 1];
  if (!id || !INSTAGRAM_ID.test(id)) return null;

  // Reels and IGTV both play through the reel embed; photo/carousel posts
  // through /p/. Either way the embed page shows the post as Instagram does.
  const kind = parts[at] === "p" ? "p" : "reel";
  return {
    provider: "instagram",
    id,
    embedUrl: `https://www.instagram.com/${kind}/${id}/embed/`,
    watchUrl: `https://www.instagram.com/${kind}/${id}/`,
    orientation: "portrait",
  };
}

function parseYouTube(url: URL): ParsedVideo | null {
  let id: string | undefined;
  let short = false;

  if (url.hostname === "youtu.be") {
    id = url.pathname.split("/").filter(Boolean)[0];
  } else {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "watch") id = url.searchParams.get("v") ?? undefined;
    else if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "")) {
      id = parts[1];
      short = parts[0] === "shorts";
    }
  }
  if (!id || !YOUTUBE_ID.test(id)) return null;

  // youtube-nocookie: no tracking cookies until the reader actually plays.
  // autoplay=1 is fine because the iframe only loads after a click.
  const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
  const start = parseStartSeconds(url.searchParams.get("t") ?? url.searchParams.get("start"));
  if (start) params.set("start", String(start));

  return {
    provider: "youtube",
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?${params}`,
    watchUrl: short ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
    orientation: short ? "portrait" : "landscape",
  };
}

export function parseVideoUrl(raw: string | undefined | null): ParsedVideo | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  if (INSTAGRAM_HOSTS.has(host)) return parseInstagram(url);
  if (YOUTUBE_HOSTS.has(host) || host === "youtu.be") return parseYouTube(url);
  return null;
}

export const PROVIDER_NAME: Record<VideoProvider, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
};

/* -------------------------------------------------------------------------- */
/* Body marker                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Editors mark where the video goes with a line on its own:
 *
 *   [🎬 VIDEO — IVF Husbands, Your Support Matters]
 *
 * The emoji, the dash style and the title are all optional — `[VIDEO]`
 * works too. Matched against a paragraph's plain text, after markdown has
 * unescaped any `\[` the editor added.
 */
export const VIDEO_MARKER = /^\s*\[\s*(?:🎬\s*)?VIDEO\b\s*(?:[—–:-]\s*)?(.*?)\s*\]\s*$/iu;

/** Same test on raw markdown, line by line (Hygraph may escape the brackets). */
export function hasVideoMarker(markdown: string): boolean {
  return markdown
    .split("\n")
    .some((line) => VIDEO_MARKER.test(line.replace(/\\([[\]])/g, "$1")));
}
