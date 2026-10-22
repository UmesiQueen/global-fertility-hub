import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { VideoEmbed } from "@/components/shared/video-embed";
import {
  isAllowedEmbed,
  isHygraphAsset,
  rehypeCitations,
  rehypeVideoMarker,
  sanitizeSchema,
  VIDEO_SLOT_TAG,
} from "@/lib/markdown";
import { cn } from "@/lib/utils";

/**
 * Every element the Hygraph rich text editor can produce, mapped to the
 * site's typography. Long-form health content is often read on a phone by
 * someone who is tired — line length is capped around 68 characters and line
 * height is generous on purpose.
 *
 * `first:mt-0` on block elements drops the top margin of whatever opens the
 * body, so it sits flush under the page header.
 */
const h2 = "mt-10 first:mt-0 font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl";
const h3 = "mt-8 first:mt-0 font-heading text-lg font-bold tracking-tight text-foreground md:text-xl";
const list = "mt-4 first:mt-0 flex flex-col gap-2 pl-5 marker:text-primary/50 [li>&]:mt-2";

/** react-markdown hands every component its syntax-tree `node`; keep it off the DOM. */
function domProps<P extends { node?: unknown }>({ node, ...rest }: P) {
  void node;
  return rest;
}

const components: Components = {
  // H1 and H2 both become h2 — the page title is the only h1.
  h1: (props) => <h2 className={h2} {...domProps(props)} />,
  h2: (props) => <h2 className={h2} {...domProps(props)} />,
  h3: (props) => <h3 className={h3} {...domProps(props)} />,
  h4: (props) => <h3 className={h3} {...domProps(props)} />,
  h5: (props) => <h3 className={h3} {...domProps(props)} />,
  h6: (props) => <h3 className={h3} {...domProps(props)} />,

  p: ({ className, ...props }) => (
    <p
      className={cn(
        "mt-4 first:mt-0 text-base leading-[1.75] text-muted-foreground [li>&]:mt-0",
        className,
      )}
      {...domProps(props)}
    />
  ),

  a: ({ href = "", className, children, ...props }) => {
    // Citation links arrive already styled by rehypeCitations.
    const style =
      className ?? "text-primary underline underline-offset-2 hover:text-primary/80";

    // The sanitizer empties unsafe URLs (`javascript:` and friends); keep the
    // words, drop the link.
    if (!href) return <span>{children}</span>;

    if (href.startsWith("#")) {
      return (
        <a href={href} className={style} {...domProps(props)}>
          {children}
        </a>
      );
    }
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={style} {...domProps(props)}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={style} {...domProps(props)}>
        {children}
      </a>
    );
  },

  strong: (props) => (
    <strong className="font-semibold text-foreground" {...domProps(props)} />
  ),
  u: (props) => <u className="underline-offset-2" {...domProps(props)} />,

  ul: (props) => <ul className={cn(list, "list-disc")} {...domProps(props)} />,
  ol: (props) => <ol className={cn(list, "list-decimal")} {...domProps(props)} />,
  li: ({ className, ...props }) => (
    <li
      className={cn("text-base leading-relaxed text-muted-foreground", className)}
      {...domProps(props)}
    />
  ),

  blockquote: (props) => (
    <blockquote
      className="mt-6 first:mt-0 border-l-4 border-primary/30 pl-4 text-foreground/80 italic"
      {...domProps(props)}
    />
  ),

  hr: () => <hr className="my-10 border-border" />,

  pre: (props) => (
    <pre
      className="mt-4 first:mt-0 overflow-x-auto rounded-xl bg-muted p-4 text-sm leading-relaxed"
      {...domProps(props)}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground [pre>&]:bg-transparent [pre>&]:p-0"
      {...domProps(props)}
    />
  ),

  // Tables scroll sideways on a phone rather than squashing the columns.
  table: (props) => (
    <div className="mt-6 first:mt-0 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...domProps(props)} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border px-3 py-2 text-left font-semibold text-foreground"
      {...domProps(props)}
    />
  ),
  td: (props) => (
    <td className="border-b border-border/60 px-3 py-2 text-muted-foreground" {...domProps(props)} />
  ),

  // A plain <img>: inline images have no known size for next/image, and
  // Hygraph's CDN already serves them optimised — at no cost to Vercel.
  img: ({ src, alt, title }) => {
    if (typeof src !== "string" || !src.startsWith("https://")) return null;

    /* eslint-disable @next/next/no-img-element -- see the comment above */
    return (
      // biome-ignore lint/performance/noImgElement: see the comment above
      <img
        src={src}
        alt={alt ?? ""}
        title={title}
        loading="lazy"
        decoding="async"
        className="mt-6 h-auto w-full rounded-2xl"
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },

  // Embeds only from known players; anything else is dropped silently
  // rather than shown to readers as code.
  iframe: ({ src, title }) =>
    isAllowedEmbed(src) ? (
      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl">
        <iframe
          src={src}
          title={title || "Embedded video"}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    ) : null,
  video: ({ src, poster }) =>
    isHygraphAsset(src) ? (
      // biome-ignore lint/a11y/useMediaCaption: editor uploads carry no caption track
      <video
        src={src}
        poster={poster}
        controls
        preload="metadata"
        className="mt-6 w-full rounded-2xl"
      />
    ) : null,
};

/** Renders an article, story or product body from Hygraph markdown. */
export function Prose({
  content,
  className,
  video,
}: {
  content: string;
  className?: string;
  /**
   * The resource's video. It plays where the body has a `[🎬 VIDEO — …]`
   * line; without a video, that line is simply dropped.
   */
  video?: { url: string; meta?: string };
}) {
  // A custom tag, so it sits outside react-markdown's intrinsic-element typing.
  const withVideo = {
    ...components,
    [VIDEO_SLOT_TAG]: ({ title }: { title?: string }) =>
      video ? <VideoEmbed url={video.url} title={title} meta={video.meta} /> : null,
  } as Components;

  return (
    <div className={cn("max-w-4xl", className)}>
      <Markdown
        // remark-breaks: in Hygraph a single newline is a deliberate
        // Shift+Enter line break, never a hard wrap.
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          rehypeVideoMarker,
          rehypeCitations,
        ]}
        components={withVideo}
      >
        {content}
      </Markdown>
    </div>
  );
}
