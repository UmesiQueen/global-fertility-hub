import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { ScriptAccent } from "@/components/shared/script-accent";
import { cn } from "@/lib/utils";

const FADE_OUT_LETTERING = {
  maskImage: "linear-gradient(to right, #000 0%, #000 55%, transparent 72%)",
  WebkitMaskImage:
    "linear-gradient(to right, #000 0%, #000 55%, transparent 72%)",
};

export function JoinCommunity({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="join-community"
      className={cn("pb-4 md:pb-8", className)}
    >
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-hero-background border border-border px-6 py-14 text-center md:px-12 md:py-16">
          <Image
            src="/join.png"
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
            You&apos;re Not Alone
          </h2>
          <ScriptAccent className="mt-1 block text-2xl md:text-3xl">
            Stronger together.
          </ScriptAccent>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Join a community where you can learn, connect, find support and move
            forward with hope — wherever you are on your journey.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/join" size="lg">
              Join Our Community
            </ButtonLink>
            <ButtonLink href="/resources" variant="outline" size="lg">
              Explore Resources
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
