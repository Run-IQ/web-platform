import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['node:crypto'] = path.resolve(
      __dirname,
      'src/lib/crypto-shim.ts'
    );
    return config;
  },
};

export default nextConfig;
