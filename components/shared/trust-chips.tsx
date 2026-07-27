import { Globe, Heart, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustChip {
  icon: "shield" | "heart" | "globe" | "lock";
  title: string;
  description: string;
}

const ICONS = {
  shield: ShieldCheck,
  heart: Heart,
  globe: Globe,
  lock: Lock,
} as const;

export const DEFAULT_TRUST_CHIPS: TrustChip[] = [
  {
    icon: "shield",
    title: "Trusted Education",
    description: "Expert-reviewed information",
  },
  {
    icon: "heart",
    title: "Real Stories",
    description: "From people who understand",
  },
  {
    icon: "globe",
    title: "Global Support",
    description: "A community that cares",
  },
  {
    icon: "lock",
    title: "Private & Safe",
    description: "Your journey, your privacy",
  },
];

export function TrustChips({
  chips = DEFAULT_TRUST_CHIPS,
  className,
}: {
  chips?: TrustChip[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-3",
        className,
      )}
    >
      {chips.map((chip) => {
        const Icon = ICONS[chip.icon];
        return (
          <li key={chip.title} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary"
            >
              <Icon className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="font-heading text-xs font-semibold text-foreground">
                {chip.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {chip.description}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
