"use client";

import { ExternalLink, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PROVIDER_NAME, parseVideoUrl } from "@/lib/video";

/**
 * An Instagram reel or YouTube video, loaded only when the reader presses
 * play. Until then it's a branded poster: no third-party request, no
 * Instagram or YouTube cookies, nothing slowing the page down.
 *
 * Instagram's embed page reports its own height with a `MEASURE`
 * postMessage, so the frame grows to fit the post instead of scrolling
 * inside itself. We listen for that instead of loading Instagram's
 * embed.js, which would add a tracking script to every visit.
 */
export function VideoEmbed({
  url,
  title,
  className,
}: {
  url: string;
  /** Shown on the poster and used as the iframe's accessible name. */
  title?: string;
  /** Small line under the title, e.g. "1 min watch". */
  meta?: string;
  className?: string;
}) {
  const video = parseVideoUrl(url);
  const [playing, setPlaying] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!playing || video?.provider !== "instagram") return;
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://www.instagram.com") return;
      if (event.source !== frame.current?.contentWindow) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const next = Number(data?.details?.height);
        if (data?.type === "MEASURE" && next > 0) setHeight(Math.ceil(next));
      } catch {
        // Not one of Instagram's messages.
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [playing, video?.provider]);

  // Not a link we can embed: still give readers a way to watch it.
  if (!video) {
    if (!/^https?:\/\//i.test(url)) return null;
    return (
      <p className={cn("mt-6 first:mt-0", className)}>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          Watch the video
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </p>
    );
  }

  const provider = PROVIDER_NAME[video.provider];
  const portrait = video.orientation === "portrait";
  const label = title || "Watch the video";

  return (
    <figure
      className={cn(
        "mt-8 first:mt-0 mb-8",
        portrait ? "mx-auto w-full max-w-100" : "w-full",
        className,
      )}
    >
      {playing ? (
        video.provider === "instagram" ? (
          <iframe
            ref={frame}
            src={video.embedUrl}
            title={label}
            // Until Instagram reports its height: a reel plus its header and footer.
            style={{ height: height ?? undefined }}
            className={cn(
              "w-full overflow-hidden rounded-2xl border border-border bg-card",
              height === null && "aspect-9/19",
            )}
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write; fullscreen"
            allowFullScreen
          />
        ) : (
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-2xl bg-foreground",
              portrait ? "aspect-9/16" : "aspect-video",
            )}
          >
            <iframe
              src={video.embedUrl}
              title={label}
              className="absolute inset-0 size-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        )
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${label}. Opens the ${provider} player.`}
          className={cn(
            "group relative flex w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl bg-primary p-8 text-center text-primary-foreground",
            "outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
            portrait ? "aspect-9/16" : "aspect-video",
          )}
        >
          {/* Soft lavender glow so the poster isn't a flat block. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/4 -right-1/4 size-3/4 rounded-full bg-secondary/25 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1/4 -left-1/4 size-2/3 rounded-full bg-script/30 blur-3xl"
          />

          <span className="relative flex size-18 items-center justify-center rounded-full bg-background text-primary shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <Play aria-hidden="true" className="ml-1 size-8 fill-current" />
          </span>

          <span className="relative flex flex-col items-center gap-2">
            {title ? (
              <span className="font-heading text-lg leading-snug font-semibold text-balance md:text-xl">
                {title}
              </span>
            ) : null}
          </span>
        </button>
      )}

      <figcaption className="mt-3 flex justify-center">
        <a
          href={video.watchUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline"
        >
          Watch on {provider}
          <ExternalLink aria-hidden="true" className="size-3.5" />
        </a>
      </figcaption>
    </figure>
  );
}
