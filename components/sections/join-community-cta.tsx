import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { cn } from "@/lib/utils";

const FADE_OUT_LETTERING = {
  maskImage: "linear-gradient(to right, #000 0%, #000 55%, transparent 72%)",
  WebkitMaskImage:
    "linear-gradient(to right, #000 0%, #000 55%, transparent 72%)",
};

export function JoinCommunityCTA({
  className,
  title,
  description,
  ctaButton,
}: {
  className?: string;
  title?: string;
  description?: string;
  ctaButton?: {
    href: string;
    label: string;
  };
}) {
  return (
    <section
      aria-labelledby="join-community"
      className={cn("pb-4 md:pb-8", className)}
    >
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#fff6e8] border border-border px-6 py-14 text-center md:px-12 md:py-16">
          <Image
            src="/join.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-10 object-cover opacity-[0.4]"
            style={FADE_OUT_LETTERING}
          />

          <h2
            id="join-community"
            className="font-heading text-2xl font-bold tracking-tight text-balance text-foreground md:text-3xl"
          >
            {title ?? "You're Not Alone"}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-foreground/75">
            {description ??
              "Join a community where you can learn, connect, find support and move forward with hope — wherever you are on your journey."}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {ctaButton ? (
              <ButtonLink
                key={`${ctaButton.href}-${ctaButton.label}`}
                href={ctaButton.href}
                size="lg"
              >
                {ctaButton.label}
              </ButtonLink>
            ) : (
              <ButtonLink href="/join" size="lg">
                Join Our Community
              </ButtonLink>
            )}
            <ButtonLink href="/consultations" variant="outline" size="lg">
              Schedule a Call
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
