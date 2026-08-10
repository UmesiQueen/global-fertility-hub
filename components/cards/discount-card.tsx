"use client";

import { ArrowRight, Check, Copy, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Discount } from "@/types";

/**
 * A partner offer.
 *
 * Client component only because of the copy-to-clipboard button. Codes get
 * mistyped — `GLOBAL10` and `GL0BAL10` look identical in most UI fonts — and
 * a failed code at checkout usually means a lost sale for the partner and a
 * frustrated member for us.
 */
export function DiscountCard({
  discount,
  className,
}: {
  discount: Discount;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard?.writeText(discount.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 transition-shadow hover:shadow-lg hover:shadow-primary/8",
        className,
      )}
    >
      <span className="absolute top-4 right-4 rounded-lg bg-primary px-2 py-1 font-heading text-[0.6875rem] font-bold text-primary-foreground">
        {discount.percentOff}% OFF
      </span>

      {/* A brand's own wordmark is the recognisable thing, so the fallback is
          the name set in our heading face — not a generic image placeholder. */}
      <div className="flex h-12 items-center pr-16">
        {discount.logo.src ? (
          <Image
            src={discount.logo.src}
            alt={discount.logo.alt}
            width={140}
            height={40}
            className="max-h-10 w-auto object-contain"
          />
        ) : (
          <span className="font-heading text-xl font-bold text-foreground">
            {discount.brand}
          </span>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {discount.description}
      </p>

      {discount.isAffiliate ? (
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted-foreground">
          We may earn a small amount if you use this code.
        </p>
      ) : null}

      <button
        type="button"
        onClick={copyCode}
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-3 font-heading text-sm font-semibold tracking-wide text-primary transition-colors hover:bg-accent/70"
      >
        <Tag aria-hidden="true" className="size-3.5 shrink-0" />
        Code: {discount.code}
        {copied ? (
          <Check aria-hidden="true" className="size-3.5 shrink-0" />
        ) : (
          <Copy aria-hidden="true" className="size-3.5 shrink-0" />
        )}
        <span className="sr-only">
          {copied ? "Copied to clipboard" : `Copy code ${discount.code}`}
        </span>
      </button>

      {/* Announced without stealing focus, so a screen reader user knows the
          copy worked. */}
      <span aria-live="polite" className="sr-only">
        {copied ? `${discount.code} copied to clipboard` : ""}
      </span>

      <a
        href={discount.redeemUrl}
        target="_blank"
        rel="noreferrer noopener sponsored"
        className="mt-2.5 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-accent/40"
      >
        Redeem Offer
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
        <span className="sr-only">at {discount.brand}, opens in a new tab</span>
      </a>
    </article>
  );
}
