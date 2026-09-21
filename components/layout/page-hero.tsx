import Image from "next/image";
import { heroFadeLeft, heroFadeTopBottom } from "@/lib/hero-fade";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";
import { Container } from "./container";

/**
 * Shared hero for interior pages.
 *
 * When an `image` is supplied it's treated like the homepage hero: from `lg`
 * the photo bleeds in from the right, and below `lg` — where that bleed would
 * crop the subject out of frame — it drops to a contained, rounded image
 * beneath the copy.
 *
 * The bleed layer is sized to the art's own 1672x940 ratio and pinned right,
 * so it lands exactly where `object-contain` would have put the photo. That
 * matters: it means the masks below are measured against the PHOTO rather than
 * against the section, so the fade stays put no matter how tall a given hero
 * ends up. Fading the photo out (rather than laying a surface-coloured
 * gradient over it) also means the edges dissolve into whatever is behind
 * them, including in dark mode.
 *
 * How far the fades reach is set in `lib/hero-fade.ts`.
 */
export function PageHero({
  eyebrow,
  title,
  scriptLine,
  description,
  image,
  children,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  scriptLine?: React.ReactNode;
  description?: string;
  image?: ImageAsset;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("relative overflow-hidden bg-hero-background", className)}
    >
      {image ? (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden aspect-1672/940 w-auto lg:block"
          style={heroFadeTopBottom()}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="object-cover"
            style={heroFadeLeft()}
          />
        </div>
      ) : null}

      <Container className="relative py-12 md:py-16">
        <div className={cn("relative z-10", image && "lg:max-w-[55%]")}>
          {eyebrow ? <div className="mb-3">{eyebrow}</div> : null}

          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>

          {scriptLine ? <div className="mt-1">{scriptLine}</div> : null}

          {description ? (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}

          {image ? (
            <div className="relative mt-7 aspect-3/2 w-full overflow-hidden rounded-2xl sm:aspect-2/1 lg:hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                priority
                className="object-cover object-right"
              />
            </div>
          ) : null}

          {children ? <div className="mt-7">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
