import type { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { auth, trustedOrigins } from '@/auth'
import { BadRequestError } from '@/lib/common/errors/request'
import { isAdminUser, isWalletSessionUser } from './admin'

export { isAdminUser, isWalletSessionUser }

export const isTrustedRequestOrigin = (request: NextRequest) => {
  const origin = request.headers.get('origin')
  return origin != null && trustedOrigins.includes(origin)
}

export const noPermission = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user?.id == null || session.user.email == null) {
    return true
  }

  return !session.isAdmin
}

export const requireSignedInUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user?.id == null || session.user.email == null) {
    throw new BadRequestError('Please login first.')
  }

  return session.user
}
