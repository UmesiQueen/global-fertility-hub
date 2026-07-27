"use client";

import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";

/**
 * Sort control. Same navigate-on-change approach as SelectFilter, but sorting
 * doesn't change the result set, so it keeps the current page rather than
 * resetting to 1.
 */
export function SortSelect({
  options,
  paramKey = "sort",
  label = "Sort by",
}: {
  options: { value: string; label: string }[];
  paramKey?: string;
  label?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectId = useId();

  const value = searchParams.get(paramKey) ?? options[0]?.value ?? "";

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams);
    if (next && next !== options[0]?.value) params.set(paramKey, next);
    else params.delete(paramKey);

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <ArrowUpDown
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
