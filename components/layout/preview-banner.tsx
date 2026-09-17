import { Eye } from "lucide-react";
import { isDraftEnabled } from "@/lib/preview";

export async function PreviewBanner() {
  if (!(await isDraftEnabled())) return null;

  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <Eye aria-hidden="true" className="size-4 shrink-0" />
          <span>
            <strong className="font-medium">Draft preview.</strong> You are
            reading the draft version of this content. Anything you have not
            published yet appears here and nowhere else.
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
