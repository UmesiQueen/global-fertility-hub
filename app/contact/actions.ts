"use server";

import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { Resend } from "resend";
import { api } from "@/convex/_generated/api";
import {
  contactAckHtml,
  contactAckSubject,
  contactAckText,
  contactNotificationSubject,
  contactNotificationText,
} from "@/lib/emails/contact-emails";
import {
  type ContactSubmission,
  contactSchema,
  optional,
} from "@/lib/validation/contact";

/**
 * Contact form submission.
 *
 * Same shape as the other two actions: store first, then email. If Resend is
 * having a bad day we still have the message, and it can be re-sent from the
 * record — losing what someone took the trouble to write would be far worse
 * than a missing acknowledgement.
 */

export interface ContactResult {
  status: "success" | "error";
  emailFailed?: boolean;
  formError?: string;
}

export async function sendContactMessage(
  submission: ContactSubmission,
): Promise<ContactResult> {
  // --- spam guards -------------------------------------------------------
  if (submission.website) {
    return { status: "success" };
  }

  if (submission.renderedAt && Date.now() - submission.renderedAt < 2000) {
    return {
      status: "error",
      formError: "That was quick — please take a moment and try again.",
    };
  }

  // --- validation --------------------------------------------------------
  const parsed = contactSchema.safeParse(submission);

  if (!parsed.success) {
    return {
      status: "error",
      formError: "Please check the highlighted fields and try again.",
    };
  }

  const input = parsed.data;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error("[contact] NEXT_PUBLIC_CONVEX_URL is not set");
    return {
      status: "error",
      formError:
        "We couldn't send your message just now. Please try again shortly.",
    };
  }

  // --- store -------------------------------------------------------------
  let messageId: string | null = null;

  try {
    const forwardedFor = (await headers()).get("x-forwarded-for");

    const saved = await new ConvexHttpClient(convexUrl).mutation(
      api.contact.send,
      {
        topic: input.topic,
        fullName: input.fullName,
        email: input.email,
        subject: optional(input.subject),
        message: input.message,
        submissionIp: forwardedFor?.split(",")[0]?.trim(),
      },
    );

    messageId = saved.id;

    // Already handled seconds ago — don't send a second acknowledgement.
    if (saved.duplicate) {
      return { status: "success" };
    }
  } catch (error) {
    console.error("[contact] failed to save message", error);
    return {
      status: "error",
      formError:
        "We couldn't send your message just now. Please try again shortly.",
    };
  }

  // --- emails ------------------------------------------------------------
  let emailFailed = false;

  const payload = {
    topic: input.topic,
    fullName: input.fullName,
    email: input.email,
    subject: optional(input.subject),
    message: input.message,
  };

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !from) {
      console.warn("[contact] Resend not configured — skipping emails");
      emailFailed = true;
    } else {
      const resend = new Resend(apiKey);

      const { error } = await resend.emails.send({
        from,
        to: input.email,
        subject: contactAckSubject(),
        html: contactAckHtml(payload),
        text: contactAckText(payload),
      });

      if (error) {
        console.error("[contact] Resend rejected the acknowledgement", error);
        emailFailed = true;
      } else if (messageId) {
        await new ConvexHttpClient(convexUrl).mutation(
          api.contact.markAcknowledgementSent,
          { id: messageId as never },
        );
      }

      // The message itself. Separate try/catch so a failure here never
      // changes what the sender sees — they've done their part.
      const notifyTo =
        process.env.CONTACT_NOTIFICATION_EMAIL ??
        process.env.BOOKINGS_NOTIFICATION_EMAIL;

      if (notifyTo) {
        try {
          await resend.emails.send({
            from,
            to: notifyTo,
            // Replying to the notification replies to the person.
            replyTo: input.email,
            subject: contactNotificationSubject(payload),
            text: contactNotificationText(payload),
          });
        } catch (error) {
          console.error("[contact] notification email failed", error);
        }
      } else {
        console.warn(
          "[contact] CONTACT_NOTIFICATION_EMAIL not set — nobody was told about this message",
        );
      }
    }
  } catch (error) {
    console.error("[contact] failed to send emails", error);
    emailFailed = true;
  }

  return { status: "success", emailFailed };
}
