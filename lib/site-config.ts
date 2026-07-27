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
    "Trusted education, real stories and a global community here to support you through every step of your fertility journey.",
  url: "https://globalfertilityhub.com",
} as const;

/** Primary navigation — order matches the mockups. */
export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Educational Partners", href: "/educational-partners" },
  { label: "Community Stories", href: "/stories" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

/** Secondary routes reachable from the footer and in-page CTAs. */
export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Educational Partners", href: "/educational-partners" },
      { label: "Community Stories", href: "/stories" },
      { label: "Events & Webinars", href: "/events" },
      { label: "Partner Discounts", href: "/discounts" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Meet Henry & Precious", href: "/about#henry-and-precious" },
      { label: "Book a Consultation", href: "/consultations" },
      { label: "Contact", href: "/contact" },
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
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];
