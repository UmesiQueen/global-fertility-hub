import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { ScriptAccent } from "@/components/shared/script-accent";
import { cn } from "@/lib/utils";

/**
 * Homepage section 8 — the closing call to action.
 *
 * TODO(client): "Join Community" points at /contact until we know what it
 * actually means — an email list, an external group, or on-platform accounts.
 * That answer decides whether auth enters phase 1, so it's deliberately a
 * single link to change rather than a form built on a guess.
 */
export function JoinCommunity({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="join-community"
      className={cn("pb-4 md:pb-8", className)}
    >
      <Container>
        <div className="rounded-3xl bg-surface px-6 py-14 text-center md:px-12 md:py-16">
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
            <ButtonLink href="/contact" size="lg">
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
