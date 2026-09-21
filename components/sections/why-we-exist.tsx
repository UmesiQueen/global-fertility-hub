import { HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EntityImage } from "@/components/shared/entity-image";
import { ScriptAccent } from "@/components/shared/script-accent";
import { cn } from "@/lib/utils";

/**
 * Homepage section 7 — the mission block.
 *
 * Copy here is close to the brief's own language about why the platform
 * exists. It is the clearest statement on the site that this is education and
 * support rather than care, so changes need client sign-off.
 */
const TRUST_INDICATORS = [
  {
    icon: ShieldCheck,
    title: "Educational, not clinical",
    description: "We inform and support. Your care stays with your clinicians.",
  },
  {
    icon: Sparkles,
    title: "Evidence-based information",
    description: "Reviewed content, written in plain English.",
  },
  {
    icon: Users,
    title: "Real stories from real people",
    description: "Shared by a community that has been there.",
  },
  {
    icon: HeartHandshake,
    title: "Always here to support you",
    description: "Wherever you are on your journey.",
  },
];

export function WhyWeExist({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="why-we-exist"
      className={cn("py-16 md:py-20", className)}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl lg:order-last">
            <EntityImage
              image={{
                src: "/store.png",
                alt: "Henry and Precious sitting together at home, smiling.",
              }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2
              id="why-we-exist"
              className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
            >
              Why Global Fertility Hub Exists
            </h2>
            <ScriptAccent className="mt-1 block text-2xl md:text-3xl">
              Our story. Our why.
            </ScriptAccent>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              We&apos;re Henry and Precious, and our own fertility journey
              inspired us to create a place where no one has to feel alone or
              confused.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              After facing loss, uncertainty and many unanswered questions, we
              realised how hard it is to find clear, trustworthy information and
              real support when you need it most.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {TRUST_INDICATORS.map((indicator) => (
                <li key={indicator.title} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                  >
                    <indicator.icon className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-heading text-sm font-semibold text-foreground">
                      {indicator.title}
                    </span>
                    <span className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {indicator.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <ButtonLink href="/about" size="lg" className="mt-8">
              Learn More About Us
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
