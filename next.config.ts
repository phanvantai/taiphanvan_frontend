import type { NextConfig } from "next/dist/server/config";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
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
  },  // Analytics configuration
  experimental: {
    // Enable analytics tracking optimizations
    optimizeCss: true,
  },
  // Content Security Policy for analytics
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;"
          }
        ],
      },
    ]
  },
};

export default nextConfig;
