import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        // Country flags for the phone input's country selector.
        // Routed through next/image, so the browser only ever talks to our
        // own /_next/image endpoint — the optimiser fetches and caches these
        // server-side rather than leaking a reader's IP to a third party.
        protocol: "https",
        hostname: "purecatamphetamine.github.io",
        pathname: "/country-flag-icons/**",
      },
      {
        protocol: 'https',
        hostname: '**.graphassets.com',
      },

    ],
  },
};

export default nextConfig;
