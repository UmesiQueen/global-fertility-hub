import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema.
 *
 * PRIVACY NOTE — read before adding fields.
 *
 * Everyone in this table has self-identified as being on a fertility journey.
 * Under GDPR that is close to, and arguably is, health data by inference: the
 * fact of membership reveals something sensitive even though we never ask a
 * medical question. Treat it accordingly.
 *
 *   - Collect the minimum. Every new field needs a reason.
 *   - Never expose a member record through a public query.
 *   - `marketingConsent` records a decision at a moment in time, with the
 *     timestamp and the wording version, because "we have consent" is a claim
 *     you may one day have to evidence.
 */
export default defineSchema({
  members: defineTable({
    memberId: v.string(),
    fullName: v.string(),
    email: v.string(),
    countryCode: v.string(),
    countryName: v.string(),
    phone: v.optional(v.string()),
    referralSource: v.string(),
    reason: v.optional(v.string()),
    marketingConsent: v.boolean(),
    consentedAt: v.optional(v.number()),
    /** Which wording they agreed to, so the record stays meaningful when copy changes. */
    consentVersion: v.optional(v.string()),

    createdAt: v.number(),
    /** Set once the welcome email is accepted by the provider. */
    welcomeEmailSentAt: v.optional(v.number()),
    /** Retained for abuse investigation only; safe to purge on a schedule. */
    submissionIp: v.optional(v.string()),
  })
    // Enforces one membership per email and powers the duplicate check.
    .index("by_email", ["email"])
    .index("by_memberId", ["memberId"])
    // For the future admin dashboard: recent signups, and acquisition mix.
    .index("by_createdAt", ["createdAt"])
    .index("by_referralSource", ["referralSource"]),

  /**
   * Consultation booking requests.
   *
   * A request, not a confirmed booking — Henry & Precious confirm and invoice
   * manually. `status` tracks that, so the table never implies someone has a
   * confirmed appointment they don't have.
   *
   * Same privacy posture as `members`: everyone here has self-identified as
   * being on a fertility journey, and `note` is free text where people will
   * describe genuinely sensitive things. Never expose these through a public
   * query, and never put `note` in an analytics view.
   */
  consultationRequests: defineTable({
    /** Which session was chosen, e.g. "con-one-on-one". */
    consultationTypeId: v.string(),
    consultationName: v.string(),
    durationMinutes: v.number(),
    priceQuoted: v.number(),
    currency: v.string(),

    /** Absolute instant of the requested slot, e.g. "2026-08-16T09:00:00+08:00". */
    startsAt: v.string(),
    /** The visitor's zone at the time of booking, for writing to them clearly. */
    requesterTimezone: v.optional(v.string()),

    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    /** Links back to a community member if they quoted their ID. */
    memberId: v.optional(v.string()),
    /** Free text. Treat as sensitive. */
    note: v.optional(v.string()),

    status: v.union(
      v.literal("requested"),
      v.literal("confirmed"),
      v.literal("declined"),
      v.literal("cancelled"),
    ),

    createdAt: v.number(),
    confirmationEmailSentAt: v.optional(v.number()),
    submissionIp: v.optional(v.string()),
  })
    // Guards against two people requesting the same slot.
    .index("by_startsAt", ["startsAt"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_memberId", ["memberId"]),
});
