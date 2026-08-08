import type { auth } from '@/auth'
import { customSessionClient, siweClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>(), siweClient()],
})

export const { signIn, signOut, useSession } = authClient
