/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Vercel deployment optimizations
  poweredByHeader: false,
  compress: true,
  
  images: {
    unoptimized: true,
    domains: [
      'media.api-sports.io',
      'crests.football-data.org',
      'localhost',
    ],
  },
  
  // Environment-specific configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  },
  
  // Vercel production settings
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },
};

module.exports = nextConfig;
