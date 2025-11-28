import withMDX from '@next/mdx';
import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "root": path.resolve('./'),
      "app": path.resolve('./app')
    };

    return config;
  },
  experimental: {
    mdxRs: true,
    optimizePackageImports: ["@chakra-ui/react"],
  },
  output: "standalone",
};

module.exports = withMDX()(nextConfig);
