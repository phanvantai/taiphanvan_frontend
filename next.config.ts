import type { NextConfig } from "next/dist/server/config";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'source.unsplash.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
      'cdn.pixabay.com',
      'images.pexels.com'
      // Add other common image hosting domains as needed
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
