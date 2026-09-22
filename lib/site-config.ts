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
  communityUrl: "https://instagram.com/henry_and_precious",
  email: "precious.and.henry@gmail.com",
  practitionerTimezone: "Australia/Perth",
} as const;

/** Primary navigation — order matches the mockups. */
export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Store", href: "/store" },
  { label: "Educational Clinic Partners", href: "/educational-partners" },
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
      { label: "Store", href: "/store" },
      { label: "Educational Partners", href: "/educational-partners" },
      { label: "Community Stories", href: "/stories" },
      { label: "Events & Webinars", href: "/events" },
      { label: "Partner Discounts", href: "/discounts" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Meet Henry & Precious", href: "/about" },
      { label: "Book a Consultation", href: "/consultations" },
      { label: "Join the Community", href: "/join" },
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
  { label: "Instagram", href: "https://instagram.com/henry_and_precious" },
  { label: "Facebook", href: "https://facebook.com/share/1VNyZEvYwP/?mibextid=wwXIfr" },
  { label: "YouTube", href: "https://youtube.com/@henryandprecious" },
  { label: "TikTok", href: "https://tiktok.com/@henry_and_precious" },
];
