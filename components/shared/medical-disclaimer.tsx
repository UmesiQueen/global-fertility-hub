import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The product's legal posture, made visible.
 *
 * Per the client brief: Global Fertility Hub is not a clinic and does not
 * provide medical advice. This component belongs on the footer, every
 * resource and story detail page, and the consultations page.
 *
 * Do not reword the default copy without client sign-off.
 */
export function MedicalDisclaimer({
  className,
  variant = "inline",
  children,
}: {
  className?: string;
  variant?: "inline" | "card";
  children?: React.ReactNode;
}) {
  const copy = children ?? (
    <>
      Global Fertility Hub is an educational platform, not a clinic. Nothing on
      this site is medical advice. Always speak with a qualified healthcare
      professional about your own care.
    </>
  );

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex gap-3 rounded-xl border border-border bg-muted/60 p-4",
          className,
        )}
      >
        <Info
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
        <p className="text-sm leading-relaxed text-muted-foreground">{copy}</p>
      </div>
    );
  }

  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {copy}
    </p>
  );
}
