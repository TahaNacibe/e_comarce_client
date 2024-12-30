import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  images: {
    remotePatterns: [{
      hostname:"lh3.googleusercontent.com"
    }, {
      hostname:"res.cloudinary.com"
      },]
  }
};

export default nextConfig;
