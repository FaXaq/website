const path = require('path')

const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "root": path.resolve('./'),
      "app": path.resolve('./app')
    }

    return config
  }
}

module.exports = withMDX(nextConfig)
