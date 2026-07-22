import type { NextConfig } from 'next'
import { validatePublicEnv } from './config/env/validate-public-env'
import { validateServerEnv } from './config/env/validate-server-env'

validatePublicEnv()
validateServerEnv()

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
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
