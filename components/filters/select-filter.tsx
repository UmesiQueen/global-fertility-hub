"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useId } from "react";
import { cn } from "@/lib/utils";

function SelectFilterControl({
  label,
  paramKey,
  options,
  allLabel,
  className,
}: {
  label: string;
  paramKey: string;
  options: { value: string; label: string }[];
  allLabel: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectId = useId();

  const value = searchParams.get(paramKey) ?? "";

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set(paramKey, next);
    else params.delete(paramKey);
    // Changing a filter always returns to page 1.
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-11 w-full appearance-none rounded-xl border bg-card pr-9 pl-3.5 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none",
          value
            ? "border-primary/50 font-medium text-foreground"
            : "border-border text-muted-foreground",
        )}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

type SelectFilterProps = Parameters<typeof SelectFilterControl>[0];

/** See SortSelect: own Suspense boundary so static pages can prerender. */
export function SelectFilter(props: SelectFilterProps) {
  return (
    <Suspense fallback={<SelectFilterFallback {...props} />}>
      <SelectFilterControl {...props} />
    </Suspense>
  );
}

function SelectFilterFallback({
  label,
  options,
  allLabel,
  className,
}: SelectFilterProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={label}
        defaultValue=""
        className="h-11 w-full appearance-none rounded-xl border border-border bg-card pr-9 pl-3.5 text-sm text-muted-foreground"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}
