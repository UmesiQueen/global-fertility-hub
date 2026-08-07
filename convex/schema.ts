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
});
