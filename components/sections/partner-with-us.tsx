import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";

const FADE_OUT_LETTERING = {
  maskImage: "linear-gradient(to right, #000 0%, #000 55%, transparent 72%)",
  WebkitMaskImage:
    "linear-gradient(to right, #000 0%, #000 55%, transparent 72%)",
};

export function PartnerWithUs() {
  return (
    <section
      aria-labelledby="partner-with-us"
      className="pt-14 pb-4 md:pt-20 md:pb-8"
    >
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-[#fff6e8] px-6 py-12 text-center md:px-12 md:py-16">
          <Image
            src="/join.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-10 object-cover opacity-40"
            style={FADE_OUT_LETTERING}
          />

          <h2
            id="partner-with-us"
            className="mt-5 font-heading text-2xl font-bold tracking-tight text-balance text-foreground md:text-3xl"
          >
            Partner With Us
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/75">
            Clinics, foundations, organisations and sponsors can help us bring
            fertility education, outreach and community support to more people.
            You can support a specific program and the outcomes it&apos;s
            working towards.
          </p>

          <ButtonLink
            href="/contact?topic=partnership"
            size="lg"
            className="mt-8"
          >
            Make a Partnership Enquiry
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
