"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Check, Copy, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { Country as PhoneCountry } from "react-phone-number-input";
import Link from "next/link";
import { joinCommunity, type JoinResult } from "@/app/join/actions";
import { InstagramIcon } from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Country, getCountryName } from "@/lib/countries";
import { siteConfig } from "@/lib/site-config";
import {
  CONSENT_WORDING,
  type JoinInput,
  joinSchema,
  REFERRAL_SOURCES,
} from "@/lib/validation/join";

export function JoinCommunityForm({ countries }: { countries: Country[] }) {
  const [result, setResult] = useState<JoinResult | null>(null);
  const formErrorRef = useRef<HTMLDivElement>(null);

  const form = useForm<JoinInput>({
    resolver: zodResolver(joinSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "",
      phone: "",
      referralSource: "",
      reason: "",
      marketingConsent: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const countryCode = useWatch({ control, name: "countryCode" });

  useEffect(() => {
    if (result?.status === "error") formErrorRef.current?.focus();
  }, [result]);

  async function onSubmit(values: JoinInput) {
    const response = await joinCommunity(values);
    setResult(response);
  }

  if (result?.status === "success") {
    return <JoinSuccess result={result} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {result?.formError ? (
          <div
            ref={formErrorRef}
            tabIndex={-1}
            role="alert"
            className="flex gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            {result.formError}
          </div>
        ) : null}

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="join-website">Leave this field empty</label>
          <input
            id="join-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel
                htmlFor="join-fullName"
                className="after:content-['*'] after:text-destructive"
              >
                Full name
              </FieldLabel>
              <Input
                {...field}
                id="join-fullName"
                autoComplete="name"
                placeholder="Sarah Whitfield"
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
            <Field>
              <FieldLabel
                htmlFor="join-email"
                className="after:content-['*'] after:text-destructive"
              >
                Email address
              </FieldLabel>
              <Input
                {...field}
                id="join-email"
                type="email"
                autoComplete="email"
                placeholder="sarah@example.com"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                We&apos;ll send your member ID and the community link here.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="countryCode"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel
                htmlFor="join-country"
                className="after:content-['*'] after:text-destructive"
              >
                Country
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value || null}
                onValueChange={(code: string | null) =>
                  field.onChange(code ?? "")
                }
              >
                <SelectTrigger
                  id="join-country"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue>
                    {(code: string | null) =>
                      code
                        ? (getCountryName(code) ?? code)
                        : "Select your country"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="join-phone">
                Phone{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>

              <PhoneInput
                id="join-phone"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={fieldState.invalid}
                defaultCountry={(countryCode || "AU") as PhoneCountry}
              />

              <FieldDescription>
                Only if you&apos;d like us to be able to reach you.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="referralSource"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel
                htmlFor="join-referral"
                className="after:content-['*'] after:text-destructive"
              >
                Where did you hear about Henry &amp; Precious?
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="join-referral"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  {REFERRAL_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="reason"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="join-reason">
                What brings you here?{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <div className="relative">
                <Textarea
                  {...field}
                  id="join-reason"
                  rows={4}
                  maxLength={1000}
                  placeholder="Share as much or as little as you like — this is just for us."
                  aria-invalid={fieldState.invalid}
                  className="min-h-24 resize-y no-scrollbar"
                />
                <span className="absolute bottom-1 right-2 z-2 text-xs text-primary/70">
                  {field.value?.length}/1000
                </span>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="marketingConsent"
          control={control}
          render={({ field }) => (
            <div className="rounded-xl bg-surface p-4">
              <Field orientation="horizontal">
                <Checkbox
                  id="join-consent"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
                <FieldLabel
                  htmlFor="join-consent"
                  className="font-normal text-muted-foreground"
                >
                  {CONSENT_WORDING}
                </FieldLabel>
              </Field>
              <FieldDescription className="mt-2.5 pl-7">
                Entirely optional — you can join the community either way, and
                you can unsubscribe at any time.
              </FieldDescription>
            </div>
          )}
        />

        <FieldDescription>
          We&apos;ll keep your details private and never share them with clinics
          or partners. See our{" "}
          <Link
            href="/privacy"
            className="text-primary underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </FieldDescription>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Joining…
            </>
          ) : (
            <>
              Join the Community
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

function JoinSuccess({ result }: { result: JoinResult }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/12 text-success"
      >
        <Check className="size-7" />
      </span>

      <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
        {result.alreadyMember
          ? "You're already with us"
          : "Welcome to the community"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {result.alreadyMember
          ? "It looks like you'd already joined — so here's your member ID again, and the link to our Instagram community."
          : "We're really glad you're here. Here's your member ID — keep it somewhere safe."}
      </p>

      <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-surface p-5">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          Your member ID
        </p>
        <p className="mt-1.5 font-heading text-2xl font-bold tracking-wider text-primary">
          {result.memberId}
        </p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(result.memberId ?? "");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-primary hover:underline"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Member ID copied to clipboard" : ""}
        </span>
      </div>

      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
        Quote it if you ever book a consultation or use one of our services.
      </p>

      <a
        href={siteConfig.communityUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-4xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <InstagramIcon className="size-4" />
        Join our Instagram community
      </a>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {result.emailFailed
          ? "We couldn't send your confirmation email just now — but your place is saved. Screenshot your member ID and you're all set."
          : "We've emailed your member ID and this link, in case you need them later."}
      </p>
    </div>
  );
}
