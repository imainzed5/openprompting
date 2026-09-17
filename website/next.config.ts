import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(process.env.GITHUB_ACTIONS === 'true'
    ? {
        basePath: '/openprompting',
        assetPrefix: '/openprompting/',
      }
    : {}),
  outputFileTracingRoot: path.join(process.cwd(), '..'),
};

export default nextConfig;
