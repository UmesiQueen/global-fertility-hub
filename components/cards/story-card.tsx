import { Clock } from "lucide-react";
import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Pill } from "@/components/shared/pill";
import { formatDateShort, formatReadingTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Story } from "@/types";

export function StoryCard({
  story,
  className,
}: {
  story: Story;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow shadow-sm hover:shadow-lg hover:shadow-primary/8",
        className,
      )}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <EntityImage
          image={story.coverImage}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <Pill tone="overlay" className="absolute top-3 left-3">
          {story.category}
        </Pill>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
          <Link
            href={`/stories/${story.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {story.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {story.preview}
        </p>

        <div className="mt-4 flex items-center gap-2.5 border-t border-border/70 pt-3">
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-[0.625rem] font-semibold text-primary"
          >
            {story.author.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              By {story.author.name}
            </p>
            <p className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
              {formatDateShort(story.publishedAt)}
              <span aria-hidden="true">·</span>
              <Clock aria-hidden="true" className="size-3" />
              {formatReadingTime(story.readingTime)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
