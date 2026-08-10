import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Contact form messages.
 *
 * Every row here contains free text someone wrote about a difficult subject.
 * There is no public query that returns message bodies, and there shouldn't be.
 */

/** Ignore repeat submissions of the same message within this window. */
const DUPLICATE_WINDOW_MS = 60_000;

export const send = mutation({
  args: {
    topic: v.string(),
    fullName: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
    submissionIp: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const message = args.message.trim();
    const now = Date.now();

    // A double-click or a browser retry shouldn't create two identical
    // messages for Henry & Precious to answer twice.
    const recent = await ctx.db
      .query("contactMessages")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    const duplicate = recent.find(
      (row) =>
        row.message === message && now - row.createdAt < DUPLICATE_WINDOW_MS,
    );

    if (duplicate) {
      return { id: duplicate._id, duplicate: true };
    }

    const id = await ctx.db.insert("contactMessages", {
      topic: args.topic,
      fullName: args.fullName.trim(),
      email,
      subject: args.subject?.trim() || undefined,
      message,
      status: "new",
      createdAt: now,
      submissionIp: args.submissionIp,
    });

    return { id, duplicate: false };
  },
});

export const markAcknowledgementSent = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { acknowledgementSentAt: Date.now() });
  },
});

/**
 * ADMIN ONLY — not yet authenticated.
 *
 * Returns message bodies. Must go behind Convex auth before it is called from
 * anywhere but a trusted server context.
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("contactMessages")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 100);

    return args.status
      ? rows.filter((row) => row.status === args.status)
      : rows;
  },
});

/**
 * Counts only — no names, no bodies. Safe for a dashboard summary tile.
 */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("contactMessages").collect();

    const byTopic: Record<string, number> = {};
    for (const row of rows) {
      byTopic[row.topic] = (byTopic[row.topic] ?? 0) + 1;
    }

    return {
      total: rows.length,
      unanswered: rows.filter(
        (row) => row.status === "new" || row.status === "read",
      ).length,
      byTopic,
    };
  },
});
