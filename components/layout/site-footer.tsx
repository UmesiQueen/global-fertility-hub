import Link from "next/link";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/shared/social-icons";
import { footerNav, siteConfig, socialLinks } from "@/lib/site-config";
import { Container } from "./container";
import { SiteLogo } from "./site-logo";

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <SiteLogo showTagline />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>

            <ul className="mt-6 flex items-center gap-1">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${siteConfig.name} on ${social.label}`}
                      className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                      {Icon ? <Icon className="size-4.5" /> : social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                {column.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="-mx-2 flex min-h-9 items-center rounded-md px-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <MedicalDisclaimer className="max-w-3xl" />
          <p className="mt-4 text-xs text-muted-foreground">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
