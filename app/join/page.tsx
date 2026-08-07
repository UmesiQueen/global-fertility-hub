import { Gift, Heart, Lock, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { JoinCommunityForm } from "@/components/forms/join-community-form";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ScriptAccent } from "@/components/shared/script-accent";
import { getCountries } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Join the Community",
  description:
    "Join a global community of people navigating fertility. Get your member ID, connect on Instagram, and never feel like you're doing this alone.",
  alternates: { canonical: "/join" },
};

const BENEFITS = [
  {
    icon: MessageCircle,
    title: "A community that understands",
    description:
      "Connect with people who know what this is like, without having to explain the basics.",
  },
  {
    icon: Heart,
    title: "Tips & Story times",
    description:
      "Get free tips and listen to real experiences shared by people at every stage of the journey.",
  },
  {
    icon: Gift,
    title: "Exclusive partner discounts",
    description:
      "Savings on fertility apps, testing, supplements and coaching.",
  },
  {
    icon: Lock,
    title: "Private and respectful",
    description:
      "Your details stay with us. We never share them with clinics or partners.",
  },
];

export default function JoinPage() {
  const countries = getCountries();

  return (
    <>
      <PageHero
        title="Join the Community"
        scriptLine={<ScriptAccent>Stronger together.</ScriptAccent>}
        description="Wherever you are on your journey, there's a place for you here. Tell us a little about yourself and we'll get you connected."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="max-w-2xl">
            <JoinCommunityForm countries={countries} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              What you get
            </h2>

            <ul className="mt-4 flex flex-col gap-5">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                  >
                    <benefit.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block font-heading text-sm font-semibold text-foreground">
                      {benefit.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 rounded-xl bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
              Global Fertility Hub is an educational platform, not a clinic.
              Joining the community isn&apos;t medical care, and nothing we
              share is medical advice.
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}
