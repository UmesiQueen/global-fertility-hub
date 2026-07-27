import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

/**
 * Renders an entity's cover image, or a themed placeholder when there isn't
 * one yet.
 *
 * Content is arriving before photography, and a grid of broken-image icons
 * makes it impossible to judge a layout. The fallback keeps cards looking
 * deliberate; swapping in a real photo is a one-field change in the data.
 *
 * Always used inside a positioned, sized parent — it fills it.
 */
export function EntityImage({
  image,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority,
}: {
  image?: ImageAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (image?.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={image?.alt || "Placeholder image"}
      className={cn(
        "flex size-full items-center justify-center bg-gradient-to-br from-accent via-muted to-secondary",
        className,
      )}
    >
      <ImageIcon aria-hidden="true" className="size-6 text-primary/25" />
    </div>
  );
}
