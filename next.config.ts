import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    const shimPath = path.resolve(__dirname, 'src/lib/crypto-shim.ts');
    config.resolve.alias['node:crypto'] = shimPath;
    config.resolve.alias['crypto'] = shimPath;
    return config;
  },
};

export default nextConfig;
