import { BookOpen, Building2, CalendarDays, Heart, Users } from "lucide-react";
import Image from "next/image";
import {
  FeatureCard,
  type FeatureCardProps,
} from "@/components/cards/feature-card";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { ScriptAccent } from "@/components/shared/script-accent";
import { TrustChips } from "@/components/shared/trust-chips";
import { cn } from "@/lib/utils";

const HERO_IMAGE = {
  src: "/hero.png",
  alt: "A couple sitting close together on a sofa, foreheads touching, smiling with their eyes closed.",
};

/**
 * Homepage sections 1 and 2.
 *
 * `lg:min-h-screen` rather than `lg:h-screen`: the section is
 * `overflow-hidden`, and at lg the content runs to roughly 840px — a fixed
 * 100vh would clip the feature panel on the very common 768px-tall laptop.
 * min-h keeps the full-viewport feel on tall screens and lets short ones grow.
 */
export function HomeHero() {
  return (
    <section
      className="relative overflow-hidden md:bg-background lg:bg-[#FEF3EE] lg:min-h-screen"
    >
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          sizes="100vw"
          priority
          className="object-contain object-right"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-3/5 bg-linear-to-r from-background via-background/75 to-transparent"
        />
      </div>
      <Container className="relative z-10 pt-12 pb-15 md:pt-16 md:pb-36 lg:pt-24 lg:pb-48">
        <div className="lg:max-w-[55%]">
          <h1 className="font-heading text-[2.125rem] leading-[1.1] font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            Your Fertility Journey.
            <br />
            Our Support.
          </h1>
          <ScriptAccent className="mt-1 block text-4xl md:text-5xl">
            Stronger Together.
          </ScriptAccent>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Trusted education, real stories and a global community here to
            support you through every step.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/resources" size="lg">
              <BookOpen aria-hidden="true" className="size-4" />
              Explore Resources
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              <Users aria-hidden="true" className="size-4" />
              Join the Community
            </ButtonLink>
          </div>
          <div className="relative mt-10 aspect-3/2 w-full overflow-hidden rounded-2xl sm:aspect-2/1 lg:hidden">
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fill
              sizes="100vw"
              priority
              className="object-cover object-right"
            />
          </div>
          <TrustChips className="mt-10" />
        </div>
      </Container>
      <WhatWeOffer />
      <BottomWave />
    </section>
  );
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: BookOpen,
    title: "Educational Resources",
    description:
      "Guides, articles and videos to help you make informed decisions.",
    href: "/resources",
    linkLabel: "Explore Resources",
  },
  {
    icon: Building2,
    title: "Educational Clinic Partners",
    description: "Discover clinics that share our commitment to education.",
    href: "/educational-partners",
    linkLabel: "Browse Partners",
  },
  {
    icon: Heart,
    title: "Community Stories",
    description: "Read real experiences that inspire hope and connection.",
    href: "/stories",
    linkLabel: "Read Stories",
    tone: "script",
  },
  {
    icon: CalendarDays,
    title: "Events & Webinars",
    description: "Join expert-led events and community conversations.",
    href: "/events",
    linkLabel: "View Events",
  },
];

function WhatWeOffer() {
  return (
    <section
      aria-labelledby="what-we-offer"
      className="relative z-10 -mt-5 w-full md:-mt-15 lg:-mt-30 pb-10 lg:pb-0"
    >
      <h2 id="what-we-offer" className="sr-only">
        What you&apos;ll find here
      </h2>
      <Container>
        <div className="grid overflow-hidden rounded-3xl bg-card md:shadow-[0_8px_40px_-12px] shadow-primary/12 ring-1 ring-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.href}
              {...feature}
              className={cn(
                "border-border/70",
                index > 0 && "border-t sm:border-t-0",
                index % 2 === 1 && "sm:border-l",
                index >= 2 && "sm:border-t lg:border-t-0",
                index > 0 && "lg:border-l",
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function BottomWave() {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 z-10 h-0 w-full fill-surface lg:h-24"
    >
      <path d="M0,64L18.5,64C36.9,64,74,64,111,58.7C147.7,53,185,43,222,80C258.5,117,295,203,332,218.7C369.2,235,406,181,443,176C480,171,517,213,554,229.3C590.8,245,628,235,665,240C701.5,245,738,267,775,240C812.3,213,849,139,886,106.7C923.1,75,960,85,997,128C1033.8,171,1071,245,1108,256C1144.6,267,1182,213,1218,176C1255.4,139,1292,117,1329,101.3C1366.2,85,1403,75,1422,69.3L1440,64L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"></path>
    </svg>
  );
}
