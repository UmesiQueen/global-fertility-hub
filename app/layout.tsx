import type { Metadata } from "next";
import { Caveat, Inter, Space_Grotesk } from "next/font/google";
import { PreviewBanner } from "@/components/layout/preview-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://globalfertilityhub.com"),
  title: {
    default: "Global Fertility Hub — Trusted Fertility Education & Support",
    template: "%s · Global Fertility Hub",
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: "Global Fertility Hub",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "scroll-smooth",
        "antialiased",
        inter.variable,
        spaceGrotesk.variable,
        caveat.variable,
      )}
    >
      <body
        className="flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        <SkipToContent />
        <PreviewBanner />
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
