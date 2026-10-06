"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { RawSearchParams } from "@/lib/search-params";

/**
 * The browser's query string in the same shape Next hands a page's
 * `searchParams` prop, so the listing components and `buildHref` work
 * unchanged whether the params came from the server or the client.
 *
 * Suspends during prerendering — callers must sit inside a <Suspense>.
 */
export function useRawSearchParams(): RawSearchParams {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const params: RawSearchParams = {};
    for (const key of new Set(searchParams.keys())) {
      const values = searchParams.getAll(key);
      params[key] = values.length > 1 ? values : values[0];
    }
    return params;
  }, [searchParams]);
}
