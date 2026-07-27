import { Search } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "./container";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SiteLogo } from "./site-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-18">
        <SiteLogo />

        <MainNav />

        <div className="flex items-center gap-1.5">
          <ButtonLink
            href="/resources"
            variant="ghost"
            size="icon-lg"
            aria-label="Search resources"
          >
            <Search className="size-4.5" />
          </ButtonLink>

          <ButtonLink href="/contact" className="hidden sm:inline-flex">
            Join Community
          </ButtonLink>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
