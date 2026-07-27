import { cn } from "@/lib/utils";

/**
 * The pink handwritten accent lines ("Stronger Together.",
 * "Our story. Our why. Our mission.").
 *
 * Deliberately constrained: script type at rose-on-white does not meet AA at
 * small sizes, so this component enforces a large minimum size and is never
 * to be used for body copy, labels, buttons or nav.
 */
export function ScriptAccent({
  children,
  className,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  return (
    <Tag
      className={cn(
        "font-script text-script text-3xl leading-tight md:text-4xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
