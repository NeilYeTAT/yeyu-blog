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
    // 'lucide-react' is default. https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
    optimizePackageImports: ['simple-icons'],
    turbopackRustReactCompiler: true,
  },
}

export default nextConfig
