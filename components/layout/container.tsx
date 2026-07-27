import { cn } from "@/lib/utils";

/**
 * The one horizontal rhythm for the whole site. Every page section wraps its
 * content in this so gutters stay consistent at every breakpoint.
 */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-8xl px-5 md:px-15", className)}>
      {children}
    </Tag>
  );
}
