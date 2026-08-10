import { CalendarDays, Heart, Mail, MessageCircle, Users } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { ScriptAccent } from "@/components/shared/script-accent";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/shared/social-icons";
import { breadcrumbJsonLd, organisationJsonLd } from "@/lib/seo";
import { siteConfig, socialLinks } from "@/lib/site-config";
import type { RawSearchParams } from "@/lib/search-params";
import { readParam } from "@/lib/search-params";
import { normaliseTopic } from "@/lib/validation/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Henry and Precious. Share your story, suggest a topic, ask about consultations, or just say hello.",
  alternates: { canonical: "/contact" },
};

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
};

/** Routes people to a better destination than a general enquiry. */
const SHORTCUTS = [
  {
    icon: Users,
    title: "Want to join the community?",
    description: "You don't need to message us — you can join right now.",
    href: "/join",
    label: "Join the Community",
  },
  {
    icon: CalendarDays,
    title: "Ready to book a session?",
    description:
      "Choose a time with Henry & Precious rather than waiting on a reply.",
    href: "/consultations",
    label: "Book a Session",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  // Prefilled from the CTA they clicked, e.g. /contact?topic=story.
  const defaultTopic = normaliseTopic(readParam(params, "topic"));

  return (
    <>
      <JsonLd data={[organisationJsonLd(), breadcrumbJsonLd(CRUMBS)]} />

      <PageHero
        title="Get in Touch"
        scriptLine={
          <ScriptAccent>We&apos;d love to hear from you.</ScriptAccent>
        }
        description="Whether you want to share your story, suggest a topic, ask about a session or just say hello — we read every message."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_19rem] lg:gap-16">
          <div className="max-w-2xl">
            <ContactForm defaultTopic={defaultTopic} />
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-heading text-sm font-semibold text-foreground">
                If you need help urgently
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                We&apos;re an educational platform, not a clinic, and we
                can&apos;t help with anything medical or urgent. If something is
                wrong with your health right now, please contact your doctor or
                your local emergency service.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Might be quicker
              </h2>
              <ul className="mt-4 flex flex-col gap-5">
                {SHORTCUTS.map((shortcut) => (
                  <li key={shortcut.href}>
                    <div className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                      >
                        <shortcut.icon className="size-4" />
                      </span>
                      <div>
                        <p className="font-heading text-sm font-semibold text-foreground">
                          {shortcut.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {shortcut.description}
                        </p>
                        <ButtonLink
                          href={shortcut.href}
                          variant="outline"
                          size="sm"
                          className="mt-2.5"
                        >
                          {shortcut.label}
                        </ButtonLink>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Find us elsewhere
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = SOCIAL_ICONS[social.label];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${siteConfig.name} on ${social.label}`}
                        className="flex size-11 items-center justify-center rounded-full bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                      >
                        {Icon ? <Icon className="size-4.5" /> : social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <MessageCircle
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0"
                />
                Our Instagram community is the fastest way to reach us day to
                day.
              </p>
            </div>

            <div className="rounded-2xl bg-script/8 p-5">
              <Heart aria-hidden="true" className="size-5 text-script" />
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Your message stays between us.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                We never share what you write with clinics, partners or anyone
                else.
              </p>
            </div>

            {/*
              TODO(client): a published address adds trust and is required by
              some jurisdictions for commercial email. Confirm what Henry &
              Precious want public before enabling.
            */}
            <div className="hidden">
              <Mail aria-hidden="true" className="size-4" />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
