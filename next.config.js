const path = require('path')

const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "root": path.resolve('./'),
      "app": path.resolve('./app')
    }

    return config
  },
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
