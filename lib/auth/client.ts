import { siweClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  plugins: [siweClient()],
})

export const { signIn, signOut, useSession } = authClient
