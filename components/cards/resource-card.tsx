import { Clock, Download, FileText, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Pill } from "@/components/shared/pill";
import { formatReadingTime, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Resource, ResourceFormat } from "@/types";

const FORMAT_ICONS: Record<
  ResourceFormat,
  React.ComponentType<{ className?: string }>
> = {
  article: FileText,
  guide: FileText,
  video: PlayCircle,
  webinar: PlayCircle,
  download: Download,
};

export function ResourceCard({
  resource,
  className,
}: {
  resource: Resource;
  className?: string;
}) {
  const FormatIcon = FORMAT_ICONS[resource.format];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow shadow-sm hover:shadow-lg hover:shadow-primary/8",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <EntityImage
          image={resource.coverImage}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <Pill tone="overlay" icon={FormatIcon} className="absolute top-3 left-3">
          {titleCase(resource.format)}
        </Pill>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
          {/* Stretched link — the whole card is the target, but only this
              text is the accessible name, so there's one link per card. */}
          <Link
            href={`/resources/${resource.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {resource.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {resource.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-3.5" />
            {formatReadingTime(resource.readingTime, resource.format)}
          </span>

          {resource.isNew ? (
            <Pill tone="new" icon={Sparkles} className="ml-auto">
              New
            </Pill>
          ) : null}
        </div>
      </div>
    </article>
  );
}
