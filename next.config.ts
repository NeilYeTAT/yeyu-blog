import type { NextConfig } from 'next'
import { parseServerEnv } from './config/env/parse-server-env'

parseServerEnv()

const nextConfig: NextConfig = {
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
    optimizePackageImports: ['simple-icons'],
    turbopackRustReactCompiler: true,
  },
}

export default nextConfig
