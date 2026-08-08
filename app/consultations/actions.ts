"use server";

import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { Resend } from "resend";
import { api } from "@/convex/_generated/api";
import {
  bookingNotificationSubject,
  bookingNotificationText,
  bookingRequestHtml,
  bookingRequestSubject,
  bookingRequestText,
} from "@/lib/emails/booking-emails";
import {
  getConsultationTypeById,
  isSlotAvailable,
} from "@/lib/repositories/consultations";
import {
  type BookingSubmission,
  bookingSchema,
  optional,
} from "@/lib/validation/consultation";

/**
 * Consultation booking request.
 *
 * Deliberately a *request*, not a booking. Henry & Precious confirm and
 * invoice manually, so nothing here tells the visitor they have an
 * appointment.
 *
 * Price and duration are read from the repository rather than accepted from
 * the client — a Server Action is a public endpoint, and taking a submitted
 * price would let anyone book a $200 couple session for $1.
 */

export interface BookingResult {
  status: "success" | "error";
  /** Both readings of the chosen slot, for the confirmation screen. */
  startsAt?: string;
  consultationName?: string;
  /** True when the slot went while they were filling the form in. */
  slotTaken?: boolean;
  emailFailed?: boolean;
  formError?: string;
}

export async function requestConsultation(
  submission: BookingSubmission,
): Promise<BookingResult> {
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
  const parsed = bookingSchema.safeParse(submission);

  if (!parsed.success) {
    return {
      status: "error",
      formError: "Please check the highlighted fields and try again.",
    };
  }

  const input = parsed.data;

  // Session details come from our own data, never from the request body.
  const consultation = await getConsultationTypeById(input.consultationTypeId);
  if (!consultation) {
    return {
      status: "error",
      formError: "That session type isn't available. Please choose another.",
    };
  }

  // A form left open overnight will happily submit a slot that has passed.
  if (!(await isSlotAvailable(input.startsAt))) {
    return {
      status: "error",
      slotTaken: true,
      formError:
        "That time is no longer available. Please choose another slot — we're sorry.",
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error("[consultations] NEXT_PUBLIC_CONVEX_URL is not set");
    return {
      status: "error",
      formError:
        "We couldn't send your request just now. Please try again shortly.",
    };
  }

  // --- store -------------------------------------------------------------
  let requestId: string | null = null;

  try {
    const forwardedFor = (await headers()).get("x-forwarded-for");
    const convex = new ConvexHttpClient(convexUrl);

    const saved = await convex.mutation(api.consultations.request, {
      consultationTypeId: consultation.id,
      consultationName: consultation.name,
      durationMinutes: consultation.durationMinutes,
      priceQuoted: consultation.price,
      currency: consultation.currency,
      startsAt: input.startsAt,
      requesterTimezone: optional(input.requesterTimezone),
      fullName: input.fullName,
      email: input.email,
      phone: optional(input.phone),
      memberId: optional(input.memberId),
      note: optional(input.note),
      submissionIp: forwardedFor?.split(",")[0]?.trim(),
    });

    // Someone else claimed the slot between the availability check and the
    // write. Rare, but the only place it can be caught reliably.
    if (saved.slotTaken) {
      return {
        status: "error",
        slotTaken: true,
        formError:
          "Someone just took that time. Please choose another slot — we're sorry.",
      };
    }

    requestId = saved.id;
  } catch (error) {
    console.error("[consultations] failed to save request", error);
    return {
      status: "error",
      formError:
        "We couldn't send your request just now. Please try again shortly.",
    };
  }

  // --- emails ------------------------------------------------------------
  // The request exists from here on, so email failure degrades rather than
  // fails — they still see the confirmation screen.
  let emailFailed = false;

  const payload = {
    fullName: input.fullName,
    email: input.email,
    consultationName: consultation.name,
    durationMinutes: consultation.durationMinutes,
    priceQuoted: consultation.price,
    currency: consultation.currency,
    startsAt: input.startsAt,
    requesterTimezone: optional(input.requesterTimezone),
    memberId: optional(input.memberId),
    phone: optional(input.phone),
    note: optional(input.note),
  };

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !from) {
      console.warn("[consultations] Resend not configured — skipping emails");
      emailFailed = true;
    } else {
      const resend = new Resend(apiKey);

      const { error } = await resend.emails.send({
        from,
        to: input.email,
        replyTo: process.env.BOOKINGS_NOTIFICATION_EMAIL,
        subject: bookingRequestSubject(),
        html: bookingRequestHtml(payload),
        text: bookingRequestText(payload),
      });

      if (error) {
        console.error("[consultations] Resend rejected the message", error);
        emailFailed = true;
      } else if (requestId) {
        await new ConvexHttpClient(convexUrl).mutation(
          api.consultations.markConfirmationEmailSent,
          { id: requestId as never },
        );
      }

      // Henry & Precious need to know a request came in. Separate try/catch
      // so a failure here never affects what the visitor sees.
      const notifyTo = process.env.BOOKINGS_NOTIFICATION_EMAIL;
      if (notifyTo) {
        try {
          await resend.emails.send({
            from,
            to: notifyTo,
            replyTo: input.email,
            subject: bookingNotificationSubject(payload),
            text: bookingNotificationText(payload),
          });
        } catch (error) {
          console.error("[consultations] notification email failed", error);
        }
      } else {
        console.warn(
          "[consultations] BOOKINGS_NOTIFICATION_EMAIL not set — nobody was told about this request",
        );
      }
    }
  } catch (error) {
    console.error("[consultations] failed to send emails", error);
    emailFailed = true;
  }

  return {
    status: "success",
    startsAt: input.startsAt,
    consultationName: consultation.name,
    emailFailed,
  };
}
