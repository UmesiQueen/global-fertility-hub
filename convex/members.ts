import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Member functions.
 *
 * Everything that touches personal data lives here. Note there is no public
 * query that returns member rows — `list` and `stats` are for the future admin
 * dashboard and must be put behind authentication before they are called from
 * anywhere but a trusted server context.
 */

const MEMBER_ID_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Generates a short, readable identifier.
 *
 * The alphabet omits 0/O/1/I/L/U — characters people misread when quoting a
 * code over the phone or typing it from an email. Random rather than
 * sequential so it doesn't disclose how many members exist.
 */
function generateMemberId(): string {
  let code = "";
  for (let index = 0; index < 5; index += 1) {
    code += MEMBER_ID_ALPHABET.charAt(
      Math.floor(Math.random() * MEMBER_ID_ALPHABET.length),
    );
  }
  return `GFH-${code}`;
}

export const join = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    countryCode: v.string(),
    countryName: v.string(),
    phone: v.optional(v.string()),
    referralSource: v.string(),
    reason: v.optional(v.string()),
    marketingConsent: v.boolean(),
    consentVersion: v.string(),
    submissionIp: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    // Re-submitting returns the existing member rather than erroring or
    // creating a duplicate. Someone who signs up twice has forgotten they
    // joined — the useful response is to remind them of their ID, not to
    // scold them.
    const existing = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      // Consent can be granted on a later attempt, but never silently revoked.
      if (args.marketingConsent && !existing.marketingConsent) {
        await ctx.db.patch(existing._id, {
          marketingConsent: true,
          consentedAt: Date.now(),
          consentVersion: args.consentVersion,
        });
      }

      return {
        memberId: existing.memberId,
        alreadyMember: true,
        marketingConsent: existing.marketingConsent || args.marketingConsent,
      };
    }

    // Retry on the astronomically unlikely collision rather than trusting
    // randomness — the index makes the check cheap.
    let memberId = generateMemberId();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const clash = await ctx.db
        .query("members")
        .withIndex("by_memberId", (q) => q.eq("memberId", memberId))
        .unique();
      if (!clash) break;
      memberId = generateMemberId();
    }

    const now = Date.now();

    await ctx.db.insert("members", {
      memberId,
      fullName: args.fullName.trim(),
      email,
      countryCode: args.countryCode,
      countryName: args.countryName,
      phone: args.phone?.trim() || undefined,
      referralSource: args.referralSource,
      reason: args.reason?.trim() || undefined,
      marketingConsent: args.marketingConsent,
      consentedAt: args.marketingConsent ? now : undefined,
      consentVersion: args.marketingConsent ? args.consentVersion : undefined,
      createdAt: now,
      submissionIp: args.submissionIp,
    });

    return { memberId, alreadyMember: false, marketingConsent: args.marketingConsent };
  },
});

/** Records that the welcome email was accepted by the provider. */
export const markWelcomeEmailSent = mutation({
  args: { memberId: v.string() },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("members")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .unique();

    if (member) {
      await ctx.db.patch(member._id, { welcomeEmailSentAt: Date.now() });
    }
  },
});

/**
 * ADMIN ONLY — not yet authenticated.
 *
 * Returns personal data and must not be called from a client component or an
 * unauthenticated route. Gate this behind Convex auth before the admin
 * dashboard ships.
 */
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 100);
  },
});

/**
 * Aggregate counts for the future dashboard.
 *
 * Returns no personal data, so it is safe to expose more widely than `list`.
 */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();

    const byReferral: Record<string, number> = {};
    const byCountry: Record<string, number> = {};

    for (const member of members) {
      byReferral[member.referralSource] =
        (byReferral[member.referralSource] ?? 0) + 1;
      byCountry[member.countryName] = (byCountry[member.countryName] ?? 0) + 1;
    }

    return {
      total: members.length,
      subscribedToMailingList: members.filter((m) => m.marketingConsent).length,
      byReferral,
      byCountry,
    };
  },
});
