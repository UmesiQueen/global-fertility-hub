import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ButtonLink({
  href,
  children,
  external,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
} & Omit<React.ComponentProps<typeof Button>, "render" | "children">) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={
        external ? (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {children}
          </a>
        ) : (
          <Link href={href}>{children}</Link>
        )
      }
    />
  );
}
