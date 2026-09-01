import type { NextConfig } from 'next'
import { parseServerEnv } from './config/env/parse-server-env'

parseServerEnv()

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/zh',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/zh/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/zh/blog/:slug',
        permanent: true,
      },
      {
        source: '/friends',
        destination: '/zh/friends',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  reactStrictMode: false,
  reactCompiler: true,
  experimental: {
    // 'lucide-react' is default. https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
    turbopackRustReactCompiler: true,
  },
}

export default nextConfig
