import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
].join("; ");

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // Own repo since the 2026-11-01 split: trace from the app root.
  outputFileTracingRoot: import.meta.dirname,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default withMDX(nextConfig);
