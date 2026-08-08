"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  type BookingResult,
  requestConsultation,
} from "@/app/consultations/actions";
import { AvailabilityCalendar } from "@/components/forms/availability-calendar";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  formatDateInZone,
  formatTimeInZone,
  formatTimeWithZone,
  getLocalTimezone,
  isSameWallClock,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  type BookingInput,
  bookingSchema,
} from "@/lib/validation/consultation";
import type { AvailabilitySlot, ConsultationType } from "@/types";

const AUDIENCE_ICONS = {
  "one-on-one": Users,
  couple: Users,
  "follow-up": MessageCircle,
} as const;

/**
 * Consultation booking.
 *
 * Two steps on one page: pick a session and a slot, then give your details.
 * Splitting them keeps the first screen close to the mockup and means nobody
 * fills in six fields before discovering their preferred time has gone.
 *
 * Nothing here is a confirmed booking. The copy says "request" throughout,
 * because Henry & Precious confirm each one by hand.
 */
export function ConsultationBookingForm({
  consultationTypes,
  availability,
  practitionerTimezone,
}: {
  consultationTypes: ConsultationType[];
  availability: AvailabilitySlot[];
  practitionerTimezone: string;
}) {
  const [step, setStep] = useState<"choose" | "details">("choose");
  const [result, setResult] = useState<BookingResult | null>(null);
  const [renderedAt] = useState(() => Date.now());
  const formErrorRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  /**
   * Resolved after mount, never during render — the server's timezone is
   * meaningless to the reader, and using it would produce different markup
   * on the server and the client.
   */
  const [localTimezone, setLocalTimezone] = useState<string | null>(null);
  useEffect(() => setLocalTimezone(getLocalTimezone()), []);

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    availability[0]?.date,
  );

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: {
      consultationTypeId: consultationTypes[0]?.id ?? "",
      startsAt: "",
      fullName: "",
      email: "",
      phone: "",
      memberId: "",
      note: "",
      requesterTimezone: "",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;

  const selectedTypeId = watch("consultationTypeId");
  const selectedStart = watch("startsAt");

  const slotsForDay = useMemo(
    () => availability.find((day) => day.date === selectedDate)?.starts ?? [],
    [availability, selectedDate],
  );

  useEffect(() => {
    if (localTimezone) setValue("requesterTimezone", localTimezone);
  }, [localTimezone, setValue]);

  useEffect(() => {
    if (result?.status === "error") formErrorRef.current?.focus();
  }, [result]);

  // A slot that vanished under them puts them back on the picker, where the
  // fix is — rather than leaving them on a details form they can't submit.
  useEffect(() => {
    if (result?.slotTaken) {
      setStep("choose");
      setValue("startsAt", "");
    }
  }, [result, setValue]);

  async function onSubmit(values: BookingInput) {
    setResult(await requestConsultation({ ...values, renderedAt }));
  }

  if (result?.status === "success") {
    return (
      <BookingSuccess
        result={result}
        practitionerTimezone={practitionerTimezone}
        localTimezone={localTimezone}
      />
    );
  }

  const showLocalTime =
    localTimezone && localTimezone !== practitionerTimezone;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {result?.formError ? (
        <div
          ref={formErrorRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 flex gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {result.formError}
        </div>
      ) : null}

      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="booking-website">Leave this field empty</label>
        <input
          id="booking-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div
        className={cn(
          "grid gap-8 lg:grid-cols-2 lg:gap-10",
          step === "details" && "hidden",
        )}
      >
        {/* ---------------------------------------------- session picker */}
        <section aria-labelledby="choose-session">
          <h2
            id="choose-session"
            className="font-heading text-base font-semibold text-foreground"
          >
            Choose Your Session
          </h2>

          <Controller
            name="consultationTypeId"
            control={control}
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-labelledby="choose-session"
                className="mt-4 flex flex-col gap-3"
              >
                {consultationTypes.map((type) => {
                  const Icon = AUDIENCE_ICONS[type.audience];
                  const checked = field.value === type.id;

                  return (
                    <label
                      key={type.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors",
                        checked
                          ? "border-primary bg-accent/40"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={type.id}
                        checked={checked}
                        onChange={() => field.onChange(type.id)}
                        className="mt-1 size-4 shrink-0 accent-primary"
                      />

                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                      >
                        <Icon className="size-4.5" />
                      </span>

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
                          <span className="font-heading text-sm font-semibold text-primary">
                            {type.currency} ${type.price}
                          </span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          />

          <p className="mt-4 flex gap-2.5 rounded-xl bg-surface p-3.5 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            This is not medical advice. We don&apos;t diagnose or treat. Our
            sessions are focused on support and advocacy.
          </p>
        </section>

        {/* ------------------------------------------------ date + time */}
        <section aria-labelledby="choose-time">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="choose-time"
              className="font-heading text-base font-semibold text-foreground"
            >
              Select Date &amp; Time
            </h2>
            <p className="text-xs text-muted-foreground">
              Times shown in {practitionerTimezone.split("/")[1]?.replace("_", " ")} time
            </p>
          </div>

          <AvailabilityCalendar
            className="mt-4"
            availability={availability}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              // The old slot belongs to a different day.
              setValue("startsAt", "", { shouldValidate: false });
            }}
          />

          <Controller
            name="startsAt"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="mt-6" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slot-group">Available Times</FieldLabel>

                <div
                  id="slot-group"
                  role="radiogroup"
                  aria-label="Available times"
                  className="flex flex-wrap gap-2"
                >
                  {slotsForDay.length ? (
                    slotsForDay.map((start) => {
                      const checked = field.value === start;
                      const differs =
                        showLocalTime &&
                        !isSameWallClock(
                          start,
                          practitionerTimezone,
                          localTimezone,
                        );

                      return (
                        <button
                          key={start}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          onClick={() => field.onChange(start)}
                          className={cn(
                            "flex min-h-11 flex-col items-center justify-center rounded-xl border px-3.5 py-1.5 transition-colors",
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:border-primary/40",
                          )}
                        >
                          <span className="text-sm font-medium">
                            {formatTimeInZone(start, practitionerTimezone)}
                          </span>
                          {/* Their own clock, so nobody books 2am by mistake. */}
                          {differs ? (
                            <span
                              className={cn(
                                "text-[0.625rem]",
                                checked
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground",
                              )}
                            >
                              {formatTimeInZone(start, localTimezone)} your time
                            </span>
                          ) : null}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No times left on this day — please choose another date.
                    </p>
                  )}
                </div>

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button
            type="button"
            size="lg"
            className="mt-6 w-full"
            disabled={!selectedStart || !selectedTypeId}
            onClick={() => {
              setStep("details");
              // Move focus so the change of step is announced, not just seen.
              requestAnimationFrame(() => detailsRef.current?.focus());
            }}
          >
            Continue to Booking
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            You&apos;ll confirm your details on the next step.
          </p>
        </section>
      </div>

      {/* --------------------------------------------------- your details */}
      <div
        ref={detailsRef}
        tabIndex={-1}
        className={cn("outline-none", step === "choose" && "hidden")}
      >
        <button
          type="button"
          onClick={() => setStep("choose")}
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Change session or time
        </button>

        {selectedStart ? (
          <div className="mt-4 rounded-2xl bg-surface p-4">
            <p className="font-heading text-sm font-semibold text-foreground">
              {
                consultationTypes.find((type) => type.id === selectedTypeId)
                  ?.name
              }
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDateInZone(selectedStart, practitionerTimezone)} ·{" "}
              {formatTimeWithZone(selectedStart, practitionerTimezone)}
            </p>
            {showLocalTime &&
            !isSameWallClock(
              selectedStart,
              practitionerTimezone,
              localTimezone,
            ) ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                That&apos;s {formatDateInZone(selectedStart, localTimezone)} at{" "}
                {formatTimeWithZone(selectedStart, localTimezone)} where you are.
              </p>
            ) : null}
          </div>
        ) : null}

        <FieldGroup className="mt-6">
          <Controller
            name="fullName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-name">Full name</FieldLabel>
                <Input
                  {...field}
                  id="booking-name"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-email">Email address</FieldLabel>
                <Input
                  {...field}
                  id="booking-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  We&apos;ll confirm your session here.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-phone">
                  Phone{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <PhoneInput
                  id="booking-phone"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="memberId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-member">
                  Member ID{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  {...field}
                  id="booking-member"
                  placeholder="GFH-7K2M9"
                  autoComplete="off"
                  className="uppercase"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  If you&apos;ve joined the community, quoting your ID helps us
                  find you.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="note"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-note">
                  Anything you&apos;d like us to know?{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id="booking-note"
                  rows={4}
                  maxLength={1000}
                  placeholder="Share as much or as little as you like. It just helps us prepare."
                  aria-invalid={fieldState.invalid}
                  className="min-h-24 resize-y"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Sending your request…
              </>
            ) : (
              <>
                Request This Session
                <ArrowRight aria-hidden="true" className="size-4" />
              </>
            )}
          </Button>

          <FieldDescription>
            This sends a request — we&apos;ll confirm the time and arrange
            payment by email before anything is booked.
          </FieldDescription>
        </FieldGroup>
      </div>
    </form>
  );
}

function BookingSuccess({
  result,
  practitionerTimezone,
  localTimezone,
}: {
  result: BookingResult;
  practitionerTimezone: string;
  localTimezone: string | null;
}) {
  const showLocal =
    result.startsAt &&
    localTimezone &&
    localTimezone !== practitionerTimezone &&
    !isSameWallClock(result.startsAt, practitionerTimezone, localTimezone);

  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/12 text-success"
      >
        <Check className="size-7" />
      </span>

      <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
        We&apos;ve got your request
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Thank you for reaching out. We&apos;ll be in touch by email shortly to
        confirm the time and arrange payment.
      </p>

      {result.startsAt ? (
        <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-surface p-5">
          <p className="font-heading text-sm font-semibold text-foreground">
            {result.consultationName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateInZone(result.startsAt, practitionerTimezone)} ·{" "}
            {formatTimeWithZone(result.startsAt, practitionerTimezone)}
          </p>
          {showLocal && localTimezone ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {formatTimeWithZone(result.startsAt, localTimezone)} your time
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Stated plainly, because an unconfirmed slot that reads as booked is
          the worst possible outcome on this page. */}
      <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-muted-foreground">
        Nothing is confirmed yet — we&apos;ll email you before your session is
        locked in.
        {result.emailFailed
          ? " We couldn't send your confirmation email just now, but your request has reached us."
          : ""}
      </p>
    </div>
  );
}
