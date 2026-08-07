"use server";

import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { Resend } from "resend";
import { api } from "@/convex/_generated/api";
import { getCountryName } from "@/lib/countries";
import {
  welcomeEmailHtml,
  welcomeEmailSubject,
  welcomeEmailText,
} from "@/lib/emails/welcome-email";
import { siteConfig } from "@/lib/site-config";
import {
  CONSENT_VERSION,
  type JoinSubmission,
  joinSchema,
  normalizePhone,
} from "@/lib/validation/join";

/**
 * Join Community submission.
 *
 * The client validates with the same zod schema for instant feedback, but this
 * re-parses from scratch — a Server Action is a public HTTP endpoint, and
 * "the form already checked it" is not a security property.
 *
 * Order of operations matters: the member is stored first, then the email is
 * attempted. If Resend has an outage we still have the signup, and the welcome
 * email can be re-sent from the record. Losing someone's details because a
 * third party had a bad afternoon would be the worse failure.
 */

export interface JoinResult {
  status: "success" | "error";
  memberId?: string;
  alreadyMember?: boolean;
  marketingConsent?: boolean;
  /** True when the record saved but the welcome email didn't send. */
  emailFailed?: boolean;
  /** Form-level message. Field errors are handled client-side by the resolver. */
  formError?: string;
}

export async function joinCommunity(
  submission: JoinSubmission,
): Promise<JoinResult> {
  // --- spam guards -------------------------------------------------------
  // A field hidden from people by CSS. Bots fill every input they find.
  // Returns success so a bot can't tell rejection from acceptance and start
  // probing for what tripped it.
  if (submission.website) {
    return { status: "success", memberId: "GFH-XXXXX", alreadyMember: false };
  }

  // --- validation --------------------------------------------------------
  const parsed = joinSchema.safeParse(submission);

  if (!parsed.success) {
    return {
      status: "error",
      formError: "Please check the highlighted fields and try again.",
    };
  }

  const input = parsed.data;
  const countryName = getCountryName(input.countryCode) ?? input.countryCode;
  const phone = normalizePhone(input.phone);

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error("[join] NEXT_PUBLIC_CONVEX_URL is not set");
    return {
      status: "error",
      formError:
        "We couldn't complete your signup just now. Please try again shortly.",
    };
  }

  // --- store -------------------------------------------------------------
  let memberId: string;
  let alreadyMember: boolean;
  let marketingConsent: boolean;

  try {
    const forwardedFor = (await headers()).get("x-forwarded-for");

    const saved = await new ConvexHttpClient(convexUrl).mutation(
      api.members.join,
      {
        fullName: input.fullName,
        email: input.email,
        countryCode: input.countryCode,
        countryName,
        phone,
        referralSource: input.referralSource,
        reason: input.reason || undefined,
        marketingConsent: input.marketingConsent,
        consentVersion: CONSENT_VERSION,
        // First hop only — the rest of the chain is client-controlled.
        submissionIp: forwardedFor?.split(",")[0]?.trim(),
      },
    );

    memberId = saved.memberId;
    alreadyMember = saved.alreadyMember;
    marketingConsent = saved.marketingConsent;
  } catch (error) {
    console.error("[join] failed to save member", error);
    return {
      status: "error",
      formError:
        "We couldn't complete your signup just now. Please try again shortly.",
    };
  }

  // --- email -------------------------------------------------------------
  // Past this point the member exists, so failure degrades rather than fails:
  // they still see their ID and the community link on screen.
  let emailFailed = false;

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !from) {
      console.warn("[join] Resend not configured — skipping welcome email");
      emailFailed = true;
    } else {
      const payload = {
        fullName: input.fullName,
        memberId,
        marketingConsent,
        alreadyMember,
        communityUrl: siteConfig.communityUrl,
      };

      const { error } = await new Resend(apiKey).emails.send({
        from,
        to: input.email,
        subject: welcomeEmailSubject(payload),
        html: welcomeEmailHtml(payload),
        text: welcomeEmailText(payload),
      });

      if (error) {
        console.error("[join] Resend rejected the message", error);
        emailFailed = true;
      } else {
        await new ConvexHttpClient(convexUrl).mutation(
          api.members.markWelcomeEmailSent,
          { memberId },
        );
      }
    }
  } catch (error) {
    console.error("[join] failed to send welcome email", error);
    emailFailed = true;
  }

  return {
    status: "success",
    memberId,
    alreadyMember,
    marketingConsent,
    emailFailed,
  };
}
