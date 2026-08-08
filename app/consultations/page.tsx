import { Heart, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ConsultationBookingForm } from "@/components/forms/consultation-booking-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EntityImage } from "@/components/shared/entity-image";
import { JsonLd } from "@/components/shared/json-ld";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { ScriptAccent } from "@/components/shared/script-accent";
import {
  getAvailability,
  getConsultationFaqs,
  getConsultationTypes,
} from "@/lib/repositories/consultations";
import { breadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Book a Session with Henry & Precious",
  description:
    "Personalised guidance and real support from people who've been there. Our sessions are support and advocacy — we're not doctors and we don't give medical advice.",
  alternates: { canonical: "/consultations" },
};

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Consultations", href: "/consultations" },
];

const TRUST = [
  { icon: Heart, title: "Personal &", subtitle: "Empathetic Support" },
  { icon: Lock, title: "Confidential", subtitle: "& Respectful" },
  { icon: Sparkles, title: "Evidence-informed", subtitle: "Guidance" },
  { icon: ShieldCheck, title: "We've Been", subtitle: "Through It" },
];

const HOW_WE_HELP = [
  "Understand your fertility options",
  "Navigate treatments and decisions",
  "Emotional support and encouragement",
  "Prepare for appointments",
  "Advocacy and second-opinion support",
  "And more — tailored to your journey",
];

/**
 * Consultations.
 *
 * The page most at risk of reading as clinical care, so the framing is stated
 * three times: in the hero, beside the session picker, and in the FAQs. That
 * repetition is deliberate — don't trim it as redundant.
 *
 * No `Service` or `MedicalBusiness` JSON-LD here. Both would present these as
 * clinical services in search results, which is precisely what they are not.
 */
export default async function ConsultationsPage() {
  const [consultationTypes, availability, faqs] = await Promise.all([
    getConsultationTypes(),
    getAvailability(),
    getConsultationFaqs(),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />

      <section className="relative overflow-hidden bg-surface">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] lg:block">
          <EntityImage
            image={{
              src: "",
              alt: "Henry and Precious sitting together at a table, smiling.",
            }}
            sizes="52vw"
            priority
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent"
          />
        </div>

        <Container className="relative z-10 pt-8 pb-12 md:pb-14">
          <Breadcrumbs crumbs={CRUMBS} />

          <div className="mt-6 lg:max-w-[48%]">
            <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-foreground md:text-4xl">
              Book a Session with
            </h1>
            <ScriptAccent className="mt-1 block text-3xl md:text-4xl">
              Henry &amp; Precious
            </ScriptAccent>

            <p className="mt-4 text-base font-medium text-foreground">
              Personalised guidance. Real support. From people who&apos;ve been
              there.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              We&apos;re not doctors — we&apos;re your fertility advocates and
              supporters. We&apos;ve walked this road, and we&apos;re here to
              help you feel informed, empowered and less alone.
            </p>

            <ul className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TRUST.map((item) => (
                <li key={item.subtitle} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary"
                  >
                    <item.icon className="size-4" />
                  </span>
                  <span className="font-heading text-[0.6875rem] leading-tight font-semibold text-foreground">
                    {item.title}
                    <br />
                    {item.subtitle}
                  </span>
                </li>
              ))}
            </ul>

            <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-2xl lg:hidden">
              <EntityImage
                image={{
                  src: "",
                  alt: "Henry and Precious sitting together at a table, smiling.",
                }}
                sizes="100vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-heading text-base font-semibold text-foreground">
              How Our Sessions Can Help
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {HOW_WE_HELP.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-accent/50 p-4">
              <Heart
                aria-hidden="true"
                className="size-5 text-script"
              />
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Every journey is unique.
                <br />
                Every session is personalised.
              </p>
            </div>
          </aside>

          <div>
            <ConsultationBookingForm
              consultationTypes={consultationTypes}
              availability={availability}
              practitionerTimezone={siteConfig.practitionerTimezone}
            />
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-surface p-5">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
            >
              <Mail className="size-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Not sure which session is right for you?
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Send us a message and we&apos;ll help you work it out.
              </p>
            </div>
            <ButtonLink href="/contact" variant="outline" size="sm">
              Send a Message
            </ButtonLink>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-script/8 p-5">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-script/12 text-script"
            >
              <Heart className="size-5" />
            </span>
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                100% Private &amp; Confidential
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your story is safe with us.
              </p>
            </div>
          </div>
        </div>

        <section aria-labelledby="consultation-faqs" className="mt-16">
          <h2
            id="consultation-faqs"
            className="font-heading text-xl font-bold text-foreground md:text-2xl"
          >
            Questions People Often Ask
          </h2>

          <dl className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-heading text-sm font-semibold text-foreground">
                  {faq.question}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <MedicalDisclaimer variant="card" className="mt-12 max-w-3xl">
          Sessions with Henry &amp; Precious are support and advocacy, not
          medical care. They are not doctors, they do not diagnose or treat, and
          nothing shared in a session is medical advice. Please talk to your
          healthcare team about your treatment.
        </MedicalDisclaimer>
      </Container>
    </>
  );
}
