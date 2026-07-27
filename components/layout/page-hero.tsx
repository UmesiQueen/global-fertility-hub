import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";
import { Container } from "./container";

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
    <section className={cn("relative overflow-hidden bg-surface", className)}>
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

          {children ? <div className="mt-7">{children}</div> : null}
        </div>
      </Container>

      {image ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="42vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-surface via-surface/40 to-transparent" />
        </div>
      ) : null}
    </section>
  );
}
