import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Consultation booking requests.
 *
 * These are requests, never confirmations. Henry & Precious review each one,
 * confirm and invoice manually — nothing here should tell someone their
 * appointment is booked.
 */

export const request = mutation({
  args: {
    consultationTypeId: v.string(),
    consultationName: v.string(),
    durationMinutes: v.number(),
    priceQuoted: v.number(),
    currency: v.string(),
    startsAt: v.string(),
    requesterTimezone: v.optional(v.string()),
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    memberId: v.optional(v.string()),
    note: v.optional(v.string()),
    submissionIp: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    // Two people can open the page at once and pick the same slot. The
    // availability check in the action can't see pending requests, so the
    // only reliable guard is here, at write time.
    const existing = await ctx.db
      .query("consultationRequests")
      .withIndex("by_startsAt", (q) => q.eq("startsAt", args.startsAt))
      .collect();

    const taken = existing.find(
      (item) => item.status === "requested" || item.status === "confirmed",
    );

    if (taken) {
      // Someone re-submitting their own request gets it back rather than an
      // error — a double-click shouldn't look like a failure.
      if (taken.email === email) {
        return { id: taken._id, slotTaken: false, duplicate: true };
      }
      return { id: null, slotTaken: true, duplicate: false };
    }

    // A member quoting their ID gets it verified rather than trusted, so a
    // typo doesn't attach the booking to someone else's record.
    let memberId: string | undefined;
    if (args.memberId) {
      const normalised = args.memberId.trim().toUpperCase();
      const member = await ctx.db
        .query("members")
        .withIndex("by_memberId", (q) => q.eq("memberId", normalised))
        .unique();
      if (member) memberId = member.memberId;
    }

    const id = await ctx.db.insert("consultationRequests", {
      consultationTypeId: args.consultationTypeId,
      consultationName: args.consultationName,
      durationMinutes: args.durationMinutes,
      priceQuoted: args.priceQuoted,
      currency: args.currency,
      startsAt: args.startsAt,
      requesterTimezone: args.requesterTimezone,
      fullName: args.fullName.trim(),
      email,
      phone: args.phone?.trim() || undefined,
      memberId,
      note: args.note?.trim() || undefined,
      status: "requested",
      createdAt: Date.now(),
      submissionIp: args.submissionIp,
    });

    return { id, slotTaken: false, duplicate: false };
  },
});

export const markConfirmationEmailSent = mutation({
  args: { id: v.id("consultationRequests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { confirmationEmailSentAt: Date.now() });
  },
});

/** Slots already spoken for, so the UI can grey them out. Returns no PII. */
export const takenSlots = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("consultationRequests").collect();
    return rows
      .filter((row) => row.status === "requested" || row.status === "confirmed")
      .map((row) => row.startsAt);
  },
});

/**
 * ADMIN ONLY — not yet authenticated.
 *
 * Returns personal data including free-text notes. Must go behind Convex auth
 * before it is called from anywhere but a trusted server context.
 */
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultationRequests")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 100);
  },
});
