import type { NextConfig } from 'next';
import path from 'path';
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const nextConfig: NextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
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

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
