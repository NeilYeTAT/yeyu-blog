import type { useSession } from './client'
import { isAddress } from 'viem'

// * 0x42e49a294a253f38af8d690d27884d3eb8154444@http://localhost:3000
export const isWalletEmail = (email: string) => {
  const at = email.indexOf('@')
  if (at <= 0) return false
  const local = email.slice(0, at)
  return isAddress(local)
}

export const isWalletLoggedIn = ({
  data: session,
}: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user
  return user != null && isAddress(user.name) && isWalletEmail(user.email)
}

export const isEmailLoggedIn = ({ data: session }: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user
  return user != null && user.email !== '' && !isWalletEmail(user.email)
}
