import 'server-only'

import { isAddress } from 'viem'
import { serverEnv } from '@/config/env/server-env'

export const isWalletSessionUser = (
  user?: { name?: string | null; email?: string | null } | null,
) => {
  if (user?.email == null || !isAddress(user.name ?? '')) {
    return false
  }

  const at = user.email.indexOf('@')
  return at > 0 && isAddress(user.email.slice(0, at))
}

export const isAdminUser = (user?: { name?: string | null; email?: string | null } | null) => {
  if (user?.email == null) {
    return false
  }

  if (isWalletSessionUser(user) && serverEnv.ADMIN_WALLET_ADDRESS !== undefined) {
    return user.name?.toLowerCase() === serverEnv.ADMIN_WALLET_ADDRESS
  }

  return serverEnv.ADMIN_EMAILS.includes(user.email.toLowerCase())
}
