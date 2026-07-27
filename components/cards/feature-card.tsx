import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  tone?: "primary" | "script";
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
  tone = "primary",
  className,
}: FeatureCardProps) {
  return (
    <div className={cn("group relative flex gap-x-4 p-5 lg:p-6", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105",
          tone === "script"
            ? "bg-script/12 text-script"
            : "bg-accent text-primary",
        )}
      >
        <Icon className="size-5.5" />
      </span>

      <div className="flex flex-col">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1.5 self-start rounded-md text-xs font-semibold text-primary after:absolute after:inset-0 after:content-['']"
        >
          {linkLabel}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
