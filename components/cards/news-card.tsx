import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Pill } from "@/components/shared/pill";
import { formatDateShort, formatReadingTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { NEWS_TYPE_LABELS, type NewsPost } from "@/types";

export type NewsCardVariant = "lead" | "default" | "compact";

const CARD =
  "group relative overflow-hidden border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/8";

/** The whole card is the link: the title's ::after stretches over it. */
function TitleLink({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="rounded-sm after:absolute after:inset-0 after:content-['']"
    >
      {post.title}
    </Link>
  );
}

/** "Research · 12 Nov 2026 · Australia" — each part only when it has a value. */
function NewsMeta({
  post,
  showType = true,
  showReadingTime = false,
  className,
}: {
  post: NewsPost;
  showType?: boolean;
  showReadingTime?: boolean;
  className?: string;
}) {
  const parts: React.ReactNode[] = [];

  if (showType) {
    parts.push(
      <span key="type" className="font-semibold text-primary">
        {NEWS_TYPE_LABELS[post.type] ?? "News"}
      </span>,
    );
  }

  // A draft read through preview may not have a date yet.
  if (post.publishedAt) {
    parts.push(
      <time key="date" dateTime={post.publishedAt}>
        {formatDateShort(post.publishedAt)}
      </time>,
    );
  }
  if (post.region) parts.push(<span key="region">{post.region}</span>);
  if (showReadingTime && post.readingTime) {
    parts.push(
      <span key="time" className="inline-flex items-center gap-1">
        <Clock aria-hidden="true" className="size-3" />
        {formatReadingTime(post.readingTime)}
      </span>,
    );
  }

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {parts.map((part, index) => (
        <span key={index} className="inline-flex items-center gap-1.5">
          {index > 0 ? <span aria-hidden="true">·</span> : null}
          {part}
        </span>
      ))}
    </p>
  );
}

/**
 * News post card.
 *
 * - `lead` — the "news of the day" at the top of /news. On md+ the photo fills
 *   the card and the text sits on a panel over its lower-left corner; on
 *   phones the panel drops below the photo so nothing covers the image.
 * - `compact` — the "Latest News" sidebar: thumbnail beside the text. Grows to
 *   fill its row, so two of them match the lead card's height on desktop.
 * - `default` — the grid card, matching the story and resource cards.
 */
export function NewsCard({
  post,
  variant = "default",
  priority,
  className,
}: {
  post: NewsPost;
  variant?: NewsCardVariant;
  /** Set on the lead card only — it's the page's largest image. */
  priority?: boolean;
  className?: string;
}) {
  if (variant === "lead") {
    return (
      <article
        className={cn(
          CARD,
          "flex flex-col rounded-3xl md:min-h-[26rem] lg:min-h-[30rem]",
          className,
        )}
      >
        <div className="relative aspect-content w-full overflow-hidden md:absolute md:inset-0 md:aspect-auto">
          <EntityImage
            image={post.coverImage}
            priority={priority}
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <Pill tone="overlay" className="absolute top-4 left-4">
            {post.isFeatured ? "Featured" : "Latest"}
          </Pill>
        </div>

        <div className="relative flex flex-col p-5 md:absolute md:bottom-5 md:left-5 md:max-w-[min(34rem,calc(100%-2.5rem))] md:rounded-2xl md:bg-card md:p-6 md:shadow-lg">
          <NewsMeta post={post} />
          <h2 className="mt-2 font-heading text-xl leading-tight font-bold text-foreground md:text-2xl">
            <TitleLink post={post} />
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {post.excerpt}
          </p>
          {/* Decorative: the title link already covers the card. */}
          <span
            aria-hidden="true"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90"
          >
            Read More
            <ArrowRight className="size-4" />
          </span>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article
        className={cn(
          CARD,
          "flex items-stretch gap-4 rounded-2xl p-3",
          className,
        )}
      >
        <div className="relative aspect-4/3 w-28 shrink-0 self-start overflow-hidden rounded-xl sm:w-40 lg:aspect-auto lg:w-[42%] lg:self-stretch">
          <EntityImage
            image={post.coverImage}
            sizes="(min-width: 1024px) 180px, 160px"
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col py-1">
          <NewsMeta post={post} />
          <h3 className="mt-1.5 line-clamp-3 font-heading text-sm leading-snug font-semibold text-foreground sm:text-base">
            <TitleLink post={post} />
          </h3>
          <p className="mt-1.5 hidden line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:block">
            {post.excerpt}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className={cn(CARD, "flex flex-col rounded-2xl", className)}>
      <div className="relative aspect-content w-full overflow-hidden">
        <EntityImage
          image={post.coverImage}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <Pill tone="overlay" className="absolute top-3 left-3">
          {NEWS_TYPE_LABELS[post.type] ?? "News"}
        </Pill>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
          <TitleLink post={post} />
        </h3>
        <p className="mt-2 mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <NewsMeta
          post={post}
          showType={false}
          showReadingTime
          className="mt-auto border-t border-border/70 pt-3"
        />
      </div>
    </article>
  );
}
