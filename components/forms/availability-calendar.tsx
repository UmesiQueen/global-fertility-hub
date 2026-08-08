"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { AvailabilitySlot } from "@/types";

/**
 * Month grid showing which days have slots.
 *
 * Hand-built rather than pulling in a date-picker library: availability is a
 * short, known list, and a full picker would ship a lot of code to solve
 * problems we don't have (ranges, locales, min/max, keyboard grids over
 * arbitrary dates).
 *
 * Days are compared as `YYYY-MM-DD` strings in the practitioners' timezone,
 * never as local `Date` objects — otherwise a visitor in Los Angeles sees
 * Monday's slots filed under Sunday.
 */

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Parses `YYYY-MM-DD` into its parts without any timezone involvement. */
function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** Days in a month, and which weekday it starts on (Monday = 0). */
function buildMonth(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // getUTCDay is Sunday-first; shift so the grid starts on Monday.
  const leading = (first.getUTCDay() + 6) % 7;

  return { daysInMonth, leading };
}

export function AvailabilityCalendar({
  availability,
  selectedDate,
  onSelectDate,
  className,
}: {
  availability: AvailabilitySlot[];
  selectedDate?: string;
  onSelectDate: (date: string) => void;
  className?: string;
}) {
  const availableDates = useMemo(
    () => new Set(availability.map((slot) => slot.date)),
    [availability],
  );

  // Open on the first month that actually has availability, not today's —
  // otherwise a quiet month leaves the visitor staring at an empty grid.
  const firstAvailable = availability[0]?.date;
  const initial = firstAvailable
    ? parseDate(firstAvailable)
    : { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1 };

  const [view, setView] = useState({
    year: initial.year,
    month: initial.month,
  });

  const monthsWithSlots = useMemo(() => {
    const keys = new Set<string>();
    for (const slot of availability) {
      const { year, month } = parseDate(slot.date);
      keys.add(monthKey(year, month));
    }
    return keys;
  }, [availability]);

  const { daysInMonth, leading } = buildMonth(view.year, view.month);

  const monthLabel = new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(view.year, view.month - 1, 1)));

  function shiftMonth(delta: number) {
    setView((current) => {
      const next = new Date(
        Date.UTC(current.year, current.month - 1 + delta, 1),
      );
      return {
        year: next.getUTCFullYear(),
        month: next.getUTCMonth() + 1,
      };
    });
  }

  const hasEarlier = [...monthsWithSlots].some(
    (key) => key < monthKey(view.year, view.month),
  );
  const hasLater = [...monthsWithSlots].some(
    (key) => key > monthKey(view.year, view.month),
  );

  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!hasEarlier}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        {/* aria-live so keyboard users hear the month change. */}
        <p
          aria-live="polite"
          className="font-heading text-sm font-semibold text-foreground"
        >
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!hasLater}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div
        role="grid"
        aria-label={`Available dates in ${monthLabel}`}
        className="mt-4"
      >
        <div role="row" className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => (
            <abbr
              key={day}
              role="columnheader"
              title={day}
              aria-label={day}
              className="flex h-8 items-center justify-center text-[0.6875rem] font-medium text-muted-foreground no-underline"
            >
              {day.slice(0, 2)}
            </abbr>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: leading }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length padding
            <span key={`pad-${index}`} aria-hidden="true" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = `${monthKey(view.year, view.month)}-${String(day).padStart(2, "0")}`;
            const available = availableDates.has(date);
            const selected = selectedDate === date;

            return (
              <button
                key={date}
                type="button"
                role="gridcell"
                disabled={!available}
                aria-selected={selected}
                aria-label={
                  available
                    ? `${day} ${monthLabel} — slots available`
                    : `${day} ${monthLabel} — unavailable`
                }
                onClick={() => onSelectDate(date)}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg text-sm transition-colors",
                  selected && "bg-primary font-semibold text-primary-foreground",
                  !selected &&
                    available &&
                    "border border-primary/30 font-medium text-foreground hover:bg-accent",
                  !available &&
                    "cursor-not-allowed text-muted-foreground/40",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
