// From libphonenumber-js, NOT react-phone-number-input.
//
// This module is imported by the Server Action, so it gets evaluated in the
// React Server Components graph. Under the `react-server` export condition,
// React exposes a reduced surface with no `React.Component` — and
// react-phone-number-input ships class components. `class X extends undefined`
// is what produces "Super expression must either be null or a function".
//
// libphonenumber-js is the pure-JS engine underneath it: same validation,
// no React, safe on both sides of the boundary.
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { isValidCountryCode } from "@/lib/countries";

/**
 * Join form schema — the single source of truth for both sides.
 *
 * The client uses it through `zodResolver` for instant feedback; the Server
 * Action re-parses the same schema before anything touches the database.
 * One schema means client and server can't drift, and the server never trusts
 * the client's word that validation passed.
 */

/**
 * Bump when the consent wording changes.
 *
 * Stored against every consenting member so a record of "they agreed" is
 * always tied to what they actually read. Without it, editing the copy
 * quietly changes the meaning of every prior consent.
 */
export const CONSENT_VERSION = "2026-08-06.v1";

export const CONSENT_WORDING =
  "Yes, add me to the mailing list for updates, story times and exclusive partner discounts.";

export const REFERRAL_SOURCES = [
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "Google or web search",
  "A friend or family member",
  "A fertility clinic",
  "A podcast",
  "An event or webinar",
  "Somewhere else",
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

/**
 * Pragmatic email check.
 *
 * Deliberately not RFC 5322 — the full grammar accepts addresses no provider
 * will deliver to, and rejecting a valid-but-unusual address is worse than
 * accepting a typo we find out about on bounce.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export const joinSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please tell us your name.")
      .max(100, "Please use 100 characters or fewer."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "We need an email address to send your confirmation.")
      .max(254, "That email address is too long.")
      .regex(EMAIL_PATTERN, "That doesn't look like a valid email address."),

    countryCode: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, "Please choose your country.")
      .refine(isValidCountryCode, "Please choose a country from the list."),

    /**
     * A single E.164 string from `react-phone-number-input`, e.g.
     * "+447700900123" — the component owns the country/number split, so what
     * reaches us is already unambiguous.
     *
     * Validated with libphonenumber's real rules rather than a digit count:
     * it knows that +44 7700 900123 is a valid UK mobile and +44 1 is not,
     * which no regex we'd write is going to get right for 190 countries.
     */
    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (value) => !value || isValidPhoneNumber(value),
        "Please enter a valid phone number.",
      ),

    referralSource: z
      .string()
      .min(1, "Please let us know how you found us.")
      .refine(
        (value) => REFERRAL_SOURCES.includes(value as ReferralSource),
        "Please choose an option from the list.",
      ),

    reason: z
      .string()
      .trim()
      .max(1000, "Please keep this under 1000 characters.")
      .optional()
      .or(z.literal("")),

    marketingConsent: z.boolean(),
  });

export type JoinInput = z.infer<typeof joinSchema>;

/** Fields the form owns but the schema shouldn't validate as user content. */
export interface JoinSubmission extends JoinInput {
  /** Honeypot — must be empty. */
  website?: string;
}

/** Normalises the optional phone field to `undefined` rather than "". */
export function normalizePhone(phone?: string): string | undefined {
  const trimmed = phone?.trim();
  return trimmed ? trimmed : undefined;
}
