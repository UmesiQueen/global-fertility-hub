import { Gift, Heart, Info, Lock, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { DiscountCard } from "@/components/cards/discount-card";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { JsonLd } from "@/components/shared/json-ld";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { ScriptAccent } from "@/components/shared/script-accent";
import { TrustChips } from "@/components/shared/trust-chips";
import { getDiscounts } from "@/lib/repositories/discounts";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Exclusive Partner Discounts",
  description:
    "Savings on fertility apps, testing, supplements and coaching from brands we've partnered with — exclusive to the Global Fertility Hub community.",
  alternates: { canonical: "/discounts" },
};

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Partner Discounts", href: "/discounts" },
];

const WHY = [
  {
    icon: ShieldCheck,
    title: "Handpicked",
    description:
      "We partner with brands that align with our values and truly support your journey.",
  },
  {
    icon: Lock,
    title: "Exclusive for You",
    description:
      "These offers are only available to our Global Fertility Hub community.",
  },
  {
    icon: Heart,
    title: "We Benefit Too",
    description:
      "Some partners support our mission, which is how we keep our resources free.",
  },
  {
    icon: Gift,
    title: "Save & Support",
    description:
      "Enjoy real savings while supporting a community that supports you.",
  },
];

/**
 * Partner discounts.
 *
 * The commercial disclosure sits above the offers, not below them. Disclosure
 * rules in the US, Australia and the UK all require a material connection to
 * be clear and close to the endorsement — a note underneath the thing someone
 * has already clicked doesn't meet that bar, and this audience deserves better
 * than the minimum anyway.
 *
 * No `Product` or `Offer` JSON-LD: these are third-party offers we neither
 * sell nor control, and marking them up as our products would be wrong.
 */
export default async function DiscountsPage() {
  const discounts = await getDiscounts();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />

      <PageHero
        title="Exclusive"
        scriptLine={<ScriptAccent>Partner Discounts</ScriptAccent>}
        description="Special offers from brands and services we trust. Because your journey matters, we've partnered with people who want to support it."
      >
        <TrustChips
          chips={[
            {
              icon: "shield",
              title: "Exclusive discounts",
              description: "Negotiated for our community",
            },
            {
              icon: "heart",
              title: "Trusted partners",
              description: "Brands we've chosen carefully",
            },
            {
              icon: "globe",
              title: "Made for our community",
              description: "Fertility-focused, not generic",
            },
          ]}
        />
      </PageHero>

      <Container className="py-12 md:py-16">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Our Exclusive Partner Offers
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Save on fertility apps, testing, supplements and more.
          </p>
        </div>

        {/*
          Above the offers on purpose. Someone should know the commercial
          relationship before they click, not after.
        */}
        <div className="mx-auto mt-8 flex max-w-2xl gap-3 rounded-2xl border border-border bg-surface p-4">
          <Info
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              How these partnerships work.
            </span>{" "}
            Some of these brands support Global Fertility Hub, which is how we
            keep our resources free. We only list things we&apos;d be happy to
            recommend to a friend — but none of it is medical advice, and no
            product here is a treatment. Please talk to your healthcare team
            before starting anything new.
          </p>
        </div>

        {discounts.length ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {discounts.map((discount) => (
              <li key={discount.id} className="flex">
                <DiscountCard discount={discount} className="w-full" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-10"
            title="No offers just now"
            description="We're working on some. Subscribe below and we'll let you know as soon as there's something worth having."
          />
        )}

        <section aria-labelledby="why-partners" className="mt-16">
          <h2 id="why-partners" className="sr-only">
            How we choose our partners
          </h2>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                >
                  <item.icon className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 rounded-3xl bg-surface px-6 py-12 text-center md:px-12">
          <Sparkles
            aria-hidden="true"
            className="mx-auto size-6 text-script"
          />
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground md:text-2xl">
            More partners. More savings.
          </h2>
          <ScriptAccent className="mt-1 block text-2xl md:text-3xl">
            More support for your journey.
          </ScriptAccent>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            We&apos;re always adding new partners. Know a brand that belongs
            here? Tell us — our members&apos; suggestions are how we find most
            of them.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/join" size="lg">
              Get Notified of New Offers
            </ButtonLink>
            <ButtonLink
              href="/contact?topic=partnership"
              variant="outline"
              size="lg"
            >
              Suggest a Partner
            </ButtonLink>
          </div>
        </div>

        <NewsletterSignup className="mt-12" />
      </Container>
    </>
  );
}
