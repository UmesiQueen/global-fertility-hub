import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;
