import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * "Never Miss an Event" subscribe strip.
 *
 * TODO(phase 2): there is no submit handler yet — the form posts nowhere
 * until an email provider is chosen. It's rendered as a real, labelled form
 * so the markup and layout are settled, and wiring it up later is one action
 * rather than a rebuild.
 */
export function NewsletterSignup({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="newsletter-signup"
      className={cn("rounded-3xl bg-surface px-6 py-10 md:px-10", className)}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <span
            aria-hidden="true"
            className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary sm:flex"
          >
            <Mail className="size-5" />
          </span>
          <div>
            <h2
              id="newsletter-signup"
              className="font-heading text-lg font-semibold text-foreground"
            >
              Never Miss an Event
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Subscribe to get notified about new webinars and community events.
            </p>
          </div>
        </div>

        <form className="flex w-full flex-col gap-2.5 sm:flex-row md:w-auto">
          <label htmlFor="newsletter-email" className="sr-only">
            Your email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Your email address"
            className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none sm:w-64"
          />
          <Button type="submit" size="lg" className="shrink-0">
            Subscribe
          </Button>
        </form>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        We&apos;ll only email you about events. Unsubscribe any time.
      </p>
    </section>
  );
}
