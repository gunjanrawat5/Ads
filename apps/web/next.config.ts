import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ads/core", "@ads/integrations"],
};

export default nextConfig;
