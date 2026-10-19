"use client";

import {
  CalendarDays,
  Clock,
  ExternalLink,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/shared/button-link";
import { cn } from "@/lib/utils";
import type { ConsultationType } from "@/types";

/**
 * Tracking travels as UTM parameters rather than pre-filled answers (`a1`…):
 * the invitee never sees or edits them, and Calendly records them against the
 * booking as Tracking IDs (filterable and exportable from the Calendar page).
 * Values are capped at 255 characters.
 */
const BOOKING_SOURCE = "GFH-website";

function bookingHref(base: string, session?: ConsultationType) {
  const url = new URL(base);
  url.searchParams.set("utm_source", BOOKING_SOURCE);
  if (session) url.searchParams.set("utm_content", session.name);
  return url.toString();
}

/**
 * Consultation booking.
 *
 * Sessions come from Hygraph; the reader picks one here, then chooses a time
 * on Calendly, which owns live availability, collects their details and sends
 * the confirmation. The chosen session and the booking's source travel in the
 * Calendly URL, so Henry & Precious can see both — there's one Calendly link
 * for now, even if Hygraph lists several sessions.
 */
export function ConsultationBooking({
  consultationTypes,
  bookingUrl,
  className,
}: {
  consultationTypes: ConsultationType[];
  bookingUrl: string;
  className?: string;
}) {
  const [selectedId, setSelectedId] = useState(consultationTypes[0]?.id);
  const selected = consultationTypes.find((type) => type.id === selectedId);

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2 lg:gap-10", className)}>
      <section aria-labelledby="choose-session">
        <h2
          id="choose-session"
          className="font-heading text-base font-semibold text-foreground"
        >
          Choose Your Session
        </h2>

        <div
          role="radiogroup"
          aria-labelledby="choose-session"
          className="mt-4 flex flex-col gap-3"
        >
          {consultationTypes.map((type) => {
            const checked = type.id === selectedId;

            return (
              <label
                key={type.id}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
                  checked
                    ? "border-primary bg-accent/40"
                    : "border-border hover:border-primary/40",
                )}
              >
                <input
                  type="radio"
                  name="consultation-session"
                  value={type.id}
                  checked={checked}
                  onChange={() => setSelectedId(type.id)}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />

                <span className="flex-1">
                  <span className="block font-heading text-sm font-semibold text-foreground">
                    {type.name}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {type.description}
                  </span>
                  <span className="mt-2.5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock aria-hidden="true" className="size-3.5" />
                      {type.durationMinutes} minutes
                    </span>
                    <span className="font-heading text-sm font-semibold text-primary uppercase">
                      {type.price > 0
                        ? `${type.currency} ${type.price}`
                        : "Free"}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <p className="mt-4 flex gap-2.5 rounded-xl bg-surface p-3.5 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          This is not medical advice. We don&apos;t diagnose or treat. Our
          sessions are focused on support and advocacy.
        </p>
      </section>

      <section
        aria-labelledby="pick-a-time"
        className="flex flex-col rounded-3xl border border-border bg-card p-6 md:p-8"
      >
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary"
        >
          <CalendarDays className="size-6" />
        </span>

        <h2
          id="pick-a-time"
          className="mt-5 font-heading text-xl font-bold text-foreground"
        >
          Pick a Time That Suits You
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We use Calendly to show our live availability. Choose a date and time,
          add your details, and you&apos;ll get a confirmation by email.
        </p>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Globe aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          Times are shown in your own time zone, wherever you are.
        </p>

        {selected ? (
          <p className="mt-6 rounded-2xl bg-surface p-4 text-sm text-muted-foreground">
            Booking:{" "}
            <span className="font-heading font-semibold text-foreground">
              {selected.name}
            </span>{" "}
            · {selected.durationMinutes} minutes
          </p>
        ) : null}

        <ButtonLink
          href={bookingHref(bookingUrl, selected)}
          external
          size="lg"
          className="mt-6 w-full"
        >
          Choose a Date &amp; Time
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">(opens Calendly in a new tab)</span>
        </ButtonLink>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Opens calendly.com in a new tab.
        </p>
      </section>
    </div>
  );
}
