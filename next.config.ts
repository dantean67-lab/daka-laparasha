import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content files (content/**) are read by the server at runtime on Vercel
  // (the homepage re-generates hourly), so they must be bundled with every route.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
