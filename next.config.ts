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
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
    turbopackRustReactCompiler: true,
  },
}

export default nextConfig
