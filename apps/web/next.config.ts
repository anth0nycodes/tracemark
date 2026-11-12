import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "programmerneeds.com",
        pathname: "/api/badge/**",
      },
    ],
  },
};

export default nextConfig;
