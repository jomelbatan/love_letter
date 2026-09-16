import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    process.env.NEXT_PUBLIC_VERCEL_DEV_ORIGIN,
    process.env.NEXT_PUBLIC_CLOUDFLARE_TUNNEL_ORIGIN,
  ].filter((origin): origin is string => Boolean(origin)),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nautical-rabbit-786.eu-west-1.convex.cloud",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
