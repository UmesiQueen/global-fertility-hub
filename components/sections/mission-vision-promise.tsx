import { Check, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/layout/container";

/**
 * Mission, Vision and Promise.
 *
 * "Our Promise" is the site's values list, and the first item —
 * "Educational, not a clinic" — is the single most important sentence on the
 * page. It is the product's legal posture stated plainly, and it leads the
 * list on purpose. Don't reorder it or soften it without client sign-off.
 */
const PROMISES = [
  "Educational, not a clinic",
  "Evidence-based information",
  "Real stories from real people",
  "A safe, respectful community",
  "Always here to support you",
];

export function MissionVisionPromise() {
  return (
    <section
      aria-labelledby="mission-vision-promise"
      className="bg-surface py-14 md:py-20"
    >
      <Container>
        <h2 id="mission-vision-promise" className="sr-only">
          Our mission, vision and promise
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <article className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary"
            >
              <HeartHandshake className="size-5" />
            </span>
            <div>
              <h3 className="font-heading text-base font-semibold text-primary">
                Our Mission
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To provide trusted fertility education, real stories and global
                support so you can make informed decisions and feel empowered
                through every step of your journey.
              </p>
            </div>
          </article>

          <article className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-script/12 text-script"
            >
              <Users className="size-5" />
            </span>
            <div>
              <h3 className="font-heading text-base font-semibold text-script">
                Our Vision
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To become the world&apos;s most trusted fertility hub —
                connecting, educating and supporting people everywhere on their
                path to parenthood and beyond.
              </p>
            </div>
          </article>

          <article className="flex gap-4 md:col-span-2 lg:col-span-1">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary"
            >
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h3 className="font-heading text-base font-semibold text-primary">
                Our Promise
              </h3>
              <ul className="mt-2 flex flex-col gap-1.5">
                {PROMISES.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-primary"
                    />
                    {promise}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
