import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds: true,//temporary fix for linting
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
