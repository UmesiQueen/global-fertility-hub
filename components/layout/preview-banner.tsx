import { Eye } from "lucide-react";
import { isDraftEnabled } from "@/lib/preview";

/**
 * Shown on every page while draft mode is on.
 *
 * Two jobs: tell whoever is looking that this is unpublished content — a
 * preview link can be forwarded, and a draft story or an unfinished clinic
 * page read as live would be genuinely misleading here — and give them a way
 * back out, since the draft cookie otherwise follows them around the site.
 */
export async function PreviewBanner() {
  if (!(await isDraftEnabled())) return null;

  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <Eye aria-hidden="true" className="size-4 shrink-0" />
          <span>
            <strong className="font-medium">Draft preview.</strong> This page is
            showing unpublished content and is not visible to readers.
          </span>
        </p>

        <a
          href="/api/exit-preview"
          className="shrink-0 self-start rounded-md px-3 py-1.5 font-medium underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background sm:self-auto"
        >
          Exit preview
        </a>
      </div>
    </div>
  );
}
