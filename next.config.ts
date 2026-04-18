import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@hookform/resolvers', 'lucide-react'],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Link',
          value: '<http://localhost:3001>; rel=preconnect',
        },
      ],
    },
  ],
};

export default nextConfig;
