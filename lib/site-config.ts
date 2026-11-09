/**
 * Single source of truth for site chrome: nav, footer columns, socials.
 * Adding a route means adding it here, not editing header/footer markup.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "Global Fertility Hub",
  tagline: "Learn. Connect. Feel Supported.",
  description:
    "Reliable fertility information, compassionate support and a global community, so money, language, culture or location never stand between you and the help you need.",
  url: "https://globalfertilityhub.org",
  communityUrl: "https://instagram.com/henry_and_precious",
  email: "admin@globalfertilityhub.org",
  practitionerTimezone: "Australia/Perth",
  bookingUrl: "https://calendly.com/precious-and-henry/20min",
} as const;

/** A heading that opens a dropdown (desktop) or collapsible section (mobile). */
export interface NavGroup {
  label: string;
  items: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "items" in item;
}

/**
 * Primary navigation. Plain links sit on the header row; groups open a
 * dropdown. Keep the row to about seven entries — it has to fit at 1024px
 * next to the logo and the Join Community button.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Explore",
    items: [
      { label: "Collections", href: "/collections" },
      { label: "Clinic Directory", href: "/clinic-directory" },
      { label: "Events & Webinars", href: "/events" },
      { label: "Store", href: "/store" },
    ],
  },
  { label: "Programs", href: "/programs" },
  {
    label: "Community",
    items: [
      { label: "Community Stories", href: "/stories" },
      { label: "Join the Community", href: "/join" },
      { label: "Schedule a Call", href: "/consultations" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Secondary routes reachable from the footer and in-page CTAs. */
export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Collections", href: "/collections" },
      { label: "Community Stories", href: "/stories" },
      { label: "Clinic Directory", href: "/clinic-directory" },
      { label: "News", href: "/news" },
      { label: "Programs", href: "/programs" },
      { label: "Store", href: "/store" },
      { label: "Events & Webinars", href: "/events" },
      { label: "Partner Discounts", href: "/discounts" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Meet Henry & Precious", href: "/about" },
      { label: "Schedule a Call", href: "/consultations" },
      { label: "Join the Community", href: "/join" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Medical Disclaimer", href: "/disclaimer" },
    ],
  },
];

export const socialLinks: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://instagram.com/henry_and_precious" },
  { label: "Facebook", href: "https://facebook.com/share/1VNyZEvYwP/?mibextid=wwXIfr" },
  { label: "YouTube", href: "https://youtube.com/@henryandprecious" },
  { label: "TikTok", href: "https://tiktok.com/@henry_and_precious" },
];
