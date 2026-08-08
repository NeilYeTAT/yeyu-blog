import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { customSession, siwe } from 'better-auth/plugins'
import { getAddress, verifyMessage as verifyViemMessage } from 'viem'
import { generateSiweNonce } from 'viem/siwe'
import { serverEnv } from '@/config/env/server-env'
import { isAdminUser } from '@/lib/core/auth/admin'
import { prisma } from '@/prisma/instance'

export const trustedOrigins = [serverEnv.SITE_URL]

const domain = new URL(serverEnv.SITE_URL).host

const socialProviders = {
  github: {
    clientId: serverEnv.GITHUB_CLIENT_ID,
    clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
  },
  google: {
    clientId: serverEnv.GOOGLE_CLIENT_ID,
    clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
  },
}

export const auth = betterAuth({
  baseURL: serverEnv.SITE_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders,
  trustedOrigins,
  plugins: [
    customSession(async ({ user, session }) => ({
      user,
      session,
      isAdmin: isAdminUser(user),
    })),
    siwe({
      domain,
      getNonce: async () => {
        return generateSiweNonce()
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
