import { CalendarDays, Clock, Mic, PlayCircle } from "lucide-react";
import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Pill } from "@/components/shared/pill";
import {
  formatDuration,
  formatEventDate,
  formatEventTime,
  titleCase,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

/**
 * Event card, in one of two modes.
 *
 * `replay` swaps the date/time block for a duration and play affordance —
 * a past event's start time is noise, but how long the recording runs is
 * exactly what someone deciding whether to watch wants to know.
 */
export function EventCard({
  event,
  variant = "upcoming",
  className,
}: {
  event: Event;
  variant?: "upcoming" | "replay";
  className?: string;
}) {
  const isReplay = variant === "replay";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow hover:shadow-lg hover:shadow-primary/8",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <EntityImage
          image={event.image}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <Pill
          tone={isReplay ? "overlay" : "script"}
          className="absolute top-3 left-3"
        >
          {isReplay ? "Replay" : titleCase(event.type)}
        </Pill>

        {isReplay ? (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <PlayCircle className="size-11 text-background drop-shadow-md" />
            </span>
            <span className="absolute right-3 bottom-3 rounded-md bg-foreground/75 px-1.5 py-0.5 text-[0.6875rem] font-medium text-background">
              {formatDuration(event.durationMinutes)}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
          <Link
            href={`/events/${event.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <dl className="mt-4 flex flex-col gap-1.5 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          {isReplay ? (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Duration</dt>
              <Clock aria-hidden="true" className="size-3.5 shrink-0" />
              <dd>{formatDuration(event.durationMinutes)}</dd>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Date</dt>
                <CalendarDays aria-hidden="true" className="size-3.5 shrink-0" />
                <dd>{formatEventDate(event)}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Time</dt>
                <Clock aria-hidden="true" className="size-3.5 shrink-0" />
                <dd>{formatEventTime(event)}</dd>
              </div>
            </>
          )}

          {event.speakers[0] ? (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Speaker</dt>
              <Mic aria-hidden="true" className="size-3.5 shrink-0" />
              <dd className="truncate">
                {event.speakers[0].name}
                {event.speakers.length > 1
                  ? ` +${event.speakers.length - 1}`
                  : ""}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </article>
  );
}
