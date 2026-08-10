import { z } from "zod";

/**
 * Contact form schema — shared by the client resolver and the Server Action.
 *
 * No React imports: this module is reachable from `"use server"` code.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * Why someone is writing.
 *
 * Five different CTAs across the site point at this page — "Share Your Story",
 * "Request a Topic", "Send a Message" from consultations, and the footer. The
 * topic is prefilled from a query param so people don't have to restate what
 * they just clicked, and so Henry & Precious can triage at a glance.
 */
export const CONTACT_TOPICS = [
  { value: "general", label: "General enquiry" },
  { value: "story", label: "I'd like to share my story" },
  { value: "resource", label: "Suggest a resource or topic" },
  { value: "consultation", label: "Question about consultations" },
  { value: "partnership", label: "Clinic or brand partnership" },
  { value: "media", label: "Media or speaking request" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export const CONTACT_TOPIC_VALUES = CONTACT_TOPICS.map(
  (topic) => topic.value,
) as string[];

export function topicLabel(value: string): string {
  return (
    CONTACT_TOPICS.find((topic) => topic.value === value)?.label ??
    "General enquiry"
  );
}

/** Falls back to "general" for a missing or unrecognised query param. */
export function normaliseTopic(value?: string | null): ContactTopic {
  return CONTACT_TOPIC_VALUES.includes(value ?? "")
    ? (value as ContactTopic)
    : "general";
}

export const contactSchema = z.object({
  topic: z
    .string()
    .min(1, "Please choose what your message is about.")
    .refine(
      (value) => CONTACT_TOPIC_VALUES.includes(value),
      "Please choose an option from the list.",
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
    .min(1, "We need an email address to reply to you.")
    .max(254, "That email address is too long.")
    .regex(EMAIL_PATTERN, "That doesn't look like a valid email address."),

  subject: z
    .string()
    .trim()
    .max(150, "Please keep the subject under 150 characters.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more so we can help.")
    .max(4000, "Please keep your message under 4000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export interface ContactSubmission extends ContactInput {
  /** Honeypot — must be empty. */
  website?: string;
  renderedAt?: number;
}

/** Normalises an optional string field to `undefined` rather than "". */
export function optional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
