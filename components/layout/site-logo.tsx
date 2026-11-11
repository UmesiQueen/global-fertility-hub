import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * The logo mark is a small static file, never inline SVG with embedded
 * bitmaps. It renders in the header AND footer of every page, so anything
 * inlined here is paid for on every page, every cache write and every
 * prefetch — the old inline version made each page ~2.5 MB.
 *
 * 128px source for a 32px slot (4x for high-density screens). `unoptimized`
 * because it is already tiny: running it through the image optimiser would
 * only spend transformation quota.
 */
export function SiteLogo({
  className,
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80",
        className,
      )}
    >
      {/* Decorative: the site name beside it already names the link. */}
      <Image
        src="/logo.webp"
        alt=""
        width={32}
        height={32}
        unoptimized
        className="size-8 shrink-0"
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-sm md:text-base font-bold text-foreground">
          {siteConfig.name}
        </span>
        {showTagline ? (
          <span className="mt-1 text-[0.625rem] text-muted-foreground">
            {siteConfig.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
