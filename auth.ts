import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { siwe } from 'better-auth/plugins'
import { generateNonce } from 'siwe'
import { getAddress, verifyMessage as verifyViemMessage } from 'viem'
import { prisma } from '@/db'

const siteUrl = process.env.SITE_URL
const domain = siteUrl !== undefined && siteUrl !== '' ? new URL(siteUrl).host : 'localhost:3000'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  trustedOrigins: siteUrl !== undefined && siteUrl !== '' ? [siteUrl] : ['http://localhost:3000'],
  plugins: [
    siwe({
      domain,
      getNonce: async () => {
        return await generateNonce()
      },
      verifyMessage: async ({ message, signature, address }) => {
        const checksumAddress = getAddress(address)
        return await verifyViemMessage({
          address: checksumAddress,
          message,
          signature: signature as `0x${string}`,
        })
      },
    }),
  ],
})
