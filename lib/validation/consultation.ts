import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

/**
 * Booking request schema — shared by the client resolver and the Server
 * Action, so the rules can't drift.
 *
 * Imported from a `"use server"` file, so it must stay free of React. That's
 * why phone validation comes from libphonenumber-js rather than
 * react-phone-number-input.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Matches the format issued at signup, e.g. GFH-7K2M9. */
const MEMBER_ID_PATTERN = /^GFH-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{5}$/;

export const bookingSchema = z.object({
  consultationTypeId: z.string().min(1, "Please choose a session."),

  /** Absolute instant of the chosen slot. */
  startsAt: z
    .string()
    .min(1, "Please choose a date and time.")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "That time slot isn't valid — please pick another.",
    ),

  fullName: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(100, "Please use 100 characters or fewer."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "We need an email address to confirm your session.")
    .max(254, "That email address is too long.")
    .regex(EMAIL_PATTERN, "That doesn't look like a valid email address."),

  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || isValidPhoneNumber(value),
      "Please check the phone number, or leave it blank.",
    ),

  /**
   * Optional. Case-insensitive because nobody types it back exactly as sent,
   * and rejecting "gfh-7k2m9" would be needlessly strict.
   */
  memberId: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || MEMBER_ID_PATTERN.test(value),
      "That doesn't look like a member ID. It looks like GFH-7K2M9.",
    ),

  note: z
    .string()
    .trim()
    .max(1000, "Please keep this under 1000 characters.")
    .optional()
    .or(z.literal("")),

  /** IANA zone captured client-side, so we can write to them in their time. */
  requesterTimezone: z.string().trim().max(64).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export interface BookingSubmission extends BookingInput {
  /** Honeypot — must be empty. */
  website?: string;
  renderedAt?: number;
}

/** Normalises an optional string field to `undefined` rather than "". */
export function optional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
