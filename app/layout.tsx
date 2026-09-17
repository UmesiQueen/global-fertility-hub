import type { Metadata } from "next";
import { Caveat, Inter, Space_Grotesk } from "next/font/google";
import { PreviewBanner } from "@/components/layout/preview-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipToContent } from "@/components/layout/skip-to-content";
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
  description:
    "Trusted education, real stories and a global community here to support you through every step of your fertility journey.",
  openGraph: {
    type: "website",
    siteName: "Global Fertility Hub",
    locale: "en_AU",
  },
  icons: {
    icon: "/favicon.svg",
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
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        spaceGrotesk.variable,
        caveat.variable,
      )}
    >
      <body className="flex min-h-full flex-col font-sans">
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
