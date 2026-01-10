import type { NextConfig } from "next";

/**
 * next.config.ts
 * ---------------------------------------------------------
 * This file customizes how Next.js behaves at build/runtime.
 * Right now, you're using it to explicitly allow images from
 * Discord's CDN — required when using <Image /> with external
 * domains, due to Next.js security restrictions.
 * ---------------------------------------------------------
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow Discord avatars like:
        // https://cdn.discordapp.com/avatars/.../....
        protocol: "https",
        hostname: "cdn.discordapp.com",
        // path: "/**" is allowed here if you ever want to restrict or expand
      },
    ],
  },
};

export default nextConfig;

