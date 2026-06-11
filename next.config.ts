import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  experimental: {
    turbo: {
      resolveAlias: {},
    },
  },
};

export default nextConfig;
