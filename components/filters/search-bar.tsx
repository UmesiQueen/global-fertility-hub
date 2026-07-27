"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Search input that writes to the URL.
 *
 * One of the few genuinely client components on these pages: typing needs
 * local state so the field stays responsive, then the value is debounced into
 * the query string.
 *
 * `router.replace` rather than `push` — pushing every keystroke would bury the
 * previous page under a dozen history entries and make Back unusable.
 */
export function SearchBar({
  placeholder = "Search…",
  label,
  paramKey = "search",
  className,
}: {
  placeholder?: string;
  label: string;
  paramKey?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputId = useId();

  const urlValue = searchParams.get(paramKey) ?? "";
  const [value, setValue] = useState(urlValue);

  // Keeps the field in step when the URL changes from elsewhere — a category
  // link, "Clear all", or the back button.
  const lastUrlValue = useRef(urlValue);
  useEffect(() => {
    if (lastUrlValue.current !== urlValue) {
      lastUrlValue.current = urlValue;
      setValue(urlValue);
    }
  }, [urlValue]);

  useEffect(() => {
    if (value === urlValue) return;

    const timeout = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(paramKey, value);
      else next.delete(paramKey);
      // A new search always starts at page 1.
      next.delete("page");

      lastUrlValue.current = value;
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, urlValue, searchParams, pathname, paramKey, router]);

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-card pr-10 pl-10 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X aria-hidden="true" className="size-4" />
          <span className="sr-only">Clear search</span>
        </button>
      ) : null}
    </div>
  );
}
